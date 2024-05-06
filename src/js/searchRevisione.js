$(document).ready(function() {
    $('#searchForm').submit(searchFormSubmitted);
    $('#addForm').submit(addFormSubmitted);
    $('#editForm').submit(editFormSubmitted);
    $(document).on('click', '.deleteBtn', deleteBtnClicked);
    $(document).on('click', '.editBtn', editBtnClicked);
    $('#addEsito').change(addEsitoChanged); // need to be copied for the #editEsitoS
    $(document).on('click', '.addButton', addButtonClicked);

    performDefaultSearch();

    function searchFormSubmitted(event) {
        event.preventDefault();
        var formData = $(this).serialize() + "&action=read";
        performSearch(formData);
    }

    function addFormSubmitted(event) {
        event.preventDefault();
        var formData = $(this).serialize() + '&action=create';
        var targa = $('#addTarga').val();
        var dataRev = $('#addDataRev').val();
        checkRevisionAndPerformAction(formData, targa, dataRev, performAddAction);
    }

    function editFormSubmitted(event) {
        event.preventDefault();
        var formData = $(this).serialize() + '&action=update';
        var targa = $('#editTarga').val();
        var dataRev = $('#editDataRev').val();
        checkRevisionAndPerformAction(formData, targa, dataRev, performEditAction);
    }

    function checkRevisionAndPerformAction(formData, targa, dataRev, actionCallback) {
        handleAjaxRequest(
            '../php/search_targa.php',
            'GET',
            "targa=" + targa,
            function(response) {
                if (response.success === true) {
                    var dataEm = response.data[0]['dataEm'];
                    var dataRes = response.data[0]['dataRes'];
                    var dataEmObj = new Date(dataEm);
                    var dataResObj = new Date(dataRes);
                    var dataRevObj = new Date(dataRev);
                    if (dataRevObj < dataEmObj) {
                        alert("Data di revisione antecedente alla data di emissione della targa associata");
                    } else if (dataRevObj > dataResObj) {
                        alert("Data di revisione posteriore alla data di restituzione della targa associata");
                    } else {
                        actionCallback(formData);
                    }
                } else {
                    alert("Targa non presente nel database");
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                alert("Error occurred while fetching data.");
            }
        );
    }

    function performAddAction(formData) {
        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            formData,
            function(response) {
                handleResponse(response, "Istanza inserita correttamente");
            },
            function(xhr, status, error) {
                handleAjaxError(xhr.responseText);
            }
        );
    }

    function performEditAction(formData) {
        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            formData,
            function(response) {
                handleResponse(response, "Istanza modificata correttamente");
            },
            function(xhr, status, error) {
                handleAjaxError(xhr.responseText);
            }
        );
    }

    function handleResponse(response, successMessage) {
        console.log('Response:', response.message);
        if (response.success === true) {
            alert(successMessage);
            performDefaultSearch();
        } else {
            alert("Operazione non riuscita");
        }
    }

    function deleteBtnClicked() {
        var id = $(this).closest('li').data('id');
        var confirmed = confirm("Are you sure you want to delete this entry?");
        if (confirmed) {
            handleAjaxRequest(
                '../php/search_revisione.php',
                'POST',
                { action: 'delete', id: id},
                function(response) {
                    handleResponse(response, "Elemento rimosso");
                },
                function(xhr, status, error) {
                    handleAjaxError(xhr.responseText);
                }
            );
        }
    }

    function editBtnClicked() {
        var listItem = $(this).closest('li');
        var id = listItem.data('id');
        var data = listItem.text().split('fatta il ')[1].split(' alla targa ')[0];
        var targa = listItem.text().split('targa ')[1].split(',')[0];
        var esito = listItem.text().includes('esito positivo') ? 'positivo' : 'negativo';
        var motivazione = esito === 'negativo' ? listItem.text().split('La motivazione: ')[1].split('EditDelete')[0] : '';
        $('#editId').val(id);
        $('#editDataRev').val(data);
        $('#editTarga').val(targa);
        $('#editEsito').val(esito);
        $('#editMotivazione').val(motivazione);
        $('#editMotivazioneDiv').toggle(esito === 'negativo');
        $('.addForm').hide();
        $('.editForm').show();            
    }

    function addEsitoChanged() {
        $('#addMotivazioneDiv').toggle($(this).val() === 'negativo');
        $('#addMotivazione').prop('required', $(this).val() === 'negativo');
    }

    function addButtonClicked() {
        $('.addForm').show();
        $('.editForm').hide(); 
    }

    function performDefaultSearch() {
        var data = "&action=read";
        performSearch(data);
    }

    function performSearch(data) {
        handleAjaxRequest(
            '../php/search_revisione.php',
            'GET',
            data,
            function(response) {
                if (response.success === true) {
                    formatRevisioneData(response.data);
                } else {
                    alert("Non sono state trovate corrispondenze");
                }
            },
            function(xhr, status, error) {
                handleAjaxError(xhr.responseText);
            }
        );
    }

    function handleAjaxError(responseText) {
        console.error('Error', responseText);
        alert("Error occurred while fetching data.");
    }

});