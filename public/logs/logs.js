const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);

    const txt = `The atmospheric pressure here a ${item.lat}&deg;, ${item.lon}&deg; is ${item.weather.pressure} mBar with a temperature of ${item.weather.temp}&deg; Celsius.
      The concentration of particulate matter (pm25) is ${item.air.components.pm2_5} and the air quality index is ${item.air.main.aqi}.
      These readings were recorded at ${item.air.timestamp}.`
    
    marker.bindPopup(txt);

    //const root = document.createElement('p');
    //const geo = document.createElement('div');
    //const date = document.createElement('div');

    //geo.textContent = `${item.lat}°, ${item.lon}°`;
    //const dateString = new Date(item.timestamp).toLocaleString();
    //date.textContent = dateString;

    //root.append(geo, date);
    //document.body.append(root);
  }
  console.log(data);
}
