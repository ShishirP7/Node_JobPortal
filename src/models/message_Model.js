const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagingSchema = new mongoose.Schema({
  seekerID: {
    type: Schema.Types.ObjectId,
    ref: "JobSeekerInfo",
    required: true,
  },
  employerID: {
    type: Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  message: {
    userID: {
      type: String,
    },
    text: {
      type: String,
      required: true,
    },
  },
});
const Message = mongoose.model("Message", messagingSchema);

module.exports = Message;
