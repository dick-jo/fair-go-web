export type NavCategory = 'CONTENT' | 'OUR PLAN' | 'OUR TEAM' | 'TAKE ACTION' | 'GET INVOLVED'

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
		href: '/policy',
		showInTopNav: true,
		showInFooter: true,
		category: 'OUR PLAN',
		children: [
			{ label: 'Policy', href: '/our-plan/policy', showInFooter: true, category: 'OUR PLAN' },
			{
				label: 'Philosophy',
				href: '/our-plan/philosophy',
				showInFooter: true,
				category: 'OUR PLAN'
			},
			{ label: 'Campaigns', href: '/our-plan/campaigns', showInFooter: true, category: 'OUR PLAN' }
		]
	},
	{
		label: 'Our Team',
		href: '/our-team',
		showInTopNav: true,
		showInFooter: true,
		category: 'OUR TEAM',
		children: [
			// {
			// 	label: 'Federal MPs',
			// 	href: '/our-team/federal-mps',
			// 	showInFooter: true,
			// 	category: 'OUR TEAM'
			// },
			{ label: 'State MPs', href: '/our-team/state-mps', showInFooter: true, category: 'OUR TEAM' },
			{
				label: 'Candidates',
				href: '/our-team/candidates',
				showInFooter: true,
				category: 'OUR TEAM'
			}
		]
	},
	{
		label: 'Get Involved',
		href: '/get-involved',
		showInTopNav: true,
		showInFooter: true,
		category: 'GET INVOLVED',
		children: [
			{ label: 'Become a Member', href: '/membership', showInFooter: true, category: 'GET INVOLVED' },
			{ label: 'Donate', href: '/donate', showInFooter: true, category: 'GET INVOLVED' },
			{ label: 'Volunter', href: '/volunteer', showInFooter: true, category: 'GET INVOLVED' }
		]
	}

	// {
	// 	label: 'Take Action',
	// 	href: '/take-action',
	// 	showInTopNav: true,
	// 	showInFooter: true,
	// 	category: 'TAKE ACTION',
	// 	children: [
	// 		{
	// 			label: 'Petitions',
	// 			href: '/take-action/petitions',
	// 			showInFooter: true,
	// 			category: 'TAKE ACTION'
	// 		},
	// 		{
	// 			label: 'Donate',
	// 			href: '/donate',
	// 			showInFooter: true,
	// 			category: 'TAKE ACTION'
	// 		},
	// 		{
	// 			label: 'Surveys',
	// 			href: '/take-action/surveys',
	// 			showInFooter: true,
	// 			category: 'TAKE ACTION'
	// 		},
	// 		{
	// 			label: 'Volunteer',
	// 			href: '/take-action/volunteer',
	// 			showInFooter: true,
	// 			category: 'TAKE ACTION'
	// 		}
	// 	]
	// }
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

export const NAV_CATEGORIES: NavCategory[] = ['CONTENT', 'OUR PLAN', 'OUR TEAM', 'GET INVOLVED']
