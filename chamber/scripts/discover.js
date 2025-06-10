
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