const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name cannot be less than 3 characters"],
    maxLength: [50, "Name cannot exceed 50 characters"],
    required: [true, "Seeker Name is Required"],
  },
  about: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: [true, "The email cannot be duplicate"],
  },
  title: {
    type: String,

    default: ""
  },
  experienceYear: {
    type: String,
    default: 0
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    required: [true, 'Specify a user role']
  },
  token: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  resume: {
    type: String,
    default: ""
  },

  phoneNumber: {
    type: String,
    // match: [/^(\d{7})|(\d{10})$/, "Please provide a valid contact number"],
    // required: [true, "Phone Number is Required"],
    // unique: [true, "Phone number must be unique"],
    unique: [false]

  },
  address: {
    type: String,
    default: ""


  },
  profileimg: {
    type: String,
    default: ""

  },

  date: {
    type: Date,
    default: Date.now
  },
  interests: {
    type: Array,
    of: {
      interest: String
    }
  },
  education: {
    type: Array,
    of: {
      degree: String,
      institute: String
    }
  },
  skills: {
    type: Array,
    of: new mongoose.Schema({
      skill: { type: String },
    }, { _id: false }),
  },
  trainings: {
    type: Array,
    of: {
      trainingTitle: String,
      organization: String
    }
  },
  social: {
    websiteLink: {
      type: String,
      default: ""
    },
    facebook: {
      type: String,
      default: ""
    },
    insta: {
      type: String,
      default: ""
    },
    linkedin: {
      type: String,
      default: ""
    },
    github: {
      type: String,
      default: ""
    }

  },
  experience: {
    type: Array,
    of: {
      experienceTitle: String,
      experienceOrganization: String
    }
  }
});

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
module.exports = JobSeeker;
