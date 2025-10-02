import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession()

	if (!user) {
		return { transactions: [] }
	}

	const { data: transactions, error } = await supabase
		.from('transactions')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })

	if (error) {
		console.error('Failed to load transactions:', error)
		return { transactions: [] }
	}

	return { transactions: transactions || [] }
}
