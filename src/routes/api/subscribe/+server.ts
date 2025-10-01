import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { subscribeToCommunications } from '$lib/server/subscribers'

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const { email, source } = await request.json()

		if (!email) {
			return json({ message: 'Email address is required' }, { status: 400 })
		}

		const result = await subscribeToCommunications(supabase, email, source || 'unknown')

		return json({ message: result.message }, { status: 200 })
	} catch (error) {
		console.error('Subscribe API error:', error)
		return json(
			{
				message: error instanceof Error ? error.message : 'Subscription failed'
			},
			{ status: 400 }
		)
	}
}
