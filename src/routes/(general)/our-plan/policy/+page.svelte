<script lang="ts">
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte'
	import Chip from '$lib/components/Chip/Chip.svelte'
	import { getPolicyIcon } from '$lib/utils/policyIcons'
	import { LandPlotIcon } from '@lucide/svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const titleText = data.selectedCategory
		? `${data.selectedCategory.charAt(0).toUpperCase() + data.selectedCategory.slice(1)} Policies`
		: 'Our Policies'
</script>

<section id="section--our-policies" class="host">
	<div class="section-header">
		<LandPlotIcon />
		<h1 class="title">{titleText}</h1>
	</div>
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
	</div>

	<!-- FOOTER -------------------------------------------- -->
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
</section>

<style>
	#section--our-policies.host {
		/* BODY ------------------------------------------------- */
		& > .body {
			display: flex;
			flex-direction: column;
			/* ROW -------------------------------------------------- */
			& > .row {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				border-bottom: var(--bdw) solid var(--clr-dv);
				& > :global(*) {
					&:first-child {
						border-right: var(--bdw) solid var(--clr-dv);
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
