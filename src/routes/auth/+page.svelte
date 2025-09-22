<script lang="ts">
	import AlertBox from '$lib/components/AlertBox/AlertBox.svelte'
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import { OctagonAlertIcon, SquareCheckBig } from '@lucide/svelte'
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'

	let { form }: { form: ActionData } = $props()

	// STATE ------------------------------------------------ //
	let isSubmittingLogIn = $state(false)
	let isSubmittingSignUp = $state(false)

	// HANDLERS --------------------------------------------- //
	function handleLogInSubmit() {
		isSubmittingLogIn = true
		return async ({ update }: { update: () => Promise<void> }) => {
			await update()
			isSubmittingLogIn = false
		}
	}

	function handleSignUpSubmit() {
		isSubmittingSignUp = true
		return async ({ update }: { update: () => Promise<void> }) => {
			await update()
			isSubmittingSignUp = false
		}
	}
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--auth" class="host">
	<div class="container">
		<!-- LOG IN -------------------------------------------- -->
		<section id="section--auth--log-in">
			<div class="header">
				<h2 class="title">Log in.</h2>
				<p class="description">
					Been here before? Just enter your email below, and we'll send you a one-time magic link to continue.
				</p>
			</div>

			<form method="POST" action="?/magiclink" use:enhance={handleLogInSubmit}>
				<Input id="email" name="email" label="Email" type="email" required value={form?.email || ''} />
				<Button label={isSubmittingLogIn ? 'Sending...' : 'Log in'} type="submit" disabled={isSubmittingLogIn} />
			</form>

			<!-- Display results -->
			{#if form?.success}
				<AlertBox
					label="Magic Link Sent"
					message="Check your inbox for your magic link."
					fit="extrinsic"
					colorway="sentiment-positive"
					icon={SquareCheckBig}
					useShadow={false}
				/>
			{/if}

			{#if form?.error}
				<AlertBox
					label="Error Logging In"
					message={form.error}
					fit="extrinsic"
					colorway="sentiment-negative"
					icon={OctagonAlertIcon}
					useShadow={false}
				/>
			{/if}
		</section>

		<!-- DELIN --------------------------------------------- -->
		<div class="delin">
			<div class="line"></div>
			<span class="label">Or</span>
			<div class="line"></div>
		</div>

		<!-- SIGN UP ------------------------------------------- -->
		<section id="section--auth--sign-up">
			<div class="header">
				<h2 class="title">Sign Up.</h2>
				<p class="description">
					Provide your details to create a new account. We'll send you a secure link to confirm and get started.
				</p>
			</div>

			<form method="POST" action="?/signup" use:enhance={handleSignUpSubmit}>
				<div class="row">
					<Input
						id="firstName"
						name="firstName"
						label="First Name"
						type="text"
						required
						value={form?.firstName || ''}
					/>
					<Input id="lastName" name="lastName" label="Last Name" type="text" required value={form?.lastName || ''} />
				</div>

				<Input id="signup-email" name="email" label="Email" type="email" required value={form?.email || ''} />

				<Input
					id="postcode"
					name="postcode"
					label="Postcode"
					type="text"
					required
					maxlength={4}
					placeholder="e.g. 5000"
					value={form?.postcode || ''}
				/>

				<Button
					label={isSubmittingSignUp ? 'Creating Account...' : 'Sign Up'}
					type="submit"
					disabled={isSubmittingSignUp}
				/>
			</form>

			<!-- Display signup results -->
			{#if form?.signupSuccess}
				<AlertBox
					label="Account Created"
					message={form.signupMessage}
					fit="extrinsic"
					colorway="sentiment-positive"
					icon={SquareCheckBig}
					useShadow={false}
				/>
			{/if}

			{#if form?.signupError}
				<AlertBox
					label="Error Creating Account"
					message={form.signupError}
					fit="extrinsic"
					colorway="sentiment-negative"
					icon={OctagonAlertIcon}
					useShadow={false}
				/>
			{/if}
		</section>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	.host#section--auth {
		padding: var(--loc-gap);
		align-items: center;

		/* CONTAINER -------------------------------------------- */
		.container {
			--loc-container--width--max: 480px;
			--loc-clr-bg: var(--clr-ev);
			width: 100%;
			max-width: var(--loc-container--width--max);
			padding: var(--loc-gap);
			display: flex;
			flex-direction: column;
			gap: var(--loc-gap);
			background-color: var(--loc-clr-bg);
			border: var(--bdw) solid var(--clr-dv);
			border-radius: var(--bdr-l);

			/* SECTION: Log In + Sign Up ---------------------------- */
			section#section--auth--log-in,
			section#section--auth--sign-up {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--loc-gap);

				/* HEADER ----------------------------------------------- */
				.header {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: var(--gap-min);
					text-align: center;

					.title {
						font: var(--font--heading--s);
					}

					.description {
						color: var(--clr-ink-tr-heavy-x);
						font: var(--font--body--s);
					}
				}

				form {
					display: flex;
					flex-direction: column;
					gap: var(--gap-s);
					width: 100%;

					/* ROW for side-by-side inputs */
					.row {
						display: flex;
						gap: var(--gap-s);
					}
				}
			}
		}

		/* DELIN ------------------------------------------------ */
		.delin {
			display: flex;
			align-items: center;
			gap: var(--loc-gap);

			.line {
				height: 2px;
				flex: 1;
				border-top: var(--bdw) solid var(--clr-primary-tr-light);
			}

			.label {
				font: var(--font--label--secondary--l);
				text-transform: var(--text-case--label);
			}
		}
	}
</style>
