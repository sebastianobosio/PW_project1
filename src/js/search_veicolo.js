// Function to handle AJAX request
function handleAjaxRequest(url, method, data, successCallback, errorCallback) {
    $.ajax({
        url: url,
        method: method,
        dataType: 'json',
        data: data,
        success: successCallback,
        error: errorCallback
    });
}

// Function to handle form submission
$(document).ready(function() {
    $('#searchForm').submit(function(event) {
        event.preventDefault();

        var telaio = $('#telaio').val();
        var modello = $('#modello').val();
        var marca = $('#marca').val();

        handleAjaxRequest(
            '../php/search_veicolo.php',
            'POST',
            { telaio: telaio, modello: modello, marca: marca },
            function(response) {
                console.log('Response:', response.data);
                $('#searchResults').html(response.data);
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                $('#searchResults').html('<p>Error occurred while fetching data.</p>');
            }
        );
    });
});

// Function to handle click event
$(document).on('click', '.telaioLink', function(e) {
    e.preventDefault();
    var telaio = $(this).text();

    handleAjaxRequest(
        '../php/search_targa.php',
        'POST',
        { targa: "", telaio: telaio, status: "both" },
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
    );
});