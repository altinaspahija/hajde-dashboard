const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const socketCon = require("./backend/config/socket");
// const { startCron } = require('./backend/config/cron');

const logger = require("./logger");

require("dotenv").config();

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.catch((err) => {
  logger.error(err, "EXCEPTION IN CONNECTING TO DATABASE");
});

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const app = express();

app.use(cors());
require("./backend/config/passport")(passport);

app.use(express.static(path.join(__dirname, "public")));

app.use(helmet({ 
  contentSecurityPolicy: false
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use("/api", require("./backend/endpoints"));
app.use(express.static(path.join(__dirname, "dist")));

app.get("/images/:file", (req, res) => {
  res.sendFile(
    path.join("/Users/dorronzherka/Desktop/dev/files", `${req.params.file}`)
  );
});

app.get("*", async (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

// startCron();

let appInstance = app.listen(process.env.SERVER_PORT, async () => {
  logger.info("Connected To server");
  logger.info("Connecting to database: " + process.env.CONNECTION_STRING);
  socketCon.initSocket(appInstance);
});
