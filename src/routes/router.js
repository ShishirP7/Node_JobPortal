const express = require("express");
const router = express.Router();
const admin = require("./admin.router");
const jobseekers = require("./jobseekers.router");
const employer = require("./employer.router");
const jobs = require("./jobs.router");
const { signUpController } = require("../controllers/LoginSignUp/signUpController");
const { loginController } = require("../controllers/LoginSignUp/loginController");

router.all("/", (req, res) => {
  res.send(" Hello !!");
});
// router.use("/jobs", jobs);
router.use("/admin", admin);
router.use("/jobseeker", jobseekers);
router.use("/employer", employer);
router.use("/job", jobs);
router.use("/authentication/login", loginController)
router.use("/authentication/signUp", signUpController)

module.exports = router;
