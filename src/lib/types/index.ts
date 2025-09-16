export interface Media {
	id: string;
	bucket: string;
	path: string;
	alt: string;
	mime?: string | null;
}

export interface Contact {
	id?: string;
	email: string;
	first_name?: string | null;
	last_name?: string | null;
	postcode?: string | null;
	source?: string | null;
	email_verified?: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface ContactFormData {
	email: string;
	first_name?: string;
	last_name?: string;
	postcode?: string;
}

export interface PolicyContent {
	id: string;
	type: 'policy' | 'philosophy';
	title: string;
	short_title: string | null;
	snippet: string;
	content: string | null;
	category: string | null;
	order_priority: number;
	status: string;
	created_at: string;
	updated_at: string;
}

export interface Author {
	id: string;
	name: string;
	email: string | null;
	bio: string | null;
	avatar_media_id: string | null;
	status: string;
	created_at: string;
	// Joined avatar media using existing Media interface
	avatar_media?: Media | null;
}

export interface NewsArticle {
	id: string;
	title: string;
	snippet: string;
	content: string;
	slug: string;
	author_id: string;
	featured_image_id: string | null;
	published_at: string;
	status: string;
	order_priority: number;
	created_at: string;
	updated_at: string;
	// Joined data using existing interfaces
	author: Author;
	featured_image?: Media | null;
}

export interface TeamMember {
	id: string;
	name: string;
	title: string;
	slug: string;
	bio: string;
	email: string | null;
	phone: string | null;
	address: string | null;
	instagram_handle: string | null;
	facebook_handle: string | null;
	profile_image_id: string | null;
	pet_policy_1_id: string | null;
	pet_policy_2_id: string | null;
	pet_policy_3_id: string | null;
	status: string;
	order_priority: number;
	created_at: string;
	updated_at: string;
	// Joined data
	profile_image?: Media | null;
	pet_policy_1?: PolicyContent | null;
	pet_policy_2?: PolicyContent | null;
	pet_policy_3?: PolicyContent | null;
}
