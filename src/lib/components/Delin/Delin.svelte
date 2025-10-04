<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		fontSize?: 'default' | 's' | 'l'
		children?: Snippet
	}

	let { fontSize = 'default', children }: Props = $props()
</script>

<!-- MARKUP -------------------------------------------- -->
<div class={['host', 'delin', `font-size--${fontSize}`]}>
	<div class="line"></div>

	{#if children}
		<div class="text-wrapper">
			{@render children()}
		</div>
	{:else}
		<div class="media-container">
			<img src="/brand/brand-a-text-ev.svg" alt="" />
		</div>
	{/if}

	<div class="line"></div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-height: var(--sp-5);
		--loc-gap: var(--gap-l);
		height: var(--loc-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--loc-gap);

		/* TEXT WRAPPER ----------------------------------------- */
		.text-wrapper {
			.host.font-size--default & {
				--loc-font: var(--font--heading--secondary);
			}
			.host.font-size--s & {
				--loc-font: var(--font--heading--secondary--s);
			}
			.host.font-size--l & {
				--loc-font: var(--font--heading--secondary--l);
			}
			& > :global(*) {
				font: var(--loc-font);
				text-transform: var(--text-case--heading--secondary);
			}
		}

		/* MEDIA CONTAINER -------------------------------------- */
		.media-container {
			height: var(--loc-height);

			img {
				height: 100%;
			}
		}

		/* LINE ------------------------------------------------- */
		.line {
			flex: 1;
			height: var(--bdw);
			border-top: var(--bdw) solid var(--clr-primary-tr-heavy);
		}
	}
</style>
