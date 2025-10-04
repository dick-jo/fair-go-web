import { PUBLIC_SUPABASE_URL } from '$env/static/public'

/**
 * Constructs public URL for images in the media bucket.
 * Pass the path stored in your database (e.g. 'hero/image1.jpg')
 */
export function getMediaUrl(path: string | null | undefined): string {
	if (!path) return ''
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`
}
