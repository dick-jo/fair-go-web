import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const category = url.searchParams.get('category')

	let query = supabase
		.from('policy_content')
		.select('id, title, short_title, slug, snippet, category')
		.eq('status', 'published')
		.order('order_priority', { ascending: true })

	if (category) {
		query = query.contains('category', [category])
	}

	const { data: policiesData, error } = await query

	if (error) console.error('Error loading policies:', error)

	// Always fetch ALL categories
	const { data: allPoliciesData } = await supabase.from('policy_content').select('category').eq('status', 'published')

	const allCategories = new Set<string>()
	allPoliciesData?.forEach((policy) => {
		policy.category?.forEach((cat) => allCategories.add(cat))
	})

	return {
		policies: policiesData ?? [],
		selectedCategory: category,
		allCategories: Array.from(allCategories).sort()
	}
}
