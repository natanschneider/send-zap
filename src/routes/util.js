import express from 'express';
import socket from '../service/WhatsappSocket.js';

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

export default router;