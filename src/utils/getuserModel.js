const admin_Model = require("../models/admin_Model");
const mongoose = require('mongoose');
const Employer = require("../models/employer_Model");
const JobSeeker = require("../models/SeekerModels/jobSeeker_Model");

function getUserModel(role) {
    switch (role) {
        case 0:
            return mongoose.model('JobSeeker', JobSeeker);
        case 1:
            return mongoose.model('Employer', Employer);
        case 2:
            return mongoose.model('admin', admin_Model);

    }
}
module.exports = { getUserModel };
