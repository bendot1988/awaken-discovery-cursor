/**
 * Lightweight bot checks for public form endpoints.
 * Prefer silent 200 drops so scrapers do not learn which checks failed.
 */

const ALLOWED_ORIGIN_HOSTS = new Set([
	"awakendiscovery.co.uk",
	"www.awakendiscovery.co.uk",
	"awakendiscovery.netlify.app",
]);

const BOT_UA =
	/^(?:curl|wget|python-requests|python-urllib|go-http-client|scrapy|httpclient|libwww-perl|java\/|okhttp|postmanruntime|insomnia|axios\/|node-fetch|undici)\b/i;

function header(event, name) {
	const headers = event?.headers || {};
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === lower) return String(value || "").trim();
	}
	return "";
}

function hostFromUrl(value) {
	if (!value) return "";
	try {
		return new URL(value).hostname.toLowerCase();
	} catch {
		return "";
	}
}

export function honeypotFilled(payload) {
	const trap = String(
		payload?.company || payload?.website || payload?.hp || "",
	).trim();
	return trap.length > 0;
}

export function submittedTooFast(payload, minMs = 2500) {
	const raw = payload?.formStartedAt ?? payload?.formTs;
	if (raw === undefined || raw === null || raw === "") return true;
	const started = Number(raw);
	if (!Number.isFinite(started) || started <= 0) return true;
	if (started > Date.now()) return true;
	const age = Date.now() - started;
	if (age < minMs) return true;
	// Replay / recycled payloads — real forms submit within the hour
	if (age > 60 * 60 * 1000) return true;
	return false;
}

/** Browser forms always send Origin (and usually Referer). Direct API scripts often omit both. */
export function missingTrustedBrowserContext(event) {
	if (!event) return false;

	const originHost = hostFromUrl(header(event, "origin"));
	const refererHost = hostFromUrl(header(event, "referer"));
	const ua = header(event, "user-agent");

	if (ua && BOT_UA.test(ua)) return true;

	const trusted =
		(originHost && ALLOWED_ORIGIN_HOSTS.has(originHost)) ||
		(refererHost && ALLOWED_ORIGIN_HOSTS.has(refererHost));

	// Local / preview hosts used during development
	const local =
		originHost.endsWith(".netlify.app") ||
		originHost === "localhost" ||
		originHost === "127.0.0.1" ||
		refererHost.endsWith(".netlify.app") ||
		refererHost === "localhost" ||
		refererHost === "127.0.0.1";

	if (trusted || local) return false;

	// No Origin and no Referer → almost always a scripted POST
	if (!originHost && !refererHost) return true;

	return true;
}

export function shouldSilentlyDrop(payload, event) {
	return (
		honeypotFilled(payload) ||
		submittedTooFast(payload) ||
		missingTrustedBrowserContext(event)
	);
}
