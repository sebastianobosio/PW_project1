function formatRevisioneData(data, caller, callerData) {
    $('#searchResults').empty();

    data.forEach(async revisione => {
        const revisioneDiv = $('<div>').addClass('revisione');
        $('<div>').html('Revisione: <span class="numero">' + revisione.numero + '</span>').appendTo(revisioneDiv);
        //$('<div>').html('Data della revisione: <span class="dataRev">' + revisione.dataRev + '</span>').appendTo(revisioneDiv);
        $('<div>').html('Data della revisione: <span class="dataRev">' + '<input type="date" value="' + revisione.dataRev + '" disabled></input>' + '</span>').appendTo(revisioneDiv);
        $('<div>').html('Targa associata: <span class="targa">' + revisione.targa + '</span>').appendTo(revisioneDiv);
        //$('<div>').html('Esito: <span class="esito">' + revisione.esito + '</span>').appendTo(revisioneDiv);
        const esitoSelect = $('<select>').addClass('esito').prop('disabled', true); // Disable select element initially
        $('<option>').val('positivo').text('Positivo').appendTo(esitoSelect);
        $('<option>').val('negativo').text('Negativo').appendTo(esitoSelect);
        if (revisione.esito === 'positivo') {
            esitoSelect.val('positivo');
        } else if (revisione.esito === 'negativo') {
            esitoSelect.val('negativo');
        }
        console.log("porco dio");
        $('<div>').html('Esito: ').append(esitoSelect).appendTo(revisioneDiv);
        $('<div>').addClass('motivazioneDiv').css('display', 'none').html('Motivazione: <span class="motivazione"><input type="text" required disabled></input></span>').appendTo(revisioneDiv);
        if (revisione.esito == 'negativo') {
            revisioneDiv.find('.motivazioneDiv').toggle(revisione.esito === 'negativo');
            revisioneDiv.find('.motivazione input').val(revisione.motivazione);
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
        const editButton = await createEditButton(revisioneDiv);
        const removeButton = $('<button>').text('Remove').addClass('remove-button');
        editButton.appendTo(editAndRemoveBtnDiv)
        removeButton.appendTo(editAndRemoveBtnDiv);
        //editButton.on('click', editBtnClicked(revisioneDiv));
        removeButton.on('click', function() {deleteBtnClicked(revisioneDiv, caller, callerData)});
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

function deleteBtnClicked(revisioneDiv, caller, callerData) {
    var id = revisioneDiv.find('.numero').text();
    var confirmed = confirm("Are you sure you want to delete this entry?");
    if (confirmed) {
        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            { action: 'delete', id: id},
            function(response) {
                handleResponse(response, "Elemento rimosso");
                caller(callerData);
            },
            function(xhr, status, error) {
                handleAjaxError(xhr.responseText);
            }
        );
    }
}

function editEsitoChanged(revisioneDiv) {
    console.log("Esito ha cambiato stato: " + revisioneDiv.find('select.esito').val() == 'negativo');
    revisioneDiv.find('.motivazioneDiv').toggle(revisioneDiv.find('select.esito').val() == 'negativo');
    revisioneDiv.find('.motivazione input').prop('required', revisioneDiv.find('select.esito').val() == 'negativo');
    revisioneDiv.find('.motivazione input').prop('disabled', revisioneDiv.find('select.esito').val() == 'positivo');
    revisioneDiv.find('.motivazione input').prop('disabled', revisioneDiv.find('select.esito').val() == 'positivo');
}

async function createEditButton(revisioneDiv) {
    const editButton = $('<button>').text('Edit Fields');
    
    async function attachEditHandler() {
        const id = revisioneDiv.find('.numero').text();
        var OriginaldataRev = revisioneDiv.find('.dataRev input').prop('disabled', true).val();
        var Originaltarga = revisioneDiv.find('.targa').attr('contenteditable', false).text();
        var Originalesito = revisioneDiv.find('select.esito').prop('disabled', true).val();
        var Originalmotivazione = revisioneDiv.find('.motivazione input').prop('disabled', true).val();
        console.log("valori prima di cliccare l'edit: " + id + " " + OriginaldataRev + " " + Originaltarga + " " + Originalesito + " " + Originalmotivazione);
        editButton.off('click').on('click', async function() {
            revisioneDiv.find('.dataRev input').prop('disabled', false);
            revisioneDiv.find('.targa').attr('contenteditable', true);
            var esito = revisioneDiv.find('select.esito').prop('disabled', false).val();
            if (esito === 'negativo') {
                revisioneDiv.find('.motivazione input').prop('disabled', false);
            }
    
            revisioneDiv.find('select.esito').change(function() { editEsitoChanged(revisioneDiv); });
    
            editButton.text('Save Changes').off('click').on('click', async function() {
                const id = revisioneDiv.find('.numero').text();
                var dataRevObj = revisioneDiv.find('.dataRev input').prop('disabled', true)
                var targaObj = revisioneDiv.find('.targa').attr('contenteditable', false)
                var esitoObj = revisioneDiv.find('select.esito').prop('disabled', true)
                var motivazioneObj = revisioneDiv.find('.motivazione input').prop('disabled', true);
                var motivazione = motivazioneObj.val();
                var esito = esitoObj.val();                
                if (esito === 'negativo' && motivazione === "") {
                    alert("La motivazione non può essere nulla in caso di esito negativo");
                    motivazioneObj.prop('disabled', false); // Re-enable input
                    dataRevObj.prop('disabled', false);
                    targaObj.attr('contenteditable', true);
                    esitoObj.prop('disabled', false);
                    motivazioneObj.text(Originalmotivazione);
                    dataRevObj.val(OriginaldataRev);
                    targaObj.text(Originaltarga);
                    esitoObj.val(Originalesito);
                    if (Originalesito == 'positivo') {
                        motivazioneObj.prop('disabled', true)
                        revisioneDiv.find('.motivazioneDiv').toggle(revisioneDiv.find('select.esito').val() == 'negativo');
                    }
                    return false; // Prevent form submission
                }
              
                var targa = targaObj.text();
                var dataRev = dataRevObj.val();

                const dataUpdateRequest = "editId=" + id + "&editDataRev=" + dataRev + "&editTarga=" + targa + "&editEsito=" + esito + "&editMotivazione=" + motivazione + "&action=update";  
                
                if (await checkRevision(targa, dataRev)) {
                    try {
                        await saveChanges(dataUpdateRequest);
                        console.log("sono qui")
                        editButton.text('Edit Fields');
                        attachEditHandler();
                    } catch (error) {
                        console.log("non funziona un cazzo");
                    }
                    
                    console.log("aggiornare stato bottone");
                } else {
                    motivazioneObj.prop('disabled', false); // Re-enable input
                    dataRevObj.prop('disabled', false);
                    targaObj.attr('contenteditable', true);
                    esitoObj.prop('disabled', false);
                    motivazioneObj.text(Originalmotivazione);
                    dataRevObj.val(OriginaldataRev);
                    targaObj.text(Originaltarga);
                    esitoObj.val(Originalesito);
                    if (Originalesito == 'positivo') {
                        motivazioneObj.prop('disabled', true)
                        revisioneDiv.find('.motivazioneDiv').toggle(revisioneDiv.find('select.esito').val() == 'negativo');
                    }
                    return false;   
                }
            });
        });
    }
    
    await attachEditHandler();
    return editButton;
}

async function checkRevision(targa, dataRev) {
    return new Promise((resolve, reject) => {
        handleAjaxRequest(
            '../php/search_targa.php',
            'GET',
            "targa=" + targa,
            function(response) {
                if (response.success === true) {
                    const dataEm = response.data[0]['dataEm'];
                    const dataRes = response.data[0]['dataRes'];
                    const dataEmObj = new Date(dataEm);
                    const dataResObj = new Date(dataRes);
                    const dataRevObj = new Date(dataRev);
                    
                    if (dataRevObj < dataEmObj) {
                        alert("Data di revisione antecedente alla data di emissione della targa associata");
                        resolve(false);
                    } else if (dataRevObj > dataResObj) {
                        alert("Data di revisione posteriore alla data di restituzione della targa associata");
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                } else {
                    alert("Targa non presente nel database");
                    resolve(false);
                }
            },
            function(xhr, status, error) {
                console.error('Error', xhr.responseText);
                alert("Error occurred while fetching data.");
                resolve(false);
            }
        );
    });
}

async function saveChanges(dataUpdateRequest) {
    return new Promise((resolve, reject) => {
        handleAjaxRequest(
            '../php/search_revisione.php',
            'POST',
            dataUpdateRequest,
            function(response) {
                handleResponse(response, "Istanza modificata correttamente");
                resolve(response);
            },
            function(xhr, status, error) {
                handleAjaxError(xhr.responseText);
                resolve(error);
            }
        );
    });
}

function handleResponse(response, successMessage) {
    console.log('Response:', response.message);
    if (response.success === true) {
        alert(successMessage);
        //performDefaultSearch();
    } else {
        alert("Operazione non riuscita");
    }
}

function handleAjaxError(responseText) {
    console.error('Error', responseText);
    alert("Error occurred while fetching data.");
}
