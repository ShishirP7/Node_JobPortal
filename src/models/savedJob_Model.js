const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedJobsSchema = new mongoose.Schema({
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "jobs",
    required: true,
  },

  seeker_id: {
    type: Schema.Types.ObjectId,
    ref: "JobSeekerInfo",
    required: true,
  },
  // date: {
  //   type: Date,
  //   default: Date.now,
  // },
});
const SavedJobs = mongoose.model("SavedJobs", savedJobsSchema);
module.exports = SavedJobs;
