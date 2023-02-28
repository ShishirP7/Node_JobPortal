const mongoose = require("mongoose");
const { UserRoles } = require("../utils/enum");
const Schema = mongoose.Schema;

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: [true, "The email cannot be duplicate"],
  },
  role: {
    type: Number,
    require: [true, 'Specify a user role']
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
});

module.exports = Admin = mongoose.model("admin", AdminSchema);
