/** */
const { logger } = require('../../utilities/logger');
const Controller = require('../../controllers');
const userController = new Controller('User');

module.exports = {
    handleIncomingNotification: async (body) => {
        try {
            if (!body || !body.entry) return;
            const { id, uid, changes } = body.entry[0];
            console.log({ id, uid }, changes);
        } catch (e) {
            console.log(e.message);
            logger.error(e.message);
        }
    }
}