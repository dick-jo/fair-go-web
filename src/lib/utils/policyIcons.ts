import { Scale, GraduationCap, Baby, Wheat, Medal, Users, Heart, Building2, type Icon } from '@lucide/svelte'

const POLICY_ICONS: Record<string, typeof Icon> = {
	'local government': Building2,
	governance: Scale,
	education: GraduationCap,
	children: Baby,
	agriculture: Wheat,
	veterans: Medal,
	families: Users,
	healthcare: Heart
}

export function getPolicyIcon(categories: string[] | null): typeof Icon {
	if (!categories || categories.length === 0) return Scale
	const firstCategory = categories[0].toLowerCase()
	return POLICY_ICONS[firstCategory] || Scale
}
