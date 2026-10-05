/**
 * Backup log for every form submission, stored in Netlify Blobs.
 * Saved before the email is sent, so leads are kept even if Resend is down.
 * View them in the Netlify dashboard: Project > Blobs > form-submissions.
 */
import { connectLambda, getStore } from "@netlify/blobs";

const STORE_NAME = "form-submissions";
const SITE_DOMAIN = "awakendiscovery.co.uk";
const NTFY_TOPIC = "dotwall-leads-ba811f89f886a840";
const SPAM_TRAP_FIELDS = new Set([
	"_honey",
	"website",
	"bot-field",
	"_gotcha",
	"honeypot",
	"company",
]);

export type EmailStatus = "pending" | "sent" | "failed";

export interface LeadBackup {
	id: string;
	form: string;
	receivedAt: string;
	emailStatus: EmailStatus;
	emailError?: string;
	data: Record<string, unknown>;
}

function store() {
	return getStore({ name: STORE_NAME });
}

// The Blobs client retries for ~25s when unreachable, longer than the 10s function limit.
const BLOB_WRITE_TIMEOUT_MS = 4000;

async function writeEntry(entry: LeadBackup): Promise<void> {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(
			() => reject(new Error("Blobs write timed out")),
			BLOB_WRITE_TIMEOUT_MS,
		);
	});
	try {
		await Promise.race([store().setJSON(entry.id, { ...entry }), timeout]);
	} finally {
		clearTimeout(timer);
	}
}

/** Lambda-style functions must pass their event in before Blobs can be used. Never throws. */
export function connectBlobs(event: unknown): void {
	try {
		if (
			event &&
			typeof event === "object" &&
			"blobs" in event &&
			(event as { blobs?: unknown }).blobs
		) {
			connectLambda(event as Parameters<typeof connectLambda>[0]);
		}
	} catch (err) {
		console.error("[lead-backup] connectLambda failed:", err);
	}
}

function isFile(value: unknown): value is { name?: unknown; filename?: unknown } {
	if (!value || typeof value !== "object") return false;
	if (typeof Blob !== "undefined" && value instanceof Blob) return true;
	return (
		"filename" in value &&
		("content" in value || "data" in value || "size" in value)
	);
}

// Drop spam-trap fields and file contents (keep the filename only).
function cleanData(data: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(data ?? {})) {
		if (SPAM_TRAP_FIELDS.has(key) || key.startsWith("_as_")) continue;
		if (isFile(value)) {
			const name = typeof value.name === "string" ? value.name : value.filename;
			out[key] =
				`(file uploaded: ${typeof name === "string" && name ? name : "file"})`;
			continue;
		}
		out[key] = value;
	}
	return out;
}

/** Save a submission. Returns the saved entry, or null if the save failed. Never throws. */
export async function saveLeadBackup(
	form: string,
	data: Record<string, unknown>,
): Promise<LeadBackup | null> {
	let entry: LeadBackup | null = null;
	try {
		const receivedAt = new Date().toISOString();
		// Time-first id so keys sort oldest to newest.
		const id = `${receivedAt}-${Math.random().toString(36).slice(2, 8)}`;
		entry = {
			id,
			form,
			receivedAt,
			emailStatus: "pending",
			data: cleanData(data),
		};
		await writeEntry(entry);
		return entry;
	} catch (err) {
		console.error("[lead-backup] Save failed:", err, safeStringify(entry));
		return null;
	}
}

/** Record whether the email went out, using the entry kept from saveLeadBackup. Never throws. */
export async function markLeadEmail(
	entry: LeadBackup | null,
	status: EmailStatus,
	error?: string,
): Promise<void> {
	if (!entry) return;
	try {
		entry.emailStatus = status;
		if (error) entry.emailError = String(error).slice(0, 300);
		await writeEntry(entry);
	} catch (err) {
		console.error("[lead-backup] Status update failed:", err);
	}
}

/** Ping the ntfy phone app. No customer details are sent. Never throws. */
export async function notifyPhone(form: string, emailOk: boolean): Promise<void> {
	try {
		await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
			method: "POST",
			headers: {
				Title: `New form on ${SITE_DOMAIN}`,
				Tags: emailOk ? "email" : "warning",
			},
			body: emailOk
				? `${form}: email sent.`
				: `${form}: email failed. Saved in Netlify > Blobs > form-submissions.`,
			signal: AbortSignal.timeout(3000),
		});
	} catch (err) {
		console.warn("[lead-backup] Phone alert failed:", err);
	}
}

/**
 * Send the submission to Netlify Forms, which emails its own notification without Resend.
 * The form and its fields must be declared in public/netlify-forms.html. Returns true if accepted. Never throws.
 */
export async function submitNetlifyForm(
	formName: string,
	fields: Record<string, unknown>,
): Promise<boolean> {
	try {
		const body = new URLSearchParams({
			"form-name": formName,
			notice:
				"This is a backup email. The main email service is down, so this enquiry was sent through Netlify Forms instead. All the details are below.",
		});
		for (const [key, value] of Object.entries(fields)) {
			if (value === undefined || value === null) continue;
			body.set(key, String(value).slice(0, 4000));
		}
		const res = await fetch(`https://${SITE_DOMAIN}/`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
			redirect: "manual",
			signal: AbortSignal.timeout(4000),
		});
		if (res.status >= 200 && res.status < 400) return true;
		console.error(
			"[lead-backup] Netlify Forms rejected submission:",
			res.status,
		);
		return false;
	} catch (err) {
		console.error("[lead-backup] Netlify Forms submit failed:", err);
		return false;
	}
}

function safeStringify(value: unknown): string {
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}
