
'use strict';

require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT;

//API routes

app.get('/location', searchToLatLong);
app.get('/weather', getWeather);
app.get('/events', getEvents);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));


//Helper functions


// function to get location data
function searchToLatLong(request, response) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  superagent.get(url)
    .then(result => {
      const location = new Location(result.body.daily.data, result);
      response.send(location);
    })
    .catch(err => handleError(err, response));
}

function getWeather(request, response) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

  superagent.get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map(day => new Weather(day));
      response.send(weatherSummaries);
    })
    .catch(err => handleError(err, response));
}

function getEvents(request, response) {
  const url = `https://www.eventbriteapi.com/v3/events/search/token=${process.env.EVENTBRITE_API_KEY}&location.address=${request.query.data.formatted_query}`;

  superagent.get(url)
    .then(result => {
      const eventSummaries = result.body.events.map(event => new Event(event));
      response.send(eventSummaries);
    })
    .catch(error => handleError(error, response));
}

function Location(data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

function Weather(day) {
  let time = new Date(day.time * 1000);
  // multiply by 1000 to get proper timing
  this.time = time.toDateString();
  this.forecast = day.summary;
}

function Event(event) {
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = new Date(event.start.local).toString().slice(0, 15);
  this.summary = event.summary;
}

function handleError(err, response) {
  console.error(err);
  if (response) response.status(500).send('Sorry, something is not right');
}
