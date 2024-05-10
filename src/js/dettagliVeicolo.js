$(document).ready(function() {
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
                const veicoloComponent = renderVeicolo(veicolo);
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
                    (targaResponse.data).forEach(targa => {
                        console.log(targa);
                        if (targa.status == 'active') {
                            targaAttiva = targa;
                            state = true;
                        }
                        targhe.push(targa.numero);
                        targaComponent = renderTarga(targa);
                        targaComponent.appendTo($('#targheAssociate'));
                    });
                } else {
                    $('#targheAssociate').html('<p>Questo veicolo non è ancora stato targato</p>');
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
            $('#addForm').show();
            prepareForm(targaAttiva.numero) // Show the form
          } else {
            $('#addForm').hide(); // Hide the form
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
          $('#addMotivazioneDiv').toggle($(this).val() === 'negativo');
          $('#addMotivazione').prop('required', $(this).val() === 'negativo');
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
    var div = '#revisioniAssociate';
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
            (revisioneResponse.data).forEach(async revisione => {
                console.log(revisione);
                revisioneComponent = await renderRevisione(revisione);
                revisioneComponent.appendTo($(div));
            });
        } else {
            $(div).html('<p>Niente revisioni per questa targa</p>')
        }
    } catch (error) {
        console.error('Error', error);
        alert("Error occurred while fetching data.");
    }
    
}