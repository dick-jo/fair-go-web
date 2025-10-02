import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { updateCommunicationPreferences } from '$lib/server/subscribers'

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession()

	// If no user, return nulls (this route works without auth)
	if (!user?.email) {
		return {
			user: null,
			subscriber: null
		}
	}

	// If authenticated, load subscriber data (same pattern as /private)
	const { data: subscriber } = await supabase.from('subscribers').select('*').eq('email', user.email).single()

	// For this route, we allow subscriber to be null (they might not be subscribed yet)
	return {
		user,
		subscriber: subscriber || null
	}
}

export const actions: Actions = {
	updateCommunicationPreferences: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		const formData = await request.formData()
		const email = user?.email || (formData.get('email') as string)
		const emailOptIn = formData.get('emailOptIn') === 'on'

		if (!email) {
			return fail(400, { message: 'Email address is required' })
		}

		try {
			const result = await updateCommunicationPreferences(supabase, email, emailOptIn, !!user)
			return { message: result.message }
		} catch (error) {
			return fail(400, {
				message: error instanceof Error ? error.message : 'Update failed'
			})
		}
	}
}
