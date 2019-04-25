'use strict';

require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT;

app.get('/testing', (request, response) => {
  console.log('found the testing route');
  response.send('<h1>HELLO WORLD...</h1>');
});

app.get('/location', (request, response) => {
  try {
    const locationData = searchToLatLong(request.query.data);
    response.send(locationData);
  }
  catch (error) {
    console.error(error);
    response.status(500).send('Status: 500. So sorry, something went wrong.');
  }
});

app.get('/weather', (request, response) => {
  try {
    const weatherData = searchWeather(request.query.data.latitude);
    // =searchWeather();
    response.send(weatherData);
  }
  catch (error) {
    console.log(error);
    response.status(500).send('Status: 500. Sorry, something went wrong.');
  }
  console.log('From weather request', request.query.data.latitude);
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));


// Helper Functions

// function to get location data
function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData);
  console.log(location);
  return location;
}

function searchWeather(query) {
  const weatherData = require('./data/darksky.json');
  const weatherSummary = [];
  weatherData.daily.data.forEach(day => {
    weatherSummary.push(new Weather(day));
});
  console.log('weather Summary Array', weatherSummary);
  return weatherSummary;
}

function Location(data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

function Weather(day) {
  let time=new Date(day.time*1000);
  // multiply by 1000 to get proper timing
  this.time=time.toDateString();
  this.forecast=day.summary;
}
