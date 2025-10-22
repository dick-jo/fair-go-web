import type { RequestHandler } from './$types'
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY, ENABLE_TEST_PRICING } from '$env/static/private'
import { error, json } from '@sveltejs/kit'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-09-30.clover' as '2025-08-27.basil'
})

// Test pricing: $1 for all tiers
const TEST_TIERS = {
	supporter: 100, // $1
	advocate: 100, // $1
	partisan: 100, // $1
	champion: 100, // $1
	visionary: 100 // $1
} as const

// Production pricing
const PROD_TIERS = {
	supporter: 5000, // $50
	advocate: 10000, // $100
	partisan: 15000, // $150
	champion: 20000, // $200
	visionary: 25000 // $250
} as const

const ALLOWED_TIERS = ENABLE_TEST_PRICING === 'true' ? TEST_TIERS : PROD_TIERS

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = await locals.safeGetSession()

	// MUST BE SIGNED IN ------------------------------------ //
	if (!user) {
		throw error(401, 'Must be logged in to purchase membership')
	}

	// CHECK FOR EXISTING MEMBERSHIP ------------------------ //
	const { data: profile } = await locals.supabase.from('profiles').select('is_member').eq('id', user.id).single()

	if (profile?.is_member) {
		throw error(400, 'You already have an active membership')
	}

	// PREPARE TRANSACTION ---------------------------------- //
	const { tier, amount, recurring } = await request.json() // Add recurring param

	// Validate tier exists
	if (!ALLOWED_TIERS[tier as keyof typeof ALLOWED_TIERS]) {
		throw error(400, 'Invalid membership tier')
	}

	// Validate amount matches tier
	if (ALLOWED_TIERS[tier as keyof typeof ALLOWED_TIERS] !== amount) {
		throw error(400, 'Amount does not match tier')
	}

	try {
		const checkoutSession = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: recurring ? 'subscription' : 'payment', // Dynamic mode
			// Only set customer_creation for payment mode (subscriptions auto-create customers)
			...(recurring ? {} : { customer_creation: 'always' }),
			line_items: [
				{
					price_data: {
						currency: 'aud',
						product_data: {
							name: `FairGo ${tier.charAt(0).toUpperCase() + tier.slice(1)} Membership`,
							description: recurring ? 'Annual membership (renews automatically)' : 'Annual membership'
						},
						unit_amount: amount,
						...(recurring && { recurring: { interval: 'year' } }) // Add recurring interval
					},
					quantity: 1
				}
			],
			client_reference_id: user.id,
			customer_email: user.email,
			metadata: {
				user_id: user.id,
				payment_type: 'membership',
				membership_tier: tier,
				is_recurring: recurring ? 'true' : 'false'
			},
			success_url: `${request.headers.get('origin')}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${request.headers.get('origin')}/membership`
		})

		return json({ url: checkoutSession.url })
	} catch (e) {
		console.error('Stripe checkout error:', e)
		throw error(500, 'Failed to create checkout session')
	}
}
