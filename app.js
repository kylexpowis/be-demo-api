const express = require("express");
const cors = require("cors");
const { getCoinById } = require("./controllers/coins.controllers");
const { getAllCoins, getPairsByBase } = require("./controllers/coins.controllers");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/v1/coins/:coin_id", getCoinById);
app.get("/api/checkForListings");
app.get("/api");
app.get("/api/coins", getAllCoins);
app.get("/api/coins/:coin_name");
app.get("/api/coins/:coin_id");
app.get("/api/coins_new");
app.get("/api/v1/pairs/:base_id", getPairsByBase);
app.get("/api/pairs");
app.get("/api/pairs/pair_id");
app.get("/api/metrics");
app.get("/api/metrics/coin_id");

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
