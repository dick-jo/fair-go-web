<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import { CircleCheckBig } from '@lucide/svelte'
</script>

<!-- TEMPLATE ------------------------------------------ -->
<section id="section--membership--success" class="host">
	<div class="container">
		<CircleCheckBig size={56} color={'var(--clr-sentiment-positive)'} />

		<h1>Welcome to FairGo!</h1>

		<p>Your membership is now active. Thank you for joining the fight for a fairer Australia.</p>

		<a href="/">
			<Button label="Return to Home" />
		</a>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	#section--membership--success.host {
		padding: var(--gap-max);
		align-items: center;

		/* CONTAINER -------------------------------------------- */
		& > .container {
			width: 100%;
			max-width: var(--clamp--content-width--min);
			padding: var(--gap-l);
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--gap-l);
			background-color: var(--clr-ev);
			border: var(--bdw) solid var(--clr-dv);
			border-radius: var(--bdr-l);
			text-align: center;
		}
	}
</style>
