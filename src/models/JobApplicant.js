const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicantSchema = new Schema({
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
  resume: {
    type: String,
    required: true,
  },
});

module.exports = Applicant = mongoose.model("applicant", ApplicantSchema);
