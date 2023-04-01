const {
  getApprovedJobs,
  getjobsByID,
  getPostedJobs,
  jobBookmarks,
  getAllSavedJobs,
  getSavedJobs,
  getJobDetailsbyID,
  getAppliedJobs,
  getAllJobs,
  removeJob,
  getJobsbyKeywords,
  getfilteredData,
  requestCategoryChange,
  approveCategoryChange,
  getCategoryRequest,
  getCategoryHistory,
  rejectCategoryChange
} = require("../controllers/jobController");


const express = require("express");

const jobsRouter = express.Router();
jobsRouter.get("/getApprovedJobs", getApprovedJobs);
jobsRouter.get("/getPostedJobs", getPostedJobs);
jobsRouter.get("/getAllJobs", getAllJobs);
jobsRouter.get("/getjobsByID", getjobsByID);
jobsRouter.post("/bookmark", jobBookmarks);
jobsRouter.post("/removeJob", removeJob);
jobsRouter.get("/getSavedJobs", getSavedJobs);
jobsRouter.get("/getAppliedJobs", getAppliedJobs);
jobsRouter.get("/getJobDetailsbyID", getJobDetailsbyID);
jobsRouter.get("/getJobsbyKeywords", getJobsbyKeywords);
jobsRouter.get("/getfilteredData", getfilteredData);
jobsRouter.post("/requestCategoryChange", requestCategoryChange);
jobsRouter.post("/approveCategoryChange", approveCategoryChange);
jobsRouter.get("/getCategoryRequest", getCategoryRequest);
jobsRouter.get("/getCategoryHistory", getCategoryHistory);
jobsRouter.post("/rejectCategoryChange", rejectCategoryChange);

module.exports = jobsRouter;
