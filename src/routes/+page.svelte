<script lang="ts">
	import type { PageProps } from './$types';
	import SectionHero from '$lib/components/SectionHero/SectionHero.svelte';

	// DATA ------------------------------------------------- //
	let { data }: PageProps = $props();
	// $inspect(data);
</script>

<!-- MARKUP -------------------------------------------- -->

<SectionHero heroCarouselItems={data.carouselItems} />

<!-- CSS ----------------------------------------------- -->
<style>
</style>
