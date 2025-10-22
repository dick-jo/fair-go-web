<script lang="ts">
	import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
	import '$lib/style/system.tokens.css'
	import '$lib/style/main.css'
	import '$lib/style/typography.css'
	import NavTop from '$lib/components/NavTop/NavTop.svelte'
	import Toaster from '$lib/services/toaster/Toaster.svelte'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'
	import Footer from '$lib/components/Footer/Footer.svelte'
	import { seoConfig } from '$lib/config/seo'

	const { data, children } = $props()
	const { session, supabase } = $derived(data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})
		return () => data.subscription.unsubscribe()
	})

	// Organization structured data (JSON-LD)
	const organizationSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'PoliticalParty',
		name: seoConfig.siteName,
		url: seoConfig.siteUrl,
		logo: `${seoConfig.siteUrl}${seoConfig.logo}`,
		sameAs: [
			// Add your social media URLs here when available
			// 'https://twitter.com/fairgoau',
			// 'https://facebook.com/fairgoau',
		]
	})

	// Website structured data with search action
	const websiteSchema = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: seoConfig.siteName,
		url: seoConfig.siteUrl,
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`
			},
			'query-input': 'required name=search_term_string'
		}
	})
</script>

<svelte:head>
	<!-- Organization Structured Data -->
	{@html `<script type="application/ld+json">${organizationSchema}</script>`}
	{@html `<script type="application/ld+json">${websiteSchema}</script>`}
</svelte:head>

<Toaster />
<NavTop session={data.session} />
{@render children()}
<Footer />
