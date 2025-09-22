import { validatePostcode } from '$lib/utils/validatePostcode'
import type { SupabaseClient } from '@supabase/supabase-js'
import { validateAustralianPhone } from './validatePhone'

interface UserData {
	email: string
	firstName?: string
	lastName?: string
	postcode?: string
	source: string
}

interface AuthResult {
	success?: boolean
	error?: string
	message?: string
	email?: string
	firstName?: string
	lastName?: string
	postcode?: string
}

// For SERVER-SIDE usage (form actions) - takes origin from SvelteKit's url
export async function signUpWithMagicLink(
	supabase: SupabaseClient,
	data: UserData,
	origin?: string
): Promise<AuthResult> {
	// Validation
	if (!data.email) return { error: 'Email is required', ...data }
	if (!data.firstName) return { error: 'First name is required', ...data }
	if (!data.lastName) return { error: 'Last name is required', ...data }
	if (!data.postcode) return { error: 'Postcode is required', ...data }

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(data.email)) {
		return { error: 'Please enter a valid email address', ...data }
	}

	if (!validatePostcode(data.postcode)) {
		return { error: 'Please enter a valid Australian postcode (4 digits)', ...data }
	}

	// Create subscriber record
	const subscriberData = {
		email: data.email.trim().toLowerCase(),
		first_name: data.firstName.trim(),
		last_name: data.lastName.trim(),
		postcode: data.postcode.trim(),
		source: data.source
	}

	const { error: subscriberError } = await supabase.from('subscribers').insert([subscriberData])

	if (subscriberError) {
		if (subscriberError.code === '23505') {
			return { error: 'This email is already registered with us!', ...data }
		}
		return { error: 'Failed to create account. Please try again.', ...data }
	}

	// Send magic link - use origin if provided (server), otherwise rely on Supabase Site URL
	const authOptions: any = { email: data.email.trim().toLowerCase() }
	if (origin) {
		authOptions.options = { emailRedirectTo: `${origin}/` }
	}

	const { error: authError } = await supabase.auth.signInWithOtp(authOptions)

	if (authError) {
		if (authError.code === 'over_email_send_rate_limit') {
			return { error: 'Please wait a moment before requesting another magic link.', ...data }
		}
		return { error: 'Account created but failed to send magic link. Try logging in.', ...data }
	}

	return {
		success: true,
		message: 'Account created! Check your inbox for your magic link.'
	}
}

// For CLIENT-SIDE usage (components)
export async function signUpWithMagicLinkClient(supabase: SupabaseClient, data: UserData): Promise<AuthResult> {
	// Same validation and subscriber creation logic...
	if (!data.email) return { error: 'Email is required', ...data }
	if (!data.firstName) return { error: 'First name is required', ...data }
	if (!data.lastName) return { error: 'Last name is required', ...data }
	if (!data.postcode) return { error: 'Postcode is required', ...data }

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(data.email)) {
		return { error: 'Please enter a valid email address', ...data }
	}

	if (!validatePostcode(data.postcode)) {
		return { error: 'Please enter a valid Australian postcode (4 digits)', ...data }
	}

	const subscriberData = {
		email: data.email.trim().toLowerCase(),
		first_name: data.firstName.trim(),
		last_name: data.lastName.trim(),
		postcode: data.postcode.trim(),
		source: data.source
	}

	const { error: subscriberError } = await supabase.from('subscribers').insert([subscriberData])

	if (subscriberError) {
		if (subscriberError.code === '23505') {
			return { error: 'This email is already registered with us!', ...data }
		}
		return { error: 'Failed to create account. Please try again.', ...data }
	}

	// For client-side, use window.location.origin safely
	const { error: authError } = await supabase.auth.signInWithOtp({
		email: data.email.trim().toLowerCase(),
		options: {
			emailRedirectTo: `${window.location.origin}/`
		}
	})

	if (authError) {
		if (authError.code === 'over_email_send_rate_limit') {
			return { error: 'Please wait a moment before requesting another magic link.', ...data }
		}
		return { error: 'Account created but failed to send magic link. Try logging in.', ...data }
	}

	return {
		success: true,
		message: 'Account created! Check your inbox for your magic link.'
	}
}

