
import { hamburger } from "./menu.js"; 

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("currentYear").innerHTML = new Date().getFullYear();     
    document.getElementById("lastModified").textContent = "Last Modification: " + new Date(document.lastModified).toLocaleString();
///////////////////////////////// Hamburger Menu /////////////////////////////  
  hamburger({
    buttonSelector: "#menu",
    navSelector: ".navigation"
  });

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (formEntry) => {
      formEntry.preventDefault(); 

      const email = document.getElementById("email").value;
      const reason = document.querySelector('input[name="reason"]:checked')?.value || "";
      const description = document.getElementById("description").value;
      const timestamp = new Date().toISOString();

      const formData = {
        email,
        reason,
        description,
        timestamp,
      };

      localStorage.setItem("formData", JSON.stringify(formData));
      window.location.href = "thankyou.html"; 
    });
  }

  // Display form data on thankyou.html
    const displayDiv = document.getElementById('formDataDisplay');
    if (displayDiv) {
        const formData = JSON.parse(localStorage.getItem('formData'));
        if (formData) {
            displayDiv.innerHTML = `
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Reason for Request:</strong> ${formData.level}</p>
                <p><strong>Request Description:</strong> ${formData.description}</p>
                <p><strong>Timestamp:</strong> ${new Date(formData.timestamp).toLocaleString()}</p>
            `;
        }
    }
  
});

