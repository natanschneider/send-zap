import express from 'express';
import validator from '../http/requests/sendMessage.js';
import sendMessage from '../http/controller/sendMessage.js';
import safeJsonResponse from '../utils/safeJsonResponse.js';
import upload from '../utils/handleFiles.js';

const router = express.Router();

router.post('/send_message', upload.array('files'), async (req, res) => {
    const data = validator(req, res);
    const ret = await sendMessage(data, req, res);

    res.status(200).json(safeJsonResponse(ret));
});

export default router;