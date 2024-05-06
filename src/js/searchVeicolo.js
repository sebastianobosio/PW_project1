$(document).ready(function() {
    $('#searchForm').submit(function(event) {
        event.preventDefault();

        var formData = $(this).serialize();
        performSearch(formData);
    });

    function performSearch(formData) {
        handleAjaxRequest(
            '../php/search_veicolo.php',
            'GET',
            formData,
            function(response) {
                console.log('Response:', response.message);
                if (response.success === true) {
                    $('#searchResults').html(response.data);
                } else {
                    $('#searchResults').html('<p>Non sono state trovate corrispondenze</p>');
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                $('#searchResults').html('<p>Error occurred while fetching data.</p>');
            }
        )
    };

    function performDefaulSearch() {
        performSearch(null);
    };

    performDefaulSearch();
});