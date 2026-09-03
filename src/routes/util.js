import express from 'express';
import socket from '../service/WhatsappSocket.js';
import logger from '../utils/logging.js';

const router = express.Router();

router.get('/up', (req, res) => {
    res.status(200).json({ message: 'Server is up and running' });
});

router.get('/conn', async (req, res) => {
    try {
        await socket(req, res, true);
    } catch (error) {
        throw error;
    }

    res.status(200).json({ message: 'Connected' });
});

router.get('/disconnect', async (req, res) => {
    try {
        await socket(req, res, true, true);
    } catch (error) {
        logger.error(error);
        throw error;
    }

    res.status(200).json({ message: 'Disconnected' });
});

export default router;