const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const connectDatabase = () => {
  // local database
  const connStr = "mongodb://127.0.0.1:27017/Learn";

  //cloud database
  // const connStr = "mongodb+srv://luuduckhanh:HpH4ZdYVWUa3kToZ@cluster0.kptbwmt.mongodb.net/mernChatApp?retryWrites=true&w=majority";

  mongoose
    .connect(
      connStr,
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
