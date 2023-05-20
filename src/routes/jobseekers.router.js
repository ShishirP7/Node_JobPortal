const express = require("express");
const { reset, resetPassword, setupProfile, editProfile, apply, resetLink, getJobRecommendation, getRecommendation } = require("../controllers/seekerControllet");
const seekerRouter = express.Router();

seekerRouter.post("/reset", reset);
seekerRouter.post("/setupProfile", setupProfile);
seekerRouter.post("/sendresetLink", resetLink);
seekerRouter.post("/resetPassword", resetPassword);
seekerRouter.post("/editProfile", editProfile);
seekerRouter.post("/apply", apply);
seekerRouter.post("/JobRecommendation",getJobRecommendation);
seekerRouter.post("/getRecommendation",getRecommendation);



module.exports = seekerRouter;
