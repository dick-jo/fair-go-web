import type { PageServerLoad } from './$types'
import type { NewsArticle } from '$lib/types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: newsData, error } = await supabase
		.from('news_articles')
		.select(
			`
			*,
			author:author_id (
				id,
				name,
				email,
				bio,
				avatar_media_id,
				status,
				created_at,
				avatar_media:avatar_media_id (
					id,
					bucket,
					path,
					alt,
					mime
				)
			),
			featured_image:featured_image_id (
				id,
				bucket,
				path,
				alt,
				mime
			)
		`
		)
		.eq('status', 'published')
		.order('published_at', { ascending: false }) // Latest first

	// Flatten media arrays to single objects
	const newsArticles: NewsArticle[] = (newsData ?? []).map((item) => ({
		...item,
		author: {
			...item.author,
			avatar_media: Array.isArray(item.author.avatar_media)
				? (item.author.avatar_media[0] ?? null)
				: (item.author.avatar_media ?? null)
		},
		featured_image: Array.isArray(item.featured_image)
			? (item.featured_image[0] ?? null)
			: (item.featured_image ?? null)
	}))

	return {
		newsArticles,
		error
	}
}
