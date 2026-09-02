import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import logger from "./logging.js";

export default async function receiveMessage(data) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const logDir = path.join(__dirname, "../storage/app/private/messages");

	await fs.promises.mkdir(logDir, { recursive: true });

	const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

	for (const m of data.messages) {
        if (
            m?.key?.senderPn &&
            m?.message &&
            (
                (
                    m?.message?.extendedTextMessage &&
                    m?.message?.extendedTextMessage?.text
                ) || (
                    m?.message?.conversation &&
                    m?.message?.messageContextInfo
                )
            )
        ) {
            const filePath = path.join(logDir, `${uniqueSuffix}.json`);
            try {
                await fs.promises.writeFile(filePath, JSON.stringify(m, null, 4), "utf8");

                let sender = m.key.senderPn;
                let message = m?.message?.extendedTextMessage?.text ? m?.message?.extendedTextMessage?.text : m?.message?.conversation;
            } catch (err) {
                logger.error(err);
            }
        }
	}
}
