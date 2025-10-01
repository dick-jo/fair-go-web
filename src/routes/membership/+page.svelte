<script lang="ts">
	import { signOut } from '$lib/client/auth'
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import type { Database } from '$lib/types/supabase.types'
	import { fade } from 'svelte/transition'
	import type { PageData } from '../$types'
	import { FORM_CONTENT, HEADER_CONTENT } from './content'
	import type { ActionResult } from '@sveltejs/kit'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import { enhance } from '$app/forms'
	import AlertBox from '$lib/components/AlertBox/AlertBox.svelte'
	import { OctagonAlertIcon } from '@lucide/svelte'

	interface MembershipPageData extends PageData {
		profile: Database['public']['Tables']['profiles']['Row'] | null
		subscriber: Database['public']['Tables']['subscribers']['Row'] | null
	}

	let { data }: { data: MembershipPageData } = $props()

	// $inspect(data)

	// TS --------------------------------------------------- //
	type StepConfig = {
		hasFooter: boolean
		formAction?: string
		action?: () => void
	}

	type FormStatus = 'idle' | 'pending'

	// CONFIG ----------------------------------------------- //
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
			formAction: '?/updateMembershipDetails',
			action: () => formEltElectoralRollDetails?.requestSubmit()
		},
		3: {
			hasFooter: true,
			action: () => next()
		}
	}

	// MEMBERSHIP FORM ELEMENT BINDINGS --------------------- //
	let formEltElectoralRollDetails = $state<HTMLFormElement>()

	// MEMBERSHIP FORM: State ------------------------------- //
	let membershipFormStep = $state<number>(0)

	let formLoginStatus = $state<FormStatus>('idle')
	let formSignUpStatus = $state<FormStatus>('idle')
	let formElectoralRollDetailsStatus = $state<FormStatus>('idle')

	let isNextButtonDisabled = $derived(formElectoralRollDetailsStatus === 'pending')

	// MEMBERSHIP FORM: Steps API --------------------------- //
	function next() {
		membershipFormStep += 1
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
	// Step 0: Login (no auto-advance, different key)
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

	// Step 0: Sign Up (no auto-advance, different keys)
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

	// Step 2: Electoral Roll Details (auto-advance, standard keys)
	const handleElectoralRollDetailsSubmit = createStepFormHandler({
		get value() {
			return formElectoralRollDetailsStatus
		},
		set value(v) {
			formElectoralRollDetailsStatus = v
		}
	})

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
		onclick={() => toStep(index)}
	>
		<span>{index + 1}</span>
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
	<div id="existing-user-overlay" out:fade={{ duration: 300 }}>
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

<!-- MARKUP -------------------------------------------- -->
<section id="section--membership--host" class="host">
	<div class="clamp">
		<!-- HEADER--------------------------------------------- -->
		<!-- <header> -->
		<!-- 	<div class="item item--title-container"> -->
		<!-- 		<h2 class="title title--secondary">Join the fight for a fair go</h2> -->
		<!-- 		<h1 class="title title--primary">Become a member</h1> -->
		<!-- 	</div> -->
		<!---->
		<!-- 	{#each HEADER_CONTENT as item} -->
		<!-- 		<div class="item item--content"> -->
		<!-- 			{@render headerContentItem(item.content)} -->
		<!-- 		</div> -->
		<!-- 	{/each} -->
		<!-- </header> -->

		<!-- FORM CONTAINER ------------------------------------ -->
		<div id="membership--form-container">
			{#if data.user && data.profile && membershipFormStep === 0}
				{@render existingUserOverlay()}
			{/if}
			<!-- HEADER -------------------------------------------- -->
			<header>
				<div class="title-container">
					<h4 class="title title--secondary">Step {membershipFormStep + 1}</h4>
					<h3 class="title title--primary">{FORM_CONTENT[membershipFormStep].title}</h3>
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
						<p>
							{p}
						</p>
						{#if i < FORM_CONTENT[membershipFormStep].description.length - 1}
							<br />
						{/if}
					{/each}
				</div>

				<div class="primary">
					<!-- FORM ---------------------------------------------- -->
					<div id="membership--form-body">
						<!-- STEP 0--------------------------------------------- -->
						{#if membershipFormStep === 0}
							<div class="form--section clamp--s">
								<form method="POST" action="?/login" use:enhance={handleLoginSubmit}>
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

								<form method="POST" action="?/signup" use:enhance={handleSignUpSubmit}>
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
										label={formSignUpStatus === 'idle' ? 'Log In' : 'Sending...'}
										type="submit"
										disabled={formSignUpStatus === 'pending'}
									/>
								</form>
							</div>
						{/if}

						<!-- STEP 2--------------------------------------------- -->
						{#if membershipFormStep === 2}
							{#if data.session && data.user}
								<div class="form--section clamp--s">
									<form
										bind:this={formEltElectoralRollDetails}
										method="POST"
										action="?/updateElectoralRollDetails"
										use:enhance={handleElectoralRollDetailsSubmit}
									>
										<div class="row">
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

										<Input
											id="membershipStreetAddress"
											name="membershipStreetAddress"
											label="Street Address"
											type="text"
											placeholder="e.g. 72 Fair Street"
											value={data.profile?.street_address || ''}
											required
										/>

										<div class="row">
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
								<div class="form--section fallback">
									<AlertBox
										label="Error"
										message="You must be logged in to complete this step."
										colorway="sentiment-negative"
										icon={OctagonAlertIcon}
									/>
								</div>
							{/if}
						{/if}

						<!-- STEP 3--------------------------------------------- -->
						{#if membershipFormStep === 3}
							<div class="form--section clamp--s">
								<form>
									<Input
										id="streetAddress"
										name="streetAddress"
										label="Street Address"
										type="text"
										placeholder="e.g. 72 Fair Street"
										required
									/>

									<div class="row">
										<Input id="suburb" name="suburb" label="Suburb" type="text" required />
										<Input id="addressPostcode" name="addressPostode" label="Postcode" type="text" required />
									</div>
								</form>
							</div>
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
								disabled={isNextButtonDisabled}
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
					height: fit-content;
					min-height: var(--sp-10);
					padding: var(--loc-gap);
					position: sticky;
					top: 0;
					display: grid;
					grid-template-columns: repeat(12, 1fr);
					gap: var(--loc-gap);
					background-color: var(--clr-ev);
					border-bottom: var(--bdw) solid var(--clr-dv);
					border-radius: var(--bdr-max) var(--bdr-max) 0 0;

					.title-container {
						--loc-grid-cols: 4;
						grid-column: span var(--loc-grid-cols);
						display: flex;
						flex-direction: column;

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
						/* gap: var(--loc-gap); */
					}
				}

				/* BODY ------------------------------------------------- */
				& > .body {
					width: 100%;
					height: 100%;
					display: grid;
					grid-template-columns: repeat(12, 1fr);

					/* SECONDARY -------------------------------------------- */
					& > .secondary {
						--loc-grid-cols: 4;
						padding: var(--loc-gap);
						grid-column: span var(--loc-grid-cols);
						/* display: flex; */
						/* flex-direction: column; */
						/* justify-content: center; */
					}

					/* PRIMARY ---------------------------------------------- */
					& > .primary {
						--loc-grid-cols: 8;
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
								&.fallback {
									align-items: center;
								}

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

									/* FORM: Text ------------------------------------------- */
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
</style>
