/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

let { model, Schema } = require('mongoose');
let UserSchema = new Schema({
    id: {
        type: Number,
        required: true,
        default: 0,
    },
    scraper_access_token: {
        type: String,
        required: true,
    },
    user_access_token: {
        type: String,
        required: true,
    },
    auto_responder_template: {
        type: Number,
    },
    birthday_template: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
    },
    fb_id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    selected_email: {
        type: String,
    },
    //
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    time_stamp: {
        type: Number,
        required: true,
        default: () => Date.now(),
    },
    created_on: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    updated_on: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
});

model('User', UserSchema);