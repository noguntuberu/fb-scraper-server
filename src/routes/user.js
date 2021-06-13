/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const Controller = require('../controllers/index');
const userSchemaValitor = require('../validators/user');

const userController = new Controller('User');
const UserService = require('../services/user/user');
const userService = new UserService(userController, userSchemaValitor);

try {
    router
    .post('/', async (request, __, next) => {
        request.payload = await userService.login(request, next);
        next();
    })
    .get('/', async (request, __, next) => {
        request.payload = await userService.readRecordsByFilter(request, next);
        next();
    })
    .get('/:id', async (request, __, next) => {
        request.payload = await userService.readRecordById(request, next);
        next();
    })
    .get('/search/:keys/:keyword', async (request, __, next) => {
        request.payload = await userService.readRecordsByWildcard(request, next);
        next();
    })
    .put('/:id', async (request, __, next) => {
        request.payload = await userService.updateRecordById(request, next);
        next();
    })
    .put('/', async (request, __, next) => {
        request.payload = await userService.updateRecords(request, next);
        next();
    })
    .delete('/:id', async (request, __, next) => {
        request.payload = await userService.deleteRecordById(request, next);
        next();
    })
    .delete('/', async (request, __, next) => {
        request.payload = await userService.deleteRecords(request, next);
        next();
    })
} catch (e) {
    console.log(`[Route Error] /users: ${e.message}`);
} finally {    
    module.exports = router;
}