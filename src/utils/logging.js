import winston from "winston";
const { combine, timestamp, json } = winston.format;
import 'winston-daily-rotate-file';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFilePath = path.join(__dirname, '../storage/app/logs');

const fileTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logFilePath, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
});

const logger = winston.createLogger({
    format: combine(timestamp(), json()),
    transports: [fileTransport],
});

export default logger;