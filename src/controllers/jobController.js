const jobModel = require("../models/job_Models");
const SERCRET_KEY = "JOBPortal";
const jwt = require("jsonwebtoken");
const employerModel = require("../models/employer_Model");
const jobSeekerModel = require("../models/SeekerModels/jobSeeker_Model");
const SavedJobs = require("../models/savedJob_Model");
const JobApplicant = require("../models/JobApplicant");
const job_Models = require("../models/job_Models");
const { find } = require("../models/savedJob_Model");

const getApprovedJobs = async (req, res) => {
  const Joblists = await jobModel.find({ isApproved: true });
  res.json({ data: Joblists, success: true });
};
const getPostedJobs = async (req, res) => {
  const Joblists = await jobModel.find({ isApproved: false });
  res.json({ data: Joblists, success: true });
};

const getJobDetailsbyID = async (req, res) => {
  try {
    const job_id = req.query.id
    const jobDetails = await jobModel.findById(job_id)
    if (jobDetails) {
      res.json({ success: true, message: "Fetching Job details with Job ID successful", data: jobDetails })

    } else {
      res.json({ message: "NO job found with this id ", success: false })
    }

  } catch (error) {

  }
}

const getjobsByID = async (req, res) => {
  try {
    const employerId = req.query.id;
    const vacancies = await jobModel.find({
      employerID: employerId,

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
    if (flaggedJob) {
      res.json({
        message: "Job vacancy has been removed successfully! ",
        success: true
      });
    } else {
      res.json({
        message: "Job not Found", success: false
      })
    }


  } catch (error) {
    console.log(error);
    res.json({ message: error, success: false });
  }
};
const editJob = async (req, res) => {
  try {
    const {
      employerID,
      _id,
      title,
      company,
      location,
      salary,
      description,
      jobType,
      skillsRequired, Experience, responsibility, qualifications, benifits, contactEmail, jobTiming, vacancy
    } = req.body

    const existingUser = await employerModel.findById(employerID);
    const existingJob = await jobModel.findById(_id)
    if (existingUser && existingJob) {

      const jobExists = await jobModel.findByIdAndUpdate(_id, {
        title: title,
        company: company,
        location: location,
        salary: salary,
        description: description,
        jobType: jobType,
        skillsRequired: skillsRequired,
        Experience: Experience,
        responsibility: responsibility,
        qualifications: qualifications,
        benifits: benifits,
        contactEmail: contactEmail,
        jobTiming: jobTiming,
        vacancy: vacancy
      })
      res.json({ data: jobExists, success: true, message: "Job details Updated" })
    } else {
      res.json({ message: "Employer Not Found", success: false })
    }


  } catch (error) {
    console.log(error);
    res.json({ message: error, success: false });
  }
}
const addJob = async (req, res) => {
  const {
    employerID,
    title,
    company,
    location,
    salary,
    description,
    jobType,
    skillsRequired, Experience, responsibility, qualifications, benifits, contactEmail, jobTiming, vacancy

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
        category: 0,
        Experience: Experience,
        responsibility: responsibility,
        qualifications: qualifications,
        benifits: benifits,
        contactEmail: contactEmail,
        jobTiming: jobTiming,
        vacancy: vacancy
      });


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
    console.log(jobid, seekerid)
    const checkJobID = await jobModel.findById(jobid);
    const checkSeekerID = await jobSeekerModel.findById(seekerid);
    console.log(checkSeekerID, "asda")


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
          message: "Removed ",
          succes: true,
          status: false
        });

        // res.json(DuplicateSavedItem);
      } else {
        const BookedJob = await SavedJobs.create({
          job_id: jobid,
          seeker_id: seekerid,
        })
        res.json({
          data: BookedJob,
          succes: true,
          status: true,
          message: "Added to List",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }

};

const getSavedJobs = async (req, res) => {

  // const JOBS = await SavedJobs.find({}).populate('job_id').populate('seeker_id' ,'name');

  try {
    const jobseekerId = req.query.id;
    const savedJobs = await SavedJobs.find({ seeker_id: jobseekerId }).populate('job_id')
    res.json({ data: savedJobs, success: true })

  } catch (error) {
    res.json({ error: error.message, success: false })
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
  getJobDetailsbyID,
  editJob
};
