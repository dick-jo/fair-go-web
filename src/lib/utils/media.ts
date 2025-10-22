import { PUBLIC_SUPABASE_URL } from '$env/static/public'

/**
 * Constructs public URL for images in the media bucket.
 * Pass the path stored in your database (e.g. 'hero/image1.jpg')
 */
export function getMediaUrl(path: string | null | undefined): string {
	if (!path) return ''
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`
}

/**
 * Image transformation options for Supabase Storage
 */
interface ImageTransformOptions {
	width?: number
	height?: number
	quality?: number // 1-100
	format?: 'webp' | 'jpeg' | 'png'
	resize?: 'contain' | 'cover' | 'fill'
}

/**
 * Constructs optimized image URL with Supabase's built-in transformations.
 * Uses imgproxy to resize, compress, and convert images on-the-fly.
 *
 * @example
 * getOptimizedMediaUrl('news/article.jpg', { width: 800, quality: 80, format: 'webp' })
 */
export function getOptimizedMediaUrl(path: string | null | undefined, options: ImageTransformOptions = {}): string {
	if (!path) return ''

	const baseUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`

	const { width, height, quality = 80, format = 'webp', resize = 'cover' } = options

	// Build query params for Supabase image transformation
	const params = new URLSearchParams()
	if (width) params.append('width', width.toString())
	if (height) params.append('height', height.toString())
	params.append('quality', quality.toString())
	params.append('format', format)
	params.append('resize', resize)

	return `${baseUrl}?${params.toString()}`
}
