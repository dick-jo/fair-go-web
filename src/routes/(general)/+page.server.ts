import { HERO_CAROUSEL_MAX_ITEMS } from '$lib/components/HeroCarousel'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// CAROUSEL
	const { data: carouselData, error: carouselError } = await supabase
		.from('carousel_items')
		.select('*')
		.order('order', { ascending: true })
		.limit(HERO_CAROUSEL_MAX_ITEMS)

	if (carouselError) console.error('Error loading carousel:', carouselError)

	// NEWS - simplified, no author join
	const { data: newsData, error: newsError } = await supabase
		.from('news_articles')
		.select('*')
		.eq('status', 'published')
		.order('published_at', { ascending: false })
		.limit(3)

	if (newsError) console.error('Error loading news:', newsError)

	// POLICY
	const { data: policiesData, error: policiesError } = await supabase
		.from('policy_content')
		.select('id, title, short_title, slug, snippet, category')
		.eq('status', 'published')
		.order('order_priority', { ascending: true })
		.limit(3)

	if (policiesError) console.error('Error loading policies:', policiesError)

	return {
		carouselItems: carouselData ?? [],
		newsArticles: newsData ?? [],
		policies: policiesData ?? []
	}
}
