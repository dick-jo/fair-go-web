import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data, error } = await supabase
		.from('carousel_items')
		.select('*')
		.order('order', { ascending: true });
	return {
		carouselItems: data ?? [],
		error
	};
}
