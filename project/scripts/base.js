

// base.js

console.log("base.js loaded successfully");

const API_KEY = 'appid=39872884ff00973498b0883ade9233e1';
const units   = 'units=imperial';

const ALERT_URL = `https://api.openweathermap.org/data/3.0/onecall?`;
const FORECAST_URL    = `https://api.openweathermap.org/data/2.5/forecast?`;
const ZIPURL = `https://api.openweathermap.org/data/2.5/weather?`;

let lat = null;
let lon = null;

// Global map & view references so we can recenter them later
let map;
let view;
let cityName;

function handleSearch() {
  const zip = document.getElementById("zip").value.trim();
  if (zip !== "" && /^\d{5}$/.test(zip)) {
    console.log("User provided ZIP code:", zip);
    searchByZip(zip);
  } else {
    console.log("No valid ZIP provided → using geolocation");
    getLocation();
  }
}

function searchByZip(zip) {
  document.getElementById("output").innerText = `Searching for ZIP: ${zip}`;

  const zipUrl = `${ZIPURL}zip=${zip}&${API_KEY}`;

  fetch(zipUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API (ZIP) response:", data);

      // Update lat/lon
      lat = data.coord.lat;
      lon = data.coord.lon;
      
      console.log("Updated lat/lon from ZIP:", lat, lon);

      // Recentering the existing map
      if (map) {
        const zipCenter = ol.proj.fromLonLat([lon, lat]);
        map.getView().setCenter(zipCenter);
        map.getView().setZoom(10);
      }

      // Fetch weather by lat/lon for display
      const locationUrl = `${FORECAST_URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`;
      return fetch(locationUrl);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(obj => {
      console.log("API (Forecast) response:", obj);

      // 4) Compute today’s high & low
      const todayDate = new Date().getDate();
      const highs = [];
      const lows = [];

      obj.list.forEach(entry => {
        const entryDate = new Date(entry.dt * 1000).getDate();
        if (entryDate === todayDate) {
          highs.push(entry.main.temp_max);
          lows.push(entry.main.temp_min);
        }
      });

      const highTemp = highs.length ? Math.max(...highs) : null;
      const lowTemp  = lows.length  ? Math.min(...lows)  : null;

      // 5) Update the DOM
      if (highTemp !== null && lowTemp !== null) {
        document.getElementById("weather").innerText =
          `Today’s High: ${highTemp}°F  |  Low: ${lowTemp}°F`;
      } else {
        document.getElementById("weather").innerText =
          "No forecast data available for today.";
      }
      fetchWeatherAlerts();
    })
    .catch(error => {
      console.error("Error fetching by ZIP:", error);
      document.getElementById("output").innerText =
        `Error: could not fetch data for that ZIP code.`;
    });

    
}

function getLocation() {
  console.log(">>> getLocation() was called");
  if (!navigator.geolocation) {
    document.getElementById("output").innerText =
      "Geolocation is not supported by this browser.";
    return;
  }
  navigator.geolocation.getCurrentPosition(showPosition, showError);
}

function showPosition(position) {
  console.log(">>> showPosition() was called:", position);

  lat = position.coords.latitude;
  lon = position.coords.longitude;
  console.log("Updated lat/lon from geolocation:", lat, lon);

  // Recentering the existing map
  if (map) {
    const userCenter = ol.proj.fromLonLat([lon, lat]);
    map.getView().setCenter(userCenter);
    map.getView().setZoom(10);
  }

  // Fetch weather by lat/lon for display
  const locationUrl = `${FORECAST_URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`;
  fetch(locationUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(obj => {
      console.log("API (Forecast) response:", obj);

      // 3) Compute today’s high & low
      const todayDate = new Date().getDate();
      const highs = [];
      const lows = [];

      obj.list.forEach(entry => {
        const entryDate = new Date(entry.dt * 1000).getDate();
        if (entryDate === todayDate) {
          highs.push(entry.main.temp_max);
          lows.push(entry.main.temp_min);
        }
      });

      const highTemp = highs.length ? Math.max(...highs) : null;
      const lowTemp  = lows.length  ? Math.min(...lows)  : null;

      // 4) Update the DOM
      if (highTemp !== null && lowTemp !== null) {
        document.getElementById("weather").innerText =
          `Today’s High: ${highTemp}°F  |  Low: ${lowTemp}°F`;
      } else {
        document.getElementById("weather").innerText =
          "No forecast data available for today.";
      }
      fetchWeatherAlerts();
    })
    .catch(error => {
      console.error("Error fetching location data:", error);
      document.getElementById("output").innerText =
        "Error: could not fetch weather data for your location.";
    });
}

////////////////////////////////// weather alerts //////////////////////////////////
function fetchWeatherAlerts() {
  if(lat === null || lon === null) {
    console.warn("Cannot fetch alerts: lat/long not seen yet.");
    return;
  }

  const alertUrl = `${ALERT_URL}lat=${lat}&lon=${lon}&exclude=hourly,daily,minutely&${units}&${API_KEY}`;
  fetch(alertUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API (Alerts) response:", data);

      // (3) Check if `alerts` array exists
      const alertDiv = document.getElementById("weather-alert");
      if (data.alerts && data.alerts.length > 0) {
        // Display the first alert’s event and description
        const firstAlert = data.alerts[0];
        alertDiv.innerText =
          `⚠️ ${firstAlert.event}: ${firstAlert.description}`;
      } else {
        alertDiv.innerText = "No weather alerts for your location.";
      }
      
    })
    .catch(error => {
      console.error("Error fetching weather alerts:", error);
      document.getElementById("weather-alert").innerText =
        "Error: could not fetch weather alerts.";
    });
}

function showError(error) {
  console.log(">>> showError() was called:", error);
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    default:
      alert("An unknown error occurred.");
      break;
  }
}


///////////////////////////////// Hamburger Menu /////////////////////////////
const hamButton  = document.querySelector("#menu");
const navigation = document.querySelector(".navigation");
hamButton.addEventListener("click", () => {
  navigation.classList.toggle("open");
  hamButton.classList.toggle("open");
});


///////////////////////////////// window permissions /////////////////////////////
// This runs once, on page load, to create the map:
window.addEventListener("DOMContentLoaded", () => {
  console.log("Window: DOM is ready");


  //////////////////////////////// add weather map functionality /////////////////////////////
  // [lat, lon] if available, or fallback [0, 0].
  const initialLon = (lon !== null) ? lon : 0;
  const initialLat = (lat !== null) ? lat : 0;
  const initialCenter = ol.proj.fromLonLat([initialLon, initialLat]);

  //Build the view
  view = new ol.View({
    center: initialCenter,
    zoom: 2,
  });

  // Base layer
  const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  // OWM overlay (clouds_new by default)
  const owmLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?${API_KEY}`,
      maxZoom: 19
    }),
    opacity: 0.7
  });

  // Instantiate the map once
  map = new ol.Map({
    target: 'map',
    layers: [osmLayer, owmLayer],
    view: view,
  });

  //Immediately ask for geolocation (so the map will recenter if allowed)
  getLocation();
});





