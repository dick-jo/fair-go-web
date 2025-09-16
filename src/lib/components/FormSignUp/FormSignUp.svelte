<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import type { ContactFormData } from '$lib/types';
	import { validatePostcode } from '$lib/utils/validatePostcode';
	import { OctagonAlert, SquareCheckBig } from '@lucide/svelte';
	import AlertBox from '../AlertBox/AlertBox.svelte';
	import Button from '../Button/Button.svelte';
	import Input from '../Input/Input.svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		variant?: 'full' | 'email-only';
		source?: string;
	}

	let { variant = 'full', source = 'unknown' }: Props = $props();

	// STATE ------------------------------------------------ //
	let formData = $state<ContactFormData>({
		email: '',
		first_name: '',
		last_name: '',
		postcode: ''
	});

	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessage = $state('');
	let postcodeError = $state('');

	// VALIDATION ------------------------------------------- //
	function handlePostcodeChange() {
		// Only show error if they've typed at least 4 characters
		if (
			formData.postcode &&
			formData.postcode.length >= 4 &&
			!validatePostcode(formData.postcode)
		) {
			postcodeError = 'Please enter a valid Australian postcode';
		} else {
			postcodeError = '';
		}
	}

	// FORM ------------------------------------------------- //
	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (isSubmitting) return;

		isSubmitting = true;
		submitStatus = 'idle';
		errorMessage = '';

		try {
			// Validate postcode if present (only for full variant)
			if (variant === 'full' && formData.postcode && !validatePostcode(formData.postcode)) {
				throw new Error('Please enter a valid Australian postcode');
			}

			// Prepare data based on variant
			const contactData =
				variant === 'email-only'
					? {
							email: formData.email.trim().toLowerCase(),
							source: source,
							created_at: new Date().toISOString()
						}
					: {
							email: formData.email.trim().toLowerCase(),
							first_name: formData.first_name?.trim() || null,
							last_name: formData.last_name?.trim() || null,
							postcode: formData.postcode?.trim() || null,
							source: source,
							created_at: new Date().toISOString()
						};

			// Insert into Supabase
			const { error } = await supabase.from('contacts').insert([contactData]);

			if (error) {
				console.error('Supabase error:', error);

				// Handle specific error cases
				if (error.code === '23505') {
					// Unique constraint violation (duplicate email)
					throw new Error('This email is already registered with us!');
				} else if (error.code === '23502') {
					// Not null violation
					throw new Error('Please fill in all required fields');
				} else if (error.code === '22001') {
					// String too long
					throw new Error('One of your entries is too long');
				} else {
					// Generic database error
					throw new Error('Unable to save your information. Please try again.');
				}
			}

			// Send welcome email (don't fail signup if email fails)
			try {
				await fetch('/api/send-welcome-email', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: contactData.email,
						firstName: contactData.first_name || null,
						variant: variant // This was missing!
					})
				});
			} catch (emailError) {
				console.error('Welcome email failed:', emailError);
				// Email failure doesn't affect signup success
			}

			// Success!
			submitStatus = 'success';

			// Reset form
			formData = {
				email: '',
				first_name: '',
				last_name: '',
				postcode: ''
			};
			postcodeError = '';
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

<div class="host form--sign-up">
	<form onsubmit={handleSubmit}>
		{#if variant === 'full'}
			<div class="row">
				<Input
					id="first_name"
					type="text"
					label="First Name"
					placeholder="First name"
					required
					bind:value={formData.first_name}
				/>

				<Input
					id="last_name"
					type="text"
					label="Last Name"
					placeholder="Last name"
					required
					bind:value={formData.last_name}
				/>
			</div>
		{/if}

		<div class="row">
			<Input
				id="email"
				type="email"
				label="Email"
				placeholder="yourname@gmail.com"
				required
				bind:value={formData.email}
			/>

			{#if variant === 'full'}
				<Input
					id="postcode"
					type="text"
					label="Postcode"
					placeholder="e.g. 5000"
					title="Please enter a valid Australian postcode"
					maxlength={4}
					error={postcodeError}
					required
					bind:value={formData.postcode}
					oninput={handlePostcodeChange}
				/>
			{/if}
		</div>

		<div class="action-container">
			{#if submitStatus === 'success'}
				<div class="feedback-container" transition:fly={{ y: 100 }}>
					<AlertBox
						label="Subscription Succesful!"
						message="You will receive a welcome email shortly."
						colorway="sentiment-positive"
						icon={SquareCheckBig}
						useShadow={true}
						isEphemeral={true}
					/>
				</div>
			{/if}
			{#if submitStatus === 'error'}
				<div class="feedback-container" transition:fly={{ y: 100 }}>
					<AlertBox
						label="Error signing up"
						message={errorMessage}
						colorway="sentiment-negative"
						icon={OctagonAlert}
						useShadow={true}
						isEphemeral={true}
					/>
				</div>
			{/if}
			<Button
				label={isSubmitting ? 'Signing Up...' : 'Sign Up'}
				type="submit"
				disabled={isSubmitting}
			/>
		</div>
	</form>
</div>

<style>
	.host {
		--loc-gap: var(--gap-s);

		/* FORM ------------------------------------------------- */
		form {
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);

			/* ROW -------------------------------------------------- */
			.row {
				display: flex;
				/* flex-direction: column; */
				gap: var(--loc-gap);
				/* @container (max-width: ) */
			}

			/* ACTION CONTAINER ------------------------------------- */
			.action-container {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: var(--loc-gap);

				/* FEEDBACK --------------------------------------------- */
				.feedback-container {
					position: absolute;
					top: 0;
					right: 0;
					/* bottom: 0; */
					left: 0;
					/* display: flex; */
					/* justify-content: center; */
					/* align-items: center; */
					transform: translateY(calc(-100% - var(--loc-gap)));
				}
			}
		}
	}
</style>
