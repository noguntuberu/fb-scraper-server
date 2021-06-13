/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

let { model, Schema } = require('mongoose');
let TemplateSchema = new Schema({
    id: {
        type: Number,
        required: true,
        default: 0,
    },
    body: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["birthday","autoresponder"],
        required: true,
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

model('Template', TemplateSchema);