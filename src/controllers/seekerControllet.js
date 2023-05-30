const seekerModel = require("../models/SeekerModels/jobSeeker_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SERCRET_KEY = "JOBPortal";
const { response } = require("express");
const job_Models = require("../models/job_Models");
const JobApplicant = require("../models/JobApplicant");
const { signupSuccessEmail, resetPasswordEmail } = require("../services/mailerService");
const tokenSchema = require("../models/tokenSchema");
const { sendMail } = require("../config/nodemailer/mailer");
const Employer = require("../models/employer_Model");
const JobSeeker = require("../models/SeekerModels/jobSeeker_Model");


const reset = async (req, res) => {
  const { id, password, newpassword, confirmpassword } = req.body;

  try {
    const existingUser = await seekerModel.findById(id);

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
    await seekerModel.findByIdAndUpdate(id, { password: hashedPassword });

    // Verify the updated password
    const updatedUser = await seekerModel.findById(id);
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



const resetLink = async (req, res) => {
  try {
    const { email } = req.body
    const User = await seekerModel.findOne({ email: email })
    if (!User) {
      console.log("User not found")
      res.send({ error: "User Not found", success: false })
    } else {
      let token = await tokenSchema.findOne({ userId: User._id })
      if (!token) {

        const token = jwt.sign(
          { email: User.email, id: User._id },
          SERCRET_KEY
        );
        const Token = await tokenSchema.create({
          userId: User._id,
          token: token
        });

      }
      const link = `http://localhost:4000/jobseeker/forgetPassword/${User._id}`
      await signupSuccessEmail(User.email, "Password Reset Link", link)
      res.send("Password reset link sent to your email account")

    }
  } catch (error) {
    console.log(error)
    res.send({ message: error.message });
  }

}


const resetPassword = async (req, res) => {
  try {

    const user = await seekerModel.findById(req.query.id);
    res.send({ data: user, message: "resetpassword" })


  } catch (error) {
    console.log(error)
    res.send({ message: error.message, success: false })
  }
}

const editProfile = async (req, res) => {
  const { user_id, name, resume, address, profileimg, interests, education, skills, trainings, experience, social } = req.body
  try {
    const User = await seekerModel.findById(user_id)
    if (User) {
      const User = await seekerModel.findByIdAndUpdate(user_id, {
        name: name,
        resume: resume,
        address: address,
        profileimg: profileimg,
        interests: interests,
        education: education,
        skills: skills,
        trainings: trainings,
        experience: experience,
        social: social
      });
      res.json({ data: User, success: true, message: "updated Successfully" })
    } else {
      res.json({ error: "User Not Found " })
    }
  } catch (error) {
    res.json({ error: error.message })

  }
}

const apply = async (req, res) => {
  const { user_id, job_id } = req.body
  try {
    const UserExists = await seekerModel.findById(user_id)
    const JobExists = await job_Models.findById(job_id)
    if (UserExists && JobExists) {

      const isApplied = await JobApplicant.findOne({ job_id: JobExists._id, user_id: UserExists._id })
      if (!isApplied) {
        const newApplicant = await JobApplicant.create({
          job_id: job_id,
          user_id: user_id,
          // about: about,
          // resume: resume
        });
        res.json({ message: "Application Successful", success: true, data: newApplicant })
      } else {
        res.json({ message: "Already Applied", success: true })
      }

    }
    if (!UserExists) {
      res.json({ message: "USER NOT EXISTS", success: false })
    }
    if (!JobExists) {
      res.json({ message: "JOB DOESNT EXISTS", success: false })
    }
  } catch (error) {
    res.json({ error: error.message, status: false })
  }
}


const setupProfile = async (req, res) => {
  const { user_id, resume, address, profileimg, interests, education, skills, trainings, experience, social } = req.body
  try {
    const User = await seekerModel.findById(user_id)
    if (User) {
      const User = await seekerModel.findByIdAndUpdate(user_id, {
        resume: resume,
        address: address,
        profileimg: profileimg,
        interests: interests,
        education: education,
        skills: skills,
        trainings: trainings,
        experience: experience,
        social: social
      });
      res.json({ data: User, success: true, message: "User Profile Setup Successfully" })
    } else {
      res.json({ error: "User Not Found " })
    }
  } catch (error) {
    res.json({ error: error.message })

  }

}



const getJobRecommendation = async (req, res) => {
  const { seekerId } = req.body

  try {
    // Get the seeker data from the database
    const seeker = await seekerModel.findById(seekerId);
    if (!seeker) {
      return res.status(404).json({ error: 'Seeker not found' });
    }

    // Extract the seeker's experience year value and job title
    const experienceYear = seeker.experienceYear;
    const jobTitle = seeker.title;

    // Construct a regular expression to match any words in the job title
    const regex = new RegExp(jobTitle.split(' ').join('|'), 'i');

    // Get up to 5 recommended jobs from the database based on experience year and job title
    const jobs = await job_Models.find({
      $or: [
        { Experience: experienceYear },
        { title: { $regex: regex } },
      ],
    }).limit(4);

    if (jobs && jobs.length > 0) {
      res.json({ data: jobs, success: true, message: "Job recommendation" });
    } else {
      res.json({ message: "No jobs found", success: false });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRecommendation = async (req, res) => {
  const { seekerId } = req.body;
  try {
    // Find the job seeker by ID
    const seeker = await JobSeeker.findById(seekerId);

    // Get the seeker's skills as an array of strings
    const seekerSkills = seeker.skills.map((skill) => skill.skill.toLowerCase());

    console.log('Seeker skills:', seekerSkills);

    // Find jobs with matching skills and populate job details
    const jobs = await job_Models.find({
      'skillsRequired.skill': { $in: seekerSkills },
    }).populate('_id', 'company email')

    console.log('Matching jobs:', jobs);

    // Map the jobs to include only the job ID and the matching skills
    const recommendedJobs = jobs.map((job) => {
      const matchingSkills = job.skillsRequired
        .filter((skill) => seekerSkills.includes(skill.skill.toLowerCase()))
        .map((skill) => skill.skill);
      return {
        id: job._id,
        matchingSkills,
        jobDetails: {
          title: job.title,
          description: job.description,
          employer: job.employer,
          company: job.company,
          experience: job.Experience
          , jobPhoto: job.jobPhoto
        },
      };
    });
    res.json({
      data: recommendedJobs,
      success: true,
      message: "Recommended Jobs"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};


module.exports = {forgetPassword,sendEmail, reset, setupProfile, resetLink, editProfile, apply, resetPassword, getJobRecommendation, getRecommendation };
