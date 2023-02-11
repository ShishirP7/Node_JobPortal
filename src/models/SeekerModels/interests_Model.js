const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
  interest: {
    type: String,
    required: true,
  },
});

const Interests = mongoose.model("Interests", interestSchema);

module.exports = Interests;
