<script lang="ts">
	import type { PageData } from './$types'
	import SectionHero from '$lib/components/SectionHero/SectionHero.svelte'
	import NewsSnippetTile from '$lib/components/NewsSnippetTile/NewsSnippetTile.svelte'
	import { HeartHandshakeIcon, LandPlotIcon, NewspaperIcon, ShieldXIcon, TargetIcon } from '@lucide/svelte'
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte'
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte'
	import { getPolicyIcon } from '$lib/utils'
	import Button from '$lib/components/Button/Button.svelte'
	import SEO from '$lib/components/SEO/SEO.svelte'

	const { data }: { data: PageData } = $props()
</script>

<SEO
	title="A Political Movement for All Australians"
	description="Join Fair Go in building a fairer Australia. Explore our policies on housing, healthcare, climate, and social justice. Become a member today."
/>

<SectionHero heroCarouselItems={data.carouselItems} />

<!-- NEWS ---------------------------------------------- -->
<!-- <section id="section--news-snippets-row"> -->
<!-- 	<div class="section-header section-header--flex"> -->
<!-- 		<div class="title-container"> -->
<!-- 			<NewspaperIcon /> -->
<!-- 			<h2 class="text text--title">LATEST UPDATES</h2> -->
<!-- 		</div> -->
<!---->
<!-- 		<a href="/news"> -->
<!-- 			<Button label="More News & Updates" intent="secondary" /> -->
<!-- 		</a> -->
<!-- 	</div> -->
<!---->
<!-- 	<div class="section-body"> -->
<!-- 		{#each data.newsArticles as article} -->
<!-- 			<div class="item"> -->
<!-- 				<NewsSnippetTile -->
<!-- 					{article} -->
<!-- 					chips={article.category?.map((cat) => ({ -->
<!-- 						label: cat -->
<!-- 					})) ?? []} -->
<!-- 				/> -->
<!-- 			</div> -->
<!-- 		{/each} -->
<!-- 	</div> -->
<!-- </section> -->

<!-- POLICY -------------------------------------------- -->
<section id="section--policy-snippets-row">
	<div class="section-header section-header--flex">
		<div class="title-container">
			<LandPlotIcon />
			<h2 class="text text--title">OUR POLICIES</h2>
		</div>

		<a href="/our-plan/policy">
			<Button label="Explore Policies" intent="secondary" />
		</a>
	</div>

	<div class="section-body">
		{#each data.policies as policy}
			<div class="item">
				<ContentSnippetTile
					title={policy.short_title || policy.title}
					content={policy.snippet}
					href={`/our-plan/policy/${policy.slug}`}
					icon={getPolicyIcon(policy.category)}
				/>
			</div>
		{/each}
	</div>
</section>

<!-- CTA------------------------------------------------ -->
<SectionCtaRow />

<!-- VALUES -->
<section id="section--values-snippets-row">
	<div class="section-header section-header--flex">
		<div class="title-container">
			<HeartHandshakeIcon />
			<h2 class="text text--title">OUR VALUES</h2>
		</div>
		<a href="/our-plan/philosophy">
			<Button label="Explore Our Values" intent="secondary" />
		</a>
	</div>
	<div class="section-body">
		{#each data.values as item}
			<div class="item">
				<ContentSnippetTile
					title={item.title}
					content={item.content}
					icon={getPolicyIcon(item.category ? [item.category] : null)}
					href="/our-plan/philosophy"
				/>
			</div>
		{/each}
	</div>
</section>

<!-- OBJECTIVES -->
<section id="section--objectives-snippets-row">
	<div class="section-header section-header--flex">
		<div class="title-container">
			<TargetIcon />
			<h2 class="text text--title">OUR OBJECTIVES</h2>
		</div>
		<a href="/our-plan/philosophy">
			<Button label="Explore Our Objectives" intent="secondary" />
		</a>
	</div>
	<div class="section-body">
		{#each data.objectives as item}
			<div class="item">
				<ContentSnippetTile
					title={item.title}
					content={item.content}
					icon={getPolicyIcon(item.category ? [item.category] : null)}
					href="/our-plan/philosophy"
				/>
			</div>
		{/each}
	</div>
</section>

<!-- OPPOSITIONS -->
<section id="section--oppositions-snippets-row">
	<div class="section-header section-header--flex">
		<div class="title-container">
			<ShieldXIcon />
			<h2 class="text text--title">WE STAND AGAINST</h2>
		</div>
		<a href="/our-plan/philosophy">
			<Button label="Explore Our Stances" intent="secondary" />
		</a>
	</div>
	<div class="section-body">
		{#each data.oppositions as item}
			<div class="item">
				<ContentSnippetTile
					title={item.title}
					content={item.content}
					icon={getPolicyIcon(item.category ? [item.category] : null)}
					href="/our-plan/philosophy"
				/>
			</div>
		{/each}
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
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
	#section--values-snippets-row,
	#section--objectives-snippets-row,
	#section--oppositions-snippets-row {
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
