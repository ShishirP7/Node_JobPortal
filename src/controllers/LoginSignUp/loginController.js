const Employer = require("../../models/employer_Model");
const JobSeeker = require("../../models/SeekerModels/jobSeeker_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { toast } = require("react-toastify");
const SERCRET_KEY = "JOBPortal";

const loginController = async (req, res) => {
    const { role } = req.body;
    try {
        switch (role) {
            case "0":
                loginJobSeeker(req, res);
                break;
            case "1":
                loginEmployer(req, res);
                break;
            default:
                res.json({ success: false, data: null, msg: 'Invalid Role' })
        }
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};


const loginJobSeeker = async (req, res) => {

    try {

        const { email, password, role } = req.body
        const existingUser = await JobSeeker.findOne({ email: email });
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
            { email: existingUser.email, id: existingUser._id, role: role },
            SERCRET_KEY
        );
        res.status(201).json({ data: existingUser, token: token, success: true });

    } catch (error) {

        res.json({ error:    error.message, success: false })
    }


}


const loginEmployer = async (req, res) => {
    const { email, password, role } = req.body;

    try {

        const existingUser = await Employer.findOne({ email: email });
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
            { email: existingUser.email, id: existingUser._id, role: role },
            SERCRET_KEY
        );
        res.send({ success: true, data: existingUser, token: token, message: "Login Success" });
    } catch (error) {
        console.log(error);
        res.json({ message: error.message, success: false });
    }
};

module.exports = { loginController };
