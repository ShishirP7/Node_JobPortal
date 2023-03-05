const express = require("express");
const { reset, resetPassword, setupProfile, editProfile, apply, resetLink } = require("../controllers/seekerControllet");
const seekerRouter = express.Router();

// seekerRouter.post("/signUp", signUp);
// seekerRouter.post("/login", login);
seekerRouter.post("/reset", reset);
seekerRouter.post("/setupProfile", setupProfile);
seekerRouter.post("/sendresetLink", resetLink);
seekerRouter.post("/resetPassword", resetPassword);
seekerRouter.post("/editProfile", editProfile);
seekerRouter.post("/apply", apply);



module.exports = seekerRouter;
