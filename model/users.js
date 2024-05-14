var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
    email : String,
    password : String,
    name:String,
    phone:Number,
    bio:String,
    photo:String,
    isPrivate:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:"user"
    },
    token:String
});

module.exports = mongoose.model('users',userSchema);