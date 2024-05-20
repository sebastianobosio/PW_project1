function handleAjaxRequest(url, method, data, successCallback, errorCallback) {
    $.ajax({
        url: url,
        method: method,
        dataType: "json",
        data: data,
        success: successCallback,
        error: errorCallback
    });
}
