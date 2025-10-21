/**
 * Validates Australian postcodes
 * @param postcode - The postcode string to validate
 * @returns true if valid, false otherwise
 */
export function validatePostcode(postcode: string): boolean {
	if (!postcode) return false

	// Remove any whitespace
	const cleaned = postcode.trim()

	// Must be exactly 4 digits
	if (!/^\d{4}$/.test(cleaned)) return false

	// Convert to number for range checking
	const code = parseInt(cleaned, 10)

	// Australian postcode ranges
	// NSW: 1000-1999, 2000-2599, 2619-2899, 2921-2999
	// ACT: 0200-0299, 2600-2618, 2900-2920
	// VIC: 3000-3999, 8000-8999
	// QLD: 4000-4999, 9000-9999
	// SA: 5000-5999
	// WA: 6000-6797, 6800-6999
	// TAS: 7000-7999
	// NT: 0800-0899, 0900-0999

	return (
		(code >= 200 && code <= 299) || // ACT
		(code >= 800 && code <= 899) || // NT
		(code >= 900 && code <= 999) || // NT
		(code >= 1000 && code <= 1999) || // NSW
		(code >= 2000 && code <= 2599) || // NSW
		(code >= 2600 && code <= 2618) || // ACT
		(code >= 2619 && code <= 2899) || // NSW
		(code >= 2900 && code <= 2920) || // ACT
		(code >= 2921 && code <= 2999) || // NSW
		(code >= 3000 && code <= 3999) || // VIC
		(code >= 4000 && code <= 4999) || // QLD
		(code >= 5000 && code <= 5999) || // SA
		(code >= 6000 && code <= 6797) || // WA
		(code >= 6800 && code <= 6999) || // WA
		(code >= 7000 && code <= 7999) || // TAS
		(code >= 8000 && code <= 8999) || // VIC
		(code >= 9000 && code <= 9999) // QLD
	)
}
