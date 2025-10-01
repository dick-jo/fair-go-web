import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { createUserWithMagicLink, sendLoginMagicLink } from '$lib/server/auth'

export const actions: Actions = {
	magiclink: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string

		try {
			const result = await sendLoginMagicLink(supabase, email, `${url.origin}/auth/callback`)
			return {
				success: true,
				message: result.message
			}
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Failed to send magic link',
				email
			})
		}
	},

	signup: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData()

		try {
			const result = await createUserWithMagicLink(
				supabase,
				formData.get('email') as string,
				formData.get('firstName') as string,
				formData.get('lastName') as string,
				formData.get('postcode') as string,
				'auth_page',
				`${url.origin}/auth/callback`
			)

			return {
				signupSuccess: true,
				signupMessage: result.message
			}
		} catch (error) {
			return fail(400, {
				signupError: error instanceof Error ? error.message : 'Failed to create account',
				email: formData.get('email') as string,
				firstName: formData.get('firstName') as string,
				lastName: formData.get('lastName') as string,
				postcode: formData.get('postcode') as string
			})
		}
	}
}
