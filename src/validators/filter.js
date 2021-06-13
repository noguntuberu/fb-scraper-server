/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

const Joi = require('@hapi/joi');

module.exports = Joi.object({
    id: Joi.number().min(1).max(Number.MAX_SAFE_INTEGER),
    owner: Joi.string().required(),
    config: Joi.object({
        commentCount: Joi.number(),
        reactionCount: Joi.number(),
        keywords: Joi.array(),
    }).required(),
});