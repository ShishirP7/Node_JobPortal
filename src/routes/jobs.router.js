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
  rejectCategoryChange,
  getCompanynLocation,
  getRecentApplicants,
  getMostAppliedJob,
  JobsApplicantCount,
  getEmployerStats,
  getJobCategoryCount,
  getApplicantCountByCategory,
  getPricing,
  getEmployerProfileCompletion,
  getProfilePercent,
  getJobsbyCategory
} = require("../controllers/jobController");


const express = require("express");

const jobsRouter = express.Router();
jobsRouter.get("/getApprovedJobs", getApprovedJobs);
jobsRouter.get("/getPostedJobs", getPostedJobs);
jobsRouter.get("/getAllJobs", getAllJobs);
jobsRouter.get("/getjobsByID", getjobsByID);
jobsRouter.get("/getJobsbyCategory", getJobsbyCategory);
jobsRouter.post("/bookmark", jobBookmarks);
jobsRouter.post("/removeJob", removeJob);
jobsRouter.get("/getSavedJobs", getSavedJobs);
jobsRouter.get("/getAppliedJobs", getAppliedJobs);
jobsRouter.get("/getJobDetailsbyID", getJobDetailsbyID);
jobsRouter.get("/getJobsbyKeywords", getJobsbyKeywords);
jobsRouter.post("/getfilteredData", getfilteredData);
jobsRouter.post("/requestCategoryChange", requestCategoryChange);
jobsRouter.post("/approveCategoryChange", approveCategoryChange);
jobsRouter.get("/getCategoryRequest", getCategoryRequest);
jobsRouter.get("/getCategoryHistory", getCategoryHistory);
jobsRouter.post("/rejectCategoryChange", rejectCategoryChange);
jobsRouter.get("/getCompanynLocation", getCompanynLocation);

//get Recent applicant
jobsRouter.get("/getRecentApplicants", getRecentApplicants);

//get 5 top applied jobs //
jobsRouter.get("/getMostAppliedJob", getMostAppliedJob);
//get 5 top applied jobs //


//get all job application count //
jobsRouter.get("/getJobsApplicantCount", JobsApplicantCount);
//get all job application count //

//get all job application count //
jobsRouter.get("/getEmployerStats", getEmployerStats);
//get all job application count //
jobsRouter.get("/getJobCategoryCount", getJobCategoryCount);
jobsRouter.get("/getApplicantCountByCategory", getApplicantCountByCategory);
jobsRouter.get("/getPricing", getPricing);


module.exports = jobsRouter;
