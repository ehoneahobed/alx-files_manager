const express = require("express");
const router = express.Router();

// import controllers
const AppController = require("../controllers/AppController");
const UsersController = require("../controllers/UsersController");
const AuthController = require("../controllers/AuthController");
const FilesController = require("../controllers/FilesController");

const route = (app) => {
  app.use("/", router);

  // app controller
  router.get("/status", (req, res) => {
    AppController.getStatus(req, res);
  });

  router.get("/stats", (req, res) => {
    AppController.getStats(req, res);
  });

  //   user controller
  router.post("/users", (req, res) => {
    UsersController.postNew(req, res);
  });

  router.get("/users/me", (req, res) => {
    UsersController.getMe(req, res);
  });

  // Auth controller
  router.get("/connect", (req, res) => {
    AuthController.getConnect(req, res);
  });

  router.get("/disconnect", (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  // files controller
  router.post("/files", (req, res) => {
    FilesController.postUpload(req, res);
  });

  router.get("/files/:id", (req, res) => {
    FilesController.getShow(req, res);
  });

  router.get("/files", (req, res) => {
    FilesController.getIndex(req, res);
  });

  router.put("/files/:id/publish", (req, res) => {
    FilesController.putPublish(req, res);
  });

  router.put("/files/:id/unpublish", (req, res) => {
    FilesController.putUnpublish(req, res);
  });

  router.post("/files/:id/data", (req, res) => {
    FilesController.getFile(req, res);
  });
};

export default route;
