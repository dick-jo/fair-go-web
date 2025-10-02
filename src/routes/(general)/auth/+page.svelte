<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import { toaster } from '$lib/services/toaster/service.svelte'
	import type { ActionResult } from '@sveltejs/kit'
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'

	let { form }: { form: ActionData } = $props()

	// STATE ------------------------------------------------ //
	type FormStatus = 'idle' | 'pending'

	let formState = $state({
		login: {
			status: 'idle' as FormStatus
		},
		signup: {
			status: 'idle' as FormStatus
		}
	})

	// HANDLERS --------------------------------------------- //
	function handleLoginSubmit() {
		formState.login.status = 'pending'

		return async ({ result, update }: { result: ActionResult; update: () => Promise<void> }) => {
			await update()
			formState.login.status = 'idle'

			if (result.type === 'success' && result.data) {
				toaster.show(result.type, result.data.message, { type: 'positive' })
			} else if (result.type === 'failure' && result.data) {
				toaster.show(result.type, result.data.error, { type: 'negative' })
			}
		}
	}

	function handleSignupSubmit() {
		formState.signup.status = 'pending'

		return async ({ result, update }: { result: ActionResult; update: () => Promise<void> }) => {
			await update()
			formState.signup.status = 'idle'

			if (result.type === 'success' && result.data) {
				toaster.show(result.type, result.data.signupMessage, { type: 'positive' })
			} else if (result.type === 'failure' && result.data) {
				toaster.show(result.type, result.data.signupError, { type: 'negative' })
			}
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

			<form method="POST" action="?/magiclink" use:enhance={handleLoginSubmit}>
				<Input
					id="email"
					name="email"
					label="Email"
					type="email"
					required
					value={form?.email || ''}
					disabled={formState.login.status === 'pending'}
				/>
				<Button
					label={formState.login.status === 'idle' ? 'Log in' : 'Sending...'}
					type="submit"
					disabled={formState.login.status === 'pending'}
				/>
			</form>
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

			<form method="POST" action="?/signup" use:enhance={handleSignupSubmit}>
				<div class="row">
					<Input
						id="firstName"
						name="firstName"
						label="First Name"
						type="text"
						required
						value={form?.firstName || ''}
						disabled={formState.signup.status === 'pending'}
					/>
					<Input
						id="lastName"
						name="lastName"
						label="Last Name"
						type="text"
						required
						value={form?.lastName || ''}
						disabled={formState.signup.status === 'pending'}
					/>
				</div>

				<Input
					id="signup-email"
					name="email"
					label="Email"
					type="email"
					required
					value={form?.email || ''}
					disabled={formState.signup.status === 'pending'}
				/>

				<Input
					id="postcode"
					name="postcode"
					label="Postcode"
					type="text"
					required
					maxlength={4}
					placeholder="e.g. 5000"
					value={form?.postcode || ''}
					disabled={formState.signup.status === 'pending'}
				/>

				<Button
					label={formState.signup.status === 'idle' ? 'Sign Up' : 'Creating Account...'}
					type="submit"
					disabled={formState.signup.status === 'pending'}
				/>
			</form>
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
