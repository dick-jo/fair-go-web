import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession()

	if (!user) {
		throw new Error('User not authenticated')
	}

	const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

	return {
		session,
		user,
		profile: profile ?? null
	}
}
