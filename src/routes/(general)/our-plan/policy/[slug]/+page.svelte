<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown'
	import type { PageData } from './$types'
	import Delin from '$lib/components/Delin/Delin.svelte'
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte'
	import HeroTitle from '$lib/components/HeroTitle/HeroTitle.svelte'
	import ArticleMetaRow from '$lib/components/ArticleMetaRow/ArticleMetaRow.svelte'
	import Breadcrumbs from '$lib/components/Breadcrumbs/Breadcrumbs.svelte'
	import Chip from '$lib/components/Chip/Chip.svelte'
	import DateLabel from '$lib/components/DateLabel/DateLabel.svelte'
	import SEO from '$lib/components/SEO/SEO.svelte'
	import { generateBreadcrumbSchema } from '$lib/utils/breadcrumbSchema'

	const { data }: { data: PageData } = $props()
	const { policy } = data

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Our Plan', href: '/our-plan' },
		{ label: 'Policy', href: '/our-plan/policy' },
		...(policy.category?.[0]
			? [
					{
						label: policy.category[0],
						href: `/our-plan/policy?category=${policy.category[0]}`
					}
				]
			: []),
		{ label: policy.short_title || policy.title }
	]

	const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems)
</script>

<SEO
	title={policy.short_title || policy.title}
	description={policy.snippet || policy.introduction || `Fair Go's policy on ${policy.title}`}
/>

<svelte:head>
	{@html `<script type="application/ld+json">${breadcrumbSchema}</script>`}
</svelte:head>

<!-- HTML ---------------------------------------------- -->
<div class="page-clamp">
	<article class="host">
		<!-- HEADER -->
		<header>
			<Breadcrumbs
				items={[
					{ label: 'Home', href: '/' },
					{ label: 'Our Plan', href: '/our-plan' },
					{ label: 'Policy', href: '/our-plan/policy' },
					...(policy.category?.[0]
						? [
								{
									label: policy.category[0],
									href: `/our-plan/policy?category=${policy.category[0]}`
								}
							]
						: []),
					{ label: policy.short_title || policy.title }
				]}
			/>

			<HeroTitle title={policy.title} label="FairGo Policy" />

			<ArticleMetaRow>
				{#snippet categories()}
					{#each policy.category || [] as cat}
						<Chip href="/our-plan/policy?category={cat}" label={cat} />
					{/each}
				{/snippet}
				{#snippet dates()}
					<DateLabel label="published" date={policy.created_at} />
					<DateLabel label="updated" date={policy.updated_at} />
				{/snippet}
			</ArticleMetaRow>
		</header>

		<!-- INTRODUCTION -->
		{#if policy.introduction}
			<section class="section--introduction">
				<div class="title-wrapper">
					<Delin fontSize="l">
						<h2>Introduction</h2>
					</Delin>
				</div>

				<SvelteMarkdown source={policy.introduction} />
			</section>
		{/if}

		<!-- PROBLEM -->
		<section class="section--problem">
			<div class="title-wrapper">
				<Delin fontSize="l">
					<h2>The Problem</h2>
				</Delin>
			</div>

			<SvelteMarkdown source={policy.problem || ''} />
		</section>

		<!-- SOLUTION -->
		<section class="section--solution">
			<div class="title-wrapper">
				<Delin fontSize="l">
					<h2>The Solution</h2>
				</Delin>
			</div>

			<SvelteMarkdown source={policy.solution || ''} />
		</section>

		<!-- RATIONALE -->
		{#if policy.solution_rationale}
			<section class="section--rationale">
				<div class="title-wrapper">
					<Delin fontSize="l">
						<h2>Why This Works</h2>
					</Delin>
				</div>

				<SvelteMarkdown source={policy.solution_rationale} />
			</section>
		{/if}

		<!-- OUTCOMES -->
		{#if policy.outcomes}
			<section class="section--outcomes">
				<div class="title-wrapper">
					<Delin fontSize="l">
						<h2>Expected Outcomes</h2>
					</Delin>
				</div>

				<SvelteMarkdown source={policy.outcomes} />
			</section>
		{/if}
	</article>
</div>

<SectionCtaRow />

<!-- CSS ----------------------------------------------- -->
<style>
	.page-clamp {
		--loc-gap: var(--gap-max);
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--loc-gap);
		border-bottom: var(--bdw) solid var(--clr-dv);

		article {
			max-width: var(--clamp--content-width--s);
			padding: var(--loc-gap) 0;
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);
			@media screen and (max-width: 1080px) {
				padding: var(--loc-gap);
			}

			/* HEADER ----------------------------------------------- */
			& > header {
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);
			}

			/* SECTION ---------------------------------------------- */
			section {
				--loc-gap: var(--gap-l);
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);

				/* TITLE WRAPPER ---------------------------------------- */
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
			}
		}
	}
</style>
