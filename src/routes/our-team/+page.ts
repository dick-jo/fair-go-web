import { supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';
import type { TeamMember } from '$lib/types';

export const load: PageLoad = async () => {
	const { data: teamData, error } = await supabase
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
			)
		`
		)
		.eq('status', 'active')
		.order('order_priority', { ascending: true });

	// Flatten profile_image array to single object
	const teamMembers: TeamMember[] = (teamData ?? []).map((member) => ({
		...member,
		profile_image: Array.isArray(member.profile_image)
			? (member.profile_image[0] ?? null)
			: (member.profile_image ?? null)
	}));

	return {
		teamMembers,
		error
	};
};
