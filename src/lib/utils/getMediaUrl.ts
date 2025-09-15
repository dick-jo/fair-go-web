import { supabase } from '$lib/supabaseClient';
import type { Media } from '$lib/types';

/**
 * Returns the public URL for a media object using the official Supabase SDK.
 * Falls back to empty string if media is null/undefined.
 */
export function getMediaUrl(media: Media | null | undefined): string {
	if (!media) return '';
	const { data } = supabase.storage.from(media.bucket).getPublicUrl(media.path);
	return data?.publicUrl ?? '';
}
