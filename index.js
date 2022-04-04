const { config } = require('dotenv');
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

//console.log(process.env);

const app = express();

app.listen(4000, (()=>{
    console.log('Yay! Your server is running at port 4000')
}));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();


app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
  });

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.get('/weather/:latlonUnits', async (request, response) => {
    console.log(request.params);
    const latlonUnits =  request.params.latlonUnits.split(',');
    console.log(latlonUnits);
    const lat = latlonUnits[0];
    const lon = latlonUnits[1];
    const Units = latlonUnits[2];
    console.log(lat, lon, Units);

    const API_Key = process.env.API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=${Units}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_Key}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    }

    response.json(data);
});