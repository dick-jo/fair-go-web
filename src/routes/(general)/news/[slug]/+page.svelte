<script lang="ts">
	import AuthorDateRow from '$lib/components/AuthorDateRow/AuthorDateRow.svelte'
	import { splitStringToChunks, getMediaUrl } from '$lib/utils'
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import type { PageData } from './$types'
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte'

	let { data }: { data: PageData } = $props()

	const { article } = data

	// Format the published date
	const formattedDate = new Date(article.published_at).toLocaleDateString('en-AU', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})

	//
	const MOCK = `
# Heading 1 
# Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
## Heading 2
## Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
### Heading
### 3 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
#### Heading 4
#### Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
##### Heading 5
##### Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
###### Heading 6
###### Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat

This is a paragraph with **bold text**, *italic text*, and ~~strikethrough text~~. Here's some [link](https://example.com). Furthermore, let's make this a little longer such that there are a number of lines to wrap around. This will help ensure we are appropriately addressing auxiliary concerns such as line-height, among other pressing issues and concerns.

> This is a blockquote with **bold** and *italic* text.

- Unordered list item 1
- Item 2
  - Nested item
  - Another nested item
    - Nested
    - Nested again
* Item 3 (alternative unordered list syntax)

1. Ordered list item 1
2. Item 2
   1. Nested ordered item
   2. Another nested item
`
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--news-article">
	<div id="hero">
		<div class="media-container">
			{#if article.featured_image}
				<img src={getMediaUrl(article.featured_image)} alt={article.featured_image.alt || article.title} />
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
			authorImageUrl={article.author.avatar_media ? getMediaUrl(article.author.avatar_media) : undefined}
			date={formattedDate}
		/>

		<!-- This is where the markdown gets rendered -->
		<div class="prose-content">
			<SvelteMarkdown source={MOCK} />
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
					background-image: linear-gradient(to top, var(--clr-bg) 0%, var(--clr-bg-tr-invisible) 33% 100%);
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
					font: var(--font--heading--secondary--s);
					text-transform: var(--text-case--heading);
				}

				.title {
					--loc-gap-basis: var(--sp-1);
					display: flex;
					flex-direction: column;
					text-transform: var(--text-case--heading);

					span {
						width: fit-content;
						padding: var(--gap-l) var(--gap-l);
						font: var(--font--heading--secondary--l);
						font-size: calc(var(--fs-9) * 2);
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
