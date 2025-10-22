import type { RequestHandler } from './$types'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import { error } from '@sveltejs/kit'
import type { Database } from '$lib/types/supabase.types'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-09-30.clover' as '2025-08-27.basil' // TypeScript types not yet updated for clover
})

const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text()
	const signature = request.headers.get('stripe-signature')

	if (!signature) {
		throw error(400, 'Missing stripe-signature header')
	}

	let event: Stripe.Event

	try {
		// Verify the webhook signature
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
	} catch (err) {
		console.error('Webhook signature verification failed:', err)
		throw error(400, 'Invalid signature')
	}

	console.log('Received webhook event:', event.type)

	// CHECKOUT: Session Complete (UPDATED - handles both membership and donations)
	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Checkout.Session

		const paymentType = session.metadata?.payment_type
		const userId = session.client_reference_id
		const stripePaymentId = session.payment_intent as string

		// DONATION PAYMENT
		if (paymentType === 'donation') {
			console.log('Donation payment received')
			console.log('User ID:', userId || 'Anonymous')
			console.log('Amount:', session.amount_total)

			const donorMetadata = {
				email: session.metadata?.donor_email,
				firstName: session.metadata?.donor_first_name,
				lastName: session.metadata?.donor_last_name,
				phone: session.metadata?.donor_phone,
				streetAddress: session.metadata?.donor_street_address,
				suburb: session.metadata?.donor_suburb,
				postcode: session.metadata?.donor_postcode
			}

			const { error: transactionError } = await supabaseAdmin.from('transactions').insert({
				user_id: userId || null,
				stripe_payment_id: stripePaymentId,
				transaction_type: 'donation',
				amount: session.amount_total || 0,
				currency: session.currency || 'aud',
				status: 'succeeded',
				donor_metadata: donorMetadata
			})

			if (transactionError) {
				console.error('Failed to insert donation transaction:', transactionError)
			} else {
				console.log('Successfully recorded donation')
			}

			return new Response(null, { status: 200 })
		}

		// MEMBERSHIP PAYMENT (existing logic)
		const tier = session.metadata?.membership_tier
		const isRecurring = session.metadata?.is_recurring === 'true'
		const stripeCustomerId = session.customer as string
		const stripeSubscriptionId = session.subscription as string | null

		console.log('Payment succeeded for user:', userId)
		console.log('Membership tier:', tier)
		console.log('Recurring:', isRecurring)

		if (!userId || !tier) {
			console.error('Missing userId or tier in webhook metadata')
			return new Response(null, { status: 200 })
		}

		const now = new Date()
		const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

		const { error: profileError } = await supabaseAdmin
			.from('profiles')
			.update({
				is_member: true,
				membership_tier: tier,
				membership_paid_at: now.toISOString(),
				membership_expires_at: expiresAt.toISOString(),
				stripe_customer_id: stripeCustomerId,
				...(stripeSubscriptionId && { stripe_membership_subscription_id: stripeSubscriptionId })
			})
			.eq('id', userId)

		if (profileError) {
			console.error('Failed to update profile:', profileError)
		} else {
			console.log('Successfully updated profile for user:', userId)
		}

		// Insert transaction for initial payment (both one-time and recurring)
		// Note: invoice.paid handles RENEWAL payments for subscriptions
		const { error: transactionError} = await supabaseAdmin.from('transactions').insert({
			user_id: userId,
			stripe_payment_id: stripePaymentId,
			...(stripeSubscriptionId && { stripe_subscription_id: stripeSubscriptionId }),
			transaction_type: 'membership',
			amount: session.amount_total || 0,
			currency: 'aud',
			status: 'succeeded'
		})

		if (transactionError) {
			console.error('Failed to insert transaction:', transactionError)
		} else {
			console.log('Successfully recorded transaction')
		}
	}

	// INVOICE: Payment Succeeded (handles both invoice.paid and invoice.payment_succeeded)
	if (event.type === 'invoice.payment_succeeded' || event.type === 'invoice.paid') {
		const invoice = event.data.object as Stripe.Invoice

		// TypeScript types incomplete - subscription exists at runtime
		const subscriptionId = (invoice as any).subscription as string
		const invoiceId = invoice.id as string
		const customerId = invoice.customer as string

		console.log('Invoice paid for subscription:', subscriptionId)
		console.log('Customer ID:', customerId)

		if (!subscriptionId) {
			console.error('No subscription ID found in invoice')
			return new Response(null, { status: 200 })
		}

		// Try finding by subscription_id first
		let profile = await supabaseAdmin
			.from('profiles')
			.select('id, membership_tier')
			.eq('stripe_membership_subscription_id', subscriptionId)
			.single()

		// If not found, try by customer_id (handles first payment race condition)
		if (!profile.data) {
			profile = await supabaseAdmin
				.from('profiles')
				.select('id, membership_tier')
				.eq('stripe_customer_id', customerId)
				.single()
		}

		if (!profile.data) {
			console.error('Could not find profile for subscription:', subscriptionId)
			return new Response(null, { status: 200 })
		}

		// Rest of the handler (update expiry, insert transaction)
		const now = new Date()
		const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

		await supabaseAdmin
			.from('profiles')
			.update({
				membership_paid_at: now.toISOString(),
				membership_expires_at: expiresAt.toISOString()
			})
			.eq('id', profile.data.id)

		const { error: transactionError } = await supabaseAdmin.from('transactions').insert({
			user_id: profile.data.id,
			stripe_payment_id: invoiceId,
			stripe_subscription_id: subscriptionId,
			transaction_type: 'membership',
			amount: invoice.amount_paid,
			currency: invoice.currency,
			status: 'succeeded'
		})

		if (transactionError) {
			console.error('Failed to insert transaction from invoice:', transactionError)
		} else {
			console.log('Successfully recorded subscription payment')
		}
	}

	// SUBSCRIPTION: Cancelled/Deleted ---------------------- //
	if (event.type === 'customer.subscription.deleted') {
		const subscription = event.data.object as Stripe.Subscription

		console.log('Subscription deleted:', subscription.id)

		const { error: updateError } = await supabaseAdmin
			.from('profiles')
			.update({
				is_member: false,
				stripe_membership_subscription_id: null
			})
			.eq('stripe_membership_subscription_id', subscription.id)

		if (updateError) {
			console.error('Failed to update profile after subscription deletion:', updateError)
		} else {
			console.log('Successfully deactivated membership')
		}
	}

	return new Response(null, { status: 200 })
}
