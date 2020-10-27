/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
require('dotenv').config();
const { TwitterClient } = require('../_twitter-client');
const RootService = require('../_root');
const UserController = require('../../controllers/user');

const { format_data_for_database, split_query_params } = require('./helper');
const { TWT_ACCT_CONNECTED } = require('../../events/constants/user');
const {
} = require('../../utilities/query');

const { TWT_CALLBACK, } = process.env;

class UserService extends RootService {
    constructor(
        twitter_client,
        user_controller,
    ) {
        /** */
        super();
        this.tweeps = new Map();
        this.twitter_client = twitter_client;

        /** */
        this.user_controller = user_controller;
    }

    async create_record(data) {
        const { org_id } = data;
        let data_to_save = format_data_for_database(data);
        const record = await this.user_controller.read_records({ org_id });
        if (record[0] && record[0].id) {
            const record_update = await this.user_controller.update_records({ org_id }, { ...data_to_save, is_active: true, });
            return this.process_update_result({ ...record_update, data_to_save, is_active: true, }, TWT_ACCT_CONNECTED);
        }

        const result = await this.user_controller.create_record({ ...data_to_save });
        return this.process_single_read(result, TWT_ACCT_CONNECTED);
    }

    async obtain_access_token(request, next) {
        try {
            const { oauth_query_string, org_id } = request.body;

            if (oauth_query_string === undefined || oauth_query_string.length < 1) {
                return this.process_failed_response(`Invalid oauth_query_string`)
            }

            const query_params = split_query_params(oauth_query_string);
            const tokens = await this.twitter_client.getAccessToken(query_params);

            if (!tokens || !tokens.oauth_token) return this.process_failed_response(`Could not connect account.`);
            return await this.create_record({ ...tokens, org_id });
        } catch (e) {
            const err = this.process_failed_response(`[UserService] obtain_access_token ${e.message}`, 500);
            next(err);
        }
    }

    async obtain_request_token(request, next) {
        try {
            const tokens = await this.twitter_client.getRequestToken(TWT_CALLBACK);
            return this.process_successful_response(tokens);
        } catch (e) {
            const err = this.process_failed_response(`[UserService] obtain_request_token ${e.message}`, 500);
            next(err);
        }
    }

    async read_organisation_record(request, next) {
        try {
            const { org_id } = request.params;
            if (!org_id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.user_controller.read_records({ org_id, ...this.standard_metadata });
            return this.process_single_read(result[0]);
        } catch (e) {
            const err = this.process_failed_response(`[UserService] read_organisation_record: ${e.message}`, 500);
            return next(err);
        }
    }

    async delete_organisation_record(request, next) {
        try {
            const { org_id } = request.params;
            if (!org_id) return next(this.process_failed_response(`Invalid ID supplied.`));

            const result = await this.user_controller.delete_records({ org_id });
            return this.process_delete_result({ ...result, org_id });
        } catch (e) {
            const err = this.process_failed_response(`[UserService] delete_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    /** */
    async load_users() {
        const users = await this.user_controller.read_records({});

        users.forEach(user => {
            console.log(user);
            // const tweep = new Tweep(user);
            // this.addUserToServerObject(tweep)
        })

    }
}

module.exports = new UserService(TwitterClient, UserController);