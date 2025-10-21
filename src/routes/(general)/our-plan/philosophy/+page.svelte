<script lang="ts">
	import { LightbulbIcon, TargetIcon, ShieldXIcon, HeartHandshakeIcon } from '@lucide/svelte'
	import ContentSnippetTile from '$lib/components/ContentSnippetTile/ContentSnippetTile.svelte'
	import type { PageData } from './$types'
	import SectionCtaRow from '$lib/components/SectionCtaRow/SectionCtaRow.svelte'

	const { data }: { data: PageData } = $props()
</script>

<!-- HTML ---------------------------------------------- -->
<section id="section--philosophy">
	<!-- HEADER -->
	<div class="section-header section-header--grid">
		<div class="title-container">
			<LightbulbIcon />
			<h1 class="text text--title">THE FAIRGO PHILOSOPHY</h1>
		</div>
		<p>
			Welcome to FairGo's philosophy—our fierce blueprint for a fairer Australia, built by everyday people fed up with
			the majors' failures. Dive into the values driving real change.
		</p>
		<p>
			Explore FairGo's guiding principles of freedom, accountability, and community strength. See how we stand against
			waste and tyranny to shape a fairer, united Australia.
		</p>
	</div>

	<!-- VALUES -->
	<div class="body">
		<div class="section-header section-header--flex">
			<div class="title-container">
				<HeartHandshakeIcon />
				<h2 class="text text--title">Our Values</h2>
			</div>
		</div>
		<div class="grid">
			{#each data.values as item}
				<div class="item">
					<ContentSnippetTile title={item.title} content={item.content} />
				</div>
			{/each}
		</div>
	</div>

	<!-- OBJECTIVES -->
	<div class="body">
		<div class="section-header section-header--flex">
			<div class="title-container">
				<TargetIcon />
				<h2 class="text text--title">Our Objectives</h2>
			</div>
		</div>
		<div class="grid">
			{#each data.objectives as item}
				<div class="item">
					<ContentSnippetTile title={item.title} content={item.content} />
				</div>
			{/each}
		</div>
	</div>

	<!-- OPPOSITIONS -->
	<div class="body">
		<div class="section-header section-header--flex">
			<div class="title-container">
				<ShieldXIcon />
				<h2 class="text text--title">We Stand Against</h2>
			</div>
		</div>
		<div class="grid">
			{#each data.oppositions as item}
				<div class="item">
					<ContentSnippetTile title={item.title} content={item.content} />
				</div>
			{/each}
		</div>
	</div>
</section>

<SectionCtaRow />

<!-- CSS ----------------------------------------------- -->
<style>
	#section--philosophy {
		/* BODY ------------------------------------------------- */
		.body {
			display: flex;
			flex-direction: column;

			/* SECTION HEADERS -------------------------------------- */
			& > .section-header {
				position: sticky;
				top: var(--layout--nav-top--height);
				background-color: var(--clr-bg);
			}

			/* GRID ------------------------------------------------- */
			.grid {
				display: grid;
				grid-template-columns: repeat(12, 1fr);
				border-bottom: var(--bdw) solid var(--clr-dv);
				.body:last-child & {
					border-bottom: none;
				}

				& > .item {
					--loc-grid-cols: 4;
					@media screen and (max-width: 1080px) {
						--loc-grid-cols: 6;
					}
					@media screen and (max-width: 560px) {
						--loc-grid-cols: 12;
					}
					grid-column: span var(--loc-grid-cols);
				}
			}
		}
	}
</style>
