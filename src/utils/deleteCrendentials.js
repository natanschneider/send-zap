import fs from "fs";
import path from "path";
import logger from "./logging.js";

export default function deleteCredentials() {
    try {
        const authFolderPath = path.join(process.cwd(), "auth");
        if (fs.existsSync(authFolderPath)) {
            const files = fs.readdirSync(authFolderPath);
            const filesToDelete = files.filter(file => file !== '.gitignore');

            filesToDelete.forEach(file => {
                fs.unlinkSync(path.join(authFolderPath, file));
            });

            logger.info('Credentials deleted successfully');
        } else {
            logger.info('Credentials not found');
        }
    } catch (error) {
        logger.error(error);
        throw error;
    }
}
