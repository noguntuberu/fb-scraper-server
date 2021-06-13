/** */
module.exports.formatUserDataForDatabase = ({email, id, name}) => ({
    email,
    name,
    fb_id: Number(id),
});