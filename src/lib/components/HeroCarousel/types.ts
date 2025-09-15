import type { Media } from '$lib/types';

export interface HeroCarouselItem {
	id: string;
	label: string;
	title: string;
	href: string;
	order: number | null;
	media: Media | null;
}
