//API for doing reverse geocoding (location -> country) from openstreetmap
const reverseGeocodingApiURL = "https://nominatim.openstreetmap.org/reverse"

let countryCode = "US";
let conceptName = $('#aioConceptName').find(":selected").text();

//Gets the current location of the device if supported
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePosition);
    } else {
        document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
    }
}

//Handles the position by displaying it and retrieving the country for the position
function handlePosition(position) {
    document.getElementById("location").innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
    getCountryFromPosition(position);
}

//Uses the reverse geocoding API to retrieve the country from the position
function getCountryFromPosition(position) {
    fetch(reverseGeocodingApiURL + `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
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
            document.getElementById("geocodingDump").textContent = JSON.stringify(data);
            countryCode = data["address"]["country_code"];
            document.getElementById("countryCode").innerHTML = countryCode;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}