export interface FormStep {
	index: number
	title: string
	description: string[]
}

export const FORM_CONTENT: FormStep[] = [
	{
		index: 0,
		title: `Let's Get Started`,
		description: [
			'Signed up with FairGo before? Log in first to simplify your membershup signup experience.',
			`New to FairGo? We just need a few details to get started—We can't wait to have you on board.`
		]
	},
	{
		index: 1,
		title: 'Membership Level',
		description: [
			`Your choice of contribution gives us momentum by fueling campaigns that challenge the majors' grip on power. Your contribution is what enables us to fight relentlessly for what really matters to honest Australians like yourself.`,
			`This is your chance to choose your impact on the fight for a fairer Australia and contribute directly to our tireless efforts to make your voice heard.`
		]
	},
	{
		index: 2,
		title: 'Confirm Details',
		description: [
			'Enter your payment information to complete the process.',
			'All transactions are secure and encrypted.'
		]
	},
	{
		index: 3,
		title: 'Electoral Address',
		description: [
			'Enter your payment information to complete the process.',
			'All transactions are secure and encrypted.'
		]
	},

	{
		index: 4,
		title: 'Consent & Pledge',
		description: [
			'Enter your payment information to complete the process.',
			'All transactions are secure and encrypted.'
		]
	}
]

export interface HeaderContentItem {
	content: string[]
}

export const HEADER_CONTENT: HeaderContentItem[] = [
	{
		content: [
			'Membership is your chance to roll up your sleeves and shape policies that tackle real issues—skyrocketing energy costs, unaffordable housing, and overstretched public services.',
			'You’ll engage directly with our community-driven campaigns, share your ideas, and stand up against the majors who ignore everyday Australians.'
		]
	},
	{
		content: [
			'Your contribution powers the fight for a fairer Australia, where hard work is rewarded, innovation thrives, and families prosper.',
			'No spin, just common sense action that cuts red tape, secures energy prices, and builds strong communities with transparency and accountability.'
		]
	},
	{
		content: [
			'Joining isn’t just signing up—it’s taking a stand against waste, unsustainable welfare, and policies that undermine safety.',
			'Australia thrives with everyday people demanding transparency and results. Together, we can take our country back—are you with us?'
		]
	}
]
