import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: teamData, error } = await supabase
		.from('team_members')
		.select('*')
		.eq('status', 'active')
		.order('order_priority', { ascending: true })

	if (error) console.error('Error loading team:', error)

	return {
		teamMembers: teamData ?? []
	}
}
