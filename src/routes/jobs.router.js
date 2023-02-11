const {
  getApprovedJobs,
  getjobsByID,
  getPostedJobs,
  jobBookmarks,
  getAllSavedJobs,
} = require("../controllers/jobController");
const express = require("express");
const jobsRouter = express.Router();

jobsRouter.get("/getApprovedJobs", getApprovedJobs);
jobsRouter.get("/getPostedJobs", getPostedJobs);
jobsRouter.get("/getjobsByID", getjobsByID);
jobsRouter.post("/bookmark", jobBookmarks);
jobsRouter.get("/getAllSavedJobs", getAllSavedJobs);

module.exports = jobsRouter;
