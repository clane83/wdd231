document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("currentYear").innerHTML = new Date().getFullYear();
    
    document.getElementById("lastModified").textContent = "Last Modification: " + new Date(document.lastModified).toLocaleString();
    
    // Hamburger menu
    const hamButton = document.querySelector("#menu");
    const navigation = document.querySelector(".navigation");
    
    hamButton.addEventListener("click", () => {
        navigation.classList.toggle("open");
        hamButton.classList.toggle("open");
    });

    // Global variable to store fetched members
    let cachedMembers = null;

    async function getMembersData() {
        const businessContainer = document.querySelector("#business-container");
        if (businessContainer) {
            businessContainer.innerHTML = "<p>Loading...</p>";
        }
        try {
            console.log("Fetching data from members.json...");
            const response = await fetch("scripts/members.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Data fetched successfully:", data);
            // Access the 'members' array from the JSON
            cachedMembers = data.members;
            // Standardize membershipLevel to lowercase
            cachedMembers.forEach(member => {
                member.membershipLevel = member.membershipLevel.toLowerCase();
            });
            createBusinessView(cachedMembers, false); // Display card view by default
        } catch (error) {
            console.error("Error fetching the JSON data:", error);
            if (businessContainer) {
                businessContainer.innerHTML = "<p>Error loading businesses. Please try again later.</p>";
            }
        }
    }

    function createBusinessView(filteredMembers, isListView) {
        console.log("Creating business view:", filteredMembers);
        const container = document.getElementById("business-container");
        if (!container) {
            console.error("Element with id business-container not found in the DOM.");
            return;
        }

        container.innerHTML = ""; // Clear existing content

        filteredMembers.forEach((member) => {
            console.log("Processing member:", member);
            if (isListView) {
                // Create list view
                let listItem = document.createElement("div");
                listItem.classList.add("business-list-item");

                const businessName = document.createElement("h3");
                const businessTagLine = document.createElement("p");
                const email = document.createElement("p");
                const phone = document.createElement("p");
                const url = document.createElement("a");

                businessName.textContent = member.businessName;
                businessTagLine.textContent = member.businessTagLine;
                email.textContent = `Email: ${member.email}`;
                phone.textContent = `Phone: ${member.phone}`;
                url.textContent = "Visit Website";
                url.href = member.url;
                url.target = "_blank";

                listItem.appendChild(businessName);
                listItem.appendChild(businessTagLine);
                listItem.appendChild(email);
                listItem.appendChild(phone);
                listItem.appendChild(url);

                container.appendChild(listItem);
            } else {
                // Create card view
                let card = document.createElement("section");
                card.classList.add("business-card");

                const section1 = document.createElement("div");
                section1.classList.add("card-section1");
                const businessName = document.createElement("h3");
                const businessTagLine = document.createElement("p");

                businessName.textContent = member.businessName;
                businessTagLine.textContent = member.businessTagLine;
                section1.appendChild(businessName);
                section1.appendChild(businessTagLine);

                const section2 = document.createElement("div");
                section2.classList.add("card-section2");
                const image = document.createElement("img");
                const email = document.createElement("p");
                const phone = document.createElement("p");
                const url = document.createElement("a");

                image.setAttribute("src", member.imageURL || "images/fallback-image.png");
                image.setAttribute("alt", `${member.businessName} logo`);
                image.onerror = () => {
                    image.src = "images/fallback-image.png"; // Fallback image
                };
                email.textContent = `Email: ${member.email}`;
                phone.textContent = `Phone: ${member.phone}`;
                url.textContent = "Visit Website";
                url.href = member.url;
                url.target = "_blank";

                section2.appendChild(image);
                section2.appendChild(email);
                section2.appendChild(phone);
                section2.appendChild(url);

                card.appendChild(section1);
                card.appendChild(section2);

                container.appendChild(card);
            }
        });
    }

    const listViewButton = document.querySelector("#listView");
    const cardViewButton = document.querySelector("#cardView");
    const businessContainer = document.querySelector("#business-container");

    // Switch to list view
    if (listViewButton) {
        listViewButton.addEventListener("click", () => {
            if (businessContainer) {
                businessContainer.classList.remove("card-view");
                businessContainer.classList.add("list-view");
            }
            if (cachedMembers) {
                createBusinessView(cachedMembers, true);
            } else {
                getMembersData(); // Refetch if no data
            }
        });
    }

    // Switch to card view
    if (cardViewButton) {
        cardViewButton.addEventListener("click", () => {
            if (businessContainer) {
                businessContainer.classList.remove("list-view");
                businessContainer.classList.add("card-view");
            }
            if (cachedMembers) {
                createBusinessView(cachedMembers, false);
            } else {
                getMembersData(); // Refetch if no data
            }
        });
    }

    // Fetch and display members on load
    getMembersData();


    // ids for required inputs on index.html
    const currentTemp = document.querySelector('#current-temp');
    const weatherIcon = document.querySelector('#weather-icon');
    const weatherDesc = document.querySelector('#weather-description');
    const high = document.querySelector('#high-temp');
    const low = document.querySelector('#low-temp');
    const humidity = document.querySelector('#humidity');
    const sunriseLocal = document.querySelector('#sunrise');
    const sunsetLocal = document.querySelector('#sunset');
    const captionDesc = document.querySelector('figcaption');

    // weather api
    const apiKey = 'appid=39872884ff00973498b0883ade9233e1';
    const units = 'units=imperial';
    const latitude = 'lat=36.1716';
    const longitude = 'lon=115.1391';

    const urlcurrentTemp = `https://api.openweathermap.org/data/2.5/weather?${latitude}&${longitude}&${apiKey}&${units}`;

    async function apiFetch() {
        try {
            const response = await fetch(urlcurrentTemp);
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
        weatherDesc.innerHTML = data.weather[0].main;
        high.innerHTML = `${data.main.temp_max}&deg;F`;
        low.innerHTML = `${data.main.temp_min}&deg;F`;
        humidity.innerHTML = `${data.main.humidity}%`;
       
        // Get the Unix timestamps (in seconds)
        const sunriseUtc = data.sys.sunrise;
        const sunsetUtc = data.sys.sunset;

        // console.log("Sunrise (UTC):", sunriseUtc);
        // console.log("Sunset (UTC):", sunsetUtc);

        // Convert to milliseconds and create Date objects
        const sunriseDate = new Date(sunriseUtc * 1000);
        const sunsetDate = new Date(sunsetUtc * 1000);

        // console.log("Sunrise Date Object:", sunriseDate);
        // console.log("Sunset Date Object:", sunsetDate);

        // Manually adjust for PST/PDT if needed
        const sunrisePdt = new Date(sunriseDate.getTime() - (7 * 60 * 60 * 1000)); // Subtract 7 hours for PDT
        const sunsetPdt = new Date(sunsetDate.getTime() - (7 * 60 * 60 * 1000)); // Subtract 7 hours for PDT

        // console.log("Adjusted Sunrise Date (PDT):", sunrisePdt);
        // console.log("Adjusted Sunset Date (PDT):", sunsetPdt);

        // Format to PST/PDT using Intl.DateTimeFormat
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }); 

        const sunriseTimeStr = formatter.format(sunrisePdt);
        const sunsetTimeStr = formatter.format(sunsetPdt);

        // console.log("Formatted Sunrise Time (PDT):", sunriseTimeStr);
        // console.log("Formatted Sunset Time (PDT):", sunsetTimeStr);

        
        sunriseLocal.innerHTML = sunriseTimeStr;
        sunsetLocal.innerHTML = sunsetTimeStr;

        // console.log("Sunrise Local Time Element:", sunriseLocal.innerHTML);
        // console.log("Sunset Local Time Element:", sunsetLocal.innerHTML);

        // Construct the icon URL
        const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        console.log(iconsrc); // Debugging the icon URL

        let desc = data.weather[0].description; // Use 'description' for a more detailed text
        weatherIcon.setAttribute('src', iconsrc);
        weatherIcon.setAttribute('alt', desc);
        captionDesc.textContent = desc;
    }

    apiFetch();
});