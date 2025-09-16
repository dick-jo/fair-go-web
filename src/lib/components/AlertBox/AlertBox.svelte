<script lang="ts">
	import type { Icon } from '@lucide/svelte';

	interface Props {
		label: string;
		message: string;
		colorway: 'primary' | 'dv' | 'sentiment-positive' | 'sentiment-negative';
		icon?: typeof Icon;
		isEphemeral?: boolean;
		useShadow?: boolean;
	}

	let {
		label,
		message,
		colorway = 'dv',
		icon: IconComponent,
		isEphemeral = false,
		useShadow = false
	}: Props = $props();
</script>

<!-- MARKUP -------------------------------------------- -->
<div
	class={[
		'host',
		'alert-box',
		`colorway--${colorway}`,
		isEphemeral && 'ephemeral',
		useShadow && 'shadow'
	]}
>
	<div class="wrapper">
		{#if IconComponent}
			<div class="icon-container">
				<IconComponent />
			</div>
		{/if}
		<div class="body">
			<span class="label">{label}</span>
			<p class="message">{message}</p>
		</div>
	</div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-s);
		--loc-clr-background--underlay: var(--clr-ev);
		&.colorway--dv {
			--loc-clr-background: var(--clr-dv-tr-light);
			--loc-clr-border: var(--clr-dv-tr-heavy);
			--loc-clr-ink: var(--clr-dv-heavy);
			--loc-clr-ink--light: var(--clr-dv-heavy-tr-heavy-x);
		}
		&.colorway--primary {
			--loc-clr-background: var(--clr-primary-tr-light-x);
			--loc-clr-border: var(--clr-primary-tr-light);
			--loc-clr-ink: var(--clr-ink);
			--loc-clr-ink--light: var(--clr-ink-tr-heavy-x);
		}
		&.colorway--sentiment-positive {
			--loc-clr-background: var(--clr-sentiment-positive-tr-min);
			--loc-clr-border: var(--clr-sentiment-positive-tr-light);
			--loc-clr-ink: var(--clr-sentiment-positive);
			--loc-clr-ink--light: var(--clr-sentiment-positive-tr-heavy-x);
		}
		&.colorway--sentiment-negative {
			--loc-clr-background: var(--clr-sentiment-negative-tr-min);
			--loc-clr-border: var(--clr-sentiment-negative-tr-light);
			--loc-clr-ink: var(--clr-sentiment-negative);
			--loc-clr-ink--light: var(--clr-sentiment-negative-tr-heavy-x);
		}
		--loc-bdr: var(--bdr-s);
		--loc-shadw: none;
		&.shadow {
			--loc-shadow: 0 var(--gap-l) var(--gap-l) rgba(0, 0, 0, 0.125);
		}
		border-radius: var(--loc-bdr);
		background-color: var(--loc-clr-background--underlay);
		box-shadow: var(--loc-shadow);
		&.ephemeral {
			animation-name: ephemeral;
			animation-duration: var(--t-anim-6);
			animation-iteration-count: once;
			animation-fill-mode: forwards;
		}

		/* WRAPPER ---------------------------------------------- */
		.wrapper {
			background-color: var(--loc-clr-background);
			border: var(--bdw) solid var(--loc-clr-border);
			border-radius: var(--loc-bdr);
			display: flex;

			/* ICON ------------------------------------------------- */
			.icon-container {
				padding: var(--loc-gap);
				:global(svg) {
					stroke: var(--loc-clr-ink);
				}
			}

			/* BODY ------------------------------------------------- */
			.body {
				padding: var(--loc-gap);
				flex: 1;
				display: flex;
				flex-direction: column;
				text-align: start;

				/* TEXT ------------------------------------------------- */
				.label {
					color: var(--loc-clr-ink);
					font: var(--font--label--s);
				}

				.message {
					color: var(--loc-clr-ink--light);
				}
			}
		}
	}

	/* ANIM ------------------------------------------------- */
	@keyframes ephemeral {
		0% {
			opacity: 1;
			display: inherit;
		}
		75% {
			opacity: 1;
			display: inherit;
		}
		99% {
			opacity: 0;
			display: inherit;
		}
		100% {
			opacity: 0;
			display: none;
		}
	}
</style>
