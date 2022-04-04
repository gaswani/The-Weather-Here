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

      const weather = json.weather.main;
      const air = json.air_quality.list[0];

      //document.getElementById('pressure').textContent= json.main.pressure;
      //document.getElementById('temperature').textContent= json.main.temp;

      document.getElementById('pressure').textContent= weather.pressure;
      document.getElementById('temperature').textContent= weather.temp;
      document.getElementById('aq_parameter').textContent= air.components.pm2_5;
      document.getElementById('aq_value').textContent= air.main.aqi;
      document.getElementById('time').textContent = air.timestamp;
    

      // Submit data to database
      const data = { lat, lon, weather, air };
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