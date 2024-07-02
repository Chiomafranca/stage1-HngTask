import express from "express"

import axios  from "axios"


const app = express()

app.get("/api/hello",  async (req, res) =>{
    const visitor = req.query.visitor_name
    const visitor_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    try {
        const ipInfoToken = '2e580ad8e10ca7';
        const weatherApiKey = 'fdcb6abf92e1e242ab633410773c9a5d';
      
        const locationResponse = await axios.get(`https://ipinfo.io/${visitor_ip}?token=${ipInfoToken}`);
        const locationData = locationResponse.data;
         console.log(locationData)
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${locationData.city}&units=metric&appid=${weatherApiKey}`);
        const weatherData = weatherResponse.data;
      
        const response = {
          client_ip: clientIp,
          location: locationData.city,
          greeting: `Hello, ${visitor}!, the temperature is ${weatherData.main.temp} degrees Celsius in ${locationData.city}`
        };
      
        res.json(response);
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred' });
      }
})

app.listen(4000, console.log("Run port 4000"))