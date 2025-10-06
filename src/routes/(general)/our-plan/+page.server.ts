import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Policies (3)
	const { data: policiesData, error: policiesError } = await supabase
		.from('policy_content')
		.select('id, title, short_title, slug, snippet, category')
		.eq('status', 'published')
		.order('order_priority', { ascending: true })
		.limit(3)

	if (policiesError) console.error('Error loading policies:', policiesError)

	// Random philosophy values (3)
	const { data: valuesData } = await supabase
		.from('philosophy_content')
		.select('*')
		.eq('status', 'published')
		.eq('type', 'value')
		.limit(100)

	// Random philosophy objectives (3)
	const { data: objectivesData } = await supabase
		.from('philosophy_content')
		.select('*')
		.eq('status', 'published')
		.eq('type', 'objective')
		.limit(100)

	// Random philosophy oppositions (3)
	const { data: oppositionsData } = await supabase
		.from('philosophy_content')
		.select('*')
		.eq('status', 'published')
		.eq('type', 'opposition')
		.limit(100)

	// Shuffle and take 3 from each
	const shuffleArray = <T>(array: T[]): T[] => {
		const arr = [...array]
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[arr[i], arr[j]] = [arr[j], arr[i]]
		}
		return arr
	}

	return {
		policies: policiesData ?? [],
		values: shuffleArray(valuesData ?? []).slice(0, 3),
		objectives: shuffleArray(objectivesData ?? []).slice(0, 3),
		oppositions: shuffleArray(oppositionsData ?? []).slice(0, 3)
	}
}
