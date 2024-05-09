function renderTargaData(targa) {
    const targaComponent = createTargaComponent(targa);
    return targaComponent;
}

function createTargaComponent(targa) {
    const targaDiv = $('<div>').addClass('targa');
    const targaNumberDiv = $('<div>').text('Targa: ' + targa.numero).appendTo(targaDiv);
    const dataEmDiv = $('<div>').text('Data di Emissione: ' + targa.dataEm).appendTo(targaDiv);
    if (targa.status == 'non-active') {
        const vehicle = $('<div>').text('Ultimo veicolo: ' + targa.vehicle).appendTo(targaDiv);
        const dataRes = $('<div>').text('Data di restituzione: ' + targa.dataRes).appendTo(targaDiv);
    } else if (targa.status == 'active') {
        const vehicle = $('<div>').text('Veicolo associato: ' + targa.vehicle).appendTo(targaDiv);
    }
    const detailsBtnDiv = $('<div>').addClass('infoBtn');
    const detailsButton = $('<button>').text('Dettaglio veicolo').addClass('veicolo-button');
    detailsButton.appendTo(detailsBtnDiv);
    detailsButton.on('click', function() {detailsBtnClicked(targa)});
    detailsBtnDiv.appendTo(targaDiv);

    return targaDiv;
}

function detailsBtnClicked(targa) {
    console.log("sono qui");
    viewPlateDetails(targa);
    data = "telaio=" + targa.vehicle;
    /*handleAjaxRequest(
        '../php/search_veicolo.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
            if (response.success === true) {
                $('#searchResults').load('targa_dettagli.php?id=' + targa);
                //formatVehicleData(response.data);
                
            } else {
                alert("Non sono state trovate corrispondenze");
            }
        },
        function(xhr, status, error) {
            console.error('Error', xhr.responseText);
            alert("Error occurred while fetching data.");
        }
    )*/
};    

function viewPlateDetails(targa) {
    window.location.href = '/pages/targa/targa_dettagli.php?id=' + targa.numero;
}