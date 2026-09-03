import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../storage/app/private'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // Exemplo final: files-arquivo-1695138765432-123456789.jpg
        cb(null, `files-${baseName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage });

export default upload;
