<script lang="ts">
	import type { ChipProps } from './types'

	const { label, href }: ChipProps = $props()

	const tag = $derived(href ? 'a' : 'span')
	const tagProps = $derived(href ? { href, rel: 'tag' } : {})
</script>

<!-- MARKUP -------------------------------------------- -->
<svelte:element this={tag} {...tagProps} class={['host', 'chip']}>
	<span class="text--label">
		{label}
	</span>
</svelte:element>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-clr-bg: var(--clr-ev);
		--loc-clr-border: var(--clr-primary);
		--loc-clr-ink: var(--clr-ink);
		--loc-offset--shadow: var(--sp-min);
		--loc-transition: var(--t-ix-hover);
		&:hover {
			--loc-clr-bg: var(--clr-primary);
			--loc-clr-ink: var(--clr-ev);
			--loc-offset--shadow: 0;
		}
		width: fit-content;
		max-width: fit-content;
		padding: 0 var(--gap-s);
		height: var(--sp-3);
		display: flex;
		align-items: center;
		background-color: var(--loc-clr-bg);
		border: var(--bdw) solid var(--loc-clr-border);
		box-shadow: var(--loc-offset--shadow) var(--loc-offset--shadow) 0 var(--loc-clr-border);
		transition: var(--loc-transition);

		.text--label {
			color: var(--loc-clr-ink);
			font: var(--font--label--secondary--s);
			font-weight: 400;
			text-transform: var(--text-case--label);
			transition: var(--loc-transition);
		}
	}
</style>
