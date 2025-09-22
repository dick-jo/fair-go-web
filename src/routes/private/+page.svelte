<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import AlertBox from '$lib/components/AlertBox/AlertBox.svelte'
	import type { Database } from '$lib/types/supabase.types'
	import { ChevronDownIcon, ChevronUpIcon, OctagonAlertIcon } from '@lucide/svelte'
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import { afterNavigate } from '$app/navigation'

	interface PrivatePageData {
		user: any | null
		profile: Database['public']['Tables']['profiles']['Row'] | null
	}

	let { data, form }: { data: PrivatePageData; form: ActionData } = $props()
	let { profile } = $derived(data)

	// STATE ------------------------------------------------ //
	let accordionYourDetailsIsOpen = $state<boolean>(true)
	let isSubmittingYourDetailsUpdate = $state<boolean>(false)

	// Track current form values for your details section
	let yourDetailsCurrentValues = $state({
		firstName: '',
		lastName: '',
		postcode: '',
		phone: ''
	})

	// Initialize values when profile changes
	$effect(() => {
		yourDetailsCurrentValues = {
			firstName: profile?.first_name || '',
			lastName: profile?.last_name || '',
			postcode: profile?.postcode || '',
			phone: profile?.phone || ''
		}
	})

	// Track if your details form has changes - guard against undefined profile
	let yourDetailsHasChanges = $derived(
		profile
			? yourDetailsCurrentValues.firstName !== (profile.first_name || '') ||
					yourDetailsCurrentValues.lastName !== (profile.last_name || '') ||
					yourDetailsCurrentValues.postcode !== (profile.postcode || '') ||
					yourDetailsCurrentValues.phone !== (profile.phone || '')
			: false
	)

	// HANDLERS --------------------------------------------- //
	function handleYourDetailsSubmit() {
		isSubmittingYourDetailsUpdate = true
		return async ({ update }: { update: () => Promise<void> }) => {
			await update()
			isSubmittingYourDetailsUpdate = false
		}
	}

	function handleYourDetailsCancel() {
		yourDetailsCurrentValues = {
			firstName: profile?.first_name || '',
			lastName: profile?.last_name || '',
			postcode: profile?.postcode || '',
			phone: profile?.phone || ''
		}
	}

	// TOAST ------------------------------------------------ //
	afterNavigate(({ to }) => {
		if (to?.url.searchParams.get('updated') === 'profile') {
			toaster.show('Your details have been updated successfully', 'Profile Updated', {
				type: 'positive',
				duration: 4000
			})
		}
	})
</script>

{#snippet accordionItem(title: string, isOpen: boolean, toggle: () => void)}
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

<section id="section--user-details" class="accordion--section">
	{@render accordionItem(
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
					value={yourDetailsCurrentValues.firstName}
					oninput={(e) => (yourDetailsCurrentValues.firstName = (e.target as HTMLInputElement).value)}
				/>

				<Input
					id="lastName"
					name="lastName"
					label="Last Name"
					type="text"
					value={yourDetailsCurrentValues.lastName}
					oninput={(e) => (yourDetailsCurrentValues.lastName = (e.target as HTMLInputElement).value)}
				/>

				<Input
					id="postcode"
					name="postcode"
					label="Postcode"
					type="text"
					maxlength={4}
					placeholder="e.g. 5000"
					value={yourDetailsCurrentValues.postcode}
					oninput={(e) => (yourDetailsCurrentValues.postcode = (e.target as HTMLInputElement).value)}
				/>

				<Input
					id="phone"
					name="phone"
					label="Phone Number"
					type="tel"
					placeholder="e.g. 0412 345 678"
					value={yourDetailsCurrentValues.phone}
					oninput={(e) => (yourDetailsCurrentValues.phone = (e.target as HTMLInputElement).value)}
				/>

				<div class="action-container">
					<Button
						label="Cancel"
						intent="secondary"
						colorway="dv"
						type="button"
						disabled={!yourDetailsHasChanges || isSubmittingYourDetailsUpdate}
						onclick={handleYourDetailsCancel}
					/>
					<Button
						label={isSubmittingYourDetailsUpdate ? 'Saving...' : 'Save Changes'}
						type="submit"
						disabled={!yourDetailsHasChanges || isSubmittingYourDetailsUpdate}
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
	section.accordion--section {
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
