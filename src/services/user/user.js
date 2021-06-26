/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
const _api = require('../_api');
const RootService = require('../_root');
const { generateAuthenticationToken } = require('../../utilities/general');
const { buildQuery, buildWildcardOptions, } = require('../../utilities/query');
const { formatUserDataForDatabase } = require("./formatter");

class UserService extends RootService {
    constructor(
        user_controller,
        schemaValidator,
    ) {
        /** */
        super();

        /** */
        this.user_controller = user_controller;
        this.schemaValidator = schemaValidator;
    }

    /** */
    async fetchFriends(request, next) {
        try {
            const { user_data } = request;
            const friends = (await _api.fetchFriends(user_data.fb_id, user_data.access_token, 200));
            console.log(friends);
            return this.processSuccessfulResponse(friends);
        } catch(e) {
            console.log(e);
            const err = this.processFailedResponse(`[UserService] fetchFriends: ${e.message}`, 500);
            next(err);
        }
    }

    async fetchGroups(request, next) {
        try {
            const { user_data } = request;
            const groups = (await _api.fetchGroups(user_data.fb_id, user_data.access_token, 200)).data;
            return this.processSuccessfulResponse(groups);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] fetchGroups: ${e.message}`, 500);
            next(err);
        }
    }

    async login(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.validate(body);
            if (error) throw new Error(error);

            const { code } = body;
            const { access_token: short_token } = await _api.exchangeCodeForAccessToken(code);
            const { access_token: access_token } = await _api.exchangeAccessTokenForLongLivedToken(short_token);
            const raw_user_data = await _api.fetchUserData(access_token);
            const userData = formatUserDataForDatabase(raw_user_data);

            const existing_data = await this.user_controller.readRecords({ fb_id: Number(raw_user_data.id) });
            if (existing_data && existing_data.fb_id) {
                await this.user_controller.updateRecords({
                    fb_id: Number(raw_user_data.id)
                }, { is_active: true });
                return this.processSuccessfulResponse({
                    ...existing_data,
                    token: await generateAuthenticationToken(existing_data),
                    is_active: true,
                });
            }

            const created_data = await this.user_controller.createRecord({ ...userData, access_token });
            return this.processSuccessfulResponse({
                ...created_data,
                token: await generateAuthenticationToken(created_data),
            });
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] login: ${e.message}`, 500);
            next(err);
        }
    }
}

module.exports = UserService;