function performSearch(data) {
    handleAjaxRequest(
        '../php/search_revisione.php',
        'GET',
        data,
        function(response) {
            if (response.success === true) {
                formatRevisioneData(response.data, performSearch, data);
            } else {
                alert("Non sono state trovate corrispondenze");
            }
        },
        function(xhr, status, error) {
            handleAjaxError(xhr.responseText);
        }
    );
}