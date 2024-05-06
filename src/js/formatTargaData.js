function formatTargaData(data) {
    $('#searchResults').empty();

    data.forEach(targa => {
        const targaDiv = $('<div>').addClass('targa');
        $('<div>').text('Targa: ' + targa.numero).appendTo(targaDiv);
        $('<div>').text('Data di Emissione: ' + targa.dataEm).appendTo(targaDiv);
        if (targa.status == 'non-active') {
            $('<div>').text('Ultimo veicolo: ' + targa.vehicle).appendTo(targaDiv);
            $('<div>').text('Data di restituzione: ' + targa.dataRes).appendTo(targaDiv);
        } else if (targa.status == 'active') {
            $('<div>').text('Veicolo associato: ' + targa.vehicle).appendTo(targaDiv);
        }
        const informationBtnDiv = $('<div>').addClass('infoBtn');
        const veicoloButton = $('<button>').text('Dettaglio veicolo').addClass('veicolo-button');
        const revisioneButton = $('<button>').text('Revisioni associate').addClass('revisione-button');
        veicoloButton.appendTo(informationBtnDiv)
        revisioneButton.appendTo(informationBtnDiv);

        veicoloButton.on('click', function() {veicoloDaTargaBtnClicked(targa)});
        revisioneButton.on('click', revisioneDaTargaBtnClicked);
        informationBtnDiv.appendTo(targaDiv);
        targaDiv.appendTo($('#searchResults'));
    });
}

function veicoloDaTargaBtnClicked(targa) {
    console.log("sono qui");
    data = "telaio=" + targa.vehicle;
    handleAjaxRequest(
        '../php/search_veicolo.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
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
};    

function revisioneDaTargaBtnClicked() {
    console.log("bho");
}