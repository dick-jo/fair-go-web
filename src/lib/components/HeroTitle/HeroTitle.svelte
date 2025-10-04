<script lang="ts">
	import { splitStringToChunks } from '$lib/utils'

	type Colorway = 'ev' | 'bg'

	interface Props {
		title: string
		label?: string
		colorway?: Colorway
	}

	let { title, label, colorway = 'ev' }: Props = $props()
</script>

<!-- MARKUP -------------------------------------------- -->
<div class={['host', 'hero-title', `colorway--${colorway}`]}>
	{#if label}
		<h2 class="text text--label">{label}</h2>
	{/if}

	<h1 class="text text--title">
		{#each splitStringToChunks(title, 3) as chunk, i}
			<span class="text text--sub" style="--loc-index: {i}">{chunk}</span>
		{/each}
	</h1>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-s);
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: var(--loc-gap);

		/* TEXT ------------------------------------------------- */
		.text {
			text-transform: var(--text-case--heading--secondary);
			&.text--label {
				--loc-gap: var(--gap-min);
				--loc-clr-bg: var(--clr-primary);
				--loc-clr-ink: var(--clr-ev);
				padding: var(--gap-min);
				font: var(--font--heading--secondary--s);
				background-color: var(--clr-primary);
				color: var(--loc-clr-ink);
			}
			&.text--title {
				--loc-gap: var(--gap-l);
				--loc-offset--margin: var(--sp-1);
				--loc-offset--shadow: var(--sp-1);
				--loc-clr-ink: var(--clr-ink);
				--loc-font: var(--font--heading--l);
				--loc-font-size: var(--fs-12);
				--loc-font-size--min: var(--fs-2);
				--loc-clr-shadow: var(--clr-primary);
				.host.colorway--ev & {
					--loc-clr-bg: var(--clr-ev);
				}
				.host.colorway--bg & {
					--loc-clr-bg: var(--clr-bg);
				}

				@media screen and (max-width: 720px) {
					--loc-gap: var(--gap-s);
				}
				display: flex;
				flex-direction: column;
				align-items: start;

				.text--sub {
					width: fit-content;
					max-width: fit-content;
					padding: calc(var(--loc-gap) / 2) var(--loc-gap);
					background-color: var(--loc-clr-bg);
					color: var(--loc-clr-ink);
					font: var(--loc-font);
					font-size: clamp(var(--loc-font-size--min), 5vw, var(--loc-font-size));
					box-shadow: var(--loc-offset--shadow) var(--loc-offset--shadow) 0 var(--loc-clr-shadow);
					margin-left: calc(var(--loc-offset--margin) * var(--loc-index));
				}
			}
		}
	}
</style>
