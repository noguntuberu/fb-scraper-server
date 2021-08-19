/** */
const axios = require('axios').default;
const {
    FB_GRAPH_URI,
    SCRAPER_APP_ID,
    SCRAPER_APP_SECRET,
    SCRAPER_FB_REDIRECT_URI,
    USER_APP_ID,
    USER_APP_SECRET,
    USER_FB_REDIRECT_URI,
} = require('../_env');

module.exports = {
    exchangeCodeForAccessToken: async (code, type) => {
        let APP_ID = SCRAPER_APP_ID;
        let CLIENT_SECRET = SCRAPER_APP_SECRET;
        let FB_REDIRECT_URI = SCRAPER_FB_REDIRECT_URI;
        if (type === "personal") {
            APP_ID = USER_APP_ID;
            FB_REDIRECT_URI = USER_FB_REDIRECT_URI;
            CLIENT_SECRET = USER_APP_SECRET;
        }
        
        let uri = `${FB_GRAPH_URI}/v10.0/oauth/access_token?client_id=${APP_ID}`;
        uri += `&redirect_uri=${FB_REDIRECT_URI}&client_secret=${CLIENT_SECRET}&code=${code}`;
        return (await axios.get(`${uri}`)).data;
    },

    exchangeAccessTokenForLongLivedToken: async (accessToken, type) => {
        let CLIENT_SECRET = SCRAPER_APP_SECRET;
        let APP_ID = SCRAPER_APP_ID;
        if(type === "personal") {
            CLIENT_SECRET = USER_APP_SECRET;
            APP_ID = USER_APP_ID;
        } 
        let uri = `${FB_GRAPH_URI}/oauth/access_token?grant_type=fb_exchange_token`;
        uri += `&client_id=${APP_ID}&client_secret=${CLIENT_SECRET}`;
        uri += `&fb_exchange_token=${accessToken}`;
        return (await axios.get(uri)).data;
    },

    fetchFriends: async (userId, accessToken, limit = 100) => {
        let uri = `${FB_GRAPH_URI}/${userId}/friends?access_token=${accessToken}&limit=${limit}`;
        uri += `&fields=id,birthday,name`;
        const result = await axios.get(uri);
        return result.data;
    },

    fetchGroups: async (userId, accessToken, limit = 100) => {
        let uri = `${FB_GRAPH_URI}/${userId}/groups?access_token=${accessToken}&limit=${limit}`;
        return (await axios.get(uri)).data;
    },

    fetchGroupPosts: async (groupId, accessToken, limit = 100) => {
        let uri = `${FB_GRAPH_URI}/${groupId}/feed?access_token=${accessToken}&limit=${limit}`;
        uri += `&fields=reactions{},comments{},from,message`;
        return (await axios.get(uri)).data;
    },

    fetchUserData: async (accessToken) => {
        let uri = `${FB_GRAPH_URI}/v10.0/me?access_token=${accessToken}&fields=email,name,id`;
        return (await axios.get(uri)).data;
    },

    fetchPost: async (postId, accessToken) => {
        let uri = `${FB_GRAPH_URI}/v10.0/${postId}?access_token=${accessToken}`;
        return (await axios.get(uri)).data;
    },

}