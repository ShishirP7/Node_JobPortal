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
  resume: {
    type: String,
    required: true,
  },

  about: {
    type: String,
    required: true,

  },
  isSelected: {
    type: Boolean,
    default: false,
  }
});

module.exports = Applicant = mongoose.model("applicant", ApplicantSchema);
