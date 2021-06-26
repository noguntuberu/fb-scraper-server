/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
//
const RootService = require('../_root');

const {
    buildQuery,
    buildWildcardOptions,
} = require('../../utilities/query');

class SampleService extends RootService {
    constructor(
        template_controller,
        user_controller,
    ) {
        /** */
        super();

        /** */
        this.template_controller = template_controller;
        this.user_controller = user_controller;
    }

    async createRecord(request, next) {
        try {
            const { body } = request;
            const { owner, make_default, type } = body;

            const result = await this.template_controller.createRecord({ ...body });
            if (result && result._id && make_default) {
                const data = type == "birthday" ? {
                    birthday_template: result.id,
                } : { auto_responder_template: result.id };
                this.user_controller.updateRecords({ fb_id: owner }, {
                    ...data,
                });
            }

            return this.processSingleRead(result);
        } catch (e) {
            const err = this.processFailedResponse(`[SampleService] createRecord: ${e.message}`, 500);
            next(err);
        }
    }

    async readRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.template_controller.readRecords({ id, is_active: true });
            return this.processSingleRead(result[0]);
        } catch (e) {
            const err = this.processFailedResponse(`[SampleService] update_record_by_id: ${e.message}`, 500);
            return next(err);
        }
    }

    async readRecordsByFilter(request, next) {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.template_controller, query);
            return this.processMultipleReadResults(result);
        } catch (e) {
            const err = this.processFailedResponse(`[SampleService] read_records_by_filter: ${e.message}`, 500);
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
            const result = await this.handleDatabaseRead(this.template_controller, query, wildcard_conditions);
            return this.processMultipleReadResults(result);
        } catch (e) {
            const err = this.processFailedResponse(`[SampleService] read_records_by_wildcard: ${e.message}`, 500);
            next(err);
        }
    }

    async updateRecordById(request, next) {
        try {
            const { id } = request.params;
            const data = request.body;
            const { owner, make_default, type } = data;

            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.template_controller.updateRecords({ id }, { ...data });
            if (result.ok && result.nModified && make_default) {
                const data_to_set = type == "birthday" ? {
                    birthday_template: id,
                } : { auto_responder_template: id };
                this.user_controller.updateRecords({ fb_id: owner }, {
                    ...data_to_set,
                });
            }
            return this.processUpdateResult(result);
        } catch (e) {
            const err = this.processFailedResponse(`[SampleService] update_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async updateRecords(request, next) {
        try {
            const { options, data } = request.body;
            const { seek_conditions } = buildQuery(options);

            const result = await this.template_controller.updateRecords({ ...seek_conditions }, { ...data });
            return this.processUpdateResult({ ...data, ...result });
        } catch (e) {
            const err = this.processFailedResponse(`[SampleService] update_records: ${e.message}`, 500);
            next(err);
        }
    }

    async deleteRecordById(request, next) {
        try {
            const { id } = request.params;
            if (!id) return next(this.processFailedResponse(`Invalid ID supplied.`));

            const result = await this.template_controller.deleteRecords({ id });
            return this.processDeleteResult(result);
        } catch (e) {
            const err = this.processFailedResponse(`[SampleService] delete_record_by_id: ${e.message}`, 500);
            next(err);
        }
    }

    async deleteRecords(request, next) {
        try {
            const { options } = request.body;
            const { seek_conditions } = buildQuery(options);

            const result = await this.template_controller.deleteRecords({ ...seek_conditions });
            return this.processDeleteResult({ ...result });
        } catch (e) {
            const err = this.processFailedResponse(`[SampleService] delete_records: ${e.message}`, 500);
            next(err);
        }
    }
}

module.exports = SampleService;