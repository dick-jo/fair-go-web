// donate/success/+page.server.ts
import type { PageServerLoad } from './$types'
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '$env/static/private'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-09-30.clover' as '2025-08-27.basil'
})

export const load: PageServerLoad = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id')

	if (!sessionId) {
		return { amount: null, date: null }
	}

	try {
		// Fetch session from Stripe to get payment details
		const session = await stripe.checkout.sessions.retrieve(sessionId)

		return {
			amount: session.amount_total,
			date: new Date(session.created * 1000).toISOString()
		}
	} catch (error) {
		console.error('Failed to retrieve Stripe session:', error)
		return { amount: null, date: null }
	}
}
