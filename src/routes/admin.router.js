const express = require("express");
const {
  signUp,
  login,
  reset,
  deleteEmployer,
  approveJob,
} = require("../controllers/adminController");
const adminRouter = express.Router();

adminRouter.post("/signUp", signUp);
adminRouter.post("/login", login);
adminRouter.post("/reset", reset);
adminRouter.post("/deleteEmployer", deleteEmployer);
adminRouter.post("/approveJob", approveJob);

module.exports = adminRouter;
