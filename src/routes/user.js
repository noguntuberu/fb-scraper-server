/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const Controller = require('../controllers/index');
const userSchemaValitor = require('../validators/user');
const { authenticateUser } = require('../middlewares/auth');
const userController = new Controller('User');
const UserService = require('../services/user/user');
const userService = new UserService(userController, userSchemaValitor);

try {
    router
    .post('/', async (request, __, next) => {
        request.payload = await userService.login(request, next);
        next();
    })
    .post('/:id/send/post',authenticateUser, async (request, __, next) => {
        request.payload = await userService.sendPost(request, next);
        next();
    })
    .get('/', authenticateUser, async (request, __, next) => {
        request.payload = await userService.readRecordsByFilter(request, next);
        next();
    })
    .get('/:id',authenticateUser, async (request, __, next) => {
        request.payload = await userService.readRecordById(request, next);
        next();
    })
    .get('/:id/friends',authenticateUser, async (request, __, next) => {
        request.payload = await userService.fetchFriends(request, next);
        next();
    })
    .get('/:id/groups',authenticateUser, async (request, __, next) => {
        request.payload = await userService.fetchGroups(request, next);
        next();
    })
    .get('/search/:keys/:keyword',authenticateUser, async (request, __, next) => {
        request.payload = await userService.readRecordsByWildcard(request, next);
        next();
    })
    .put('/:id',authenticateUser, async (request, __, next) => {
        request.payload = await userService.updateRecordById(request, next);
        next();
    })
    .put('/',authenticateUser, async (request, __, next) => {
        request.payload = await userService.updateRecords(request, next);
        next();
    })
    .delete('/:id',authenticateUser, async (request, __, next) => {
        request.payload = await userService.deleteRecordById(request, next);
        next();
    })
    .delete('/',authenticateUser, async (request, __, next) => {
        request.payload = await userService.deleteRecords(request, next);
        next();
    })
} catch (e) {
    console.log(`[Route Error] /users: ${e.message}`);
} finally {    
    module.exports = router;
}