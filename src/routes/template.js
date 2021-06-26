/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const Controller = require('../controllers/index');

const templateController = new Controller('Template');
const userController = new Controller('User');
const TemplateService = require('../services/template/template');
const templateService = new TemplateService(templateController, userController);

try {
    router
    .post('/', async (request, response, next) => {
        request.payload = await templateService.createRecord(request, next);
        next();
    })
    .get('/', async (request, response, next) => {
        request.payload = await templateService.readRecordsByFilter(request, next);
        next();
    })
    .get('/:id', async (request, response, next) => {
        request.payload = await templateService.readRecordById(request, next);
        next();
    })
    .get('/search/:keys/:keyword', async (request, response, next) => {
        request.payload = await templateService.readRecordsByWildcard(request, next);
        next();
    })
    .put('/:id', async (request, response, next) => {
        request.payload = await templateService.updateRecordById(request, next);
        next();
    })
    .put('/', async (request, response, next) => {
        request.payload = await templateService.updateRecords(request, next);
        next();
    })
    .delete('/:id', async (request, response, next) => {
        request.payload = await templateService.deleteRecordById(request, next);
        next();
    })
    .delete('/', async (request, response, next) => {
        request.payload = await templateService.deleteRecords(request, next);
        next();
    })
} catch (e) {
    console.log(`[Route Error] /samples: ${e.message}`);
} finally {    
    module.exports = router;
}