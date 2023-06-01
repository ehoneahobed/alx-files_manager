#!/usr/bin/node

const express = require("express");
const router = require("./routes/index");

const server = express();
const PORT = process.env.PORT ? process.env.PORT : 5000;

server.use(express.json());
server.use(router);

server.listen(PORT, () =>
  console.log(`The server is running on port: ${PORT}`)
);
