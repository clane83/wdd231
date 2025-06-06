import {discover} from "../data/discover.js";
// console.log(discover);




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
            const response = await fetch("scripts/members.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            cachedMembers = data.members;
    
            cachedMembers.forEach(member => {
                member.membershipLevel = member.membershipLevel.toLowerCase();
            });
    
            if (businessContainer) {
                createBusinessView(cachedMembers, false);
            }
    
        } catch (error) {
            console.error("Error fetching members:", error);
            if (businessContainer) {
                businessContainer.innerHTML = "<p>Error loading businesses. Please try again later.</p>";
            }
        }
    }
    

        async function loadSpotlightData() {
            try {
                const response = await fetch("scripts/members.json");
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                const data = await response.json();
                cachedMembers = data.members;
        
                cachedMembers.forEach(member => {
                    member.membershipLevel = member.membershipLevel.toLowerCase();
                });
        
                if (document.querySelector("#spotlights")) {
                    createSpotlightView();
                }
            } catch (error) {
                console.error("Failed to load spotlight data:", error);
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
                    getMembersData();
                }
            });
        }
    
        if (document.querySelector("#business-container")) {
    getMembersData();
} else if (document.querySelector("#spotlights")) {
    loadSpotlightData(); // ✅ only fetch spotlight data when needed
}
        
    


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
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?${latitude}&${longitude}&${units}&${apiKey}`;

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

    if(document.querySelector('#current-temp')) {
        apiFetch();
    }
    


    async function fetchForecast() {
        try {
            const response = await fetch(urlForecast);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                displayForecast(data); // Pass entire response
            } else {
                throw Error(await response.text());
            }
        } catch (error) {
            console.log(error);
        }
    }
    


    function displayForecast(data) {
        const forecastContainer = document.getElementById("forecast-container");
        if (!forecastContainer) {
            console.error("Element with id forecast-container not found in the DOM.");
            return;
        }
    
        forecastContainer.innerHTML = ""; // Clear once before loop
    
        const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3); // limit to 3 days

        dailyForecast.forEach((day) => {
            // Create elements
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");
    
            const formattedDate = document.createElement("h3");
            const tempInfo = document.createElement("p");
    
            // Format the date
            const date = new Date(day.dt * 1000);
            const options = { weekday: "long"};
            formattedDate.textContent = date.toLocaleDateString("en-US", options);
    
            // Temperature info
            const highTemp = Math.round(day.main.temp_max || day.main.temp);
            const lowTemp = Math.round(day.main.temp_min || day.main.temp);
            tempInfo.innerHTML = `High: ${highTemp}&deg;F<br>Low: ${lowTemp}&deg;F`;
    
            // Add elements to the forecast card
            forecastCard.appendChild(formattedDate);
            forecastCard.appendChild(tempInfo);
    
            // Add the card to the container
            forecastContainer.appendChild(forecastCard);
        });
    }
    
    if (document.querySelector("#forecast-container")) {
    fetchForecast();
    }


    



    const spotlightContainer = document.getElementById('spotlights');

    function createSpotlightView() {
        if (!spotlightContainer) {
            console.error("Element with id 'spotlights' not found in the DOM.");
            return;
        }
    
        console.log("Cached Members:", cachedMembers); // Debugging
    
        if (!cachedMembers || cachedMembers.length === 0) {
            console.error("No cached members available for spotlights.");
            return;
        }
    
        spotlightContainer.innerHTML = ""; // Clear existing content
    
        // Filter only Gold or Silver members
        const eligibleMembers = cachedMembers.filter(member =>
            member.membershipLevel === 'gold' || member.membershipLevel === 'silver'
        );
    
        // Randomly select 2 or 3 members
        let numToShow = Math.floor(Math.random() * 2) + 2; // 2 or 3
        numToShow = Math.min(numToShow, 3, eligibleMembers.length);
        const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
        const selectedMembers = shuffled.slice(0, numToShow);
    
        // Create cards for each selected member
        selectedMembers.forEach(member => {
            let card = document.createElement("section");
                card.classList.add("spotlight-card");

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

                spotlightContainer.appendChild(card);
        });
    }
    
    if (document.querySelector("#spotlights")) {
        createSpotlightView();
      }



    //auto format phone number input while use is typing form.html
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let cleaned = this.value.replace(/\D/g, '').substring(0, 10);
            let formatted = cleaned;
            if (cleaned.length > 6) {
                formatted = `(${cleaned.substring(0,3)}) ${cleaned.substring(3,6)}-${cleaned.substring(6,10)}`;
            } else if (cleaned.length > 3) {
                formatted = `(${cleaned.substring(0,3)}) ${cleaned.substring(3,6)}`;
            } else if (cleaned.length > 0) {
                formatted = `(${cleaned}`;
            }
            this.value = formatted;
        });
    }

    

    
    //save form data to local storage from join.html
    const joinForm = document.querySelector('.form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(event) {
            const formData = {
                organization: document.getElementById('organization').value,
                fname: document.getElementById('fname').value,
                lname: document.getElementById('lname').value,
                title: document.getElementById('title').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                level: document.querySelector('input[name="level"]:checked')?.value,
                description: document.getElementById('description').value,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('formData', JSON.stringify(formData));
            
        });
    }

    // Display form data on thankyou.html
    const displayDiv = document.getElementById('formDataDisplay');
    if (displayDiv) {
        const formData = JSON.parse(localStorage.getItem('formData'));
        if (formData) {
            displayDiv.innerHTML = `
                <p><strong>Organization Name:</strong> ${formData.organization}</p>
                <p><strong>First Name:</strong> ${formData.fname}</p>
                <p><strong>Last Name:</strong> ${formData.lname}</p>
                <p><strong>Title:</strong> ${formData.title}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
                <p><strong>Membership Level:</strong> ${formData.level}</p>
                <p><strong>Description:</strong> ${formData.description}</p>
                <p><strong>Timestamp:</strong> ${new Date(formData.timestamp).toLocaleString()}</p>
            `;
        }
    }


////////////////////////// form ///////////////////////////////

    const membership = [
        {
          level: "NP Membership",
          cost: "Free",
          frequency: "Annually",
          description: "The NP Membership is free and provides access to the basic features of the Chamber, including participation in community discussions and access to public resources.",
        },
        {
          level: "Bronze Membership",
          cost: "$500",
          frequency: "Annually",
          description: "The Bronze Membership includes all NP Membership benefits, plus access to exclusive webinars, workshops, and networking events. Members also receive a quarterly newsletter with industry insights.",
        },
        {
          level: "Silver Membership",
          cost: "$750",
          frequency: "Annually",
          description: "Silver Membership includes all Bronze Membership benefits, plus a dedicated account manager, priority support, and access to premium resources such as industry reports and whitepapers.",
        },
        {
          level: "Gold Membership",
          cost: "$1000",
          frequency: "Annually",
          description: "Gold Membership includes all Silver Membership benefits, plus invitations to exclusive networking events, access to a members-only online forum, and discounts on Chamber-sponsored events and services.",
        }
      ];
    
      const container = document.getElementById("membershipCards");
      const modal = document.getElementById("membershipModal");
      const modalTitle = document.getElementById("modalTitle");
      const modalDescription = document.getElementById("modalDescription");
      const closeModalButton = document.getElementById("closeModalButton");
    
      if (container && modal && modalTitle && modalDescription && closeModalButton) {
        membership.forEach((item) => {
            const card = document.createElement("div");
            card.classList.add("membership-card");

            const title = document.createElement("h3");
            title.textContent = item.level;

            const desc = document.createElement("p");
            desc.textContent = item.description;

            const moreInfoBtn = document.createElement("button");
            moreInfoBtn.textContent = "More Info";
            moreInfoBtn.addEventListener("click", () => {
            modalTitle.textContent = item.level;
            modalDescription.textContent = `${item.description}\n\nCost: ${item.cost} (${item.frequency})`;
            modal.showModal();
            });

            card.appendChild(title);
            card.appendChild(moreInfoBtn);

            container.appendChild(card);
        });

        closeModalButton.addEventListener("click", () => modal.close());
}
      

      

});

if (document.querySelector("#mydiscover")) {
    const discoverCity = document.querySelector("#discovercity");
    const mydiscover = document.querySelector("#mydiscover");

    const mytitle = document.querySelector("#mydiscover h2");
    const mydescription = document.querySelector("#mydiscover p");
    const myaddress = document.querySelector("#mydiscover address");
    const myclose = document.getElementById("myclose");

    
    if (myclose && mydiscover && typeof mydiscover.close === 'function') {
        myclose.addEventListener("click", () => {
          mydiscover.close();
        });
      }


    discover.forEach(place => {
        const card = document.createElement("div");
        card.classList.add("discover-card");
        console.log(place);
        const placeName = document.createElement("h3")
        // const placeAddress = document.createElement("p");
        const img = document.createElement('img');
        const button = document.createElement('button');

        placeName.textContent = place.name;
        // placeAddress.textContent = place.address;
        img.src = place.img;
        img.alt = `${place.place} image`;
        button.textContent = "Learn More";
        
        card.appendChild(placeName);
        // card.appendChild(placeAddress);
        card.appendChild(img);
        card.appendChild(button);
        button.addEventListener("click", () => openDiscoverModal(place));
        discoverCity.appendChild(card);
        // discoverCity.appendChild(cardImage);
    })


    function openDiscoverModal(place) {
        mytitle.innerHTML = place.place;
        myaddress.innerHTML = place.address;
        mydescription.innerHTML = place.description;
        mydiscover.showModal();

    }

  }
