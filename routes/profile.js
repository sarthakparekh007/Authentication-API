var express = require('express');
var router = express.Router();
const user = require('../model/users.js');
const bcrypt = require('bcrypt');
const saltRounds = 5;
/* GET users listing. */
router.get('/',async function(req, res, next) {
  try{
    const users = await user.findOne({"email" : req.loggedUser.email },{isPrivate:0,role:0,token:0}) 
    return res.sendSuccess(users, "User detail found");
  }
  catch(error){
    return res.sendError(error);
  }
});


router.put('/edit',Middlewares.validations("register"), async function(req,res,next){
    try {
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        const response = await user.findOneAndUpdate({
            _id:req.loggedUser._id
        },{
            $set:{
                email : req.body.email,
                password : req.body.password,
                name:req.body.name,
                phone:req.body.phone,
                photo:req.body.photo,
                bio:req.body.bio,
                isPrivate:req.body.isPrivate
            }
        });
        const users = await user.findOne({_id:req.loggedUser._id },{isPrivate:0,role:0,token:0}) 
        res.sendUpdated("Profile has been updated",users);
    }
    catch(error){
        return res.sendError(error);
    }
  });

module.exports = router;
