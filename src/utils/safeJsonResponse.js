export default function safeJsonResponse(obj) {
	if (typeof obj !== "object" || obj === null) {
		return obj;
	}

	const seen = new WeakSet();
	const result = JSON.stringify(obj, (key, value) => {
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) {
				return;
			}
			seen.add(value);
		}
		return value;
	});

	return JSON.parse(result);
}
