import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '$lib/types/supabase.types'
import { normalizeString } from '$lib/utils/normalizeString'
import { validateEmail } from '$lib/utils/validateEmail'

type SubscriberUpdate = Database['public']['Tables']['subscribers']['Update']

export async function updateCommunicationPreferences(
	supabase: SupabaseClient<Database>,
	email: string,
	emailOptIn: boolean,
	isAuthenticated: boolean = true
): Promise<{ message: string }> {
	// Normalize email
	const normalizedEmail = normalizeString(email)

	// Validate email format (for anonymous users - auth users already validated)
	if (!isAuthenticated && !validateEmail(normalizedEmail)) {
		throw new Error('Please enter a valid email address')
	}

	// For anonymous users, use the RPC function
	if (!isAuthenticated) {
		const { data: wasUpdated, error } = await supabase.rpc('update_email_opt_in_anonymous', {
			target_email: normalizedEmail,
			new_opt_in: emailOptIn
		})

		if (error) {
			throw new Error('Failed to update preferences. Please try again.')
		}

		if (!wasUpdated) {
			throw new Error('Email address not found')
		}

		return {
			message: 'Your email preferences have been updated successfully'
		}
	}

	// For authenticated users, use direct database access
	const { data: currentSubscriber, error } = await supabase
		.from('subscribers')
		.select('email_opt_in')
		.eq('email', normalizedEmail)
		.single()

	if (error) {
		throw new Error('Failed to load current communication preferences')
	}

	if (currentSubscriber.email_opt_in === emailOptIn) {
		throw new Error('No changes detected')
	}

	const updates: SubscriberUpdate = {
		email_opt_in: emailOptIn
	}

	const { error: updateError } = await supabase
		.from('subscribers')
		.update(updates)
		.eq('email', normalizedEmail) // Use normalized email here too!
		.select()
		.single()

	if (updateError) {
		console.error('Communication preferences update error:', updateError)
		throw new Error('Failed to update communication preferences. Please try again.')
	}

	return {
		message: emailOptIn ? 'Email notifications enabled successfully!' : 'Email notifications disabled successfully!'
	}
}

// SUBSCRIBE (Onboard) ---------------------------------- //
export async function subscribeToCommunications(
	supabase: SupabaseClient<Database>,
	email: string,
	source: string
): Promise<{ message: string }> {
	const normalizedEmail = normalizeString(email)

	if (!validateEmail(normalizedEmail)) {
		throw new Error('Please enter a valid email address!')
	}

	// Check if subscriber already exists...
	const { data: existingSubscriber } = await supabase
		.from('subscribers')
		.select('email_opt_in')
		.eq('email', normalizedEmail)
		.single()

	// If subscriber exists:
	if (existingSubscriber) {
		if (existingSubscriber.email_opt_in) {
			throw new Error('This email is already subscribed')
		} else {
			// Reactivate subscription
			const updates: SubscriberUpdate = {
				email_opt_in: true
			}

			const { error: updateError } = await supabase.from('subscribers').update(updates).eq('email', normalizedEmail)

			if (updateError) {
				throw new Error('Failed to subscribe. Please try again.')
			}

			return {
				message: 'You are now subscribed for communications'
			}
		}
	}

	// Create new subscriber
	const { error: insertError } = await supabase.from('subscribers').insert({
		email: normalizedEmail,
		email_opt_in: true,
		source // Track where they subscribed from
	})

	if (insertError) {
		console.error('Newsletter subscribe error:', insertError)
		throw new Error('Failed to subscribe. Please try again.')
	}

	return {
		message: "Thank you for subscribing! You'll receive our latest updates."
	}
}
