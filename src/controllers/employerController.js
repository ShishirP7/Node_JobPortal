const employerModel = require("../models/employer_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { create } = require("../models/employer_Model");
const job_Models = require("../models/job_Models");
const { signupSuccessEmail } = require("../services/mailerService");
const { getUserModel } = require("../utils/getuserModel");
const JobApplicant = require("../models/JobApplicant");
const JobSeeker = require("../models/SeekerModels/jobSeeker_Model");
const SERCRET_KEY = "JOBPortal";


const reset = async (req, res) => {
  const { email, password, newpassword } = req.body;

  try {
    const existingUser = await employerModel.findOne({ email: email });
    const authorizedUser = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (authorizedUser && existingUser) {
      const hasedPassword = await bcrypt.hash(newpassword, 10);
      await employerModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hasedPassword,
          },
        }
      );
      res.json({ success: true, message: "Updated Succeessfully" });
    }
    if (!authorizedUser) {
      return res.json({
        message: "Provided Password Is Incorrect", success: false
      });
    }
    if (!existingUser) {
      return res.json({
        message: "Email not found", success: false
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, success: false });
  }
}; const getApplicantByID = async (req, res) => {
  try {
    const jobID = req.query.id;
    const jobApplicants = await JobApplicant.find({
      $and: [
        { job_id: jobID },
        {
          $or: [
            { isSelected: { $exists: false } },
            { isSelected: false }
          ]
        }
      ]
    });
    if (jobApplicants && jobApplicants.length > 0) {
      const applicantDetails = await Promise.all(jobApplicants.map(async (applicant) => {
        const jobSeekerDetail = await JobSeeker.findOne({ _id: applicant.user_id });
        if (jobSeekerDetail) {
          return { ...applicant.toObject(), seekerDetail: jobSeekerDetail.toObject() };
        } else {
          return { ...applicant.toObject(), seekerDetail: null };
        }
      }));
      res.json({ data: applicantDetails, message: "Applicant details by job ID", success: true });
    } else {
      res.json({ message: "No job applicants found by this job ID", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// const acceptApplicant = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const existingApplicant = await JobApplicant.findOneAndUpdate({ _id: id }, { isSelected: true });

//     if (existingApplicant) {
//       res.json({ message: "Applicant Accepted", success: true });
//     } else {
//       res.status(404).json({ message: "Applicant not found or already accepted", success: false });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error", success: false });
//   }
// };



const acceptApplicant = async (req, res) => {
  const flagged_id = req.query.id;
  try {

    const existingApplicant = await JobApplicant.findOneAndUpdate({ _id: flagged_id }, { isSelected: true })
    if (existingApplicant) {
      res.json({ message: "Applicant Accepted ", success: true })
    } else {
      res.json({ message: "Applicant ID invalid", success: false })
    }

  } catch (error) {
    res.json({ message: error.message, success: false })

  }
}

const rejectApplicant = async (req, res) => {
  const flagged_id = req.query.id;
  try {

    const existingApplicant = await JobApplicant.findByIdAndRemove(flagged_id)
    if (existingApplicant) {
      res.json({ message: "Applicant removed ", success: true })
    } else {
      res.json({ message: "Applicant ID invalid", success: false })
    }
  } catch (error) {
    res.json({ message: error.message, success: false })

  }
}

const changeJobType = async (req, res) => {
  try {
    const { job_id, employer_id, category } = req.body


    const flaggedJob = await job_Models.findOne({ employerID: employer_id, _id: job_id });

    if (flaggedJob) {
      UpdatedJon = await job_Models.findByIdAndUpdate(flaggedJob._id, {
        category: category
      })
      res.json({ data: UpdatedJon, success: true, message: "Job type changed Successfull" })

    } else {
      res.json({ message: "Job Not FOund", success: false })
    }


  } catch (error) {
    res.json({ message: error.message, status: false })
  }


}
module.exports = { reset, changeJobType, getApplicantByID, acceptApplicant, rejectApplicant };
