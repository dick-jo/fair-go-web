<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'onchange'> {
		label?: string
		falseText?: string
		trueText?: string
		onchange?: (checked: boolean) => void // Add this line
	}

	let {
		label,
		falseText = 'no',
		trueText = 'yes',
		checked = $bindable(false),
		onchange,
		...inputProps
	}: Props = $props()

	function toggleCheckbox() {
		checked = !checked
		onchange?.(checked)
	}
</script>

<!-- MARKUP -------------------------------------------- -->
<button class={['host', 'input-checkbox']} type="button" onclick={toggleCheckbox}>
	<div class="label-container">
		{#if label}
			<label class="label" for={inputProps.id}>
				{label}
			</label>
		{/if}
	</div>

	<div class="secondary">
		<span class="option" data-active={!checked}>{falseText}</span>
		<span class="separator">/</span>
		<span class="option" data-active={checked}>{trueText}</span>
	</div>

	<input type="checkbox" bind:checked {...inputProps} />
</button>

<style>
	.host {
		--loc-height: var(--sp-7);
		--loc-gap: var(--gap-s);
		--loc-clr-bg: var(--clr-dv);
		--loc-clr-border: var(--clr-dv-heavy-tr-light);
		--loc-bdr: var(--bdr-s);
		--loc-clr-ink: var(--clr-ink);
		--loc-clr-ink--light: var(--clr-ink-tr-light);
		--loc-transition: var(--t-ix-hover);
		&:hover {
			--loc-clr-bg: var(--clr-ev);
			--loc-clr-border: var(--clr-primary-tr-heavy);
		}
		height: var(--loc-height);
		padding: var(--loc-gap);
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--loc-gap);
		background-color: var(--loc-clr-bg);
		border-style: none;
		border: var(--bdw) solid var(--loc-clr-border);
		border-radius: var(--loc-bdr);
		cursor: pointer;
		transition: var(--loc-transition);

		/* LABEL ------------------------------------------------ */
		.label-container {
			padding-left: var(--loc-gap);
			flex: 1;
			display: flex;
			flex-direction: column;
			pointer-events: none;
			text-align: start;

			label {
				color: var(--loc-clr-ink);
			}
		}

		/* SECONDARY -------------------------------------------- */
		.secondary {
			display: flex;
			gap: var(--loc-gap);
			pointer-events: none;

			span {
				color: var(--loc-clr-ink);
				font: var(--font--label--s);
				text-transform: uppercase;
				transition: var(--loc-transition);
				font-weight: 500;

				&.option {
					&[data-active='false'] {
						color: var(--loc-clr-ink--light);
					}
				}
			}
		}

		/* CHECKBOX --------------------------------------------- */
		input {
			--loc-clr-accent: var(--clr-primary);
			--loc-clr-bg: var(--clr-ev);
			&:checked {
				--loc-clr-bg: var(--clr-primary);
			}
			width: var(--sp-5);
			height: var(--sp-5);
			accent-color: var(--loc-clr-accent);
			transition: var(--loc-transition);
		}
	}
</style>
