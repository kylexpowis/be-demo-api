const express = require("express");
const cors = require("cors");
const {
  getPairsSummary,
  showNewPairs,
  getPairByCoinId,
} = require("./controllers/pairs.controllers");
const app = express();

app.use(express.json());
app.use(cors());

const {
  getNewCoins,
  getCoinByCoinId,
} = require("./controllers/coins.controllers");

const { getROCMarketCap, getVolumeROC } = require("./controllers/closingMCap.controllers");
/*    FOLLOW THIS!
    - Ensure each endpoint matches the wireframe for that endpoint.
    - Wireframe -> Endpoint -> Pull Request
    - Replace each comment with the endpoint path 
*/
// <---Endpoints for Dashboard (Homepage of app)--->
app.get("/api/pairs/summary", getPairsSummary);

app.get("/api/pairs/new", showNewPairs);

// 3. New Coins Table --> "/api/coins/new"
app.get("/api/coins/new", getNewCoins);
// <---Endpoints for Single Coin View--->
// 1. Coin Summary --> "/api/coins/:coin_id"
app.get("/api/coins/:coin_id", getCoinByCoinId);

app.get("/api/pairs/:coin_id", getPairByCoinId);

// <---Either in Homepage or its own page--->
app.get("/api/rankings/marketcap", getROCMarketCap);

app.get("/api/rankings/volumeroc", getVolumeROC)

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
