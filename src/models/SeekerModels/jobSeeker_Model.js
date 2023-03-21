const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name cannot be less than 3 characters"],
    maxLength: [50, "Name cannot exceed 50 characters"],
    required: [true, "Seeker Name is Required"],
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
    required: true,
    default: ""
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: [true, 'Specify a user role']
  },
  token: {
    type: String,
  },

  resume: {
    type: String,
    default: ""
  },

  phoneNumber: {
    type: String,
    match: [/^(\d{7})|(\d{10})$/, "Please provide a valid contact number"],
    required: [true, "Phone Number is Required"],
    unique: [true, "Phone number must be unique"],
  },
  address: {
    type: String,
    default: ""


  },
  profileimg: {
    type: String,
    default: ""

  },
  interests: {
    type: [String]

  },
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldOfStudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  skills: {
    type: [String]
  },
  trainings: [
    {
      title: {
        type: String,
        required: true
      },
      organization: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      certificate: {
        type: String
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    website: {
      type: String,
      default: ""

    },
    twitter: {
      type: String,
      default: ""
    },
    linkedin: {
      type: String,
      default: ""
    },
    facebook: {
      type: String,
      default: ""
    },
    github: {
      type: String,
      default: ""
    },
    instagram: {
      type: String,
      default: ""
    },

  },
  date: {
    type: Date,
    default: Date.now
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
});

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
module.exports = JobSeeker;
