const MONGODB = '';

const mongoose = require('mongoose');
// options
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(MONGODB, options, function (err) {
    if (err)
        console.log(err)
    else
        console.log('Connected to mongodb')
});

module.exports = mongoose;