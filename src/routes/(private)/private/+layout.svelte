<script lang="ts">
	import '$lib/style/system.tokens.css'
	import '$lib/style/main.css'
	import '$lib/style/typography.css'
	import Button from '$lib/components/Button/Button.svelte'
	import { signOut } from '$lib/client/auth'
	import { page } from '$app/state'

	const { data, children } = $props()
	// $inspect(data)

	// CONFIG ----------------------------------------------- //
	const NAV_ITEMS = [
		{
			href: '/private',
			label: 'Your Profile',
			sections: [
				{ href: '#section--your-details', label: 'Your Details' },
				{ href: '#section--volunteer-status', label: 'Volunteer Status' },
				{ href: '#section--communication-preferences', label: 'Communication Preferences' }
			]
		},
		{ href: '/private/membership', label: 'Membership' },
		{ href: '/private/transactions', label: 'Transactions' }
	]

	// STATE ------------------------------------------------ //
	const activeNavItem = $derived(NAV_ITEMS.find((item) => page.url.pathname === item.href))
	const pageTitle = $derived(activeNavItem?.label?.toUpperCase() || 'PRIVATE AREA')

	// HANDLERS --------------------------------------------- //
	const handleSignOut = async () => {
		await signOut(data.supabase, { redirect: true })
	}
</script>

<!-- MARKUP--------------------------------------------- -->
<div id="layout--private">
	<nav>
		<ul>
			{#each NAV_ITEMS as item}
				<li data-active={page.url.pathname === item.href}>
					<a href={item.href}>{item.label}</a>
				</li>

				{#if item.sections && page.url.pathname === item.href}
					<ul class="sub-nav">
						{#each item.sections as section}
							<li>
								<a href={section.href}>{section.label}</a>
							</li>
						{/each}
					</ul>
				{/if}
			{/each}
		</ul>
	</nav>

	<main>
		<div class="clamp">
			<header>
				<div class="title-container">
					<h2 class="title--secondary">{pageTitle}</h2>
					<h1 class="title">
						Hello{data.profile?.first_name
							? `, ${data.profile.first_name}`
							: data.user?.email
								? `, ${data.user.email}`
								: ''}
					</h1>
				</div>

				<div class="action-container">
					<Button label="Sign Out" onclick={handleSignOut} />
				</div>
			</header>

			{@render children()}
		</div>
	</main>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	#layout--private {
		--loc-gap: var(--gap-l);
		width: 100%;
		max-width: var(--clamp--content-width--max);
		display: grid;
		grid-template-columns: repeat(12, 1fr);

		/* NAV -------------------------------------------------- */
		nav {
			--loc-grid-cols: 3;
			@media screen and (max-width: 720px) {
				--loc-grid-cols: 12;
			}
			padding: var(--loc-gap);
			grid-column: span var(--loc-grid-cols);
			@media screen and (max-width: 720px) {
				border-bottom: var(--bdw) solid var(--clr-dv);
			}

			ul {
				--loc-gap: var(--gap-s);
				position: sticky;
				top: var(--loc-gap);
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);
				list-style: none;
				@media screen and (max-width: 720px) {
					position: static;
				}

				li {
					--loc-height: var(--sp-4);
					--loc-pad: 0;
					--loc-clr-bg: var(--clr-primary-tr-invisible);
					--loc-clr-border: var(--clr-primary-tr-invisible);
					--loc-clr-ink: var(--clr-ink-tr-heavy-x);
					--loc-font: var(--font--label--secondary--l);
					--loc-font-weight: var(--font-weight--label--secondary);
					--loc-text-transform: var(--text-case--label);
					--loc-transition: var(--t-ix-hover);
					.sub-nav & {
						--loc-height: auto;
						--loc-font: var(--font--label);
						--loc-font-weight: 500;
						--loc-text-transform: var(--text-case--label--secondary);
						&:hover {
							--loc-pad: var(--gap-s);
						}
					}
					&[data-active='true'],
					&:hover {
						&:not(.sub-nav &) {
							--loc-pad: var(--gap-s);
							--loc-clr-bg: var(--clr-primary-tr-light-x);
							--loc-clr-border: var(--clr-primary-tr-light);
							--loc-clr-ink: var(--clr-ink);
						}
					}
					height: var(--loc-height);
					background-color: var(--loc-clr-bg);
					border: var(--bdw) solid var(--loc-clr-border);
					border-radius: var(--bdr-s);
					transition: var(--loc-transition);

					a {
						width: 100%;
						height: 100%;
						padding: 0 var(--loc-pad);
						display: flex;
						align-items: center;
						color: var(--loc-clr-ink);
						font: var(--loc-font);
						font-weight: var(--loc-font-weight);
						text-transform: var(--loc-text-transform);
						transition: var(--loc-transition);
					}
				}
			}
		}

		/* MAIN ------------------------------------------------- */
		main {
			--loc-grid-cols: 9;
			@media screen and (max-width: 720px) {
				--loc-grid-cols: 12;
			}
			padding: var(--loc-gap);
			grid-column: span var(--loc-grid-cols);

			& > .clamp {
				width: 100%;
				max-width: var(--clamp--content-width--s-x);
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--loc-gap);

				/* HEADER ----------------------------------------------- */
				header {
					width: 100%;
					display: flex;
					justify-content: space-between;

					.title {
						font: var(--font--heading--l);
					}

					.title--secondary {
						font: var(--font--heading--secondary);
						text-transform: var(--text-case--heading--secondary);
					}
				}
			}
		}
	}
</style>
