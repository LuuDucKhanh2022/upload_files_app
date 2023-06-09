// Calling the "mongoose" package
const mongoose = require("mongoose");

// Creating a Schema for uploaded files
const fileSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: [true, "Uploaded file must have a name"],
  },
});
const File = mongoose.model("File", fileSchema);
// Exporting the Model to use it in app.js File.
module.exports = File;
