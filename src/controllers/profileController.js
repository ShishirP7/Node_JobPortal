const Employer = require("../models/employer_Model");
const JobApplicant = require("../models/JobApplicant");
const JobSeeker = require("../models/SeekerModels/jobSeeker_Model");


const profileController = async (req, res) => {
  const { role } = req.body;
  try {
    switch (role) {
      case "0":
        getSeekerProfile(req, res);
        break;
      case "1":
        getEmployerProfile(req, res)
        break;
      default:
        res.json({ success: false, data: null, message: "Role invalid" })


    }

  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
}


const getSeekerProfile = async (req, res) => {
  try {
    const { id } = req.body
    const existingUser = await JobSeeker.findById(id)
    if (!existingUser) {
      res.json({ success: false, data: null, message: "User id is not valid" })
    } else {
      res.json({ data: existingUser, success: true, message: "Job Seekers Details fetch Successful" })
    }

  } catch (error) {
    console.log(error)
    res.json({ error: error.message })
  }

}


const getEmployerProfile = async (req, res) => {
  try {
    const { role, id } = req.body
    const existingUser = await Employer.findById(id)
    if (!existingUser) {
      res.json({ success: false, data: null, message: "User id is not valid" })
    } else {
      res.json({ data: existingUser, success: true, message: "Employers Details fetch Successful" })

    }

  } catch (error) {
    console.log(error)
    res.json({ error: error.message })
  }

}

const editProfileController = async (req, res) => {
  const { role } = req.body;
  try {
    switch (role) {
      case "0":
        setupSeekerProfile(req, res);
        break;
      case "1":
        setupEmployerProfile(req, res)
        break;
      default:
        res.json({ success: false, data: null, message: "Role invalid" })
    }

  } catch (error) {
    console.log(error);
    res.json({ message: error.message, success: false });
  }
}


const setupSeekerProfile = async (req, res) => {
  const { id } = req.body;
  try {
    const updatedUser = await JobSeeker.findByIdAndUpdate(id, {
      ...req.body
    }, { new: true });
    if (updatedUser) {
      res.json({ data: updatedUser, success: true, message: "User Profile Updated Successfully" });
    } else {
      res.json({ error: "User Not Found", success: false });
    }
  } catch (error) {
    res.json({ error: error.message, success: false });
  }
};



const setupEmployerProfile = async (req, res) => {
  const { id, companyLocation, userPhoto, companyPhoto, companyDescription, companyName, email, name, phoneNumber, website } = req.body
  try {
    const User = await Employer.findById(id)
    if (User) {
      const User = await Employer.findByIdAndUpdate(id, {

        companyLocation: companyLocation,
        companyDescription: companyDescription,
        companyName: companyName,
        email: email,
        name: name,
        phoneNumber: phoneNumber,
        website: website,
        userPhoto: userPhoto,
        companyPhoto: companyPhoto
      });
      res.json({ data: User, success: true, message: "Profile successfully updated" })
    } else {
      res.json({ error: "User Not Found ", success: false })
    }
  } catch (error) {
    res.json({ error: error.message, success: false })

  }
}



module.exports = { profileController, editProfileController };
