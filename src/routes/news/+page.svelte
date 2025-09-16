<script lang="ts">
	import NewsSnippetTile from '$lib/components/NewsSnippetTile/NewsSnippetTile.svelte';
	import { NewspaperIcon } from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--news">
	<div class="section-header">
		<NewspaperIcon />
		<h2 class="title">NEWS & UPDATES</h2>
	</div>

	<div class="section-body">
		{#each { length: Math.ceil(data.newsArticles.length / 2) } as _, rowIndex}
			<div class="row">
				{#each data.newsArticles.slice(rowIndex * 2, rowIndex * 2 + 2) as article}
					<div class="item">
						<NewsSnippetTile {article} variant="large-image" />
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>

<!-- STYLE --------------------------------------------- -->
<style>
	#section--news {
		.section-body {
			display: flex;
			flex-direction: column;

			/* ROW -------------------------------------------------- */
			.row {
				display: grid;
				grid-template-columns: repeat(12, 1fr);
				border-bottom: var(--bdw) solid var(--clr-dv);

				/* ITEM ------------------------------------------------- */
				.item {
					--loc-grid-cols: 6;
					grid-column: span var(--loc-grid-cols);
					&:first-child {
						border-right: var(--bdw) solid var(--clr-dv);
					}
				}
			}
		}
	}
</style>
