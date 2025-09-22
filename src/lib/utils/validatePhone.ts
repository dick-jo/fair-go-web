export function validateAustralianPhone(phone: string): boolean {
	if (!phone) return true // Optional field
	// Australian mobile (04XX XXX XXX) or landline (0X XXXX XXXX) formats
	const phoneRegex = /^(\+61|0)([2-9]\d{8})$/
	return phoneRegex.test(phone.replace(/\s/g, '')) // Remove spaces for validation
}
