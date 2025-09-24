<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import InputCheckbox from '$lib/components/InputCheckbox/InputCheckbox.svelte'
	import AlertBox from '$lib/components/AlertBox/AlertBox.svelte'
	import { OctagonAlertIcon, SquareCheckBig } from '@lucide/svelte'
	import { enhance } from '$app/forms'
	import type { ActionData, PageData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	// STATE ------------------------------------------------ //
	let isSubmitting = $state(false)
	let emailInput = $state(data.userEmail || '')
	let emailOptIn = $state(data.currentPreference ?? true)

	// HANDLERS --------------------------------------------- //
	function handleSubmit() {
		isSubmitting = true
		return async ({ update }: { update: () => Promise<void> }) => {
			await update()
			isSubmitting = false
		}
	}
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--email-preferences">
	<header>
		<h1>Email Preferences</h1>
		<p>Manage your email communication preferences below.</p>
	</header>

	<form method="POST" action="?/updatePreferences" use:enhance={handleSubmit}>
		{#if !data.isAuthenticated}
			<Input id="email" name="email" label="Email Address" type="email" required bind:value={emailInput} />
		{:else}
			<div class="authenticated-email">
				<label>Email Address</label>
				<p>{data.userEmail}</p>
			</div>
		{/if}

		<InputCheckbox
			id="emailOptIn"
			name="emailOptIn"
			label="I want to receive email updates about campaigns, events, and ways to get involved"
			bind:checked={emailOptIn}
		/>

		<Button label={isSubmitting ? 'Updating...' : 'Update Preferences'} type="submit" disabled={isSubmitting} />
	</form>

	{#if form?.success}
		<AlertBox
			label="Preferences Updated"
			message={form.message}
			fit="extrinsic"
			colorway="sentiment-positive"
			icon={SquareCheckBig}
			useShadow={false}
		/>
	{/if}

	{#if form?.error}
		<AlertBox
			label="Update Failed"
			message={form.error}
			fit="extrinsic"
			colorway="sentiment-negative"
			icon={OctagonAlertIcon}
			useShadow={false}
		/>
	{/if}
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	section#section--email-preferences {
		width: 100%;
		max-width: var(--clamp--content-width--s-x);
		padding: var(--loc-gap) 0;
		gap: var(--loc-gap);

		/* FORM ------------------------------------------------- */
		& > form {
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);
		}
	}
</style>
