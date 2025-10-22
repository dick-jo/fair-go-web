import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '$env/static/private'
import type { PageServerLoad } from '../$types'

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-09-30.clover' })

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession()

	if (!user) {
		return { profile: null, hasActiveSubscription: false, cancelAtPeriodEnd: false }
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('is_member, membership_tier, membership_paid_at, membership_expires_at, stripe_membership_subscription_id')
		.eq('id', user.id)
		.single()

	let cancelAtPeriodEnd = false

	if (profile?.stripe_membership_subscription_id) {
		try {
			const subscription = await stripe.subscriptions.retrieve(profile.stripe_membership_subscription_id)
			cancelAtPeriodEnd = subscription.cancel_at_period_end
		} catch (e) {
			console.error('Failed to fetch subscription:', e)
		}
	}

	return {
		profile: profile || null,
		hasActiveSubscription: !!profile?.stripe_membership_subscription_id,
		cancelAtPeriodEnd
	}
}
