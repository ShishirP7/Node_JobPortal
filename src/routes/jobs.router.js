const {
  getApprovedJobs,
  getjobsByID,
  getPostedJobs,
  jobBookmarks,
  getAllSavedJobs,
  getSavedJobs,
} = require("../controllers/jobController");
const express = require("express");
const jobsRouter = express.Router();

jobsRouter.get("/getApprovedJobs", getApprovedJobs);
jobsRouter.get("/getPostedJobs", getPostedJobs);
jobsRouter.get("/getjobsByID", getjobsByID);
jobsRouter.post("/bookmark", jobBookmarks);
jobsRouter.get("/getSavedJobs", getSavedJobs);

module.exports = jobsRouter;
