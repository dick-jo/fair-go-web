<script lang="ts">
	import CtaBox from '../CtaBox/CtaBox.svelte'
</script>

<!-- MARKUP -->
<section id="section--cta-row" class="host section--cta-row">
	<div class="item">
		<CtaBox
			title="Become a Member"
			label="join the fight, have a go"
			intent="secondary"
			content="Join FairGo For Australians and fight for a nation where hard work pays off, families thrive, and communities stand strong. Be part of our bold movement to slash waste, protect parental rights, and deliver fair justice—sign up now to shape a brighter future!"
			buttonLabel="Become a Member"
			href="/membership"
		/>
	</div>

	<div class="item">
		<CtaBox
			title="Donate Today"
			label="chip in"
			intent="primary"
			content="Back FairGo For Australians and power a country where effort is rewarded, kids are safe, and neighborhoods thrive. Fuel our gritty campaign to cut power bills, uphold freedoms, and enforce tough justice—donate today to drive real change!"
			buttonLabel="Donate"
			href="/donate"
		/>
	</div>
</section>

<!-- CSS -->
<style>
	#section--cta-row {
		--loc-gap: var(--gap-l);
		display: grid;
		grid-template-columns: repeat(12, 1fr);

		.item {
			--loc-grid-cols: 6;
			@media screen and (max-width: 720px) {
				--loc-grid-cols: 12;
			}
			padding: var(--loc-gap);
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
</style>
