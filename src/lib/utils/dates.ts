export const formatDateAustralian = (dateString: string) =>
	new Date(dateString).toLocaleDateString('en-AU', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
