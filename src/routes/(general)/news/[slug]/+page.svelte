<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import { getMediaUrl } from '$lib/utils'
	import Chip from '$lib/components/Chip/Chip.svelte'
	import DateLabel from '$lib/components/DateLabel/DateLabel.svelte'
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte'
	import type { PageData } from './$types'
	import HeroTitle from '$lib/components/HeroTitle/HeroTitle.svelte'
	import Breadcrumbs from '$lib/components/Breadcrumbs/Breadcrumbs.svelte'
	import Delin from '$lib/components/Delin/Delin.svelte'

	const { data }: { data: PageData } = $props()
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
		<header>
			<Breadcrumbs
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'News', href: '/news' },
					...(article.category?.[0]
						? [
								{
									label: article.category[0],
									href: `/news?category=${article.category[0]}`
								}
							]
						: []),
					{ label: article.short_title || article.title }
				]}
			/>
			<div class="meta-container">
				{#if article.category && article.category.length > 0}
					<div class="chips-container">
						{#each article.category as cat}
							<Chip label={cat} href="/news?category={cat}" />
						{/each}
					</div>
				{/if}
				<DateLabel date={article.published_at} />
			</div>
		</header>

		<!-- CONTENT -->
		<section id="section--article-introduction">
			<div class="title-wrapper">
				<Delin fontSize="l">
					<h2>{article.short_title}</h2>
				</Delin>
			</div>

			<SvelteMarkdown source={article.snippet} />
		</section>

		<section id="section--article-body">
			<Delin />

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
		--loc-pad--x: 0;
		--loc-ratio: 2.4/1;
		@media screen and (max-width: 1080px) {
			--loc-pad--x: var(--loc-pad);
		}
		@media screen and (max-width: 960px) {
			--loc-ratio: 3/2;
		}
		@media screen and (max-width: 560px) {
			--loc-ratio: 2/3;
		}
		width: 100%;
		aspect-ratio: var(--loc-ratio);
		padding: var(--loc-pad) var(--loc-pad--x);
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

		/* ARTICLE ---------------------------------------------- */
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
				flex-direction: column;
				gap: var(--gap-l);

				.meta-container {
					display: flex;
					justify-content: space-between;
					@media screen and (max-width: 560px) {
						flex-direction: column;
						align-items: center;
						gap: var(--gap-l);
					}

					.chips-container {
						display: flex;
						flex-wrap: wrap;
						gap: var(--gap-s);
					}
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
					top: var(--layout--nav-top--height);
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
				&#section--article-introduction :global(p) {
					font: var(--font--body--l);
					line-height: 200%;
				}
			}
		}
	}
</style>
