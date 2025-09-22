import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { Media } from '$lib/types'

/**
 * Returns the public URL for a media object by constructing the URL directly.
 * Falls back to empty string if media is null/undefined.
 */
export function getMediaUrl(media: Media | null | undefined): string {
	if (!media) return ''
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`
}
