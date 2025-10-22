import type { RequestHandler } from './$types'
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '$env/static/private'
import { error, json } from '@sveltejs/kit'
import { isValidDonationAmount } from '$lib/config/donations'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-09-30.clover'
})

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const { user } = await locals.safeGetSession()

	const body = await request.json()
	const { amount, donorInfo } = body

	// Validate amount
	if (!isValidDonationAmount(amount)) {
		throw error(400, 'Invalid donation amount')
	}

	// Validate required donor info
	if (!donorInfo.email || !donorInfo.firstName || !donorInfo.lastName) {
		throw error(400, 'Missing required donor information')
	}

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'aud',
						product_data: {
							name: 'Donation to FairGo For Australians',
							description: `Thank you for supporting our mission`
						},
						unit_amount: amount * 100
					},
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `${url.origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url.origin}/donate`,
			...(user?.id && { client_reference_id: user.id }), // Only include if user exists
			metadata: {
				payment_type: 'donation',
				donor_email: donorInfo.email,
				donor_first_name: donorInfo.firstName,
				donor_last_name: donorInfo.lastName,
				donor_phone: donorInfo.phone || '',
				donor_street_address: donorInfo.streetAddress || '',
				donor_suburb: donorInfo.suburb || '',
				donor_postcode: donorInfo.postcode || ''
			}
		})

		return json({ url: session.url })
	} catch (e) {
		console.error('Stripe checkout creation error:', e)
		throw error(500, 'Failed to create checkout session')
	}
}
