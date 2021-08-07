/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
const _api = require('../_api');
const RootService = require('../_root');
const { generateAuthenticationToken } = require('../../utilities/general');
const { buildQuery, buildWildcardOptions, } = require('../../utilities/query');
const { send_email } = require('../general/mailer');
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
            const friends = (await _api.fetchFriends(user_data.fb_id, user_data.user_access_token, 200));
            return this.processSuccessfulResponse(friends);
        } catch (e) {
            console.log(e);
            const err = this.processFailedResponse(`[UserService] fetchFriends: ${e.message}`, 500);
            next(err);
        }
    }

    async fetchGroups(request, next) {
        try {
            const { user_data } = request;
            const groups = (await _api.fetchGroups(user_data.fb_id, user_data.scraper_access_token, 200)).data;
            return this.processSuccessfulResponse(groups);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] fetchGroups: ${e.message}`, 500);
            next(err);
        }
    }

    async fetchPosts() {
        try {

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

            const { code, type } = body;
            const { access_token: short_token } = await _api.exchangeCodeForAccessToken(code, type);
            const { access_token: access_token } = await _api.exchangeAccessTokenForLongLivedToken(short_token, type);

            const raw_user_data = await _api.fetchUserData(access_token);
            const user_data = formatUserDataForDatabase(raw_user_data);

            if (type === "personal") {
                return await this.accountLogin(user_data, access_token);
            }

            const data = await this.scraperLogin(user_data, access_token);
            return data;
        } catch (e) {
            console.log(e.response.data);
            const err = this.processFailedResponse(`[UserService] login: ${e.message}`, 500);
            next(err);
        }
    }

    async scraperLogin(user_data, scraper_access_token) {
        const existing_data = (await this.user_controller.readRecords({ fb_id: user_data.fb_id }))[0];
        if (existing_data && existing_data.fb_id) {
            await this.user_controller.updateRecords({
                fb_id: user_data.fb_id
            }, { is_active: true, scraper_access_token });

            return this.processSuccessfulResponse({
                ...existing_data,
                token: await generateAuthenticationToken({ ...existing_data, scraper_access_token }),
                is_active: true,
            });
        }

        const created_data = await this.user_controller.createRecord({ ...user_data, scraper_access_token });
        return this.processSuccessfulResponse({
            ...created_data,
            token: await generateAuthenticationToken(created_data),
        });
    }

    async accountLogin(user_data, user_access_token) {
        await this.user_controller.updateRecords({
            fb_id: user_data.fb_id
        }, { is_active: true, user_access_token });
        return this.processSuccessfulResponse({
            ...user_data,
            user_access_token,
            is_active: true,
        });
    }

    async sendPost(request, next) {
        try {
            const { body: data } = request;
            const { fb_id } = request.user_data;

            const user_data = await this.user_controller.readRecords({ fb_id });
            if (!user_data || !user_data[0]) return this.processFailedResponse(`User does not exist`);

            const { selected_email } = user_data[0];
            const is_sent = await send_email(selected_email, data);
            if (!is_sent) {
                return this.processFailedResponse(`Could not send email.`);
            }

            return this.processSuccessfulResponse(`Post sent successfully`);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] sendPost: ${e.message}`, 500);
            next(err);
        }
    }

    async updateRecordById(request, next) {
        try {
            const { id: fb_id } = request.params;
            const data = request.body;

            if (!fb_id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.user_controller.updateRecords({ fb_id }, { ...data });
            return this.processUpdateResult(result);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] update_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }
}

module.exports = UserService;