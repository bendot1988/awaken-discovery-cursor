export type NavItem = {
	label: string;
	href: string;
	children?: NavItem[];
	/** When true, render a thin divider line in the dropdown after this item. */
	dividerAfter?: boolean;
};

export type SupportCard = {
	title: string;
	body: string;
	supports: string;
};

export type JourneyStep = {
	number: string;
	title: string;
	body: string;
};

export type ServicePanel = {
	title: string;
	body: string;
	cta: { label: string; href: string };
};

export type PricingTier = {
	name: string;
	price: string;
	cadence: string;
	body: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
	note?: string;
};

export const siteMeta = {
	title: "Therapy • Emotional Wellbeing • Teacher Support • Anxiety Help",
	description:
		"Compassionate counselling and emotional wellbeing support for anxiety, burnout, overwhelm and life's emotional challenges.",
	canonicalOrigin: "https://awakendiscovery.co.uk",
};

export const teacherGuidePath = "/finding-calm-teachers";
export const anxietyGuidePath = "/finding-calm-anxiety";
export const freeResourcesPath = "/free-resources";

export type FreeResource = {
	title: string;
	subtitle: string;
	footerSubtitle: string;
	description: string;
	href: string;
	ctaLabel: string;
	bullets: string[];
	image?: string;
	imageAlt?: string;
	imagePrompt?: string;
	audience: string;
};

export const freeResources: FreeResource[] = [
	{
		title: "Finding Calm in the Chaos",
		subtitle: "Why You Can't Switch Off After Teaching",
		footerSubtitle:
			"Why You Can't Switch Off After Teaching — a guide for overwhelmed teachers",
		description:
			"A teacher's guide to grounding yourself when you're already overwhelmed. Body-aware techniques you can use between lessons, in the staffroom or in the car park.",
		href: teacherGuidePath,
		ctaLabel: "Get the Teacher Guide",
		audience: "For teachers",
		bullets: [
			"Ground yourself in under 60 seconds",
			"Body-aware techniques nobody can see you doing",
			"Spot burnout coming weeks before it lands",
		],
		image: "/assets/images/finding-calm-guide-mockup.png",
		imageAlt:
			"Finding Calm in the Chaos — free guide on a desk with notebook and mug",
	},
	{
		title: "Finding Calm",
		subtitle: "A Simple Guide to Grounding Yourself During Anxiety",
		footerSubtitle: "A simple guide to grounding yourself during anxiety",
		description:
			"For anyone tired of fighting their own nervous system. Gentle, body-aware ways to pause, breathe and find your way back to yourself when anxiety rises.",
		href: anxietyGuidePath,
		ctaLabel: "Get the Anxiety Guide",
		audience: "For anxiety & overwhelm",
		bullets: [
			"Listen to what your body is telling you",
			"Personal anchors for overwhelming moments",
			"How to notice patterns before they spiral",
		],
		imagePrompt:
			"3D mockup or flatlay of the printed PDF — sage cover with calligraphic title, on a softly lit desk beside a warm mug or open notebook.",
	},
	{
		title: "When You've Been Holding Too Much for Too Long",
		subtitle: "A gentle guide to emotional overwhelm and reconnection",
		footerSubtitle: "A gentle guide to emotional overwhelm and reconnection",
		description:
			"For when you've been holding everything together for everyone else and quietly forgetting yourself in the process. A short, gentle invitation back.",
		href: "/#signup",
		ctaLabel: "Receive the Guide",
		audience: "For anyone carrying too much",
		bullets: [
			"Understand what emotional overwhelm really is",
			"Permission to slow down without guilt",
			"Small reconnection practices for daily life",
		],
		imagePrompt:
			"Soft, calming flatlay or scene — open hands, warm light, a small leaf or stone. Conveys 'putting something down,' rest, release.",
	},
];

export const navItems: NavItem[] = [
	{ label: "Home", href: "/" },
	{
		label: "Therapy",
		href: "/therapy",
		children: [
			{ label: "Therapy Overview", href: "/therapy" },
			{ label: "About Therapy", href: "/about-therapy", dividerAfter: true },
			{ label: "For Teachers", href: "/teachers" },
			{ label: "For Anxiety", href: "/anxiety", dividerAfter: true },
			{ label: "Individual Pricing", href: "/pricing/individual" },
			{ label: "Bulk Pricing", href: "/pricing" },
		],
	},
	{ label: "Free Resources", href: "/free-resources" },
	{ label: "Contact", href: "/contact" },
];

export const footerNavItems: NavItem[] = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Therapy", href: "/therapy" },
	{ label: "About Therapy", href: "/about-therapy" },
	{ label: "Teachers", href: "/teachers" },
	{ label: "Anxiety", href: "/anxiety" },
	{ label: "Free Resources", href: "/free-resources" },
	{ label: "Products", href: "/products" },
	{ label: "Individual Pricing", href: "/pricing/individual" },
	{ label: "Bulk Pricing", href: "/pricing" },
	{ label: "Blog", href: "/blog" },
	{ label: "Contact", href: "/contact" },
];

