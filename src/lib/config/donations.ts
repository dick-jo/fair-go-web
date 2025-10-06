export const DONATION_AMOUNTS = [50, 100, 150, 200] as const

export type DonationAmount = (typeof DONATION_AMOUNTS)[number]

export function isValidDonationAmount(amount: number): amount is DonationAmount {
	return DONATION_AMOUNTS.includes(amount as DonationAmount)
}
