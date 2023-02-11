const employerModel = require("../models/employer_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { create } = require("../models/employer_Model");
const SERCRET_KEY = "JOBPortal";

const signUp = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  console.log(req.body);
  try {
    const hasedPassword = await bcrypt.hash(password, 10);
    const createdUser = await employerModel.create({
      name: username,
      email: email,
      password: hasedPassword,
      phoneNumber: phoneNumber,
    });
    const token = jwt.sign(
      { email: createdUser.email, id: createdUser._id },
      SERCRET_KEY
    );
    res.status(201).json({ success: true, data: createdUser, token: token });
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
module.exports = { signUp, login, reset };
