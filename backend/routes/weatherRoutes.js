const express = require('express');
const City = require('../models/City');
const axios = require('axios');
const router = express.Router();

router.get('/weather/:city', async (req, res) => {
  const cityName = req.params.city;
  try {
    const city = await City.findOne({ name: cityName });
    if (city) {
      return res.json(city);
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}`
    );
    const weatherData = response.data;

    res.json({
      name: weatherData.location.name,
      temperature: weatherData.current.temp_c,
      condition: weatherData.current.condition.text,
      icon: weatherData.current.condition.icon,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new city to track
router.post('/cities', async (req, res) => {
  const { city } = req.body;

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}`
    );
    const weatherData = response.data;

    const newCity = new City({
      name: city,
      weatherData: {
        temperature: weatherData.current.temp_c,
        condition: weatherData.current.condition.text,
        icon: weatherData.current.condition.icon,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_kph,
        sunrise: weatherData.forecast?.forecastday[0]?.astro.sunrise,
        sunset: weatherData.forecast?.forecastday[0]?.astro.sunset,
      },
    });

    await newCity.save();
    res.json(newCity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/cities', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/cities/:id', async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    res.json({ message: 'City removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
