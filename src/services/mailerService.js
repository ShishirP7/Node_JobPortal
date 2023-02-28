const mailer = require("../config/nodemailer/mailer")



const signupSuccessEmail = async (email, subject, text) => {
    console.log(email, subject, text, "this is the infor about receiver")
    const mail = {
        from: "sishirpaudel7@gmail.com",
        to: email,
        subject: subject,
        text: text
    }
    return mailer.sendMail(mail, function (error, info) {
        if (error) {
            console.log("error")
            console.log(error);
        } else {
            console.log("no error")
            return true;
        }
    });
}
module.exports = { signupSuccessEmail };