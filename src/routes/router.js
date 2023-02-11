const express = require("express");
const router = express.Router();
const admin = require("./admin.router");
const jobseekers = require("./jobseekers.router");
const employer = require("./employer.router");
const jobs = require("./jobs.router");

router.all("/", (req, res) => {
  res.send(" Hello !!");
});
// router.use("/jobs", jobs);
router.use("/admin", admin);
router.use("/jobseeker", jobseekers);
router.use("/employer", employer);
router.use("/job", jobs);

module.exports = router;
