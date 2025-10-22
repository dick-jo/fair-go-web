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
		title: 'Electoral Roll Details',
		description: [
			`We just need a few more details to ensure your membership is valid, according to electoral authority expectations and requirements`,
			`It's important that, to the best of your abilities, these details match those registered with the Electoral Roll, and that you are eligible and enrolled to vote.`
		]
	},
	{
		index: 3,
		title: 'Consent & Pledge',
		description: [
			`Thanks for taking a stand with us—We can't do this without your support.`,
			`To affirm your commitment to joining our fight for a fair go, we ask that you agree to the pledge and provide your consent for sharing necessary information with electoral authorities.`
		]
	},

	{
		index: 4,
		title: 'Confirm Payment',
		description: [
			`You're one step away from becoming an official FairGo Member!`,
			`Select Proceed To Payment to be redirected to our secure payment partner. All transaction are secure and encrypted.`
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

import { PUBLIC_ENABLE_TEST_PRICING } from '$env/static/public'

export interface MembershipTier {
	label: string
	value: number
}

// Test pricing: $1 for all tiers (Stripe's minimum for subscriptions)
// Production pricing: $50-$250
const TEST_TIERS: MembershipTier[] = [
	{ label: 'supporter', value: 1 },
	{ label: 'advocate', value: 1 },
	{ label: 'partisan', value: 1 },
	{ label: 'champion', value: 1 },
	{ label: 'visionary', value: 1 }
]

const PROD_TIERS: MembershipTier[] = [
	{ label: 'supporter', value: 50 },
	{ label: 'advocate', value: 100 },
	{ label: 'partisan', value: 150 },
	{ label: 'champion', value: 200 },
	{ label: 'visionary', value: 250 }
]

export const MEMBERSHIP_TIERS: MembershipTier[] = PUBLIC_ENABLE_TEST_PRICING === 'true' ? TEST_TIERS : PROD_TIERS
