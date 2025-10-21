<script lang="ts">
	const { data } = $props()

	function formatDate(dateString: string | null) {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleDateString('en-AU', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	}

	function formatAmount(cents: number) {
		return `$${(cents / 100).toFixed(2)}`
	}

	function getStripeUrl(paymentId: string) {
		// Links to Stripe Dashboard - test mode for now
		// TODO
		const baseUrl = 'https://dashboard.stripe.com/test'

		if (paymentId.startsWith('pi_')) {
			return `${baseUrl}/payments/${paymentId}`
		} else if (paymentId.startsWith('in_')) {
			return `${baseUrl}/invoices/${paymentId}`
		}
		return null
	}
</script>

{#if data.transactions.length === 0}
	<p>No transactions yet.</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>Date</th>
				<th>Type</th>
				<th>Amount</th>
				<th>Status</th>
				<th>Subscription</th>
				<th>Receipt</th>
			</tr>
		</thead>
		<tbody>
			{#each data.transactions as txn}
				<tr>
					<td>{formatDate(txn.created_at)}</td>
					<td>{txn.transaction_type}</td>
					<td>{formatAmount(txn.amount)}</td>
					<td>{txn.status}</td>
					<td>{txn.stripe_subscription_id ? 'Recurring' : 'One-time'}</td>
					<td>
						{#if txn.stripe_payment_id && getStripeUrl(txn.stripe_payment_id)}
							<a href={getStripeUrl(txn.stripe_payment_id)} target="_blank" rel="noopener"> View </a>
						{:else}
							-
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: var(--bdw) solid var(--clr-dv);
		font: var(--font--body--s);
	}

	th {
		font: var(--font--heading--secondary--s);
	}

	a {
		text-transform: uppercase;
		font: var(--font--body--s);
		font-weight: 600;
	}
</style>
