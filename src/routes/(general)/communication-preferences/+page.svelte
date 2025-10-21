<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import InputCheckbox from '$lib/components/InputCheckbox/InputCheckbox.svelte'
	import { enhance } from '$app/forms'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import type { ActionResult } from '@sveltejs/kit'
	import type { ActionData, PageData } from './$types'

	const { data }: { data: PageData; form: ActionData } = $props()

	// STATE ------------------------------------------------ //
	type FormStatus = 'idle' | 'pending'

	const formState = $state({
		communicationPreferences: {
			status: 'idle' as FormStatus,
			hasChanges: false
		}
	})

	let emailInput = $state(data.user?.email || '')
	let emailOptIn = $state(data.subscriber?.email_opt_in ?? true)

	// HANDLERS --------------------------------------------- //
	function handleFormChange() {
		return () => {
			formState.communicationPreferences.hasChanges = true
		}
	}

	function handleSubmit() {
		formState.communicationPreferences.status = 'pending'

		return async ({
			result,
			update
		}: {
			result: ActionResult
			update: (options?: { reset?: boolean }) => Promise<void>
		}) => {
			await update({ reset: false })
			formState.communicationPreferences.status = 'idle'

			if (result.type === 'success' && result.data) {
				formState.communicationPreferences.hasChanges = false
				toaster.show(result.type, result.data.message, { type: 'positive' })
			} else if (result.type === 'failure' && result.data) {
				toaster.show(result.type, result.data.message, { type: 'negative' })
			}
		}
	}
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--email-preferences">
	<header>
		<h1>Communication Preferences</h1>
		<p>Manage your communication preferences below.</p>
	</header>

	<form
		method="POST"
		action="?/updateCommunicationPreferences"
		use:enhance={handleSubmit}
		oninput={handleFormChange()}
		onchange={handleFormChange()}
	>
		{#if !data.user}
			<Input id="email" name="email" label="Email Address" type="email" required bind:value={emailInput} />
		{:else}
			<div class="authenticated-email">
				<h2>Email Address:</h2>
				<p>{data.user.email}</p>
			</div>
			<input type="hidden" name="email" value={data.user.email} />
		{/if}

		<InputCheckbox
			id="emailOptIn"
			name="emailOptIn"
			label="I want to receive email updates about campaigns, events, and ways to get involved"
			bind:checked={emailOptIn}
		/>

		<Button
			label={formState.communicationPreferences.status === 'idle' ? 'Update Preferences' : 'Updating...'}
			type="submit"
			disabled={formState.communicationPreferences.status === 'pending' ||
				!formState.communicationPreferences.hasChanges}
		/>
	</form>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	section#section--email-preferences {
		width: 100%;
		max-width: var(--clamp--content-width--s-x);
		padding: var(--loc-gap);
		gap: var(--loc-gap);

		/* FORM ------------------------------------------------- */
		& > form {
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);

			h2 {
				font: var(--font--heading--s);
			}
		}
	}
</style>
