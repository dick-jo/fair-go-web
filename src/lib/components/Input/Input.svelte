<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'class'> {
		label?: string;
		error?: string;
		class?: string;
	}

	let { label, error, class: className, value = $bindable(), ...inputProps }: Props = $props();
</script>

<!-- MARKUP -------------------------------------------- -->
<div class={['host', 'input', className].filter(Boolean)}>
	{#if label || error}
		<div class="header">
			{#if label}
				<label class="label" for={inputProps.id}>
					{label}
				</label>
			{/if}
			{#if error}
				<div class="error-container">
					<span>{error}</span>
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
		--loc-gap: var(--gap-s);
		--loc-transition: var(--t-ix-hover);

		/* Default input styling */
		--loc-clr-bg: var(--clr-bg);
		--loc-clr-border: var(--clr-border);
		--loc-clr-ink: var(--clr-ink);
		--loc-clr-placeholder: var(--clr-ink-light);
		--loc-clr-error: var(--clr-error);

		display: flex;
		flex-direction: column;
		gap: var(--loc-gap);

		/* HEADER ------------------------------------------- */
		.header {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			gap: var(--gap-s);

			.label {
				color: var(--loc-clr-ink);
				font: var(--font--label--secondary);
				text-transform: var(--text-case--label);
				cursor: pointer;
			}

			.error-container {
				span {
					color: var(--loc-clr-error);
					font: var(--font--body--small);
				}
			}
		}

		/* BODY --------------------------------------------- */
		.body {
			input {
				width: 100%;
				height: var(--sp-5);
				padding: 0 var(--gap-m);
				background-color: var(--loc-clr-bg);
				border: var(--bdw) solid var(--loc-clr-border);
				border-radius: var(--bdr-s);
				color: var(--loc-clr-ink);
				font: var(--font--body);
				transition: var(--loc-transition);

				&::placeholder {
					color: var(--loc-clr-placeholder);
				}

				&:focus {
					outline: none;
					--loc-clr-border: var(--clr-primary);
					box-shadow: 0 0 0 1px var(--clr-primary-tr-light);
				}

				&:hover:not(:focus) {
					--loc-clr-border: var(--clr-border-hover);
				}

				&:disabled {
					opacity: 0.6;
					cursor: not-allowed;
				}
			}
		}

		/* ERROR STATE -------------------------------------- */
		&:has(input:invalid),
		&:has(.error-container) {
			.body input {
				--loc-clr-border: var(--loc-clr-error);

				&:focus {
					--loc-clr-border: var(--loc-clr-error);
					box-shadow: 0 0 0 1px var(--clr-error-tr-light);
				}
			}
		}
	}
</style>
