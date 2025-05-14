const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';



async function getProphetData() {
    try {
        console.log("Fetching data..."); // Debugging log
        const response = await fetch(url); // Request the JSON file
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json(); // Parse the JSON data
        console.log("Data fetched successfully:", data); // Debugging log
        displayProphets(data.prophets); // Call the display function with the prophets array
    } catch (error) {
        console.error("Error fetching the JSON data:", error);
    }
}

getProphetData();

const cards = document.querySelector('#cards');

const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        console.log("Displaying prophets:", prophets); // Debugging log
        // card build code goes here
        let card = document.createElement('section');
        let fullName = document.createElement('h2'); // fill in the blank
        let dateOfBirth = document.createElement('p');
        let placeOfBirth = document.createElement('p');
        let portrait = document.createElement('img');

        // Build the h2 content out to show the prophet's full name
        fullName.textContent = `${prophet.name} ${prophet.lastname}`; // fill in the blank
        dateOfBirth.textContent = "Date of Birth: " + prophet.birthdate
        placeOfBirth.textContent = 'Place of Birth: ' + prophet.birthplace
        // Build the image portrait by setting all the relevant attributes
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`); // fill in the blank
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        // Append the section(card) with the created elements
        card.appendChild(fullName); //fill in the blank
        card.appendChild(dateOfBirth);
        card.appendChild(placeOfBirth);
        card.appendChild(portrait);

        cards.appendChild(card);
      });
  }