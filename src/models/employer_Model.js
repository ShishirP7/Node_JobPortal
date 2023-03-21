const mongoose = require("mongoose");
const UserRoles = require("../utils/enum")
const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name cannot be less than 3 characters"],
    maxLength: [50, "Name cannot exceed 50 characters"],
    required: [true, "Employer Name is Required"],
  },
  verified: {
    type: Boolean,
    default: false,
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
  companyLocation: {
    type: String,
    default: ""

  },
  designation: {
    type: String,
    default: ""
  },
  companyDescription: {
    type: String,
    default: ""

  },
  userPhoto: {
    type: String,
    default: ""
  },
  companyPhoto: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    require: [true, 'Specify a user role']
  },
  companyName: {
    type: String,
    default: ""
  },
  phoneNumber: {
    type: Number,
    match: [/^(\d{7})|(\d{10})$/, "Please provide a valid contact number"],
    required: [true, "Phone Number is Required"],
    unique: [true, "Phone number must be unique"],
  },
  address: {
    type: String,
    default: ""

  },
  website: {
    type: String,
    default: ""

  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
