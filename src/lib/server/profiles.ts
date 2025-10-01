import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables } from '$lib/types/supabase.types'
import { validatePostcode } from '$lib/utils/validatePostcode'
import { validateAustralianPhone } from '$lib/utils/validatePhone'

type Profile = Tables<'profiles'>
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// UPDATE PROFILE --------------------------------------- //
export async function updateProfile(
	supabase: SupabaseClient<Database>,
	userId: string,
	updates: ProfileUpdate,
	requireChanges: boolean = true
): Promise<{ message: string }> {
	// Validation
	if (updates.phone && !validateAustralianPhone(updates.phone)) {
		throw new Error('Please enter a valid Australian phone number')
	}
	if (updates.postcode && !validatePostcode(updates.postcode)) {
		throw new Error('Please enter a valid Australian postcode (4 digits)')
	}

	// Get current profile to check for changes
	const { data: currentProfile, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

	if (error) {
		throw new Error('Failed to load current profile')
	}

	// Check for changes
	const hasChanges = Object.entries(updates).some(([key, value]) => {
		return currentProfile[key as keyof Profile] !== value
	})

	if (!hasChanges) {
		if (requireChanges) {
			throw new Error('No changes detected')
		}
		// For multi-step forms, allow proceeding without changes
		return { message: 'Details confirmed' }
	}

	// UPDATE
	const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', userId).select().single()

	if (updateError) {
		console.error('Profile update error:', updateError)
		throw new Error('Failed to update profile. Please try again.')
	}

	return {
		message: 'Your details updated successfully!'
	}
}

// UPDATE VOLUNTEER STATUS ------------------------------ //
export async function updateVolunteerStatus(
	supabase: SupabaseClient<Database>,
	userId: string,
	isVolunteer: boolean
): Promise<{ message: string }> {
	// Get current profile to check for changes
	const { data: currentProfile, error } = await supabase
		.from('profiles')
		.select('is_volunteer')
		.eq('id', userId)
		.single()

	if (error) {
		throw new Error('Failed to load current volunteer status')
	}

	// Check for changes
	if (currentProfile.is_volunteer === isVolunteer) {
		throw new Error('No changes detected')
	}

	// Update volunteer status
	const { error: updateError } = await supabase
		.from('profiles')
		.update({ is_volunteer: isVolunteer })
		.eq('id', userId)
		.select()
		.single()

	if (updateError) {
		console.error('Volunteer status update error:', updateError)
		throw new Error('Failed to update volunteer status. Please try again.')
	}

	return {
		message: isVolunteer ? 'Volunteer status enabled successfully!' : 'Volunteer status disabled successfully!'
	}
}
