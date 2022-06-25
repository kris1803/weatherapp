let mongoose = require('mongoose');
// create schema citySchema

let citySchema = mongoose.Schema({
    name:String,
    img:String,
    weather:String,
    min:Number,
    max:Number,
    lat:Number,
    lon:Number
});
// create model cityModel
let cityModel = mongoose.model('cities', citySchema);

module.exports = cityModel;
