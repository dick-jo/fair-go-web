<script lang="ts">
	import type { PageData } from './$types'
	import SectionHero from '$lib/components/SectionHero/SectionHero.svelte'
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte'
	import NewsSnippetTile from '$lib/components/NewsSnippetTile/NewsSnippetTile.svelte'
	import { getPolicyIcon } from '$lib/utils/policyIcons'
	import { LandPlotIcon, LightbulbIcon, NewspaperIcon } from '@lucide/svelte'
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte'

	let { data }: { data: PageData } = $props()
</script>

<SectionHero heroCarouselItems={data.carouselItems} />

<!-- NEWS----------------------------------------------- -->
<section id="section--news-snippets-row">
	<div class="section-header">
		<NewspaperIcon />
		<h2 class="title">LATEST UPDATES</h2>
	</div>
	<div class="section-body">
		{#each data.newsArticles as article}
			<div class="item">
				<NewsSnippetTile {article} />
			</div>
		{/each}
	</div>
</section>

<!-- POLICY -------------------------------------------- -->
<section id="section--policy-snippets-row">
	<div class="section-header">
		<LandPlotIcon />
		<h2 class="title">OUR POLICY</h2>
	</div>
	<div class="section-body">
		{#each data.policies as policy}
			<div class="item">
				<ContentSnippetTile
					title={policy.short_title || policy.title}
					content={policy.snippet}
					href={`#policy-${policy.id}`}
					icon={getPolicyIcon(policy.category)}
				/>
			</div>
		{/each}
	</div>
</section>

<!-- CTA------------------------------------------------ -->
<SectionCtaRow />

<!-- PHILOSOPHY----------------------------------------- -->
<section id="section--philosophy-snippets-row">
	<div class="section-header">
		<LightbulbIcon />
		<h2 class="title">OUR PHILOSOPHY</h2>
	</div>
	<div class="section-body">
		{#each data.philosophies as philosophy}
			<div class="item">
				<ContentSnippetTile
					title={philosophy.short_title || philosophy.title}
					content={philosophy.snippet}
					href={`#philosophy-${philosophy.id}`}
					icon={getPolicyIcon(philosophy.category)}
				/>
			</div>
		{/each}
	</div>
</section>

<style>
	#section--news-snippets-row {
		--loc-height: calc(var(--sp-12) * 2);
		.section-body {
			container-type: inline-size;
			min-height: var(--loc-height);
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			& > .item {
				--loc-grid-cols: 4;
				@media screen and (max-width: 1440px) {
					--loc-grid-cols: 6;
				}
				@media screen and (max-width: 960px) {
					--loc-grid-cols: 12;
				}
				grid-column: span var(--loc-grid-cols);
				border-right: var(--bdw) solid var(--clr-dv);
				&:last-child {
					border-right: none;
				}
				@media screen and (max-width: 1440px) {
					&:nth-child(3) {
						display: none;
					}
				}
				@media screen and (max-width: 960px) {
					&:nth-child(2) {
						display: none;
					}
				}
				@media screen and (max-width: 560px) {
					height: fit-content;
				}
			}
		}
	}
	#section--policy-snippets-row,
	#section--philosophy-snippets-row {
		.section-body {
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			& > .item {
				--loc-grid-cols: 4;
				@media screen and (max-width: 720px) {
					--loc-grid-cols: 12;
				}
				grid-column: span var(--loc-grid-cols);
				border-right: var(--bdw) solid var(--clr-dv);
				&:last-child {
					border-right: none;
				}
				@media screen and (max-width: 720px) {
					border-right: none;
					border-bottom: var(--bdw) solid var(--clr-dv);
					&:last-child {
						border-bottom: none;
					}
				}
			}
		}
	}
</style>
