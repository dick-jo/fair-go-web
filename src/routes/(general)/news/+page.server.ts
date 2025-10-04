import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const category = url.searchParams.get('category')

	// Query for displayed articles (with filter if present)
	let query = supabase
		.from('news_articles')
		.select('*')
		.eq('status', 'published')
		.order('published_at', { ascending: false })

	if (category) {
		query = query.contains('category', [category])
	}

	const { data: newsData, error } = await query

	if (error) console.error('Error loading news:', error)

	// Always fetch ALL categories (no filter)
	const { data: allNewsData } = await supabase.from('news_articles').select('category').eq('status', 'published')

	const allCategories = new Set<string>()
	allNewsData?.forEach((article) => {
		article.category?.forEach((cat) => allCategories.add(cat))
	})

	return {
		articles: newsData ?? [],
		selectedCategory: category,
		allCategories: Array.from(allCategories).sort()
	}
}
