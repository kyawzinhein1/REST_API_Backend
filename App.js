const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const noteRoute = require("./routes/note");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(noteRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then((_) => {
    app.listen(8000, console.log("Connected to Mongodb"));
  })
  .catch((err) => {
    console.log(err);
  });
