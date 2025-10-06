import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { sendLoginMagicLink } from '$lib/server/auth'
import { updateProfile } from '$lib/server/profiles'
import { isValidDonationAmount } from '$lib/config/donations'

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession()

	if (!user) {
		return { profile: null }
	}

	const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

	if (error) {
		console.error('Failed to load profile for donations:', error)
	}

	return {
		profile: data || null
	}
}

export const actions: Actions = {
	login: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData()
		const email = formData.get('loginEmail') as string

		try {
			const result = await sendLoginMagicLink(supabase, email, `${url.origin}/auth/callback?next=/donate`)

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

	donate: async ({ request, locals: { supabase, safeGetSession }, fetch }) => {
		const { user } = await safeGetSession()
		const formData = await request.formData()

		const amount = parseInt(formData.get('amount') as string)

		// Validate amount
		if (!isValidDonationAmount(amount)) {
			return fail(400, { message: 'Invalid donation amount' })
		}

		const donorInfo = {
			email: formData.get('email') as string,
			firstName: formData.get('firstName') as string,
			lastName: formData.get('lastName') as string,
			phone: formData.get('phone') as string,
			streetAddress: formData.get('streetAddress') as string,
			suburb: formData.get('suburb') as string,
			postcode: formData.get('postcode') as string
		}

		// If logged in, update profile with any changes
		if (user) {
			try {
				await updateProfile(
					supabase,
					user.id,
					{
						first_name: donorInfo.firstName,
						last_name: donorInfo.lastName,
						phone: donorInfo.phone,
						street_address: donorInfo.streetAddress,
						suburb: donorInfo.suburb,
						postcode: donorInfo.postcode
					},
					false // Don't require changes
				)
			} catch (error) {
				console.error('Profile update failed:', error)
				// Continue anyway - profile update is optional
			}
		}

		// Create Stripe checkout
		try {
			const response = await fetch('/api/create-donation-checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount, donorInfo })
			})

			if (!response.ok) {
				throw new Error('Failed to create checkout')
			}

			const { url } = await response.json()
			return { url }
		} catch (error) {
			return fail(500, { message: 'Failed to process donation' })
		}
	}
}
