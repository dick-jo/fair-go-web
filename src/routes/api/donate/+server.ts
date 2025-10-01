import type { RequestHandler } from './$types'
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '$env/static/private'
import { error, json } from '@sveltejs/kit'

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-08-27.basil'
})

// Define allowed donation amounts (in cents)
const ALLOWED_AMOUNTS = [1000, 2500, 5000] as const // $10, $25, $50

export const POST: RequestHandler = async ({ request }) => {
	const { amount, recurring } = await request.json()

	// Server-side validation: Critical security check!
	if (!ALLOWED_AMOUNTS.includes(amount)) {
		throw error(400, `Invalid amount. Allowed amounts: ${ALLOWED_AMOUNTS.join(', ')}`)
	}

	// Now we trust the amount and create checkout
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		mode: recurring ? 'subscription' : 'payment',
		line_items: [
			{
				price_data: {
					currency: 'aud',
					product_data: { name: recurring ? 'Monthly Donation' : 'Donation' },
					unit_amount: amount,
					...(recurring && { recurring: { interval: 'month' } })
				},
				quantity: 1
			}
		],
		success_url: `${request.headers.get('origin')}/stripe-test/success`, // Add this
		cancel_url: `${request.headers.get('origin')}/stripe-test` // Add this
	})

	return json({ url: session.url })
}
