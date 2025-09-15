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
