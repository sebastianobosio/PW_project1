$(document).ready(function() {
    // Handle form submission
    $('#searchForm').submit(function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Get form data
        var telaio = $('#telaio').val();
        var modello = $('#modello').val();
        var marca = $('#marca').val();

        // Send AJAX request
        $.ajax({
            url: '../php/search_veicolo.php', // PHP script to handle the search
            method: 'POST',
            dataType: 'json',
            data: {
                telaio: telaio,
                modello: modello,
                marca: marca
            },
            success: function(response) {
                // Display search results
                $('#searchResults').html(response.message);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    });
});