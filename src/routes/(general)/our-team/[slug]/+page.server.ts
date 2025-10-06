import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Tables } from '$lib/types/supabase.types'

type Policy = Tables<'policy_content'>

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	// Fetch team member
	const { data: memberData, error: memberError } = await supabase
		.from('team_members')
		.select('*')
		.eq('slug', params.slug)
		.eq('status', 'active')
		.single()

	if (memberError || !memberData) {
		throw error(404, 'Team member not found')
	}

	// Fetch their pet policies if they have any
	const policyIds = [
		memberData.policy_priority_1_id,
		memberData.policy_priority_2_id,
		memberData.policy_priority_3_id
	].filter((id): id is string => id !== null)

	let policies: Pick<Policy, 'id' | 'title' | 'short_title' | 'slug' | 'snippet' | 'category'>[] = []

	if (policyIds.length > 0) {
		const { data: policiesData } = await supabase
			.from('policy_content')
			.select('id, title, short_title, slug, snippet, category')
			.in('id', policyIds)
			.eq('status', 'published')

		// Sort policies to match priority order
		if (policiesData) {
			policies = policyIds
				.map((id) => policiesData.find((p) => p.id === id))
				.filter((p): p is NonNullable<typeof p> => p !== undefined)
		}
	}

	return {
		member: memberData,
		petPolicies: policies
	}
}
