export type NavCategory = 'CONTENT' | 'OUR PLAN' | 'OUR TEAM' | 'GET INVOLVED'

export type NavItem = {
	label: string
	href: string
	showInTopNav?: boolean
	showInFooter?: boolean
	category?: NavCategory
	isAction?: boolean
	actionType?: 'primary' | 'secondary'
	external?: boolean
	children?: NavItem[]
}

export const NAV_ITEMS: NavItem[] = [
	{
		label: 'News',
		href: '/news',
		showInTopNav: true,
		showInFooter: true,
		category: 'CONTENT'
	},
	{
		label: 'Our Plan',
		href: '/our-plan',
		showInTopNav: true,
		showInFooter: true,
		category: 'OUR PLAN',
		children: [
			{ label: 'Policy', href: '/our-plan/policy', showInFooter: true, category: 'OUR PLAN' },
			{ label: 'Philosophy', href: '/our-plan/philosophy', showInFooter: true, category: 'OUR PLAN' }
		]
	},
	{
		label: 'Our Team',
		href: '/our-team',
		showInTopNav: true,
		showInFooter: true,
		category: 'OUR TEAM',
		children: [{ label: 'Candidates', href: '/our-team', showInFooter: true, category: 'OUR TEAM' }]
	},
	{
		label: 'Get Involved',
		href: '/membership',
		showInTopNav: false,
		showInFooter: true,
		category: 'GET INVOLVED',
		children: [
			{ label: 'Become a Member', href: '/membership', showInFooter: true, category: 'GET INVOLVED' },
			{ label: 'Donate', href: '/donate', showInFooter: true, category: 'GET INVOLVED' }
		]
	}
]

export type SocialLink = {
	label: string
	href: string
	icon?: any // Replace 'any' with your icon component type if using one
}

export const SOCIAL_LINKS: SocialLink[] = [
	{ label: 'Discord', href: 'https://discord.gg/your-invite' },
	{ label: 'Twitter', href: 'https://twitter.com/your-handle' },
	{ label: 'Instagram', href: 'https://instagram.com/your-handle' }
]

// Category configuration with proper URLs and display names
export const CATEGORY_CONFIG = {
	CONTENT: { label: 'Content', href: '/news' },
	'OUR PLAN': { label: 'Our Plan', href: '/our-plan' },
	'OUR TEAM': { label: 'Our Team', href: '/our-team' },
	'GET INVOLVED': { label: 'Get Involved', href: '/membership' }
} as const

export const NAV_CATEGORIES: NavCategory[] = ['CONTENT', 'OUR PLAN', 'OUR TEAM', 'GET INVOLVED']
