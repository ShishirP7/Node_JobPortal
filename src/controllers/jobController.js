const jobModel = require("../models/job_Models");
const SERCRET_KEY = "JOBPortal";
const jwt = require("jsonwebtoken");
const employerModel = require("../models/employer_Model");
const jobSeekerModel = require("../models/SeekerModels/jobSeeker_Model");
const SavedJobs = require("../models/savedJob_Model");
const JobApplicant = require("../models/JobApplicant");
const job_Models = require("../models/job_Models");
const { find } = require("../models/savedJob_Model");
const Payment = require("../models/payment_Modal");

const getApprovedJobs = async (req, res) => {
  const Joblists = await jobModel.find({ isApproved: true }).populate('employerID');
  res.json({ data: Joblists, success: true });
};
const getPostedJobs = async (req, res) => {
  const Joblists = await jobModel.find({ isApproved: false }).populate('employerID');
  res.json({ data: Joblists, success: true });
};
const getAllJobs = async (req, res) => {
  const Joblists = await jobModel.find({}).populate('employerID')
  res.json({ data: Joblists, success: true })
}

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
const getAppliedJobs = async (req, res) => {
  // const JOBS = await SavedJobs.find({}).populate('job_id').populate('seeker_id' ,'name');

  try {
    const id = req.query.id;
    const appliedJobs = await JobApplicant.find({ seeker_id: id }).populate('job_id')
    res.json({ data: appliedJobs, success: true })

  } catch (error) {
    res.json({ error: error.message, success: false })
  }


};


const getJobsbyKeywords = async (req, res) => {
  const keyword = req.query.key;

  try {
    const filteredData = await jobModel.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
      ]
    });

    res.json({ data: filteredData, message: "Keyword Filter", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error filtering jobs", success: false });
  }
};

const getfilteredData = async (req, res) => {
  const category = req.query.category || 0;
  const jobType = req.query.jobType || 0;
  const salary = req.query.minSalary || 0;

  try {
    const filters = {};
    if (category !== 0) {
      filters.category = category;
    }
    if (jobType !== 0) {
      filters.jobType = jobType;
    }
    filters.salary = { $gte: salary, $lte: salary + 5000 };
    console.log('Filters:', filters);

    const jobs = await jobModel.find(filters);

    res.json({ data: jobs, message: 'Jobs filtered successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



const requestCategoryChange = async (req, res) => {
  try {
    const { job_id, employer_id, newCategory, oldCategory, method, accountNumber, screenshot } = req.body
    const flaggedJob = await job_Models.findOne({ employerID: employer_id, _id: job_id });
    if (flaggedJob) {
      const alreadyRequested = await Payment.findOne({ jobID: job_id, isActive: true })
      if (alreadyRequested) {
        res.json({ message: "Request already in process", success: true })
      } else {
        const changeRequest = await Payment.create({
          employerID: employer_id,
          jobID: job_id,
          oldCategory: oldCategory,
          newCategory: newCategory,
          paymentMethod: method,
          accountNumber: accountNumber,
          paymentScreenshot: screenshot,
        });
        res.json({ message: "request sent", success: true })
      }

    } else {
      res.json({ message: "job not found ", success: false })
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

const getCategoryRequest = async (req, res) => {
  try {
    const flaggedJob = await Payment.find({ isActive: true })
      .populate({ path: 'jobID', select: 'category title' })
      .populate({ path: 'employerID', select: 'name userPhoto  companyPhoto' });

    res.json({ data: flaggedJob, message: "category change Request", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getCategoryHistory = async (req, res) => {
  try {
    const flaggedJob = await Payment.find({ isActive: false })
      .populate({ path: 'jobID', select: 'category title' })
      .populate({ path: 'employerID', select: 'name userPhoto  companyPhoto' });

    res.json({ data: flaggedJob, message: "category change Request", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const approveCategoryChange = async (req, res) => {
  try {
    const { job_id, employer_id } = req.body
    const flaggedJob = await Payment.findOneAndUpdate({ employerID: employer_id, jobID: job_id }, { isActive: false, success: true })
    if (flaggedJob) {
      const categoryUpdate = await jobModel.findOneAndUpdate({ _id: flaggedJob.jobID }, { category: flaggedJob.newCategory })

      res.json({ message: "Updated Successfully", success: true })
    } else {
      res.json({ message: "Internal Error ", success: false })
    }

  } catch (error) {
    res.json({ message: error.message, success: false })

  }
}
const rejectCategoryChange = async (req, res) => {
  try {
    const { job_id, employer_id } = req.body
    const flaggedJob = await Payment.findOneAndUpdate({ employerID: employer_id, jobID: job_id }, { isActive: false, success: false })
    if (flaggedJob) {

      res.json({ message: "Request Rejected", success: true })
    } else {
      res.json({ message: "Internal Error ", success: false })
    }

  } catch (error) {
    res.json({ message: error.message, success: false })

  }
}

module.exports = {
  getApprovedJobs,
  getPostedJobs,
  addJob,
  getAllJobs,
  getjobsByID,
  removeJob,
  jobBookmarks,
  getSavedJobs,
  getJobDetailsbyID,
  editJob,
  getAppliedJobs,
  getJobsbyKeywords,
  getfilteredData,
  requestCategoryChange,
  approveCategoryChange,
  getCategoryRequest,
  getCategoryHistory,
  rejectCategoryChange
};