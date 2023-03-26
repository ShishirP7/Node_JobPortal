const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,

        required: true,
    },
    code: {
        type: String,
        ref: "Employer",
        required: true,
    },
    expireIn: {
        type: Number,


    }
}
    , {
        timestamps: true
    })
const OTP_MODAL = mongoose.model("OTP", OTPSchema);
module.exports = OTP_MODAL;

