const express = require("express");
const {

  deleteEmployer,
  approveJob,
  approveEmployer,
  getAllEmployers,
  getNonVerifiedEmployers,
  getVerifiedEmployers,
  passwordReset
} = require("../controllers/adminController");
const adminRouter = express.Router();

//api for getting alll employer list 
adminRouter.get("/getAllEmployers", getAllEmployers),
  //api for getting all verified Employers

 adminRouter.get("/getVerifiedEmployers", getVerifiedEmployers),
  //api for getting alll non employer list 
  adminRouter.get("/getNonVerifiedEmployers", getNonVerifiedEmployers),
  //api to delete employer
  adminRouter.post("/deleteEmployer", deleteEmployer);
//api to approve jobs

adminRouter.post("/approveJob", approveJob);
//api to approve employer

adminRouter.post("/approveEmployer", approveEmployer);
//api to reset password 

adminRouter.post("/reset", passwordReset);


module.exports = adminRouter;

