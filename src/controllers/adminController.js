const adminModel = require("../models/admin_Model");
const jobModel = require("../models/job_Models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employerModel = require("../models/employer_Model")
const SERCRET_KEY = "JOBPortal";

const signUp = async (req, res) => {

  const { name, email, password, phoneNumber } = req.body;
  const existingUser = await adminModel.findOne({ email: email });

  try {
    if (!existingUser) {
      const hasedPassword = await bcrypt.hash(password, 10);
      const createdUser = await adminModel.create({
        name: name,
        email: email,
        password: hasedPassword,
        phoneNumber: phoneNumber,
      });
      const token = jwt.sign(
        { email: createdUser.email, id: createdUser._id },
        SERCRET_KEY
      );
      res.status(201).json({ success: true, data: createdUser, token: token });
    } else {
      res.json({ message: "User already exists with this Email" })
    }

  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await adminModel.findOne({ email: email });
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
    const existingUser = await adminModel.findOne({ email: email });
    const authorizedUser = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (authorizedUser && existingUser) {
      const hasedPassword = await bcrypt.hash(newpassword, 10);
      await adminModel.findOneAndUpdate(
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

const deleteEmployer = async (req, res) => {
  const employer_id = req.query.id;
  const employer = await employerModel.findByIdAndDelete(employer_id)

  try {
    if (employer) {
      res.json({ message: "Employer Removed", status: true, data: employer })

    }
    else {
      res.json({ message: "Employer Not found ", status: false })
    }

  } catch (error) {
    res.json({ message: error.message })
  }

};

const approveEmployer = async (req, res) => {
  try {
    const employer_id = req.query.id;

    const flaggedEmployer = await employerModel.findById(employer_id)
    if (flaggedEmployer) {

      await employerModel.findByIdAndUpdate(employer_id, {
        verified: true
      })
      res.json({ message: "Employer has been Verified Successfully", data: flaggedEmployer })

    } else {
      res.json({ message: "No employer found with this id ", status: false })

    }


  } catch (error) {
    console.log(error)
    res.json({ message: error.message })

  }
}

const approveJob = async (req, res) => {
  try {
    const job_id = req.query.id;

    const flaggedJob = await jobModel.findById(job_id);
    if (flaggedJob) {
      await jobModel.findByIdAndUpdate(job_id, {
        $set: {
          isApproved: true,
        },
      });
      res.json({
        success: true,
        message: "Updated Succeessfully",
        data: flaggedJob,
      });
    } else {
      res.json({ message: "Job ID was not found ", status: false })
    }

  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = { signUp, login, reset, deleteEmployer, approveJob, approveEmployer };
