<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import { CircleCheckBig } from '@lucide/svelte'

	const { data } = $props()
</script>

<section style="padding: var(--gap-max); text-align: center;">
	<CircleCheckBig size={64} style="color: var(--clr-success); margin: 0 auto;" />

	<h1>Thank You for Your Donation!</h1>

	<p>Your generous support helps FairGo fight for a fairer Australia.</p>

	{#if data.amount}
		<div>
			<p><strong>Amount:</strong> ${(data.amount / 100).toFixed(2)}</p>
			{#if data.date}
				<p><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</p>
			{/if}
		</div>
	{/if}

	<p style="margin-top: 2rem;">A receipt has been sent to your email address.</p>

	<div style="margin-top: 2rem;">
		<Button label="Return to Home" onclick={() => (window.location.href = '/')} />
	</div>
</section>
