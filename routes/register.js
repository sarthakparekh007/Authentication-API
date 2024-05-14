const express = require('express');
const router = express.Router();
const user = require('../model/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 5;

router.post('/',Middlewares.validations("register"), async function(req,res,next){
    try {
      const isEmailExist = await user.findOne({email:req.body.email.toLowerCase()});
        if(isEmailExist){
          return res.sendDuplicate("Email already registered");
        }
        const phoneNumber = await user.findOne({phone:req.body.phone}); 
        if(phoneNumber){
          return res.sendDuplicate("Phone number already registered");
        }
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        const response = await user.create({
            email : req.body.email.toLowerCase(),
            password : req.body.password,
            name:req.body.name,
            phone:req.body.phone
        });
        res.sendSuccess(response, "Sign up successfully");
    }
    catch(error){
        return res.sendError(error);
    }
  });

  module.exports = router;
