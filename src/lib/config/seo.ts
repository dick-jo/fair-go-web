/**
 * SEO Configuration
 * Site-wide defaults for meta tags and SEO settings
 */

export const seoConfig = {
	// Site identity
	siteName: 'Fair Go',
	siteUrl: 'https://fairgo.org.au',
	locale: 'en_AU',
	themeColor: '#6f0b23',

	// Default meta tags (used as fallbacks)
	defaultTitle: 'Fair Go - A Political Movement for All Australians',
	defaultDescription:
		'Join Fair Go in building a fairer Australia. Explore our policies on housing, healthcare, climate, and social justice.',

	// Default images
	defaultOgImage: '/og-default.png',
	logo: '/logo.png',

	// Social media handles (optional - add when you have them)
	twitter: {
		handle: '', // e.g., '@FairGoAU'
		cardType: 'summary_large_image' as const
	}
} as const

export type SEOConfig = typeof seoConfig
