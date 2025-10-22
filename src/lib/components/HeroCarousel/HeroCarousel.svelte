<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte'
	import { getMediaUrl, splitStringToChunks } from '$lib/utils'
	import { blur, fly } from 'svelte/transition'
	import { HERO_CAROUSEL_T_TRANSITION, HERO_CAROUSEL_T_IDLE } from './constants'
	import type { Tables } from '$lib/types/supabase.types'

	interface Props {
		items: Array<Tables<'carousel_items'>>
	}

	const { items }: Props = $props()

	// STATE ------------------------------------------------ //
	let activeItemIndex = $state<number>(0)
	let isTransitioning = $state<boolean>(false)
	let isPaused = $state<boolean>(false)
	let pendingItemIndex: number | null = null
	let timeoutId: ReturnType<typeof setTimeout> | null = null

	// API -------------------------------------------------- //
	function next() {
		if (isTransitioning) return
		pendingItemIndex = (activeItemIndex + 1) % items.length
		isTransitioning = true
		clearAutoAdvance() // Reset timer on manual navigation
	}

	function prev() {
		if (isTransitioning) return
		pendingItemIndex = (activeItemIndex - 1 + items.length) % items.length
		isTransitioning = true
		clearAutoAdvance() // Reset timer on manual navigation
	}

	function goto(i: number) {
		if (isTransitioning || i === activeItemIndex) return
		pendingItemIndex = i
		isTransitioning = true
		clearAutoAdvance() // Reset timer on manual navigation
	}

	function handleOutroEnd() {
		if (pendingItemIndex !== null) {
			activeItemIndex = pendingItemIndex
			pendingItemIndex = null
		}
		isTransitioning = false
	}

	function clearAutoAdvance() {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = null
		}
	}

	function startAutoAdvance() {
		clearAutoAdvance()
		timeoutId = setTimeout(() => {
			if (!isPaused && !isTransitioning) {
				next()
			}
		}, HERO_CAROUSEL_T_IDLE)
	}

	function handleVisibilityChange() {
		if (document.visibilityState === 'hidden') {
			clearAutoAdvance()
		} else if (!isPaused && !isTransitioning) {
			startAutoAdvance()
		}
	}

	$effect(() => {
		if (!isPaused && !isTransitioning) {
			startAutoAdvance()
		}
		return () => {
			clearAutoAdvance()
		}
	})

	$effect(() => {
		if (typeof window === 'undefined') return

		window.addEventListener('visibilitychange', handleVisibilityChange)

		return () => {
			window.removeEventListener('visibilitychange', handleVisibilityChange)
		}
	})
</script>

<div
	class="host"
	role="region"
	aria-label="Hero carousel"
	onmouseenter={() => (isPaused = true)}
	onmouseleave={() => {
		isPaused = false
		if (!isTransitioning) startAutoAdvance()
	}}
>
	<div class="media-container">
		{#if !isTransitioning}
			<img
				src={getMediaUrl(items[activeItemIndex].image_path)}
				alt={items[activeItemIndex].image_alt ?? items[activeItemIndex].label}
				transition:blur={{ duration: HERO_CAROUSEL_T_TRANSITION }}
				onoutroend={handleOutroEnd}
			/>
		{/if}
		<div class="overlay"></div>
	</div>

	<div class="body">
		{#if !isTransitioning}
			<a href={items[activeItemIndex].href} class="primary">
				<h3 class="label" transition:fly={{ x: -100, duration: HERO_CAROUSEL_T_TRANSITION }}>
					{items[activeItemIndex].label}
				</h3>
				<h2 class="title" transition:fly={{ x: -200, duration: HERO_CAROUSEL_T_TRANSITION }}>
					{#each splitStringToChunks(items[activeItemIndex].title, 2) as chunk}
						<span>{chunk}</span>
					{/each}
				</h2>
			</a>
		{/if}

		<div class="secondary">
			<button onclick={prev}>
				<ArrowLeftIcon />
			</button>

			<div class="body">
				{#each items as _, i}
					<button
						class="pip--wrapper"
						aria-label="carousel navigation"
						data-active={i === activeItemIndex}
						onclick={() => goto(i)}
					>
						<div class="pip"></div>
					</button>
				{/each}
			</div>

			<button onclick={next}>
				<ArrowRightIcon />
			</button>
		</div>
	</div>
</div>

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
		background-color: var(--clr-dv);
		background-image: url('/brand/brand-a-mono-dv-heavy-text-subtract-opacity-perc-25.svg');
		background-size: 33%;
		background-repeat: no-repeat;
		background-position: center center;
		/* border: var(--bdw) solid var(--clr-dv); */
		/* border-radius: var(--bdr-l); */

		/* MEDIA ------------------------------------------------ */
		.media-container {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: top;
				@media screen and (max-width: 720px) {
					object-position: center;
				}
			}

			.overlay {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background-image: linear-gradient(to top, var(--clr-bg-tr-heavy) 0%, var(--clr-bg-tr-invisible) 33% 100%);
			}
		}

		/* BODY ------------------------------------------------- */
		& > .body {
			display: flex;
			justify-content: space-between;
			align-items: end;
			z-index: 1;
			@media screen and (max-width: 720px) {
				flex-direction: column;
				gap: var(--loc-gap);
				justify-content: start;
				align-items: stretch;
			}

			/* PRIMARY ---------------------------------------------- */
			& > .primary {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: var(--gap-s);
				text-decoration: none;
				color: inherit;

				/* TEXT ------------------------------------------------- */
				& > .label {
					max-width: fit-content;
					padding: var(--gap-min) var(--gap-s);
					background-color: var(--clr-primary);
					color: var(--clr-bg);
					font: var(--font--heading--secondary--s);
					text-transform: var(--text-case--label);
				}

				& > .title {
					--loc-gap: var(--sp-1);
					padding-left: var(--loc-gap);
					display: flex;
					flex-direction: column;
					font: var(--font--heading--secondary--l);
					text-transform: uppercase;

					& > span {
						padding: var(--gap-min) var(--gap-s);
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

					/* PIPS ------------------------------------------------- */
					.pip--wrapper {
						--loc-size: var(--sp-3);
						--loc-size--inner: var(--sp-1);
						--loc-clr-bg: var(--clr-bg-tr-invisible);
						--loc-clr-border: var(--clr-bg);
						--loc-transition: var(--t-ix-hover);
						&[data-active='true'] {
							--loc-clr-bg: var(--clr-bg);
						}
						&:hover {
							--loc-size--inner: calc(var(--sp-1) + var(--sp-min));
							--loc-clr-bg: var(--clr-primary);
							--loc-clr-border: var(--clr-primary);
						}
						width: var(--loc-size);
						height: var(--loc-size);
						display: flex;
						justify-content: center;
						align-items: center;
						border-style: none;
						background-color: transparent;
						cursor: pointer;
						transition: var(--loc-transition);
					}

					.pip {
						width: var(--loc-size--inner);
						height: var(--loc-size--inner);
						background-color: var(--loc-clr-bg);
						border: var(--bdw) solid var(--loc-clr-border);
						border-radius: var(--loc-size);
						transition: var(--loc-transition);
					}
				}
			}
		}
	}
</style>
