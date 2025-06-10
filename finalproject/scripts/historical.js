import { hamburger } from "./menu.js"; 

document.addEventListener("DOMContentLoaded", () => {

///////////////////////////////// Hamburger Menu /////////////////////////////  
  hamburger({
    buttonSelector: "#menu",
    navSelector: ".navigation"
  });
  
});

console.log("historical.js loaded successfully");



const VISUAL_CROSSING_API_KEY = "3Q39MWS7V668DXAQBC484LP4J";

let weatherChartInstance = null;

document.getElementById("history-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  let location = document.getElementById("history-location").value.trim();

  console.log("Form submitted for location:", location);


  // If ZIP code, add country code
  if (/^\d{5}$/.test(location)) {
    location = `${location},us`;
  }

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/last7days?unitGroup=us&key=${VISUAL_CROSSING_API_KEY}&include=days`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("URL:", url);
    console.log("Data:", data);

    if (!data.days || !data.days.length) {
      alert("No historical data found for this location.");
      return;
    }

    const labels = data.days.map(day => day.datetime);
    const temps = data.days.map(day => day.temp);

    const ctx = document.getElementById("weatherChart").getContext("2d");

    // Destroy existing chart if any
    if (weatherChartInstance) {
      weatherChartInstance.destroy();
    }

    weatherChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Avg Temp (°F)",
          data: temps,
          fill: false,
          borderColor: "#007bff",
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  } catch (err) {
    alert("Error loading weather data: " + err.message);
  }
});
