//Since the emergencynumberapi (https://emergencynumberapi.com/) does not send CORS headers in the reply,
//the data is stored locally. It might contain some errors or be incomplete.
//Because the site is hosted on github pages, the src path is appended by "/EmergencyInfo".
const emergencyContactsSource = "../EmergencyInfo/resources/emergencyContactData.json";

//Gets the emergency contact data, prepares them and passes them on for handling.
function getEmergencyContacts(countryCode) {
    return fetch(emergencyContactsSource)
        .then(response => {
            return response.json();
        })
        .then(responseJSON => {
            let data = responseJSON["data"];
            //Array storing the country that matches the country code that is searched for, if existing.
            const filteredData = data.filter(function (item) {
                return item["Country"]["ISOCode"] === countryCode.toUpperCase()
            });
            if (filteredData.length > 0) {
                return filteredData.at(0);
            } else {
                //There was no country with the currently selected countryID
                throw Error("Invalid country code");
            }
        })
}

//Handles the emergency contact data that was fetched.
function handleEmergencyContacts(emergencyContactJSON) {
    if (emergencyContactJSON["LocalOnly"]) {
        return `<span>You need to contact local emergency contacts. There is no service extending to all the country.</span>`;
    } else if (emergencyContactJSON["NoData"]) {
        return `<span>There is no data for the selected country.</span>`
    } else if (hasNumbersInCategory(emergencyContactJSON, "Dispatch")) {
        return getNumbersOfCategory(emergencyContactJSON, "Dispatch", "Dispatch Numbers");
    }

    //Otherwise get numbers for the services individually
    let emergencyString = `<dl>`;
    emergencyString += getPoliceInformation(emergencyContactJSON);
    if (emergencyContactJSON["Member_112"]) {
        //Formating for matching the pattern for get[Police|Fire|Ambulance]Information
        emergencyString += `<dt class="departmentLabel">Fire</dt><dd><dl><dt>All</dt><dd>112</dd></dl></dd>`;
        emergencyString += `<dt class="departmentLabel">Ambulance</dt><dd><dl><dt>All</dt><dd>112</dd></dl></dd>`;
    } else {
        emergencyString += getFireInformation(emergencyContactJSON);
        emergencyString += getAmbulanceInformation(emergencyContactJSON);
    }

    if (hasNumbersInCategory(emergencyContactJSON, "Traffic")) {
        emergencyString += getNumbersOfCategory(emergencyContactJSON, "Traffic", "Traffic");
    }
    return emergencyString + "</dl>";
}

//Gets information on the police emergency contact numbers
function getPoliceInformation(emergencyContactJSON) {
    return getNumbersOfCategory(emergencyContactJSON, "Police", "Police");
}

//Gets information on the fire emergency contact numbers
function getFireInformation(emergencyContactJSON) {
    return getNumbersOfCategory(emergencyContactJSON, "Fire", "Fire");
}

//Gets information on the ambulance emergency contact numbers
function getAmbulanceInformation(emergencyContactJSON) {
    return getNumbersOfCategory(emergencyContactJSON, "Ambulance", "Ambulance");
}

//Checks if the country has numbers in a certain category.
function hasNumbersInCategory(emergencyContactJSON, categoryName) {
    let hasNumbers = false;
    let category = emergencyContactJSON[categoryName];
    if (category) {
        for (const key in category) {
            if (Array.isArray(category[key]) && category[key].length > 0) {
                category[key].forEach(number => {
                    if (number != null && !isNaN(number) && number !== "") {// Ensure the number is not null
                        hasNumbers = true;
                    }
                });
                if (hasNumbers) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Function that retrieves numbers for a specific category and returns them in a descriptive list with keys and values.
// Returns an entry for a descriptive list (dl) with the label as dt and as dd a descriptive list
// with the numbers as key-value (dt-dd) pairs.
function getNumbersOfCategory(emergencyContactJSON, categoryName, label) {
    const dispatchNumbers = new Map();
    let dispatch = emergencyContactJSON[categoryName];
    if (dispatch) {
        for (const key in dispatch) {
            dispatchNumbers.set(key, dispatch[key]);
        }
    }
    let returnString = `<dt class="departmentLabel">${label}</dt><dd><dl>`;
    dispatchNumbers.forEach((value, key) => {
        if (value) {
            returnString += `<dt>${key}</dt> <dd>${value}</dd>`;
        }
    });
    return returnString += "</dl></dd>"
}
