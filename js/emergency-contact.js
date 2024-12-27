//Since the API for emergency contacts does not send CORS headers in the reply, the request is sent over a cors-anywhere
//proxy server that just adds a CORS header. Optionally could also host cors-anywhere on an own server or download open-source database of emergencynumerapi.com
//Sources: https://emergencynumberapi.com/, https://github.com/Rob--W/cors-anywhere
const emergencyContactsApiURL = "https://cors-anywhere.herokuapp.com/https://emergencynumberapi.com/api/country/";

const outputElement = document.getElementById('output');

function getEmergencyContacts() {
    fetch(emergencyContactsApiURL + countryCode)
        .then(response => {
            if (!response.ok) {
                document.getElementById("output").innerHTML = response.message;
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
            outputElement.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function handleEmergencyContacts(emergencyContact) {
    let emergencyContactJSON = JSON.parse(emergencyContact);
    if (emergencyContactJSON["localOnly"]) {
        return "<p>You need to contact local emergency contacts. There is no service for all of the country.</p>"
    } else if (hasDispatchNumber(emergencyContactJSON)) {

    }

    let emergencyString = "<dl>";
    emergencyString += policeInformation(emergencyContactJSON);
    emergencyString += fireInformation(emergencyContactJSON);
    emergencyString += ambulanceInformation(emergencyContactJSON);

    return emergencyString;
}

function policeInformation(emergencyContactJSON) {
    let returnString = "<dt> Police:";
    fetch(emergencyContactJSON).then(
        response => response.json()
    )

    return returnString + "</dt>";
}

function fireInformation(emergencyContactJSON) {
    return "";
}

function ambulanceInformation(emergencyContactJSON) {
    return "";
}

function hasDispatchNumber(emergencyContactJSON) {
    return false;
}
