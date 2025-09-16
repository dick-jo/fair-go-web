<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLButtonAttributes, 'class'> {
		label: string;
		intent?: 'primary' | 'secondary';
		colorway?: 'primary' | 'bg' | 'dv' | 'ev';
	}

	let { label, intent = 'primary', colorway = 'primary', ...buttonProps }: Props = $props();
</script>

<!-- MARKUP -------------------------------------------- -->
<button class={['host', 'button', `intent--${intent}`, `colorway--${colorway}`]} {...buttonProps}>
	<span class="label">
		{label}
	</span>
</button>

<!-- CSS ----------------------------------------------- -->
<style>
	.host.button {
		--loc-gap: var(--gap-l);
		--loc-transition: var(--t-ix-hover);
		&.intent--primary {
			&.colorway--primary {
				--loc-clr-bg: var(--clr-primary);
				--loc-clr-ink: var(--clr-bg);
			}
			&.colorway--bg {
				--loc-clr-bg: var(--clr-bg);
				--loc-clr-ink: var(--clr-ink);
			}
		}
		&.intent--secondary {
			&.colorway--primary {
				--loc-clr-bg: var(--clr-primary-tr-light-x);
				--loc-clr-border: var(--clr-primary-tr-light);
				--loc-clr-ink: var(--clr-ink);
			}
			&.colorway--dv {
				--loc-clr-bg: var(--clr-dv);
				--loc-clr-border: var(--clr-dv-heavy-tr-light);
				--loc-clr-ink: var(--clr-ink);
			}
		}
		&.intent--primary,
		&.intent--secondary {
			&:disabled {
				--loc-clr-bg: var(--clr-dv-tr-heavy);
				--loc-clr-border: var(--clr-dv);
				--loc-clr-ink: var(--clr-dv-heavy-tr-light);
			}
			&:hover {
				--loc-clr-bg: var(--clr-ev);
				--loc-clr-border: var(--clr-primary-tr-light);
				--loc-clr-ink: var(--clr-ink);
			}
		}

		height: var(--sp-5);
		padding: 0 var(--loc-gap);
		background-color: var(--loc-clr-bg);
		border-style: none;
		border: var(--bdw) solid var(--loc-clr-border);
		border-radius: var(--bdr-s);
		cursor: pointer;
		transition: var(--loc-transition);
		&:disabled {
			cursor: not-allowed;
		}

		/* LABEL ------------------------------------------------ */
		span.label {
			color: var(--loc-clr-ink);
			font: var(--font--label--secondary);
			text-transform: var(--text-case--label);
		}
	}
</style>
