<script lang="ts">
	import { NAV_ITEMS } from '$lib/config'
	import Button from '../Button/Button.svelte'
	import type { Session } from '@supabase/supabase-js'

	let {
		session = null
	}: {
		session: Session | null
	} = $props()

	const navItems = NAV_ITEMS.filter((item) => item.showInTopNav)
</script>

<div id="nav-top" class="host nav-top">
	<div class="clamp">
		<a href="/" class="brand-container">
			<img src="/brand/brand-a-text-ev.svg" alt="" />
		</a>
		<nav>
			<ul>
				<!-- <li class="item"> -->
				<!-- 	{#if session} -->
				<!-- 		<span>Welcome, {user?.email}</span> -->
				<!-- 		<button onclick={handleSignOut}>Sign Out</button> -->
				<!-- 	{:else} -->
				<!-- 		<a href="/test">Sign In</a> -->
				<!-- 	{/if} -->
				<!-- </li> -->

				{#each navItems as item}
					<li class="item">
						<a href={item.href}>{item.label}</a>
					</li>
				{/each}

				<!-- ACTIONS -->

				<!-- <li class="item--action"> -->
				<!-- 	<Button -->
				<!-- 		label={item.label} -->
				<!-- 		intent={item.actionType} -->
				<!-- 		colorway={item.actionType === 'primary' ? 'primary' : 'primary'} -->
				<!-- 	/> -->
				<!-- </li> -->

				{#if !session}
					<li class="item--action">
						<a href="/auth">
							<Button label="Log in" intent="secondary" colorway="dv" />
						</a>
					</li>

					<li class="item--action">
						<a href="/auth#section--auth--sign-up">
							<Button label="Sign Up" intent="secondary" colorway="primary" />
						</a>
					</li>
				{:else if session}
					<li class="item--action">
						<a href="/private">
							<Button label="Your Profile" intent="secondary" colorway="primary" />
						</a>
					</li>
				{/if}

				<li class="item--action">
					<a href="/donate">
						<Button label="Donate" intent="primary" colorway="primary" />
					</a>
				</li>
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
		height: var(--layout--nav-top--height);
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
					&.item--action {
						--loc-gap: var(--gap-min);
					}
					&:hover {
						&.item {
							--loc-clr-ink: var(--clr-primary-heavy);
							--loc-clr-bg: var(--clr-ev);
							--loc-clr-border: var(--clr-primary);
						}
					}
					&:not(.item--action) {
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
