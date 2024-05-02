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
        var formData = $(this).serialize() + '&action=create';
        var numero = $('#numero').val();
        var targa = $('#targa').val();
        var dataRev = $('#dataRev').val();
        var esito = $('#esito').val();

        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            //{ action: 'delete', numero: numero, targa: targa, dataRev: dataRev, esito: esito },
            formData,
            function(response) {
                console.log('Response:', response.message);
                if (response.success === true) {
                    $('#searchResults').html('<p>Istanza insserita correttamente</p>');
                } else {
                    $('#searchResults').html('<p>Non è stato possibile inserire la revisione</p>');
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                $('#searchResults').html('<p>Error occurred while fetching data.</p>');
            }
        );

    });

    $('#editForm').submit(function(e){
        e.preventDefault();
        var id = $(this).closest('li').data('id');
        var formData = $(this).serialize() + '&id=' + id + '&action=update';
        var numero = $('#numero').val();
        var targa = $('#targa').val();
        var dataRev = $('#dataRev').val();
        var esito = $('#esito').val();

        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            //{ action: 'delete', numero: numero, targa: targa, dataRev: dataRev, esito: esito },
            formData,
            function(response) {
                console.log('Response:', response.message);
                if (response.success === true) {
                    $('#searchResults').html('<p>Istanza modificata correttamente</p>');
                } else {
                    $('#searchResults').html('<p>Non è stato possibile modificare la revisione</p>');
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                $('#searchResults').html('<p>Error occurred while fetching data.</p>');
            }
        );

    });

    $(document).on('click', '.deleteBtn', function(){
        var id = $(this).closest('li').data('id');
        
        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            { action: 'delete', id: id},
            function(response) {
                console.log('Response:', response.message);
                if (response.success === true) {
                    $('#searchResults').html('<p>Elemento rimosso<p>');
                    //Potrebbe essere intelligente separare la funzione per il read del db
                    //loadProducts();
                } else {
                    $('#searchResults').html('<p>Impossibile rimuovere il prodotto</p>');
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                $('#searchResults').html('<p>Error occurred while fetching data.</p>');
            }
        );
    });

    $(document).on('click', '.editBtn', function(){
        var id = $(this).closest('li').data('id');
        var listItem = $(this).closest('li');
        var data = listItem.text().split('fatta il ')[1].split(' alla targa ')[0];
        console.log(data);
        var targa = listItem.text().split('targa ')[1].split(',')[0];
        var esito = listItem.text().includes('esito positivo') ? 'positivo' : 'negativo';
        var motivazione = '';
        if (esito === 'negativo') {
            motivazione = listItem.text().split('La motivazione: ')[1];
        }

        // Populate form with data
        $('#editId').val(id);
        $('#editData').val(data);
        $('#editTarga').val(targa);
        $('#editEsito').val(esito);
        $('#editMotivazione').val(motivazione);

        // Show motivazione field if esito is negativo
        if (esito === 'negativo') {
            $('#editMotivazioneDiv').show();
        } else {
            $('#editMotivazioneDiv').hide();
        }

        // Hide add form, show edit form
        $('.addForm').hide();
        $('.editForm').show();            
    });

    $('#addEsito').change(function(){
        console.log("Change event detected");
        console.log($(this).val());
        if($(this).val() === 'negativo'){
            $('#addMotivazioneDiv').show();
            $('#addMotivazione').attr('required', true);
        } else {
            $('#addMotivazioneDiv').hide();
            $('#addMotivazione').attr('required', false);
        }
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

