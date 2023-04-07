const mongoose = require("mongoose");
const { stringify } = require("uuid");
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
    employerID: {
        type: Schema.Types.ObjectId,
        ref: "Employer",
        required: true,
    },
    jobID: {
        type: Schema.Types.ObjectId,
        ref: "jobs",
        required: true,
    },
    oldCategory: {
        type: String,
        required: true
    },
    newCategory: {
        type: String,
        required: true
    },
    paymentAmount: {
        type: String
    },
    paymentMethod: {

        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,

    },
    paymentScreenshot: {
        type: String,
        required: true
    },
    isActive: {
        type: String,
        default: true
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    success: {
        type: String,
        default: false
    }
})
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
