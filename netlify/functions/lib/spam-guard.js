/**
 * Lightweight bot checks for public form endpoints.
 * Returns { blocked: true } when submission should be silently dropped.
 */

export function honeypotFilled(payload) {
	const trap = String(
		payload?.company || payload?.website || payload?.hp || "",
	).trim();
	return trap.length > 0;
}

export function submittedTooFast(payload, minMs = 2500) {
	const raw = payload?.formStartedAt ?? payload?.formTs;
	if (raw === undefined || raw === null || raw === "") return false;
	const started = Number(raw);
	if (!Number.isFinite(started) || started <= 0) return false;
	return Date.now() - started < minMs;
}

export function shouldSilentlyDrop(payload) {
	return honeypotFilled(payload) || submittedTooFast(payload);
}
