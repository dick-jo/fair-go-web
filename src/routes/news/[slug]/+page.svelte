<script lang="ts">
	import AuthorDateRow from '$lib/components/AuthorDateRow/AuthorDateRow.svelte';
	import { splitStringToChunks, getMediaUrl } from '$lib/utils';
	import { processMarkdown } from '$lib/utils/markdown';
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import type { PageProps } from './$types';
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte';

	let { data }: PageProps = $props();

	const { article } = data;

	// Format the published date
	const formattedDate = new Date(article.published_at).toLocaleDateString('en-AU', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	// Process markdown content
	const htmlContent = processMarkdown(article.content);
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--news-article">
	<div id="hero">
		<div class="media-container">
			{#if article.featured_image}
				<img
					src={getMediaUrl(article.featured_image)}
					alt={article.featured_image.alt || article.title}
				/>
			{/if}
			<div class="overlay"></div>
		</div>
		<div class="body">
			<h2 class="title--secondary">Fair Go News</h2>
			<h1 class="title">
				{#each splitStringToChunks(article.title, 3) as chunk}
					<span>{chunk}</span>
				{/each}
			</h1>
		</div>
	</div>
	<div class="section-body">
		<AuthorDateRow
			authorName={article.author.name}
			authorImageUrl={article.author.avatar_media
				? getMediaUrl(article.author.avatar_media)
				: undefined}
			date={formattedDate}
		/>

		<!-- This is where the markdown gets rendered -->
		<div class="prose-content">
			<SvelteMarkdown source={article.content} />
		</div>
	</div>
</section>

<!-- CTA ----------------------------------------------- -->
<SectionCtaRow />

<!-- CSS ----------------------------------------------- -->
<style>
	#section--news-article {
		align-items: center;
		/* HERO ------------------------------------------------- */
		#hero {
			--loc-height: 560px;
			width: 100%;
			height: var(--loc-height);
			padding: var(--gap-max);
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: end;
			background-color: var(--clr-dv);

			/* MEDIA CONTAINER -------------------------------------- */
			.media-container {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					object-position: top;
				}

				.overlay {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					background-image: linear-gradient(
						to top,
						var(--clr-bg) 0%,
						var(--clr-bg-tr-invisible) 33% 100%
					);
				}
			}

			/* BODY ------------------------------------------------- */
			& > .body {
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);
				z-index: 1;

				/* TITLES ----------------------------------------------- */
				.title--secondary {
					padding: var(--gap-min);
					width: fit-content;
					background-color: var(--clr-primary);
					color: var(--clr-bg);
					font: var(--font--heading--secondary);
					text-transform: var(--text-case--heading);
				}

				.title {
					--loc-gap-basis: var(--sp-1);
					display: flex;
					flex-direction: column;
					text-transform: var(--text-case--heading);

					span {
						width: fit-content;
						padding: var(--gap-min) var(--gap-s);
						font: var(--font--heading);
						font-size: var(--fs-12);
						background-color: var(--clr-bg);
						box-shadow: var(--sp-1) var(--sp-1) 0 var(--clr-primary);
						&:nth-child(2) {
							margin-left: var(--loc-gap-basis);
						}
						&:nth-child(3) {
							margin-left: calc(var(--loc-gap-basis) * 2);
						}
						&:nth-child(4) {
							margin-left: calc(var(--loc-gap-basis) * 3);
						}
					}
				}
			}
		}
	}

	/* SECTION BODY ----------------------------------------- */
	.section-body {
		width: 100%;
		max-width: var(--clamp--content-width--s-x);
		padding: var(--gap-max) 0;
		padding-bottom: var(--sp-12);
		display: flex;
		flex-direction: column;
		gap: var(--loc-gap);

		.prose-content {
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);
		}
	}
</style>