// Server-side magic link for login
export async function sendMagicLink(supabase: SupabaseClient, email: string, origin?: string): Promise<AuthResult> {
	if (!email) return { error: 'Email is required', email: '' }

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		return { error: 'Please enter a valid email address', email }
	}

	const authOptions: any = { email: email.trim().toLowerCase() }
	if (origin) {
		authOptions.options = { emailRedirectTo: `${origin}/` }
	}

	const { error } = await supabase.auth.signInWithOtp(authOptions)

	if (error) {
		if (error.code === 'over_email_send_rate_limit') {
			return { error: 'Please wait a moment before requesting another magic link.', email }
		}
		return { error: 'Failed to send magic link. Please try again.', email }
	}

	return {
		success: true,
		message: 'Check your inbox for a magic login link!'
	}
}

// SERVER-SIDE newsletter subscription (for form actions)
export async function subscribeToNewsletter(
	supabase: SupabaseClient,
	email: string,
	source: string
): Promise<AuthResult> {
	if (!email) return { error: 'Email is required', email }

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		return { error: 'Please enter a valid email address', email }
	}

	const subscriberData = {
		email: email.trim().toLowerCase(),
		first_name: null,
		last_name: null,
		postcode: null,
		source
	}

	const { error } = await supabase.from('subscribers').insert([subscriberData])

	if (error) {
		if (error.code === '23505') {
			return { error: 'This email is already subscribed.', email }
		}
		return { error: 'Failed to subscribe. Please try again.', email }
	}

	return {
		success: true,
		message: 'Thank you for subscribing!'
	}
}

// CLIENT-SIDE newsletter subscription (for components)
export async function subscribeToNewsletterClient(
	supabase: SupabaseClient,
	email: string,
	source: string
): Promise<AuthResult> {
	// Identical logic to server version since this is simple
	if (!email) return { error: 'Email is required', email }

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		return { error: 'Please enter a valid email address', email }
	}

	const subscriberData = {
		email: email.trim().toLowerCase(),
		first_name: null,
		last_name: null,
		postcode: null,
		source
	}

	const { error } = await supabase.from('subscribers').insert([subscriberData])

	if (error) {
		if (error.code === '23505') {
			return { error: 'This email is already subscribed.', email }
		}
		return { error: 'Failed to subscribe. Please try again.', email }
	}

	return {
		success: true,
		message: 'Thank you for subscribing!'
	}
}

// Profile update types
interface ProfileUpdateData {
	first_name?: string
	last_name?: string
	postcode?: string
	phone?: string
}

interface ProfileUpdateResult {
	success?: boolean
	error?: string
}

// SERVER-SIDE profile update
export async function updateProfile(
	supabase: SupabaseClient,
	userId: string,
	data: ProfileUpdateData
): Promise<ProfileUpdateResult> {
	// Validate phone if provided
	if (data.phone && !validateAustralianPhone(data.phone)) {
		return { error: 'Please enter a valid Australian phone number' }
	}

	// Validate postcode if provided
	if (data.postcode && !validatePostcode(data.postcode)) {
		return { error: 'Please enter a valid Australian postcode (4 digits)' }
	}

	const { error } = await supabase.from('profiles').update(data).eq('id', userId)

	if (error) {
		return { error: 'Failed to update profile. Please try again.' }
	}

	return { success: true }
}

// CLIENT-SIDE profile update
export async function updateProfileClient(
	supabase: SupabaseClient,
	userId: string,
	data: ProfileUpdateData
): Promise<ProfileUpdateResult> {
	// Same validation logic
	if (data.phone && !validateAustralianPhone(data.phone)) {
		return { error: 'Please enter a valid Australian phone number' }
	}

	if (data.postcode && !validatePostcode(data.postcode)) {
		return { error: 'Please enter a valid Australian postcode (4 digits)' }
	}

	const { error } = await supabase.from('profiles').update(data).eq('id', userId)

	if (error) {
		return { error: 'Failed to update profile. Please try again.' }
	}

	return { success: true }
}
