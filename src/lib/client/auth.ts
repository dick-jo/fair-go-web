import type { SupabaseClient } from '@supabase/supabase-js'
import { goto } from '$app/navigation'

interface SignOutOptions {
	redirect?: boolean
	redirectTo?: string
}

export async function signOut(supabase: SupabaseClient, options: SignOutOptions = {}) {
	const { redirect = false, redirectTo = '/' } = options

	const { error } = await supabase.auth.signOut()

	if (error) {
		console.error('SignOut error:', error)
		return { success: false, error: error.message }
	}

	if (redirect) {
		await goto(redirectTo)
	}

	return { success: true }
}
