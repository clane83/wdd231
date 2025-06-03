
import { hamburger } from "./menu.js"; 

document.addEventListener("DOMContentLoaded", () => {

///////////////////////////////// Hamburger Menu /////////////////////////////  
  hamburger({
    buttonSelector: "#menu",
    navSelector: ".navigation"
  });
  
});

console.log("base.js loaded successfully");

const API_KEY = 'appid=39872884ff00973498b0883ade9233e1';
const units   = 'units=imperial';

const ALERT_URL = `https://api.openweathermap.org/data/3.0/onecall?`;
const FORECAST_URL    = `https://api.openweathermap.org/data/2.5/forecast?`;
const ZIPURL = `https://api.openweathermap.org/data/2.5/weather?`;
const CURRENT_URL = `https://api.openweathermap.org/data/2.5/weather?`;

let lat = null;
let lon = null;

// Global map & view references so we can recenter them later
let map;
let view;
let cityName;

window.handleSearch = handleSearch;

function handleSearch() {
  const input = document.getElementById("zip").value.trim();
  if (/^\d{5}$/.test(input)) {
    // 5-digit ZIP
    searchByZip(input);
  } else if (input.length) {
    // treat as city name
    searchByCity(input);
  } else {
    // no input → fall back to geolocation
    getLocation();
  }
}



////////////////////////////////// search by ZIP //////////////////////////////////
function searchByZip(zip) {
  // document.getElementById("output").innerText = `Searching for ZIP: ${zip}`;

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

      // Fetch today’s high/low
      const locationUrl = `${FORECAST_URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`;
      return fetch(locationUrl);
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(obj => {
      // Compute and display today’s high/low…
      const todayDate = new Date().getDate();
      const highs = [], lows = [];
      obj.list.forEach(entry => {
        const entryDate = new Date(entry.dt * 1000).getDate();
        if (entryDate === todayDate) {
          highs.push(entry.main.temp_max);
          lows.push(entry.main.temp_min);
        }
      });
      const highTemp = highs.length ? Math.max(...highs) : null;
      const lowTemp  = lows.length  ? Math.min(...lows)  : null;

      if (highTemp !== null && lowTemp !== null) {
        document.getElementById("weather").innerText =
          `Today’s High: ${highTemp}°F  |  Low: ${lowTemp}°F`;
      } else {
        document.getElementById("weather").innerText =
          "No forecast data available for today.";
      }

      fetchWeatherAlerts();
      fetchCurrentDescription();

      // ← HERE: also fetch and render the 5-day forecast
      fetch5DayForecast(lat, lon);
    })
    .catch(error => {
      console.error("Error fetching by ZIP:", error);
      document.getElementById("output").innerText =
        `Error: could not fetch data for that ZIP code.`;
    });
}

////////////////////////////////// search by City Name //////////////////////////////////

