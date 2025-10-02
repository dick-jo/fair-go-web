import { HERO_CAROUSEL_MAX_ITEMS } from '$lib/components/HeroCarousel'
import type { PageServerLoad } from './$types'
import type { HeroCarouselItem } from '$lib/components/HeroCarousel/types'
import type { PolicyContent, NewsArticle } from '$lib/types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Existing carousel query
	const { data: carouselData, error: carouselError } = await supabase
		.from('carousel_items')
		.select(
			`
			id,
			label,
			title,
			href,
			order,
			media:media_id (
				id,
				bucket,
				path,
				alt,
				mime
			)
		`
		)
		.order('order', { ascending: true })
		.limit(HERO_CAROUSEL_MAX_ITEMS)

	// Get exactly 3 policies
	const { data: policiesData, error: policiesError } = await supabase
		.from('policy_content')
		.select('*')
		.eq('status', 'published')
		.eq('type', 'policy')
		.order('order_priority', { ascending: true })
		.limit(3)

	// Get exactly 3 philosophies
	const { data: philosophiesData, error: philosophiesError } = await supabase
		.from('policy_content')
		.select('*')
		.eq('status', 'published')
		.eq('type', 'philosophy')
		.order('order_priority', { ascending: true })
		.limit(3)

	// Get exactly 3 news articles with author and media
	const { data: newsData, error: newsError } = await supabase
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
		.order('order_priority', { ascending: true })
		.limit(3)

	// Flatten media arrays to single objects
	const carouselItems: HeroCarouselItem[] = (carouselData ?? []).map((item) => ({
		...item,
		media: Array.isArray(item.media) ? (item.media[0] ?? null) : (item.media ?? null)
	}))

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

	const policies: PolicyContent[] = policiesData ?? []
	const philosophies: PolicyContent[] = philosophiesData ?? []

	return {
		carouselItems,
		newsArticles,
		policies,
		philosophies,
		error: carouselError || policiesError || philosophiesError || newsError
	}
}
