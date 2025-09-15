<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';
	let success = '';

	async function handleSubmit() {
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		const { data, error: authError } = await supabase.auth.signUp({ email, password });
		if (authError) {
			error = authError.message;
			return;
		}

		const userId = data.user!.id;
		const userEmail = data.user!.email!;
		const { data: existingContact } = await supabase
			.from('contacts')
			.select('*')
			.eq('email', userEmail)
			.single();

		if (existingContact) {
			success = 'thank you for sign up!';
			await supabase.from('contacts').update({ auth_id: userId }).eq('email', userEmail);
		} else {
			success = 'Check your email for confirmation!';
			await supabase.from('contacts').insert({ email: userEmail, auth_id: userId });
			await supabase.auth.resend({ type: 'signup', email: userEmail });
		}
	}
</script>

<h1>Sign Up</h1>

{#if error}
	<p style="color: red;">{error}</p>
{/if}

{#if success}
	<p style="color: green;">{success}</p>
{/if}

<form on:submit|preventDefault={handleSubmit}>
	<label for="email">Email:</label>
	<input type="email" id="email" bind:value={email} required /><br />

	<label for="password">Password:</label>
	<input type="password" id="password" bind:value={password} required /><br />

	<label for="confirmPassword">Confirm Password:</label>
	<input type="password" id="confirmPassword" bind:value={confirmPassword} required /><br />

	<button type="submit">Sign Up</button>
</form>
