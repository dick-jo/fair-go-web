import { Resend } from 'resend';

import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export async function sendWelcomeEmail(
	email: string,
	firstName?: string | null,
	variant: 'full' | 'email-only' = 'full'
) {
	const hasName = firstName && firstName.trim().length > 0;

	const content =
		variant === 'email-only'
			? {
					subject: 'Thanks for subscribing to Fair Go!',
					html: `
				<h1>Thanks for joining us!</h1>
				<p>You're now subscribed to updates from Fair Go.</p>
				<p>We'll keep you informed about our campaigns for a fair go for all Australians.</p>
				<p>Want to get more involved? <a href="https://yoursite.com/join">Complete your profile here</a> to unlock member benefits.</p>
				<p>The Fair Go Team</p>
				<hr>
				<p><small>You can <a href="https://yoursite.com/email-preferences">manage your email preferences</a> at any time.</small></p>
			`
				}
			: {
					subject: 'Welcome to Fair Go!',
					html: `
				<h1>Welcome${hasName ? ` ${firstName}` : ''}!</h1>
				<p>Thanks for joining our movement for a fair go for all Australians.</p>
				<p>We'll keep you updated on our campaigns and how you can get involved.</p>
				<p>As a member, you'll be the first to know about local events and volunteer opportunities.</p>
				<p>The Fair Go Team</p>
				<hr>
				<p><small>You can <a href="https://yoursite.com/email-preferences">manage your email preferences</a> at any time.</small></p>
			`
				};

	try {
		const { data, error } = await resend.emails.send({
			from: 'onboarding@resend.dev', // Use Resend's default domain for now
			to: email,
			subject: content.subject,
			html: content.html
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
