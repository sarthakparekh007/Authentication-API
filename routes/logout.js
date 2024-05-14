const express = require('express');
const router = express.Router();
const user = require('../model/users.js');
// var express = require('express')
const app = express();

router.post("/", async function(req, res, next) {
  try {
    // Check if the logged user is found from the request then remove its detail from the redis
    if (req.loggedUser && req.loggedUser._id) {
      await user.updateOne({_id:req.loggedUser._id},{$set:{token:""}});
    }
    res.sendMessage("Success", "Logout Successfully");
  } catch (err) {
    console.error(`Error while logout the user: ${req.loggedUser._id}`, err);
    return res.sendError(err);
  }
});


module.exports = router;
