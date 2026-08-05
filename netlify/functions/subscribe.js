/**
 * Add a subscriber to Mailchimp, email them the free PDF via Resend, then notify Ally.
 *
 * Env vars (Netlify → Site configuration → Environment variables):
 * - MAILCHIMP_API_KEY          full key ending in -usX (e.g. abcdef-us21)
 * - MAILCHIMP_AUDIENCE_ID      Audience ID (used for homepage + teachers unless overridden)
 * - MAILCHIMP_AUDIENCE_TEACHERS optional separate audience for the teachers guide
 * - MAILCHIMP_AUDIENCE_ANXIETY  optional separate audience for the anxiety guide
 * - MAILCHIMP_SERVER_PREFIX    optional — auto-detected from API key if unset (us21, etc.)
 * - MAILCHIMP_STATUS           optional — "subscribed" (default) or "pending" for double opt-in
 * - RESEND_API_KEY             required to email the free PDF to the subscriber
 * - RESEND_FROM                verified from-address (not onboarding@resend.dev for real users)
 * - SITE_URL                   optional — PDF link origin (Netlify URL used if unset)
 *
 * Ally signup alerts always go to: awakendiscoverytherapy@gmail.com
 * (homepage, teachers, and anxiety forms — all three)
 */

import { createHash } from "node:crypto";

const RESEND_API = "https://api.resend.com/emails";

const LIST_CONFIG = {
	"holding-too-much": {
		audienceEnv: "MAILCHIMP_AUDIENCE_ID",
		offerTitle: "When You've Been Holding Too Much for Too Long",
		offerType: "Free calming guide (PDF)",
		defaultLocation: "Homepage · Free Resource (#signup)",
		listLabel: "Mailchimp audience · Holding Too Much free guide",
		tags: ["holding-too-much", "free-guide", "website-signup"],
		pdfPath: "/assets/guides/holding-too-much.pdf",
		pdfFilename: "holding-too-much-guide.pdf",
	},
	"teachers-guide": {
		audienceEnv: "MAILCHIMP_AUDIENCE_TEACHERS",
		audienceFallbackEnv: "MAILCHIMP_AUDIENCE_ID",
		offerTitle: "Why You Can't Switch Off After Teaching",
		offerType: "Free teacher guide (PDF)",
		defaultLocation: "Teachers · Free Guide",
		listLabel: "Mailchimp audience · Teachers free guide",
		tags: ["teachers-guide", "finding-calm-teachers", "free-guide", "website-signup"],
		pdfPath: "/assets/pdf/finding-calm-teachers.pdf",
		pdfFilename: "why-you-cant-switch-off-after-teaching.pdf",
	},
	"anxiety-guide": {
		audienceEnv: "MAILCHIMP_AUDIENCE_ANXIETY",
		audienceFallbackEnv: "MAILCHIMP_AUDIENCE_ID",
		offerTitle: "Finding Calm — A Simple Guide to Grounding Yourself During Anxiety",
		offerType: "Free anxiety grounding guide (PDF)",
		defaultLocation: "Anxiety · Finding Calm free guide",
		listLabel: "Mailchimp audience · Finding Calm anxiety guide",
		tags: ["anxiety-guide", "finding-calm-anxiety", "free-guide", "website-signup"],
		pdfPath: "/assets/pdf/finding-calm-anxiety.pdf",
		pdfFilename: "finding-calm-anxiety-guide.pdf",
	},
};

function siteOrigin() {
	return (
		String(process.env.SITE_URL || "").trim().replace(/\/$/, "") ||
		String(process.env.URL || "").trim().replace(/\/$/, "") ||
		"https://awakendiscovery.co.uk"
	);
}

function resendFrom() {
	return (
		process.env.RESEND_FROM ||
		"Awaken Discovery <onboarding@resend.dev>"
	);
}

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
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function subscriberHash(email) {
	return createHash("md5").update(email.toLowerCase()).digest("hex");
}

function mailchimpServerPrefix(apiKey) {
	const fromEnv = String(process.env.MAILCHIMP_SERVER_PREFIX || "").trim();
	if (fromEnv) return fromEnv;
	const parts = apiKey.split("-");
	const suffix = parts[parts.length - 1];
	return suffix || "";
}

function mailchimpMessage(data) {
	if (!data) return "";
	if (typeof data.detail === "string") return data.detail;
	if (typeof data.title === "string") return data.title;
	if (typeof data.error === "string") return data.error;
	return "";
}

