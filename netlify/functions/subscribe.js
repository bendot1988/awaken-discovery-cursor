/**
 * Add a subscriber to Sender and trigger group automations (e.g. free PDF).
 *
 * Env vars (Netlify → Site settings → Environment variables):
 * - SENDER_API_TOKEN — API access token from Sender Settings → API access tokens
 * - SENDER_GROUP_HOLDING_TOO_MUCH — Sender group ID for this free guide
 */

const SENDER_API = "https://api.sender.net/v2";

const GROUP_ENV_BY_LIST = {
	"holding-too-much": "SENDER_GROUP_HOLDING_TOO_MUCH",
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

async function senderFetch(path, token, body) {
	const response = await fetch(`${SENDER_API}${path}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(body),
	});

	const data = await response.json().catch(() => ({}));
	return { response, data };
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

	if (!email || !isValidEmail(email)) {
		return json(400, { error: "Please enter a valid email address." });
	}

	if (!consent) {
		return json(400, {
			error: "Please tick the box to receive emails and your free guide.",
		});
	}

	const groupEnv = GROUP_ENV_BY_LIST[list];
	if (!groupEnv) {
		return json(400, { error: "Unknown signup list." });
	}

	const groupId = process.env[groupEnv];
	if (!groupId) {
		return json(500, {
			error: `Sender group is not configured. Add ${groupEnv} in Netlify.`,
		});
	}

	try {
		const create = await senderFetch("/subscribers", token, {
			email,
			groups: [groupId],
			trigger_automation: true,
		});

		if (create.response.ok) {
			return json(200, { success: true });
		}

		// If they already exist, add them to the group so the automation still fires.
		const addToGroup = await senderFetch(
			`/subscribers/groups/${groupId}`,
			token,
			{
				subscribers: [email],
				trigger_automation: true,
			},
		);

		if (addToGroup.response.ok) {
			return json(200, { success: true });
		}

		console.error("Sender API error", {
			createStatus: create.response.status,
			createData: create.data,
			groupStatus: addToGroup.response.status,
			groupData: addToGroup.data,
		});

		return json(502, {
			error: "We couldn't complete your signup just now. Please try again.",
		});
	} catch (error) {
		console.error("Sender subscribe failed", error);
		return json(500, {
			error: "Something went wrong. Please try again in a moment.",
		});
	}
}
