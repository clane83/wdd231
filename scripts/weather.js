const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

const apiKey = 'appid=39872884ff00973498b0883ade9233e1';
const units = 'units=imperial';
const latitude = 'lat=49.75';
const longitude = 'lon=6.64';

const url = `https://api.openweathermap.org/data/2.5/weather?${latitude}&${longitude}&${apiKey}&${units}`;

async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log(data); // Debugging
            displayResults(data); // Display the results
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

function displayResults(data) {
    console.log(data); // Debugging the API response
    currentTemp.innerHTML = `${data.main.temp}&deg;F`;

    // Construct the icon URL
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    console.log(iconsrc); // Debugging the icon URL

    let desc = data.weather[0].description; // Use 'description' for a more detailed text
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = desc;
}

apiFetch();

