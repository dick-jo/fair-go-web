<script lang="ts">
	import {
		MapPinIcon,
		PhoneIcon,
		MailIcon,
		InstagramIcon,
		FacebookIcon,
		LandPlotIcon,
		Icon
	} from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { splitStringToChunks, getMediaUrl } from '$lib/utils';
	import { getPolicyIcon } from '$lib/utils/policyIcons';
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte';
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte';

	let { data }: PageProps = $props();

	const { teamMember } = data;
	const firstName = teamMember.name.split(' ')[0];

	// Get pet policies that exist
	const petPolicies = [
		teamMember.pet_policy_1,
		teamMember.pet_policy_2,
		teamMember.pet_policy_3
	].filter(
		(policy): policy is NonNullable<typeof policy> => policy !== null && policy !== undefined
	);
</script>

<!-- SNIPPETS ------------------------------------------ -->
{#snippet contactItem(IconComponent: typeof Icon, value: string)}
	<div class="contact-item">
		<div class="icon-container">
			<IconComponent />
		</div>
		<div class="body">
			<span class="value">{value}</span>
		</div>
	</div>
{/snippet}

<!-- MARKUP -------------------------------------------- -->
<!-- HERO ---------------------------------------------- -->
<section id="section--team-member-hero">
	<div class="primary">
		<div class="container">
			<div class="media-container">
				{#if teamMember.profile_image}
					<img
						src={getMediaUrl(teamMember.profile_image)}
						alt={teamMember.profile_image.alt || teamMember.name}
					/>
				{/if}
				<div class="overlay"></div>
			</div>

			<div class="body">
				<h2 class="title--secondary">{teamMember.title}</h2>
				<h1 class="title">
					{#each splitStringToChunks(teamMember.name, 1) as chunk}
						<span>{chunk}</span>
					{/each}
				</h1>
			</div>
		</div>
	</div>

	<div class="secondary">
		<div class="container">
			<h3 class="title">Get in touch with {firstName}</h3>

			<div class="body">
				{#if teamMember.address || teamMember.phone}
					<div class="row">
						{#if teamMember.address}
							{@render contactItem(MapPinIcon, teamMember.address)}
						{/if}
						{#if teamMember.phone}
							{@render contactItem(PhoneIcon, teamMember.phone)}
						{/if}
					</div>
				{/if}

				{#if teamMember.email || teamMember.instagram_handle}
					<div class="row">
						{#if teamMember.email}
							{@render contactItem(MailIcon, teamMember.email)}
						{/if}
						{#if teamMember.instagram_handle}
							{@render contactItem(InstagramIcon, teamMember.instagram_handle)}
						{/if}
					</div>
				{/if}

				{#if teamMember.facebook_handle}
					<div class="row">
						{@render contactItem(FacebookIcon, teamMember.facebook_handle)}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- POLICY -------------------------------------------- -->
{#if petPolicies.length > 0}
	<section id="section--policy-snippets-row">
		<div class="section-header">
			<LandPlotIcon />
			<h2 class="title">{firstName.toUpperCase()}'S PRIORITIES</h2>
		</div>
		<div class="section-body">
			{#each petPolicies as policy}
				<div class="item">
					<ContentSnippetTile
						title={policy.short_title || policy.title}
						content={policy.snippet}
						href={`#policy-${policy.id}`}
						icon={getPolicyIcon(policy.category)}
					/>
				</div>
			{/each}
		</div>
	</section>
{/if}

<!-- BIO ----------------------------------------------- -->
<section id="section--team-member-bio">
	<div class="section-body">
		<h2 class="title">Meet {firstName}</h2>
		{#each teamMember.bio.split('\n\n') as paragraph}
			<p class="content">{paragraph}</p>
		{/each}
	</div>
</section>

<!-- CTA ----------------------------------------------- -->
<SectionCtaRow />

<!-- CSS ----------------------------------------------- -->
<style>
	#section--team-member-hero {
		--loc-host-gradient: linear-gradient(
			to right,
			var(--clr-bg) 0% 50%,
			var(--clr-bg-tr-invisible) 100%
		);
		@media screen and (max-width: 1200px) {
			--loc-host-height: fit-content;
			--loc-host-gradient: linear-gradient(
				to bottom,
				var(--clr-bg) 0%,
				var(--clr-bg-tr-invisible) 100%
			);
		}
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		background-image:
			var(--loc-host-gradient), url('/brand/brand-a-pattern-mono-dv-text-subtract.svg');
		background-position:
			top left,
			top right;
		background-size: auto, 8vw;
		@media screen and (min-width: 1920px) {
			background-size: auto, 4vw;
		}
		@media screen and (max-width: 1200px) {
			background-size: auto, 15vw;
		}

		/* PRIMARY ---------------------------------------------- */
		& > .primary {
			--loc-height: calc(var(--sp-12) * 8);
			--loc-grid-cols: 8;
			@media screen and (max-width: 1440px) {
				--loc-height: calc(var(--sp-12) * 6);
			}
			@media screen and (max-width: 1080px) {
				--loc-grid-cols: 12;
			}
			height: var(--loc-height);
			padding: var(--loc-gap);
			grid-column: span var(--loc-grid-cols);

			/* CONTAINER -------------------------------------------- */
			& > .container {
				padding: var(--gap-max);
				width: 100%;
				height: 100%;
				position: relative;
				overflow: hidden;
				display: flex;
				align-items: end;
				background-color: var(--clr-dv);
				border: var(--bdw) solid var(--clr-dv-heavy-tr-light);
				border-radius: var(--bdr-l);

				/* MEDIA CONTAINER -------------------------------------- */
				.media-container {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
						object-position: center;
					}

					.overlay {
						position: absolute;
						top: 0;
						right: 0;
						bottom: 0;
						left: 0;
						background-image: linear-gradient(
							to top,
							var(--clr-bg-tr-heavy) 0%,
							var(--clr-bg-tr-invisible) 33% 100%
						);
					}
				}

				/* BODY ------------------------------------------------- */
				& > .body {
					display: flex;
					flex-direction: column;
					gap: var(--loc-gap);
					z-index: 1;

					/* TITLES ----------------------------------------------- */
					.title--secondary {
						padding: var(--gap-min);
						width: fit-content;
						background-color: var(--clr-primary);
						color: var(--clr-bg);
						font: var(--font--heading--secondary);
						text-transform: var(--text-case--heading);
					}

					.title {
						--loc-gap-basis: var(--sp-1);
						display: flex;
						flex-direction: column;
						text-transform: var(--text-case--heading);

						span {
							width: fit-content;
							padding: var(--gap-min) var(--gap-s);
							font: var(--font--heading);
							font-size: var(--fs-12);
							background-color: var(--clr-bg);
							box-shadow: var(--sp-1) var(--sp-1) 0 var(--clr-primary);
							&:nth-child(2) {
								margin-left: var(--loc-gap-basis);
							}
						}
					}
				}
			}
		}

		/* SECONDARY -------------------------------------------- */
		.secondary {
			--loc-grid-cols: 4;
			@media screen and (max-width: 1080px) {
				--loc-grid-cols: 12;
			}
			padding: var(--loc-gap);
			grid-column: span var(--loc-grid-cols);
			display: flex;
			flex-direction: column;
			@media screen and (min-width: 1080px) {
				padding-left: 0;
			}

			/* CONTAINER -------------------------------------------- */
			& > .container {
				padding: var(--loc-gap);
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);
				background-color: var(--clr-ev);
				border: var(--bdw) solid var(--clr-dv);
				border-radius: var(--bdr-l);

				/* TITLE ------------------------------------------------ */
				& > .title {
					font: var(--font--heading--s);
					font-weight: 600;
				}

				/* BODY ------------------------------------------------- */
				& > .body {
					display: flex;
					flex-direction: column;
				}
			}
		}

		/* SNIPPET: Contact Item -------------------------------- */
		.contact-item {
			--loc-height: var(--sp-5);
			height: var(--loc-height);
			display: flex;
			gap: var(--loc-gap);
			border-top: var(--bdw) solid var(--clr-dv);

			/* ICON ------------------------------------------------- */
			& > .icon-container {
				width: var(--loc-height);
				height: var(--loc-height);
				display: flex;
				justify-content: center;
				align-items: center;

				:global(svg) {
					stroke: var(--clr-ink);
				}
			}

			/* BODY ------------------------------------------------- */
			& > .body {
				display: flex;
				align-items: center;

				.value {
					font: var(--font--body--secondary);
				}
			}
		}
	}

	/* SECTION: Policy -------------------------------------- */
	#section--policy-snippets-row {
		.section-body {
			display: grid;
			grid-template-columns: repeat(12, 1fr);

			& > .item {
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

	/* SECTION: Bio ----------------------------------------- */
	#section--team-member-bio {
		align-items: center;
		.section-body {
			width: 100%;
			max-width: var(--clamp--content-width--s-x);
			padding: var(--gap-max);
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);

			.title {
				font: var(--font--heading--l);
			}

			.content {
				font: var(--font--body);
				font-size: var(--fs-4);
				line-height: var(--fs-8);
			}
		}
	}
</style>
