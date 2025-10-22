<script lang="ts">
	import { LightbulbIcon, LandPlotIcon, HeartHandshakeIcon, TargetIcon, ShieldXIcon } from '@lucide/svelte'
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte'
	import Button from '$lib/components/Button/Button.svelte'
	import { getPolicyIcon } from '$lib/utils'
	import type { PageData } from './$types'
	import SEO from '$lib/components/SEO/SEO.svelte'

	const { data }: { data: PageData } = $props()
</script>

<SEO
	title="Our Plan"
	description="Discover Fair Go's comprehensive plan for a fairer Australia. Explore our policies, values, and strategies to tackle waste, empower communities, and build a better future."
/>

<!-- MARKUP -------------------------------------------- -->
<section id="section--our-plan" class="host">
	<!-- HEADER -->
	<div class="section-header section-header--grid">
		<div class="title-container">
			<LightbulbIcon />
			<h1 class="text text--title">Our Plan</h1>
		</div>
		<p>
			Welcome to FairGo's plan—your roadmap to a fairer Australia, built by everyday people fed up with the majors'
			broken promises. Explore our vision here.
		</p>
		<p>
			Dive into FairGo's policies, values, and strategies for change. See how we tackle waste, empower communities, and
			shape a stronger future for all Australians.
		</p>
	</div>
</section>

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
	#section--our-plan {
		.section-header {
			border-bottom: none;
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
