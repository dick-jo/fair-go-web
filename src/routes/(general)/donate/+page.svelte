<script lang="ts">
	import { CircleCheckIcon, CircleIcon, GiftIcon } from '@lucide/svelte'
	import { type PageData } from '../$types'
	import type { Tables } from '$lib/types/supabase.types'
	import type { ActionResult } from '@sveltejs/kit'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import { enhance } from '$app/forms'
	import Button from '$lib/components/Button/Button.svelte'
	import Delin from '$lib/components/Delin/Delin.svelte'
	import { DONATION_AMOUNTS } from '$lib/config/donations'

	interface DonatePageData extends PageData {
		profile: Tables<'profiles'> | null
	}

	const { data }: { data: DonatePageData } = $props()

	// LOGIN ------------------------------------------------ //
	let loginStatus = $state<'idle' | 'pending'>('idle')

	function handleLoginSubmit() {
		loginStatus = 'pending'

		return async ({ result, update }: { result: ActionResult; update: () => Promise<void> }) => {
			await update()
			loginStatus = 'idle'

			if (result.type === 'success' && result.data) {
				toaster.show(result.type, result.data.message, { type: 'positive' })
			} else if (result.type === 'failure' && result.data) {
				toaster.show(result.type, result.data.error, { type: 'negative' })
			}
		}
	}

	// DONATION AMOUNT SELECTION ---------------------------- //
	let donateAmountSelection = $state<number>(1) // Default to $50
	const donateAmountSelected = $derived(DONATION_AMOUNTS[donateAmountSelection])

	function handleDonationAmountSelect(index: number) {
		donateAmountSelection = index
	}

	// DONATION FORM ---------------------------------------- //
	let donateStatus = $state<'idle' | 'pending'>('idle')

	function handleDonateSubmit() {
		donateStatus = 'pending'

		return async ({ result, update }: { result: ActionResult; update: () => Promise<void> }) => {
			await update()
			donateStatus = 'idle'

			if (result.type === 'success' && result.data) {
				// Redirect to Stripe checkout
				if (result.data.url) {
					window.location.href = result.data.url
				}
			} else if (result.type === 'failure' && result.data) {
				toaster.show(result.type, result.data.message, { type: 'negative' })
			}
		}
	}
</script>

<!-- INTRO -->
<section id="section--donate--intro">
	<div class="section-header section-header--grid">
		<div class="title-container">
			<GiftIcon />
			<h1 class="text text--title">Donate to FairGO</h1>
		</div>

		<p>
			Support FairGo's fight for a fairer Australia, backing solutions to soaring costs and weak governance. Your help
			powers real change against the majors' neglect.
		</p>

		<p>
			Join our mission to build strong communities and cut through waste. Every contribution fuels FairGo's bold push
			for transparency, safety, and a thriving Australia.
		</p>
	</div>
</section>

