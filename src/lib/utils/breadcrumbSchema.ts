/**
 * Generate breadcrumb structured data (JSON-LD) for SEO
 * Helps Google display breadcrumb navigation in search results
 */

import { seoConfig } from '$lib/config/seo'

export interface BreadcrumbItem {
	label: string
	href?: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
	const listItems = items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.label,
		...(item.href && { item: `${seoConfig.siteUrl}${item.href}` })
	}))

	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: listItems
	})
}
