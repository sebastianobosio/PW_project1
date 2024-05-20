export function handleResponse(response, successMessage, callback) {
    if (response.success === true) {
        alert(successMessage);
        // I don't always pass a function, sometime i use this only for the alert function
        if (typeof callback == "function") {
            callback();
        }
    } else {
        alert("Operazione non riuscita");
    }
}

export function handleAjaxError(responseText) {
    console.error("Error", responseText);
    alert("Error occurred while fetching data.");
}