async function searchByCity(cityName) {
  try {
    // Get lat/lon by city name
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&${units}&${API_KEY}`
    );
    if (!res.ok) throw new Error(`City "${cityName}" not found`);
    const data = await res.json();
    const lat = data.coord.lat;
    const lon = data.coord.lon;

    // Recenter the map
    if (map) {
      const center = ol.proj.fromLonLat([lon, lat]);
      map.getView().setCenter(center);
      map.getView().setZoom(10);
    }

    // Fetch today’s high/low & display (same as ZIP branch)
    const todayRes = await fetch(`${FORECAST_URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`);
    if (!todayRes.ok) throw new Error("Forecast not found");
    const todayData = await todayRes.json();

    const todayDate = new Date().getDate();
    const highs = [], lows = [];
    todayData.list.forEach(entry => {
      const entryDate = new Date(entry.dt * 1000).getDate();
      if (entryDate === todayDate) {
        highs.push(entry.main.temp_max);
        lows.push(entry.main.temp_min);
      }
    });
    const highTemp = highs.length ? Math.max(...highs) : null;
    const lowTemp  = lows.length  ? Math.min(...lows)  : null;
    if (highTemp !== null && lowTemp !== null) {
      document.getElementById("weather").innerText =
        `Today’s High: ${highTemp}°F  |  Low: ${lowTemp}°F`;
    } else {
      document.getElementById("weather").innerText =
        "No forecast data available for today.";
    }

    // Fetch alerts, current description, and 5-day
    fetchWeatherAlerts(lat, lon);
    fetchCurrentDescription(lat, lon);
    fetch5DayForecast(lat, lon);
  } catch (err) {
    alert("Error searching by city: " + err.message);
    console.error(err);
  }
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

  // Fetch today’s high/low
  const locationUrl = `${FORECAST_URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`;
  fetch(locationUrl)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(obj => {
      const todayDate = new Date().getDate();
      const highs = [], lows = [];
      obj.list.forEach(entry => {
        const entryDate = new Date(entry.dt * 1000).getDate();
        if (entryDate === todayDate) {
          highs.push(entry.main.temp_max);
          lows.push(entry.main.temp_min);
        }
      });
      const highTemp = highs.length ? Math.max(...highs) : null;
      const lowTemp  = lows.length  ? Math.min(...lows)  : null;

      if (highTemp !== null && lowTemp !== null) {
        document.getElementById("weather").innerText =
          `Today’s High: ${highTemp}°F  |  Low: ${lowTemp}°F`;
      } else {
        document.getElementById("weather").innerText =
          "No forecast data available for today.";
      }

      fetchWeatherAlerts();
      fetchCurrentDescription();

      // ← HERE: also fetch and render the 5-day forecast
      fetch5DayForecast(lat, lon);
    })
    .catch(error => {
      console.error("Error fetching location data:", error);
      document.getElementById("output").innerText =
        "Error: could not fetch weather data for your location.";
    });
}

////////////////////////////////// 5day forecast //////////////////////////////////
  async function fetch5DayForecast(lat, lon) {
    try {
      // 5-day/3-hour forecast from OpenWeather
      const forecastRes = await fetch(
        `${FORECAST_URL}&lat=${lat}&lon=${lon}&${units}&${API_KEY}`
      );
      if (!forecastRes.ok) {
        throw new Error("Could not fetch 5-day forecast");
      }
      const forecastData = await forecastRes.json();

      // list entries by “YYYY-MM-DD”
      const dailyData = {};
      forecastData.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      // high/low/average/choose an icon for each day
      const labels = Object.keys(dailyData); // Date format "2025-06-02"
      const highTemps = [];
      const lowTemps = [];
      const avgTemps = [];
      const icons = [];

      labels.forEach((date) => {
        const temps = dailyData[date].map((d) => d.main.temp);
        const max = Math.max(...temps);
        const min = Math.min(...temps);
        const avg = temps.reduce((sum, t) => sum + t, 0) / temps.length;

        highTemps.push(Math.round(max));
        lowTemps.push(Math.round(min));
        avgTemps.push(Math.round(avg));

        // pick the “noon” icon if it exists, otherwise the first one
        const middayEntry = dailyData[date].find((d) =>
          d.dt_txt.includes("12:00:00")
        );
        const iconCode =
          (middayEntry && middayEntry.weather[0].icon) ||
          dailyData[date][0].weather[0].icon;
        icons.push(iconCode);
      });

      // place into #forecast-list
      const listDiv = document.getElementById("forecast-list");
      if (!listDiv) {
        console.warn("No element with id=forecast-list found.");
        return;
      }

      listDiv.innerHTML = labels
        .map(
          (date, i) => `
        <div
          style="
            border: 1px solid #ccc;
            padding: 0.6rem;
            margin-bottom: 0.6rem;
            border-radius: 4px;
            display: flex;
            align-items: center;
          "
        >
          <div style="flex: 1;">
            <strong>${date}</strong><br />
            High: ${highTemps[i]}°F<br />
            Low: ${lowTemps[i]}°F<br />
            Avg: ${avgTemps[i]}°F
          </div>
          <div>
            <img
              src="https://openweathermap.org/img/wn/${icons[i]}@2x.png"
              alt="weather icon"
              style="width:48px; height:48px;"
            />
          </div>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error("fetch5DayForecast() error:", err);
      alert("Error fetching 5-day forecast: " + err.message);
    }
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

      // Check if `alerts` array exists
      const alertDiv = document.getElementById("weather-alert");
      if (data.alerts && data.alerts.length > 0) {
        // Display the first alert’s event and description
        const firstAlert = data.alerts[0];
        alertDiv.innerText =
          `⚠️ ${firstAlert.event}: ${firstAlert.description}`;
          console.log("Weather alert:" + firstAlert.event + " - " + firstAlert.description);
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


////////////////////////////////// current weather description //////////////////////////////////
function fetchCurrentDescription() {
  // If lat/lon are not set, skip
  if (lat === null || lon === null) {
    console.warn("Cannot fetch current description: lat/lon not set yet.");
    return;
  }

  // Build URL for Current Weather endpoint:
  const currentUrl =
    `${CURRENT_URL}lat=${lat}&lon=${lon}` +
    `&units=imperial&${API_KEY}`;

  fetch(currentUrl)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      return resp.json();
    })
    .then(data => {
      // data.weather is an array; take the first item’s description:
      const desc = data.weather[0].description;

      // Write it into #weather-desc:
      document.getElementById("weather-desc").innerText =
        `Current: ${desc.charAt(0).toUpperCase() + desc.slice(1)}`;
    })
    .catch(err => {
      console.error("Error fetching current weather description:", err);
      document.getElementById("weather-desc").innerText =
        "Unable to retrieve current description.";
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





