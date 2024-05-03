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
        console.log(formData);
        var targa = $('#addTarga').val();
        var dataRev = $('#addDataRev').val();
        var checkOnFields = false;

        handleAjaxRequest(
            '../php/search_targa_api.php',
            'POST',
            {targa: targa, telaio: "", status: "both"},
            function(response) {

                if (response.success === true) {
                    var dataEm = response.data[0]['dataEm'];
                    var dataRes = response.data[0]['dataRes'];
                    var dataEmObj = new Date(dataEm);
                    var dataResObj = new Date(dataRes);
                    var dataRevObj = new Date(dataRev);
                    if (dataRevObj < dataEmObj) {
                        confirm("Data di revisione antecedente alla data di emissione della targa associata");
                    } else if (dataRevObj > dataResObj) {
                        confirm("Data di revisione posteriore alla data di restituzione della targa associata");
                    } else {
                        checkOnFields = true;
                    }
                }
                else {
                    confirm("Targa non presente nel database");
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                $('#searchResults').html('<p>Error occurred while fetching data.</p>');
            }
        )
        
        console.log(checkOnFields);
        /*handleAjaxRequest(
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
        );*/

    });

    function formatDate(dateString) {
        var parts = dateString.split("-");
        // Rearrange parts to get yyyy-mm-dd format
        return parts[2] + '-' + parts[1] + '-' + parts[0];
    }

    $('#editForm').submit(function(e){
        e.preventDefault();
        var formData = $(this).serialize() +  '&action=update';
        console.log(formData);
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
        var confirmed = confirm("Are you sure you want to delete this entry?");
        
        if (confirmed) {
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
        }
        
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
            motivazione = listItem.text().split('La motivazione: ')[1].split('EditDelete')[0];
        }
        //data = formatDate(data);
        // Populate form with data
        console.log(motivazione);
        $('#editId').val(id);
        $('#editDataRev').val(data);
        $('#editTarga').val(targa);
        $('#editEsito').val(esito);
        if (esito === 'negativo') {
            $('#editMotivazioneDiv').show();
        } else {
            $('#editMotivazioneDiv').hide();
        }
        $('#editMotivazione').val(motivazione);

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

