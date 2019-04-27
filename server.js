
'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.get('/location', searchToLatLong);
app.get('/weather', searchWeather);

app.listen(PORT, () => console.log(`City Explorer is up and running on ${PORT}`));

function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng;
}

function Weather(day) {
  this.time = new Date(day.time * 1000).toString().slice(0,15);
  this.forecast=day.summary;
}

function Reviews(depends) {
  this.time = new Date(day.time * 1000).toString().slice(0,15);
  this.yelp=day.summary;
}

function searchToLatLong(request, response) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;
  console.log('geoCode API url' , url);

  superagent.get(url)
    .then(result => {
      const location = new Location(request.query.data, result);
      response.send(location);
    })
    .catch(err => handleError(err, response));
}

function searchWeather(request, response) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  console.log('darksky API url' , url);

  superagent.get(url)
    .then(result => {
      const weatherSummary = result.body.daily.data.map(day => new Weather(day));
      response.send(weatherSummary);
    })
    .catch(err => handleError(err, response));
}

// Error Handler
function handleError(err, response) {
  console.error(err);
  if (response) response.status(500).send('Thanos has snapped, page is unavailable...');
}


search?location=${}