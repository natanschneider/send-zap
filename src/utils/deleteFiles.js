import fs from 'fs';

export default function deleteFiles(data) {
    if (data?.files && data.files.length > 0) {
        data.files.forEach(file => {
            const filePath = file.path || path.resolve(process.cwd(), "storage/app/private", file.filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    }
}