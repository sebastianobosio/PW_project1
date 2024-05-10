$(document).ready(function() {
    // Function to fetch car details based on ID
    async function fetchRevisioneDetails(id) {
        console.log(id);
        try {
            const revisioneResponse = await new Promise((resolve, reject) => {
                handleAjaxRequest(
                    '/php/search_revisione.php', // URL to fetch car details from the server
                    'GET',
                    "numero=" + id + "&action=read",
                    resolve,
                    reject
                );
            });
            if (revisioneResponse.success == true) {
                console.log(revisioneResponse.data[0]);
                const revisione = revisioneResponse.data[0];
                $('#titolo').html('<h1>Dettagli sulla revisione ' + revisione.numero + '</h1>');
                const revisioneComponent = await renderRevisione(revisione);// here i shoul render it with a different style component
                revisioneComponent.appendTo($('#revisione'));

                const targaResponse = await new Promise((resolve, reject) => {
                    handleAjaxRequest(
                        '/php/search_targa.php',
                        'GET',
                        "targa=" + revisione.targa,
                        resolve,
                        reject
                    );
                });
                if (targaResponse.success == true) {
                    targa = targaResponse.data[0];
                    targaComponent = renderTarga(targa);
                    targaComponent.appendTo($('#targaAssociata'));
                } else {
                    // render niente veicolo per questa targa
                    // non dovrebbe mai accadere. Ogni revisione ha la sua targa per costruzione del db
                }

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
                    veicoloComponent.appendTo($('#veicoloAssociato'))
                } else {
                    // render niente veic   olo per questa targa
                    // non dovrebbe mai accadere. Ogni targa ha il suo veicolo per costruzione del db
                }
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
    const revisioneNumber = urlParams.get('id');
    
    // Fetch car details based on the ID
    fetchRevisioneDetails(revisioneNumber);
});

function returnToMotherPage() {
    var motherURL = '/pages/targhe.php'
    window.location.href = motherURL;
}