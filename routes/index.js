const express = require('express');
const router = express.Router();
const user = require('../model/users.js');
// var express = require('express')
const app = express();

router.post("/logout", async function(req, res, next) {
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




//signup end


//login start 
router.get('/login', function(req, res, next) {
  if(req.user){res.redirect('/welcome')}
  else{
  res.render('login/login');}
});


// router.get('/logout', function (req, res) {
//   req.session.destroy();
//   res.redirect("/");
// });


router.use(function (req, res, next) {
  
  const data = req.user;
  res.locals.data = req.user;
  console.log("sarthak",data)
  next();
})



// router.get('/welcome', function(req, res, next) {
//   if(req.user){
//     console.log(`session ${JSON.stringify(req.session,null,2)}`);
//     console.log(`passport ${JSON.stringify(req.session.passport,null,2)}`);
//     console.log(req.user);
//   res.render('login/home');}
//   else{
//     res.redirect('/login');
//   }
// });

//login ends
























module.exports = router;
