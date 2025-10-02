import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { updateProfile, updateVolunteerStatus } from '$lib/server/profiles'
import { updateCommunicationPreferences } from '$lib/server/subscribers'

export const actions: Actions = {
	updateYourDetails: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()

		if (!user) {
			return fail(401, { message: 'Not authenticated' })
		}

		const formData = await request.formData()

		try {
			const result = await updateProfile(supabase, user.id, {
				first_name: formData.get('firstName') as string,
				last_name: formData.get('lastName') as string,
				date_of_birth: formData.get('dob') as string,
				street_address: formData.get('streetAddress') as string,
				suburb: formData.get('suburb') as string,
				postcode: formData.get('postcode') as string,
				phone: formData.get('phone') as string
			})

			return { message: result.message }
		} catch (error) {
			return fail(400, {
				message: error instanceof Error ? error.message : 'Update failed'
			})
		}
	},

	updateVolunteerStatus: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()

		if (!user) {
			return fail(401, { message: 'Not authenticated' })
		}

		const formData = await request.formData()
		const isVolunteer = formData.get('isVolunteer') === 'on'

		try {
			const result = await updateVolunteerStatus(supabase, user.id, isVolunteer)

			return { message: result.message }
		} catch (error) {
			return fail(400, {
				message: error instanceof Error ? error.message : 'Update failed'
			})
		}
	},

	updateCommunicationPreferences: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()

		if (!user || !user.email) {
			return fail(401, { message: 'Not authenticated' })
		}

		const formData = await request.formData()
		const emailOptIn = formData.get('emailOptIn') === 'on'

		try {
			const result = await updateCommunicationPreferences(supabase, user.email, emailOptIn, true)

			return { message: result.message }
		} catch (error) {
			return fail(400, {
				message: error instanceof Error ? error.message : 'Update failed'
			})
		}
	}
}
