
const dbLink = process.env.MONGODB_LINK || ' ';

let mongoose = require('mongoose');
// options
let options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
}

// mongoose connection with options mongodb+srv://kris1803:72bsI9dfviM90JUW@cluster0.lx56f.mongodb.net/weatherapp?retryWrites=true&w=majority
mongoose.connect(dbLink, options, function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log('Connected to database.');
    }
});

module.exports = mongoose;