import { seoConfig } from '$lib/config/seo'
import type { RequestHandler } from './$types'

export const prerender = true

/**
 * Generates sitemap.xml for search engines
 * Lists all public pages with priority and change frequency hints
 */
export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const baseUrl = seoConfig.siteUrl

	// Fetch dynamic content from database
	const [policiesResult, teamResult, newsResult] = await Promise.all([
		supabase.from('policies').select('slug, updated_at').eq('published', true).order('updated_at', { ascending: false }),
		supabase.from('team_members').select('slug, updated_at').eq('published', true).order('updated_at', { ascending: false }),
		supabase.from('news_articles').select('slug, updated_at').eq('published', true).order('updated_at', { ascending: false })
	])

	const policies = policiesResult.data || []
	const teamMembers = teamResult.data || []
	const newsArticles = newsResult.data || []

	// Static pages with their priorities and change frequencies
	const staticPages = [
		{ url: '', priority: 1.0, changefreq: 'daily' }, // Homepage
		{ url: 'our-plan', priority: 0.9, changefreq: 'weekly' },
		{ url: 'our-plan/policy', priority: 0.9, changefreq: 'weekly' },
		{ url: 'our-plan/philosophy', priority: 0.8, changefreq: 'monthly' },
		{ url: 'our-team', priority: 0.8, changefreq: 'monthly' },
		{ url: 'news', priority: 0.9, changefreq: 'daily' },
		{ url: 'donate', priority: 0.7, changefreq: 'monthly' },
		{ url: 'membership', priority: 0.8, changefreq: 'monthly' }
	]

	// Build XML
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
	.map(
		(page) => `  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
${policies
	.map(
		(policy) => `  <url>
    <loc>${baseUrl}/our-plan/policy/${policy.slug}</loc>
    <lastmod>${new Date(policy.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
	)
	.join('\n')}
${teamMembers
	.map(
		(member) => `  <url>
    <loc>${baseUrl}/our-team/${member.slug}</loc>
    <lastmod>${new Date(member.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
	)
	.join('\n')}
${newsArticles
	.map(
		(article) => `  <url>
    <loc>${baseUrl}/news/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
	)
	.join('\n')}
</urlset>`

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600' // Cache for 1 hour
		}
	})
}
