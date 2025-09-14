<script lang="ts">
	import HeroCarousel from '../HeroCarousel/HeroCarousel.svelte';
	import type { HeroCarouselItem } from '../HeroCarousel/types';

	interface Props {
		heroCarouselItems: HeroCarouselItem[];
	}

	let { heroCarouselItems }: Props = $props();
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--hero" class="host section-hero">
	<div class="primary">
		<HeroCarousel items={heroCarouselItems} />
	</div>

	<div class="secondary">
		<div class="wrapper"></div>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-host-height: 560px;
		--loc-gap: var(--gap-l);
		height: var(--loc-host-height);
		padding: var(--loc-gap);
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: var(--loc-gap);

		/* PRIMARY ---------------------------------------------- */
		& > .primary {
			--loc-grid-cols: 8;
			grid-column: span var(--loc-grid-cols);
			/* background-color: blue; */
		}

		/* SECONDARY -------------------------------------------- */
		& > .secondary {
			--loc-grid-cols: 4;
			--loc-clr-bg: var(--clr-ev);
			grid-column: span var(--loc-grid-cols);

			/* WRAPPER ---------------------------------------------- */
			.wrapper {
				width: 100%;
				height: 100%;
				background-color: var(--loc-clr-bg);
				border: var(--bdw) solid var(--clr-dv-tr-heavy);
				border-radius: var(--bdr-l);
			}
		}
	}
</style>
