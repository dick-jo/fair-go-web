<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { ContactFormData } from '$lib/types';

	interface Props {
		variant?: 'full' | 'email-only';
		source?: string;
		buttonText?: string;
		placeholder?: string;
	}

	let {
		variant = 'full',
		source = 'unknown',
		buttonText = 'Join Us',
		placeholder = 'Enter your email'
	}: Props = $props();

	// Form state using Svelte 5 runes
	let formData = $state<ContactFormData>({
		email: '',
		first_name: '',
		last_name: '',
		postcode: ''
	});

	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (isSubmitting) return;

		isSubmitting = true;
		submitStatus = 'idle';
		errorMessage = '';

		try {
			// Basic email validation
			if (!formData.email || !formData.email.includes('@')) {
				throw new Error('Please enter a valid email address');
			}

			// Prepare data for database
			const contactData = {
				email: formData.email.trim().toLowerCase(),
				first_name: variant === 'full' ? formData.first_name?.trim() || null : null,
				last_name: variant === 'full' ? formData.last_name?.trim() || null : null,
				postcode: variant === 'full' ? formData.postcode?.trim() || null : null,
				source: source
			};

			// Insert into Supabase
			const { data, error } = await supabase.from('contacts').insert([contactData]).select();

			if (error) {
				// Handle duplicate email gracefully
				if (error.code === '23505') {
					throw new Error('This email is already registered with us!');
				}
				throw new Error(error.message);
			}

			console.log('Contact created:', data);

			// Send welcome email (don't fail signup if email fails)
			fetch('/api/send-welcome-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: contactData.email,
					firstName: contactData.first_name
				})
			}).catch((error) => {
				console.error('Welcome email failed:', error);
				// Email failure doesn't affect signup success
			});

			// Success!
			submitStatus = 'success';

			// Reset form
			formData = {
				email: '',
				first_name: '',
				last_name: '',
				postcode: ''
			};
		} catch (error) {
			console.error('Signup error:', error);
			submitStatus = 'error';
			errorMessage =
				error instanceof Error ? error.message : 'Something went wrong. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="contact-form">
	<form onsubmit={handleSubmit}>
		{#if variant === 'full'}
			<div class="form-row">
				<div class="form-field">
					<label for="first_name">First Name</label>
					<input
						id="first_name"
						type="text"
						bind:value={formData.first_name}
						placeholder="First name"
						required
					/>
				</div>
				<div class="form-field">
					<label for="last_name">Last Name</label>
					<input
						id="last_name"
						type="text"
						bind:value={formData.last_name}
						placeholder="Last name"
						required
					/>
				</div>
			</div>
		{/if}

		<div class="form-field">
			<label for="email">Email</label>
			<input id="email" type="email" bind:value={formData.email} {placeholder} required />
		</div>

		{#if variant === 'full'}
			<div class="form-field">
				<label for="postcode">Postcode</label>
				<input
					id="postcode"
					type="text"
					bind:value={formData.postcode}
					placeholder="e.g. 5000"
					title="Please enter a 4-digit postcode"
					required
				/>
			</div>
		{/if}

		<button type="submit" disabled={isSubmitting}>
			{isSubmitting ? 'Joining...' : buttonText}
		</button>

		{#if submitStatus === 'success'}
			<div class="success-message">✅ Thank you! We'll be in touch soon.</div>
		{/if}

		{#if submitStatus === 'error'}
			<div class="error-message">
				❌ {errorMessage}
			</div>
		{/if}
	</form>
</div>

<style>
</style>
