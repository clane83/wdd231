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
});