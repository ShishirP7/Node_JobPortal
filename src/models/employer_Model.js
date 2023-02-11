const mongoose = require("mongoose");
const employerSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name cannot be less than 3 characters"],
    maxLength: [50, "Name cannot exceed 50 characters"],
    required: [true, "Employer Name is Required"],
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
  phoneNumber: {
    type: Number,
    match: [/^(\d{7})|(\d{10})$/, "Please provide a valid contact number"],
    required: [true, "Phone Number is Required"],
    unique: [true, "Phone number must be unique"],
  },
  address: {
    type: String,
  },
  website: {
    type: String,
  },
});
const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
