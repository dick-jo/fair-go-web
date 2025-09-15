<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	let email = '';
	let loading = false;
	let status: 'idle' | 'success' | 'error' | 'not-found' = 'idle';
	let currentSubscription: boolean | null = null;
	let errorMessage = '';

	async function checkEmailStatus() {
		if (!email || !email.includes('@')) {
			errorMessage = 'Please enter a valid email address';
			status = 'error';
			return;
		}

		loading = true;
		status = 'idle';

		try {
			const { data, error } = await supabase
				.from('contacts')
				.select('email_subscribed')
				.eq('email', email.toLowerCase().trim())
				.single();

			if (error || !data) {
				status = 'not-found';
			} else {
				currentSubscription = data.email_subscribed;
				status = 'success';
			}
		} catch (error) {
			console.error('Error checking email:', error);
			status = 'error';
			errorMessage = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function updatePreference(subscribed: boolean) {
		loading = true;

		try {
			const { error } = await supabase
				.from('contacts')
				.update({ email_subscribed: subscribed })
				.eq('email', email.toLowerCase().trim());

			if (error) {
				throw error;
			}

			currentSubscription = subscribed;
			status = 'success';
		} catch (error) {
			console.error('Error updating preference:', error);
			status = 'error';
			errorMessage = 'Failed to update preference. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<h1>Email Preferences</h1>

	{#if status === 'idle' || status === 'error' || status === 'not-found'}
		<div class="form-section">
			<p>Enter your email address to manage your email preferences:</p>

			<form on:submit|preventDefault={checkEmailStatus}>
				<input type="email" bind:value={email} placeholder="your.email@example.com" required />
				<button type="submit" disabled={loading}>
					{loading ? 'Checking...' : 'Check Status'}
				</button>
			</form>

			{#if status === 'not-found'}
				<p class="message">Email address not found in our system.</p>
			{/if}

			{#if status === 'error'}
				<p class="error">{errorMessage}</p>
			{/if}
		</div>
	{/if}

	{#if status === 'success' && currentSubscription !== null}
		<div class="preference-section">
			<p><strong>Email:</strong> {email}</p>
			<p><strong>Current status:</strong> {currentSubscription ? 'Subscribed' : 'Unsubscribed'}</p>

			<div class="actions">
				{#if currentSubscription}
					<button on:click={() => updatePreference(false)} disabled={loading}>
						{loading ? 'Updating...' : 'Unsubscribe'}
					</button>
				{:else}
					<button on:click={() => updatePreference(true)} disabled={loading}>
						{loading ? 'Updating...' : 'Resubscribe'}
					</button>
				{/if}
			</div>

			<button
				on:click={() => {
					status = 'idle';
					email = '';
					currentSubscription = null;
				}}
			>
				Check Another Email
			</button>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 500px;
		margin: 2rem auto;
		padding: 2rem;
	}

	.form-section,
	.preference-section {
		margin: 1rem 0;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		margin: 0.5rem 0;
	}

	button {
		padding: 0.5rem 1rem;
		margin: 0.5rem;
		cursor: pointer;
	}

	.message {
		color: #666;
	}

	.error {
		color: #d32f2f;
	}

	.actions {
		margin: 1rem 0;
	}
</style>
