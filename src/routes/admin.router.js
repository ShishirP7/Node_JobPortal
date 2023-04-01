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
  getVerifiedEmployers
} = require("../controllers/adminController");
const adminRouter = express.Router();

// adminRouter.post("/signUp", signUp);
// adminRouter.post("/login", login);
// adminRouter.post("/reset", reset);

adminRouter.get("/getAllEmployers", getAllEmployers),
  adminRouter.get("/getVerifiedEmployers", getVerifiedEmployers),
  adminRouter.get("/getNonVerifiedEmployers", getNonVerifiedEmployers),
  adminRouter.post("/deleteEmployer", deleteEmployer);
adminRouter.post("/approveJob", approveJob);
adminRouter.post("/approveEmployer", approveEmployer);
module.exports = adminRouter;

