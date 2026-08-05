/**
 * Centralised Calendly URLs for Ally's bookable events.
 *
 * The slug naming on her Calendly account is messy because several events
 * were cloned over time (e.g. `90-minutes-individual-1-2-1-clone-clone`).
 * The mapping below was reconciled against the live site
 * (https://awakendiscovery.co.uk/pricing/) by matching each href with its
 * surrounding price/session label, so the labels here describe the actual
 * event the user lands on — not the literal Calendly slug.
 *
 * Always import from this file rather than hardcoding URLs in pages, so
 * fixing a slug only requires a single change.
 */

const CALENDLY_BASE = "https://calendly.com/awakendiscoverytherapy";

export const calendlyLinks = {
	/** Free 30-minute taster / consultation. Use this for "Enquire" / "Book a chat" CTAs. */
	tasterSession: `${CALENDLY_BASE}/20min`,

	individual: {
		/** 60-minute individual session, face-to-face — £60 */
		sixtyFaceToFace: `${CALENDLY_BASE}/60-minutes-individual-face-to-face`,
		/** 60-minute individual session, online or phone — £60 */
		sixtyOnline: `${CALENDLY_BASE}/60-minutes-individual-1-2-1-clone-1`,
		/** 90-minute individual session, face-to-face — £90 */
		ninetyFaceToFace: `${CALENDLY_BASE}/60-minutes-individual-1-2-1-clone`,
	},

	couples: {
		/** 60-minute couples session, face-to-face — £90 */
		sixtyFaceToFace: `${CALENDLY_BASE}/90-minutes-individual-1-2-1-clone-clone`,
		/** 60-minute couples session, online or phone — £90 */
		sixtyOnline: `${CALENDLY_BASE}/60-minutes-individual-1-2-1-clone-2`,
		/** 90-minute couples session (face-to-face, online or phone) — £130 */
		ninetyFaceToFace: `${CALENDLY_BASE}/reignite-connection-60-minute-couples-therapy-clone`,
	},
} as const;

/** Returns true if a CTA href points to an external destination (Calendly, etc.). */
export function isExternalHref(href: string): boolean {
	return /^https?:\/\//i.test(href);
}
