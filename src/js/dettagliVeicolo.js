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

                targhe = [];
                if (targaResponse.success == true) {
                    (targaResponse.data).forEach(targa => {
                        console.log(targa);
                        targhe.push(targa.numero);
                        targaComponent = renderTarga(targa);
                        targaComponent.appendTo($('#targheAssociate'));
                    });
                } else {
                    $('#targheAssociate').html('<p>Questo veicolo non è ancora stato targato</p>');
                }
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

    // Get car ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const veicoloNumber = urlParams.get('id');
    
    // Fetch car details based on the ID
    fetchVeicoloDetails(veicoloNumber);
});

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