<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		categories?: Snippet
		dates?: Snippet
	}

	const { categories, dates }: Props = $props()
</script>

<!-- MARKUP -------------------------------------------- -->
<div class="host">
	{#if categories}
		<div class="categories" aria-label="Article categories">
			{@render categories()}
		</div>
	{/if}

	{#if dates}
		<div class="dates">
			{@render dates()}
		</div>
	{/if}
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-l);
		height: var(--sp-5);
		display: flex;
		justify-content: space-between;
		align-items: center;
		@media screen and (max-width: 960px) {
			height: fit-content;
			flex-direction: column;
			gap: var(--loc-gap);
		}

		/* CATEGORIES --------------------------------------- */
		& > .categories {
			--loc-gap: var(--gap-s);
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			gap: var(--loc-gap);
		}

		/* DATES -------------------------------------------- */
		& > .dates {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: var(--loc-gap);
		}
	}
</style>
