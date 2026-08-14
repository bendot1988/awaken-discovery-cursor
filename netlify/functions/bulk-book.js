/**
 * Bulk session booking form → email Ally, optional Mailchimp, optional Stripe redirect.
 *
 * Env vars:
 * - RESEND_API_KEY, RESEND_FROM
 * - MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID (for newsletter opt-in)
 */

import { createHash, randomBytes } from "node:crypto";

const RESEND_API = "https://api.resend.com/emails";
const ALLY_EMAIL = "awakendiscoverytherapy@gmail.com";

const PACKAGES = {
	"ind-10": {
		label: "Individual — 10 × 60 min sessions — 10% off",
		price: "£540",
		stripeUrl: "https://buy.stripe.com/eVq7sL8ZF8rS5Xm5fb8ww0h",
	},
	"ind-6": {
		label: "Individual — 6 × 60 min sessions — 10% off",
		price: "£324",
		stripeUrl: "https://buy.stripe.com/aFa8wP8ZFbE44Ti7nj8ww0i",
	},
	"cou-10": {
		label: "Couples — 10 × 60 min sessions — 10% off",
		price: "£810",
		stripeUrl: "https://buy.stripe.com/28EcN57VBcI8fxW7nj8ww0l",
	},
	"cou-6": {
		label: "Couples — 6 × 60 min sessions — 10% off",
		price: "£486",
		stripeUrl: "https://buy.stripe.com/14AeVdcbR37y85u8rn8ww0k",
	},
};

function json(statusCode, body) {
	return {
		statusCode,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
		},
		body: JSON.stringify(body),
	};
}

function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function resendFrom() {
	return process.env.RESEND_FROM || "Awaken Discovery <noreply@awakendiscovery.co.uk>";
}

function siteOrigin() {
	return (
		String(process.env.SITE_URL || "").trim().replace(/\/$/, "") ||
		String(process.env.URL || "").trim().replace(/\/$/, "") ||
		"https://awakendiscovery.co.uk"
	);
}

function subscriberHash(email) {
	return createHash("md5").update(email.toLowerCase()).digest("hex");
}

function mailchimpServerPrefix(apiKey) {
	const fromEnv = String(process.env.MAILCHIMP_SERVER_PREFIX || "").trim();
	if (fromEnv) return fromEnv;
	const parts = apiKey.split("-");
	return parts[parts.length - 1] || "";
}

function buildStripeUrl(baseUrl, email, reference) {
	const url = new URL(baseUrl);
	url.searchParams.set("prefilled_email", email);
	url.searchParams.set("client_reference_id", reference);
	return url.toString();
}

function row(label, value) {
	if (!value) return "";
	return `<p style="margin:0 0 10px;"><strong style="color:#004836;">${escapeHtml(label)}</strong><br />${escapeHtml(value)}</p>`;
}

async function sendResend({ to, subject, html, text, idempotencyKey }) {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return { ok: false, detail: "RESEND_API_KEY is missing." };
	}

	const response = await fetch(RESEND_API, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"Idempotency-Key": String(idempotencyKey).slice(0, 256),
		},
		body: JSON.stringify({
			from: resendFrom(),
			to: Array.isArray(to) ? to : [to],
			subject,
			html,
			text,
		}),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		console.error("Resend failed", response.status, data);
		return {
			ok: false,
			detail: (typeof data.message === "string" && data.message) || "Email failed",
			data,
		};
	}
	return { ok: true, data };
}

async function addToMailchimp(email, firstName, lastName) {
	const apiKey = String(process.env.MAILCHIMP_API_KEY || "").trim();
	const audienceId = String(process.env.MAILCHIMP_AUDIENCE_ID || "").trim();
	if (!apiKey || !audienceId) {
		console.warn("Mailchimp not configured — skipping newsletter opt-in");
		return { skipped: true };
	}

	const server = mailchimpServerPrefix(apiKey);
	const url = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash(email)}`;
	const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");

	const response = await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: `Basic ${auth}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			email_address: email,
			status_if_new: "subscribed",
			status: "subscribed",
			merge_fields: {
				FNAME: firstName || "",
				LNAME: lastName || "",
			},
			tags: ["bulk-sessions", "newsletter", "website-signup"],
		}),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		console.error("Mailchimp bulk newsletter failed", response.status, data);
		return { ok: false, data };
	}
	return { ok: true, data };
}

