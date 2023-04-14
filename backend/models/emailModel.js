const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    // max:,
    // require: [true, "email must have message"]
  },
  attachFiles: [
    {
      name: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Email", emailSchema);
