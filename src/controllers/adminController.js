const adminModel = require("../models/admin_Model");
const jobModel = require("../models/job_Models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employerModel = require("../models/employer_Model");
const { signupSuccessEmail } = require("../services/mailerService");
const SERCRET_KEY = "JOBPortal";

const signUp = async (req, res) => {

  const { name, email, password, phoneNumber, role } = req.body;
  const existingUser = await adminModel.findOne({ email: email });

  try {
    if (!existingUser) {
      const hasedPassword = await bcrypt.hash(password, 10);
      const createdUser = await adminModel.create({
        name: name,
        email: email,
        role: role,
        password: hasedPassword,
        phoneNumber: phoneNumber,
      });

      signupSuccessEmail(createdUser, message = `Hello ${createdUser.name}, Your account has been created successfully. We are thrilled to have you as a part of our team. Thank you for choosing us, and we look forward to providing you with the best experience possible. If you have any questions or concerns, don't hesitate to reach out to our support team. Once again, welcome aboard! `)

      res.json({ success: true, message: "Account  created Successfully" });
    } else {
      res.json({ message: "User already exists with this Email", success: false })
    }

  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existingUser = await adminModel.findOne({ email: email });
    if (!existingUser) {
      return res.json({ message: "User Not Found !!", success: false });
    }
    const authorizedUser = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!authorizedUser) {
      return res.json({ message: "Credentials Not Valid ", success: false });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SERCRET_KEY
    );
    res.json({ success: true, data: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, success: false });
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

const deleteEmployer = async (req, res) => {
  const employer_id = req.query.id;
  const employer = await employerModel.findByIdAndDelete(employer_id)

  try {
    if (employer) {
      res.json({ message: "Employer Removed", success: true, })

    }
    else {
      res.json({ message: "Employer Not found ", success: false })
    }

  } catch (error) {
    res.json({ message: error.message, success: false })
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
      res.json({ message: "employer verified" })

    } else {
      res.json({ message: "No employer found with this id ", success: false })

    }


  } catch (error) {
    console.log(error)
    res.json({ message: error.message, success: false })

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
      res.json({ message: "Job ID was not found ", success: false })
    }

  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

module.exports = { signUp, login, reset, deleteEmployer, approveJob, approveEmployer };
