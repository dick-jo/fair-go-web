export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text

	// Find the last space before the limit to avoid cutting words
	const truncated = text.substring(0, maxLength)
	const lastSpace = truncated.lastIndexOf(' ')

	// If we find a space, cut there; otherwise use the hard limit
	const cutPoint = lastSpace > maxLength * 0.8 ? lastSpace : maxLength

	return text.substring(0, cutPoint) + '...'
}
