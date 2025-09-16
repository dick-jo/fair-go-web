<script lang="ts">
	import AuthorDateRow from '../AuthorDateRow/AuthorDateRow.svelte';
	import { getMediaUrl, truncateText } from '$lib/utils';
	import type { NewsArticle } from '$lib/types';

	// Character limit constant
	const SNIPPET_MAX_LENGTH = 180;

	interface Props {
		article: NewsArticle;
		variant?: 'default' | 'large-image';
	}

	let { article, variant = 'default' }: Props = $props();

	// Format the published date
	const formattedDate = new Date(article.published_at).toLocaleDateString('en-AU', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	// Truncate the snippet
	const displaySnippet = truncateText(article.snippet, SNIPPET_MAX_LENGTH);
</script>

<!-- MARKUP -------------------------------------------- -->
<a href="/news/{article.slug}" class={['host', 'news-snippet-tile', `variant--${variant}`]}>
	<div class="media-container">
		{#if article.featured_image}
			<img
				src={getMediaUrl(article.featured_image)}
				alt={article.featured_image.alt || article.title}
			/>
		{/if}
	</div>
	<div class="body">
		<h3 class="title">{article.title}</h3>
		<p class="content">
			{displaySnippet}
		</p>
		<AuthorDateRow
			authorName={article.author.name}
			authorImageUrl={article.author.avatar_media
				? getMediaUrl(article.author.avatar_media)
				: undefined}
			date={formattedDate}
		/>
	</div>
</a>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-s);
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
		gap: var(--loc-gap);
		background-color: var(--loc-clr-bg);
		transition: var(--loc-transition);
		@container (max-width: 400px) {
			flex-direction: column;
		}

		/* MEDIA CONTAINER -------------------------------------- */
		.media-container {
			--loc-flex: 2;
			.host.variant--large-image & {
				--loc-flex: 1;
			}
			flex: var(--loc-flex);
			height: 100%;
			overflow: hidden;
			background-color: var(--clr-dv);
			border: var(--bdw) solid var(--clr-dv-heavy-tr-light);
			border-radius: var(--bdr-s);
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
			--loc-flex: 3;
			.host.variant--large-image & {
				--loc-flex: 1;
			}
			flex: var(--loc-flex);
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);

			.title {
				font: var(--font--heading--s);
			}

			.content {
				flex: 1;
				color: var(--loc-clr-ink--light);
				font: var(--font--body);
				font-size: var(--fs-2);
			}
		}
	}
</style>
