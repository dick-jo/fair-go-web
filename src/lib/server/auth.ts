import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '$lib/types/supabase.types'
import { normalizeString } from '$lib/utils/normalizeString'
import { validateEmail } from '$lib/utils/validateEmail'
import { validatePostcode } from '$lib/utils/validatePostcode'

// SIGN UP WITH MAGIC LINK ----------------------------- //
export async function createUserWithMagicLink(
	supabase: SupabaseClient<Database>,
	email: string,
	first_name: string,
	last_name: string,
	postcode: string,
	source: string,
	redirectUrl: string
): Promise<{ message: string }> {
	// VALIDATE FORM DATA ----------------------------------- //
	const normalizedEmail = normalizeString(email)
	if (!normalizedEmail) {
		throw new Error('Email is required')
	}
	if (!first_name?.trim()) {
		throw new Error('First name is required')
	}
	if (!last_name?.trim()) {
		throw new Error('Last name is required')
	}
	if (!postcode?.trim()) {
		throw new Error('Postcode is required')
	}

	// VALIDATE DATA FORMATS -------------------------------- //
	if (!validateEmail(normalizedEmail)) {
		throw new Error('Please enter a valid email address')
	}

	if (!validatePostcode(postcode)) {
		throw new Error('Please enter a valid Australian postcode (4 digits)')
	}

	// SEND MAGIC LINK -------------------------------------- //
	const { error: authError } = await supabase.auth.signInWithOtp({
		email: normalizedEmail,
		options: {
			emailRedirectTo: redirectUrl,
			// Metadata
			// ...used by postgres trigger/function to handle related tables/rows (profile, subscribes)
			data: {
				first_name: first_name.trim(),
				last_name: last_name.trim(),
				postcode: postcode.trim(),
				source: source
			}
		}
	})

	// HANDLE OTP ERRORS ------------------------------------ //
	if (authError) {
		// Rate Limiting - Handled by Supabase
		if (authError.code === 'over_email_send_rate_limit') {
			throw new Error('Please wait a moment before requesting another magic link')
		}

		throw new Error('Failed to send magic link. Please try again.')
	}

	// SUCCESS ---------------------------------------------- //
	return {
		message: 'Account Created! Check your inbox for your magic link.'
	}
}

// SEND LOGIN MAGIC LINK ------------------------------- //
export async function sendLoginMagicLink(
	supabase: SupabaseClient<Database>,
	email: string,
	redirectUrl: string
): Promise<{ message: string }> {
	// VALIDATE EMAIL --------------------------------------- //
	const normalizedEmail = normalizeString(email)
	if (!normalizedEmail) {
		throw new Error('Email is required')
	}

	if (!validateEmail(normalizedEmail)) {
		throw new Error('Please enter a valid email address')
	}

	// SEND MAGIC LINK -------------------------------------- //
	const { error } = await supabase.auth.signInWithOtp({
		email: normalizedEmail,
		options: {
			emailRedirectTo: redirectUrl,
			shouldCreateUser: false
		}
	})

	if (error) {
		if (error.code === 'over_email_send_rate_limit') {
			throw new Error('Please wait a moment before requesting another magic link')
		}

		if (error.code === 'otp_disabled' || error.message.includes('Signups not allowed')) {
			throw new Error(
				'No account found with this email. Please sign up first or check that you provided the correct email address.'
			)
		}

		console.error('Magic link send error:', error)
		throw new Error('Failed to send magic link. Please try again.')
	}

	return {
		message: 'Check your inbox for a magic login link!'
	}
}
