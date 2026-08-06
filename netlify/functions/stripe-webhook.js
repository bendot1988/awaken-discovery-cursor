/**
 * Stripe webhook → email paid PDF via Resend after checkout.session.completed.
 *
 * Env vars (Netlify → Site configuration → Environment variables):
 * - STRIPE_WEBHOOK_SECRET   whsec_… from the Stripe webhook endpoint
 * - STRIPE_SECRET_KEY       optional — sk_live_… (not required for signature verify + amount match)
 * - RESEND_API_KEY          required to email the PDF
 * - RESEND_FROM             verified from-address
 *
 * Ally sale alerts always go to: awakendiscoverytherapy@gmail.com
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RESEND_API = "https://api.resend.com/emails";
const ALLY_EMAIL = "awakendiscoverytherapy@gmail.com";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Digital products fulfilled by this webhook.
 * Match by Stripe Payment Link id (plink_…) when known, else amount + currency.
 */
const PRODUCTS = [
	{
		id: "teacher",
		title: "The Teacher Realignment System",
		pdfRelativePath: "private/products/teacher-realignment-system.pdf",
		pdfFilename: "the-teacher-realignment-system.pdf",
		/** Optional: set STRIPE_PAYMENT_LINK_TEACHER=plink_… in Netlify */
		paymentLinkEnv: "STRIPE_PAYMENT_LINK_TEACHER",
		amounts: [
			{ currency: "gbp", amountTotal: 3700 }, // £37.00
			{ currency: "usd", amountTotal: 4700 }, // $47.00 (when USD link exists)
		],
	},
];

function json(statusCode, body) {
	return {
		statusCode,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	};
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
	return (
		process.env.RESEND_FROM ||
		"Awaken Discovery <noreply@awakendiscovery.co.uk>"
	);
}

function header(event, name) {
	const headers = event.headers || {};
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === lower) return value;
	}
	return "";
}

function rawBody(event) {
	if (!event.body) return "";
	if (event.isBase64Encoded) {
		return Buffer.from(event.body, "base64").toString("utf8");
	}
	return event.body;
}

/**
 * Verify Stripe-Signature (t=…,v1=…) without the Stripe SDK.
 * https://docs.stripe.com/webhooks/signatures
 */
function verifyStripeSignature(payload, signatureHeader, secret, toleranceSec = 300) {
	if (!signatureHeader || !secret) {
		throw new Error("Missing Stripe signature or webhook secret");
	}

	const parts = String(signatureHeader)
		.split(",")
		.reduce(
			(acc, part) => {
				const [key, ...rest] = part.split("=");
				const value = rest.join("=");
				if (key === "t") acc.timestamp = value;
				if (key === "v1") acc.signatures.push(value);
				return acc;
			},
			{ timestamp: null, signatures: [] },
		);

	if (!parts.timestamp || parts.signatures.length === 0) {
		throw new Error("Malformed Stripe-Signature header");
	}

	const age = Math.floor(Date.now() / 1000) - Number(parts.timestamp);
	if (!Number.isFinite(age) || Math.abs(age) > toleranceSec) {
		throw new Error("Stripe signature timestamp outside tolerance");
	}

	const signedPayload = `${parts.timestamp}.${payload}`;
	const expected = createHmac("sha256", secret)
		.update(signedPayload, "utf8")
		.digest("hex");
	const expectedBuf = Buffer.from(expected, "utf8");

	const matched = parts.signatures.some((sig) => {
		const sigBuf = Buffer.from(sig, "utf8");
		if (sigBuf.length !== expectedBuf.length) return false;
		return timingSafeEqual(expectedBuf, sigBuf);
	});

	if (!matched) {
		throw new Error("Stripe signature mismatch");
	}
}

function resolvePdfPath(relativePath) {
	const candidates = [
		join(process.cwd(), relativePath),
		join(__dirname, relativePath),
		join(__dirname, "..", "..", relativePath),
	];
	for (const candidate of candidates) {
		if (existsSync(candidate)) return candidate;
	}
	return null;
}

function matchProduct(session) {
	const metadataProduct = String(session?.metadata?.product || "")
		.trim()
		.toLowerCase();
	if (metadataProduct) {
		const byMeta = PRODUCTS.find((p) => p.id === metadataProduct);
		if (byMeta) return byMeta;
	}

	const paymentLinkId = String(session?.payment_link || "").trim();
	if (paymentLinkId) {
		for (const product of PRODUCTS) {
			const configured = String(process.env[product.paymentLinkEnv] || "").trim();
			if (configured && configured === paymentLinkId) return product;
		}
	}

	const amountTotal = Number(session?.amount_total);
	const currency = String(session?.currency || "")
		.trim()
		.toLowerCase();

	return (
		PRODUCTS.find((product) =>
			product.amounts.some(
				(a) => a.currency === currency && a.amountTotal === amountTotal,
			),
		) || null
	);
}

function customerEmail(session) {
	return (
		String(session?.customer_details?.email || "").trim() ||
		String(session?.customer_email || "").trim() ||
		""
	);
}

