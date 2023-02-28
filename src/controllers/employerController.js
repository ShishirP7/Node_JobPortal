const employerModel = require("../models/employer_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { create } = require("../models/employer_Model");
const job_Models = require("../models/job_Models");
const { signupSuccessEmail } = require("../services/mailerService");
const { getUserModel } = require("../utils/getuserModel");
const SERCRET_KEY = "JOBPortal";

// const signUp = async (req, res) => {
//   const { name, email, password, phoneNumber, role } = req.body;
//   const existingUser = await employerModel.findOne({ email: email });

//   console.log(req.body);
//   try {
//     if (!existingUser) {
//       const hasedPassword = await bcrypt.hash(password, 10);
//       const createdUser = await employerModel.create({
//         name: name,
//         email: email,
//         password: hasedPassword,
//         phoneNumber: phoneNumber,
//         verified: false,
//         role: role
//       });

//       signupSuccessEmail(createdUser, message = `Hello ${createdUser.name}, Your account has been created successfully. We are thrilled to have you as a part of our team. Thank you for choosing us, and we look forward to providing you with the best experience possible. If you have any questions or concerns, don't hesitate to reach out to our support team. Once again, welcome aboard! `)
//       res.json({ success: true, data: createdUser, message: "Account Created Successfully" });
//     } else {
//       res.json({ message: "User already Exists with this email ", success: false })
//     }

//   } catch (error) {
//     console.log(error);
//     res.json({ message: error.message, success: false });
//   }
// };

// const login = async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     // const userModel = getUserModel(role);
//     // console.log(userModel, "model")

//     const existingUser = await employerModel.findOne({ email: email });
//     if (!existingUser) {
//       return res.json({ message: "User Not Found !!", success: false });
//     }
//     const authorizedUser = await bcrypt.compare(
//       password,
//       existingUser.password
//     );
//     if (!authorizedUser) {
//       return res.json({ message: "Credentials Not Valid ", success: false });
//     }

//     const token = jwt.sign(
//       { email: existingUser.email, id: existingUser._id },
//       SERCRET_KEY
//     );
//     res.send({ success: true, data: existingUser, token: token, message: "Login Success" });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: error.message, success: false });
//   }
// };

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
};

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
module.exports = { reset, changeJobType };
