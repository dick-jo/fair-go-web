import { fail } from '@sveltejs/kit'
import { signUpWithMagicLink, sendMagicLink } from '$lib/utils/auth'
import type { Actions } from './$types'

export const actions: Actions = {
	magiclink: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string

		const result = await sendMagicLink(supabase, email, url.origin)

		if (result.error) {
			const statusCode = result.error.includes('wait a moment') ? 429 : 500
			return fail(statusCode, {
				error: result.error,
				email: result.email
			})
		}

		return {
			success: true,
			message: result.message
		}
	},

	signup: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData()

		const result = await signUpWithMagicLink(
			supabase,
			{
				email: formData.get('email') as string,
				firstName: formData.get('firstName') as string,
				lastName: formData.get('lastName') as string,
				postcode: formData.get('postcode') as string,
				source: 'auth_page'
			},
			url.origin
		)

		if (result.error) {
			const statusCode = result.error.includes('already registered') ? 409 : 400
			return fail(statusCode, {
				signupError: result.error,
				email: result.email,
				firstName: result.firstName,
				lastName: result.lastName,
				postcode: result.postcode
			})
		}

		return {
			signupSuccess: true,
			signupMessage: result.message
		}
	}
}
