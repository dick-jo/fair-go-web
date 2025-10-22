import type { RequestHandler } from './$types'
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '$env/static/private'
import { error, json } from '@sveltejs/kit'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-09-30.clover'
})

export const POST: RequestHandler = async ({ locals }) => {
	const { user } = await locals.safeGetSession()

	if (!user) {
		throw error(401, 'Not authenticated')
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('stripe_membership_subscription_id')
		.eq('id', user.id)
		.single()

	if (!profile?.stripe_membership_subscription_id) {
		throw error(400, 'No active subscription found')
	}

	try {
		// Cancel at period end (user keeps access until paid period expires)
		await stripe.subscriptions.update(profile.stripe_membership_subscription_id, {
			cancel_at_period_end: true
		})

		return json({ message: 'Subscription will cancel at the end of your billing period' })
	} catch (e) {
		console.error('Subscription cancellation error:', e)
		throw error(500, 'Failed to cancel subscription')
	}
}
