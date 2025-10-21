<script lang="ts">
	import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
	import favicon from '$lib/assets/favicon.svg'
	import '$lib/style/system.tokens.css'
	import '$lib/style/main.css'
	import '$lib/style/typography.css'
	import NavTop from '$lib/components/NavTop/NavTop.svelte'
	import Toaster from '$lib/services/toaster/Toaster.svelte'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'
	import Footer from '$lib/components/Footer/Footer.svelte'

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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
<NavTop session={data.session} />
{@render children()}
<Footer />
