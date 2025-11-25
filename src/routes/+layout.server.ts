import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

// TEMPORARY HOLDING PAGE - remove this block to restore site
const HOLDING_MODE = true

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, url }) => {
	if (HOLDING_MODE && url.pathname !== '/holding') {
		throw redirect(302, '/holding')
	}
	const { session } = await safeGetSession()
	return {
		session,
		cookies: cookies.getAll()
	}
}
