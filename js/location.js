//API for doing reverse geocoding (location -> country) from openstreetmap
const reverseGeocodingApiURL = "https://nominatim.openstreetmap.org/reverse"

//Location of the data source for the mappings between countries and their respective country code.
//The source provided here is from https://gist.github.com/kalinchernev/486393efcca01623b18d and was updated a bit.
const countryCodesSource = "../resources/countryCodes.json"

let locationCountryCode = "US";
let selectedCountryCode = "US";

//Gets the current location of the device if supported
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition);
    } else {
        document.getElementById("locationError").innerHTML = "Geolocation is not supported by this browser.";
    }
}

//Handles the position by displaying it and retrieving the country for the position
function handlePosition(position) {
    //document.getElementById("location").innerHTML = "Latitude: " + position.coords.latitude +
    //    "<br>Longitude: " + position.coords.longitude;
    getCountryFromPosition(position).then(
    );
    sortCountryCodes()
}

//Uses the reverse geocoding API to retrieve the country from the position
function getCountryFromPosition(position) {
    return fetch(reverseGeocodingApiURL + `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
        .then(response => {
            if (!response.ok) {
                document.getElementById("dump").innerHTML = response.message;
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
        .then(data => {
            document.getElementById("country").textContent = data["address"]["country"];
            //document.getElementById("geocodingDump").textContent = JSON.stringify(data);
            locationCountryCode = data["address"]["country_code"];
            document.getElementById("countryCode").innerHTML = locationCountryCode;
            getEmergencyContacts(locationCountryCode);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//Gets the country selected in the country select dropdown.
function getSelectedCountryCode() {
    const selectedCountry = document.getElementById("countrySearch").value;
    console.log(selectedCountry);
    return fetch(countryCodesSource).then(response => {
        return response.json()
    }).then(dataJSON => {
        console.log(JSON.stringify(dataJSON));
        const filteredData = dataJSON.filter(function (item) {
            return item["country"] === selectedCountry;
        })
        if (filteredData.length > 0) {
            return filteredData.at(0);
        } else {
            throw Error("Invalid country selected");
        }
    }).then(data => {
            selectedCountryCode = data["iso_code"]
            document.getElementById("selectedCountryCode").innerHTML = selectedCountryCode;
            getEmergencyContacts(selectedCountryCode);
        }
    )
}

function sortCountryCodes() {
    fetch(countryCodesSource).then(response => {
        return response.json()
    }).then(data => {
            data.sort(function (a, b) {
                return a["country"] < b["country"];
            })
            console.log(JSON.stringify(data));

        }
    )
}