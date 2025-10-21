<script lang="ts">
	import Button from '../Button/Button.svelte'

	interface Props {
		title: string
		label?: string
		content: string
		buttonLabel: string
		intent?: 'primary' | 'secondary'
		href?: string
	}

	const { title, label, content, buttonLabel, intent = 'secondary', href }: Props = $props()
</script>

<!-- SNIPPETS ------------------------------------------ -->
{#snippet button()}
	<Button label={buttonLabel} fit="extrinsic" intent="primary" colorway={intent === 'primary' ? 'bg' : 'primary'} />
{/snippet}

<!-- MARKUP -------------------------------------------- -->

<div class={['host', 'cta-box', `intent--${intent}`]}>
	<div class="header">
		{#if label}
			<h3 class="label">{label}</h3>
		{/if}

		<h2 class="title">{title}</h2>
	</div>

	<p class="content">{content}</p>

	{#if href}
		<a {href}>
			{@render button()}
		</a>
	{:else}
		{@render button()}
	{/if}
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host.cta-box {
		--loc-gap: var(--gap-l);
		--loc-bdr: var(--bdr-l);
		&.intent--primary {
			--loc-clr-bg: var(--clr-primary);
			--loc-clr-ink: var(--clr-bg);
			--loc-clr-ink--light: var(--clr-bg-tr-heavy-x);
			--loc-clr-border: var(--clr-dv-heavy-tr-heavy);
		}
		&.intent--secondary {
			--loc-clr-bg: var(--clr-ev);
			--loc-clr-ink: var(--clr-ink);
			--loc-clr-ink--light: var(--clr-ink-tr-heavy-x);
			--loc-clr-border: var(--clr-dv);
		}
		width: 100%;
		padding: var(--gap-l);
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--loc-gap);
		background-color: var(--loc-clr-bg);
		border: var(--bdw) solid var(--loc-clr-border);
		border-radius: var(--bdr-l);

		/* HEADER ----------------------------------------------- */
		.header {
			display: flex;
			flex-direction: column;

			.label {
				color: var(--loc-clr-ink--light);
				font: var(--font--heading--secondary--s);
				text-transform: var(--text-case--heading--secondary);
			}

			.title {
				color: var(--loc-clr-ink);
				font: var(--font--heading);
				font-weight: 700;
				text-transform: var(--text-case--heading);
			}
		}

		/* CONTENT ---------------------------------------------- */
		.content {
			flex: 1;
			color: var(--loc-clr-ink--light);
			font: var(--font--body--s);
		}
	}
</style>
