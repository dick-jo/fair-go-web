<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import { getMediaUrl } from '$lib/utils'
	import Chip from '$lib/components/Chip/Chip.svelte'
	import DateLabel from '$lib/components/DateLabel/DateLabel.svelte'
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte'
	import type { PageData } from './$types'
	import HeroTitle from '$lib/components/HeroTitle/HeroTitle.svelte'

	let { data }: { data: PageData } = $props()
	const { article } = data
</script>

<!-- HTML ---------------------------------------------- -->
{#if article.featured_image_path}
	<div id="hero-container">
		<div class="title-container">
			<HeroTitle label={article.type} title={article.title} />
		</div>

		<img src={getMediaUrl(article.featured_image_path)} alt={article.featured_image_alt || article.title} />
	</div>
{/if}

<div id="page-clamp">
	<article>
		<!-- <h4 class="type">{article.type}</h4> -->
		<!-- <h1>{article.title}</h1> -->

		<header>
			{#if article.category && article.category.length > 0}
				<div class="chips-container">
					{#each article.category as cat}
						<Chip label={cat} href="/categories/{cat}" />
					{/each}
				</div>
			{/if}
			<DateLabel date={article.published_at} />
		</header>

		<!-- CONTENT -->
		<section id="article--body">
			<SvelteMarkdown source={article.content} />
		</section>
	</article>
</div>

<SectionCtaRow />

<!-- CSS ----------------------------------------------- -->
<style>
	/* HERO ------------------------------------------------- */
	#hero-container {
		--loc-pad: var(--gap-max);
		width: 100%;
		aspect-ratio: 2.4/1;
		padding: var(--gap-max) 0;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: end;

		.title-container {
			width: 100%;
			max-width: var(--clamp--content-width--s);
			position: relative;
			z-index: 2;
		}

		img {
			/* opacity: 0; */
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			z-index: 0;
		}
	}

	/* CLAMP ------------------------------------------------ */
	#page-clamp {
		--loc-gap: var(--gap-max);
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--loc-gap);
		border-bottom: var(--bdw) solid var(--clr-dv);

		article {
			max-width: var(--clamp--content-width--s);
			padding: var(--loc-gap) 0;
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);
			@media screen and (max-width: 1080px) {
				padding: var(--loc-gap);
			}

			/* HEADER ----------------------------------------------- */
			& > header {
				display: flex;
				/* flex-direction: column; */
				justify-content: space-between;
				/* gap: var(--loc-gap); */

				& > .chips-container {
					display: flex;
				}
			}

			/* SECTION ---------------------------------------------- */
			section {
				--loc-gap: var(--gap-l);
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);

				/* TITLE WRAPPER ---------------------------------------- */
				.title-wrapper {
					position: sticky;
					top: 0;
					background-color: var(--clr-bg);
					&::after {
						content: '';
						position: absolute;
						right: 0;
						bottom: calc(var(--loc-gap) * -1);
						left: 0;
						height: var(--loc-gap);
						background-image: linear-gradient(to bottom, var(--clr-bg) 0%, var(--clr-bg-tr-invisible) 100%);
					}
				}

				/* TEXT OVERRIDES --------------------------------------- */
				:global(ol, ul) {
					display: flex;
					flex-direction: column;
					gap: var(--loc-gap);
				}
				:global(p, li) {
					line-height: var(--line-height--body--max);
				}
			}
		}
	}
</style>
