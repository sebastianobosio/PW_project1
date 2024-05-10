function renderVeicolo(veicolo) {
    const veicoloComponent = createVeicoloComponent(veicolo);
    return veicoloComponent;
}

function createVeicoloComponent(veicolo) {
    const vehicleDiv = $('<div>').addClass('vehicle');
    const veicoloNumberDiv = $('<div>').text('Veicolo: ' + veicolo.telaio).appendTo(vehicleDiv);
    const veicoloModelDiv = $('<div>').text('Modello: ' + veicolo.modello).appendTo(vehicleDiv);
    const veicoloBrandDiv = $('<div>').text('Marca: ' + veicolo.marca).appendTo(vehicleDiv);
    const detailsBtnDiv = $('<div>').addClass('detailsBtn');
    const detailsButton = $('<button>').text('Dettaglio veicolo').addClass('detail-button');
    detailsButton.appendTo(detailsBtnDiv)

    detailsButton.on('click', function() {veicoloDetailsBtnClicked(veicolo)});
    detailsBtnDiv.appendTo(vehicleDiv);

    return vehicleDiv;
}

function veicoloDetailsBtnClicked(veicolo) {
    console.log("sono qui balla");
    viewVeicoloDetails(veicolo);
};    

function viewVeicoloDetails(veicolo) {
    window.location.href = '/pages/veicolo/dettagli-veicolo.php?id=' + veicolo.telaio;
}