<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'

	interface Props extends HTMLInputAttributes {
		label?: string
		error?: string
	}

	let { label, error, value = $bindable(), ...inputProps }: Props = $props()
</script>

<!-- MARKUP -------------------------------------------- -->
<div class={['host', 'input']}>
	{#if label || error}
		<div class="header">
			{#if label}
				<label class="label" for={inputProps.id}>
					{label}
				</label>
			{/if}

			{#if error}
				<div class="aux" data-sentiment="negative">
					<div class="wrapper">
						<span>{error}</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<div class="body">
		<input bind:value {...inputProps} />
	</div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--sp-min);
		--loc-clr-bg: var(--clr-dv);
		--loc-clr-bg--input: var(--clr-ev);
		--loc-clr-ink: var(--clr-ink);
		--loc-bdr: var(--bdr-s);
		--loc-bdr--s: var(--bdr-min);
		--loc-transition: var(--t-ix-hover);
		&:has(input:focus) {
			--loc-clr-bg: var(--clr-primary);
			--loc-clr-bg--input: var(--clr-bg);
			--loc-clr-ink: var(--clr-ev);
		}
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;

		/* HEADER ----------------------------------------------- */
		.header {
			--loc-height: var(--sp-3);
			height: var(--loc-height);
			display: flex;
			justify-content: space-between;

			/* LABEL ------------------------------------------------ */
			label {
				padding: 0 calc(var(--loc-gap) * 2);
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: var(--loc-clr-bg);
				border-radius: var(--loc-bdr--s) var(--loc-bdr--s) 0 0;
				color: var(--loc-clr-ink);
				font: var(--font--label);
				font-size: var(--fs-1);
				text-transform: capitalize;
				transition: var(--loc-transition);
				.host:has(input:focus) & {
					padding: 0 calc(var(--loc-gap) * 4);
				}
			}

			/* AUX -------------------------------------------------- */
			.aux {
				--loc-clr-bg: var(--clr-dv-tr-invisible);
				--loc-clr-ink: var(--clr-ink);
				/* &[data-sentiment='positive'] { */
				/* 	--loc-clr-bg: var(--clr-sentiment-positive-tr-min); */
				/* 	--loc-clr-border: var(--clr-sentiment-positive-tr-light); */
				/* 	--loc-clr-ink: var(--clr-sentiment-positive); */
				/* } */
				&[data-sentiment='negative'] {
					--loc-clr-bg: var(--clr-sentiment-negative-tr-min);
					--loc-clr-border: var(--clr-sentiment-negative-tr-light);
					--loc-clr-ink: var(--clr-sentiment-negative);
				}
				padding-bottom: var(--loc-gap);

				.wrapper {
					height: 100%;
					padding: var(--loc-gap);
					display: flex;
					justify-content: center;
					align-items: center;
					gap: var(--gap-s);
					background-color: var(--loc-clr-bg);
					border: var(--bdw) solid var(--loc-clr-border);
					border-radius: var(--loc-bdr--s);
				}

				span {
					color: var(--loc-clr-ink);
					font: var(--font--body--s);
					font-size: var(--fs-1);
					font-weight: 500;
				}

				:global(svg) {
					width: var(--sp-2);
					height: var(--sp-2);
					stroke: var(--loc-clr-ink);
				}
			}
		}

		/* BODY ------------------------------------------------- */
		.body {
			--loc-height: var(--sp-7);
			width: 100%;
			height: var(--loc-height);
			padding: var(--loc-gap);
			background-color: var(--loc-clr-bg);
			border-radius: 0 var(--loc-bdr) var(--loc-bdr) var(--loc-bdr);
			transition: var(--loc-transition);

			/* INPUT ------------------------------------------------ */
			input {
				--loc-clr-border: var(--clr-primary-tr-light);
				--loc-clr-ink--placeholder: var(--clr-ink-tr-light);
				&:focus {
					--loc-clr-ink: var(--clr-ink);
					--loc-clr-border: var(--clr-primary-tr-heavy);
				}
				width: 100%;
				height: 100%;
				padding: var(--gap-s);
				background-color: var(--loc-clr-bg--input);
				border: var(--bdw) solid var(--loc-clr-border);
				border-radius: var(--loc-bdr--s);
				color: var(--loc-clr-ink);
				font: var(--font--body--s);
				font-weight: bold;
				transition: var(--loc-transition);
				&::placeholder {
					color: var(--loc-clr-ink--placeholder);
				}
				&:focus {
					outline: none;
				}
			}
		}
	}
</style>
