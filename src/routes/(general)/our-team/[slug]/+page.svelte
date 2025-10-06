<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import { getMediaUrl } from '$lib/utils'
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte'
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte'
	import Breadcrumbs from '$lib/components/Breadcrumbs/Breadcrumbs.svelte'
	import HeroTitle from '$lib/components/HeroTitle/HeroTitle.svelte'
	import Delin from '$lib/components/Delin/Delin.svelte'
	import { LandPlotIcon } from '@lucide/svelte'
	import { getPolicyIcon } from '$lib/utils/policyIcons'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const { member, petPolicies } = data
</script>

<!-- HTML ---------------------------------------------- -->
<!-- HERO -->
{#if member.profile_image_path}
	<div id="hero-container">
		<div class="title-container">
			<HeroTitle label={member.title} title={member.name} chunkSize={1} />
		</div>
		<img
			src={getMediaUrl(member.hero_image_path || member.profile_image_path)}
			alt={member.hero_image_alt || member.profile_image_alt || member.name}
		/>
	</div>
{/if}

<!-- CLAMP -->
<!-- <div id="page-clamp"> -->
<article>
	<header class="clamp--section">
		<Breadcrumbs
			items={[{ label: 'Home', href: '/' }, { label: 'Our Team', href: '/our-team' }, { label: member.name }]}
		/>
	</header>

	<!-- INTRO -->
	{#if member.short_bio}
		<section id="section--introduction" class="section--bio clamp--section">
			<div class="title-wrapper">
				<Delin fontSize="l">
					<h2>Meet {member.name.split(' ')[0]}</h2>
				</Delin>
			</div>
			<SvelteMarkdown source={member.short_bio} />
		</section>
	{/if}

	<!-- PET POLICIES -->
	{#if petPolicies.length > 0}
		<section id="section--policy-snippets-row" class="layout--section">
			<div class="section-header section-header--flex">
				<div class="title-container">
					<LandPlotIcon />
					<h2 class="text text--title">{member.name.split(' ')[0]}'s Priority Policies</h2>
				</div>
			</div>

			<div class="section-body">
				{#each petPolicies as policy}
					<div class="item">
						<ContentSnippetTile
							title={policy.short_title || policy.title}
							content={policy.snippet}
							href={`/our-plan/policy/${policy.slug}`}
							icon={getPolicyIcon(policy.category)}
						/>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- BIO -->
	<section id="section--about" class="section--bio clamp--section">
		<div class="title-wrapper">
			<Delin fontSize="l">
				<h2>About {member.name.split(' ')[0]}</h2>
			</Delin>
		</div>
		<SvelteMarkdown source={member.bio} />
	</section>
</article>
<!-- </div> -->

<SectionCtaRow />

<!-- CSS ----------------------------------------------- -->
<style>
	/* HERO  ------------------------------------------------ */
	#hero-container {
		--loc-pad: var(--gap-max);
		--loc-pad--x: 0;
		--loc-ratio: 2.4/1;
		@media screen and (max-width: 1080px) {
			--loc-pad--x: var(--loc-pad);
		}
		@media screen and (max-width: 960px) {
			--loc-ratio: 3/2;
		}
		@media screen and (max-width: 560px) {
			--loc-ratio: 2/3;
		}
		width: 100%;
		aspect-ratio: var(--loc-ratio);
		padding: var(--loc-pad) var(--loc-pad--x);
		position: relative;
		display: flex;
		justify-content: center;
		align-items: end;
		border-bottom: var(--bdw) solid var(--clr-dv);

		.title-container {
			width: 100%;
			max-width: var(--clamp--content-width--s);
			position: relative;
			z-index: 2;
		}

		img {
			/* opacity: 0.5; */
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			z-index: 0;
		}
	}

	/* ARTICLE ---------------------------------------------- */
	article {
		--loc-gap: var(--gap-max);
		width: 100%;
		padding: var(--loc-gap) 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--loc-gap);
		border-bottom: var(--bdw) solid var(--clr-dv);
		&:last-child {
			border-bottom: none;
		}

		/* CLAMPS ----------------------------------------------- */
		.clamp--section {
			width: 100%;
			max-width: var(--clamp--content-width--s);
			@media screen and (max-width: 1080px) {
				padding: var(--loc-gap);
			}
		}

		/* HEADER ----------------------------------------------- */
		header {
			display: flex;
			flex-direction: column;
			gap: var(--gap-l);
		}

		/* SECTION ---------------------------------------------- */
		section.section--bio {
			--loc-gap: var(--gap-l);
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);

			.title-wrapper {
				position: sticky;
				top: var(--layout--nav-top--height);
				background-color: var(--clr-bg);
				&::after {
					content: '';
					position: absolute;
					right: 0;
					bottom: calc(var(--loc-gap) * -1);
					left: 0;
					height: var(--loc-gap);
					background-image: linear-gradient(to bottom, var(--clr-bg) 0%, var(--clr-bg-tr-invisible) 100%);
				}
			}

			/* TEXT OVERRIDES --------------------------------------- */
			:global(ol, ul) {
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);
			}
			:global(p, li) {
				line-height: var(--line-height--body--max);
			}
			&#section--introduction :global(p) {
				font: var(--font--body--l);
				line-height: 200%;
			}
		}
	}

	/* POLICY SNIPPETS -------------------------------------- */
	#section--policy-snippets-row {
		border-top: var(--bdw) solid var(--clr-dv);
		.section-body {
			display: grid;
			grid-template-columns: repeat(12, 1fr);

			.item {
				--loc-grid-cols: 4;
				@media screen and (max-width: 720px) {
					--loc-grid-cols: 12;
				}
				grid-column: span var(--loc-grid-cols);
				border-right: var(--bdw) solid var(--clr-dv);
				&:last-child {
					border-right: none;
				}
				@media screen and (max-width: 720px) {
					border-right: none;
					border-bottom: var(--bdw) solid var(--clr-dv);
					&:last-child {
						border-bottom: none;
					}
				}
			}
		}
	}
</style>
