export type NavItem = {
	label: string;
	href: string;
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

export const navItems: NavItem[] = [
	{ label: "Home", href: "/" },
	{ label: "Teachers", href: "/teachers" },
	{ label: "Anxiety", href: "/anxiety" },
	{ label: "Products", href: "/products" },
	{ label: "Pricing", href: "/pricing" },
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
];

export const therapyServices: ServicePanel[] = [
	{
		title: "Individual Therapy",
		body: "For anxiety, overwhelm, self-esteem, emotional wellbeing and personal growth.",
		cta: { label: "Begin Therapy", href: "/contact" },
	},
	{
		title: "Couples Counselling",
		body: "Support for communication, connection, conflict and emotional understanding.",
		cta: { label: "Begin Therapy", href: "/contact" },
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
