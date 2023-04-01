const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApplicantSchema = new Schema({
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "jobs",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "JobSeeker",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },

  isSelected: {
    type: Boolean,
    default: false,
  },
  appliedDate: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = Applicant = mongoose.model("applicant", ApplicantSchema);
