import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: policyData, error: policyError } = await supabase
		.from('policy_content')
		.select('*')
		.eq('slug', params.slug)
		.eq('status', 'published')
		.single()

	if (policyError || !policyData) {
		throw error(404, 'Policy not found')
	}

	return {
		policy: policyData
	}
}
