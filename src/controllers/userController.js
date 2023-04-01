const JobSeeker = require("../models/SeekerModels/jobSeeker_Model")

const getallusers = async (req, res) => {
    try {
        const users = await JobSeeker.find({ _id: { $ne: req.params.id } }).select([
            "email", "name", "id", "profileImg"
        ])
        return res.json(users)

    } catch (ex) {
        next(ex)

    }

}

module.exports = { getallusers }  