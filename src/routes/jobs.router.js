const {
  getApprovedJobs,
  getjobsByID,
  getPostedJobs,
  jobBookmarks,
  getAllSavedJobs,
  getSavedJobs,
  getJobDetailsbyID
} = require("../controllers/jobController");
const express = require("express");
const jobsRouter = express.Router();

jobsRouter.get("/getApprovedJobs", getApprovedJobs);
jobsRouter.get("/getPostedJobs", getPostedJobs);
jobsRouter.get("/getjobsByID", getjobsByID);
jobsRouter.post("/bookmark", jobBookmarks); 
jobsRouter.get("/getSavedJobs", getSavedJobs);
jobsRouter.get("/getJobDetailsbyID", getJobDetailsbyID);

module.exports = jobsRouter;
