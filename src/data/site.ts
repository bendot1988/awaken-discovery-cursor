export type NavItem = {
	label: string;
	href: string;
};

export type Benefit = {
	title: string;
	body: string;
};

export const navItems: NavItem[] = [
	{ label: "Home", href: "#" },
	{ label: "Pricing / Services", href: "#services" },
	{ label: "Bulk sessions", href: "#bulk-sessions" },
	{ label: "Blog", href: "#blog" },
	{ label: "Wellbeing products", href: "#wellbeing-products" },
	{ label: "Contact", href: "#contact" },
];

export const painPoints: string[] = [
	"Do you often feel physical, mental or emotional pain daily?",
	"Do you feel trapped by experiences, events or people in your life?",
	"Do you want to discover why you might be continuing in the same pattern?",
	"Do you feel like your experiences, past or present stop you from being you?",
];

export const benefits: Benefit[] = [
	{
		title: "Self-discovery and awareness",
		body: "Explore your thoughts, feelings and behaviours to better understand your identity, values and motivations.",
	},
	{
		title: "Emotional regulation",
		body: "Learn practical tools to manage stress, anxiety and emotional overload in daily life.",
	},
	{
		title: "Improved relationships",
		body: "Understand recurring behaviour patterns and strengthen communication and connection with others.",
	},
	{
		title: "Healing from past traumas",
		body: "Process past experiences in a safe, supportive space and build resilience for the present.",
	},
	{
		title: "Personal growth",
		body: "Set clear goals, build confidence and move toward a more fulfilling and intentional life.",
	},
	{
		title: "Stress reduction",
		body: "Develop coping strategies that help you navigate transitions and challenges with greater calm.",
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
