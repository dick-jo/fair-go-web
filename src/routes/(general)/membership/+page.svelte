<script lang="ts">
	import { signOut } from '$lib/client/auth'
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import type { Database } from '$lib/types/supabase.types'
	import { fade, fly, scale } from 'svelte/transition'
	import type { PageData } from '../$types'
	import { FORM_CONTENT, HEADER_CONTENT, MEMBERSHIP_TIERS } from './content'
	import type { ActionResult } from '@sveltejs/kit'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import { enhance } from '$app/forms'
	import AlertBox from '$lib/components/AlertBox/AlertBox.svelte'
	import { ArrowRightIcon, CheckIcon, OctagonAlertIcon } from '@lucide/svelte'
	import InputCheckbox from '$lib/components/InputCheckbox/InputCheckbox.svelte'
	import { elasticOut } from 'svelte/easing'

	interface MembershipPageData extends PageData {
		profile: Database['public']['Tables']['profiles']['Row'] | null
		subscriber: Database['public']['Tables']['subscribers']['Row'] | null
	}

	let { data }: { data: MembershipPageData } = $props()

	// $inspect(data)

	// TS --------------------------------------------------- //
	type StepConfig = {
		hasFooter: boolean
		action?: () => void
	}

	type FormStatus = 'idle' | 'pending'

	// CONFIG ----------------------------------------------- //
	const ANIM_CONFIG = {
		duration: 300,
		delay: 150
	}

	const MEMBERSHIP_FORM_STEP_CONFIG: Record<number, StepConfig> = {
		0: {
			hasFooter: false
		},
		1: {
			hasFooter: true,
			action: () => next()
		},
		2: {
			hasFooter: true,
			action: () => formEltElectoralRollDetails?.requestSubmit()
		},
		3: {
			hasFooter: true,
			action: () => formEltConsent?.requestSubmit()
		},
		4: {
			hasFooter: false
		}
	}

	// MEMBERSHIP FORM: Element Bindings -------------------- //
	let membershipFormContainerElt = $state<HTMLDivElement>()
	let formEltElectoralRollDetails = $state<HTMLFormElement>()
	let formEltConsent = $state<HTMLFormElement>()

	// MEMBERSHIP FORM: State ------------------------------- //
	let membershipFormStep = $state<number>(0)

	let formLoginStatus = $state<FormStatus>('idle')
	let formSignUpStatus = $state<FormStatus>('idle')
	let formElectoralRollDetailsStatus = $state<FormStatus>('idle')
	let formConsentStatus = $state<FormStatus>('idle')

	let isNextButtonDisabled = $derived(formElectoralRollDetailsStatus === 'pending' || formConsentStatus === 'pending')

	// MEMBERSHIP FORM: Steps API --------------------------- //
	function next() {
		membershipFormStep += 1
		if (membershipFormContainerElt) {
			membershipFormContainerElt.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	function handleNext() {
		const config = MEMBERSHIP_FORM_STEP_CONFIG[membershipFormStep]
		config.action?.()
	}

	function prev() {
		membershipFormStep -= 1
	}

	function toStep(index: number) {
		membershipFormStep = index
	}

	// MEMBERSHIP FORM: Form Action Handler Factory --------- //
	function createStepFormHandler(
		statusRef: { value: FormStatus },
		options: {
			successKey?: string // Key to access success message in result.data
			errorKey?: string // Key to access error message in result.data
			autoAdvance?: boolean // Whether to call next() on success
			resetForm?: boolean // Whether to reset form after submission
		} = {}
	) {
		const { successKey = 'message', errorKey = 'message', autoAdvance = true, resetForm = false } = options

		return () => {
			statusRef.value = 'pending'
			return async ({
				result,
				update
			}: {
				result: ActionResult
				update: (options?: { reset?: boolean }) => Promise<void>
			}) => {
				await update({ reset: resetForm })
				statusRef.value = 'idle'

				if (result.type === 'success' && result.data) {
					toaster.show(result.type, result.data[successKey], { type: 'positive' })
					if (autoAdvance) next()
				} else if (result.type === 'failure' && result.data) {
					toaster.show(result.type, result.data[errorKey], { type: 'negative' })
				}
			}
		}
	}

	// MEMBERSHIP FORM: Handlers ---------------------------- //
	// LOGIN
	const handleLoginSubmit = createStepFormHandler(
		{
			get value() {
				return formLoginStatus
			},
			set value(v) {
				formLoginStatus = v
			}
		},
		{ successKey: 'message', errorKey: 'error', autoAdvance: false, resetForm: true }
	)

	// SIGN UP
	const handleSignUpSubmit = createStepFormHandler(
		{
			get value() {
				return formSignUpStatus
			},
			set value(v) {
				formSignUpStatus = v
			}
		},
		{ successKey: 'message', errorKey: 'error', autoAdvance: false, resetForm: true }
	)

	// ELECTORAL ROLL DETAILS
	const handleElectoralRollDetailsSubmit = createStepFormHandler({
		get value() {
			return formElectoralRollDetailsStatus
		},
		set value(v) {
			formElectoralRollDetailsStatus = v
		}
	})

	const handleConsentSubmit = createStepFormHandler({
		get value() {
			return formConsentStatus
		},
		set value(v) {
			formConsentStatus = v
		}
	})

	// FEE SELECTOR: State ---------------------------------- //
	let feeSelectorIndex = $state<number>(0)
	let feeSelectorIndexUserSelection = $state<number>(0)
	let feeSelectorValue = $derived(MEMBERSHIP_TIERS[feeSelectorIndex].value)
	let feeSelectorLabel = $derived(MEMBERSHIP_TIERS[feeSelectorIndex].label)
	let feeSelectorMeterPerc = $derived((feeSelectorIndex / (MEMBERSHIP_TIERS.length - 1)) * 100)

	// FEE SELECTOR: Handlers ------------------------------- //
	function handleFeeSelectorMouseOver(i: number) {
		feeSelectorIndex = i
	}

	function handleFeeSelectorMouseOut() {
		if (feeSelectorIndexUserSelection) {
			feeSelectorIndex = feeSelectorIndexUserSelection
		}
	}

	function handleFeeSelectorSelect(i: number) {
		feeSelectorIndex = i
		feeSelectorIndexUserSelection = i
	}

	// PAYMENT: State --------------------------------------- //
	let paymentLoading = $state<boolean>(false)
	let paymentRecurringEnabled = $state<boolean>(true)

	// PAYMENT: Handlers ------------------------------------ //
	async function handleProceedToPayment() {
		paymentLoading = true

		try {
			const response = await fetch('/api/create-membership-checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tier: feeSelectorLabel,
					amount: feeSelectorValue * 100,
					recurring: paymentRecurringEnabled
				})
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Payment setup failed')
			}

			const { url } = await response.json()
			window.location.href = url
		} catch (e) {
			const message = e instanceof Error ? e.message : 'Payment setup failed. Please try again.'
			toaster.show('error', message, { type: 'negative' })
			paymentLoading = false
		}
	}

	// UTILS ------------------------------------------------ //
	const handleSignOut = async () => {
		await signOut(data.supabase, { redirect: true, redirectTo: '/membership' })
	}
