const employerModel = require("../models/employer_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { create } = require("../models/employer_Model");
const job_Models = require("../models/job_Models");
const { signupSuccessEmail } = require("../services/mailerService");
const { getUserModel } = require("../utils/getuserModel");
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
