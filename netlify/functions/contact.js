/**
 * Contact form → email Ally via Resend, optional Mailchimp newsletter opt-in.
 *
 * Env: RESEND_API_KEY, RESEND_FROM, MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID
 */

import { createHash } from "node:crypto";

const RESEND_API = "https://api.resend.com/emails";
const ALLY_EMAIL = "awakendiscoverytherapy@gmail.com";

const HELP_OPTIONS = {
	"couple-sessions": "Question regarding couple sessions",
	"bulk-pricing": "Question regarding bulk pricing",
	"free-session": "Question regarding free session",
	hello: "Saying hello / have a question",
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

function subscriberHash(email) {
	return createHash("md5").update(email.toLowerCase()).digest("hex");
}

function mailchimpServerPrefix(apiKey) {
	const fromEnv = String(process.env.MAILCHIMP_SERVER_PREFIX || "").trim();
	if (fromEnv) return fromEnv;
	const parts = apiKey.split("-");
	return parts[parts.length - 1] || "";
}

function row(label, value) {
	if (!value) return "";
	return `<p style="margin:0 0 10px;"><strong style="color:#004836;">${escapeHtml(label)}</strong><br />${escapeHtml(value)}</p>`;
}

async function sendResend({ to, subject, html, text, replyTo, idempotencyKey }) {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return { ok: false, detail: "RESEND_API_KEY is missing." };
	}

	const body = {
		from: resendFrom(),
		to: Array.isArray(to) ? to : [to],
		subject,
		html,
		text,
	};
	if (replyTo) body.reply_to = replyTo;

	const response = await fetch(RESEND_API, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"Idempotency-Key": String(idempotencyKey).slice(0, 256),
		},
		body: JSON.stringify(body),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		console.error("Resend contact failed", response.status, data);
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
			tags: ["contact-form", "newsletter", "website-signup"],
		}),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		console.error("Mailchimp contact newsletter failed", response.status, data);
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
	const phone = String(payload.phone || "").trim();
	const email = String(payload.email || "").trim().toLowerCase();
	const message = String(payload.message || "").trim();
	const privacy = Boolean(payload.privacy);
	const newsletter = Boolean(payload.newsletter);
	const topicsRaw = Array.isArray(payload.topics) ? payload.topics : [];
	const topics = topicsRaw
		.map((t) => String(t || "").trim())
		.filter((t) => HELP_OPTIONS[t]);

	if (!firstName || !lastName) {
		return json(400, { error: "Please enter your first and last name." });
	}
	if (!phone) {
		return json(400, { error: "Please enter a phone number." });
	}
	if (!email || !isValidEmail(email)) {
		return json(400, { error: "Please enter a valid email address." });
	}
	if (!message) {
		return json(400, { error: "Please enter a message." });
	}
	if (!privacy) {
		return json(400, {
			error: "Please confirm you understand the Privacy Policy.",
		});
	}

	const topicLabels = topics.map((t) => HELP_OPTIONS[t]);
	const topicsLine = topicLabels.length
		? topicLabels.join("; ")
		: "Not specified";
	const idem = `contact/${email}/${Date.now()}`;

	const allyHtml = `<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:24px;background:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#1d2327;">
  <table width="100%" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid rgba(0,94,71,.16);border-radius:16px;overflow:hidden;">
    <tr><td style="padding:24px;background:#004836;color:#fff;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.85;">Awaken Discovery</p>
      <h1 style="margin:0;font-size:24px;font-weight:500;">New contact form message</h1>
    </td></tr>
    <tr><td style="padding:24px;font-size:14px;line-height:1.55;">
      ${row("Name", `${firstName} ${lastName}`)}
      ${row("Email", email)}
      ${row("Phone", phone)}
      ${row("How can I help?", topicsLine)}
      ${row("Newsletter", newsletter ? "Yes — added to Mailchimp" : "No")}
      ${row("Message", message)}
    </td></tr>
  </table>
</body></html>`;

	const allyText = [
		"New contact form message",
		`Name: ${firstName} ${lastName}`,
		`Email: ${email}`,
		`Phone: ${phone}`,
		`Topics: ${topicsLine}`,
		`Newsletter: ${newsletter ? "Yes" : "No"}`,
		`Message: ${message}`,
	].join("\n");

	const allyMail = await sendResend({
		to: ALLY_EMAIL,
		replyTo: email,
		subject: `Contact form: ${firstName} ${lastName}`,
		html: allyHtml,
		text: allyText,
		idempotencyKey: `${idem}/ally`,
	});

	if (!allyMail.ok) {
		return json(502, {
			error: "We couldn't send your message just now. Please try again.",
			hint: allyMail.detail,
		});
	}

	await sendResend({
		to: email,
		subject: "We've received your message · Awaken Discovery",
		html: `<!DOCTYPE html>
<html lang="en"><body style="margin:0;padding:24px;background:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#1d2327;">
  <table width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(0,94,71,.16);border-radius:16px;overflow:hidden;">
    <tr><td style="padding:24px;background:#004836;color:#fff;">
      <h1 style="margin:0;font-size:24px;font-weight:500;">Thank you for getting in touch</h1>
    </td></tr>
    <tr><td style="padding:24px;font-size:15px;line-height:1.65;">
      <p style="margin:0 0 14px;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 14px;">I've received your message and aim to reply within one working day.</p>
      <p style="margin:0;">Take care,<br />Ally · Awaken Discovery</p>
    </td></tr>
  </table>
</body></html>`,
		text: `Hi ${firstName},\n\nI've received your message and aim to reply within one working day.\n\nAlly · Awaken Discovery`,
		idempotencyKey: `${idem}/customer`,
	});

	if (newsletter) {
		await addToMailchimp(email, firstName, lastName);
	}

	return json(200, { success: true });
}
