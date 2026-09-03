import connectWhatsapp from '../../service/WhatsappSocket.js';
import buildMessageBody from '../../utils/buildMessageBody.js';
import deleteFiles from '../../utils/deleteFiles.js';
import logger from '../../utils/logging.js';

export default async function sendMessage(data, req, res) {
    try {
        const socket = await connectWhatsapp(req, res);
        const msgBody = buildMessageBody(data);
        const number = 'group' in data ? data.group : data.number;

        const ret = await Promise.all(
            msgBody.map(async (msg) => {
                try {
                    return await socket.sendMessage(number, msg);
                } catch (error) {
                    logger.error(error);
                    throw error;
                }
            })
        );

        try {
            deleteFiles(data);
        } catch (error) {
            logger.error(error);
        }

        return ret;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}
