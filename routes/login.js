const express = require('express');
const router = express.Router();
const user = require('../model/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

  router.post('/', Middlewares.validations("login"),async function(req,res,next){
    try{
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const users = await user.findOne({"email" : email })
   if(!users){
    // Check if user is not found then return with error
    return res.sendLogin("Invalid username or password", true);
   }
   const result = await bcrypt.compare(password, users.password);
   if(!result){
    return res.sendLogin("Invalid username or password", true);
   }
    if(users.email == email && result == true){
      const params = {
          email : email,
          _id:users._id
      }
      const token =  jwt.sign({
        data: {
            "_id": users._id,
           "email":users.email,
           "role":users.role
        }
    }, config.authTokenKey,{ expiresIn: '1h' }); // , { expires_in: '500s' }
      await user.updateOne({_id:users._id},{$set:{"token":token}})
      const response = {
        token: token
    };
    return res.sendSuccess(response, "Logged in successfully");
    }
    }
    catch(error){
        return res.sendError(error);
    }
   });
   const GOOGLE_CLIENT_ID = "add your client id"; 
    const GOOGLE_CLIENT_SECRET = "add your client secret"; 
    const REDIRECT_URI = 'http://localhost:80/login/auth/google/callback';

    router.get('/auth/google', (req, res) => {
        const url = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid%20email%20profile`;
        res.sendSuccess({},url);
    });


    // Callback route after Google OAuth
router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    try {
      // Exchange code for access token
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      });
  
      // Retrieve user info using access token
      const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      });

      const userDetail = await user.create({
        email:userInfo.data.email,
        name:userInfo.data.name,
        photo:userInfo.data.picture
      }); 
      // Generate JWT token
      const token =  jwt.sign({
        data: {
            "_id": userDetail._id,
           "email":userDetail.email,
           "role":userDetail.role
        }
    }, config.authTokenKey, { expiresIn: '1h' });
      await user.updateOne({_id:userDetail._id },{$set:{token:token}});

      return res.sendSuccess({token:token}, "Logged in successfully using google");
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
