const express = require("express");
const app = express();
const cors = require("cors");
const moment = require("moment");
const bodyParser = require("body-parser");
const lettersRoutes = require("./routes/x06_lettersRoutes");
const fileRoutes = require("./routes/fileRoutes");
const internRoutes = require("./routes/internRoutes");
const fetchApiUsingRedis = require("./util/fetchApiUsingRedis");
require("dotenv").config();
var path = require("path");
const connectDatabase = require("./config/db");
const corsOptions = require("./config/cors");

const { enableRedisClient, redisClient } = require("./config/redis");
const X06_letters = require("./models/x06_lettersModel");
global.__basedir = __dirname;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "public")));

connectDatabase();

//Redis
// Initiate and connect to the Redis client
// enableRedisClient();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES
app.use("/assets", express.static(path.join(__dirname, "/public/assets")));
app.use("/moment", (req, res) => {
  function getTime(startDate = '01/01/2023', endDate = '30/04/2023', type = 'month') {
    startDate = moment(startDate, 'DD/MM/YYYY');
    
    endDate = moment(endDate, 'DD/MM/YYYY');
    console.log(startDate);
    console.log(endDate);
    let startOfPeriod = startDate
    let result = [];

    while(startOfPeriod.isBefore(endDate)) {
      let newStartOfPeriod = moment(startOfPeriod).add(1, type).startOf(type);
      let currentNo = startOfPeriod.get(type);
      result.push({
        time: currentNo,
        startDate: startOfPeriod.format('DD/MM/YYYY'),
        endDate: startOfPeriod.endOf(type).format('DD/MM/YYYY'),
      })
      startOfPeriod = newStartOfPeriod;
    }
    return result;
  }

  const result = getTime(req.query.startDate, req.query.endDate, req.query.type);
  // const result = moment("2023-2").startOf("month").format("DD-MM-YYYY");
  res.status(200).json({
    result
  });


})
app.use("/report", lettersRoutes);
app.use("/api/v2/files", fileRoutes);
app.use("/api/v2/interns", internRoutes);
app.get("/files", async (req, res) => {
  res.send(
    await fetchApiUsingRedis(
      redisClient,
      "FILES",
      `http://localhost:3000/api/v2/products`
    )
  );
});
app.get("/interns", async (req, res) => {
  res.send(
    await fetchApiUsingRedis(
      redisClient,
      "INTERN",
      // `http://localhost:3000/api/v2/interns`,
      `http://localhost:3000/api/v2/products`
    )
  );
});

app.get("*", (req, res) => {
  res.send("nothing found");
});
var port = process.env.PORT || "3000";

app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening on port", port);
});
