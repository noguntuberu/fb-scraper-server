/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
const RootService = require('../_root');
const _api = require('../_api');

class GroupService extends RootService {
    constructor() {
        super();
    }

    async fetchPosts(request, next) {
        try {
            const { user_data } = request;
            const {id: groupId } = request.params;
            const posts = (await _api.fetchGroupPosts(groupId, user_data.scraper_access_token, 100));
            return this.processSuccessfulResponse(posts || []);
        } catch (e) {
            const err = this.processFailedResponse(`[GroupService Error] fetchPosts: ${e.message}`);
            next(err);
        }
    }
}

module.exports = GroupService;