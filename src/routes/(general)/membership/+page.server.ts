import { createUserWithMagicLink, sendLoginMagicLink } from '$lib/server/auth'
import type { Database } from '$lib/types/supabase.types'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { updateProfile } from '$lib/server/profiles'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type SubscriberRow = Database['public']['Tables']['subscribers']['Row']

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession()

	// If no authenticated user, return empty - layout already provides session/user
	if (!user?.email) {
		return {
			profile: null as ProfileRow | null,
			subscriber: null as SubscriberRow | null
		}
	}

	// Only fetch the NEW data not already in the layout
	const [profileQuery, subscriberQuery] = await Promise.all([
		supabase.from('profiles').select('*').eq('id', user.id).single(),
		supabase.from('subscribers').select('*').eq('email', user.email).single()
	])

	return {
		profile: profileQuery.data as ProfileRow | null,
		subscriber: subscriberQuery.data as SubscriberRow | null
	}
}

// ACTIONS ---------------------------------------------- //
export const actions: Actions = {
	// LOGIN ------------------------------------------------ //
	login: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData()
		const email = formData.get('loginEmail') as string

		try {
			const result = await sendLoginMagicLink(supabase, email, `${url.origin}/auth/callback?next=/membership`)
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

	// SIGNUP ----------------------------------------------- //
	signup: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData()

		try {
			const result = await createUserWithMagicLink(
				supabase,
				formData.get('signUpEmail') as string,
				formData.get('signUpFirstName') as string,
				formData.get('signUpLastName') as string,
				formData.get('signUpPostCode') as string,
				'auth_page',
				`${url.origin}/auth/callback?next=/membership`
			)

			return {
				success: true,
				message: result.message
			}
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Failed to create account',
				email: formData.get('email') as string,
				firstName: formData.get('firstName') as string,
				lastName: formData.get('lastName') as string,
				postcode: formData.get('postcode') as string
			})
		}
	},

	// UPDATE MEMBERSHIP DETAILS (Profile) ------------------ //
	updateElectoralRollDetails: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		if (!user) return fail(401, { message: 'Not authenticated' })

		const formData = await request.formData()

		try {
			const result = await updateProfile(
				supabase,
				user.id,
				{
					date_of_birth: formData.get('membershipDob') as string,
					phone: formData.get('membershipPhone') as string,
					street_address: formData.get('membershipStreetAddress') as string,
					suburb: formData.get('membershipSuburb') as string,
					postcode: formData.get('membershipPostCode') as string
				},
				false
			)
			return { message: result.message }
		} catch (error) {
			return fail(400, { message: error instanceof Error ? error.message : 'Update failed' })
		}
	},

	// UPDATE CONSENT (Profile) ----------------------------- //
	updateConsent: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		if (!user) return fail(401, { message: 'Not authenticated' })

		const formData = await request.formData()

		// Extract checkbox values
		const pledgeAccepted = formData.get('consentPledge') === 'on'
		const electoralConsent = formData.get('consentElectoral') === 'on'

		// Server-side validation - both must be checked
		if (!pledgeAccepted || !electoralConsent) {
			return fail(400, {
				message: 'You must accept both the pledge and consent to continue'
			})
		}

		try {
			const now = new Date().toISOString()

			const result = await updateProfile(
				supabase,
				user.id,
				{
					pledge_accepted_at: now,
					party_exclusivity_confirmed_at: now,
					aec_data_sharing_consent_at: now
				},
				false
			)
			return { message: result.message }
		} catch (error) {
			return fail(400, { message: error instanceof Error ? error.message : 'Update failed' })
		}
	}
}
