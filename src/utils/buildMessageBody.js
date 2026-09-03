import path from "path";
import fs from "fs";
import getFileType from "../interface/fileType.js";

export default function buildMessageBody(data) {
    let obj = [];
    let counter = 1;

    if (data?.message) {
        obj[0] = {};
        obj[0]['text'] = data.message;
    }

    if (data?.files && data.files.length > 0) {
        data.files.forEach(file => {
            const fileType = getFileType(file.mimetype);

            if (!fileType) {
                throw new Error(`❌ Tipo de arquivo inválido para mimetype: ${file.mimetype}`);
            }

            // Resolve caminho absoluto
            const filePath = file.path || path.resolve(process.cwd(), "storage/app/private", file.filename);

            // Verifica se o arquivo existe
            if (!fs.existsSync(filePath)) {
                throw new Error(`❌ Arquivo não encontrado: ${filePath}`);
            }

            obj[counter] = {};

            // Monta objeto para Baileys
            obj[counter]['fileName'] = file.originalname;
            obj[counter]['mimetype'] = file.mimetype;
            obj[counter][fileType] = {
                url: filePath
            };

            counter++;
        });
    }

    return obj;
}
