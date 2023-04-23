const express = require("express");
const app = express();
const cors = require("cors");
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
app.use("/report", lettersRoutes );
app.use("/api/v2/files", fileRoutes);
app.use("/api/v2/interns", internRoutes);
app.get("/files", async (req, res) => {
  res.send(
    await fetchApiUsingRedis(
      redisClient,
      "FILES",
      `http://localhost:4000/api/v2/products`
    )
  );
});
app.get("/interns", async (req, res) => {
  res.send(
    await fetchApiUsingRedis(
      redisClient,
      "INTERN",
      // `http://localhost:3000/api/v2/interns`,
      `http://localhost:4000/api/v2/products`
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
