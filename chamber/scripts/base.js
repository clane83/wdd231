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

    })