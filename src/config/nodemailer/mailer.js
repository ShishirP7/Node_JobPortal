require('dotenv').config();
const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sishirpaudel7@gmail.com",
        pass: "dluwrzdwbgwahdgd"
    }
});

module.exports = mailer;