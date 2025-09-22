<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import { signUpWithMagicLinkClient } from '$lib/utils'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { toaster } from '$lib/services/toaster/service.svelte'

	interface Props {
		supabase: SupabaseClient
		source?: string
	}

	let { supabase, source = 'hero_signup' }: Props = $props()

	// STATE ------------------------------------------------ //
	let isSubmitting = $state(false)
	let status = $state<'idle' | 'success' | 'error'>('idle')
	let errorMessage = $state('')
	let successMessage = $state('')

	// Form values for preservation on error
	let formValues = $state({
		firstName: '',
		lastName: '',
		email: '',
		postcode: ''
	})

	// HANDLERS --------------------------------------------- //
	async function handleSubmit(event: Event) {
		event.preventDefault()

		isSubmitting = true
		status = 'idle'
		errorMessage = ''

		const formData = new FormData(event.target as HTMLFormElement)

		// Extract form values
		formValues = {
			firstName: (formData.get('firstName') as string) || '',
			lastName: (formData.get('lastName') as string) || '',
			email: (formData.get('email') as string) || '',
			postcode: (formData.get('postcode') as string) || ''
		}

		// Use shared auth utility
		const result = await signUpWithMagicLinkClient(supabase, {
			email: formValues.email,
			firstName: formValues.firstName,
			lastName: formValues.lastName,
			postcode: formValues.postcode,
			source
		})

		if (result.error) {
			status = 'error'
			errorMessage = result.error
			toaster.show(result.error, 'Error signing up', { type: 'negative' })
		} else {
			status = 'success'
			successMessage = result.message || 'Check your inbox for your magic link.'
			toaster.show(successMessage, 'Account Created!', { type: 'positive' })
			formValues = { firstName: '', lastName: '', email: '', postcode: '' }
		}

		isSubmitting = false
	}
</script>

<!-- MARKUP -------------------------------------------- -->
<div class="host">
	<form onsubmit={handleSubmit}>
		<div class="row">
			<Input id="firstName" name="firstName" label="First Name" type="text" required value={formValues.firstName} />
			<Input id="lastName" name="lastName" label="Last Name" type="text" required value={formValues.lastName} />
		</div>

		<div class="row">
			<Input id="signup-email" name="email" label="Email" type="email" required value={formValues.email} />
			<Input
				id="postcode"
				name="postcode"
				label="Postcode"
				type="text"
				required
				maxlength={4}
				placeholder="e.g. 5000"
				value={formValues.postcode}
			/>
		</div>
		<Button label={isSubmitting ? 'Creating Account...' : 'Sign Up'} type="submit" disabled={isSubmitting} />
	</form>
</div>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-gap: var(--gap-s);
		display: flex;
		flex-direction: column;
		gap: var(--loc-gap);

		/* FORM ------------------------------------------------- */
		form {
			display: flex;
			flex-direction: column;
			gap: var(--gap-s);

			/* ROW -------------------------------------------------- */
			.row {
				--loc-flex-direction: column;
				@container (min-width: 640px) {
					--loc-flex-direction: row;
				}
				display: flex;
				flex-direction: var(--loc-flex-direction);
				gap: var(--loc-gap);
			}
		}
	}
</style>
