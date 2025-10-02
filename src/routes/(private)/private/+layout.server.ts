import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	// We still need to get user from safeGetSession because parent() only gives us server data
	const { user } = await safeGetSession()

	// Auth check
	if (!user || !user.email) {
		throw error(401, 'Authentication required')
	}

	// Fetch the additional data we need
	const [profileQuery, subscriberQuery] = await Promise.all([
		supabase.from('profiles').select('*').eq('id', user.id).single(),
		supabase.from('subscribers').select('*').eq('email', user.email).single()
	])

	if (profileQuery.error) {
		console.error('Failed to load profile:', profileQuery.error)
		throw error(500, 'Failed to load user profile')
	}

	if (subscriberQuery.error) {
		console.error('Failed to load subscriber:', subscriberQuery.error)
		throw error(500, 'Failed to load subscriber data')
	}

	// Return the new data - session comes from parent, user gets added by root +layout.ts
	return {
		user, // We need to pass this through since parent() doesn't include it
		profile: profileQuery.data,
		subscriber: subscriberQuery.data
	}
}
