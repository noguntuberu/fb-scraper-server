/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
const RootService = require('../_root');

const {
    buildQuery,
    buildWildcardOptions,
} = require('../../utilities/query');

class PostService extends RootService {
    constructor(
        postController,
        schemaValidator,
    ) {
        /** */
        super();

        /** */
        this.postController = postController;
        this.schemaValidator = schemaValidator;
    }

    async createRecord(request, next) {
        try {
            const { body } = request;
            const { error } = this.schemaValidator.validate(body);

            if (error) throw new Error(error);

            delete body.id;
            const result = await this.postController.createRecord({ ...body });
            return this.processSingleRead(result);
        } catch (e) {
            const err = this.processFailedResponse(`[PostService] createRecord: ${e.message}`, 500);
            next(err);
        }
    }

    async readRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.postController.readRecords({ id, is_active: true });
            return this.processSingleRead(result[0]);
        } catch (e) {
            const err = this.processFailedResponse(`[PostService] update_record_by_id: ${e.message}`, 500);
            return next(err);
        }
    }

    async readRecordsBypost(request, next) {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.postController, query);
            return this.processMultipleReadResults(result);
        } catch (e) {
            const err = this.processFailedResponse(`[PostService] read_records_by_post: ${e.message}`, 500);
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
            const result = await this.handleDatabaseRead(this.postController, query, wildcard_conditions);
            return this.processMultipleReadResults(result);
        } catch (e) {
            const err = this.processFailedResponse(`[PostService] read_records_by_wildcard: ${e.message}`, 500);
            next(err);
        }
    }

    async updateRecordById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.postController.updateRecords({ id }, { ...data });
            return this.processUpdateResult(result);
        } catch (e) {
            const err = this.processFailedResponse(`[PostService] update_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async updateRecords(request, next) {
        try {
            const { options, data } = request.body;
            const { seek_conditions } = buildQuery(options);

            const result = await this.postController.updateRecords({ ...seek_conditions }, { ...data });
            return this.processUpdateResult({ ...data, ...result });
        } catch (e) {
            const err = this.processFailedResponse(`[PostService] update_records: ${e.message}`, 500);
            next(err);
        }
    }

    async deleteRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.postController.deleteRecords({ id });
            return this.processDeleteResult(result);
        } catch (e) {
            const err = this.processFailedResponse(`[PostService] delete_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async deleteRecords(request, next) {
        try {
            const { options } = request.body;
            const { seek_conditions } = buildQuery(options);

            const result = await this.postController.deleteRecords({ ...seek_conditions });
            return this.processDeleteResult({ ...result });
        } catch (e) {
            const err = this.processFailedResponse(`[PostService] delete_records: ${e.message}`, 500);
            next(err);
        }
    }
}

module.exports = PostService;