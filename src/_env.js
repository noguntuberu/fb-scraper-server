/** */
require("dotenv").config();
const {
    NODE_ENV,
} = process.env;

const config = {
    development: {
        APP_PORT: 8000,
        FB_GRAPH_URI: `https://graph.facebook.com`,
        SCRAPER_APP_ID: 159432622819982,
        SCRAPER_FB_REDIRECT_URI: `https://a02510932d05.ngrok.io/`,
        USER_APP_ID: 1145245169639706,
        USER_FB_REDIRECT_URI: `https://a02510932d05.ngrok.io/settings`,
    },
    staging: {
        APP_PORT: 8000,
        SCRAPER_APP_ID: 159432622819982,
        USER_APP_ID: 1145245169639706,
        FB_GRAPH_URI: `https://graph.facebook.com`,
        FB_REDIRECT_URI: ``,
    },
    production: {
        APP_PORT: 4000,
        FB_GRAPH_URI: `https://graph.facebook.com`,
        SCRAPER_APP_ID: 159432622819982,
        SCRAPER_FB_REDIRECT_URI: `https://youthful-morse-692f0a.netlify.app/`,
        USER_APP_ID: 1145245169639706,
        USER_FB_REDIRECT_URI: `https://youthful-morse-692f0a.netlify.app/settings`,
    },
}

module.exports = {
    ...process.env,
    ...config[NODE_ENV || 'development'],
};