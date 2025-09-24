import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { updateCommunicationPreferences, updateProfile, updateVolunteerProfile } from '$lib/utils/auth'

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
	},

	updateVolunteerStatus: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()

		if (!user) {
			return fail(401, { volunteerStatusError: 'Not authenticated' })
		}

		const formData = await request.formData()
		const isVolunteer = formData.get('isVolunteer') === 'on'

		const result = await updateVolunteerProfile(supabase, user.id, {
			is_volunteer: isVolunteer
		})

		if (result.error) {
			return fail(400, { volunteerStatusError: result.error })
		}

		throw redirect(303, '/private?updated=volunteer')
	},

	updateCommunicationPreferences: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()

		if (!user || !user.email) {
			return fail(401, { communicationPreferencesError: 'Not authenticated' })
		}

		const formData = await request.formData()
		const emailOptIn = formData.get('emailOptIn') === 'on'

		const result = await updateCommunicationPreferences(supabase, user.email, {
			email_opt_in: emailOptIn
		})

		if (result.error) {
			return fail(400, { communicationPreferencesError: result.error })
		}

		throw redirect(303, '/private?updated=communication')
	}
}
