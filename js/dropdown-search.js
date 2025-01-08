window.addEventListener("load", () => {

        // Adds an event listener for opening & closing the dropdown
        window.addEventListener("click", (click) => {
            const dropdownElement = document.querySelector(".dropdownContent");
            const dropdown = document.getElementById("countryDropdown");
            const dropdownField = document.getElementById("dropdownField");


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


                dropdownItem.classList.add("selected");
                dropdownField.value = dropdownItem.innerHTML;
                closeDropdown()
            })
        })

        //Adds an event listener to the search input element for filtering the dropdown
        const searchInput = document.getElementById("searchBox");
        searchInput.addEventListener("keyup", () => {
            const filter = searchInput.value.toLowerCase();
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

function closeDropdown() {
    const dropdownSearch = document.getElementById("searchBox");
    const dropdown = document.getElementById("countryDropdown");
    dropdown.classList.remove("active");

    // Reverses the previous filter
    dropdownSearch.value = "";
    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach(hiddenElement => {
        hiddenElement.classList.remove("hidden");
    })
}

function openDropdown() {
    const dropdown = document.getElementById("countryDropdown");
    dropdown.classList.add("active");

}