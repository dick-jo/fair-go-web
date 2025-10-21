<script lang="ts">
	import AlertBox from '$lib/components/AlertBox/AlertBox.svelte'
	import Button from '$lib/components/Button/Button.svelte'
	import { OctagonAlert } from '@lucide/svelte'

	const { data } = $props()

	let cancelling = $state(false)
	let message = $state('')

	async function handleCancel() {
		if (!confirm('Are you sure you want to cancel your membership?')) {
			return
		}

		cancelling = true
		message = ''

		try {
			const response = await fetch('/api/cancel-subscription', {
				method: 'POST'
			})

			if (!response.ok) {
				throw new Error('Cancellation failed')
			}

			const result = await response.json()
			message = result.message
		} catch (e) {
			message = 'Failed to cancel subscription'
		} finally {
			cancelling = false
		}
	}
</script>

<!-- MARKUP -------------------------------------------- -->
{#if !data.profile?.is_member}
	<AlertBox
		label="No Membership"
		message="You do not currently have an active FairGo membership"
		colorway="sentiment-negative"
		icon={OctagonAlert}
	/>
{:else}
	<h3>Membership Status</h3>
	<div class="list-container">
		<div class="item">
			<span class="text text--label">Status:</span>
			<span class="text text--value">Active</span>
		</div>

		<div class="item">
			<span class="text text--label">Tier:</span>
			<span class="text text--value">{data.profile.membership_tier}</span>
		</div>

		<div class="item">
			<span class="text text--label">Member Since:</span>
			<span class="text text--value"
				>{data.profile.membership_paid_at ? new Date(data.profile.membership_paid_at).toLocaleDateString() : 'N/A'}
			</span>
		</div>

		<div class="item">
			<span class="text text--label">Type:</span>
			<span class="text text--value">{data.hasActiveSubscription ? 'Recurring (Annual)' : 'One-time'}</span>
		</div>

		<div class="item">
			<span class="text text--label">Expires:</span>
			<span class="text text--value"
				>{data.profile.membership_expires_at
					? new Date(data.profile.membership_expires_at).toLocaleDateString()
					: 'N/A'}</span
			>
		</div>
	</div>

	{#if data.hasActiveSubscription}
		<h3>Manage Subscription</h3>
		{#if data.cancelAtPeriodEnd}
			<p>Subscription will cancel at the end of your billing period</p>
		{:else}
			<Button label={cancelling ? 'Cancelling...' : 'Cancel Membership'} onclick={handleCancel} disabled={cancelling} />
		{/if}
		{#if message}
			<p>{message}</p>
		{/if}
	{/if}
{/if}

<!-- CSS ----------------------------------------------- -->
<style>
	.list-container {
		width: 100%;
		display: flex;
		flex-direction: column;

		& > .item {
			--loc-height: var(--sp-5);
			width: 100%;
			height: var(--loc-height);
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top: var(--bdw) solid var(--clr-dv);

			& > .text {
				&.text--label {
					font: var(--font--label);
				}
				&.text--value {
					font: var(--font--label--secondary--l);
					text-transform: var(--text-case--label);
				}
			}
		}
	}
</style>
