import { json } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/server/email';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, firstName, variant } = await request.json();
		const result = await sendWelcomeEmail(email, firstName, variant);
		return json(result);
	} catch (error) {
		console.error('Welcome email API error:', error);
		return json({ success: false, error: 'Failed to send email' }, { status: 500 });
	}
};