<!-- DONATE FORM CONTAINER -->
<section id="section--donate">
	<div class="container">
		<!-- LOG IN -->
		<section id="section--donate--log-in">
			{#if data.user && data.profile}
				<h3>
					Welcome back{data.profile?.first_name
						? `, ${data.profile.first_name}.`
						: data.user?.email
							? `, ${data.user.email}.`
							: ''}
				</h3>
				<p>Your details will be pre-filled below.</p>
			{:else}
				<h3>Already have a FairGo Account?</h3>
				<p>Log in to pre-fill your donation details.</p>

				<form method="POST" action="?/login" use:enhance={handleLoginSubmit}>
					<Input
						id="loginEmail"
						name="loginEmail"
						label="Email"
						type="email"
						required
						disabled={loginStatus === 'pending'}
					/>
					<Button
						label={loginStatus === 'idle' ? 'Log In' : 'Sending...'}
						type="submit"
						disabled={loginStatus === 'pending'}
					/>
				</form>
			{/if}
		</section>

		<!-- <Delin> -->
		<!-- 	<h4>OR</h4> -->
		<!-- </Delin> -->

		<!-- DONATE -->
		<section id="section--donate--primary">
			{#if data.user && data.profile}
				<h3>Make Your Donation</h3>
			{:else}
				<h3>Or, Donate Without Logging In</h3>
			{/if}

			<form method="POST" action="?/donate" use:enhance={handleDonateSubmit}>
				<Delin>
					<h4 class="text text--title--sub">Select Amount</h4>
				</Delin>

				<div id="donate-amount-selection-container">
					{#each DONATION_AMOUNTS as amount, index}
						<button
							type="button"
							class="donation-amount-item"
							data-active={donateAmountSelection === index}
							onclick={() => handleDonationAmountSelect(index)}
						>
							<span class="text text--label">${amount}</span>
							{#if index === donateAmountSelection}
								<CircleCheckIcon />
							{:else}
								<CircleIcon />
							{/if}
						</button>
					{/each}
				</div>

				<!-- Hidden input to submit selected amount -->
				<input type="hidden" name="amount" value={donateAmountSelected} />

				<Delin>
					<h4 class="text text--title--sub">Your Details</h4>
				</Delin>

				<div class="row">
					<Input
						id="firstName"
						name="firstName"
						label="First Name"
						type="text"
						value={data.profile?.first_name || ''}
						required
						disabled={donateStatus === 'pending'}
					/>
					<Input
						id="lastName"
						name="lastName"
						label="Last Name"
						type="text"
						value={data.profile?.last_name || ''}
						required
						disabled={donateStatus === 'pending'}
					/>
				</div>

				<div class="row">
					<Input
						id="email"
						name="email"
						label="Email"
						type="email"
						value={data.user?.email || ''}
						required
						disabled={donateStatus === 'pending'}
					/>
					<Input
						id="phone"
						name="phone"
						label="Phone Number"
						type="tel"
						placeholder="e.g. 0420 123 456"
						value={data.profile?.phone || ''}
						required
						disabled={donateStatus === 'pending'}
					/>
				</div>

				<div class="row">
					<Input
						id="streetAddress"
						name="streetAddress"
						label="Street Address"
						type="text"
						placeholder="e.g. 72 Fair Street"
						value={data.profile?.street_address || ''}
						required
						disabled={donateStatus === 'pending'}
					/>
				</div>

				<div class="row">
					<Input
						id="suburb"
						name="suburb"
						label="Suburb"
						type="text"
						placeholder="e.g. Adelaide"
						value={data.profile?.suburb || ''}
						required
						disabled={donateStatus === 'pending'}
					/>
					<Input
						id="postcode"
						name="postcode"
						label="Postcode"
						type="text"
						maxlength={4}
						placeholder="e.g. 5000"
						value={data.profile?.postcode || ''}
						required
						disabled={donateStatus === 'pending'}
					/>
				</div>

				<p class="text text--hint">
					You will be redirected to our secure payment partner. All transactions are secure and encrypted.
				</p>
				<Button
					label={donateStatus === 'idle' ? `Donate $${donateAmountSelected}` : 'Processing...'}
					type="submit"
					disabled={donateStatus === 'pending'}
				/>
			</form>
		</section>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	#section--donate {
		padding: var(--loc-gap);
		align-items: center;

		/* FORM ------------------------------------------------- */
		& > .container {
			width: 100%;
			max-width: var(--clamp--content-width--s-x);
			padding: var(--loc-gap);
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);
			background-color: var(--clr-ev);
			border: var(--bdw) solid var(--clr-dv);
			border-radius: var(--bdr-max);
			text-align: center;

			/* SECTIONS --------------------------------------------- */
			section {
				--loc-gap: var(--gap-s);
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--loc-gap);

				/* TEXT OVERRIDES --------------------------------------- */
				& > p {
					font: var(--font--body--s);
				}

				/* FORMS ------------------------------------------------ */
				form {
					width: 100%;
					display: flex;
					flex-direction: column;
					gap: var(--loc-gap);

					/* TEXT ------------------------------------------------- */
					.text {
						text-align: center;
						&.text--title--sub {
							font: var(--font--heading--secondary--s);
						}
						&.text--hint {
							font: var(--font--body--s);
						}
					}

					/* ROW -------------------------------------------------- */
					& > .row {
						display: flex;
						gap: var(--loc-gap);
						@media screen and (max-width: 400px) {
							flex-direction: column;
						}
					}

					/* DONATION AMOUNT -------------------------------------- */
					#donate-amount-selection-container {
						display: flex;
						flex-wrap: wrap;
						justify-content: center;
						gap: var(--loc-gap);

						.donation-amount-item {
							--loc-gap: var(--gap-s);
							--loc-clr-bg: var(--clr-dv-tr-heavy);
							--loc-clr-border: var(--clr-dv-heavy-tr-light);
							--loc-clr-ink: var(--clr-dv-heavy);
							--loc-transition: var(--t-ix-hover);
							&:hover {
								--loc-clr-bg: var(--clr-dv);
								--loc-clr-border: var(--clr-dv-heavy);
								--loc-clr-ink: var(--clr-ink);
							}
							&[data-active='true'] {
								--loc-clr-bg: var(--clr-primary-tr-light-x);
								--loc-clr-border: var(--clr-primary-tr-heavy);
								--loc-clr-ink: var(--clr-ink);
							}
							height: var(--sp-5);
							padding: var(--gap-l);
							flex: 1;
							display: flex;
							justify-content: space-between;
							align-items: center;
							gap: var(--loc-gap);
							background-color: var(--loc-clr-bg);
							border: var(--bdw) solid var(--loc-clr-border);
							border-radius: var(--bdr-s);
							cursor: pointer;
							transition: var(--loc-transition);

							.text {
								&.text--label {
									color: var(--loc-clr-ink);
									font: var(--font--label--l);
								}
							}

							& > :global(svg) {
								stroke: var(--loc-clr-ink);
							}
						}
					}
				}
			}
		}
	}
</style>
