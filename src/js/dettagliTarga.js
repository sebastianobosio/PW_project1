$(document).ready(function() {
    $('#addForm').submit(addFormSubmitted);
    $('#addEsito').change(addEsitoChanged); // need to be copied for the #editEsitoS
    
    // Function to fetch car details based on ID
    async function fetchTargaDetails(id) {
        console.log(id);
        try {
            const targaResponse = await new Promise((resolve, reject) => {
                handleAjaxRequest(
                    '/php/search_targa.php', // URL to fetch car details from the server
                    'GET',
                    "targa=" + id,
                    resolve,
                    reject
                );
            });
            if (targaResponse.success == true) {
                console.log(targaResponse.data[0]);
                const targa = targaResponse.data[0];
                const targaStatus = targa.status;
                const formState = targaStatus == 'active';
                toggleFormVisibility(formState);
                $('#titolo').html('<h1>Dettagli sulla targa ' + targa.numero + '</h1>');
                const targaComponent = renderTargaDetail(targa);
                targaComponent.appendTo($('#targa'));

                const veicoloResponse = await new Promise((resolve, reject) => {
                    handleAjaxRequest(
                        '/php/search_veicolo.php',
                        'GET',
                        "telaio=" + targa.veicolo,
                        resolve,
                        reject
                    );
                });
                if (veicoloResponse.success == true) {
                    veicolo = veicoloResponse.data[0];
                    veicoloComponent = renderVeicoloCard(veicolo);
                    if (formState) {
                        $('.veicolo .titolo').html('<h3>Veicolo attualmente associato</h3>')
                    } else {
                        $('.veicolo .titolo').html('<h3>Ultimo veicolo associato</h3>')
                    }
                    veicoloComponent.appendTo($('#veicolo'));
                } else {
                    $('.veicolo .titolo').html('<h3>Nessun veicolo associato. Strano!</h3>')
                    // render niente veicolo per questa targa
                    // non dovrebbe mai accadere. Ogni targa ha almeno un veicolo per costruzione del db
                }
                
                loadRevisioniDiv();
                
            } else {
                alert("Non sono state trovate corrispondenze");
                returnToMotherPage();
            }
        } catch (error) {
            console.error('Error', error);
            alert("Error occurred while fetching data.");
        }
    }
    
    function toggleFormVisibility(state) {
        if (state) {
          $('#addButton').show();
          prepareForm(targaNumber) // Show the form
        } else {
          $('#addButton').hide(); // Hide the form
        }
    }
    
    function prepareForm(targaValue) {
        $('#addTarga').val(targaValue);
        $('#addTarga').prop('disabled', true);
    }

    async function addFormSubmitted(event) {
        event.preventDefault();
        var formData = $(this).serialize() + "&addTarga=" + targaNumber + '&action=create' ;
        console.log(formData);
        var targa = $('#addTarga').val();
        var dataRev = $('#addDataRev').val();
        if (await checkRevision(targa, dataRev)) {
            performAddAction(formData);
        }
    }

    function performAddAction(formData) {
        handleAjaxRequest(
            '/php/search_revisione.php',
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

    function handleResponse(response, successMessage) {
        console.log('Response:', response.message);
        if (response.success === true) {
            alert(successMessage);
            loadRevisioniDiv();
        } else {
            alert("Operazione non riuscita");
        }
    }

    function handleAjaxError(responseText) {
        console.error('Error', responseText);
        alert("Error occurred while fetching data.");
    }

    function addEsitoChanged() {
        $('#addMotivazioneDiv').toggle($(this).val() === 'negative');
        $('#addMotivazione').prop('required', $(this).val() === 'negative');
    }
    // Fetch car details based on the ID
    fetchTargaDetails(targaNumber);
});

const urlParams = new URLSearchParams(window.location.search);
const targaNumber = urlParams.get('id'); //global variable

function returnToMotherPage() {
    var motherURL = '/pages/targhe.php'
    window.location.href = motherURL;
}

async function loadRevisioniDiv() {
    div = '#revisione';
    $(div).empty();
    var targa = targaNumber;
    try {
        const revisioneResponse = await new Promise((resolve, reject) => {
            handleAjaxRequest(
                '/php/search_revisione.php',
                'GET',
                "targa=" + targa + "&action=read",
                resolve,
                reject
            );  
        });
        if (revisioneResponse.success == true) {
            var length = revisioneResponse.data.length;
            var revisionText = length === 1 ? 'è associata ' + length + ' revisione' : 'sono associate ' + length + ' revisioni';
            $('.revisione .titolo').html('<h3>A questa targa ' + revisionText + '</h3>');
            (revisioneResponse.data).forEach(async revisione => {
                console.log("ciao");
                revisioneComponent = await renderRevisioneCard(revisione);
                console.log("ciao");
                revisioneComponent.appendTo($(div));
            });
        } else {
            $('.revisione .titolo').html('<h3>A questa targa non sono associate revisioni</h3>')
        }
    } catch (error) {
        console.error('Error', error);
        alert("Error occurred while fetching data.");
    }
}