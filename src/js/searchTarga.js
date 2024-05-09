$(document).ready(function() {
    $('#searchForm').submit(searchFormSubmitted);

    performDefaulSearch();

    function searchFormSubmitted (event) {
        event.preventDefault();

        var formData = $(this).serialize();
        performSearch(formData);
    }

    function performSearch(formData) {
        handleAjaxRequest(
            '../php/search_targa.php',
            'GET',
            formData,
            function(response) {
                console.log('Response:', response.message);
                if (response.success === true) {
                    data = response.data;
                    $('#searchResults').empty();
                    data.forEach(targa => {
                        targaComponent = renderTargaData(targa);
                        targaComponent.appendTo($('#searchResults'));
                    });
                } else {
                    alert("Non sono state trovate corrispondenze");
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                alert("Error occurred while fetching data.");
            }
        )
    };

    //reload elements on page load
    function performDefaulSearch() {
        performSearch(null);
    };

});