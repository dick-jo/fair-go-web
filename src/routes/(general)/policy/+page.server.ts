import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: policiesData, error } = await supabase
		.from('policy_content')
		.select('id, title, short_title, slug, snippet, category')
		.eq('status', 'published')
		.order('order_priority', { ascending: true })

	if (error) console.error('Error loading policies:', error)

	return {
		policies: policiesData ?? []
	}
}
