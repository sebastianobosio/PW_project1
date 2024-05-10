$(document).ready(function() {
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
                const targaComponent = renderTarga(targa);
                targaComponent.appendTo($('#targa'));

                const veicoloResponse = await new Promise((resolve, reject) => {
                    handleAjaxRequest(
                        '/php/search_veicolo.php',
                        'GET',
                        "telaio=" + targa.vehicle,
                        resolve,
                        reject
                    );
                });
                if (veicoloResponse.success == true) {
                    veicolo = veicoloResponse.data[0];
                    veicoloComponent = renderVeicolo(veicolo);
                    veicoloComponent.appendTo($('#veicoloAssociato'));
                } else {
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

    // Get car ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const targaNumber = urlParams.get('id');
    
    // Fetch car details based on the ID
    fetchTargaDetails(targaNumber);
});

function returnToMotherPage() {
    var motherURL = '/pages/targhe.php'
    window.location.href = motherURL;
}

async function loadRevisioniDiv() {
    div = '#revisioniAssociate';
    $(div).empty();
    try {
        const revisioneResponse = await new Promise((resolve, reject) => {
            handleAjaxRequest(
                '/php/search_revisione.php',
                'GET',
                "targa=" + targa.numero + "&action=read",
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