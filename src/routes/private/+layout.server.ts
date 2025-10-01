import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession()

	if (!user || !user.email) {
		throw error(401, 'Authentication required')
	}

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

	return {
		session,
		user,
		profile: profileQuery.data,
		subscriber: subscriberQuery.data
	}
}
