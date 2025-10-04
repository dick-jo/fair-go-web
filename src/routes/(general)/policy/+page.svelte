<script lang="ts">
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte'
	import { getPolicyIcon } from '$lib/utils/policyIcons'
	import { LandPlotIcon } from '@lucide/svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<section id="section--our-policies" class="host">
	<div class="section-header">
		<LandPlotIcon />
		<h1 class="title">Our Policies</h1>
	</div>
	<div class="body">
		{#each { length: Math.ceil(data.policies.length / 2) } as _, rowIndex}
			<div class="row">
				{#each data.policies.slice(rowIndex * 2, rowIndex * 2 + 2) as policy}
					<ContentSnippetTile
						title={policy.short_title || policy.title}
						content={policy.snippet}
						href={`/policy/${policy.slug}`}
						icon={getPolicyIcon(policy.category)}
						chips={policy.category?.map((cat) => ({ label: cat })) ?? []}
					/>
				{/each}
			</div>
		{/each}
	</div>
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
				&:last-child {
					border-bottom: none;
				}

				& > :global(*) {
					&:first-child {
						border-right: var(--bdw) solid var(--clr-dv);
					}
				}
			}
		}
	}
</style>
