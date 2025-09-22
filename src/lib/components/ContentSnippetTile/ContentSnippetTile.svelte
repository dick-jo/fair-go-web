<script lang="ts">
	import { ArrowRightIcon, type Icon } from '@lucide/svelte'

	interface Props {
		title: string
		content: string
		href?: string
		linkText?: string
		icon?: typeof Icon
	}

	let { title, content, href, linkText = 'Read More', icon: IconComponent }: Props = $props()
</script>

<!-- MARKUP -------------------------------------------- -->
<div class={['host', 'content-snippet-tile', href && 'as--link']}>
	<div class="header">
		<h3 class="title">{title}</h3>
		<div class="icon-container">
			<IconComponent />
		</div>
	</div>

	<p>
		{content}
	</p>

	{#if href}
		<a class="link" {href}>
			<span>{linkText}</span>
			<ArrowRightIcon />
		</a>
	{/if}
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-l);
		--loc-gap--s: var(--gap-s);
		--loc-clr-bg: var(--clr-ev-tr-invisible);
		--loc-clr-ink: var(--clr-ink);
		--loc-clr-ink--light: var(--clr-ink-tr-heavy-x);
		--loc-cursor: default;
		--loc-transition: var(--t-ix-hover);
		&.as--link {
			--loc-cursor: pointer;
			&:hover {
				--loc-clr-bg: var(--clr-ev);
			}
		}
		width: 100%;
		height: 100%;
		padding: var(--loc-gap);
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--loc-gap);
		background-color: var(--loc-clr-bg);
		transition: var(--loc-transition);
		cursor: var(--loc-cursor);

		/* HEADER ----------------------------------------------- */
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--loc-gap--s);

			/* TITLE ------------------------------------------------ */
			.title {
				color: var(--loc-clr-ink);
				font: var(--font--heading--s);
			}

			/* ICON CONTAINER --------------------------------------- */
			.icon-container {
				--loc-size: var(--sp-5);
				--loc-clr-bg: var(--clr-primary);
				--loc-clr-border: var(--clr-primary);
				--loc-clr-ink: var(--clr-bg);
				.host.as--link:hover & {
					--loc-clr-bg: var(--clr-primary-tr-light-x);
					--loc-clr-ink: var(--clr-ink);
				}
				width: var(--loc-size);
				min-width: var(--loc-size);
				height: var(--loc-size);
				min-height: var(--loc-size);
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: var(--loc-clr-bg);
				border: var(--bdw) solid var(--loc-clr-border);
				border-radius: var(--bdr-s);
				transition: var(--loc-transition);

				:global(svg) {
					stroke: var(--loc-clr-ink);
					transition: var(--loc-transition);
				}
			}
		}

		/* P ---------------------------------------------------- */
		p {
			flex: 1;
			color: var(--loc-clr-ink--light);
			font: var(--font--body--s);
		}

		/* LINK ------------------------------------------------- */
		.link {
			--loc-height: var(--sp-3);
			--loc-clr-bg: var(--clr-dv-tr-heavy);
			--loc-clr-border: var(--clr-dv);
			--loc-clr-ink: var(--clr-ink-tr-heavy);
			.host.as--link:hover & {
				--loc-clr-bg: var(--clr-primary);
				--loc-clr-ink: var(--clr-bg);
			}
			padding: 0 var(--loc-gap--s);
			height: var(--loc-height);
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: var(--loc-clr-bg);
			border: var(--bdw) solid var(--loc-clr-border);
			border-radius: var(--bdr-s);
			transition: var(--loc-transition);

			span {
				color: var(--loc-clr-ink);
				font: var(--font--label--secondary);
				font-size: var(--fs-1);
				text-transform: var(--text-case--label);
				font-weight: 400;
				transition: var(--loc-transition);
			}

			:global(svg) {
				--loc-size: var(--sp-2);
				width: var(--loc-size);
				height: var(--loc-size);
				stroke: var(--loc-clr-ink);
				transition: var(--loc-transition);
			}
		}
	}
</style>
