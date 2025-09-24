import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession()

	// If user is authenticated, load their current preferences
	if (user?.email) {
		const { data: subscriber } = await supabase
			.from('subscribers')
			.select('email_opt_in')
			.eq('email', user.email)
			.single()

		return {
			isAuthenticated: true,
			userEmail: user.email,
			currentPreference: subscriber?.email_opt_in ?? true
		}
	}

	// Unauthenticated user
	return {
		isAuthenticated: false,
		userEmail: null,
		currentPreference: null
	}
}

export const actions: Actions = {
	updatePreferences: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		const formData = await request.formData()
		const email = user?.email || (formData.get('email') as string)
		const emailOptIn = formData.get('emailOptIn') === 'on'

		if (!email) {
			return fail(400, { error: 'Email is required' })
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Please enter a valid email address' })
		}

		// For authenticated users, use the standard update method
		if (user?.email) {
			const { error } = await supabase.from('subscribers').update({ email_opt_in: emailOptIn }).eq('email', user.email)

			if (error) {
				return fail(500, { error: 'Failed to update preferences. Please try again.' })
			}
		} else {
			// For anonymous users, use our safe function
			const { data: wasUpdated, error } = await supabase.rpc('update_email_opt_in_anonymous', {
				target_email: email.trim().toLowerCase(),
				new_opt_in: emailOptIn
			})

			if (error) {
				return fail(500, { error: 'Failed to update preferences. Please try again.' })
			}

			if (!wasUpdated) {
				return fail(404, { error: 'Email address not found in our records.' })
			}
		}

		return {
			success: true,
			message: 'Your email preferences have been updated successfully'
		}
	}
}
