<script lang="ts">
	import BrandDelin from '../BrandDelin/BrandDelin.svelte';
	import FormSignUp from '../FormSignUp/FormSignUp.svelte';
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
		<div class="wrapper">
			<div class="title-container">
				<h2 class="title--sub">It's Time You Had a Fair Go</h2>
				<h1 class="title">We're fighting for a better, fairer go for real people just like you.</h1>
			</div>

			<BrandDelin />

			<p class="text--body">
				If you — like millions of other Australians failed by the major parties — are looking for a real alternative,
				Fair Go is for you. Lend us your support by signing up today.
			</p>

			<div class="form-container">
				<FormSignUp />
			</div>
		</div>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-host-height: 640px;
		--loc-gap: var(--gap-l);
		--loc-host-gradient: linear-gradient(to right, var(--clr-bg) 0% 50%, var(--clr-bg-tr-invisible) 100%);
		@media screen and (max-width: 1200px) {
			--loc-host-height: fit-content;
			--loc-host-gradient: linear-gradient(to bottom, var(--clr-bg) 0%, var(--clr-bg-tr-invisible) 100%);
		}
		height: var(--loc-host-height);
		padding: var(--loc-gap);
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: var(--loc-gap);
		background-image: var(--loc-host-gradient), url('/brand/brand-a-pattern-mono-dv-text-subtract.svg');
		background-position:
			top left,
			top right;
		background-size: auto, 8vw;
		@media screen and (min-width: 1920px) {
			background-size: auto, 4vw;
		}
		@media screen and (max-width: 1200px) {
			background-size: auto, 15vw;
		}

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
				border: var(--bdw) solid var(--clr-dv-tr-heavy);
				border-radius: var(--bdr-l);
				text-align: center;

				/* TITLES ----------------------------------------------- */
				.title-container {
					display: flex;
					flex-direction: column;

					.title--sub {
						color: var(--clr-ink-tr-heavy-x);
						font: var(--font--heading--secondary);
						text-transform: var(--text-case--heading);
					}

					.title {
						color: var(--clr-ink);
						font: var(--font--heading);
						font-weight: 800;
					}
				}

				/* TEXT: Body ------------------------------------------- */
				.text--body {
					flex: 1;
					font: var(--font--body--secondary);
				}

				/* FORM CONTAINER --------------------------------------- */
				.form-container {
					width: 100%;

					:global(form .row) {
						@media screen and (min-width: 1200px) {
							flex-direction: column;
						}
						@media screen and (max-width: 400px) {
							flex-direction: column;
						}
					}
				}
			}
		}
	}
</style>
