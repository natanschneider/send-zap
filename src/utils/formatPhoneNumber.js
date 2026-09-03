import z from "zod";

export default function formatPhoneNumber(phone, ctx = false) {
    // Remove tudo que não é dígito
    let cleaned = phone.replace(/\D/g, '');
    cleaned = cleaned.toString();

    let length = cleaned.length;
    cleaned = (!(length === 12 || length === 13)) ? '55' + cleaned : cleaned;
    length = cleaned.length;

    if (!(length === 12 || length === 13)) {
        if (ctx) {
            ctx.issues.push({
                code: 'INVALID_PHONE_NUMBER',
                message: 'Número de telefone inválido. Tamanho: '+ length + ', Tamanho esperado: 12 ou 13',
                input: phone
            });

            return z.NEVER;
        }

        throw new Error('Número de telefone Invalido');
    }

    return cleaned + '@c.us';
}