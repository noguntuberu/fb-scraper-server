/** */
const { logger } = require('../../utilities/logger');
const Controller = require('../../controllers');
const userController = new Controller('User');

module.exports = {
    handleIncomingNotification: async (body) => {
        try {
            console.log(body.entry);
        } catch (e) {
            console.log(e.message);
            logger.error(e.message);
        }
    }
}