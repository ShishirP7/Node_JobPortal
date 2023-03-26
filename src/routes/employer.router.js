const express = require("express");
const { reset, changeJobType, getApplicantByID, acceptApplicant, rejectApplicant, sendEmail, forgetPassword } = require("../controllers/employerController");
const { addJob, removeJob, editJob } = require("../controllers/jobController");
const employerRouter = express.Router();
employerRouter.post("/reset", reset);
employerRouter.post("/sendEmail", sendEmail);
employerRouter.post("/forgetPassword", forgetPassword);
employerRouter.post("/addJob", addJob);
employerRouter.post("/updateJob", editJob);
employerRouter.post("/removeJob", removeJob);
employerRouter.post("/changeType", changeJobType);
employerRouter.get("/getApplicantByID", getApplicantByID);
employerRouter.post("/acceptApplicant", acceptApplicant);
employerRouter.post("/rejectApplicant", rejectApplicant);

module.exports = employerRouter;