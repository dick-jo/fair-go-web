import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: newsData, error } = await supabase
		.from('news_articles')
		.select(
			`
			*,
			author:author_id (*)
		`
		)
		.eq('status', 'published')
		.order('published_at', { ascending: false })

	return {
		newsArticles: newsData ?? [],
		error
	}
}
