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
  } = req.body;

  try {
    const existingUser = await employerModel.findById(employerID);



    if (existingUser && existingUser.verified) {
      const jobVacancy = await jobModel.create({
        title: title,
        company: company,
        location: location,
        salary: salary,
        description: description,
        jobType: jobType,
        skillsRequired: skillsRequired,
        employerID: employerID,
        isApproved: false,
        category: 0
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
    } if (!existingUser) {
      res.json({ message: "Not a valid User" })
    }

    if (!existingUser.verified) {
      res.json({ message: "This account is not verified to Add a vacancy" })
    }


  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

const jobBookmarks = async (req, res) => {
  try {
    const { jobid, seekerid } = req.body;
    const checkJobID = await jobModel.findById(jobid);
    const checkSeekerID = await jobSeekerModel.findById(seekerid);
    if (checkJobID && checkSeekerID) {
      const DuplicateSavedItem = await SavedJobs.find({
        job_id: jobid,
        seeker_id: seekerid,
      });
      if (DuplicateSavedItem.length > 0) {
        const removesavedItem = await SavedJobs.findOneAndDelete({
          job_id: jobid,
          seeker_id: seekerid,
        });
        res.json({
          data: removesavedItem,
          message: "Job has been removed successfully from the list",
          succes: true,
        });

        // res.json(DuplicateSavedItem);
      } else {
        const BookedJob = await SavedJobs.create({
          job_id: jobid,
          seeker_id: seekerid,
        });
        res.json({
          data: BookedJob,
          succes: true,
          message: "Bookmark Added to List  ",
        });
      }
    } else {
      if (!checkJobID) {
        res.json({ message: "Job ID is invalid", success: false });
      }
      if (!checkSeekerID) {
        res.json({ message: "Seeker ID is invalid ", success: false });
      }
      if (!checkSeekerID && !checkJobID) {
        res.json({ message: "Invalid User and Invalid Job", success: false });
      } else {
        console.log("errorr");
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const seekerID = req.query.id;
    const existingUser = await jobSeekerModel.findById(seekerID);
    if (existingUser) {
      const savedJobs = await SavedJobs.find({
        seeker_id: seekerID,
      });
      res.json({
        data: savedJobs,
        success: true,
        message: "these are the saved jobs by the user.",
      });
    } else {
      res.json({ message: "This User is not valid " });
    }
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
  getSavedJobs,
};
