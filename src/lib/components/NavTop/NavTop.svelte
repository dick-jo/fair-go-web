<script lang="ts">
	import { NAV_ITEMS } from '$lib/config';
	import Button from '../Button/Button.svelte';

	const navItems = NAV_ITEMS.filter((item) => item.showInTopNav);
</script>

<!-- MARKUP -------------------------------------------- -->
<div id="nav-top" class="host nav-top">
	<div class="clamp">
		<a href="/" class="brand-container">
			<img src="/brand/brand-a-text-ev.svg" alt="" />
		</a>

		<nav>
			<ul>
				{#each navItems as item}
					<li>
						{#if item.isAction}
							<Button
								label={item.label}
								intent={item.actionType}
								colorway={item.actionType === 'primary' ? 'primary' : 'dv'}
							/>
						{:else}
							<a href={item.href}>{item.label}</a>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: 0;
		@media screen and (max-width: 1600px) {
			--loc-gap: var(--gap-s);
		}
		width: 100%;
		height: var(--sp-9);
		padding: 0 var(--loc-gap);
		display: flex;
		justify-content: center;
		border-bottom: var(--bdw) solid var(--clr-dv);

		/* CLAMP ------------------------------------------------ */
		.clamp {
			--loc-gap: var(--gap-s);
			width: 100%;
			max-width: var(--clamp--content-width--max);
			display: flex;
		}

		/* BRAND ------------------------------------------------ */
		.brand-container {
			--loc-transform-scale: 1;
			&:hover {
				--loc-transform-scale: 1.125;
			}
			height: 100%;
			padding: var(--gap-s) 0;

			img {
				width: auto;
				height: 100%;
				transform: scale(var(--loc-transform-scale));
				transition: var(--t-ix-hover);
			}
		}

		/* NAV -------------------------------------------------- */
		nav {
			flex: 1;
			display: flex;
			justify-content: end;
			align-items: center;

			ul {
				height: 100%;
				display: flex;
				list-style: none;

				li {
					--loc-gap: var(--gap-l);
					--loc-clr-ink: var(--clr-ink);
					--loc-clr-bg: var(--clr-ev-tr-invisible);
					--loc-clr-border: var(--clr-primary-tr-invisible);
					--loc-transition: var(--t-ix-hover);
					&:hover {
						:global(&:not(:has(button))) {
							--loc-clr-ink: var(--clr-primary-heavy);
							--loc-clr-bg: var(--clr-ev);
							--loc-clr-border: var(--clr-primary);
						}
					}
					:global(&:not(:has(button))) {
						@media screen and (max-width: 800px) {
							display: none;
						}
					}
					height: 100%;
					display: flex;
					align-items: center;
					background-color: var(--loc-clr-bg);
					border-bottom: var(--sp-min) solid var(--loc-clr-border);
					transition: var(--loc-transition);
					:global(&:has(button)) {
						padding: 0 calc(var(--loc-gap) / 2);
					}
					&:last-child {
						padding-right: 0;
					}

					a {
						height: 100%;
						padding: 0 var(--loc-gap);
						display: flex;
						align-items: center;
						color: var(--loc-clr-ink);
						font: var(--font--label--secondary);
						text-transform: var(--text-case--label);
						transition: var(--loc-transition);
					}
				}
			}
		}
	}
</style>
