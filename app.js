const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  console.log(err, "<-- error in app.js");
  const status = err.status || 500;
  const message = err.msg || "Internal Server Error";
  res.status(status).send({ msg: message });
});

module.exports = app;
