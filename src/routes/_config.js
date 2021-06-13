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

/** Route Handlers */
let user_route_handler = require('./user');

/** Cross Origin Handling */
router.use(setupRequest);
router.use('/users', user_route_handler);
router.use(processResponse);

/** Static Routes */
router.use('/image/:image_name', (request, response) => {

});

router.use(handle404);
router.use(handleError);

module.exports = router;