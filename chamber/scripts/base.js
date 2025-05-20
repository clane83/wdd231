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



    //business card  array//
    
    const businesses = [
        {
            businessName: "Vintage Clothing",
            businessTagLine: "Shop vintage for less",
            email: "info@vintage.com",
            phone: "702-255-8918",
            contactName: "Maria",
            membershipLevel: "silver",
            url: "https://vintageclothing.com",
            imageURL:
            "images/vintageclothing.png"
        },
        {
            businessName: "Intelligent Solutions",
            businessTagLine: "Solutions for a smarter world",
            email: "info@inteligentsolutions.com",
            phone: "888-876-3092",
            contactName: "Diego",
            membershipLevel: "gold",
            url: "https://intelligentsolutions.com",
            imageURL:
            "images/intelligentsolutions.png"
        },
        {
            businessName: "Sole Revival",
            businessTagLine: "Restoring Soles, One Step at a Time.",
            email: "info@solerevival.com",
            phone: "702-876-9267",
            contactName: "Todd",
            membershipLevel: "Silver",
            url: "https://solerevival.com",
            imageURL:
            "images/sole_revival.png"
        },
        {
            businessName: "Fork & Flame",
            businessTagLine: "Crafted with Fire. Served with Style.",
            email: "info@forkflame.com",
            phone: "725-265-3095",
            contactName: "Fanny",
            membershipLevel: "Silver",
            url: "https://forkandflame.com",
            imageURL:
            "images/fork-flame.png"
        },
        {
            businessName: "Larry's Laptops",
            businessTagLine: "Your Tech, Our Passion",
            email: "info@larrylaptops.com",
            phone: "725-764-4624",
            contactName: "Larry",
            membershipLevel: "member",
            url: "https://larrylaptops.com",
            imageURL:
            "images/larry-laptops.png"
        },
        {
            businessName: "EchoNest",
            businessTagLine: "Intelligence That Echoes Forward.",
            email: "info@echonest.com",
            phone: "888-567-7562",
            contactName: "Mitch",
            membershipLevel: "gold",
            url: "https://echonest.com",
            imageURL:
            "images/echo-nest.png"
        },
        {
            businessName: "BrightForge",
            businessTagLine: "Custom Software Solutions",
            email: "info@larrylaptops.com",
            phone: "725-909-5647",
            contactName: "Mark",
            membershipLevel: "gold",
            url: "https://brightforge.com",
            imageURL:
            "images/brightforge.png"
        }
        
        // Add more movies objects here...
      ];

      


    function createBusinessCard(filteredBusinesses) {
        const container = document.getElementById("business-container");
        if (!container) {
            console.error("Element with id business-container not foudn in the DOM.");
        }
        
        container.innerHTML = ""; // Clear existing content

        const limitedBusinesses = filteredBusinesses.slice(0, 3);

        filteredBusinesses.forEach(business => {
            //main card container//
            let card = document.createElement("section");
            card.classList.add("business-card"); //adds class to the card

            //section 1 of the card//
            const section1 = document.createElement('div');
            section1.classList.add("card-section1");
            const businessName = document.createElement("h3");
            const businessTagLine = document.createElement("p");

            businessName.textContent = business.businessName;
            businessTagLine.textContent = business.businessTagLine;
            section1.appendChild(businessName);
            section1.appendChild(businessTagLine);
            
            //section2 of the card//
            const section2 = document.createElement('div');
            section2.classList.add("card-section2");
            const image = document.createElement("img");
            const email = document.createElement("p");
            const phone = document.createElement("p");
            const url = document.createElement("p");

            image.setAttribute("src", business.imageURL);
            email.textContent = business.email;
            phone.textContent = business.phone;
            url.textContent = business.url;
            section2.appendChild(image);
            section2.appendChild(email);
            section2.appendChild(phone);
            section2.appendChild(url);

            card.appendChild(section1);
            card.appendChild(section2);
            
            container.appendChild(card);

        });
    }


    createBusinessCard(businesses);
    

    })