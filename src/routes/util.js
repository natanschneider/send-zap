import express from 'express';

const router = express.Router();

router.get('/up', (req, res) => {
    res.status(200).json({ message: 'Server is up and running' });
});

export default router;