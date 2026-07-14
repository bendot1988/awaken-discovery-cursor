/**
 * Add a subscriber to Sender, then email Ally via Resend.
 *
 * Env vars (Netlify → Environment variables):
 * - SENDER_API_TOKEN
 * - SENDER_GROUP_HOLDING_TOO_MUCH  (must be a Group ID from Sender → Groups)
 * - RESEND_API_KEY
 * - SIGNUP_NOTIFY_TO (optional)
 * - RESEND_FROM (optional)
 */

const SENDER_API = "https://api.sender.net/v2";
const RESEND_API = "https://api.resend.com/emails";

const LIST_CONFIG = {
	"holding-too-much": {
		groupEnv: "SENDER_GROUP_HOLDING_TOO_MUCH",
		offerTitle: "When You've Been Holding Too Much for Too Long",
		offerType: "Free calming guide (PDF)",
		defaultLocation: "Homepage · Free Resource (#signup)",
		senderLabel: "Holding Too Much free-guide group",
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
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function senderMessage(data) {
	if (!data) return "";
	if (typeof data.message === "string") return data.message;
	if (Array.isArray(data.message)) return data.message.filter(Boolean).join(" ");
	if (data.message && typeof data.message === "object") {
		return JSON.stringify(data.message);
	}
	if (typeof data.error === "string") return data.error;
	return "";
}

async function senderFetch(path, token, body, method = "POST") {
	const response = await fetch(`${SENDER_API}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	const data = await response.json().catch(() => ({}));
	return { response, data };
}

function buildNotifyHtml({
	subscriberEmail,
	offerTitle,
	offerType,
	pageLocation,
	pageUrl,
	senderLabel,
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
                Someone just requested a free resource on the website. They have been added to Sender for the newsletter / automation list.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(0,94,71,0.14);border-radius:12px;background:#f7faf8;">
                <tr>
                  <td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;">
                    <p style="margin:0 0 12px;"><strong style="color:#004836;">Subscriber email</strong><br />${escapeHtml(subscriberEmail)}</p>
                    <p style="margin:0 0 12px;"><strong style="color:#004836;">Signed up for</strong><br />${escapeHtml(offerTitle)}<br /><span style="color:#5b656b;">${escapeHtml(offerType)}</span></p>
                    <p style="margin:0 0 12px;"><strong style="color:#004836;">Website location</strong><br />${escapeHtml(pageLocation)}<br /><span style="color:#5b656b;">${escapeHtml(pageUrl)}</span></p>
                    <p style="margin:0 0 12px;"><strong style="color:#004836;">Sender</strong><br />Added to <em>${escapeHtml(senderLabel)}</em> (list key: ${escapeHtml(list)})</p>
                    <p style="margin:0;"><strong style="color:#004836;">When</strong><br />${escapeHtml(when)} (UK time)</p>
                  </td>
                </tr>
              </table>
              <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#6a7378;">
                Sender will handle the subscriber welcome / PDF automation. This message is only your admin heads-up.
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

	const to =
		process.env.SIGNUP_NOTIFY_TO || "awakendiscoverytherapy@gmail.com";
	const from =
		process.env.RESEND_FROM ||
		"Awaken Discovery <onboarding@resend.dev>";

	const html = buildNotifyHtml({
		subscriberEmail,
		offerTitle: config.offerTitle,
		offerType: config.offerType,
		pageLocation: pageLocation || config.defaultLocation,
		pageUrl: pageUrl || "https://awakendiscovery.co.uk/#signup",
		senderLabel: config.senderLabel,
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
				`Sender: added to ${config.senderLabel}`,
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

async function ensureInSenderGroup(token, email, groupId) {
	// 1) Create (or accept "already exists") without groups first —
	//    so a bad group ID doesn't block creating the subscriber.
	const create = await senderFetch("/subscribers", token, {
		email,
		trigger_automation: false,
	});

	const createOk =
		create.response.ok ||
		create.response.status === 409 ||
		/already|exist/i.test(senderMessage(create.data));

	if (!create.response.ok && !createOk) {
		// Still try grouping; some accounts return odd codes for duplicates.
		console.warn("Sender create subscriber warning", {
			status: create.response.status,
			data: create.data,
		});
	}

	// 2) Add to group and trigger automations
	const addToGroup = await senderFetch(
		`/subscribers/groups/${groupId}`,
		token,
		{
			subscribers: [email],
			trigger_automation: true,
		},
	);

	if (addToGroup.response.ok) {
		const added = addToGroup.data?.message?.subscribers_added_to_group;
		const missing = addToGroup.data?.message?.non_existing_subscribers;
		if (Array.isArray(missing) && missing.includes(email) && (!added || !added.includes(email))) {
			return {
				ok: false,
				step: "add-to-group",
				status: addToGroup.response.status,
				detail:
					"Sender created the request but did not add this email to the group. Check the group ID.",
				data: addToGroup.data,
			};
		}
		return { ok: true };
	}

	return {
		ok: false,
		step: "add-to-group",
		status: addToGroup.response.status,
		detail:
			senderMessage(addToGroup.data) ||
			"Sender rejected the group ID. Use a Group ID from Sender → Subscribers → Groups (not a filter/tag from the URL).",
		data: addToGroup.data,
		createStatus: create.response.status,
		createData: create.data,
	};
}

export async function handler(event) {
	if (event.httpMethod === "OPTIONS") {
		return json(204, {});
	}

	if (event.httpMethod !== "POST") {
		return json(405, { error: "Method not allowed" });
	}

	const token = process.env.SENDER_API_TOKEN;
	if (!token) {
		return json(500, {
			error: "Sender is not configured. Add SENDER_API_TOKEN in Netlify.",
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

	const groupId = process.env[config.groupEnv];
	if (!groupId) {
		return json(500, {
			error: `Sender group is not configured. Add ${config.groupEnv} in Netlify.`,
		});
	}

	try {
		const result = await ensureInSenderGroup(token, email, groupId);

		if (!result.ok) {
			console.error("Sender subscribe failed", {
				email,
				groupId,
				result,
			});
			return json(502, {
				error:
					"We couldn't complete your signup just now. Please try again.",
				hint: result.detail,
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
		console.error("Sender subscribe failed", error);
		return json(500, {
			error: "Something went wrong. Please try again in a moment.",
		});
	}
}
