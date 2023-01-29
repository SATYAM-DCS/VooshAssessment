const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const db = require("./config/mongoose");
const config = require("config");
const bodyParser = require("body-parser");
require("dotenv").config();
//require passport and JWT Strategy for auth
const passport = require("passport");
//use of JWT token
const passportJWT = require("./config/passport_jwt_strategy");

app.use(cors());
//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/json" }));

app.use(passport.initialize());

app.use("/", require("./routes/index"));
//use express router
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
