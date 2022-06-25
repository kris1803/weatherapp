var mongoose=require('mongoose');

let userSchema = mongoose.Schema({
    username:String,
    password:String,
    email:String,
});

let userModel = mongoose.model('users', userSchema);

module.exports = userModel;