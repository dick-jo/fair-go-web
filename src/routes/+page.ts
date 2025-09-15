import { supabase } from '$lib/supabaseClient';
import { HERO_CAROUSEL_MAX_ITEMS } from '$lib/components/HeroCarousel';
import type { PageLoad } from './$types';
import type { HeroCarouselItem } from '$lib/components/HeroCarousel/types';

export const load: PageLoad = async () => {
	const { data, error } = await supabase
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
		.limit(HERO_CAROUSEL_MAX_ITEMS);

	// Flatten media array to single object
	const carouselItems: HeroCarouselItem[] = (data ?? []).map((item) => ({
		...item,
		media: Array.isArray(item.media) ? (item.media[0] ?? null) : (item.media ?? null)
	}));

	return {
		carouselItems,
		error
	};
};
