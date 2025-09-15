<script lang="ts">
	interface Props {
		label: string;
		onclick?: () => void
		intent?: 'primary' | 'secondary';
		colorway?: 'primary' | 'bg' | 'dv' | 'ev';
	}

	let { label, 	onclick, intent = 'primary', colorway = 'primary' }: Props = $props();

</script>

<!-- MARKUP -------------------------------------------- -->
<button onclick={() => onclick?.()} class={['host', 'button', `intent--${intent}`, `colorway--${colorway}`]}>
	<span class="label">
		{label}
	</span>
</button>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-l);
		--loc-transition: var(--t-ix-hover);
		&.intent--primary {
			&.colorway--primary {
				--loc-clr-bg: var(--clr-primary);
				--loc-clr-ink: var(--clr-bg);
			}

			&:hover {
				--loc-clr-bg: var(--clr-ev);
				--loc-clr-border: var(--clr-primary-tr-light);
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

		/* LABEL ------------------------------------------------ */
		span.label {
			color: var(--loc-clr-ink);
			font: var(--font--label--secondary);
			text-transform: var(--text-case--label);
		}
	}
</style>
