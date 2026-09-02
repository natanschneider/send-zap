import QRCode from 'qrcode';
import safeJsonResponse from './safeJsonResponse.js';
import logger from './logging.js';

export default async function renderQrCode(data, req, res) {
    let qrCode;

    try {
        if (req !== undefined && req.url == '/conn' && res && res !== undefined && (! res?.headersSent)) {
            qrCode = await QRCode.toDataURL(data);
            return res.status(200).send(` <img src="${qrCode}" alt="QR Code" /> `);
        } else {
            console.log(await QRCode.toString(data, { type: 'terminal' }));

            if (res && res !== undefined && res && res !== undefined && (! res?.headersSent)) {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        }
    } catch (error) {
        logger.error(error);

        if (res && res !== undefined && res && res !== undefined && (! res?.headersSent)) {
            return res.status(500).json({ message: 'Error rendering QR code', error: safeJsonResponse(error) });
        }

        return false;
    }
}
