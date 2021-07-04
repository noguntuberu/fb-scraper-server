/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

let router = require('express').Router();
let {
    handle404,
    handleError,
    setupRequest,
    processResponse,
} = require('../middlewares/http');

let {
    authenticateUser,
} = require('../middlewares/auth');

/** Route Handlers */
let group_route_handler = require('./group');
let template_route_handler = require('./template');
let user_route_handler = require('./user');
let webhook_route_handler = require('./webhook');

/** Cross Origin Handling */
router.use(setupRequest);
router.use('/groups', authenticateUser, group_route_handler);
router.use('/templates',authenticateUser, template_route_handler);
router.use('/users', user_route_handler);
router.use('/webhooks', webhook_route_handler);
router.use(processResponse);

/** Static Routes */
router.use('/image/:image_name', (request, response) => {

});

router.use(handle404);
router.use(handleError);

module.exports = router;