<script lang="ts">
	import FormSignUp from '../FormSignUp/FormSignUp.svelte';

	import { NAV_CATEGORIES, NAV_ITEMS, SOCIAL_LINKS } from '$lib/config';

	interface Props {}
	let {}: Props = $props();

	// Group nav items by category, including children
	const getItemsByCategory = (category: string) => {
		const items: any[] = [];

		NAV_ITEMS.forEach((item) => {
			// Add main item if it matches category and should show in footer, but only if it has no children
			if (item.category === category && item.showInFooter && !item.children) {
				items.push(item);
			}

			// Add children if they match category and should show in footer
			if (item.children) {
				item.children.forEach((child) => {
					if (child.category === category && child.showInFooter) {
						items.push(child);
					}
				});
			}
		});

		return items;
	};

	// Get the category index page href (convert to lowercase and replace spaces with hyphens)
	const getCategoryHref = (category: string) => {
		return `/${category.toLowerCase().replace(/\s+/g, '-')}`;
	};
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
			<FormSignUp variant="email-only" />
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
				/* --loc-grid-cols: 3; */
				padding: var(--loc-gap) 0;
				/* grid-column: span var(--loc-grid-cols); */
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
					text-decoration: none;
					h3 {
						margin: 0;
						color: inherit;
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
					.row {
						display: flex;
						.brand-container {
							height: var(--sp-9);
							img {
								height: 100%;
							}
						}
					}
				}
			}
		}
	}
</style>
