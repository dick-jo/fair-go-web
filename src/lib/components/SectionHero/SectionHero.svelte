<script lang="ts">
	import BrandDelin from '../BrandDelin/BrandDelin.svelte'
	import HeroCarousel from '../HeroCarousel/HeroCarousel.svelte'
	import type { HeroCarouselItem } from '../HeroCarousel/types'
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import { toaster } from '$lib/services/toaster/service.svelte'

	interface Props {
		heroCarouselItems: HeroCarouselItem[]
	}

	let { heroCarouselItems }: Props = $props()

	// STATE
	let email = $state('')
	let firstName = $state('')
	let lastName = $state('')
	let postcode = $state('')
	let isSubmitting = $state(false)

	// HANDLER
	async function handleSubmit(e: Event) {
		e.preventDefault()

		if (!email.trim() || !firstName.trim() || !lastName.trim() || !postcode.trim() || isSubmitting) {
			return
		}

		isSubmitting = true

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email.trim(),
					first_name: firstName.trim(),
					last_name: lastName.trim(),
					postcode: postcode.trim(),
					source: 'hero_signup'
				})
			})

			const data = await response.json()

			if (!response.ok) {
				toaster.show('failure', data.message, { type: 'negative' })
			} else {
				toaster.show('success', data.message, { type: 'positive' })
				// Clear form
				email = ''
				firstName = ''
				lastName = ''
				postcode = ''
			}
		} catch (error) {
			toaster.show('failure', 'Something went wrong. Please try again.', {
				type: 'negative'
			})
		} finally {
			isSubmitting = false
		}
	}
</script>

<!-- MARKUP -------------------------------------------- -->
<section id="section--hero" class="host section-hero">
	<div class="primary">
		<HeroCarousel items={heroCarouselItems} />
	</div>
	<div class="secondary">
		<div class="wrapper">
			<div class="title-container">
				<h2 class="title--sub">It's Time You Had a Fair Go</h2>
				<h1 class="title">We're fighting for a better, fairer go for real people just like you.</h1>
			</div>
			<p class="text--body">
				If you — like millions of other Australians failed by the major parties — are looking for a real alternative,
				Fair Go is for you. Lend us your support by signing up today.
			</p>
			<BrandDelin />
			<form onsubmit={handleSubmit}>
				<div class="row">
					<Input
						id="hero-firstName"
						name="firstName"
						label="First Name"
						type="text"
						required
						bind:value={firstName}
						disabled={isSubmitting}
					/>

					<Input
						id="hero-lastName"
						name="lastName"
						label="Last Name"
						type="text"
						required
						bind:value={lastName}
						disabled={isSubmitting}
					/>
				</div>

				<div class="row">
					<Input
						id="hero-email"
						name="email"
						label="Email"
						type="email"
						required
						bind:value={email}
						disabled={isSubmitting}
					/>

					<Input
						id="hero-postcode"
						name="postcode"
						label="Postcode"
						type="text"
						required
						maxlength={4}
						placeholder="e.g. 5000"
						bind:value={postcode}
						disabled={isSubmitting}
					/>
				</div>

				<Button
					label={isSubmitting ? 'Creating Account...' : 'Sign Up'}
					type="submit"
					disabled={isSubmitting || !email.trim() || !firstName.trim() || !lastName.trim() || !postcode.trim()}
				/>
			</form>
		</div>
	</div>
</section>

<!-- CSS ----------------------------------------------- -->
<style>
	.host {
		--loc-host-height: 640px;
		--loc-gap: var(--gap-l);

		@media screen and (max-width: 1080px) {
			--loc-host-height: fit-content;
		}
		height: var(--loc-host-height);
		display: grid;
		grid-template-columns: repeat(12, 1fr);

		/* PRIMARY ---------------------------------------------- */
		& > .primary {
			--loc-height: auto;
			--loc-grid-cols: 8;
			@media screen and (max-width: 1080px) {
				--loc-height: 400px;
				--loc-grid-cols: 12;
			}
			height: var(--loc-height);
			grid-column: span var(--loc-grid-cols);
		}

		/* SECONDARY -------------------------------------------- */
		& > .secondary {
			--loc-grid-cols: 4;
			--loc-clr-bg: var(--clr-ev);
			@media screen and (max-width: 1080px) {
				--loc-grid-cols: 12;
			}
			grid-column: span var(--loc-grid-cols);

			/* WRAPPER ---------------------------------------------- */
			.wrapper {
				--loc-height: 100%;
				container-type: inline-size;
				height: var(--loc-height);
				padding: var(--loc-gap);
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--loc-gap);
				background-color: var(--loc-clr-bg);
				/* border: var(--bdw) solid var(--clr-dv-tr-heavy); */
				/* border-radius: var(--bdr-l); */
				text-align: center;

				/* TITLES ----------------------------------------------- */
				.title-container {
					display: flex;
					flex-direction: column;

					.title--sub {
						/* color: var(--clr-ink-tr-heavy-x); */
						font: var(--font--heading--secondary);
						font-weight: bold;
						text-transform: var(--text-case--heading);
					}

					.title {
						display: none;
						color: var(--clr-ink);
						font: var(--font--heading--s);
						/* font-weight: 800; */
					}
				}

				/* TEXT: Body ------------------------------------------- */
				.text--body {
					/* flex: 1; */
					font: var(--font--body--s);
				}

				/* FORM ------------------------------------------------- */
				form {
					--loc-gap: var(--gap-s);
					/* background-color: red; */
					width: 100%;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: end;
					gap: var(--gap-s);

					& > .row {
						--loc-flex-direction: column;
						@media screen and (max-width: 1080px) {
							--loc-flex-direction: row;
						}
						@media screen and (max-width: 320px) {
							--loc-flex-direction: column;
						}
						display: flex;
						flex-direction: var(--loc-flex-direction);
						gap: var(--loc-gap);
					}
				}
			}
		}
	}
</style>
