
export function hamburger({buttonSelector, navSelector}){
    const hamButton  = document.querySelector("#menu");
    const navigation = document.querySelector(".navigation");

    if (!hamButton || !navigation) {
        console.warn("Could not find hamburger button or nav using selectors:", buttonSelector, navSelector);
        return;
    }

    hamButton.addEventListener("click", () => {
        navigation.classList.toggle("open");
        hamButton.classList.toggle("open");
    });
}