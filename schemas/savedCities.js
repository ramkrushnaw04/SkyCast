const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lon: Number
});

const City = mongoose.model('City', citySchema);

module.exports = City;
