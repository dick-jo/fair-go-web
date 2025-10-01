<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import InputCheckbox from '$lib/components/InputCheckbox/InputCheckbox.svelte'
	import type { Database } from '$lib/types/supabase.types'
	import { ChevronDownIcon, ChevronUpIcon } from '@lucide/svelte'
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import type { ActionResult } from '@sveltejs/kit'

	interface PrivatePageData {
		user: any | null
		profile: Database['public']['Tables']['profiles']['Row'] | null
		subscriber: Database['public']['Tables']['subscribers']['Row'] | null
	}

	let { data }: { data: PrivatePageData; form: ActionData } = $props()

	// STATE ------------------------------------------------ //
	type FormStatus = 'idle' | 'pending'

	let formState = $state({
		yourDetails: {
			status: 'idle' as FormStatus,
			hasChanges: false
		},
		volunteerStatus: {
			status: 'idle' as FormStatus,
			hasChanges: false
		},
		communicationPreferences: {
			status: 'idle' as FormStatus,
			hasChanges: false
		}
	})

	// FORM ACCORDIONS
	let accordionYourDetailsIsOpen = $state<boolean>(true)
	let accordionVolunteerStatusIsOpen = $state<boolean>(true)
	let accordionCommunicationPreferencesIsOpen = $state<boolean>(false)

	// HANDLERS --------------------------------------------- //
	function handleFormChange(formName: keyof typeof formState) {
		return () => {
			formState[formName].hasChanges = true
		}
	}

	function handleYourDetailsSubmit() {
		formState.yourDetails.status = 'pending'

		return async ({
			result,
			update
		}: {
			result: ActionResult
			update: (options?: { reset?: boolean }) => Promise<void>
		}) => {
			await update({ reset: false })
			formState.yourDetails.status = 'idle'

			if (result.type === 'success' && result.data) {
				formState.yourDetails.hasChanges = false
				toaster.show(result.type, result.data.message, { type: 'positive' })
			} else if (result.type === 'failure' && result.data) {
				toaster.show(result.type, result.data.message, { type: 'negative' })
			}
		}
	}

	function handleVolunteerStatusSubmit() {
		formState.volunteerStatus.status = 'pending'

		return async ({
			result,
			update
		}: {
			result: ActionResult
			update: (options?: { reset?: boolean }) => Promise<void>
		}) => {
			await update({ reset: false })
			formState.volunteerStatus.status = 'idle'

			if (result.type === 'success' && result.data) {
				formState.volunteerStatus.hasChanges = false
				toaster.show(result.type, result.data.message, { type: 'positive' })
			} else if (result.type === 'failure' && result.data) {
				toaster.show(result.type, result.data.message, { type: 'negative' })
			}
		}
	}

	function handleCommunicationPreferencesSubmit() {
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
			<form
				method="POST"
				action="?/updateYourDetails"
				use:enhance={handleYourDetailsSubmit}
				oninput={handleFormChange('yourDetails')}
			>
				<Input id="firstName" name="firstName" label="First Name" type="text" value={data.profile?.first_name || ''} />

				<Input id="lastName" name="lastName" label="Last Name" type="text" value={data.profile?.last_name || ''} />

				<Input
					id="postcode"
					name="postcode"
					label="Postcode"
					type="text"
					maxlength={4}
					placeholder="e.g. 5000"
					value={data.profile?.postcode || ''}
				/>

				<Input
					id="phone"
					name="phone"
					label="Phone Number"
					type="tel"
					placeholder="e.g. 0412 345 678"
					value={data.profile?.phone || ''}
				/>

				<div class="action-container">
					<Button
						label={formState.yourDetails.status === 'idle' ? 'Save Changes' : 'Updating...'}
						disabled={formState.yourDetails.status === 'pending' || !formState.yourDetails.hasChanges}
						type="submit"
					/>
				</div>
			</form>
		</div>
	{/if}

	{@render accordionHeader(
		'Volunteer Status',
		accordionVolunteerStatusIsOpen,
		() => (accordionVolunteerStatusIsOpen = !accordionVolunteerStatusIsOpen)
	)}
	{#if accordionVolunteerStatusIsOpen}
		<div class="accordion--item">
			<form
				method="POST"
				action="?/updateVolunteerStatus"
				use:enhance={handleVolunteerStatusSubmit}
				oninput={handleFormChange('volunteerStatus')}
			>
				<p class="supplementary">
					Setting your volunteer status to 'Yes' lets us know we can reach out to you for volunteer opportunities when
					needed. It is strongly recommended you provide a phone number if you're interested in volunteering.
				</p>

				<InputCheckbox
					id="isVolunteer"
					name="isVolunteer"
					label="I want to volunteer with the party"
					checked={data.profile?.is_volunteer || false}
				/>

				<div class="action-container">
					<Button
						label={formState.volunteerStatus.status === 'idle' ? 'Save Changes' : 'Updating...'}
						disabled={formState.volunteerStatus.status === 'pending' || !formState.volunteerStatus.hasChanges}
						type="submit"
					/>
				</div>
			</form>
		</div>
	{/if}

	{@render accordionHeader(
		'Communication Preferences',
		accordionCommunicationPreferencesIsOpen,
		() => (accordionCommunicationPreferencesIsOpen = !accordionCommunicationPreferencesIsOpen)
	)}
	{#if accordionCommunicationPreferencesIsOpen}
		<div class="accordion--item">
			<form
				method="POST"
				action="?/updateCommunicationPreferences"
				use:enhance={handleCommunicationPreferencesSubmit}
				oninput={handleFormChange('communicationPreferences')}
			>
				<p class="supplementary">
					Choose whether you'd like to receive email updates about campaigns, events, and ways to get involved.
				</p>

				<InputCheckbox
					id="emailOptIn"
					name="emailOptIn"
					label="I want to receive email updates"
					checked={data.subscriber?.email_opt_in || false}
				/>

				<div class="action-container">
					<Button
						label={formState.communicationPreferences.status === 'idle' ? 'Save Changes' : 'Updating...'}
						disabled={formState.communicationPreferences.status === 'pending' ||
							!formState.communicationPreferences.hasChanges}
						type="submit"
					/>
				</div>
			</form>
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
