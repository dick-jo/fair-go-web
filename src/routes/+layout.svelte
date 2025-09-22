<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'
	import '$lib/style/system.tokens.css'
	import '$lib/style/main.css'
	import '$lib/style/typography.css'
	import NavTop from '$lib/components/NavTop/NavTop.svelte'
	import Footer from '$lib/components/Footer/Footer.svelte'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'
	import Toaster from '$lib/services/toaster/Toaster.svelte'

	let { data, children } = $props()
	let { session, supabase, user } = $derived(data)
	// $inspect(session)
	// $inspect(supabase)
	// $inspect(user)
	// $inspect({ session, supabase, user })

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
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

<NavTop {session} {user} {supabase} />
<main>
	{@render children?.()}
</main>
<Footer {supabase} />
