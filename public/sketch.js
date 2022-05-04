let lat, lon;  
if ('geolocation' in navigator) {
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(async position => {
    try {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      document.getElementById('latitude').textContent = lat.toFixed(2);
      document.getElementById('longitude').textContent = lon.toFixed(2);
      const Units = 'metric';
      const api_url = `weather/${lat},${lon},${Units}`;
      const response = await fetch(api_url);
      const json = await response.json();

      const weather_ = json.weather;
      const air = json.air_quality.list[0];
      const time = json.timestamp;
      const dateString = new Date(time).toLocaleString();

      document.getElementById('city').textContent= weather_.name;
      document.getElementById('summary').textContent= weather_.weather[0].description;
      document.getElementById('pressure').textContent= weather_.main.pressure;
      document.getElementById('humidity').textContent= weather_.main.humidity;
      document.getElementById('temperature').textContent= weather_.main.temp;
      document.getElementById('aq_parameter').textContent= air.components.pm2_5;
      document.getElementById('aq_value').textContent= air.main.aqi;
      document.getElementById('wind_speed').textContent= weather_.wind.speed;
      document.getElementById('visibility').textContent= weather_.visibility;
      document.getElementById('time').textContent = dateString;

      // Submit data to database
      const data = { lat, lon, weather_, air };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      const db_response = await fetch('/api', options);
      const db_json = await db_response.json();
      console.log(db_json);
    } catch (error) {
      console.log('Something went wrong');
    }
    });
  } else {
  console.log('geolocation not available');
};