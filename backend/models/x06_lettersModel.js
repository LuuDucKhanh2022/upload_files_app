const { Int32 } = require("mongodb");
const mongoose = require("mongoose");;
const x06_lettersSchema = new mongoose.Schema({
    stage: {
        type: String
    },
    status: {
        type: Number
    },
    createdAt : {
        type: Date
    }
})

module.exports = mongoose.model("X06_letters", x06_lettersSchema);
