<script lang="ts">
	import { ChevronRight } from '@lucide/svelte'

	interface BreadcrumbItem {
		label: string
		href?: string
	}

	interface Props {
		items: BreadcrumbItem[]
	}

	const { items }: Props = $props()
</script>

<!-- MARKUP -------------------------------------------- -->
<nav class={['host', 'breadcrumbs']} aria-label="Breadcrumb">
	<ol>
		{#each items as item, index}
			{#if index > 0}
				<ChevronRight />
			{/if}

			<li aria-current={!item.href ? 'page' : undefined}>
				{#if item.href}
					<a href={item.href}>{item.label}</a>
				{:else}
					<span>{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-min);
		display: flex;
		align-items: center;
		@media screen and (max-width: 960px) {
			justify-content: center;
		}

		/* OL --------------------------------------------------- */
		ol {
			--loc-font: var(--font--label--s);
			--loc-font-size: var(--fs-2);
			--loc-font-weight: 500;
			--loc-clr-ink: var(--clr-ink-tr-heavy-x);
			@media screen and (max-width: 400px) {
				--loc-font-size: var(--fs-1);
			}
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: var(--loc-gap);
			list-style: none;
			@media screen and (max-width: 960px) {
				justify-content: center;
			}

			/* LI --------------------------------------------------- */
			li {
				display: flex;
				align-items: center;

				/* SPAN ------------------------------------------------- */
				span {
					padding: 0 var(--loc-gap);
					color: var(--loc-clr-ink);
					font: var(--loc-font);
					font-size: var(--loc-font-size);
					font-weight: var(--loc-font-weight);
					text-transform: capitalize;
				}

				/* ANCHOR ----------------------------------------------- */
				a {
					--loc-clr-bg: var(--clr-primary-tr-invisible);
					--loc-clr-border: var(--clr-primary-tr-invisible);
					&:hover {
						--loc-clr-bg: var(--clr-primary-tr-min);
						--loc-clr-border: var(--clr-primary-tr-light);
					}
					padding: 0 var(--loc-gap);
					background-color: var(--loc-clr-bg);
					border: var(--bdw) solid var(--loc-clr-border);
					border-radius: var(--bdr-min);
					color: var(--loc-clr-ink);
					font: var(--loc-font);
					font-size: var(--loc-font-size);
					font-weight: var(--loc-font-weight);
					text-transform: capitalize;
					transition: var(--t-ix-hover);
				}
			}

			/* SVG -------------------------------------------------- */
			& > :global(svg) {
				--loc-size: var(--sp-2);
				width: var(--loc-size);
				height: var(--loc-size);
				stroke: var(--loc-clr-ink);
			}
		}
	}
</style>
