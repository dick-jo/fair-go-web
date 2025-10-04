<script lang="ts">
	import { getMediaUrl, truncateText } from '$lib/utils'
	import DateLabel from '$lib/components/DateLabel/DateLabel.svelte'
	import Chip from '$lib/components/Chip/Chip.svelte'
	import type { Tables } from '$lib/types/supabase.types'

	const SNIPPET_MAX_LENGTH = 180

	type NewsArticle = Tables<'news_articles'>

	interface Props {
		article: NewsArticle
		presentation?: 'column' | 'row'
	}

	let { article, presentation = 'column' }: Props = $props()

	const displaySnippet = truncateText(article.snippet, SNIPPET_MAX_LENGTH)
</script>

<!-- HTML----------------------------------------------- -->
<a href="/news/{article.slug}" class={['host', 'news-snippet-tile', `presentation--${presentation}`]}>
	<!-- MEDIA --------------------------------------------- -->
	<div class="media-container">
		{#if article.featured_image_path}
			<img src={getMediaUrl(article.featured_image_path)} alt={article.featured_image_alt || article.title} />
		{/if}
	</div>

	<!-- BODY----------------------------------------------- -->
	<div class="body">
		<div class="primary">
			<div class="title-container">
				<h4 class="text text--sub">{article.type}</h4>
				<h3 class="text text--title">{article.title}</h3>
			</div>
			<p class="text text--body">{displaySnippet}</p>
		</div>

		<div class="secondary">
			{#if article.category && article.category.length > 0}
				<div class="chips-container">
					{#each article.category as cat}
						<Chip href="/categories/{cat}" label={cat} />
					{/each}
				</div>
			{/if}

			<DateLabel date={article.published_at} />
		</div>
	</div>
</a>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-l);
		--loc-clr-bg: var(--clr-ev-tr-invisible);
		--loc-clr-ink: var(--clr-ink);
		--loc-clr-ink--light: var(--clr-ink-tr-heavy-x);
		--loc-transition: var(--t-ix-hover);
		&:hover {
			--loc-clr-bg: var(--clr-ev);
		}
		width: 100%;
		height: 100%;
		padding: var(--loc-gap);
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--loc-gap);
		background-color: var(--loc-clr-bg);
		transition: var(--loc-transition);
		@container (max-width: 400px) {
			flex-direction: column;
		}

		/* MEDIA CONTAINER -------------------------------------- */
		.media-container {
			width: 100%;
			aspect-ratio: 16/9;
			overflow: hidden;
			background-color: var(--clr-dv);
			@container (max-width: 400px) {
				min-height: calc(var(--sp-12) * 2);
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				transition: var(--loc-transition);
				.host:hover & {
					transform: scale(1.125);
				}
			}
		}

		/* BODY ------------------------------------------------- */
		.body {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);

			/* PRIMARY ---------------------------------------------- */
			& > .primary {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);

				& .text {
					&.text--title {
						font: var(--font--heading--s);
					}
					&.text--body {
						color: var(--loc-clr-ink--light);
						font: var(--font--body--s);
					}
					&.text--sub {
						font: var(--font--label--secondary--s);
						text-transform: var(--text-case--label);
					}
				}
				.title-container {
					display: flex;
					flex-direction: column;
					gap: var(--gap-min);
				}
			}

			/* SECONDARY -------------------------------------------- */
			& > .secondary {
				display: flex;
				/* flex-direction: column; */
				justify-content: space-between;
				gap: var(--loc-gap);

				.chips-container {
					display: flex;
					flex-wrap: wrap;
					gap: var(--gap-s);
				}
			}
		}
	}
</style>
