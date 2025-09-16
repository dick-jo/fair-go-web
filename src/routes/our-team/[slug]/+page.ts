import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TeamMember } from '$lib/types';

export const load: PageLoad = async ({ params }) => {
	const { data: teamMemberData, error: teamMemberError } = await supabase
		.from('team_members')
		.select(
			`
			*,
			profile_image:profile_image_id (
				id,
				bucket,
				path,
				alt,
				mime
			),
			pet_policy_1:pet_policy_1_id (
				id,
				title,
				short_title,
				snippet,
				category
			),
			pet_policy_2:pet_policy_2_id (
				id,
				title,
				short_title,
				snippet,
				category
			),
			pet_policy_3:pet_policy_3_id (
				id,
				title,
				short_title,
				snippet,
				category
			)
		`
		)
		.eq('slug', params.slug)
		.eq('status', 'active')
		.single();

	if (teamMemberError || !teamMemberData) {
		throw error(404, 'Team member not found');
	}

	// Flatten the joined data
	const teamMember: TeamMember = {
		...teamMemberData,
		profile_image: Array.isArray(teamMemberData.profile_image)
			? (teamMemberData.profile_image[0] ?? null)
			: (teamMemberData.profile_image ?? null),
		pet_policy_1: Array.isArray(teamMemberData.pet_policy_1)
			? (teamMemberData.pet_policy_1[0] ?? null)
			: (teamMemberData.pet_policy_1 ?? null),
		pet_policy_2: Array.isArray(teamMemberData.pet_policy_2)
			? (teamMemberData.pet_policy_2[0] ?? null)
			: (teamMemberData.pet_policy_2 ?? null),
		pet_policy_3: Array.isArray(teamMemberData.pet_policy_3)
			? (teamMemberData.pet_policy_3[0] ?? null)
			: (teamMemberData.pet_policy_3 ?? null)
	};

	return {
		teamMember
	};
};
