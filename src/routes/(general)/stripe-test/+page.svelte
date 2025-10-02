<script lang="ts">
	let loading = $state(false)
	let error = $state('')
	let recurring = $state(false)

	async function donate(amountInCents: number) {
		loading = true
		error = ''
		try {
			const response = await fetch('/api/donate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: amountInCents,
					recurring: recurring // Add this!
				})
			})
			if (!response.ok) {
				throw new Error('Payment failed')
			}
			const data = await response.json()
			window.location.href = data.url
		} catch (e) {
			error = 'Something went wrong'
			loading = false
		}
	}
</script>

<div style="max-width: 500px; margin: 4rem auto; text-align: center;">
	<h1>🧪 Donation Test</h1>
	<p>Choose an amount to donate:</p>

	<div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
		<button
			onclick={() => donate(1000)}
			disabled={loading}
			style="background: #5469d4; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;"
		>
			$10
		</button>

		<button
			onclick={() => donate(2500)}
			disabled={loading}
			style="background: #5469d4; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;"
		>
			$25
		</button>

		<button
			onclick={() => donate(5000)}
			disabled={loading}
			style="background: #5469d4; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;"
		>
			$50
		</button>
	</div>

	<label>
		<input type="checkbox" bind:checked={recurring} />
		Make this monthly
	</label>

	{#if loading}
		<p style="margin-top: 2rem; color: #666;">Redirecting to checkout...</p>
	{/if}

	{#if error}
		<p style="color: red; margin-top: 1rem;">{error}</p>
	{/if}
</div>
