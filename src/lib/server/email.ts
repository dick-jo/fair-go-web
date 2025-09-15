import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, firstName?: string | null) {
	const name = firstName || 'Friend';

	try {
		const { data, error } = await resend.emails.send({
			from: 'onboarding@resend.dev', // Use Resend's default domain for now
			to: email,
			subject: 'Welcome to Fair Go!',
			html: `
        <h1>Welcome ${name}!</h1>
        <p>Thanks for joining our movement for a fair go for all Australians.</p>
        <p>We'll keep you updated on our campaigns and how you can get involved.</p>
        <p>The Fair Go Team</p>
      `
		});

		if (error) {
			console.error('Email send failed:', error);
			return { success: false, error };
		}

		return { success: true, data };
	} catch (error) {
		console.error('Email send error:', error);
		return { success: false, error };
	}
}
