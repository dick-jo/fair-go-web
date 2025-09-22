<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js'
	import BrandDelin from '../BrandDelin/BrandDelin.svelte'
	import FormSignUp from '../Forms/FormSignUp/FormSignUp.svelte'
	import HeroCarousel from '../HeroCarousel/HeroCarousel.svelte'
	import type { HeroCarouselItem } from '../HeroCarousel/types'

	interface Props {
		supabase: SupabaseClient
		heroCarouselItems: HeroCarouselItem[]
	}

	let { supabase, heroCarouselItems }: Props = $props()
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--hero" class="host section-hero">
	<div class="primary">
		<HeroCarousel items={heroCarouselItems} />
	</div>

	<div class="secondary">
		<div class="wrapper">
			<div class="title-container">
				<h2 class="title--sub">It's Time You Had a Fair Go</h2>
				<h1 class="title">We're fighting for a better, fairer go for real people just like you.</h1>
			</div>

			<p class="text--body">
				If you — like millions of other Australians failed by the major parties — are looking for a real alternative,
				Fair Go is for you. Lend us your support by signing up today.
			</p>

			<BrandDelin />

			<div class="form-container">
				<FormSignUp {supabase} source="hero_signup" />
			</div>
		</div>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-host-height: 640px;
		--loc-gap: var(--gap-l);

		@media screen and (max-width: 1200px) {
			--loc-host-height: fit-content;
		}
		height: var(--loc-host-height);
		display: grid;
		grid-template-columns: repeat(12, 1fr);

		/* PRIMARY ---------------------------------------------- */
		& > .primary {
			--loc-height: auto;
			--loc-grid-cols: 8;
			@media screen and (max-width: 1200px) {
				--loc-height: 400px;
				--loc-grid-cols: 12;
			}
			height: var(--loc-height);
			grid-column: span var(--loc-grid-cols);
		}

		/* SECONDARY -------------------------------------------- */
		& > .secondary {
			--loc-grid-cols: 4;
			--loc-clr-bg: var(--clr-ev);
			@media screen and (max-width: 1200px) {
				--loc-grid-cols: 12;
			}
			grid-column: span var(--loc-grid-cols);

			/* WRAPPER ---------------------------------------------- */
			.wrapper {
				--loc-height: 100%;
				container-type: inline-size;
				height: var(--loc-height);
				padding: var(--loc-gap);
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--loc-gap);
				background-color: var(--loc-clr-bg);
				/* border: var(--bdw) solid var(--clr-dv-tr-heavy); */
				/* border-radius: var(--bdr-l); */
				text-align: center;

				/* TITLES ----------------------------------------------- */
				.title-container {
					display: flex;
					flex-direction: column;

					.title--sub {
						/* color: var(--clr-ink-tr-heavy-x); */
						font: var(--font--heading--secondary);
						font-weight: bold;
						text-transform: var(--text-case--heading);
					}

					.title {
						display: none;
						color: var(--clr-ink);
						font: var(--font--heading--s);
						/* font-weight: 800; */
					}
				}

				/* TEXT: Body ------------------------------------------- */
				.text--body {
					/* flex: 1; */
					font: var(--font--body--s);
				}

				.form-container {
					container-type: inline-size;
					width: 100%;
				}
			}
		}
	}
</style>