function buildNotifyHtml({
	subscriberEmail,
	offerTitle,
	offerType,
	pageLocation,
	pageUrl,
	listLabel,
	list,
}) {
	const when = new Date().toLocaleString("en-GB", {
		timeZone: "Europe/London",
		dateStyle: "full",
		timeStyle: "short",
	});

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New free guide signup</title>
</head>
<body style="margin:0;padding:0;background:#f3f6f4;font-family:Georgia,'Times New Roman',serif;color:#1d2327;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(0,94,71,0.16);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 18px;background:linear-gradient(160deg,#004836 0%,#005E47 100%);color:#ffffff;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.85;">Awaken Discovery</p>
              <h1 style="margin:0;font-size:26px;font-weight:500;line-height:1.25;">New free guide signup</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3a4348;">
                Someone just requested a free resource on the website. They have been added to Mailchimp for the newsletter / automation list.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(0,94,71,0.14);border-radius:12px;background:#f7faf8;">
                <tr>
                  <td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;">
                    <p style="margin:0 0 12px;"><strong style="color:#004836;">Subscriber email</strong><br />${escapeHtml(subscriberEmail)}</p>
                    <p style="margin:0 0 12px;"><strong style="color:#004836;">Signed up for</strong><br />${escapeHtml(offerTitle)}<br /><span style="color:#5b656b;">${escapeHtml(offerType)}</span></p>
                    <p style="margin:0 0 12px;"><strong style="color:#004836;">Website location</strong><br />${escapeHtml(pageLocation)}<br /><span style="color:#5b656b;">${escapeHtml(pageUrl)}</span></p>
                    <p style="margin:0 0 12px;"><strong style="color:#004836;">Mailchimp</strong><br />Added to <em>${escapeHtml(listLabel)}</em> (list key: ${escapeHtml(list)})</p>
                    <p style="margin:0;"><strong style="color:#004836;">When</strong><br />${escapeHtml(when)} (UK time)</p>
                  </td>
                </tr>
              </table>
              <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#6a7378;">
                Mailchimp will handle the welcome / PDF automation. This message is only your admin heads-up.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function notifyAlly({
	subscriberEmail,
	list,
	config,
	pageLocation,
	pageUrl,
}) {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		console.warn("RESEND_API_KEY missing — skipping Ally notification email");
		return { skipped: true };
	}

	const to = "awakendiscoverytherapy@gmail.com";
	const from = resendFrom();

	const html = buildNotifyHtml({
		subscriberEmail,
		offerTitle: config.offerTitle,
		offerType: config.offerType,
		pageLocation: pageLocation || config.defaultLocation,
		pageUrl: pageUrl || "https://awakendiscovery.co.uk/#signup",
		listLabel: config.listLabel,
		list,
	});

	const idempotencyKey = `signup-notify/${list}/${subscriberEmail}/${Date.now()}`;

	const response = await fetch(RESEND_API, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"Idempotency-Key": idempotencyKey.slice(0, 256),
		},
		body: JSON.stringify({
			from,
			to: [to],
			subject: `New signup: ${config.offerTitle}`,
			html,
			text: [
				"New free guide signup",
				`Subscriber: ${subscriberEmail}`,
				`Offer: ${config.offerTitle} (${config.offerType})`,
				`Location: ${pageLocation || config.defaultLocation}`,
				`Page: ${pageUrl || ""}`,
				`Mailchimp: added to ${config.listLabel}`,
			].join("\n"),
		}),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		console.error("Resend notify failed", response.status, data);
		return { ok: false, data };
	}

	return { ok: true, data };
}

function buildGuideEmailHtml({ offerTitle, pdfUrl }) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your free guide</title>
</head>
<body style="margin:0;padding:0;background:#f3f6f4;font-family:Georgia,'Times New Roman',serif;color:#1d2327;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(0,94,71,0.16);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 18px;background:linear-gradient(160deg,#004836 0%,#005E47 100%);color:#ffffff;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.85;">Awaken Discovery</p>
              <h1 style="margin:0;font-size:26px;font-weight:500;line-height:1.25;">Your free guide is ready</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#3a4348;">
                Thank you for requesting <strong style="color:#004836;">${escapeHtml(offerTitle)}</strong>.
              </p>
              <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#3a4348;">
                This gentle reflection guide is here to help you pause, reconnect with yourself, and create a little more space to breathe when life feels heavy.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 22px;">
                <tr>
                  <td style="border-radius:999px;background:#005E47;">
                    <a href="${escapeHtml(pdfUrl)}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Download your free PDF
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#5b656b;">
                If the button doesn't work, copy and paste this link into your browser:<br />
                <a href="${escapeHtml(pdfUrl)}" style="color:#004836;word-break:break-all;">${escapeHtml(pdfUrl)}</a>
              </p>
              <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#6a7378;">
                You'll also receive occasional supportive wellbeing emails from Awaken Discovery. You can unsubscribe at any time.
              </p>
              <p style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#004836;">
                Take care of yourself,<br />Ally
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendGuideToSubscriber({ email, list, config }) {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		return {
			ok: false,
			detail: "RESEND_API_KEY is missing — cannot email the free guide.",
		};
	}

	const pdfUrl = `${siteOrigin()}${config.pdfPath}`;
	const from = resendFrom();
	const html = buildGuideEmailHtml({
		offerTitle: config.offerTitle,
		pdfUrl,
	});

	const idempotencyKey = `guide-pdf/${list}/${email}`;

	const response = await fetch(RESEND_API, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"Idempotency-Key": idempotencyKey.slice(0, 256),
		},
		body: JSON.stringify({
			from,
			to: [email],
			subject: `Your free guide: ${config.offerTitle}`,
			html,
			text: [
				`Your free guide is ready: ${config.offerTitle}`,
				"",
				`Download it here: ${pdfUrl}`,
				"",
				"Take care of yourself,",
				"Ally · Awaken Discovery",
			].join("\n"),
		}),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		console.error("Resend guide email failed", response.status, data);
		return {
			ok: false,
			detail:
				(typeof data.message === "string" && data.message) ||
				"Could not send the free guide email.",
			data,
		};
	}

	return { ok: true, data, pdfUrl };
}

