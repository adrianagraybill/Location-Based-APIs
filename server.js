
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

<<<<<<< HEAD
function searchWeather(query) {
  const weatherData = require('./data/darksky.json');
  const weatherSummary = [];
  weatherData.daily.data.forEach(day => {
    weatherSummary.push(new Weather(day));
  });
  console.log('weather Summary Array', weatherSummary);
  return weatherSummary;
}

function getEvents(request, response) {
  `https://www. eventbriteapi.com/v3/events/search/token=${process.env.EVENTBRITE_API_KEY}&location.address=${request.query.data.formatted_query}`;

  superagent.get(url)
    .then(result => {
      const events = result.body.events.map(eventData => {
        const event = new Event(eventData);
        return event;
      });

      response.send(events);
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
=======
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
>>>>>>> 40ceb23b939959d6d464487ffb224d393076b76c
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


// search?location=${}
