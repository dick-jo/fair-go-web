import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession()

	if (!user || !user.email) {
		throw new Error('User not authenticated')
	}

	// Load profile data
	const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

	// Load subscriber data for communication preferences
	const { data: subscriber } = await supabase
		.from('subscribers')
		.select('email_opt_in')
		.eq('email', user.email)
		.single()

	return {
		session,
		user,
		profile: profile ?? null,
		subscriber: subscriber ?? null
	}
}
