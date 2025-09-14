import { supabase } from '$lib/supabaseClient';

export async function load() {
	// Try to fetch data from a table (e.g., 'carousel_items')
	const { data, error } = await supabase.from('carousel_items').select('*');
	return { data, error };
}
