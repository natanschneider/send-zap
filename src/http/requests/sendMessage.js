import * as z from 'zod';
import formatPhoneNumber from '../../utils/formatPhoneNumber.js';
import safeJsonResponse from '../../utils/safeJsonResponse.js';

const sendMessageSchema = z.object({
    number: z.string('Número deve ser uma string').transform((value, ctx) => formatPhoneNumber(value, ctx)).optional(),
    group: z.string('ID do grupo deve ser uma string').transform((value) => {
        return value.includes('@g.us') ? value : value + '@g.us';
    }).optional(),
    message: z.string('Mensagem deve ser uma string').max(500, 'Message must be less than 500 characters').optional(),
    files: z.array(z.object({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.oasis.opendocument.text'], 'Arquivos deve ser PDF, JPEG, PNG, JPG ou ODS'),
        destination: z.string(),
        filename: z.string(),
        path: z.string(),
        size: z.number().int().nonnegative().max(400000000, 'Tamanho do arquivo deve ser menor que 400MB'),
    })).optional()
}).refine(
    (data) => (data.number !== undefined) !== (data.group !== undefined),
    {
        message: 'Deve ser informado apenas um dos campos number ou group',
        path: ['number', 'group']
    }
);

export default function parseSchema (req, res) {
    let parsed = sendMessageSchema.safeParse({ ...req?.body, files: req?.files });

    if (!parsed.success) {
        return res.status(400).json({
            message: 'Corpo da requisição inválido',
            errorCode: 'VALIDATION_ERROR',
            validationErrors: JSON.parse(safeJsonResponse(parsed.error.message))
        });
    }

    const formattedFiles = parsed.data.files.map(file => ({
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: file.destination,
        filename: file.filename,
        path: file.path,
        size: file.size
    }));

    parsed = { ...parsed.data, files: formattedFiles };

    return parsed;
}