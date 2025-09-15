<script lang="ts">
	import type { PageProps } from './$types';
	import SectionHero from '$lib/components/SectionHero/SectionHero.svelte';

	let { data }: PageProps = $props();
</script>

<SectionHero heroCarouselItems={data.carouselItems} />
