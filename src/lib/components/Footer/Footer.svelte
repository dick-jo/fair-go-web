<script lang="ts">
	import { NAV_ITEMS, NAV_CATEGORIES, SOCIAL_LINKS } from '$lib/config'
	import Input from '$lib/components/Input/Input.svelte'
	import Button from '$lib/components/Button/Button.svelte'
	import AlertBox from '$lib/components/AlertBox/AlertBox.svelte'
	import { OctagonAlertIcon, SquareCheckBig } from '@lucide/svelte'
	import { subscribeToNewsletterClient } from '$lib/utils'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { toaster } from '$lib/services/toaster/service.svelte'

	interface Props {
		supabase: SupabaseClient
	}

	let { supabase }: Props = $props()

	// Newsletter form state
	let email = $state('')
	let isSubmitting = $state(false)
	let status = $state<'idle' | 'success' | 'error'>('idle')
	let errorMessage = $state('')
	let successMessage = $state('')

	async function handleSubscribe(event: Event) {
		event.preventDefault()

		isSubmitting = true
		status = 'idle'

		const result = await subscribeToNewsletterClient(supabase, email, 'footer_newsletter')

		if (result.error) {
			status = 'error'
			errorMessage = result.error
			// Add this line:
			toaster.show(result.error, 'Subscription Error', { type: 'negative' })
		} else {
			status = 'success'
			successMessage = result.message || 'Thank you for subscribing!'
			// Add this line:
			toaster.show(successMessage, 'Subscribed!', { type: 'positive' })
			email = '' // Clear form on success
		}

		isSubmitting = false
	}

	// Group nav items by category, including children
	const getItemsByCategory = (category: string) => {
		const items: any[] = []
		NAV_ITEMS.forEach((item) => {
			// Add main item if it matches category and should show in footer, but only if it has no children
			if (item.category === category && item.showInFooter && !item.children) {
				items.push(item)
			}
			// Add children if they match category and should show in footer
			if (item.children) {
				item.children.forEach((child) => {
					if (child.category === category && child.showInFooter) {
						items.push(child)
					}
				})
			}
		})
		return items
	}

	// Get the category index page href (convert to lowercase and replace spaces with hyphens)
	const getCategoryHref = (category: string) => {
		return `/${category.toLowerCase().replace(/\s+/g, '-')}`
	}
</script>

<!-- MARKUP -------------------------------------------- -->
<div id="footer" class="host footer">
	<div class="clamp">
		<div class="col col--alt">
			<div class="row">
				<div class="brand-container">
					<img src="/brand/brand-a-text-ev.svg" alt="" />
				</div>
			</div>

			<div class="newsletter-section">
				<h3>Stay Updated</h3>
				<p>Get the latest news and updates delivered to your inbox.</p>

				<form onsubmit={handleSubscribe} class="newsletter-form">
					<Input
						id="footer-email"
						name="email"
						label="Email"
						type="email"
						required
						placeholder="yourname@gmail.com"
						bind:value={email}
					/>
					<Button label={isSubmitting ? 'Subscribing...' : 'Subscribe'} type="submit" disabled={isSubmitting} />
				</form>
			</div>
		</div>

		{#each NAV_CATEGORIES as category}
			{@const categoryItems = getItemsByCategory(category)}
			{#if categoryItems.length > 0}
				<div class="col">
					<a class="category-link" href={getCategoryHref(category)}>
						<h3>{category}</h3>
					</a>
					{#each categoryItems as item}
						<a class="link-item" href={item.href}>{item.label}</a>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-l);
		width: 100%;
		display: flex;
		justify-content: center;
		border-top: var(--bdw) solid var(--clr-dv);
		@media screen and (max-width: 1600px) {
			padding: 0 var(--loc-gap);
		}

		/* CLAMP ------------------------------------------------ */
		.clamp {
			width: 100%;
			max-width: var(--clamp--content-width--max);
			display: flex;
			gap: var(--loc-gap);
			@media screen and (max-width: 960px) {
				flex-direction: column;
			}

			/* COLS ------------------------------------------------- */
			.col {
				padding: var(--loc-gap) 0;
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: calc(var(--loc-gap) / 2);
				@media screen and (max-width: 960px) {
					width: 100%;
					align-items: center;
				}

				.category-link {
					--loc-clr-ink: var(--clr-ink);
					&:hover {
						--loc-clr-ink: var(--clr-primary-heavy);
					}
					color: var(--loc-clr-ink);
					h3 {
						font: var(--font--label--secondary);
					}
				}

				.link-item {
					--loc-clr-ink: var(--clr-primary);
					&:hover {
						--loc-clr-ink: var(--clr-primary-heavy);
					}
					color: var(--loc-clr-ink);
					font: var(--font--label--s);
					font-weight: 400;
				}

				&.col--alt {
					flex: 2;
					.row {
						display: flex;
						.brand-container {
							height: var(--sp-9);
							img {
								height: 100%;
							}
						}
					}

					.newsletter-section {
						display: flex;
						flex-direction: column;
						gap: calc(var(--loc-gap) / 2);

						h3 {
							font: var(--font--label--secondary);
							color: var(--clr-ink);
						}

						p {
							font: var(--font--body--s);
							color: var(--clr-ink-tr-heavy);
						}

						.newsletter-form {
							display: flex;
							flex-direction: column;
							gap: calc(var(--loc-gap) / 2);
						}
					}
				}
			}
		}
	}
</style>
