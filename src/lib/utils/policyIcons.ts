import { Zap, Users, Shield, Award, Heart, Scale, type Icon } from '@lucide/svelte';

const POLICY_ICONS: Record<string, typeof Icon> = {
	energy: Zap,
	education: Users,
	safety: Shield,
	social: Award,
	family: Heart,
	governance: Scale
};

export function getPolicyIcon(category: string | null): typeof Icon {
	if (!category) return Zap; // default fallback
	return POLICY_ICONS[category] || Zap;
}
