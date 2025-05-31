

console.log("base.js loaded successfully");

const API_KEY = 'appid=39872884ff00973498b0883ade9233e1';
const units = 'units=imperial';
//create constant urls to be used throughout the script
const URL = `https://api.openweathermap.org/data/2.5/weather?`;
const ZIPURL = `https://api.openweathermap.org/data/2.5/weather?`;

let lat = '';
let lon = '';

function handleSearch() {
    const zip = document.getElementById("zip").value.trim();
    if (zip !== "" && /^\d{5}$/.test(zip)) {
        console.log("User provided ZIP code:", zip);
        searchByZip(zip);
    } else {
        console.log("No valid ZIP provided -> using geolocation");
        getLocation();
    }
}

function searchByZip(zip) {
    document.getElementById("output").innerText = `Searching for ZIP: ${zip}`;

    //ZIPURL pulled from above constant
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
            //pull the coords to use in the localUrl to get local current weather
            lat = data.coord.lat;
            lon = data.coord.lon;
            //URL pulled from above constant
            const locationUrl = `${URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`;
            fetch(locationUrl)
                .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error! status: ${response.status}');
                }
                return response.json();
                })
                .then(data => {
                console.log("API (Location) response:", data);
                document.getElementById("weather").innerText = 
                    `Weather at your location: ${data.weather[0].description}, min of ${data.main.temp_min}°F, max of ${data.main.temp_max}°F, Lattitude: ${lat} Longitude: ${lon}`;
                })
                .catch(error => {
                console.error("Error fetching location data:", error);
                document.getElementById("output").innerText = 
                    "Error: could not fetch weather data for your location.";
                });
        })
        .catch(error => {
            console.log(error);
            console.error("Error fetching by ZIP:", error);
            document.getElementById("output").innerText = `Error: could not fetch data for that ZIP code.`;
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
    console.log("Latitude:", lat, "Longitude:", lon);

    //URL pulled from above constant
    const locationUrl = `${URL}lat=${lat}&lon=${lon}&${units}&${API_KEY}`;
    fetch(locationUrl)
        .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error! status: ${response.status}');
        }
        return response.json();
        })
        .then(data => {
        console.log("API (Location) response:", data);
        document.getElementById("weather").innerText = 
            `Weather at your location: ${data.weather[0].description}, min of ${data.main.temp_min}°F, max of ${data.main.temp_max}°F`;
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

// Hamburger menu
    const hamButton = document.querySelector("#menu");
    const navigation = document.querySelector(".navigation");
    
    hamButton.addEventListener("click", () => {
        navigation.classList.toggle("open");
        hamButton.classList.toggle("open");
    });


window.addEventListener("DOMContentLoaded", () => {
  // immediately prompt for permission as soon as the DOM is parsed.
  console.log("Window: DOM is ready");
  getLocation();
});

