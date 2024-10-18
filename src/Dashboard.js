import React, { useEffect, useState } from 'react';
import { fetchTrackedCities, addCity, removeCity } from './services/weatherService';

const Dashboard = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState('');

  useEffect(() => {
    const getCities = async () => {
      const citiesData = await fetchTrackedCities();
      setCities(citiesData);
    };

    getCities();
  }, []);

  const handleAddCity = async () => {
    if (newCity.trim()) {
      const addedCity = await addCity(newCity.trim());
      setCities([...cities, addedCity]); // Add new city to the list
      setNewCity(''); // Clear input
    }
  };

  const handleRemoveCity = async (id) => {
    await removeCity(id);
    setCities(cities.filter(city => city._id !== id)); // Remove city from the list
  };

  return (
    <div className="dashboard">
      <h1>Weather Dashboard</h1>
      
      <div className="city-list">
        <h2>Tracked Cities</h2>
        <ul>
          {cities.map(city => (
            <li key={city._id}>
              {city.name} - {city.weather.temp}°C - {city.weather.condition}
              <button onClick={() => handleRemoveCity(city._id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="add-city">
        <input
          type="text"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="Add new city"
        />
        <button onClick={handleAddCity}>Add City</button>
      </div>
    </div>
  );
};

export default Dashboard;

