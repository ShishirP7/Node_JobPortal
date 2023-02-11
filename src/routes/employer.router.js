const express = require("express");
const { signUp, login, reset } = require("../controllers/employerController");
const { addJob, removeJob } = require("../controllers/jobController");
const employerRouter = express.Router();

employerRouter.post("/signUp", signUp);
employerRouter.post("/login", login);
employerRouter.post("/reset", reset);
employerRouter.post("/addJob", addJob);
employerRouter.post("/removeJob", removeJob);

module.exports = employerRouter;
