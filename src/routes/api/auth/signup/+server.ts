import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { createUserWithMagicLink } from '$lib/server/auth'

export const POST: RequestHandler = async ({ request, locals: { supabase }, url }) => {
	try {
		const { email, first_name, last_name, postcode, source } = await request.json()

		if (!email || !first_name || !last_name || !postcode) {
			return json({ message: 'All fields are required' }, { status: 400 })
		}

		const result = await createUserWithMagicLink(
			supabase,
			email,
			first_name,
			last_name,
			postcode,
			source || 'hero_signup',
			`${url.origin}/auth/callback`
		)

		return json({ message: result.message }, { status: 200 })
	} catch (error) {
		return json({ message: error instanceof Error ? error.message : 'Signup failed' }, { status: 400 })
	}
}
