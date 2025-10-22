import { PUBLIC_ENABLE_TEST_PRICING } from '$env/static/public'

// Test pricing: $0.50 minimum (Stripe's minimum for AUD one-time payments)
// Production pricing: $50 minimum
const TEST_AMOUNTS = [1, 50, 100, 150, 200] as const // $1 for testing (50 cents in Stripe = 50, but using $1 for clarity)
const PROD_AMOUNTS = [50, 100, 150, 200] as const

export const DONATION_AMOUNTS = PUBLIC_ENABLE_TEST_PRICING === 'true' ? TEST_AMOUNTS : PROD_AMOUNTS

export type DonationAmount = (typeof DONATION_AMOUNTS)[number]

export function isValidDonationAmount(amount: number): amount is DonationAmount {
	return DONATION_AMOUNTS.includes(amount as DonationAmount)
}
