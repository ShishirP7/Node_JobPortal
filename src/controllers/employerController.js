const employerModel = require("../models/employer_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { create } = require("../models/employer_Model");
const job_Models = require("../models/job_Models");
const SERCRET_KEY = "JOBPortal";

const signUp = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  const existingUser = await employerModel.findOne({ email: email });

  console.log(req.body);
  try {
    if (!existingUser) {
      const hasedPassword = await bcrypt.hash(password, 10);
      const createdUser = await employerModel.create({
        name: name,
        email: email,
        password: hasedPassword,
        phoneNumber: phoneNumber,
        verified: false
      });
      const token = jwt.sign(
        { email: createdUser.email, id: createdUser._id },
        SERCRET_KEY
      );
      res.status(201).json({ success: true, data: createdUser, token: token });
    } else {
      res.json({ message: "User already Exists with this email " })
    }

  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await employerModel.findOne({ email: email });
    if (!existingUser) {
      return res.json({ message: "User Not Found !!" });
    }
    const authorizedUser = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!authorizedUser) {
      return res.json({ message: "Credentials Not Valid " });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SERCRET_KEY
    );
    res.status(201).json({ success: true, data: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

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

const changeJobType = async (req, res) => {
  try {
    const { job_id, employer_id, category } = req.body

    const flaggedJob = await job_Models.findByIdAndUpdate({ employerID: employer_id, _id: job_id });

    if (flaggedJob) {
      await job_Models.findByIdAndUpdate(flaggedJob._id, {
        category: category
      })
      res.json({ data: flaggedJob })
    } if (!flaggedJob) {
      res.json({ message: "Invalid Input", status: false })
    } else {
      res.json({ message: "Job Not FOund" })
    }


  } catch (error) {
    res.json({ message: error.message, status: false })
  }


}
module.exports = { signUp, login, reset, changeJobType };
