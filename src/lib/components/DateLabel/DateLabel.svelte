<script lang="ts">
	import { formatDateAustralian } from '$lib/utils'

	interface Props {
		label?: string
		date: string | null
	}

	const { label, date }: Props = $props()
</script>

<!-- HTML ---------------------------------------------- -->
{#if date}
	<div class="date-item">
		{#if label}
			<span class="text text--label">{label}</span>
		{/if}
		<div class="line"></div>
		<time class="text text--value" datetime={date}>{formatDateAustralian(date)}</time>
	</div>
{/if}

<!-- CSS ----------------------------------------------- -->
<style>
	.date-item {
		--loc-gap: var(--gap-min);
		display: flex;
		align-items: center;
		gap: var(--loc-gap);

		.text {
			--loc-font: var(--font--label--secondary--s);
			--loc-font-weight: 500;
			font: var(--loc-font);
			color: var(--clr-ink-tr-heavy);
			&.text--label {
				font-weight: var(--loc-font-weight);
				text-transform: var(--text-case--label);
			}
			&.text--value {
				font-weight: var(--loc-font-weight);
			}
		}

		.line {
			width: var(--gap-l);
			height: var(--bdw);
			border-top: var(--bdw) solid var(--clr-primary-tr-heavy);
		}
	}
</style>
