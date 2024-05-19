export function handleResponse(response, successMessage, callback) {
    console.log("Response:", response.message);
    if (response.success === true) {
        alert(successMessage);
        console.log("asdfasf" + callback);
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