</script>

<!-- SNIPPETS ------------------------------------------ -->
<!-- HEADER CONTENT ITEM -->
{#snippet headerContentItem(content: string[])}
	{#each content as p}
		<p>{p}</p>
	{/each}
{/snippet}

<!-- STEP PIP -->
{#snippet stepPip(index: number, withDelin?: boolean)}
	<button
		class="step-pip step-pip--pip"
		data-active={index === membershipFormStep}
		data-complete={index < membershipFormStep}
	>
		{#if index >= membershipFormStep}
			<span>{index + 1}</span>
		{:else}
			<div class="wrapper" in:scale={{ duration: ANIM_CONFIG.duration * 4, easing: elasticOut }}>
				<CheckIcon />
			</div>
		{/if}
	</button>

	{#if withDelin}
		<div class="step-pip step-pip--delin" data-complete={index < membershipFormStep}>
			<div class="fill"></div>
		</div>
	{/if}
{/snippet}

<!-- FORM DELIN -->
{#snippet formDelin(text: string)}
	<div class="form-delin">
		<div class="line"></div>
		<span class="label">{text}</span>
		<div class="line"></div>
	</div>
{/snippet}

<!-- EXISTING USER OVERLAY -->
{#snippet existingUserOverlay()}
	<div id="existing-user-overlay" out:fade={{ duration: ANIM_CONFIG.duration }}>
		<div class="body">
			<h4 class="text--heading">
				Welcome back{data.profile?.first_name
					? `, ${data.profile.first_name}.`
					: data.user?.email
						? `, ${data.user.email}.`
						: ''}
			</h4>

			<span class="text--aux">Not you? Click <button onclick={handleSignOut}>here to sign out</button>.</span>
		</div>
		<Button label="Let's begin" onclick={() => toStep(1)} />
	</div>
{/snippet}

<!-- NO-AUTH FALLBACK -->
{#snippet fallbackUnauthorized()}
	<div class="fallback--unauthorized">
		<AlertBox
			label="Error"
			message="You must be logged in to complete this step."
			colorway="sentiment-negative"
			icon={OctagonAlertIcon}
		/>
	</div>
{/snippet}

<!-- FEE SELECTOR -->
{#snippet feeSelector()}
	<div id="fee-selector" style="--loc-meter--perc: {feeSelectorMeterPerc}%">
		<header in:fade={{ duration: ANIM_CONFIG.duration }}>
			<div class="wrapper">
				<span class="text--label">${MEMBERSHIP_TIERS[0].value}</span>
			</div>

			<div class="wrapper">
				<ArrowRightIcon style="opacity: 0.25;" />
			</div>

			<div class="wrapper">
				<ArrowRightIcon style="opacity: 0.5;" />
			</div>

			<div class="wrapper">
				<ArrowRightIcon style="opacity: 0.75;" />
			</div>

			<div class="wrapper">
				<span class="text--label">${MEMBERSHIP_TIERS[MEMBERSHIP_TIERS.length - 1].value}</span>
			</div>
		</header>

		<div class="body">
			<div class="meter">
				<div class="fill"></div>
			</div>

			<div class="pip-container">
				{#each MEMBERSHIP_TIERS as _, i}
					<div
						class="wrapper"
						role="presentation"
						onmouseover={() => handleFeeSelectorMouseOver(i)}
						onfocus={() => handleFeeSelectorMouseOver(i)}
						onmouseout={handleFeeSelectorMouseOut}
						onblur={handleFeeSelectorMouseOut}
					>
						<button
							class="pip"
							aria-label={MEMBERSHIP_TIERS[i].label}
							onclick={() => handleFeeSelectorSelect(i)}
							data-active={feeSelectorIndexUserSelection === i}
						>
						</button>
					</div>
				{/each}
			</div>
		</div>

		<footer in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay }}>
			{@render formDelin('Become A')}
			<div class="title-container">
				<h4 class="text--title">FairGo {MEMBERSHIP_TIERS[feeSelectorIndex].label}</h4>
			</div>

			<div class="fee-container">
				<span class="text text--secondary">Annual Fee:</span>
				<div class="line"></div>
				<span class="text text--primary">${MEMBERSHIP_TIERS[feeSelectorIndex].value}</span>
			</div>
		</footer>
	</div>
{/snippet}

<!-- MARKUP -------------------------------------------- -->
<section id="section--membership--host" class="host">
	<div class="clamp">
		<!-- HEADER--------------------------------------------- -->
		<header>
			<div class="item item--title-container">
				<h2 class="title title--secondary">Join the fight for a fair go</h2>
				<h1 class="title title--primary">Become a member</h1>
			</div>

			{#each HEADER_CONTENT as item}
				<div class="item item--content">
					{@render headerContentItem(item.content)}
				</div>
			{/each}
		</header>

		<!-- FORM CONTAINER ------------------------------------ -->
		<div id="membership--form-container" bind:this={membershipFormContainerElt}>
			{#if data.user && data.profile && membershipFormStep === 0}
				{@render existingUserOverlay()}
			{/if}
			<!-- HEADER -------------------------------------------- -->
			<header>
				<div class="title-container">
					{#key membershipFormStep}
						<h4 class="title title--secondary" in:fly={{ x: 50, duration: ANIM_CONFIG.duration }}>
							Step {membershipFormStep + 1}
						</h4>
						<h3 class="title title--primary" in:fly={{ x: 50, duration: ANIM_CONFIG.duration * 2 }}>
							{FORM_CONTENT[membershipFormStep].title}
						</h3>
					{/key}
				</div>

				<div class="body">
					{#each FORM_CONTENT as step, i}
						{@render stepPip(step.index, i < FORM_CONTENT.length - 1)}
					{/each}
				</div>
			</header>

			<!-- BODY ---------------------------------------------- -->
			<div class="body">
				<div class="secondary">
					{#each FORM_CONTENT[membershipFormStep].description as p, i}
						{#key membershipFormStep}
							<p in:fly={{ x: 12.5, duration: ANIM_CONFIG.duration * 3, delay: ANIM_CONFIG.delay * (i + 1) }}>
								{p}
							</p>
							{#if i < FORM_CONTENT[membershipFormStep].description.length - 1}
								<br />
							{/if}
						{/key}
					{/each}
				</div>

				<div class="primary">
					<!-- FORM ---------------------------------------------- -->
					<div id="membership--form-body">
						<!-- STEP 0 -------------------------------------------- -->
						{#if membershipFormStep === 0}
							<div class="form--section clamp--s">
								<form
									method="POST"
									action="?/login"
									use:enhance={handleLoginSubmit}
									in:fade={{ duration: ANIM_CONFIG.duration }}
								>
									<h4 class="form--text form--text--heading">Log In</h4>
									<p class="form--text form--text--annotation">
										For existing FairGo website users who have previously Signed Up.
									</p>
									<Input id="loginEmail" name="loginEmail" label="Email" type="email" required />
									<Button
										label={formLoginStatus === 'idle' ? 'Log In' : 'Sending...'}
										type="submit"
										disabled={formLoginStatus === 'pending'}
									/>
								</form>

								{@render formDelin('OR')}

								<form
									method="POST"
									action="?/signup"
									use:enhance={handleSignUpSubmit}
									in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay }}
								>
									<h4 class="form--text form--text--heading">New User</h4>
									<p class="form--text form--text--annotation">We just need a few details to get started.</p>

									<div class="row">
										<Input id="signUpFirstName" name="signUpFirstName" label="First Name" type="text" required />
										<Input id="signUpLastName" name="signUpLastName" label="Last Name" type="text" required />
									</div>
									<Input
										id="signUpEmail"
										name="signUpEmail"
										label="Email"
										type="email"
										placeholder="e.g. yourname@gmail.com"
										required
									/>
									<Input
										id="signUpPostCode"
										name="signUpPostCode"
										label="Post Code"
										type="text"
										maxlength={4}
										placeholder="e.g. 5000"
										required
									/>

									<Button
										label={formSignUpStatus === 'idle' ? 'Sign Up' : 'Sending...'}
										type="submit"
										disabled={formSignUpStatus === 'pending'}
									/>
								</form>
							</div>
						{/if}

						<!-- STEP 1 -------------------------------------------- -->
						{#if membershipFormStep === 1}
							{@render feeSelector()}
						{/if}

						<!-- STEP 2 -------------------------------------------- -->
						{#if membershipFormStep === 2}
							{#if data.session && data.user}
								<div class="form--section clamp--s">
									<form
										bind:this={formEltElectoralRollDetails}
										method="POST"
										action="?/updateElectoralRollDetails"
										use:enhance={handleElectoralRollDetailsSubmit}
									>
										<div class="row" in:fade={{ duration: ANIM_CONFIG.duration }}>
											<Input
												id="membershipDob"
												name="membershipDob"
												label="Date of Birth"
												type="date"
												value={data.profile?.date_of_birth || ''}
												required
											/>
											<Input
												id="membershipPhone"
												name="membershipPhone"
												label="Phone Number"
												type="tel"
												placeholder="e.g. 0420 123 456"
												value={data.profile?.phone || ''}
												required
											/>
										</div>

										<div class="row" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay }}>
											<Input
												id="membershipStreetAddress"
												name="membershipStreetAddress"
												label="Street Address"
												type="text"
												placeholder="e.g. 72 Fair Street"
												value={data.profile?.street_address || ''}
												required
											/>
										</div>

										<div class="row" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 2 }}>
											<Input
												id="membershipSuburb"
												name="membershipSuburb"
												label="Suburb"
												type="text"
												placeholder="e.g. Adelaide"
												value={data.profile?.suburb || ''}
												required
											/>

											<Input
												id="membershipPostCode"
												name="membershipPostCode"
												label="Post Code"
												type="text"
												maxlength={4}
												placeholder="e.g. 5000"
												value={data.profile?.postcode || ''}
												required
											/>
										</div>
									</form>
								</div>
							{:else}
								{@render fallbackUnauthorized()}
							{/if}
						{/if}

						<!-- STEP 3--------------------------------------------- -->
						{#if membershipFormStep === 3}
							{#if data.session && data.user}
								<div class="form--section clamp--s">
									<form
										bind:this={formEltConsent}
										method="POST"
										action="?/updateConsent"
										use:enhance={handleConsentSubmit}
									>
										<h4 class="form--text form--text--heading" in:fade={{ duration: ANIM_CONFIG.duration }}>
											Your Pledge:
										</h4>
										<p class="form--text form--text--annotation" in:fade={{ duration: ANIM_CONFIG.duration }}>
											I hereby join FairGo For Australians, committing to its Objectives and Rules, and agreeing to
											follow decisions of the Party as per these Rules. I confirm my details are true and I'm enrolled
											at the address provided with the Australian Electoral Commission. I'm here to back FairGo and no
											other party, bringing my full focus to the fight for a fair go for all Australians.
										</p>

										<div class="row" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay }}>
											<InputCheckbox
												id="consentPledge"
												name="consentPledge"
												label="I agree to the pledge"
												checked={!!(data.profile?.pledge_accepted_at && data.profile?.party_exclusivity_confirmed_at)}
												required
											/>
										</div>

										<div class="row" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 2 }}>
											{@render formDelin('and')}
										</div>

										<h4
											class="form--text form--text--heading"
											in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 3 }}
										>
											Your Consent:
										</h4>
										<p
											class="form--text form--text--annotation"
											in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 3 }}
										>
											I confirm I am enrolled to vote and consent to the sharing of my personal information with
											electoral authorities for verification and compliance purposes, as required by law.
										</p>

										<div class="row" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 4 }}>
											<InputCheckbox
												id="consentElectoral"
												name="consentElectoral"
												label="I give my consent"
												checked={!!data.profile?.aec_data_sharing_consent_at}
												required
											/>
										</div>
									</form>
								</div>
							{:else}
								{@render fallbackUnauthorized()}
							{/if}
						{/if}

						<!-- STEP 4 -------------------------------------------- -->
						{#if membershipFormStep === 4}
							{#if data.session && data.user}
								{#if !data.profile?.is_member}
									<!-- Payment form for non-members -->
									<div class="form--section clamp--s">
										<h4 class="form--text form--text--heading" in:fade={{ duration: ANIM_CONFIG.duration }}>
											Payment Summary
										</h4>

										<div class="list-container">
											<div class="item" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay }}>
												<span class="text text--label">Membership Tier:</span>
												<span class="text text--value">{feeSelectorLabel}</span>
											</div>

											<div class="item" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 2 }}>
												<span class="text text--label">Annual Fee:</span>
												<span class="text text--value">${feeSelectorValue}</span>
											</div>
										</div>

										<p
											class="form--text form--text--annotation"
											in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 3 }}
										>
											Membership fees are due annually. You can choose to automatically renew your membership, or manage
											your renewals manually.
										</p>

										<div class="row" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 4 }}>
											<InputCheckbox
												id="recurringMembership"
												name="recurringMembership"
												label="Renew membership automatically each year"
												bind:checked={paymentRecurringEnabled}
											/>
										</div>

										<div class="row" in:fade={{ duration: ANIM_CONFIG.duration, delay: ANIM_CONFIG.delay * 5 }}>
											<Button
												fit="extrinsic"
												label={paymentLoading ? 'Redirecting...' : 'Proceed to Payment'}
												onclick={handleProceedToPayment}
												disabled={paymentLoading}
											/>
										</div>
									</div>
								{:else}
									<!-- Already a member warning -->
									<AlertBox
										label="Error"
										message="You already have an active FairGo membership!"
										colorway="sentiment-negative"
										icon={OctagonAlertIcon}
									/>
								{/if}
							{:else}
								{@render fallbackUnauthorized()}
							{/if}
						{/if}
					</div>

					<!-- FOOTER: Form Nav Controller ----------------------- -->
					{#if MEMBERSHIP_FORM_STEP_CONFIG[membershipFormStep]?.hasFooter}
						<footer>
							<Button label="Back" intent="secondary" colorway="dv" onclick={prev} />
							<div class="body">
								<span class="hint">{membershipFormStep + 1} of {FORM_CONTENT.length}</span>
							</div>
							<Button
								label="Next"
								intent="primary"
								colorway="primary"
								onclick={handleNext}
								disabled={!data.session || !data.user || isNextButtonDisabled}
							/>
						</footer>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	section#section--membership--host.host {
		padding: var(--gap-max);
		align-items: center;
		@media screen and (max-width: 720px) {
			padding: var(--gap-s);
		}

		/* CLAMP ------------------------------------------------ */
		& > .clamp {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: var(--loc-gap);

			/* HEADER ----------------------------------------------- */
			& > header {
				display: grid;
				grid-template-columns: repeat(12, 1fr);
				gap: var(--loc-gap);
				@media screen and (max-width: 960px) {
					display: none;
				}

				& > .item {
					--loc-grid-cols: 4;
					grid-column: span var(--loc-grid-cols);
					&.item--title-container {
						--loc-grid-cols: 12;
						.title {
							&.title--primary {
								color: var(--clr-ink);
								text-transform: var(--text-case--heading);
							}
							&.title--secondary {
								color: var(--clr-ink-tr-max);
								font: var(--font--heading--secondary);
								text-transform: var(--text-case--heading--secondary);
							}
						}
					}

					&.item--content {
						p {
							font: var(--font--body--s);
						}
					}
				}
			}

			/* MEMBERSHIP FORM CONTAINER ---------------------------- */
			#membership--form-container {
				--loc-gap: var(--gap-l);
				height: 800px;
				min-height: fit-content;
				position: relative;
				display: flex;
				flex-direction: column;
				background-color: var(--clr-ev);
				border: var(--bdw) solid var(--clr-dv);
				border-radius: var(--bdr-max);

				/* HEADER ----------------------------------------------- */
				& > header {
					height: var(--sp-10);
					min-height: var(--sp-10);
					padding: 0 var(--loc-gap);
					position: sticky;
					top: var(--layout--nav-top--height);
					display: grid;
					grid-template-columns: repeat(12, 1fr);
					gap: var(--loc-gap);
					background-color: var(--clr-ev);
					border-bottom: var(--bdw) solid var(--clr-dv);
					border-radius: var(--bdr-max) var(--bdr-max) 0 0;
					z-index: 4;
					@media screen and (max-width: 720px) {
						position: static;
					}

					.title-container {
						--loc-grid-cols: 4;
						@media screen and (max-width: 720px) {
							--loc-grid-cols: 12;
						}
						grid-column: span var(--loc-grid-cols);
						display: flex;
						flex-direction: column;
						justify-content: center;

						.title {
							&.title--secondary {
								color: var(--clr-ink-tr-max);
								font: var(--font--heading--secondary--s);
								text-transform: var(--text-case--heading--secondary);
							}
							&.title--primary {
								color: var(--clr-ink);
								font: var(--font--heading--s);
							}
						}
					}

					/* BODY ------------------------------------------------- */
					& > .body {
						--loc-grid-cols: 8;
						grid-column: span var(--loc-grid-cols);
						display: flex;
						align-items: center;
						@media screen and (max-width: 720px) {
							display: none;
						}
					}
				}

				/* BODY ------------------------------------------------- */
				& > .body {
					width: 100%;
					height: 100%;
					display: grid;
					grid-template-columns: repeat(12, 1fr);
					@media screen and (max-width: 720px) {
						align-items: start;
						/* height: fit-content; */
						/* min-height: fit-content; */
					}

					/* SECONDARY -------------------------------------------- */
					& > .secondary {
						--loc-grid-cols: 4;
						@media screen and (max-width: 720px) {
							--loc-grid-cols: 12;
						}
						padding: var(--loc-gap);
						grid-column: span var(--loc-grid-cols);
						/* display: flex; */
						/* flex-direction: column; */
						/* justify-content: center; */
					}

					/* PRIMARY ---------------------------------------------- */
					& > .primary {
						--loc-grid-cols: 8;
						@media screen and (max-width: 720px) {
							--loc-grid-cols: 12;
						}
						padding: var(--loc-gap);
						grid-column: span var(--loc-grid-cols);
						display: flex;
						flex-direction: column;
						gap: var(--loc-gap);

						/* MEMBERSHIP BODY -------------------------------------- */
						#membership--form-body {
							--loc-gap: var(--gap-s);
							flex: 1;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;

							/* FORM SECTION ----------------------------------------- */
							.form--section {
								--loc-width--max: 100%;
								&.clamp--s {
									--loc-width--max: 560px;
								}
								width: 100%;
								max-width: var(--loc-width--max);
								display: flex;
								flex-direction: column;
								gap: var(--gap-l);

								/* FORM ------------------------------------------------- */
								form {
									width: 100%;
									display: flex;
									flex-direction: column;
									justify-content: center;
									gap: var(--loc-gap);

									/* FORM: Row -------------------------------------------- */
									& > .row {
										width: 100%;
										display: flex;
										gap: var(--loc-gap);
									}
								}

								/* FORM SECTION: Text ----------------------------------- */
								.form--text {
									text-align: center;
									&.form--text--heading {
										font: var(--font--heading--s);
									}
									&.form--text--annotation {
										color: var(--clr-ink-tr-heavy-x);
										font: var(--font--body--s);
									}
								}

								/* FORM SECTION: List ----------------------------------- */
								.list-container {
									--loca-gap: var(--gap-s);
									display: flex;
									flex-direction: column;

									& > .item {
										height: var(--sp-5);
										display: flex;
										justify-content: space-between;
										align-items: center;
										border-top: var(--bdw) solid var(--clr-primary-tr-light);

										& > .text {
											&.text--label {
												font: var(--font--label);
											}
											&.text--value {
												font: var(--font--label--secondary--l);
												text-transform: var(--text-case--label);
											}
										}
									}
								}
							}
						}

						/* FOOTER ----------------------------------------------- */
						& > footer {
							--loc-gap: var(--gap-s);
							position: sticky;
							bottom: var(--loc-gap);
							display: flex;
							justify-content: space-between;
							align-items: center;
							background-color: var(--clr-ev);
							&::before {
								content: '';
								position: absolute;
								top: calc(var(--gap-l) * -1);
								right: 0;
								left: 0;
								height: var(--gap-l);
								background-image: linear-gradient(to bottom, var(--clr-ev-tr-invisible) 0%, var(--clr-ev) 50% 100%);
							}
							&::after {
								content: '';
								position: absolute;
								bottom: calc(var(--gap-l) * -1);
								right: 0;
								left: 0;
								height: var(--gap-l);
								background-color: var(--clr-ev);
							}

							.body {
								flex: 1;
								display: flex;
								justify-content: center;
								align-items: center;
								span {
									&.hint {
										font: var(--font--label--s);
									}
								}
							}

							& > :global(button) {
								flex: 1;
							}
						}
					}
				}
			}
		}
	}

	/* SNIPPETS --------------------------------------------- */

	/* STEP PIP --------------------------------------------- */
	.step-pip {
		--loc-transition: var(--t-ix-hover);
		&.step-pip--pip {
			--loc-size: var(--sp-5);
			--loc-clr-bg: var(--clr-dv);
			--loc-clr-border: var(--clr-dv-heavy-tr-light);
			--loc-clr-ink: var(--clr-dv-heavy);
			&[data-active='true'] {
				--loc-clr-bg: var(--clr-primary);
				--loc-clr-border: var(--clr-primary);
				--loc-clr-ink: var(--clr-bg);
			}
			&[data-complete='true'] {
				--loc-clr-bg: var(--clr-primary-tr-light-x);
				--loc-clr-border: var(--clr-primary-tr-light);
				--loc-clr-ink: var(--clr-ink);
			}
			height: var(--sp-5);
			width: var(--sp-5);
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: var(--loc-clr-bg);
			border: var(--bdw) solid var(--loc-clr-border);
			border-radius: var(--bdr-s);
			transition: var(--loc-transition);
			cursor: pointer;

			& > span {
				color: var(--loc-clr-ink);
				font: var(--font--label--l);
			}
		}

		&.step-pip--delin {
			--loc-child--width: 0%;
			--loc-child--transition: 0ms;
			&[data-complete='true'] {
				--loc-child--width: 100%;
				--loc-child--transition: var(--t-anim-min);
			}
			flex: 1;
			height: var(--bdw);
			background-color: var(--clr-dv);

			.fill {
				height: 100%;
				width: var(--loc-child--width);
				background-color: var(--clr-primary-tr-heavy);
				transition: var(--loc-child--transition);
			}
		}
	}

	/* FORM DELIN ------------------------------------------- */
	.form-delin {
		/* background-color: red; */
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--gap-l);

		.line {
			flex: 1;
			border-top: var(--bdw) solid var(--clr-primary-tr-light);
		}

		.label {
			color: var(--clr-ink-tr-heavy-x);
			font: var(--font--heading--secondary--s);
			text-transform: var(--text-case--heading--secondary);
		}
	}

	/* EXISTING USER OVERLAY -------------------------------- */
	#existing-user-overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--gap-l);
		background-image: linear-gradient(to bottom, var(--clr-ev-tr-heavy) 0%, var(--clr-ev) 50% 100%);
		backdrop-filter: blur(var(--sp-min));
		border-radius: var(--bdr-max);
		z-index: 4;

		& > .body {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--gap-s);

			.text--heading {
				font: var(--font--heading--l);
			}

			.text--aux {
				--loc-clr-ink: var(--clr-ink-tr-heavy-x);
				--loc-font: var(--font--body--s);

				color: var(--loc-clr-ink);
				font: var(--loc-font);

				& > button {
					color: var(--loc-clr-ink);
					border-style: none;
					background-color: transparent;
					font: var(--loc-font);
					text-decoration: underline;
					cursor: pointer;
				}
			}
		}
	}

	/* FEE SELECTOR ----------------------------------------- */
	#fee-selector {
		--loc-gap: var(--gap-max);
		--loc-transition: var(--t-2);
		display: flex;
		flex-direction: column;
		gap: var(--loc-gap);
		width: 100%;

		/* HEADER ----------------------------------------------- */
		header {
			/* height: var(--sp-9); */
			display: flex;
			justify-content: space-between;

			.wrapper {
				--loc-flex: 2;
				--loc-justify-content: center;
				&:first-child {
					--loc-flex: 1;
					--loc-justify-content: start;
				}
				&:last-child {
					--loc-flex: 1;
					--loc-justify-content: end;
				}
				flex: var(--loc-flex);
				display: flex;
				justify-content: var(--loc-justify-content);

				.text--label {
					font: var(--font--heading--secondary--l);
					font-size: var(--fs-12);
				}
			}
		}

		/* BODY ------------------------------------------------- */
		& > .body {
			--loc-container--height: var(--sp-4);
			height: var(--loc-container--height);
			position: relative;
			display: flex;
			align-items: center;
			/* background-color: gainsboro; */

			/* METER ------------------------------------------------ */
			.meter {
				height: var(--sp-2);
				width: 100%;
				overflow: hidden;
				background-color: var(--clr-dv-tr-light);
				border: var(--bdw) solid var(--clr-dv);
				border-radius: var(--bdr-s);

				.fill {
					width: var(--loc-meter--perc);
					height: 100%;
					background-color: var(--clr-primary);
					border-radius: 0 var(--bdr-s) var(--bdr-s) 0;
					transition: calc(var(--loc-transition) * 2);
				}
			}

			/* PIP CONTAINER ---------------------------------------- */
			.pip-container {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.wrapper {
					--loc-flex: 2;
					--loc-justify-content: center;
					&:first-child {
						--loc-flex: 1;
						--loc-justify-content: start;
					}
					&:last-child {
						--loc-flex: 1;
						--loc-justify-content: end;
					}
					flex: var(--loc-flex);
					display: flex;
					justify-content: var(--loc-justify-content);
					align-items: center;

					.pip {
						--loc-size: var(--loc-container--height);
						--loc-clr-bg: var(--clr-dv-tr-heavy);
						--loc-clr-border: var(--clr-dv-heavy-tr-light);
						--loc-transform--scale: 1;
						--loc-transform--rot: 0deg;
						--loc-blur: var(--sp-min);
						&[data-active='true'] {
							--loc-clr-bg: var(--clr-primary-tr-light);
							--loc-clr-border: var(--clr-ev);
							--loc-transform--scale: 1.5;
							--loc-transform--rot: 45deg;
							--loc-blur: var(--sp-1);
						}
						&:hover {
							--loc-transform--scale: 1.5;
						}
						&:active {
							--loc-transform--scale: 0.875;
						}
						width: var(--loc-size);
						height: var(--loc-size);
						background-color: var(--loc-clr-bg);
						backdrop-filter: blur(var(--loc-blur));
						border: var(--bdw) solid var(--loc-clr-border);
						border-radius: var(--bdr-s);
						cursor: pointer;
						transform: scale(var(--loc-transform--scale)) rotate(var(--loc-transform--rot));
						transition: var(--loc-transition);
					}
				}
			}
		}

		/* FOOTER ----------------------------------------------- */
		footer {
			--loc-gap: var(--gap-l);
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--loc-gap);

			.title-container {
				display: flex;
				flex-direction: column;
				align-items: center;

				.text--title {
					color: var(--clr-ink);
					font: var(--font--heading--secondary--l);
					text-transform: var(--text-case--heading--secondary);
				}
			}

			.fee-container {
				--loc-gap: var(--gap-s);
				width: 100%;
				max-width: calc(var(--sp-12) * 3);
				padding: var(--loc-gap) calc(var(--loc-gap) * 2);
				display: flex;
				justify-content: space-between;
				align-items: center;
				/* gap: var(--gap-max); */
				background-color: var(--clr-dv-tr-light);
				border: var(--bdw) solid var(--clr-dv);
				border-radius: var(--bdr-s);

				.text {
					&.text--primary {
						font: var(--font--label--secondary--l);
						font-size: var(--fs-8);
					}
					&.text--secondary {
						font: var(--font--body--s);
						font-weight: var(--font-weight--body--l);
					}
				}
			}
		}
	}
</style>
