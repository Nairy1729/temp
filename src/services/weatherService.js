const API_BASE_URL = 'http://localhost:5000/api';

export const fetchTrackedCities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching tracked cities:', error);
  }
};

export const fetchCityWeather = async (city) => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather/${city}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
  }
};

export const addCity = async (city) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city }),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error adding city ${city}:`, error);
  }
};

export const removeCity = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error(`Error removing city with id ${id}:`, error);
  }
};
