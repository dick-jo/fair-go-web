<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import AlertBox from '$lib/components/AlertBox/AlertBox.svelte'
	import type { Database } from '$lib/types/supabase.types'
	import { ChevronDownIcon, ChevronUpIcon, InfoIcon, OctagonAlertIcon } from '@lucide/svelte'
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import { afterNavigate } from '$app/navigation'
	import { createFormState } from '$lib/utils'
	import InputCheckbox from '$lib/components/InputCheckbox/InputCheckbox.svelte'

	interface PrivatePageData {
		user: any | null
		profile: Database['public']['Tables']['profiles']['Row'] | null
		subscriber: Database['public']['Tables']['subscribers']['Row'] | null // Add this line
	}

	let { data, form }: { data: PrivatePageData; form: ActionData } = $props()
	let { profile, subscriber } = $derived(data)

	// STATE ------------------------------------------------ //
	// FORM: Your Details
	let accordionYourDetailsIsOpen = $state<boolean>(true)
	let isSubmittingYourDetailsUpdate = $state<boolean>(false)

	let yourDetailsForm = createFormState({
		firstName: '',
		lastName: '',
		postcode: '',
		phone: ''
	})

	$effect(() => {
		if (profile) {
			yourDetailsForm.setInitial({
				firstName: profile.first_name || '',
				lastName: profile.last_name || '',
				postcode: profile.postcode || '',
				phone: profile.phone || ''
			})
		}
	})

	let yourDetailsButtonsDisabled = $derived(!yourDetailsForm.hasChanges || isSubmittingYourDetailsUpdate)

	// FORM: Volunteer Status
	let accordionVolunteerStatusIsOpen = $state<boolean>(true)
	let isSubmittingVolunteerStatusUpdate = $state<boolean>(false)

	let volunteerStatusForm = createFormState({
		isVolunteer: false
	})

	$effect(() => {
		if (profile) {
			volunteerStatusForm.setInitial({
				isVolunteer: profile.is_volunteer || false
			})
		}
	})

	let volunteerStatusButtonsDisabled = $derived(!volunteerStatusForm.hasChanges || isSubmittingVolunteerStatusUpdate)

	let showPhoneWarning = $derived(volunteerStatusForm.current.isVolunteer && !profile?.phone)

	// FORM: Communication Preferences
	let accordionCommunicationPreferencesIsVisible = $state<boolean>(false)
	let isSubmittingCommunicationPreferencesUpdate = $state<boolean>(false)

	let communicationPreferencesForm = createFormState({
		emailOptIn: true
	})

	$effect(() => {
		if (subscriber) {
			communicationPreferencesForm.setInitial({
				emailOptIn: subscriber.email_opt_in ?? true
			})
		}
	})

	let communicationPreferencesButtonsDisabled = $derived(
		!communicationPreferencesForm.hasChanges || isSubmittingCommunicationPreferencesUpdate
	)

	// HANDLERS --------------------------------------------- //
	// Your Details
	function handleYourDetailsSubmit() {
		isSubmittingYourDetailsUpdate = true
		return async ({ update }: { update: () => Promise<void> }) => {
			await update()
			isSubmittingYourDetailsUpdate = false
		}
	}

	function handleYourDetailsCancel() {
		yourDetailsForm.reset()
	}

	// Volunteer Status
	function handleVolunteerStatusSubmit() {
		isSubmittingVolunteerStatusUpdate = true
		return async ({ update }: { update: () => Promise<void> }) => {
			await update()
			isSubmittingVolunteerStatusUpdate = false
		}
	}

	function handleVolunteerStatusCancel() {
		volunteerStatusForm.reset()
	}

	// Communication Preferences
	function handleCommunicationPreferencesSubmit() {
		isSubmittingCommunicationPreferencesUpdate = true
		return async ({ update }: { update: () => Promise<void> }) => {
			await update()
			isSubmittingCommunicationPreferencesUpdate = false
		}
	}

	function handleCommunicationPreferencesCancel() {
		communicationPreferencesForm.reset()
	}

	// TOAST ------------------------------------------------ //
	afterNavigate(({ to }) => {
		if (to?.url.searchParams.get('updated') === 'profile') {
			toaster.show('Your details have been updated successfully', 'Profile Updated', {
				type: 'positive',
				duration: 4000
			})
		}
		// Add this new case
		if (to?.url.searchParams.get('updated') === 'volunteer') {
			toaster.show('Your volunteer status has been updated successfully', 'Volunteer Status Updated', {
				type: 'positive',
				duration: 4000
			})
		}

		if (to?.url.searchParams.get('updated') === 'communication') {
			toaster.show('Your communication preferences have been updated successfully', 'Preferences Updated', {
				type: 'positive',
				duration: 4000
			})
		}
	})
