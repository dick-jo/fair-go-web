<script lang="ts">
	import { UsersRoundIcon } from '@lucide/svelte'
	import type { PageData } from './$types'
	import Button from '$lib/components/Button/Button.svelte'
	import { getMediaUrl } from '$lib/utils'
	import type { Tables } from '$lib/types/supabase.types'
	import HeroTitle from '$lib/components/HeroTitle/HeroTitle.svelte'

	type TeamMember = Tables<'team_members'>

	let { data }: { data: PageData } = $props()
</script>

{#snippet teamMemberTile(member: TeamMember)}
	<a href="/our-team/{member.slug}" class="team-member-tile">
		<div class="container">
			<div class="media-container">
				{#if member.profile_image_path}
					<img src={getMediaUrl(member.profile_image_path)} alt={member.profile_image_alt || member.name} />
				{/if}
				<div class="overlay"></div>
			</div>

			<div class="body">
				<div class="primary">
					<HeroTitle label={member.title} title={member.name} chunkSize={1} />
				</div>

				<div class="secondary">
					<Button label="Meet {member.name.split(' ')[0]}" />
				</div>
			</div>
		</div>
	</a>
{/snippet}

<section id="section--our-team">
	<div class="section-header section-header--grid">
		<div class="title-container">
			<UsersRoundIcon />
			<h2 class="text text--title">OUR TEAM</h2>
		</div>

		<p>
			Meet the FairGo team—everyday fighters driving change against the majors’ neglect. This is the crew shaping a
			fairer future with grit and common sense.
		</p>

		<p>
			Behind FairGo stands a bold crew of locals, tackling waste and lifting communities. Get to know the voices fueling
			our fight for a stronger, fairer Australia.
		</p>
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
			--loc-transition: var(--t-ix-transition);
			--loc-clr-border: var(--clr-dv-heavy-tr-light);
			&:hover {
				--loc-clr-border: var(--clr-primary);
			}
			width: 100%;
			height: 100%;
			padding: var(--gap-l);
			display: block;

			/* CONTAINER -------------------------------------------- */
			& > .container {
				--loc-ratio: 4/3;
				@media screen and (max-width: 480px) {
					--loc-ratio: 3/5;
				}
				width: 100%;
				aspect-ratio: var(--loc-ratio);
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
						background-image: linear-gradient(to top, var(--clr-bg-tr-heavy) 0%, var(--clr-bg-tr-invisible) 33% 100%);
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
