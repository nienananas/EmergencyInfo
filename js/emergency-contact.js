//Since the emergencynumberapi (https://emergencynumberapi.com/) does not send CORS headers in the reply,
//the data is stored locally. It might contain some errors or be incomplete.
const emergencyContactsSource = "../resources/emergencyContactData.json";


function getEmergencyContacts() {
    fetch(emergencyContactsSource,)
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
                throw Error("Invalid country code");
            }
        })
        .then(data => {
            console.log(JSON.stringify(data, null, 2));
            document.getElementById("emergencyContactsDump").textContent = JSON.stringify(data, null, 2);
            document.getElementById("emergencyContacts").innerHTML = handleEmergencyContacts(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function handleEmergencyContacts(emergencyContactJSON) {
    if (emergencyContactJSON["localOnly"]) {
        return `<p>You need to contact local emergency contacts. There is no service extending to all the country.</p>`;
    } else if (hasDispatchNumbers(emergencyContactJSON)) {
        return getDispatchNumbers(emergencyContactJSON);
    }

    let emergencyString = "<dl>";
    emergencyString += policeInformation(emergencyContactJSON);
    emergencyString += fireInformation(emergencyContactJSON);
    emergencyString += ambulanceInformation(emergencyContactJSON);

    return emergencyString + "</dl>";
}

function policeInformation(emergencyContactJSON) {
    let returnString = "<dt> Police:";
    return returnString + "</dt>";
}

function fireInformation(emergencyContactJSON) {
    return "";
}

function ambulanceInformation(emergencyContactJSON) {
    return "";
}

function hasDispatchNumbers(emergencyContactJSON) {
    let hasDispatch = false;
    let dispatch = emergencyContactJSON["Dispatch"];
    if (dispatch) {
        for (const key in dispatch) {
            if (Array.isArray(dispatch[key]) && dispatch[key].length > 0) {
                dispatch[key].forEach(number => {
                    if (number != null && !isNaN(number) && number !== "") {// Ensure the number is not null
                        hasDispatch = true;
                    }
                });
                if (hasDispatch) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Function that retrieves dispatch numbers. Only works if hasDispatchNumbers has been called before.
function getDispatchNumbers(emergencyContactJSON) {
    const dispatchNumbers = new Map();
    let dispatch = emergencyContactJSON["Dispatch"];
    if (dispatch) {
        for (const key in dispatch) {
            dispatchNumbers.set(key, dispatch[key]);
        }
    }
    let returnString = "<p>Dispatch Numbers:</p><dl>";
    dispatchNumbers.forEach((value, key) => {
        if (value) {
            returnString += `<dt> ${key} </dt> <dd> ${value}</dd>`;
        }
    });
    return returnString += "</dl>"
}
