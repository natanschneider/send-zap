import makeWASocket, { DisconnectReason, useMultiFileAuthState, Browsers } from 'baileys';
import renderQrCode from '../utils/renderQrCode.js';
import deleteCredentials from '../utils/deleteCrendentials.js';
import safeJsonResponse from '../utils/safeJsonResponse.js';
import receiveMessage from '../utils/receiveMessage.js';
import logger from '../utils/logging.js';

let sock;
let sockReady;
let shouldDiscardCreds = false;

export default async function connectWhatsapp(req, res, closeSocket = false, shouldDeleteCreds=false) {
    if (closeSocket) {
        try {
            if (sock) {
                await sock.end();
                sock = null;
                sockReady = null;
                logger.info('Socket closed');
            }
        } catch (error) {
            logger.error(error);

            throw error;
        }
    }

    if (shouldDeleteCreds) {
        shouldDiscardCreds = true;
    }

    if (shouldDiscardCreds) {
        try {
            if (sock) {
                try {
                    await sock.end();
                } catch (err) {
                    logger.error(err);
                }

                shouldDiscardCreds = false;
            }
        } catch (error) {
            logger.error(error);
        }

        sock = null;
        sockReady = null;

        deleteCredentials();

        if (shouldDeleteCreds) {
            return true;
        }
    }

    if (sock && sockReady) return await sockReady;

    const { state, saveCreds } = await useMultiFileAuthState('auth');

	try {
        sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            browser: Browsers.macOS('Desktop')
        });
	} catch (error) {
        logger.error(error);
		throw error;
	}

    sockReady = new Promise((resolve, reject) => {
		sock.ev.on('connection.update', async (update) => {
			if (update?.conflict) {
				reject(update.conflict);
			}

            const { connection, lastDisconnect, qr } = update;

            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut && statusCode !== DisconnectReason.restartRequired;
            const shouldRestart = statusCode === DisconnectReason.restartRequired;

            if (qr) {
                try {
                    await renderQrCode(qr, req, res);

                    if (! shouldReconnect) {
                        sock = null;
                        sockReady = null;
                        shouldDiscardCreds = true;
                    }

                    reject(false);
                } catch (error) {
                    logger.error(error);
                    reject(false);
                }

                reject(lastDisconnect?.error);
			} else if (connection === 'close') {
                logger.error(lastDisconnect?.error);

				if (shouldRestart) {
					sock = null;
					sockReady = null;
					shouldDiscardCreds = false;
				} else if (shouldReconnect) {
                    sock = null;
                    sockReady = null;
                } else {
                    shouldDiscardCreds = true;
                    reject(lastDisconnect?.error);
                }

                setTimeout(connectWhatsapp, 5000);
			} else if (connection === 'open') {
                resolve(sock);
            }
        });
    }).catch((error) => {
        logger.error(error);
        if (res && res !== undefined && (! res?.headersSent)) {
            res.status(500).json({ message: 'Erro ao conectar ao WhatsApp', error: safeJsonResponse(error) });
        }
    });

	sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (event) => {
        if (! event?.messages) return;
        try {
            await receiveMessage(event);
        } catch (error) {
            logger.error(error);
        }
    });

    return await sockReady;
}
