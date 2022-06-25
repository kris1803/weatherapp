var mongoose=require('mongoose');

let userSchema = mongoose.Schema({
    username:String,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

let userModel = mongoose.model('users', userSchema);

module.exports = userModel;