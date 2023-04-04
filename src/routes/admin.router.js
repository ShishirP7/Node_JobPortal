const express = require("express");
const {
  signUp,
  login,
  reset,
  deleteEmployer,
  approveJob,
  approveEmployer,
  getAllEmployers,
  getNonVerifiedEmployers,
  getVerifiedEmployers,
  passwordReset
} = require("../controllers/adminController");
const adminRouter = express.Router();


adminRouter.get("/getAllEmployers", getAllEmployers),
  adminRouter.get("/getVerifiedEmployers", getVerifiedEmployers),
  adminRouter.get("/getNonVerifiedEmployers", getNonVerifiedEmployers),
  adminRouter.post("/deleteEmployer", deleteEmployer);
adminRouter.post("/approveJob", approveJob);
adminRouter.post("/approveEmployer", approveEmployer);
adminRouter.post("/reset", passwordReset);


module.exports = adminRouter;

