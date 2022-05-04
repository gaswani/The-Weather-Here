const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

// Get data from the database by calling the getData() function
getData();

// Async function to get data from the database
async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);

    const txt = `The weather here in ${item.weather_.name} (${item.lat}&deg;, ${item.lon}&deg;) is ${item.weather_.weather[0].description} ,pressure of ${item.weather_.main.pressure} mBar, humidity of ${item.weather_.main.humidity}% and a temperature of ${item.weather_.main.temp}&deg; Celsius.
      The concentration of particulate matter (pm25) is ${item.air.components.pm2_5} and the air quality index is ${item.air.main.aqi}.
      These readings were recorded on ${new Date(item.timestamp).toLocaleString()}.`;
    
    marker.bindPopup(txt);
  }
  console.log(data);
}
