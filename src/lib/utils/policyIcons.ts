import {
	Scale,
	GraduationCap,
	Baby,
	Wheat,
	Medal,
	Users,
	Heart,
	Building2,
	KeyRound,
	UsersRound,
	Shield,
	type Icon
} from '@lucide/svelte'

const POLICY_ICONS: Record<string, typeof Icon> = {
	'local government': Building2,
	governance: Scale,
	education: GraduationCap,
	children: Baby,
	agriculture: Wheat,
	veterans: Medal,
	families: Users,
	healthcare: Heart,
	liberty: KeyRound,
	community: UsersRound,
	integrity: Shield
}

export function getPolicyIcon(categories: string[] | null): typeof Icon {
	if (!categories || categories.length === 0) return Scale
	const firstCategory = categories[0].toLowerCase()
	return POLICY_ICONS[firstCategory] || Scale
}
