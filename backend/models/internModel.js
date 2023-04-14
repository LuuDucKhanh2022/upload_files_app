var mongoose = require("mongoose");
var internSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

module.exports = mongoose.model("Intern", internSchema);
