/** */
require('dotenv').config();
const nodemailer = require('nodemailer');
const {
    MAIL_HOST,
    MAIL_PASS,
    MAIL_PORT,
    MAIL_USER,
} = process.env;

const configure_mail_transport = () => {
    const config = {
        pool: true,
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    return nodemailer.createTransport(config);
};

const configure_message = (recipient, data) => {
    let subject = '[Facebook Scraper] Post';
    let text = `
        Sender: ${data.from}
        Body: ${data.message}
    `;

    return {
        subject,
        text,
        to: recipient,
        from: `"Facebook Scraper" <${MAIL_USER}>`,
    };
};

module.exports = {
    send_email: async (recipient, data) => {
        const transport = configure_mail_transport();
        const message_config = configure_message(recipient, data);
        const { messageId } = await transport.sendMail(message_config);
        return !!messageId;
    },
}