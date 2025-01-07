//API for doing reverse geocoding (location -> OSM object) from openstreetmap
const reverseGeocodingApiURL = "https://nominatim.openstreetmap.org/reverse";

//Location of the data source for the mappings between countries and their respective country code.
//The source provided here is from https://gist.github.com/kalinchernev/486393efcca01623b18d and was updated a bit.
const countryCodesSource = "../resources/countryCodes.json";

//Gets the current location of the device if supported.
//If supported, the position is passed on for handling. Otherwise, an error message is displayed.
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition);
    } else {
        document.getElementById("locationError").innerHTML = "Geolocation is not supported by this browser.";
    }
}

//Handles the current position of the device.
//First more information about the position such as the current address is retrieved and displayed.
//Then the emergency contact information about the current country is retrieved and displayed.
function handlePosition(position) {
    getCountryInformation(position).then(
        data => {
            let countryCode = data["address"]["country_code"];
            document.getElementById("locationCountry").textContent = data["address"]["country"];
            getEmergencyContacts(countryCode).then(
                emergencyContacts => {
                    document.getElementById("locationEmergencyContacts").innerHTML = handleEmergencyContacts(emergencyContacts);
                }
            );
            //Remove potential earlier error messages.
            document.getElementById("locationError").innerHTML = "";
        }
    ).catch(error => {
            console.log(error);
            document.getElementById("locationError").innerHTML = "Error: " + error.message;
        }
    );
}

//Uses the reverse geocoding API to retrieve data about the country (OSM object) from the position.
//Returns a promise containing the data or throws an error if something is wrong with the request.
function getCountryInformation(position) {
    return fetch(reverseGeocodingApiURL + `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Data not found');
                } else if (response.status === 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
}

//Function that handles the input of a selected country.
//Retrieves the selected country code and gets the emergency information for the country and displays it.
//On error, the error message is displayed.
function handleSelectedCountry() {
    getSelectedCountry().then(country => {
        document.getElementById("selectedCountry").innerHTML = country["country"];
        getEmergencyContacts(country["iso_code"]).then(emergencyContacts => {
                document.getElementById("selectedEmergencyContacts").innerHTML = handleEmergencyContacts(emergencyContacts);
                document.getElementById("selectedEmergencyContactsField").style.visibility = "visible";
            }
        )
        //Remove potential earlier error messages.
        document.getElementById("selectedError").innerHTML = "";
    }).catch(error => {
            console.log(error);
            document.getElementById("selectedError").innerHTML = "Error: " + error.message;
        }
    )
}

//Gets the country code of the country selected in the country select dropdown.
//Returns a promise containing the country code on success.
//Throws an error if an invalid country is selected.
function getSelectedCountry() {
    const selectedCountry = document.getElementById("countrySearch").value;
    return fetch(countryCodesSource).then(response => {
        return response.json()
    }).then(dataJSON => {
        //Filtering for the country that matches the name of the selected country.
        const filteredData = dataJSON.filter(function (item) {
            return item["country"] === selectedCountry;
        })
        if (filteredData.length > 0) {
            return filteredData.at(0);
        } else {
            //No matching country found.
            throw Error("Invalid country selected");
        }
    });
}