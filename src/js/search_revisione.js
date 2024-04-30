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

        var numero = $('#numero').val();
        var targa = $('#targa').val();
        var dataRev = $('#dataRev').val();
        var esito = $('#esito').val();

        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            { action: 'read', numero: numero, targa: targa, dataRev: dataRev, esito: esito },
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

    $('#addForm').submit(function(e){
        e.preventDefault();
        var data = $(this).serialize() + '&action=create';

        $.ajax({
            url: 'server.php',
            method: 'POST',
            data: data,
            success: function(response) {
                if(response === 'success') {
                    loadProducts();
                } else {
                    alert('Failed to add product');
                }
            }
        });
    });

    $(document).on('click', '.deleteBtn', function(){
        var id = $(this).data('id');

        $.ajax({
            url: 'server.php',
            method: 'POST',
            data: {id: id, action: 'delete'},
            success: function(response) {
                if(response === 'success') {
                    $('#productTable').empty();
                    loadProducts();
                } else {
                    alert('Failed to delete product');
                }
            }
        });
    });
});

// Function to handle click event
$(document).on('click', '.telaioLink', function(e) {
    e.preventDefault();
    var telaio = $(this).text();

    handleAjaxRequest(
        '../php/search_targa.php',
        'POST',
        { action: 'read', numero: numero, targa: targa, dataRev: dataRev, esito: esito },
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