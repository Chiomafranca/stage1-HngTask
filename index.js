import express from "express"

import axios  from "axios"


const app = express()

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    if (!visitorName) {
      return res.status(400).json({ error: 'visitor_name query parameter is required' });
    }
  
    try {
      const ipInfoToken = 'b8dbd91ad7b6f9';
      const weatherApiKey = 'f6f8d6f0dd0ac29853f0dc27f2a0830f';
  
      let city = 'New York'; // Default city for fallback
  
      if (clientIp !== '::1' && clientIp !== '127.0.0.1') {
        // Get location data for non-local IP
        const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}?token=${ipInfoToken}`);
        const locationData = locationResponse.data;
        console.log('Location Data:', locationData);
  
        if (locationData.bogon) {
          console.log('Bogon IP address, using default city.');
        } else if (!locationData.city) {
          return res.status(400).json({ error: 'City information not found for the given IP' });
        } else {
          city = locationData.city;
        }
      } else {
        console.log('Local IP address, using default city.');
      }
  
      // Get weather data
      const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`);
      const weatherData = weatherResponse.data;
  
      const response = {
        client_ip: clientIp,
        location: city,
        greeting: `Hello, ${visitorName}!, the temperature is ${weatherData.main.temp} degrees Celsius in ${city}`
      };
  
      res.json(response);
    } catch (error) {
      console.error('Error occurred:', error.message);
      if (error.response) {
        // API responded with a status code out of the 2xx range
        return res.status(error.response.status).json({ error: error.response.data });
      } else if (error.request) {
        // Request was made but no response received
        return res.status(500).json({ error: 'No response received from the weather service' });
      } else {
        // Something else happened
        return res.status(500).json({ error: 'An error occurred' });
      }
    }
  });
app.listen(4000, console.log("Run port 4000"))