</script>

{#snippet accordionHeader(title: string, isOpen: boolean, toggle: () => void)}
	<button class="accordion--header" onclick={toggle}>
		<h3 class="title">{title}</h3>
		{#if isOpen}
			<ChevronUpIcon />
		{:else}
			<ChevronDownIcon />
		{/if}
	</button>
{/snippet}

<section id="section--description">
	<p>
		Thanks for being part of our movement to fight for a fair go for all Australians. We're working to make your voice
		heard and make your vote count.
	</p>
	<p>
		To support us in supporting you, please use your profile to manage your details, volunteer status, and communication
		preferences.
	</p>
	<p>
		Keeping your preferences and details up to date is the easiest way to help us make a difference — whether it's just
		by letting us know which postcodes need their voice heard the most, or where we can find dependable volunteers,
		every bit helps.
	</p>
</section>

<section id="section--user-details">
	{@render accordionHeader(
		'Your Details',
		accordionYourDetailsIsOpen,
		() => (accordionYourDetailsIsOpen = !accordionYourDetailsIsOpen)
	)}
	{#if accordionYourDetailsIsOpen}
		<div class="accordion--item">
			<form method="POST" action="?/updateYourDetails" use:enhance={handleYourDetailsSubmit}>
				<Input
					id="firstName"
					name="firstName"
					label="First Name"
					type="text"
					value={yourDetailsForm.current.firstName}
					oninput={(e) => yourDetailsForm.update('firstName', (e.target as HTMLInputElement).value)}
				/>

				<Input
					id="lastName"
					name="lastName"
					label="Last Name"
					type="text"
					value={yourDetailsForm.current.lastName}
					oninput={(e) => yourDetailsForm.update('lastName', (e.target as HTMLInputElement).value)}
				/>

				<Input
					id="postcode"
					name="postcode"
					label="Postcode"
					type="text"
					maxlength={4}
					placeholder="e.g. 5000"
					value={yourDetailsForm.current.postcode}
					oninput={(e) => yourDetailsForm.update('postcode', (e.target as HTMLInputElement).value)}
				/>

				<Input
					id="phone"
					name="phone"
					label="Phone Number"
					type="tel"
					placeholder="e.g. 0412 345 678"
					value={yourDetailsForm.current.phone}
					oninput={(e) => yourDetailsForm.update('phone', (e.target as HTMLInputElement).value)}
				/>

				<div class="action-container">
					<Button
						label="Cancel"
						intent="secondary"
						colorway="dv"
						type="button"
						disabled={yourDetailsButtonsDisabled}
						onclick={handleYourDetailsCancel}
					/>
					<Button
						label={isSubmittingYourDetailsUpdate ? 'Saving...' : 'Save Changes'}
						type="submit"
						disabled={yourDetailsButtonsDisabled}
					/>
				</div>
			</form>

			{#if form?.yourDetailsError}
				<AlertBox
					label="Update Failed"
					message={form.yourDetailsError}
					fit="extrinsic"
					colorway="sentiment-negative"
					icon={OctagonAlertIcon}
					useShadow={false}
				/>
			{/if}
		</div>
	{/if}

	{@render accordionHeader(
		'Volunteer Status',
		accordionVolunteerStatusIsOpen,
		() => (accordionVolunteerStatusIsOpen = !accordionVolunteerStatusIsOpen)
	)}
	{#if accordionVolunteerStatusIsOpen}
		<div class="accordion--item">
			<form method="POST" action="?/updateVolunteerStatus" use:enhance={handleVolunteerStatusSubmit}>
				<p class="supplementary">
					Setting your volunteer status to 'Yes' lets us know we can reach out to you for volunteer opportunities when
					needed. It is strongly recommended you provide provide a phone number if you're interested in volunteering.
				</p>
				<InputCheckbox
					id="isVolunteer"
					name="isVolunteer"
					label="I want to volunteer with the party"
					bind:checked={volunteerStatusForm.current.isVolunteer}
					onchange={(isChecked) => volunteerStatusForm.update('isVolunteer', isChecked)}
				/>

				{#if showPhoneWarning}
					<AlertBox
						label="Phone Number Recommended"
						message="We recommend adding a phone number to help coordinate volunteer activities. You can add one in 'Your Details' above."
						fit="extrinsic"
						colorway="sentiment-negative"
						icon={InfoIcon}
						useShadow={false}
					/>
				{/if}

				<div class="action-container">
					<Button
						label="Cancel"
						intent="secondary"
						colorway="dv"
						type="button"
						disabled={volunteerStatusButtonsDisabled}
						onclick={handleVolunteerStatusCancel}
					/>

					<Button
						label={isSubmittingVolunteerStatusUpdate ? 'Saving...' : 'Save Changes'}
						type="submit"
						disabled={volunteerStatusButtonsDisabled}
					/>
				</div>
			</form>

			{#if form?.volunteerStatusError}
				<AlertBox
					label="Update Failed"
					message={form.volunteerStatusError}
					fit="extrinsic"
					colorway="sentiment-negative"
					icon={OctagonAlertIcon}
					useShadow={false}
				/>
			{/if}
		</div>
	{/if}

	{@render accordionHeader(
		'Communication Preferences',
		accordionCommunicationPreferencesIsVisible,
		() => (accordionCommunicationPreferencesIsVisible = !accordionCommunicationPreferencesIsVisible)
	)}
	{#if accordionCommunicationPreferencesIsVisible}
		<div class="accordion--item">
			<form method="POST" action="?/updateCommunicationPreferences" use:enhance={handleCommunicationPreferencesSubmit}>
				<p class="supplementary">
					Choose whether you'd like to receive email updates about campaigns, events, and ways to get involved.
				</p>

				<InputCheckbox
					id="emailOptIn"
					name="emailOptIn"
					label="I want to receive email updates"
					bind:checked={communicationPreferencesForm.current.emailOptIn}
					onchange={(isChecked) => communicationPreferencesForm.update('emailOptIn', isChecked)}
				/>

				<div class="action-container">
					<Button
						label="Cancel"
						intent="secondary"
						colorway="dv"
						type="button"
						disabled={communicationPreferencesButtonsDisabled}
						onclick={handleCommunicationPreferencesCancel}
					/>

					<Button
						label={isSubmittingCommunicationPreferencesUpdate ? 'Saving...' : 'Save Changes'}
						type="submit"
						disabled={communicationPreferencesButtonsDisabled}
					/>
				</div>
			</form>

			{#if form?.communicationPreferencesError}
				<AlertBox
					label="Update Failed"
					message={form.communicationPreferencesError}
					fit="extrinsic"
					colorway="sentiment-negative"
					icon={OctagonAlertIcon}
					useShadow={false}
				/>
			{/if}
		</div>
	{/if}
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	/* SECTION: Description --------------------------------- */
	section#section--description {
		--loc-gap: var(--gap-s);
		width: 100%;
		gap: var(--loc-gap);

		& > p {
			font: var(--font--body--s);
		}
	}

	/* SECTIN: Accordion Sections --------------------------- */
	section#section--user-details {
		width: 100%;
		padding: var(--loc-gap);
		display: flex;
		flex-direction: column;
		gap: var(--loc-gap);
		background-color: var(--clr-ev);
		border: var(--bdw) solid var(--clr-dv);
		border-radius: var(--bdr-l);

		.accordion--item,
		form {
			--loc-gap: var(--gap-s);
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);

			p {
				&.supplementary {
					font: var(--font--body--s);
				}
			}

			.action-container {
				display: flex;
				gap: var(--loc-gap);

				:global(& > .button) {
					flex: 1;
				}
			}
		}
	}

	/* SNIPPET: Accordion Header ---------------------------- */
	.accordion--header {
		--loc-pad-x: 0;
		--loc-clr-bg: var(--clr-primary-tr-invisible);
		--loc-clr-border: var(--clr-primary-tr-light);
		--loc-clr-border--secondary: var(--clr-primary-tr-invisible);
		--loc-bdr: 0;
		&:hover {
			--loc-pad-x: var(--gap-l);
			--loc-clr-bg: var(--clr-primary-tr-min);
			--loc-clr-border: var(--clr-primary-tr-heavy);
			--loc-clr-border--secondary: var(--clr-primary-tr-heavy);
			--loc-bdr: var(--bdr-s);
		}
		padding: var(--gap-l) var(--loc-pad-x);
		display: flex;
		justify-content: space-between;
		background-color: var(--loc-clr-bg);
		border-style: none;
		border: var(--bdw) solid var(--loc-clr-border--secondary);
		border-top: var(--bdw) solid var(--loc-clr-border);
		border-radius: var(--loc-bdr);
		cursor: pointer;
		transition: var(--t-ix-hover);
	}
</style>
