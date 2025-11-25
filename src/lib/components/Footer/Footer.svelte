<script lang="ts">
	import { NAV_ITEMS, NAV_CATEGORIES, CATEGORY_CONFIG } from '$lib/config'
	import Input from '$lib/components/Input/Input.svelte'
	import Button from '$lib/components/Button/Button.svelte'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import type { NavItem } from '$lib/config'

	// FORM HANDLING ---------------------------------------- //
	let subscribeFormEmail = $state('')
	let subscribeFormIsSubmitting = $state(false)

	async function handleSubscribe(e: Event) {
		e.preventDefault()

		if (!subscribeFormEmail.trim() || subscribeFormIsSubmitting) return

		subscribeFormIsSubmitting = true

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: subscribeFormEmail.trim(),
					source: 'website_footer'
				})
			})

			const data = await response.json()

			if (!response.ok) {
				toaster.show('failure', data.message, { type: 'negative' })
			} else {
				toaster.show('success', data.message, { type: 'positive' })
				subscribeFormEmail = ''
			}
		} catch (error) {
			toaster.show('failure', 'Something went wrong. Please try again.', {
				type: 'negative'
			})
		} finally {
			subscribeFormIsSubmitting = false
		}
	}

	// CONTENT INIT ----------------------------------------- //
	const getItemsByCategory = (category: string): NavItem[] => {
		const items: NavItem[] = []

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

				<form onsubmit={handleSubscribe}>
					<Input
						id="footer-email"
						name="email"
						type="email"
						label="Stay updated"
						placeholder="Enter your email"
						bind:value={subscribeFormEmail}
						disabled={subscribeFormIsSubmitting}
						required
					/>
					<Button
						type="submit"
						label={subscribeFormIsSubmitting ? 'Subscribing...' : 'Subscribe'}
						disabled={subscribeFormIsSubmitting}
					/>
				</form>
			</div>
		</div>

		{#each NAV_CATEGORIES as category}
			{@const categoryItems = getItemsByCategory(category)}
			{@const categoryConfig = CATEGORY_CONFIG[category]}
			{#if categoryItems.length > 0}
				<div class="col">
					<a class="category-link" href={categoryConfig.href}>
						<h3>{categoryConfig.label}</h3>
					</a>
					{#each categoryItems as item}
						<a class="link-item" href={item.href}>{item.label}</a>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>

<div id="footer--authorisation">
	<span
		>Authorized by Henry Davis for Sarah Game-Fair Go for Australians (Incorporation Number A45670), 447 Brighton Rd.,
		Brighton, 5048</span
	>
</div>

<!-- CSS remains the same -->
<style>
	.host {
		--loc-gap: var(--gap-l);
		width: 100%;
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: end;
		border-top: var(--bdw) solid var(--clr-dv);
		@media screen and (max-width: 1600px) {
			padding: 0 var(--loc-gap);
		}

		.clamp {
			width: 100%;
			max-width: var(--clamp--content-width--max);
			display: flex;
			gap: var(--loc-gap);
			@media screen and (max-width: 960px) {
				flex-direction: column;
			}

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
						font: var(--font--label--secondary--s);
						text-transform: var(--text-case--label);
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

						form {
							display: flex;
							flex-direction: column;
							gap: calc(var(--loc-gap) / 2);
						}
					}
				}
			}
		}
	}

	#footer--authorisation {
		padding: var(--gap-l);
		display: flex;
		justify-content: center;
		align-items: center;

		& > span {
			font: var(--font--body--secondary);
			font-size: var(--fs-1);
			text-align: center;
		}
	}
</style>
