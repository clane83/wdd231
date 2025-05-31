

// base.js

console.log("base.js loaded successfully");

const API_KEY = 'appid=39872884ff00973498b0883ade9233e1';
const units   = 'units=imperial';

const URL    = `https://api.openweathermap.org/data/2.5/weather?`;
const ZIPURL = `https://api.openweathermap.org/data/2.5/weather?`;

let lat = null;
let lon = null;

// Global map & view references so we can recenter them later
let map;
let view;

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

      // 1) Update lat/lon
      lat = data.coord.lat;
      lon = data.coord.lon;
      console.log("Updated lat/lon from ZIP:", lat, lon);

      // 2) Recentering the existing map
      if (map) {
        const zipCenter = ol.proj.fromLonLat([lon, lat]);
        map.getView().setCenter(zipCenter);
        map.getView().setZoom(10);
      }

      // 3) Fetch weather by lat/lon for display
      const locationUrl = `${URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`;
      return fetch(locationUrl);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API (Location) response:", data);
      document.getElementById("weather").innerText =
        `Weather at that ZIP: ${data.weather[0].description}, ` +
        `min ${data.main.temp_min}°F, max ${data.main.temp_max}°F, ` +
        `Latitude: ${lat}, Longitude: ${lon}`;
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

  // 1) Recentering the existing map
  if (map) {
    const userCenter = ol.proj.fromLonLat([lon, lat]);
    map.getView().setCenter(userCenter);
    map.getView().setZoom(10);
  }

  // 2) Fetch weather by lat/lon for display
  const locationUrl = `${URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`;
  fetch(locationUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API (Location) response:", data);
      document.getElementById("weather").innerText =
        `Weather at your location: ${data.weather[0].description}, ` +
        `min ${data.main.temp_min}°F, max ${data.main.temp_max}°F`;
    })
    .catch(error => {
      console.error("Error fetching location data:", error);
      document.getElementById("output").innerText =
        "Error: could not fetch weather data for your location.";
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
  // Pick either [lat, lon] if available, or fallback [0, 0].
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
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?${API_KEY}`,
      maxZoom: 19
    }),
    opacity: 0.5
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




