<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/style/system.tokens.css';
	import '$lib/style/main.css';
	import '$lib/style/typography.css';
	import NavTop from '$lib/components/NavTop/NavTop.svelte';
	import Footer from '$lib/components/Footer/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavTop />

<main>
	{@render children?.()}
</main>

<Footer />
