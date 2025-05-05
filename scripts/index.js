
document.getElementById("currentYear").innerHTML = new Date().getFullYear();

document.getElementById("lastModified").textContent = "Last Modification: " + new Date(document.lastModified).toLocaleString();
