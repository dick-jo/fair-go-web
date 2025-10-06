<script lang="ts">
	import NewsSnippetTile from '$lib/components/NewsSnippetTile/NewsSnippetTile.svelte'
	import Chip from '$lib/components/Chip/Chip.svelte'
	import { NewspaperIcon } from '@lucide/svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const titleText = data.selectedCategory
		? `${data.selectedCategory.charAt(0).toUpperCase() + data.selectedCategory.slice(1)} News`
		: 'News & Updates'
</script>

<!-- HTML ---------------------------------------------- -->
<section id="section--news" class="host">
	<div class="section-header section-header--grid">
		<div class="title-container">
			<NewspaperIcon />
			<h1 class="text text--title">{titleText}</h1>
		</div>
		<p>
			Welcome to FairGo news & updates—your source for the latest on our fight for fairness. Get the latest from a
			movement shaking up the majors’ grip, driven by real people.
		</p>

		<p>
			Dive into FairGo headlines for fresh stories of change, accountability, and community strength. Stay in the loop
			as we challenge the old guard with bold, no-nonsense action.
		</p>
	</div>

	<!-- BODY ---------------------------------------------- -->
	<div class="body">
		{#each data.articles as article}
			<div class="row">
				<div class="item">
					<NewsSnippetTile
						{article}
						presentation="row"
						chips={article.category?.map((cat) => ({
							label: cat
						})) ?? []}
					/>
				</div>
			</div>
		{/each}
	</div>

	<!-- FOOTER -------------------------------------------- -->
	{#if data.allCategories.length > 0}
		<footer>
			<div class="clamp">
				<h4 class="text--title">Browse by Category:</h4>
				<div class="chips-container">
					{#each data.allCategories as cat}
						<Chip label={cat} href="/news?category={cat}" />
					{/each}
				</div>
			</div>
		</footer>
	{/if}
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	#section--news.host {
		/* BODY ------------------------------------------------- */
		& > .body {
			display: flex;
			flex-direction: column;

			/* ROW -------------------------------------------------- */
			& > .row {
				display: flex;
				justify-content: center;
				border-bottom: var(--bdw) solid var(--clr-dv);

				/* ITEM ------------------------------------------------- */
				& > .item {
					width: 100%;
					max-width: var(--clamp--content-width--s);
					max-height: calc(var(--sp-12) * 3);
				}
			}
		}

		/* FOOTER ----------------------------------------------- */
		footer {
			padding: var(--sp-9);
			width: 100%;
			display: flex;
			justify-content: center;

			& > .clamp {
				max-width: var(--clamp--content-width--s);
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--loc-gap);

				.text--title {
					text-transform: var(--text-case--heading--secondary);
				}

				.chips-container {
					display: flex;
					flex-wrap: wrap;
					gap: var(--gap-s);
				}
			}
		}
	}
</style>
