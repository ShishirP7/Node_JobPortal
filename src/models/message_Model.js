const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  });

const MessageModal = mongoose.model('Message', chatMessageSchema);

module.exports = MessageModal;