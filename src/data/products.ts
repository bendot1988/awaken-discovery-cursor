/**
 * Product URLs and commercial metadata.
 * Checkout links are added here as Ally provides them (e.g. Stripe payment links).
 */

export const amazonTherapyJournalForCouplesUrl =
	"https://www.amazon.co.uk/Therapy-Journal-Couples-Awaken-Discovery/dp/B0DJZHZSL6/ref=sr_1_1?nsdOptOutParam=true&sr=8-1";

export const groundedWellnessAffiliateUrl =
	"https://www.groundedwellness.co.uk/?ref=ztu5yzm";

export type DigitalProduct = {
	title: string;
	format: string;
	priceGbp: string;
	/** Single Stripe Payment Link (GBP). International buyers pay via Stripe conversion. */
	checkoutUrl?: string | null;
};

export const anxietyReflectionJournal: DigitalProduct = {
	title: "Anxiety Reflection Journal",
	format: "PDF",
	priceGbp: "£18.99",
	checkoutUrl: "https://buy.stripe.com/cNi28rejZ7nO71q8rn8ww07",
};

export const teacherRealignmentSystem: DigitalProduct = {
	title: "The Teacher Realignment System",
	format: "PDF",
	priceGbp: "£37",
	checkoutUrl: "https://buy.stripe.com/8x2dR9dfV4bC99yazv8ww0n",
};

/** Stripe Payment Link for a single £60 therapy session (pay without booking). */
export const sixtyMinuteSessionPayUrl =
	"https://buy.stripe.com/6oUbJ12BheQg3PebDz8ww09";

/** Stripe Payment Link for a single £90 therapy session (pay without booking). */
export const ninetyMinuteSessionPayUrl =
	"https://buy.stripe.com/14A5kD3Fl23u85u8rn8ww0d";

/** Stripe Payment Link for a couples £130 (90 min) session (pay without booking). */
export const couplesNinetyMinuteSessionPayUrl =
	"https://buy.stripe.com/5kQ00j3Fl37y71q9vr8ww0m";

/** Stripe Payment Link for a couples £90 (60 min) online/phone session. */
export const couplesSixtyOnlineSessionPayUrl =
	"https://buy.stripe.com/6oU00jb7N7nO99y8rn8ww0f";

/** Stripe Payment Link for a couples £90 (60 min) face-to-face session. */
export const couplesSixtyFaceToFaceSessionPayUrl =
	"https://buy.stripe.com/eVq5kDejZcI85XmdLH8ww0g";

/** Bulk session packages — form + Stripe Payment Links. */
export type BulkPackageId = "ind-10" | "ind-6" | "cou-10" | "cou-6";

export type BulkPackage = {
	id: BulkPackageId;
	label: string;
	priceGbp: string;
	priceLabel: string;
	stripeUrl: string | null;
};

export const bulkPackages: BulkPackage[] = [
	{
		id: "ind-10",
		label: "Individual — 10 × 60 min sessions — 10% off",
		priceGbp: "£540",
		priceLabel: "540",
		stripeUrl: "https://buy.stripe.com/eVq7sL8ZF8rS5Xm5fb8ww0h",
	},
	{
		id: "ind-6",
		label: "Individual — 6 × 60 min sessions — 10% off",
		priceGbp: "£324",
		priceLabel: "324",
		stripeUrl: "https://buy.stripe.com/aFa8wP8ZFbE44Ti7nj8ww0i",
	},
	{
		id: "cou-10",
		label: "Couples — 10 × 60 min sessions — 10% off",
		priceGbp: "£810",
		priceLabel: "810",
		stripeUrl: "https://buy.stripe.com/28EcN57VBcI8fxW7nj8ww0l",
	},
	{
		id: "cou-6",
		label: "Couples — 6 × 60 min sessions — 10% off",
		priceGbp: "£486",
		priceLabel: "486",
		stripeUrl: "https://buy.stripe.com/14AeVdcbR37y85u8rn8ww0k",
	},
];

export function getBulkPackage(id: string | null | undefined): BulkPackage | undefined {
	return bulkPackages.find((p) => p.id === id);
}
