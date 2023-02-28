const Employer = require("../../models/employer_Model");
const JobSeeker = require("../../models/SeekerModels/jobSeeker_Model");
const bcrypt = require("bcrypt");
const SERCRET_KEY = "JOBPortal";

const jwt = require("jsonwebtoken");
const { signupSuccessEmail } = require("../../services/mailerService");


const signUpController = async (req, res) => {
    const { role } = req.body;
    try {
        switch (role) {
            case "0":
                signUpSeeker(req, res);
                break;
            case "1":
                signUpEmployer(req, res);
                break;
            default:
                res.json({ success: false, data: null, msg: 'Invalid Role' })
        }
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};
const signUpSeeker = async (req, res) => {
    const { name, email, password, phoneNumber, role } = req.body;

    try {
        const existingUser = await JobSeeker.findOne({ email: email });
        if (existingUser) {
            res.json({ message: "User already Exists with this email ", success: false })

        } else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const createdUser = await JobSeeker.create({
                name: name,
                email: email,
                password: hasedPassword,
                phoneNumber: phoneNumber,
                role: role
            });
            signupSuccessEmail(createdUser, message = `Hello ${createdUser.name}, Your account has been created successfully. We are thrilled to have you as a part of our team. Thank you for choosing us, and we look forward to providing you with the best experience possible. If you have any questions or concerns, don't hesitate to reach out to our support team. Once again, welcome aboard! `)
            res.status(201).json({ data: createdUser, success: true });

        }


    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
};
const signUpEmployer = async (req, res) => {
    const { name, email, password, phoneNumber, role } = req.body;
    console.log(role)

    const existingUser = await Employer.findOne({ email: email });

    try {
        if (!existingUser) {
            const hasedPassword = await bcrypt.hash(password, 10);
            const createdUser = await Employer.create({
                name: name,
                email: email,
                password: hasedPassword,
                phoneNumber: phoneNumber,
                verified: false,
                role: role
            });

            signupSuccessEmail(createdUser, message = `Hello ${createdUser.name}, Your account has been created successfully. We are thrilled to have you as a part of our team. Thank you for choosing us, and we look forward to providing you with the best experience possible. If you have any questions or concerns, don't hesitate to reach out to our support team. Once again, welcome aboard! `)
            res.json({ success: true, data: createdUser, message: "Account Created Successfully" });
        } else {
            res.json({ message: "User already Exists with this email ", success: false })
        }

    } catch (error) {
        console.log(error);
        res.json({ message: error.message, success: false });
    }
};

module.exports = { signUpController }