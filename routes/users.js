var express = require('express');
var router = express.Router();
const user = require('../model/users.js');
/* GET users listing. */
router.get('/',async function(req, res, next) {
  try{
    const condition = {"role":{"$ne":"admin"}};
    const projection =  {role:0,token:0};
    if(req.loggedUser.role == "user"){
      condition["isPrivate"] = false;
      projection["isPrivate"] = 0
    }
    const users = await user.find(condition,projection);
    return res.sendSuccess(users, "User detail found");
  }
  catch(error){
    return res.sendError(error);
  }
});

module.exports = router;
