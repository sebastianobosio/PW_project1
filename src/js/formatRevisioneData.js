function formatRevisioneData(data) {
    $('#searchResults').empty();

    data.forEach(revisione => {
        const revisioneDiv = $('<div>').addClass('revisione');
        $('<div>').html('Revisione: <span class="numero">' + revisione.numero + '</span>').appendTo(revisioneDiv);
        $('<div>').html('Data della revisione: <span class="dataRev">' + revisione.dataRev + '</span>').appendTo(revisioneDiv);
        $('<div>').html('Targa associata: <span class="targa">' + revisione.targa + '</span>').appendTo(revisioneDiv);
        $('<div>').html('Esito: <span class="esito">' + revisione.esito + '</span>').appendTo(revisioneDiv);
        if (revisione.esito == 'negativo') {
            $('<div>').html('Motivazione: <span class="motivazione">' + revisione.motivazione + '</span>').appendTo(revisioneDiv);
        }
        //info buttons
        const informationBtnDiv = $('<div>').addClass('infoBtn');
        const veicoloButton = $('<button>').text('Dettaglio veicolo').addClass('veicolo-button');
        const targaButton = $('<button>').text('Dettaglio targa').addClass('targa-button');
        veicoloButton.appendTo(informationBtnDiv)
        targaButton.appendTo(informationBtnDiv);
        veicoloButton.on('click', function() {veicoloDaRevisioneBtnClicked(revisione)});
        targaButton.on('click', function() {targaDaRevisioneBtnClicked(revisione)});
        informationBtnDiv.appendTo(revisioneDiv);

        //Edit and remove buttons
        const editAndRemoveBtnDiv = $('<div>').addClass('edirmBtn');
        const editButton = $('<button>').text('Edit').addClass('edit-button');
        const removeButton = $('<button>').text('Remove').addClass('remove-button');
        editButton.appendTo(editAndRemoveBtnDiv)
        removeButton.appendTo(editAndRemoveBtnDiv);
        editButton.on('click', editBtnClicked(revisioneDiv));
        removeButton.on('click', deleteBtnClicked);
        editAndRemoveBtnDiv.appendTo(revisioneDiv);
        revisioneDiv.appendTo($('#searchResults'));
    });
}

function veicoloDaRevisioneBtnClicked(revisione) {
    console.log("sono qui");
    data = "targa=" + revisione.targa;
    handleAjaxRequest(
        '../php/search_targa.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
            if (response.success === true) {
                telaio = response.data[0].vehicle;
                console.log(data);
                handleAjaxRequest(
                    '../php/search_veicolo.php',
                    'GET',
                    "telaio=" + telaio,
                    function(response) {
                        if (response.success === true) {
                            formatVehicleData(response.data);
                        } else {
                            alert("Non sono state trovate corrispondenze");
                        }
                    },
                    function(xhr, status, error) {
                        console.error('Error', xhr.responseText);
                        alert("Error occurred while fetching data.");
                    }
                )
            } else {
                alert("No results found");
            } 
        },
        function(xhr, status, error) {
            console.error('Error', xhr.responseText);
            alert("Error occurred while fetching data.");
        }
    )
};    

function targaDaRevisioneBtnClicked(revisione) {
    console.log("sono qui");
    data = "targa=" + revisione.targa;
    handleAjaxRequest(
        '../php/search_targa.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
            if (response.success === true) {
                formatTargaData(response.data);
            } else {
                alert("Non sono state trovate corrispondenze");
            }
        },
        function(xhr, status, error) {
            console.error('Error', xhr.responseText);
            alert("Error occurred while fetching data.");
        }
    )
    console.log("bho");
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

function editBtnClicked(revisioneDiv) {
    var listItem = revisioneDiv;
    var id = listItem.find('.numero');
    var data = listItem.find('.dataRev');
    var targa = listItem.find('.targa');
    var esito = listItem.find('.esito');
    var motivazione = esito === 'negativo' ? listItem.find('.motivazione') : '';
    $('#editId').val(id);
    $('#editDataRev').val(data);
    $('#editTarga').val(targa);
    $('#editEsito').val(esito);
    $('#editMotivazione').val(motivazione);
    $('#editMotivazioneDiv').toggle(esito === 'negativo');
    $('.addForm').hide();
    $('.editForm').show();            
}