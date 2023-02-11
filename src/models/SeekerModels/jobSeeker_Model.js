const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name cannot be less than 3 characters"],
    maxLength: [50, "Name cannot exceed 50 characters"],
    required: [true, "Seeker Name is Required"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: [true, "The email cannot be duplicate"],
  },
  password: {
    type: String,
    required: true,
  },

  resume: {
    type: String,
  },

  phoneNumber: {
    type: String,
    match: [/^(\d{7})|(\d{10})$/, "Please provide a valid contact number"],
    required: [true, "Phone Number is Required"],
    unique: [true, "Phone number must be unique"],
  },
  address: {
    type: String,
  },
  profileimg: {
    type: String,
  },
  interests: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Interests",
  },
  education: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Education",
  },
  skills: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Skill",
  },
  trainings: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Trainings",
  },
  experience: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Experience",
  },
});

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
module.exports = JobSeeker;
