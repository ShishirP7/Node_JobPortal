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
const mongoose = require('mongoose');


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
      skillsRequired,
      Experience,
      responsibility,
      qualifications,
      benifits,
      contactEmail,
      jobTiming,
      vacancy,
      jobPhoto
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
        vacancy: vacancy,

        jobPhoto: jobPhoto
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
    skillsRequired,
    Experience,
    responsibility,
    qualifications,
    benifits,
    contactEmail,
    jobTiming,
    vacancy,
    jobPhoto

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
        vacancy: vacancy,
        jobPhoto: jobPhoto
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

const getCompanynLocation = async (req, res) => {
  try {
    const companies = await Job.distinct("company");
    const locations = await Job.distinct("location");
    const companiesFormatted = companies.map((company) => ({
      name: company,
      value: company,
    }));
    const locationsFormatted = locations.map((location) => ({
      name: location,
      value: location,
    }));
    const data = { companies: companiesFormatted, locations: locationsFormatted };
    res.json({ data, message: "Companies and locations data", success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

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
  try {
    const { category, company, jobType, location } = req.body;

    let filter = {};
    if (category) filter.category = category;
    if (company) filter.company = company;
    if (jobType) filter.jobType = jobType;
    if (location) filter.location = location;

    const jobs = await jobModel.find(filter);

    if (jobs.length > 0) {

      res.json({ data: jobs, message: "Filtered jobs data", success: true });
    } else {
      res.json({ data: null, success: false, message: "no Data" })
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
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
    const { paymentID } = req.body
    const flaggedJob = await Payment.findByIdAndUpdate(paymentID, { isActive: false, success: true })
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
    const { paymentID } = req.body
    const flaggedJob = await Payment.findByIdAndUpdate(paymentID, { isActive: false, success: false })
    if (flaggedJob) {
      res.json({ data: flaggedJob, message: "Request Rejected", success: true })
    } else {
      res.json({ message: "Internal Error ", success: false })
    }

  } catch (error) {
    res.json({ message: error.message, success: false })

  }
}


const getRecentApplicants = async (req, res) => {
  const { employerId } = req.params;

  try {
    // Find the job postings of the provided employer ID
    const jobs = await jobModel.find({ employer_id: employerId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: 'No job postings found for the provided employer ID' });
    }

    // Get the IDs of all jobs posted by the employer
    const jobIds = jobs.map((job) => job._id);

    // Find the applicants for the jobs posted by the employer, sort by applied date, and limit to 5
    const applicants = await JobApplicant.find({ job_id: { $in: jobIds } })
      .populate('job_id')
      .sort({ appliedDate: -1 })
      .limit(4);

    // Get the job seeker details for each applicant
    const applicantsWithJobSeeker = await Promise.all(applicants.map(async (applicant) => {
      const jobSeeker = await jobSeekerModel.findOne({ _id: applicant.user_id });
      return { ...applicant.toObject(), jobSeeker };
    }));

    res.status(200).json({ data: applicantsWithJobSeeker, message: "Top 5 applicants", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const getMostAppliedJob = async (req, res) => {
  const { employerId } = req.params;

  try {
    // Find the job postings of the provided employer ID
    const jobs = await jobModel.find({ employer_id: employerId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: 'No job postings found for the provided employer ID' });
    }

    // Get the IDs of all jobs posted by the employer
    const jobIds = jobs.map((job) => job._id);

    // Find the applicants for the jobs posted by the employer, sort by applied date, and limit to 5
    const applicants = await JobApplicant.find({ job_id: { $in: jobIds } })
      .populate('job_id')
      .sort({ appliedDate: -1 });

    // Create a dictionary to store the count of applications for each job posting
    const jobCounts = {};

    // Loop through the applicants and increment the count of applications for each job posting
    applicants.forEach((applicant) => {
      const jobId = applicant.job_id._id.toString();
      if (jobCounts[jobId]) {
        jobCounts[jobId]++;
      } else {
        jobCounts[jobId] = 1;
      }
    });

    // Sort the job postings by the count of applications in descending order and limit to 5
    const sortedJobs = Object.keys(jobCounts).sort((a, b) => jobCounts[b] - jobCounts[a]).slice(0, 5);

    // Get the job details for each job posting
    const jobsWithCounts = await Promise.all(sortedJobs.map(async (jobId) => {
      const job = await jobModel.findOne({ _id: jobId });
      return { ...job.toObject(), count: jobCounts[jobId] };
    }));

    res.status(200).json({ data: jobsWithCounts, message: "Top 5 most applied jobs", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const JobsApplicantCount = async (req, res) => {
  const { employerId } = req.params;

  try {
    // Find the job postings of the provided employer ID
    const jobs = await jobModel.find({ employer_id: employerId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: 'No job postings found for the provided employer ID' });
    }

    // Get the IDs of all jobs posted by the employer
    const jobIds = jobs.map((job) => job._id);

    // Find the applicants for the jobs posted by the employer and group them by job posting ID
    const applicantsByJob = await JobApplicant.aggregate([
      { $match: { job_id: { $in: jobIds } } },
      { $group: { _id: '$job_id', count: { $sum: 1 } } }
    ]);

    // Get the job details for each job posting
    const jobsWithCounts = await Promise.all(applicantsByJob.map(async (applicant) => {
      const job = await jobModel.findOne({ _id: applicant._id });
      return { ...job.toObject(), count: applicant.count };
    }));

    res.status(200).json({ data: jobsWithCounts, message: "Applicant count for each job posting", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


const getEmployerStats = async (req, res) => {
  const { employerId } = req.params;

  try {
    // Get the number of job postings of the provided employer ID
    const jobPostingCount = await jobModel.countDocuments({ employer_id: employerId });

    // Get the number of applicants for the jobs posted by the employer
    const jobs = await jobModel.find({ employer_id: employerId });
    const jobIds = jobs.map((job) => job._id);
    const applicantCount = await JobApplicant.countDocuments({ job_id: { $in: jobIds } });

    // Get the number of saved jobs for the employer
    const savedJobCount = await SavedJobs.countDocuments({ employer_id: employerId });

    res.status(200).json({
      data: {
        jobPostingCount,
        applicantCount,
        savedJobCount
      },
      message: "Employer statistics",
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const getJobCategoryCount = async (req, res) => {
  try {
    const { employerId } = req.params;

    // Group jobs by category and get count of jobs for each category
    const jobCountByCategory = await Job.aggregate([
      {
        $match: {
          employer: employerId,
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Prepare response object with counts for each category
    const response = {
      basic: 0,
      premium: 0,
      hot: 0,
      featured: 0,
    };
    jobCountByCategory.forEach((category) => {
      if (category._id === 0) response.basic = category.count;
      if (category._id === 1) response.premium = category.count;
      if (category._id === 2) response.hot = category.count;
      if (category._id === 3) response.featured = category.count;
    });

    res.json({ data: response, success: true, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}






const getApplicantCountByCategory = async (req, res) => {
  try {
    const { employerId } = req.params;

    // Get the job IDs for the jobs posted by the employer
    const jobs = await jobModel.find({ employer_id: employerId });
    const jobIds = jobs.map((job) => job._id);

    // Group applicants by category and get count of applicants for each category
    const applicantCountByCategory = await JobApplicant.aggregate([
      {
        $match: {
          job_id: { $in: jobIds },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job_id",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $group: {
          _id: "$job.category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Prepare response object with counts for each category
    const response = {
      basic: 0,
      premium: 0,
      hot: 0,
      featured: 0,
    };
    applicantCountByCategory.forEach((category) => {
      if (category._id === 0) response.basic = category.count;
      if (category._id === 1) response.premium = category.count;
      if (category._id === 2) response.hot = category.count;
      if (category._id === 3) response.featured = category.count;
    });

    res.json({ data: response, success: true, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getPricing = async (req, res) => {
  const { employerId } = req.params;

  try {
    // Find the job postings of the provided employer ID
    const jobs = await jobModel.find({ employer_id: employerId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: 'No job postings found for the provided employer ID' });
    }

    let totalAmount = 0;
    let pricing = {};

    // Loop through each job to determine the category and cost
    jobs.forEach(job => {
      const category = job.category;

      // Determine the cost based on the category
      let cost = 0;
      switch (category) {
        case 1:
          cost = 10000;
          break;
        case 2:
          cost = 25000;
          break;
        case 3:
          cost = 15000;
          break;
        default:
          cost = 0;
      }

      // Add the cost to the total and update the pricing object
      totalAmount += cost;
      if (!pricing[category]) {
        pricing[category] = cost;
      } else {
        pricing[category] += cost;
      }
    });

    res.status(200).json({ data: { pricing, totalAmount }, message: 'Pricing information retrieved successfully', success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}





const getJobsbyCategory = async (req, res) => {
  try {


    const category0 = await jobModel.find({ category: 0 });
    const category1 = await jobModel.find({ category: 1 });
    const category2 = await jobModel.find({ category: 2 });
    const category3 = await jobModel.find({ category: 3 });

    res.json({
      data: {
        Basic: category0,
        Hot: category1,
        Premium: category2,
        Featured: category3
      },
      success: true
    });
  } catch (error) {
    console.log(error)
  }
};






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
  rejectCategoryChange,
  getCompanynLocation,
  getRecentApplicants,
  getMostAppliedJob,
  JobsApplicantCount,
  getEmployerStats,
  getJobCategoryCount,
  getApplicantCountByCategory,
  getPricing,
  getJobsbyCategory

};