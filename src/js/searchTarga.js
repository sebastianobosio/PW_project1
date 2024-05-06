$(document).ready(function() {
    // Handle form submission
    $('#searchForm').submit(function(event) {
        // Prevent default form submission
        event.preventDefault();
        // Get form data
        var formData = $(this).serialize();
        performSearch(formData);
    });

    function performSearch(formData) {
        handleAjaxRequest(
            '../php/search_targa.php',
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

    //reload elements on page load
    function performDefaulSearch() {
        performSearch(null);
    };

    performDefaulSearch();
});