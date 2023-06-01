const express = require("express");
const router = express.Router();

// import controllers
import AppController from "../controllers/AppController";

const route = (app) => {
  app.use("/", router);

  // app controller
  router.get("/status", (req, res) => {
    AppController.getStatus(req, res);
  });

  router.get("/stats", (req, res) => {
    AppController.getStats(req, res);
  });
};

export default route;
