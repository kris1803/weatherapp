
const dbLink = 'mongodb+srv://kris1803:72bsI9dfviM90JUW@cluster0.lx56f.mongodb.net/weatherapp?retryWrites=true&w=majority';

let mongoose = require('mongoose');
// options
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
}

// mongoose connection with options mongodb+srv://kris1803:72bsI9dfviM90JUW@cluster0.lx56f.mongodb.net/weatherapp?retryWrites=true&w=majority
mongoose.connect(dbLink, options, function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Connected to mongodb')
    }
});

module.exports = mongoose;