export const supportCards: SupportCard[] = [
	{
		title: "Anxiety & Overthinking",
		body: "When your mind constantly races, rest feels difficult and even small things begin to feel emotionally overwhelming.",
		supports: "racing thoughts · panic · stress · emotional overwhelm · difficulty switching off",
	},
	{
		title: "Burnout & Emotional Exhaustion",
		body: "For the moments when you have spent so long holding everything together that you no longer recognise what balance feels like.",
		supports: "burnout · emotional fatigue · overwhelm · compassion fatigue · constant pressure",
	},
	{
		title: "Relationships & Communication",
		body: "Exploring patterns, emotional needs and communication difficulties within relationships.",
		supports: "conflict · emotional distance · communication struggles · boundaries · connection",
	},
	{
		title: "Stress & Emotional Overwhelm",
		body: "When life feels mentally heavy, emotionally draining and difficult to slow down from.",
		supports: "overwhelm · pressure · emotional stress · nervous system exhaustion · mental fatigue",
	},
	{
		title: "Self-Esteem & Identity",
		body: "Reconnecting with your sense of self beneath self-doubt, people-pleasing and the pressure to constantly be enough.",
		supports: "confidence · self-worth · identity · emotional validation · personal growth",
	},
	{
		title: "Young People & Emotional Support",
		body: "Creating a safe and supportive space for young people.",
		supports: "anxiety · school stress · emotional regulation · self-esteem · identity challenges",
	},
	{
		title: "Trauma & Past Experiences",
		body: "Gently exploring experiences that may still be impacting emotional wellbeing.",
		supports: "past experiences · emotional triggers · fear responses · trust · healing",
	},
	{
		title: "Life Transitions & Personal Growth",
		body: "Support through periods of uncertainty, change and emotional reflection.",
		supports: "change · grief · uncertainty · emotional growth · rediscovery",
	},
	{
		title: "Emotional Healing & Reconnection",
		body: "Creating space to slow down, reconnect with yourself and begin understanding your emotions with greater compassion and clarity.",
		supports: "emotional healing · self-awareness · nervous system regulation · inner calm · reconnection with self",
	},
];

export const therapyServices: ServicePanel[] = [
	{
		title: "Individual Therapy",
		body: "For anxiety, overwhelm, self-esteem, emotional wellbeing and personal growth.",
		cta: { label: "Explore Individual", href: "/therapy#choose" },
	},
	{
		title: "Couples Counselling",
		body: "Support for communication, connection, conflict and emotional understanding.",
		cta: { label: "Explore Couples", href: "/therapy#choose" },
	},
	{
		title: "Young People",
		body: "A supportive space for emotional expression, anxiety, confidence and wellbeing.",
		cta: { label: "Begin Therapy", href: "/contact" },
	},
];

export const additionalSupport: ServicePanel[] = [
	{
		title: "Teacher Wellbeing",
		body: "Support for educators navigating burnout, overwhelm and emotional exhaustion.",
		cta: { label: "Teacher Support", href: "/teachers" },
	},
	{
		title: "Anxiety Support",
		body: "Resources and calming tools for overthinking, panic and nervous system overwhelm.",
		cta: { label: "Anxiety Help", href: "/anxiety" },
	},
	{
		title: "Wellbeing Products",
		body: "Journals, audios, guides and emotional wellbeing tools.",
		cta: { label: "Explore Resources", href: "/products" },
	},
];

export const journeySteps: JourneyStep[] = [
	{
		number: "01",
		title: "Reach Out",
		body: "Begin with a free consultation to explore what support may feel right for you.",
	},
	{
		number: "02",
		title: "A Calm Space to Explore",
		body: "Together we gently explore your experiences, emotions and the patterns that may be impacting your wellbeing.",
	},
	{
		number: "03",
		title: "Reconnect With Yourself",
		body: "Therapy can help you build emotional awareness, healthier boundaries, resilience and a deeper sense of self-understanding.",
	},
];

export const pricingTiers: PricingTier[] = [
	{
		name: "Individual Therapy Session",
		price: "£60",
		cadence: "60-minute session",
		body: "Suitable for ongoing emotional support, anxiety, burnout, life transitions and personal growth.",
		primaryCta: { label: "Book Session", href: "/contact" },
	},
	{
		name: "Therapy Support Block",
		price: "{{TODO: price}}",
		cadence: "6 or 10 session package",
		body: "A focused block of sessions for deeper, ongoing therapeutic support. Terms & conditions apply.",
		primaryCta: { label: "Purchase", href: "/contact" },
		secondaryCta: { label: "Learn More", href: "/pricing" },
		note: "{{TODO: confirm block pricing against existing live page}}",
	},
];

export const locations: string[] = [
	"Hull",
	"York",
	"Elloughton/Brough",
	"Howden",
	"Withernsea",
	"Hornsea",
	"Hessle",
	"Cottingham",
	"Goole",
	"Driffield",
	"Beverley",
];
