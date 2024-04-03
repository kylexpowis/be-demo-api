const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const {
  getPairsSummary,
  showNewPairs,
  getPairsByCoinId,
  getNewCoins,
  getCoinByCoinId,
  getROCMarketCap,
  getVolumeROC,
} = require("./controllers");

app.get("/api/pairs/summary", getPairsSummary);
app.get("/api/pairs/new", showNewPairs);
app.get("/api/coins/new", getNewCoins);
app.get("/api/coins/:coin_id", getCoinByCoinId);
app.get("/api/pairs/:coin_id", getPairsByCoinId);
app.get("/api/rankings/marketcap", getROCMarketCap);
app.get("/api/rankings/volumeroc", getVolumeROC);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.get("/api/healthcheck", (req, res) => {
  res.status(200).send({ status: "ok" });
});

app.use((err, req, res) => {
  console.log(err, "<-- error in app.js");
  const status = err.status || 500;
  const message = err.msg || "Internal Server Error";
  res.status(status).send({ msg: message });
});

module.exports = app;
