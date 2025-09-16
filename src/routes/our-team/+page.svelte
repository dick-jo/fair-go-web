<script lang="ts">
	import { UsersRoundIcon } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Button from '$lib/components/Button/Button.svelte';
	import { splitStringToChunks, getMediaUrl } from '$lib/utils';
	import type { TeamMember } from '$lib/types';

	let { data }: PageProps = $props();
</script>

<!-- SNIPPETS ------------------------------------------ -->
{#snippet teamMemberTile(member: TeamMember)}
	<a href="/our-team/{member.slug}" class="team-member-tile">
		<div class="container">
			<div class="media-container">
				{#if member.profile_image}
					<img
						src={getMediaUrl(member.profile_image)}
						alt={member.profile_image.alt || member.name}
					/>
				{/if}
				<div class="overlay"></div>
			</div>

			<div class="body">
				<div class="primary">
					<h4 class="title--secondary">{member.title}</h4>
					<h3 class="title">
						{#each splitStringToChunks(member.name, 1) as chunk}
							<span>{chunk}</span>
						{/each}
					</h3>
				</div>

				<div class="secondary">
					<Button label="Meet {member.name.split(' ')[0]}" />
				</div>
			</div>
		</div>
	</a>
{/snippet}

<!-- MARKUP -------------------------------------------- -->
<section id="section--our-team">
	<div class="section-header">
		<UsersRoundIcon />
		<h2 class="title">OUR TEAM</h2>
	</div>

	<div class="section-body">
		{#each { length: Math.ceil(data.teamMembers.length / 2) } as _, rowIndex}
			<div class="row">
				{#each data.teamMembers.slice(rowIndex * 2, rowIndex * 2 + 2) as member}
					<div class="item">
						{@render teamMemberTile(member)}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	#section--our-team {
		.section-header {
			height: var(--sp-5);
			padding: 0 var(--gap-l);
			display: flex;
			align-items: center;
			gap: calc(var(--gap-l) / 2);
			border-bottom: var(--bdw) solid var(--clr-dv);

			.title {
				font: var(--font--heading--secondary);
				font-size: var(--fs-4);
			}
		}

		.section-body {
			/* ROW -------------------------------------------------- */
			.row {
				display: grid;
				grid-template-columns: repeat(12, 1fr);
				&:not(:last-child) {
					border-bottom: var(--bdw) solid var(--clr-dv);
				}

				/* ITEM ------------------------------------------------- */
				.item {
					--loc-grid-cols: 6;
					@media screen and (max-width: 960px) {
						--loc-grid-cols: 12;
					}
					grid-column: span var(--loc-grid-cols);
					&:not(:last-child) {
						border-right: var(--bdw) solid var(--clr-dv);
					}
					@media screen and (max-width: 960px) {
						&:not(:last-child) {
							border-right: none;
							border-bottom: var(--bdw) solid var(--clr-dv);
						}
					}
				}
			}
		}

		/* TEAM MEMBER TILE ------------------------------------- */
		.team-member-tile {
			--loc-height--min: calc(var(--sp-12) * 5);
			--loc-transition: var(--t-ix-transition);
			--loc-clr-border: var(--clr-dv-heavy-tr-light);
			&:hover {
				--loc-clr-border: var(--clr-primary);
			}
			@media screen and (max-width: 1200px) {
				--loc-height--min: calc(var(--sp-12) * 4);
			}
			@media screen and (max-width: 960px) {
				--loc-height--min: calc(var(--sp-12) * 6);
			}
			@media screen and (max-width: 560px) {
				--loc-height--min: calc(var(--sp-12) * 4);
			}
			width: 100%;
			height: 100%;
			min-height: var(--loc-height--min);
			padding: var(--gap-l);
			display: block;

			/* CONTAINER -------------------------------------------- */
			& > .container {
				width: 100%;
				height: 100%;
				position: relative;
				overflow: hidden;
				display: flex;
				align-items: end;
				background-color: var(--clr-dv);
				border: var(--bdw) solid var(--loc-clr-border);
				border-radius: var(--gap-l);
				transition: var(--loc-transition);

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
						transition: var(--loc-transition);
						.team-member-tile:hover & {
							transform: scale(1.125);
						}
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
					width: 100%;
					padding: var(--gap-l);
					display: flex;
					justify-content: space-between;
					gap: var(--gap-l);
					z-index: 1;
					@media screen and (max-width: 560px) {
						flex-direction: column;
					}

					/* PRIMARY ---------------------------------------------- */
					& > .primary {
						display: flex;
						flex-direction: column;
						gap: var(--gap-l);
					}

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
							font: var(--font--heading--l);
							font-size: var(--fs-6);
							background-color: var(--clr-bg);
							box-shadow: var(--sp-1) var(--sp-1) 0 var(--clr-primary);
							&:nth-child(2) {
								margin-left: var(--loc-gap-basis);
							}
						}
					}

					/* SECONDARY -------------------------------------------- */
					.secondary {
						display: flex;
						flex-direction: column;
						justify-content: end;
					}
				}
			}

			&:hover .media-container img {
				transform: scale(1.05);
			}
		}
	}
</style>
