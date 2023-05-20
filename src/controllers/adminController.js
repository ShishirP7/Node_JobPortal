const adminModel = require("../models/admin_Model");
const jobModel = require("../models/job_Models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employerModel = require("../models/employer_Model");
const { signupSuccessEmail, resetPasswordEmail } = require("../services/mailerService");
const admin_Model = require("../models/admin_Model");
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
const passwordReset = async (req, res) => {
  const { id, password, newpassword, confirmpassword } = req.body;

  try {
    const existingUser = await adminModel.findById(id);

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
    await adminModel.findByIdAndUpdate(id, { password: hashedPassword });

    // Verify the updated password
    const updatedUser = await adminModel.findById(id);
    const isPasswordCorrect = await bcrypt.compare(newpassword, updatedUser.password);

    if (!isPasswordCorrect) {
      return res.json({
        message: "Error: Password update unsuccessful",
        success: false
      });
    }
    resetPasswordEmail(updatedUser.email, subject = `Hello ${updatedUser.name}, Your account has been reset successfully. `)
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


const getAllEmployers = async (req, res) => {
  try {
    const employersList = await employerModel.find({})
    res.json({ data: employersList, message: "All employers Lists", success: true })

  } catch (error) {
    res.json({ message: error.message, success: false })

  }
}
const getVerifiedEmployers = async (req, res) => {
  try {
    const employersList = await employerModel.find({ verified: true })
    res.json({ data: employersList, message: "Verified employers Lists", success: true })

  } catch (error) {
    res.json({ message: error.message, success: false })

  }
}
const getNonVerifiedEmployers = async (req, res) => {
  try {
    const employersList = await employerModel.find({ verified: false })
    res.json({ data: employersList, message: "Pending employers Lists", success: true })

  } catch (error) {
    res.json({ message: error.message, success: false })

  }
}



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
    if (flaggedEmployer && flaggedEmployer?.verified === true) {
      res.json({ message: "This Employer is already verified ", success: true })
    }
    else if (flaggedEmployer && flaggedEmployer?.verified === false) {

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
      if (flaggedJob.isApproved === true) {
        res.json({
          success: true,
          message: "Job is already Approved",
        });
      } else {
        await jobModel.findByIdAndUpdate(job_id, {
          $set: {
            isApproved: true,
          },
        });
        res.json({
          success: true,
          message: "Updated Succeessfully",
        });
      }


    } else {
      res.json({ message: "Job ID was not found ", success: false })
    }

  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};



module.exports = { signUp, login, passwordReset, deleteEmployer, approveJob, approveEmployer, getAllEmployers, getNonVerifiedEmployers, getVerifiedEmployers };
