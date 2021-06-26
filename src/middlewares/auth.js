/** */
const { logger } = require('../utilities/logger');
const {
    decodeAuthenticationToken,
    processFailedResponse
} = require('../utilities/general');

module.exports = {
    authenticateUser: async (request, __, next) => {
        try {
            const { authorization } = request.headers;
            if (!authorization) throw new Error('Unauthorized.');

            const [ , token] = authorization.split(' ');
            if (!token) throw new Error('Unauthorized.');

            const user_data = await decodeAuthenticationToken(token);
            request.user_data = user_data;
            next();
        } catch (e) {
            logger.error(e.message);
            next(processFailedResponse('Unauthorized.', 403));
        }
    }
}