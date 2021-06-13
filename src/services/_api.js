/** */
const axios = require('axios').default;
const {
    FB_APP_ID,
    FB_APP_SECRET,
    FB_GRAPH_URI,
    FB_REDIRECT_URI,
} = require('../_env');

module.exports = {
    exchangeCodeForAccessToken: async (code) => {
        let uri = `${FB_GRAPH_URI}/v10.0/oauth/access_token?client_id=${FB_APP_ID}`;
        uri += `&redirect_uri=${FB_REDIRECT_URI}&client_secret=${FB_APP_SECRET}&code=${code}`;
        return (await axios.get(`${uri}`)).data;
    },

    exchangeAccessTokenForLongLivedToken: async (accessToken) => {
        let uri = `${FB_GRAPH_URI}/oauth/access_token?grant_type=fb_exchange_token`;
        uri += `&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}`;
        uri += `&fb_exchange_token=${accessToken}`;
        return (await axios.get(uri)).data;
    },

    fetchGroups: async (userId, accessToken) => {
        let uri = `${FB_GRAPH_URI}/${userId}/groups?access_token=${accessToken}`;
        return (await axios.get(uri)).data;
    },

    fetchUserData: async (accessToken) => {
        let uri = `${FB_GRAPH_URI}/v10.0/me?access_token=${accessToken}&fields=email,name,id`;
        return (await axios.get(uri)).data;
    },

}