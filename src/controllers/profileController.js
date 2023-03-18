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
        const { role, id } = req.body
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
module.exports = { profileController };
