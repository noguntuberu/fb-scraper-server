/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const { handleIncomingNotification } = require("../services/user/webhook");

try {
    router
        .get('/', async (request, response, next) => {
            const { query } = request;
            return response.send(query['hub.challenge']);
        })
        .post('/', async (request, response, next) => {
            handleIncomingNotification(request.body);
            return response.send();
        })
} catch (e) {
    console.log(`[Route Error] /samples: ${e.message}`);
} finally {
    module.exports = router;
}