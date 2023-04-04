const employerModel = require("../models/employer_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { create } = require("../models/employer_Model");
const job_Models = require("../models/job_Models");
const { signupSuccessEmail, resetPasswordEmail } = require("../services/mailerService");
const { getUserModel } = require("../utils/getuserModel");
const JobApplicant = require("../models/JobApplicant");
const JobSeeker = require("../models/SeekerModels/jobSeeker_Model");
const OTP_MODAL = require("../models/Otp_Model");
const SERCRET_KEY = "JOBPortal";


const forgetPassword = async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;

    const data = await OTP_MODAL.findOne({ email: email, code: otp })
    if (!data) {
      return res.json({ message: "Invalid OTP", success: false });
    }

    const currentTime = new Date().getTime();
    if (data.expireIn < currentTime) {
      return res.json({ message: "Token Expired", success: false });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    const user = await employerModel.findOneAndUpdate({ email: email }, { password: hashedPassword })
    if (!user) {
      return res.json({ message: "User not found", success: false });
    }

    return res.json({ message: "Password Reset Successful", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
}

const sendEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await employerModel.findOne({ email: email });
    if (existingUser) {
      const code = Math.floor(Math.random() * 1000000);
      const OTPDatas = new OTP_MODAL({
        email: email,
        code: code,
        expireIn: new Date().getTime() + 300 * 1000
      })
      const OTPResponse = await OTPDatas.save();
      const text = `Your verification code is ${code}. Please enter this code to reset your password.`;
      const mail = {
        from: "sishirpaudel7@gmail.com",
        to: email,
        subject: "Reset Password - Verification Code",
        text: text
      };

      await resetPasswordEmail(email, mail.subject, mail.text);

      res.json({
        success: true,
        message: "Verification code sent successfully"
      });
    }

    else {
      return res.json({
        message: "User not found",
        success: false
      });
    }

  } catch (error) {
    console.error(error);
    res.json({
      message: error.message,
      success: false
    });
  }
};


const reset = async (req, res) => {
  const { id, password, newpassword, confirmpassword } = req.body;

  try {
    const existingUser = await employerModel.findById(id);

    if (!existingUser) {
      return res.json({
        message: "User not found",
        success: false
      });
    }

    const authorizedUser = await bcrypt.compare(password, existingUser.password);

    if (!authorizedUser) {
      return res.json({
        message: "Incorrect password",
        success: false
      });
    }

    if (newpassword !== confirmpassword) {
      return res.json({
        message: "New passwords do not match",
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // Update the password in the database
    await employerModel.findByIdAndUpdate(id, { password: hashedPassword });

    // Verify the updated password
    const updatedUser = await employerModel.findById(id);
    const isPasswordCorrect = await bcrypt.compare(newpassword, updatedUser.password);

    if (!isPasswordCorrect) {
      return res.json({
        message: "Error: Password update unsuccessful",
        success: false
      });
    }
    resetPasswordEmail(updatedUser.email, subject = `Hello ${updatedUser.name}, Your account has been created successfully. We are thrilled to have you as a part of our team. Thank you for choosing us, and we look forward to providing you with the best experience possible. If you have any questions or concerns, don't hesitate to reach out to our support team. Once again, welcome aboard! `)
    res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: error.message,
      success: false
    });
  }
};

const getApplicantByID = async (req, res) => {
  try {
    const jobID = req.query.id;


    const jobApplicants = await JobApplicant.find({ job_id: jobID })

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



const acceptApplicant = async (req, res) => {
  const flagged_id = req.query.id;
  try {

    const existingApplicant = await JobApplicant.findOneAndUpdate({ _id: flagged_id }, { isSelected: true, isActive: false })
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
    const existingApplicant = await JobApplicant.findOneAndUpdate(flagged_id, { isSelected: false, isActive: false })
    console.log(existingApplicant, "applicatn")
    if (existingApplicant) {
      res.json({ message: "Applicant Rejected ", success: true })
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



const getProfilePercent = async (req, res) => {
  const { id } = req.params;
  try {
    const employer = await employerModel.findById(id);

    if (!employer) {
      return res.status(404).json({ msg: 'Employer not found' });
    }

    const count = Object.keys(employerModel.schema.paths)
      .filter(
        (key) =>
          !['_id', '__v', 'date', 'verified', 'role', 'userPhoto', 'companyPhoto'].includes(key)
      )
      .length;

    let completed = 0;

    for (const [key, value] of Object.entries(employer._doc)) {
      if (!['_id', '__v', 'date', 'verified', 'role', 'userPhoto', 'companyPhoto'].includes(key)) {
        if (value && value.trim() !== '') {
          completed++;
        }
      }
    }

    const completion = Math.floor((completed / count) * 100);

    res.json({ completion });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

}
module.exports = { reset, changeJobType, getApplicantByID, acceptApplicant, rejectApplicant, sendEmail, forgetPassword, getProfilePercent };
