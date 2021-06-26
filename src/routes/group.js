/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const router = require('express').Router();
const GroupService = require('../services/group/group');
const groupService = new GroupService;

try {
    router
    .get("/:id/posts", async (request, __, next) => {
        request.payload = await groupService.fetchPosts(request, next);
        next();
    })
} catch (e) {
    console.log(`[Route Error] /samples: ${e.message}`);
} finally {    
    module.exports = router;
}