/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

let appEvent = require('../events/_config');
let { buildQuery } = require('../utilities/query');

class RootService {
    constructor() {
        this.standard_metadata = {
            is_active: true,
            is_deleted: false,
        }
    }

    async handleDatabaseRead(Controller, query_options, extra_options = {}) {
        let {
            count,
            fields_to_return,
            limit,
            seek_conditions,
            skip,
            sort_condition,
        } = buildQuery(query_options);

        return await Controller.readRecords(
            { ...seek_conditions, ...extra_options, },
            fields_to_return,
            sort_condition,
            count || false,
            skip,
            limit
        );
    }

    processSingleRead(result) {
        if (result && result.id) return this.processSuccessfulResponse(result);
        return this.processFailedResponse(`Resource not found`, 404);
    }

    processMultipleReadResults(result) {
        if (result && (result.count || result.length >= 0)) return this.processSuccessfulResponse(result);
        return this.processFailedResponse(`Resources not found`, 404);
    }

    processUpdateResult(result, event_name) {
        if (result && result.ok && result.nModified) {
            if (event_name) {
                appEvent.emit(event_name, result);
            }
            return this.processSuccessfulResponse(result);
        }
        if (result && result.ok && !result.nModified) return this.processSuccessfulResponse(result, 210);
        return this.processFailedResponse(`Update failed`, 200);
    }

    processDeleteResult(result) {
        if (result && result.nModified) return this.processSuccessfulResponse(result);
        return this.processFailedResponse(`Deletion failed.`, 200);
    }

    /** */

    processFailedResponse(message, code = 400) {
        return {
            error: message,
            payload: null,
            statusCode: code,
        }
    }

    processSuccessfulResponse(payload, code = 200, send_raw_response = false, response_type = 'application/json') {
        return {
            payload,
            error: null,
            response_type,
            send_raw_response,
            statusCode: code,
        }
    }

    /** */
    validateEmail(raw_email) {
        let email = raw_email.trim();
        if (email.length < 6) {
            return {
                is_valid: false,
                message: `Email address is too short.`,
            }
        }

        let email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let is_valid = email_pattern.test(email);

        return {
            is_valid,
            message: is_valid ? email : `Invalid email address.`
        }
    }
}

module.exports = RootService;