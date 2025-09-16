<script lang="ts">
	import CtaBox from '../CtaBox/CtaBox.svelte';
</script>

<!-- MARKUP -->
<section id="section--cta-row" class="host section--cta-row">
	<div class="item">
		<CtaBox
			title="Become a Member"
			label="join the fight, have a go"
			intent="secondary"
			content="Join Sarah Game's Fair Go For Australians and stand for a nation where hard work is rewarded, parents protect their kids, and communities are safe and strong. Be part of our movement to cut power bills, uphold parental rights, and deliver tough, fair justice—sign up today to help us build a better future for all Australians!"
			buttonLabel="Become a Member"
		/>
	</div>

	<div class="item">
		<CtaBox
			title="Donate Today"
			label="chip in"
			intent="primary"
			content="Join Sarah Game's Fair Go For Australians and stand for a nation where hard work is rewarded, parents protect their kids, and communities are safe and strong. Be part of our movement to cut power bills, uphold parental rights, and deliver tough, fair justice—sign up today to help us build a better future for all Australians!"
			buttonLabel="Donate"
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
