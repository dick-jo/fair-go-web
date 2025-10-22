<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import { CircleCheckBig } from '@lucide/svelte'
	import SEO from '$lib/components/SEO/SEO.svelte'

	const { data } = $props()
</script>

<SEO
	title="Donation Successful"
	description="Thank you for your support! Your donation has been processed successfully."
	noindex={true}
/>

<!-- TEMPLATE ------------------------------------------ -->
<section id="section--donate--success" class="host">
	<div class="container">
		<CircleCheckBig size={56} color={'var(--clr-sentiment-positive)'} />

		<h1>Thank You for Your Donation!</h1>

		<p class="text text--primary">Your generous support helps FairGo fight for a fairer Australia.</p>

		{#if data.amount}
			<div>
				<p><strong>Amount:</strong> ${(data.amount / 100).toFixed(2)}</p>
				{#if data.date}
					<p><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
				{/if}
			</div>
		{/if}

		<p class="text text--secondary">A receipt has been sent to your email address.</p>

		<a href="/">
			<Button label="Return to Home" />
		</a>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	#section--donate--success.host {
		padding: var(--gap-max);
		align-items: center;
		@media screen and (max-width: 560px) {
			padding: var(--gap-s);
		}

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

			/* TEXT ------------------------------------------------- */
			.text {
				&.text--secondary {
					color: var(--clr-ink-tr-heavy-x);
					font: var(--font--body--s);
				}
			}
		}
	}
</style>
