$(document).ready(function() {
    $('#addForm').submit(addFormSubmitted);
    $('#addEsito').change(addEsitoChanged); // need to be copied for the #editEsitoS
    // Function to fetch car details based on ID
    async function fetchVeicoloDetails(id) {
        console.log(id);
        try {
            const veicoloResponse = await new Promise((resolve, reject) => {
                handleAjaxRequest(
                    '/php/search_veicolo.php', // URL to fetch car details from the server
                    'GET',
                    'telaio=' + id,
                    resolve,
                    reject
                );
            });
            if (veicoloResponse.success == true) {
                console.log(veicoloResponse.data[0]);
                const veicolo = veicoloResponse.data[0];
                $('#titolo').html('<h1>Dettagli sul veicolo ' + veicolo.telaio + '</h1>');
                const veicoloComponent = renderVeicoloDetail(veicolo);
                veicoloComponent.appendTo($('#veicolo'));

                const targaResponse = await new Promise((resolve, reject) => {
                    handleAjaxRequest(
                        '/php/search_targa.php',
                        'GET',
                        "telaio=" + veicolo.telaio,
                        resolve,
                        reject
                    );
                });
                var state = false;
                //targhe = []; it's global
                if (targaResponse.success == true) {
                    var length = targaResponse.data.length;
                    var targaText = length === 1 ? 'è associata ' + length + ' targa' : 'sono associate ' + length + ' targhe';
                    $('.targa .titolo').html('<h3>A questo veicolo ' + targaText + '</h3>');
                    (targaResponse.data).forEach(targa => {
                        console.log(targa);
                        if (targa.status == 'active') {
                            targaAttiva = targa;
                            state = true;
                        }
                        // here i could save targhe infos and sort them to find the active one and put it first, but i'm lazy :) 
                        // better if done in the backend. I actually done it
                        targhe.push(targa.numero);
                        targaComponent = renderTargaCard(targa);
                        targaComponent.appendTo($('#targa'));
                    });
                } else {
                    $('.targa .titolo').html('<h3>Questo veicolo non è ancora stato targato</h3>')
                }
                toggleFormVisibility(state);
                loadRevisioniDiv();
                // non devo più fare la richiesta per ottenere le targhe, le ho già da prima
                
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
            prepareForm(targaAttiva.numero) // Show the form
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
          var formData = $(this).serialize() + "&addTarga=" + targaAttiva.numero + '&action=create' ;
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


    var targaAttiva = null;
    // Fetch car details based on the ID
    fetchVeicoloDetails(veicoloNumber);
});

// Get car ID from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const veicoloNumber = urlParams.get('id');
const targhe = [];

function returnToMotherPage() {
    var motherURL = '/pages/veicoli.php'
    window.location.href = motherURL;
}

async function loadRevisioniDiv() {
    var div = '#revisione';
    $(div).empty();
    try {
        const revisioneResponse = await new Promise((resolve, reject) => {
            handleAjaxRequest(
                '/php/search_revisione.php',
                'GET',
                "targhe=" + targhe + "&action=read-array",
                resolve,
                reject
            );  
        });
        if (revisioneResponse.success == true) {
            var length = revisioneResponse.data.length;
            var revisionText = length === 1 ? 'è associata ' + length + ' revisione' : 'sono associate ' + length + ' revisioni';
            $('.revisione .titolo').html('<h3>A questo veicolo ' + revisionText + '</h3>');
            (revisioneResponse.data).forEach(async revisione => {
                console.log(revisione);
                revisioneComponent = await renderRevisioneCard(revisione);
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