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
            businessName: "Vintage Clothing",
            businessTagLine: "May 30, 2025",
            email: "info@vintage.com",
            phone: "702-255-8918",
            contactName: "Maria",
            membershipLevel: "member",
            url: "https://vintageclothing.com",
            imageURL:
            "images/vintageclothing.png"
        }
        
        // Add more movies objects here...
      ];



    function createBusinessCard(filteredBusinesses) {
        const container = document.getElementById("business-container");
        if (!container) {
            console.error("Element with id business-container not foudn in the DOM.");
        }
        
        container.innerHTML = ""; // Clear existing content

        

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