async function ensureInMailchimp({ apiKey, server, audienceId, email, tags }) {
	const status = String(process.env.MAILCHIMP_STATUS || "subscribed")
		.trim()
		.toLowerCase();
	const allowed = new Set(["subscribed", "pending"]);
	const memberStatus = allowed.has(status) ? status : "subscribed";

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
			status_if_new: memberStatus,
			status: memberStatus,
			tags: tags || [],
		}),
	});

	const data = await response.json().catch(() => ({}));

	if (response.ok) {
		return { ok: true, data };
	}

	return {
		ok: false,
		status: response.status,
		detail: mailchimpMessage(data) || "Mailchimp rejected the signup.",
		data,
	};
}

export async function handler(event) {
	if (event.httpMethod === "OPTIONS") {
		return json(204, {});
	}

	if (event.httpMethod !== "POST") {
		return json(405, { error: "Method not allowed" });
	}

	const apiKey = String(process.env.MAILCHIMP_API_KEY || "").trim();
	if (!apiKey) {
		return json(500, {
			error: "Mailchimp is not configured. Add MAILCHIMP_API_KEY in Netlify.",
		});
	}

	const server = mailchimpServerPrefix(apiKey);
	if (!server) {
		return json(500, {
			error:
				"Could not read Mailchimp server prefix from the API key. Add MAILCHIMP_SERVER_PREFIX (e.g. us21).",
		});
	}

	let payload;
	try {
		payload = JSON.parse(event.body || "{}");
	} catch {
		return json(400, { error: "Invalid request body" });
	}

	const email = String(payload.email || "")
		.trim()
		.toLowerCase();
	const consent = Boolean(payload.consent);
	const list = String(payload.list || "holding-too-much");
	const pagePath = String(payload.pagePath || "").trim();
	const pageUrl = String(payload.pageUrl || "").trim();
	const pageLocation =
		String(payload.pageLocation || "").trim() ||
		(pagePath ? `Website page · ${pagePath}` : "");

	if (!email || !isValidEmail(email)) {
		return json(400, { error: "Please enter a valid email address." });
	}

	if (!consent) {
		return json(400, {
			error: "Please tick the box to receive emails and your free guide.",
		});
	}

	const config = LIST_CONFIG[list];
	if (!config) {
		return json(400, { error: "Unknown signup list." });
	}

	const audienceId = String(
		process.env[config.audienceEnv] ||
			(config.audienceFallbackEnv
				? process.env[config.audienceFallbackEnv]
				: "") ||
			"",
	).trim();
	if (!audienceId) {
		return json(500, {
			error: `Mailchimp audience is not configured. Add ${config.audienceEnv}${config.audienceFallbackEnv ? ` (or ${config.audienceFallbackEnv})` : ""} in Netlify.`,
		});
	}

	try {
		const result = await ensureInMailchimp({
			apiKey,
			server,
			audienceId,
			email,
			tags: config.tags,
		});

		if (!result.ok) {
			console.error("Mailchimp subscribe failed", {
				email,
				audienceId,
				server,
				result,
			});

			const unauthenticated = /api key|unauthorized|forbidden/i.test(
				result.detail || "",
			);
			return json(502, {
				error: unauthenticated
					? "Mailchimp API key was rejected. Check MAILCHIMP_API_KEY in Netlify, then redeploy."
					: "We couldn't complete your signup just now. Please try again.",
				hint: result.detail,
			});
		}

		const guideEmail = await sendGuideToSubscriber({
			email,
			list,
			config,
		});

		if (!guideEmail.ok) {
			console.error("Guide email failed after Mailchimp signup", guideEmail);
			return json(502, {
				error:
					"You're on the list, but we couldn't email the guide just now. Please try again or contact us.",
				hint: guideEmail.detail,
			});
		}

		await notifyAlly({
			subscriberEmail: email,
			list,
			config,
			pageLocation: pageLocation || config.defaultLocation,
			pageUrl:
				pageUrl ||
				`https://awakendiscovery.co.uk${pagePath || "/#signup"}`,
		});

		return json(200, { success: true });
	} catch (error) {
		console.error("Mailchimp subscribe failed", error);
		return json(500, {
			error: "Something went wrong. Please try again in a moment.",
		});
	}
}
