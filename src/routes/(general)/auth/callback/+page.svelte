<!-- auth/callback/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	onMount(() => {
		// Get the next URL from query params, default to /private
		const next = page.url.searchParams.get('next') || '/private'

		// Give Supabase time to process the token and set cookies
		setTimeout(() => {
			goto(next)
		}, 100)
	})
</script>

<div class="host">
	<h1>Completing sign in...</h1>
</div>

<style>
	.host {
		padding: var(--gap-max);
	}
</style>
