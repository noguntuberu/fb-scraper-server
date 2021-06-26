/** */
require("dotenv").config();
const {
    NODE_ENV,
} = process.env;

const config = {
    development: {
        APP_PORT: 8000,
        FB_APP_ID: 159432622819982,
        FB_GRAPH_URI: `https://graph.facebook.com`,
        FB_REDIRECT_URI: `https://ab4c9e546ae8.ngrok.io/`,
    },
    staging: {
        APP_PORT: 8000,
        FB_APP_ID: 159432622819982,
        FB_GRAPH_URI: `https://graph.facebook.com`,
        FB_REDIRECT_URI: ``,
    },
    production: {
        APP_PORT: 4000,
        FB_APP_ID: 159432622819982,
        FB_GRAPH_URI: `https://graph.facebook.com`,
        FB_REDIRECT_URI: `https://youthful-morse-692f0a.netlify.app/`,
    },
}

module.exports = {
    ...process.env,
    ...config[NODE_ENV || 'development'],
};