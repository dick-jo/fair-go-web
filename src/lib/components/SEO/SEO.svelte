<script lang="ts">
	import { page } from '$app/state'
	import { seoConfig } from '$lib/config/seo'

	interface ArticleMeta {
		publishedTime?: string
		modifiedTime?: string
		author?: string
		section?: string
		tags?: string[]
	}

	interface Props {
		// Primary SEO
		title?: string
		description?: string
		image?: string

		// Per-page overrides
		type?: 'website' | 'article'
		noindex?: boolean

		// Article-specific metadata
		article?: ArticleMeta

		// Advanced (rarely needed)
		canonical?: string
		ogTitle?: string
		ogDescription?: string
	}

	let {
		title,
		description,
		image,
		type = 'website',
		noindex = false,
		article,
		canonical,
		ogTitle,
		ogDescription
	}: Props = $props()

	// Computed values with fallbacks
	const pageTitle = $derived(title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle)
	const pageDescription = $derived(description || seoConfig.defaultDescription)
	const pageImage = $derived(
		image
			? image.startsWith('http')
				? image
				: `${seoConfig.siteUrl}${image}`
			: `${seoConfig.siteUrl}${seoConfig.defaultOgImage}`
	)
	const pageUrl = $derived(canonical || `${seoConfig.siteUrl}${page.url.pathname}`)
	const pageOgTitle = $derived(ogTitle || title || seoConfig.defaultTitle)
	const pageOgDescription = $derived(ogDescription || description || seoConfig.defaultDescription)
	const robotsContent = $derived(noindex ? 'noindex, nofollow' : 'index, follow')

	// JSON-LD structured data for articles
	const articleSchema = $derived(
		type === 'article' && article
			? JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Article',
					headline: title,
					description: pageDescription,
					image: pageImage,
					datePublished: article.publishedTime,
					dateModified: article.modifiedTime || article.publishedTime,
					author: article.author
						? {
								'@type': 'Person',
								name: article.author
							}
						: undefined,
					publisher: {
						'@type': 'Organization',
						name: seoConfig.siteName,
						logo: {
							'@type': 'ImageObject',
							url: `${seoConfig.siteUrl}${seoConfig.logo}`
						}
					}
				})
			: null
	)
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{pageTitle}</title>
	<meta name="title" content={pageTitle} />
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />

	<!-- Robots -->
	<meta name="robots" content={robotsContent} />

	<!-- Theme Color (brand color for mobile browsers) -->
	<meta name="theme-color" content={seoConfig.themeColor} />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="msapplication-TileColor" content={seoConfig.themeColor} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:title" content={pageOgTitle} />
	<meta property="og:description" content={pageOgDescription} />
	<meta property="og:image" content={pageImage} />
	<meta property="og:site_name" content={seoConfig.siteName} />
	<meta property="og:locale" content={seoConfig.locale} />

	<!-- Article-specific Open Graph tags -->
	{#if type === 'article' && article}
		{#if article.publishedTime}
			<meta property="article:published_time" content={article.publishedTime} />
		{/if}
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		{#if article.author}
			<meta property="article:author" content={article.author} />
		{/if}
		{#if article.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#if article.tags}
			{#each article.tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content={seoConfig.twitter.cardType} />
	<meta name="twitter:url" content={pageUrl} />
	<meta name="twitter:title" content={pageOgTitle} />
	<meta name="twitter:description" content={pageOgDescription} />
	<meta name="twitter:image" content={pageImage} />
	{#if seoConfig.twitter.handle}
		<meta name="twitter:site" content={seoConfig.twitter.handle} />
	{/if}

	<!-- JSON-LD Structured Data for Articles -->
	{#if articleSchema}
		{@html `<script type="application/ld+json">${articleSchema}</script>`}
	{/if}
</svelte:head>
