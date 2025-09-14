<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte';
	import type { HeroCarouselItem } from './types';
	import { splitStringToChunks } from '$lib/utils';

	interface Props {
		items: HeroCarouselItem[];
	}

	let { items }: Props = $props();

	$inspect(items);
</script>

<!-- MARKUP -------------------------------------------- -->
<div class="host">
	<div class="media-container">
		<img src={items[0].image_url} alt={items[0].label} />
		<div class="overlay"></div>
	</div>

	<div class="body">
		<div class="primary">
			<h3 class="label">{items[0].label}</h3>
			<h2 class="title">
				{#each splitStringToChunks(items[0].title, 2) as chunk}
					<span>{chunk}</span>
				{/each}
			</h2>
		</div>
		<div class="secondary">
			<button>
				<ArrowLeftIcon />
			</button>

			<div class="body">
				<div class="pip" data-active="true"></div>
				<div class="pip" data-active="false"></div>
			</div>

			<button>
				<ArrowRightIcon />
			</button>
		</div>
	</div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-max);
		width: 100%;
		height: 100%;
		padding: var(--loc-gap);
		position: relative;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: end;
		background-color: var(--clr-dv-tr-light);
		border: var(--bdw) solid var(--clr-dv);
		border-radius: var(--bdr-l);

		/* MEDIA ------------------------------------------------ */
		.media-container {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			/* display: flex; */
			/* justify-content: end; */

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center;
			}

			.overlay {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background-image: linear-gradient(
					to top,
					var(--clr-bg-tr-heavy) 0%,
					var(--clr-bg-tr-invisible) 33% 100%
				);
			}
		}

		/* BODY ------------------------------------------------- */
		& > .body {
			display: flex;
			justify-content: space-between;
			align-items: end;
			z-index: 1;

			/* PRIMARY ---------------------------------------------- */
			& > .primary {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: var(--gap-s);

				/* TEXT ------------------------------------------------- */
				& > .label {
					max-width: fit-content;
					padding: var(--gap-min) var(--gap-s);
					background-color: var(--clr-primary);
					color: var(--clr-bg);
					font-size: var(--fs-4);
					font-weight: 400;
					text-transform: var(--text-case--label);
				}

				& > .title {
					--loc-gap: var(--sp-1);
					padding-left: var(--loc-gap);
					display: flex;
					flex-direction: column;
					font: var(--font--heading--secondary);
					font-size: calc(var(--fs-7) * 2);
					text-transform: uppercase;

					& > span {
						padding: 0 var(--gap-s);
						max-width: fit-content;
						background-color: var(--clr-bg);
						font: inherit;
						font-size: inherit;
						box-shadow: var(--sp-1) var(--sp-1) 0 var(--clr-primary);
						&:nth-child(2) {
							margin-left: var(--loc-gap);
						}
						&:nth-child(3) {
							margin-left: calc(var(--loc-gap) * 2);
						}
					}
				}
			}

			/* SECONDARY -------------------------------------------- */
			& > .secondary {
				flex: 1;
				--loc-size: var(--sp-5);
				height: var(--loc-size);
				display: flex;

				/* BUTTON ----------------------------------------------- */
				& > button {
					--loc-clr-bg: var(--clr-bg-tr-light);
					--loc-clr-ink: var(--clr-bg);
					--loc-transition: var(--t-ix-hover);
					&:hover {
						--loc-clr-bg: var(--clr-bg);
						--loc-clr-ink: var(--clr-primary);
					}
					width: var(--loc-size);
					height: var(--loc-size);
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: var(--loc-clr-bg);
					backdrop-filter: blur(var(--sp-1));
					border-style: none;
					border: var(--bdw) solid var(--clr-bg-tr-heavy);
					border-radius: var(--bdr-s);
					cursor: pointer;
					transition: var(--loc-transition);

					:global(svg) {
						stroke: var(--loc-clr-ink);
						transition: var(--loc-transition);
					}
				}

				/* BODY ------------------------------------------------- */
				& > .body {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					gap: var(--gap-s);

					.pip {
						--loc-size: var(--sp-1);
						--loc-clr-bg: var(--clr-bg-tr-invisible);
						--loc-clr-border: var(--clr-bg);
						&[data-active='true'] {
							--loc-clr-bg: var(--clr-bg);
						}
						width: var(--loc-size);
						height: var(--loc-size);
						background-color: var(--loc-clr-bg);
						border: var(--bdw) solid var(--loc-clr-border);
						border-radius: var(--loc-size);
					}
				}
			}
		}
	}
</style>
