<script lang="ts">
	import { flip } from 'svelte/animate'
	import { toaster } from './service.svelte'
	import { fly } from 'svelte/transition'
</script>

<div class="host toaster">
	{#each toaster.toasts as toast (toast.id)}
		<div class={['toast', `intent--${toast.type}`]} in:fly={{ y: -100 }} out:fly={{ x: -100 }} animate:flip>
			{#if toast.title}
				<div class="title-container">
					<span class="title">{toast.title}</span>

					{#if toast.code}
						<span class="code">{toast.code}</span>
					{/if}
				</div>
			{/if}
			<span class="description">
				{toast.message}
			</span>
		</div>
	{/each}
</div>

<style>
	.host.toaster {
		--loc-gap: var(--gap-s);
		position: fixed;
		top: var(--gap-max);
		left: 50%;
		width: 0;
		height: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 12;
		gap: var(--loc-gap);

		/* TOAST ------------------------------------------------ */
		.toast {
			--loc-bdr: var(--bdr-s);
			--loc-clr-bg: var(--clr-ev);
			&.intent--neutral {
				--loc-clr-border: var(--clr-dv-heavy-tr-light);
				--loc-clr-outline: var(--clr-dv-heavy);
				--loc-clr-ink: var(--clr-ink);
			}
			&.intent--positive {
				--loc-clr-border: var(--clr-sentiment-positive-tr-light);
				--loc-clr-outline: var(--clr-sentiment-positive);
				--loc-clr-ink: var(--clr-sentiment-positive);
			}
			&.intent--negative {
				--loc-clr-border: var(--clr-sentiment-negative-tr-light);
				--loc-clr-outline: var(--clr-sentiment-negative);
				--loc-clr-ink: var(--clr-sentiment-negative);
			}
			width: calc(var(--sp-12) * 4);
			max-width: 100vw;
			padding: var(--gap-s) calc(var(--gap-s) * 2);
			display: flex;
			flex-direction: column;
			justify-content: center;
			background-color: var(--loc-clr-bg);
			border: var(--sp-min) solid var(--loc-clr-border);
			outline: var(--bdw) solid var(--loc-clr-outline);
			border-radius: var(--loc-bdr);
			box-shadow:
				0 3px 10px rgba(0, 0, 0, 0.1),
				0 3px 3px rgba(0, 0, 0, 0.05);

			.title-container {
				display: flex;
				justify-content: space-between;
			}

			span {
				width: fit-content;
				color: var(--loc-clr-ink);

				&.title {
					font: var(--font--heading--s);
					font-size: var(--fs-3);
					text-transform: capitalize;
				}

				&.code {
					font: monospace;
					font-size: var(--fs-1);
					font-weight: 500;
				}

				&.description {
					font: var(--font--body--s);
				}
			}
		}
	}
</style>
