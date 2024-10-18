const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');
const cron = require('node-cron');
const City = require('./models/City');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.use('/api', weatherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

cron.schedule('0 * * * *', async () => {
  console.log('Updating weather data for all tracked cities...');
  try {
    const cities = await City.find();
    const apiKey = process.env.WEATHER_API_KEY;

    for (const city of cities) {
      const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city.name}`);
      const weatherData = response.data;

      city.weatherData = {
        temperature: weatherData.current.temp_c,
        condition: weatherData.current.condition.text,
        icon: weatherData.current.condition.icon,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_kph,
        sunrise: weatherData.forecast?.forecastday[0]?.astro.sunrise,
        sunset: weatherData.forecast?.forecastday[0]?.astro.sunset,
      };
      city.updatedAt = Date.now();

      await city.save();
    }
    console.log('Weather data updated for all cities');
  } catch (error) {
    console.error('Error updating weather data:', error);
  }
});
