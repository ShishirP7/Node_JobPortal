const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    match: [/^(\d{7})|(\d{10})$/, "Please provide a valid contact number"],
    required: [true, "Phone Number is Required"],
    unique: [true, "Phone number must be unique"],
  },
  resume: {
    type: String,
    required: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "jobs",
    required: true,
  },
  seekerID: {
    type: Schema.Types.ObjectId,
    ref: "JobSeekerInfo",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Applicant = mongoose.model("applicant", ApplicantSchema);
