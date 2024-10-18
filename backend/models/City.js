const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  weatherData: {
    temperature: Number,
    condition: String,
    icon: String,
    humidity: Number,
    windSpeed: Number,
    sunrise: String,
    sunset: String,
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('City', CitySchema);
