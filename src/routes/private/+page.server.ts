// src/routes/private/+page.server.ts - keep it minimal
import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { updateProfile } from '$lib/utils/auth'

export const load: PageServerLoad = async () => {
	return {}
}

export const actions: Actions = {
	updateYourDetails: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()

		if (!user) {
			return fail(401, { yourDetailsError: 'Not authenticated' })
		}

		const formData = await request.formData()
		const result = await updateProfile(supabase, user.id, {
			first_name: formData.get('firstName') as string,
			last_name: formData.get('lastName') as string,
			postcode: formData.get('postcode') as string,
			phone: formData.get('phone') as string
		})

		if (result.error) {
			return fail(400, { yourDetailsError: result.error })
		}

		throw redirect(303, '/private?updated=profile')
	}
}
