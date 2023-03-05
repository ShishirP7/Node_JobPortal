const seekerModel = require("../models/SeekerModels/jobSeeker_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SERCRET_KEY = "JOBPortal";
const { response } = require("express");
const job_Models = require("../models/job_Models");
const JobApplicant = require("../models/JobApplicant");
const { signupSuccessEmail } = require("../services/mailerService");
const tokenSchema = require("../models/tokenSchema");
const { sendMail } = require("../config/nodemailer/mailer");
const Employer = require("../models/employer_Model");

const signUp = async (req, res) => {
  const { name, email, password, phoneNumber, role } = req.body;

  try {

    const hasedPassword = await bcrypt.hash(password, 10);
    const createdUser = await seekerModel.create({
      name: name,
      email: email,
      password: hasedPassword,
      phoneNumber: phoneNumber,
      role: role
    });


    signupSuccessEmail(createdUser, message = `Hello ${createdUser.name}, Your account has been created successfully. We are thrilled to have you as a part of our team. Thank you for choosing us, and we look forward to providing you with the best experience possible. If you have any questions or concerns, don't hesitate to reach out to our support team. Once again, welcome aboard! `)
    res.status(201).json({ data: createdUser, success: true });



  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

// const login = async (req, res) => {
//   const { email, password, role } = req.body;
//   try {
//     const existingUser = await seekerModel.findOne({ email: email });
//     if (!existingUser) {
//       return res.json({ message: "User Not Found !!" });
//     }
//     const authorizedUser = await bcrypt.compare(
//       password,
//       existingUser.password
//     );
//     if (!authorizedUser) {
//       return res.json({ message: "Credentials Not Valid " });
//     }

//     const token = jwt.sign(
//       { email: existingUser.email, id: existingUser._id },
//       SERCRET_KEY
//     );
//     res.status(201).json({ data: existingUser, token: token, success: true });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: error.message });
//   }
// };
const reset = async (req, res) => {
  const { email, password, newpassword } = req.body;

  try {
    const existingUser = await seekerModel.findOne({ email: email });
    const authorizedUser = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (authorizedUser && existingUser) {
      const hasedPassword = await bcrypt.hash(newpassword, 10);
      await seekerModel.findOneAndUpdate(
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
        message: "Provided Password Is Incorrect",
      });
    }
    if (!existingUser) {
      return res.json({
        message: "Email not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
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
    res.send({ data: user, message: "helo" })
    // const { userId, token } = req.query

    // const User = await seekerModel.findById(userId);
    // res.send(User)


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
  const { user_id, job_id, cover_letter, about, resume } = req.body
  try {
    const UserExists = await seekerModel.findById(user_id)
    const JobExists = await job_Models.findById(job_id)
    if (UserExists && JobExists) {
      const newApplicant = await JobApplicant.create({
        job_id: job_id,
        user_id: user_id,
        cover_letter: cover_letter,
        about: about,
        resume: resume
      });
      res.json({ message: "Application Successful", success: true, data: newApplicant })
    }
    if (!UserExists) {
      res.json({ message: "USER NOT EXISTS" })
    }
    if (!JobExists) {
      res.json({ message: "JOB DOESNT EXISTS" })
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
module.exports = { reset, setupProfile, resetLink, editProfile, apply, resetPassword };
