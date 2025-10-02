<script lang="ts">
	import { page } from '$app/state'

	let { data } = $props()

	const sessionId = $derived(page.url.searchParams.get('session_id'))
</script>

<div style="max-width: 600px; margin: 4rem auto; padding: 2rem;">
	<h1>Payment Successful</h1>
	<p>Your membership is now active.</p>
	<p style="font-size: 0.875rem; color: #666;">Session: {sessionId}</p>

	{#each data.transactions as txn}
		<li>
			{txn.transaction_type} - ${(txn.amount / 100).toFixed(2)}
			{txn.stripe_subscription_id ? '(Recurring)' : '(One-time)'}
			{#if txn.created_at}
				- {new Date(txn.created_at).toLocaleDateString()}
			{/if}
		</li>
	{/each}

	<a href="/membership">Back to Membership</a>
</div>
