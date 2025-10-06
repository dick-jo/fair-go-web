import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: philosophyData, error } = await supabase
		.from('philosophy_content')
		.select('*')
		.eq('status', 'published')
		.order('order_priority', { ascending: true })

	if (error) console.error('Error loading philosophy:', error)

	// Group by type
	const values = philosophyData?.filter((p) => p.type === 'value') ?? []
	const objectives = philosophyData?.filter((p) => p.type === 'objective') ?? []
	const oppositions = philosophyData?.filter((p) => p.type === 'opposition') ?? []

	return {
		values,
		objectives,
		oppositions
	}
}
