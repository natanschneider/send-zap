export default function getFileType(mimeType) {
	const mimeTypes = {
		image: ["image/jpeg", "image/png", "image/jpg"],
		document: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.oasis.opendocument.spreadsheet", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text"],
		text: ["text/csv"]
	};

	for (const [type, types] of Object.entries(mimeTypes)) {
		if (types.includes(mimeType)) {
			return type;
		}
	}

	return "unknown";
}
