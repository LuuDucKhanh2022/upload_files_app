const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const connectDatabase = () => {
  mongoose
    .connect(
      "mongodb+srv://luuduckhanh:HpH4ZdYVWUa3kToZ@cluster0.kptbwmt.mongodb.net/mernChatApp?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    )
    .then((data) => {
      console.log(`mongodb is connected with server:${data.connection.host}`);
    });
};

module.exports = connectDatabase;
