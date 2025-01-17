//Adds a load event listener to the window, that in turn adds eventListeners needed for the dropdown.
window.addEventListener("load", () => {

        // Adds an event listener for opening & closing the dropdown
        window.addEventListener("click", (click) => {
            const dropdownElement = document.querySelector(".dropdownContent");
            const dropdown = document.getElementById("countryDropdown");
            const dropdownField = document.getElementById("dropdownField");

            //Check if the user has clicked on the dropdown or if the user has clicked somewhere else to close it.
            if (dropdown.classList.contains("active") && !dropdownElement.contains(click.target)) {
                closeDropdown();
            } else if (dropdownField.contains(click.target)) {
                openDropdown();
            }
        })

        // Adds a click event-listener to every dropdown item for selecting the item
        const dropdownItems = document.querySelectorAll(".dropdownItem");
        dropdownItems.forEach(dropdownItem => {
            dropdownItem.addEventListener("click", () => {
                const dropdownField = document.getElementById("dropdownField");

                // Deselecting the previous item
                const selectedItem = document.querySelector(".selected");
                if (selectedItem != null) {
                    selectedItem.classList.remove("selected");
                }

                //Selecting the new item
                dropdownItem.classList.add("selected");
                dropdownField.value = dropdownItem.innerHTML;
                closeDropdown()
            })
        })

        //Adds an event listener to the search input element for filtering the dropdown
        const searchInput = document.getElementById("searchBox");
        searchInput.addEventListener("keyup", () => {
            const filter = searchInput.value.toLowerCase();
            //Filter out the non-matching entries.
            dropdownItems.forEach(dropdownItem => {
                if (dropdownItem.innerHTML.toLowerCase().includes(filter)) {
                    dropdownItem.classList.remove("hidden");
                } else {
                    dropdownItem.classList.add("hidden");
                }
            })
        })
    }
)

/**
 * Closes the dropdown and removes the previous filter.
 */
function closeDropdown() {
    const dropdownSearch = document.getElementById("searchBox");
    const dropdown = document.getElementById("countryDropdown");
    dropdown.classList.remove("active");

    //Resets the filter so that all elements are shown
    dropdownSearch.value = "";
    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach(hiddenElement => {
        hiddenElement.classList.remove("hidden");
    })
}

/**
 * Opens the dropdown.
 */
function openDropdown() {
    const dropdown = document.getElementById("countryDropdown");
    dropdown.classList.add("active");
}