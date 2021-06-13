/** */
require('dotenv').config();
const { promisify } = require('util');
const { JWT_ISSUER, JWT_SECRET } = process.env;
const { sign, verify } = require('jsonwebtoken');
const signAsync = promisify(sign);

module.exports = {
    decodeAuthenticationToken: async (token) => {
        return await verify(token, JWT_SECRET, {
            issuer: JWT_ISSUER
        });
    },

    generateAuthenticationToken: async (data) => {
        const expiresIn = 21600000;
        return await signAsync({ ...data }, JWT_SECRET, {
            expiresIn,
            issuer: JWT_ISSUER,
        });
    },

    processFailedResponse: (message, statusCode = 400) => ({
        error: message || 'Invalid Request',
        payload: null,
        statusCode,
    }),

    processSuccessfulResponse: (payload, statusCode = 200) => ({
        error: null,
        payload,
        statusCode,
    }),
}