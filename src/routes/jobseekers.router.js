const express = require("express");
const { signUp, login, reset } = require("../controllers/seekerControllet");
const seekerRouter = express.Router();

seekerRouter.post("/signUp", signUp);
seekerRouter.post("/login", login);
seekerRouter.post("/reset", reset);


module.exports = seekerRouter;
