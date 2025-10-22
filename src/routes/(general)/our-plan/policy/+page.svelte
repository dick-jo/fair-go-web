<script lang="ts">
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte'
	import Chip from '$lib/components/Chip/Chip.svelte'
	import { getPolicyIcon } from '$lib/utils/policyIcons'
	import { LandPlotIcon } from '@lucide/svelte'
	import type { PageData } from './$types'
	import SEO from '$lib/components/SEO/SEO.svelte'

	const { data }: { data: PageData } = $props()

	const titleText = data.selectedCategory
		? `${data.selectedCategory.charAt(0).toUpperCase() + data.selectedCategory.slice(1)} Policies`
		: 'Our Policies'

	const pageDescription = data.selectedCategory
		? `Explore Fair Go's ${data.selectedCategory} policies. Practical solutions for a fairer Australia, shaped by everyday people.`
		: "Explore Fair Go's comprehensive policy platform. Practical, common-sense solutions for housing, healthcare, climate, and more."
</script>

<SEO title={titleText} description={pageDescription} />

<!-- HTML ---------------------------------------------- -->
<section id="section--our-policies" class="host">
	<!-- HEADER -->
	<div class="section-header section-header--grid">
		<div class="title-container">
			<LandPlotIcon />
			<h1 class="text text--title">{titleText}</h1>
		</div>

		<p>
			Welcome to FairGo policy hub. Dive into our practical solutions for a fairer Australia, shaped by everyday people
			tired of the majors’ neglect. Check back for updates as we build a fairer future.
		</p>

		<p>
			Explore FairGo’s policies—crafted with common sense for South Australia’s families and workers. Select any policy
			to explore in detail our FairGo vision across important issues.
		</p>
	</div>

	<!-- BODY -->
	<div class="body">
		{#each { length: Math.ceil(data.policies.length / 2) } as _, rowIndex}
			<div class="row">
				{#each data.policies.slice(rowIndex * 2, rowIndex * 2 + 2) as policy}
					<ContentSnippetTile
						title={policy.short_title || policy.title}
						content={policy.snippet}
						href={`/our-plan/policy/${policy.slug}`}
						icon={getPolicyIcon(policy.category)}
						chips={policy.category?.map((cat) => ({
							label: cat,
							href: `/our-plan/policy?category=${cat}`
						})) ?? []}
					/>
				{/each}
			</div>
		{/each}

		<!-- FOOTER -->
		{#if data.allCategories.length > 0}
			<footer>
				<div class="clamp">
					<h4 class="text--title">Browse by Category:</h4>
					<div class="chips-container">
						{#each data.allCategories as cat}
							<Chip label={cat} href="/our-plan/policy?category={cat}" />
						{/each}
					</div>
				</div>
			</footer>
		{/if}
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	#section--our-policies.host {
		/* BODY ------------------------------------------------- */
		& > .body {
			display: flex;
			flex-direction: column;
			/* ROW -------------------------------------------------- */
			& > .row {
				--loc-grid-cols: 2;
				@media screen and (max-width: 600px) {
					--loc-grid-cols: 1;
				}
				display: grid;
				grid-template-columns: repeat(var(--loc-grid-cols), 1fr);
				border-bottom: var(--bdw) solid var(--clr-dv);
				& > :global(*) {
					&:first-child {
						border-right: var(--bdw) solid var(--clr-dv);
						@media screen and (max-width: 600px) {
							border-right: none;
							border-bottom: var(--bdw) solid var(--clr-dv);
						}
					}
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
				gap: var(--gap-l);
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
