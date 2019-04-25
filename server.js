'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application Setup
const app = express();
app.use(cors());
const PORT = process.env.PORT

// Incoming API Routes
app.get('/location', searchToLatLong);
app.get('/weather', getWeather);

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`City Explorer is up on ${PORT}`));

// Helper Functions

function searchToLatLong(request, response) {
  // Define the URL for the GEOCODE  API
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;
  // console.log(url);

  superagent.get(url)
    .then(result => {
      // console.log(result.body.results[0]);
      const location = new Location(request.query.data, result);
      response.send(location);
    })
    .catch(err => handleError(err, response));
}

function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng;
}

function getWeather(request, response) {
  // Define the URL for the DARKSKY API
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  // console.log(url);

  superagent.get(url)
    .then(result => {
      // console.log(result.body);
      const weatherSummaries = result.body.daily.data.map(day => new Weather(day));
      response.send(weatherSummaries);
    })
    .catch(err => handleError(err, response));
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

// Error Handler
function handleError(err, response) {
  console.error(err);
  if (response) response.status(500).send('Sorry something went wrong');
}




// 'use strict';

// require('dotenv').config();

// const express = require('express');
// const app = express();

// const cors = require('cors');

// app.use(cors());

// const PORT = process.env.PORT;

// app.get('/testing', (request, response) => {
//   console.log('found the testing route');
//   response.send('<h1>HELLO WORLD...</h1>');
// });

// app.get('/location', (request, response) => {
//   try {
//     const locationData = searchToLatLong(request.query.data);
//     response.send(locationData);
//   }
//   catch (error) {
//     console.error(error);
//     response.status(500).send('Status: 500. So sorry, something went wrong.');
//   }
// });

// app.get('/weather', (request, response) => {
//   try {
//     const weatherData = searchWeather(request.query.data.latitude);
//     // =searchWeather();
//     response.send(weatherData);
//   }
//   catch (error) {
//     console.log(error);
//     response.status(500).send('Status: 500. Sorry, something went wrong.');
//   }
//   console.log('From weather request', request.query.data.latitude);
// });

// app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));


// // Helper Functions

// // function to get location data
// function searchToLatLong(query) {
//   const geoData = require('./data/geo.json');
//   const location = new Location(geoData);
//   console.log(location);
//   return location;
// }

// function searchWeather(query) {
//   const weatherData = require('./data/darksky.json');
//   const weatherSummary = [];
//   weatherData.daily.data.forEach(day => {
//     weatherSummary.push(new Weather(day));
// });
//   console.log('weather Summary Array', weatherSummary);
//   return weatherSummary;
// }

// function Location(data) {
//   this.formatted_query = data.results[0].formatted_address;
//   this.latitude = data.results[0].geometry.location.lat;
//   this.longitude = data.results[0].geometry.location.lng;
// }

// function Weather(day) {
//   let time=new Date(day.time*1000);
//   // multiply by 1000 to get proper timing
//   this.time=time.toDateString();
//   this.forecast=day.summary;
// }
