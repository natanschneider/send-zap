import express from 'express';
import utilRoutes from './routes/util.js';
import bodyParser from 'body-parser';
import logger from './utils/logging.js';
import safeJsonResponse from './utils/safeJsonResponse.js';

const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(utilRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
    logger.error(err);
    res.status(400).json(safeJsonResponse(err));
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
    console.log(`Server running on port ${port}`);
});