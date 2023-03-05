const mongoose = require("mongoose");
const { stringify } = require("uuid");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  employerID: {
    type: Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  category: {
    type: Number,
    default: 0 //["normal","hot","premium" ,"featured"]
  },
  title: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    // enum: ["Full-time", "Part-time", "Freelance", "Internship"],
  },
  skillsRequired: [
    {
      type: String,
    },
  ],
  Experience: {
    type: String
  },
  responsibility: {
    type: String
  },
  qualifications: {
    type: String
  },
  benifits: {
    type: String
  },
  contactEmail: {
    type: String
  },
  jobTiming: {
    type: String
  },
  vacancy: {
    type: Number
  },
  date: {
    type: String,
    default: Date.now,
  },

});

module.exports = Job = mongoose.model("jobs", JobSchema);
