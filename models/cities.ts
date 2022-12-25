import mongoose from "../providers/mongoose";

let citySchema = new mongoose.Schema({
    name: String,
    img: String,
    weather: String,
    min: Number,
    max: Number,
    lat: Number,
    lon: Number
});

let cityModel = mongoose.model('cities', citySchema);

module.exports = cityModel;
