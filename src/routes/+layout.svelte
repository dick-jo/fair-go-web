<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/style/system.tokens.css';
	import '$lib/style/main.css';
	import '$lib/style/typography.css';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import NavTop from '$lib/components/NavTop/NavTop.svelte';

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
