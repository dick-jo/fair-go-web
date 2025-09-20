import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

import { supabase } from '$lib/supabaseClient';
import type { NewsArticle } from '$lib/types';

export const load: PageLoad = async ({ params }) => {
	const { data: articleData, error: articleError } = await supabase
		.from('news_articles')
		.select(
			`
			*,
			author:author_id (
				id,
				name,
				email,
				bio,
				avatar_media_id,
				status,
				created_at,
				avatar_media:avatar_media_id (
					id,
					bucket,
					path,
					alt,
					mime
				)
			),
			featured_image:featured_image_id (
				id,
				bucket,
				path,
				alt,
				mime
			)
		`
		)
		.eq('slug', params.slug)
		.eq('status', 'published')
		.single();

	if (articleError || !articleData) {
		throw error(404, 'Article not found');
	}

	// Flatten the joined data
	const article: NewsArticle = {
		...articleData,
		author: {
			...articleData.author,
			avatar_media: Array.isArray(articleData.author.avatar_media)
				? (articleData.author.avatar_media[0] ?? null)
				: (articleData.author.avatar_media ?? null)
		},
		featured_image: Array.isArray(articleData.featured_image)
			? (articleData.featured_image[0] ?? null)
			: (articleData.featured_image ?? null)
	};

	return {
		article
	};
};