function buildBuyerEmailHtml({ title }) {
	return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f3f6f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6f4;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px 24px;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5b656b;">
                Awaken Discovery
              </p>
              <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#004836;">
                Your ${escapeHtml(title)} is ready
              </h1>
              <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#2f383c;">
                Thank you for your purchase. Your PDF is attached to this email — download it and keep a copy somewhere safe.
              </p>
              <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#2f383c;">
                If the attachment doesn’t appear, check your spam folder or reply to this email and I’ll resend it.
              </p>
              <p style="margin:22px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#004836;">
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

async function sendResend(payload, idempotencyKey) {
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
			...payload,
		}),
	});

	const data = await response.json().catch(() => ({}));
	if (!response.ok) {
		console.error("Resend failed", response.status, data);
		return {
			ok: false,
			detail:
				(typeof data.message === "string" && data.message) ||
				"Resend request failed",
			data,
		};
	}
	return { ok: true, data };
}

async function fulfilCheckout(session) {
	const email = customerEmail(session);
	if (!email) {
		return { ok: false, detail: "No customer email on checkout session" };
	}

	const paymentStatus = String(session.payment_status || "").toLowerCase();
	if (paymentStatus && paymentStatus !== "paid" && paymentStatus !== "no_payment_required") {
		return { ok: false, detail: `Payment not complete (${paymentStatus})` };
	}

	const product = matchProduct(session);
	if (!product) {
		console.log(
			"stripe-webhook: no digital product match — ignoring session",
			session.id,
			session.amount_total,
			session.currency,
			session.payment_link,
		);
		return { ok: true, skipped: true, reason: "not-a-digital-product" };
	}

	const pdfPath = resolvePdfPath(product.pdfRelativePath);
	if (!pdfPath) {
		console.error("PDF missing for product", product.id, product.pdfRelativePath);
		return { ok: false, detail: `PDF not found for ${product.id}` };
	}

	const pdfBase64 = readFileSync(pdfPath).toString("base64");
	const sessionId = String(session.id || "unknown");

	const buyerResult = await sendResend(
		{
			to: [email],
			subject: `Your ${product.title} PDF`,
			html: buildBuyerEmailHtml({ title: product.title }),
			text: [
				`Your ${product.title} is ready.`,
				"",
				"Your PDF is attached to this email — download it and keep a copy somewhere safe.",
				"",
				"If the attachment doesn’t appear, reply to this email and I’ll resend it.",
				"",
				"Take care of yourself,",
				"Ally · Awaken Discovery",
			].join("\n"),
			attachments: [
				{
					filename: product.pdfFilename,
					content: pdfBase64,
				},
			],
		},
		`stripe-pdf/${product.id}/${sessionId}`,
	);

	if (!buyerResult.ok) {
		return buyerResult;
	}

	// Ally alert — don't fail the webhook if this errors (buyer already got PDF)
	const amount = Number(session.amount_total || 0);
	const currency = String(session.currency || "").toUpperCase();
	const amountLabel = Number.isFinite(amount)
		? `${(amount / 100).toFixed(2)} ${currency}`
		: currency;

	await sendResend(
		{
			to: [ALLY_EMAIL],
			subject: `Sale: ${product.title} — ${amountLabel}`,
			html: [
				`<p><strong>New paid download</strong></p>`,
				`<p>Product: ${escapeHtml(product.title)}</p>`,
				`<p>Buyer: ${escapeHtml(email)}</p>`,
				`<p>Amount: ${escapeHtml(amountLabel)}</p>`,
				`<p>Stripe session: ${escapeHtml(sessionId)}</p>`,
			].join(""),
			text: [
				"New paid download",
				`Product: ${product.title}`,
				`Buyer: ${email}`,
				`Amount: ${amountLabel}`,
				`Stripe session: ${sessionId}`,
			].join("\n"),
		},
		`stripe-ally/${product.id}/${sessionId}`,
	);

	return { ok: true, productId: product.id, email };
}

export async function handler(event) {
	if (event.httpMethod !== "POST") {
		return json(405, { error: "Method not allowed" });
	}

	const secret = String(process.env.STRIPE_WEBHOOK_SECRET || "").trim();
	if (!secret) {
		console.error("STRIPE_WEBHOOK_SECRET missing");
		return json(500, { error: "Webhook not configured" });
	}

	const payload = rawBody(event);
	const signature = header(event, "stripe-signature");

	try {
		verifyStripeSignature(payload, signature, secret);
	} catch (err) {
		console.error("Stripe signature verification failed", err?.message || err);
		return json(400, { error: "Invalid signature" });
	}

	let stripeEvent;
	try {
		stripeEvent = JSON.parse(payload);
	} catch {
		return json(400, { error: "Invalid JSON" });
	}

	if (stripeEvent.type !== "checkout.session.completed") {
		return json(200, { received: true, ignored: stripeEvent.type });
	}

	const session = stripeEvent.data?.object;
	if (!session || typeof session !== "object") {
		return json(400, { error: "Missing session object" });
	}

	const result = await fulfilCheckout(session);
	if (!result.ok) {
		console.error("Fulfilment failed", result.detail);
		// 500 so Stripe retries (e.g. transient Resend outage)
		return json(500, { error: result.detail || "Fulfilment failed" });
	}

	return json(200, {
		received: true,
		skipped: Boolean(result.skipped),
		productId: result.productId || null,
	});
}
