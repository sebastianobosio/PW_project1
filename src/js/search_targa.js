$(document).ready(function() {
    // Handle form submission
    $('#searchForm').submit(function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Get form data
        var targa = $('#targa').val();
        var telaio = $('#telaio').val();
        var status = $('#status').val();

        // Send AJAX request
        $.ajax({
            url: '../php/search_targa.php', // PHP script to handle the search
            method: 'POST',
            dataType: 'json',
            data: {
                targa: targa,
                telaio: telaio,
                status: status
            },
            success: function(response) {
                // Handle success
                // You can display the search results here
                console.log(response);
            },
            error: function(xhr, status, error) {
                // Handle errors
                console.error(xhr.responseText);
            }
        });
    });
});