import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession()

	if (!user) {
		return { transactions: [] }
	}

	const { data: transactions } = await supabase
		.from('transactions')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.limit(10)

	return { transactions: transactions || [] }
}
