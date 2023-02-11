const jobModel = require("../models/job_Models");
const SERCRET_KEY = "JOBPortal";
const jwt = require("jsonwebtoken");
const employerModel = require("../models/employer_Model");
const jobSeekerModel = require("../models/SeekerModels/jobSeeker_Model");
const SavedJobs = require("../models/savedJob_Model");

const getApprovedJobs = async (req, res) => {
  const Joblists = await jobModel.find({ isApproved: true });
  res.json({ data: Joblists, success: true });
};
const getPostedJobs = async (req, res) => {
  const Joblists = await jobModel.find({ isApproved: false });
  res.json({ data: Joblists, success: true });
};

const getjobsByID = async (req, res) => {
  try {
    const employerId = req.query.id;
    const vacancies = await jobModel.find({
      employerID: employerId,
      isApproved: true,
    });
    res.json({ data: vacancies, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};
const removeJob = async (req, res) => {
  try {
    const flagged_id = req.query.id;
    const flaggedJob = await jobModel.findByIdAndRemove(flagged_id);

    res.json({
      data: flaggedJob,
      message: "Job vacancy has been removed successfully! ",
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};
const addJob = async (req, res) => {
  const {
    employerID,
    title,
    company,
    location,
    salary,
    description,
    jobType,
    skillsRequired,
    date,
  } = req.body;

  try {
    const existingUser = await employerModel.findById(employerID);

    if (existingUser) {
      const jobVacancy = await jobModel.create({
        title: title,
        company: company,
        location: location,
        salary: salary,
        description: description,
        jobType: jobType,
        skillsRequired: skillsRequired,
        date: date,
        employerID: employerID,
        isApproved: false,
      });

      // const token = jwt.sign(
      //   { employerID: jobVacancy.employerID, id: jobVacancy._id },
      //   SERCRET_KEY
      // );
      res.json({
        data: jobVacancy,
        success: true,
        message: "Posted Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

const jobBookmarks = async (req, res) => {
  try {
    const { jobid, seekerid } = req.body;
    const DuplicateSavedItem = await SavedJobs.find({
      job_id: jobid,
      seeker_id: seekerid,
    });

    // res.json({ message: DuplicateSavedItem });

    const BookedJob = await SavedJobs.create({
      job_id: jobid,
      seeker_id: seekerid,
    });
    res.json({
      data: BookedJob,
      succes: true,
      message: "Saved ",
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const getAllSavedJobs = async (req, res) => {
  try {
    const SavedJobslist = await SavedJobs.find({});
    res.json({ data: SavedJobslist, success: true });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

module.exports = {
  getApprovedJobs,
  getPostedJobs,
  addJob,
  getjobsByID,
  removeJob,
  jobBookmarks,
  getAllSavedJobs,
};