export async function handler(event) {
	if (event.httpMethod === "OPTIONS") return json(204, {});
	if (event.httpMethod !== "POST") {
		return json(405, { error: "Method not allowed" });
	}

	let payload;
	try {
		payload = JSON.parse(event.body || "{}");
	} catch {
		return json(400, { error: "Invalid request body" });
	}

	const firstName = String(payload.firstName || "").trim();
	const lastName = String(payload.lastName || "").trim();
	const email = String(payload.email || "").trim().toLowerCase();
	const phone = String(payload.phone || "").trim();
	const preferredContact = String(payload.preferredContact || "").trim();
	const address1 = String(payload.address1 || "").trim();
	const address2 = String(payload.address2 || "").trim();
	const city = String(payload.city || "").trim();
	const county = String(payload.county || "").trim();
	const postcode = String(payload.postcode || "").trim();
	const country = String(payload.country || "").trim();
	const returningCustomer = String(payload.returningCustomer || "").trim();
	const newsletter = Boolean(payload.newsletter);
	const terms = Boolean(payload.terms);
	const payNow = String(payload.payNow || "").trim();
	const packageId = String(payload.packageId || "").trim();
	const comments = String(payload.comments || "").trim();
	const howHeard = String(payload.howHeard || "").trim();

	if (!firstName || !lastName) {
		return json(400, { error: "Please enter your first and last name." });
	}
	if (!email || !isValidEmail(email)) {
		return json(400, { error: "Please enter a valid email address." });
	}
	if (!phone) {
		return json(400, { error: "Please enter a phone number." });
	}
	if (!preferredContact) {
		return json(400, { error: "Please choose a preferred contact method." });
	}
	if (!address1 || !postcode) {
		return json(400, { error: "Please enter your address and postcode." });
	}
	if (!returningCustomer) {
		return json(400, { error: "Please say whether you are a returning customer." });
	}
	if (!terms) {
		return json(400, {
			error: "Please agree to the Bulk Pricing Terms and Conditions.",
		});
	}
	if (!payNow) {
		return json(400, { error: "Please choose whether you'd like to pay now." });
	}

	const wantsPay = payNow === "yes";
	if (wantsPay && !PACKAGES[packageId]) {
		return json(400, { error: "Please choose a bulk session package." });
	}
	if (!wantsPay && packageId && !PACKAGES[packageId]) {
		return json(400, { error: "Please choose a valid bulk session package." });
	}

	const pkg = PACKAGES[packageId] || null;
	const reference = `BULK-${randomBytes(4).toString("hex").toUpperCase()}`;
	const stripeUrl =
		wantsPay && pkg?.stripeUrl
			? buildStripeUrl(pkg.stripeUrl, email, reference)
			: null;

	const addressBlock = [address1, address2, city, county, postcode, country]
		.filter(Boolean)
		.join(", ");

	const packageLine = pkg ? `${pkg.label} — ${pkg.price}` : "Not chosen yet (speak first)";
	const payLine = wantsPay
		? stripeUrl
			? "Yes — redirected to Stripe"
			: "Yes — but Stripe link missing for this package (follow up manually)"
		: "No — would like to speak first (shown Calendly)";

	const allyHtml = `<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:24px;background:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#1d2327;">
  <table width="100%" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid rgba(0,94,71,.16);border-radius:16px;overflow:hidden;">
    <tr><td style="padding:24px;background:#004836;color:#fff;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.85;">Awaken Discovery</p>
      <h1 style="margin:0;font-size:24px;font-weight:500;">New bulk session enquiry</h1>
    </td></tr>
    <tr><td style="padding:24px;font-size:14px;line-height:1.55;">
      ${row("Reference", reference)}
      ${row("Package", packageLine)}
      ${row("Pay now?", payLine)}
      ${row("Name", `${firstName} ${lastName}`)}
      ${row("Email", email)}
      ${row("Phone", phone)}
      ${row("Preferred contact", preferredContact)}
      ${row("Address", addressBlock)}
      ${row("Returning customer", returningCustomer)}
      ${row("Newsletter", newsletter ? "Yes — added to Mailchimp" : "No")}
      ${row("How they heard", howHeard)}
      ${row("Comments", comments)}
      <p style="margin:18px 0 0;color:#5b656b;font-size:13px;">${
				wantsPay
					? "Match this reference to the Stripe payment via <em>client_reference_id</em> on the Payment Link / Checkout session."
					: "Client was shown the free consultation Calendly link."
			}</p>
    </td></tr>
  </table>
</body></html>`;

	const allyText = [
		"New bulk session enquiry",
		`Reference: ${reference}`,
		`Package: ${packageLine}`,
		`Pay now: ${wantsPay ? (stripeUrl ? "Yes (Stripe)" : "Yes but link missing") : "Speak first"}`,
		`Name: ${firstName} ${lastName}`,
		`Email: ${email}`,
		`Phone: ${phone}`,
		`Preferred contact: ${preferredContact}`,
		`Address: ${addressBlock}`,
		`Returning: ${returningCustomer}`,
		`Newsletter: ${newsletter ? "Yes" : "No"}`,
		`How heard: ${howHeard}`,
		`Comments: ${comments}`,
	].join("\n");

	const allyMail = await sendResend({
		to: ALLY_EMAIL,
		subject: `Bulk enquiry ${reference}${pkg ? `: ${pkg.label}` : " (speak first)"}`,
		html: allyHtml,
		text: allyText,
		idempotencyKey: `bulk-ally/${reference}`,
	});

	if (!allyMail.ok) {
		return json(502, {
			error: "We couldn't submit your form just now. Please try again.",
			hint: allyMail.detail,
		});
	}

	const customerNextStep = wantsPay && stripeUrl
		? "You're being taken to secure Stripe checkout to complete payment. Please keep your reference number — it will also appear on the payment."
		: wantsPay && !stripeUrl
			? "Thanks for choosing to pay now. Ally will send you a secure payment link shortly for this package."
			: "You've asked to speak first — please book a free consultation via Calendly if you haven't already. Ally will also be in touch.";

	const customerHtml = `<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:24px;background:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#1d2327;">
  <table width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(0,94,71,.16);border-radius:16px;overflow:hidden;">
    <tr><td style="padding:24px;background:#004836;color:#fff;">
      <h1 style="margin:0;font-size:24px;font-weight:500;">We've received your bulk session request</h1>
    </td></tr>
    <tr><td style="padding:24px;font-size:15px;line-height:1.65;">
      <p style="margin:0 0 14px;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 14px;">Thank you for your interest in a bulk session package with Awaken Discovery.</p>
      <p style="margin:0 0 10px;"><strong style="color:#004836;">Your reference</strong><br />${escapeHtml(reference)}</p>
      ${pkg ? `<p style="margin:0 0 10px;"><strong style="color:#004836;">Package</strong><br />${escapeHtml(pkg.label)} — ${escapeHtml(pkg.price)}</p>` : ""}
      <p style="margin:0 0 14px;">${customerNextStep}</p>
      <p style="margin:0;">Take care,<br />Ally · Awaken Discovery</p>
    </td></tr>
  </table>
</body></html>`;

	await sendResend({
		to: email,
		subject: `Your bulk session request (${reference})`,
		html: customerHtml,
		text: `Hi ${firstName},\n\nWe've received your bulk session request.\nReference: ${reference}\n${pkg ? `Package: ${pkg.label} — ${pkg.price}\n` : ""}\nAlly · Awaken Discovery`,
		idempotencyKey: `bulk-customer/${reference}`,
	});

	if (newsletter) {
		await addToMailchimp(email, firstName, lastName);
	}

	return json(200, {
		success: true,
		reference,
		stripeUrl,
		thankYouUrl: `${siteOrigin()}/pricing/bulk-thank-you?ref=${encodeURIComponent(reference)}`,
	});
}
