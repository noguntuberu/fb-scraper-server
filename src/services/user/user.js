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
        userController,
        schemaValidator,
    ) {
        /** */
        super();

        /** */
        this.userController = userController;
        this.schemaValidator = schemaValidator;
    }

    async createRecord(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.validate(body);

            if (error) throw new Error(error);

            delete body.id;
            const result = await this.userController.createRecord({ ...body });
            return this.processSingleRead(result);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] createRecord: ${e.message}`, 500);
            next(err);
        }
    }

    async readRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.userController.readRecords({ id, is_active: true });
            return this.processSingleRead(result[0]);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] update_record_by_id: ${e.message}`, 500);
            return next(err);
        }
    }

    async readRecordsByFilter(request, next) {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.userController, query);
            return this.processMultipleReadResults(result);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] read_records_by_filter: ${e.message}`, 500);
            next(err);
        }
    }

    async readRecordsByWildcard(request, next) {
        try {
            const { params, query } = request;

            if (!params.keys || !params.keys) {
                return next(this.processFailedResponse(`Invalid key/keyword`, 400));
            }

            const wildcard_conditions = buildWildcardOptions(params.keys, params.keyword);
            const result = await this.handleDatabaseRead(this.userController, query, wildcard_conditions);
            return this.processMultipleReadResults(result);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] read_records_by_wildcard: ${e.message}`, 500);
            next(err);
        }
    }

    async updateRecordById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.userController.updateRecords({ id }, { ...data });
            return this.processUpdateResult(result);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] update_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async updateRecords(request, next) {
        try {
            const { options, data } = request.body;
            const { seek_conditions } = buildQuery(options);

            const result = await this.userController.updateRecords({ ...seek_conditions }, { ...data });
            return this.processUpdateResult({ ...data, ...result });
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] update_records: ${e.message}`, 500);
            next(err);
        }
    }

    async deleteRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.userController.deleteRecords({ id });
            return this.processDeleteResult(result);
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] delete_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async deleteRecords(request, next) {
        try {
            const { options } = request.body;
            const { seek_conditions } = buildQuery(options);

            const result = await this.userController.deleteRecords({ ...seek_conditions });
            return this.processDeleteResult({ ...result });
        } catch (e) {
            const err = this.processFailedResponse(`[UserService] delete_records: ${e.message}`, 500);
            next(err);
        }
    }

    /** */
    async fetchGroups(request, next) {

    }

    async login(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.validate(body);
            if (error) throw new Error(error);

            const { code } = body;
            const { access_token: shortToken } = await _api.exchangeCodeForAccessToken(code);
            const { access_token: accessToken } = await _api.exchangeAccessTokenForLongLivedToken(shortToken);
            const rawUserData = await _api.fetchUserData(accessToken);
            const userData = formatUserDataForDatabase(rawUserData);

            const existingData = await this.userController.readRecords({ fb_id: rawUserData.id });
            if (existingData && existingData.fb_id) {
                await this.userController.updateRecords({
                    fb_id: rawUserData.id
                }, { is_active: true });
                return this.processSuccessfulResponse({
                    ...existingData,
                    token: await generateAuthenticationToken(existingData),
                    is_active: true,
                });
            }

            const createdData = await this.userController.createRecord({ ...userData });
            return this.processSuccessfulResponse({
                ...createdData,
                token: await generateAuthenticationToken(createdData),
            });
        } catch (e) {
            console.log(e);
            const err = this.processFailedResponse(`[UserService] login: ${e.message}`, 500);
            next(err);
        }
    }
}

module.exports = UserService;