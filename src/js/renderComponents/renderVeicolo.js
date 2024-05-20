export function renderVeicoloCard(veicolo) {
    const veicoloComponent = createVeicoloCardComponent(veicolo);
    return veicoloComponent;
}

export function renderVeicoloDetail(veicolo) {
    const veicoloComponent = createVeicoloDetailComponent(veicolo);
    return veicoloComponent;
}

function createVeicoloCardComponent(veicolo) {
    const vehicleDiv = $('<div>').addClass('veicolo card');
    const infoDiv = $('<div>').addClass('info');
    const veicoloNumberDiv = $('<div>').text('Telaio: ' + veicolo.telaio).appendTo(infoDiv);
    const veicoloModelDiv = $('<div>').text('Modello: ' + veicolo.modello).appendTo(infoDiv);
    const veicoloBrandDiv = $('<div>').text('Marca: ' + veicolo.marca).appendTo(infoDiv);
    const veicoloProdDateDiv = $('<div>').text('Data di produzione: ' + veicolo.dataProd).appendTo(infoDiv);
    infoDiv.appendTo(vehicleDiv);
    const detailsBtnDiv = $('<div>').addClass('action-btn');
    const detailsButton = $('<button>').html('Scopri di più' + '<i class="fa-solid fa-circle-info"></i>').addClass('detail-button');
    detailsButton.appendTo(detailsBtnDiv)

    detailsButton.on('click', function () {
        veicoloDetailsBtnClicked(veicolo)
    });
    detailsBtnDiv.appendTo(vehicleDiv);

    return vehicleDiv;
}

function createVeicoloDetailComponent(veicolo) {
    const vehicleDiv = $('<div>').addClass('veicolo card');
    const infoDiv = $('<div>').addClass('info');
    const veicoloNumberDiv = $('<div>').text('Telaio: ' + veicolo.telaio).appendTo(infoDiv);
    const veicoloModelDiv = $('<div>').text('Modello: ' + veicolo.modello).appendTo(infoDiv);
    const veicoloBrandDiv = $('<div>').text('Marca: ' + veicolo.marca).appendTo(infoDiv);
    const veicoloProdDateDiv = $('<div>').text('Data di produzione: ' + veicolo.dataProd).appendTo(infoDiv);
    infoDiv.appendTo(vehicleDiv);
    /*const detailsBtnDiv = $('<div>').addClass('action-btn');
    const detailsButton = $('<button>').html('Scopri di più' + '<i class="fa-solid fa-circle-info"></i>').addClass('detail-button');
    detailsButton.appendTo(detailsBtnDiv)

    detailsButton.on('click', function() {veicoloDetailsBtnClicked(veicolo)});
    detailsBtnDiv.appendTo(vehicleDiv);*/

    return vehicleDiv;
}

function veicoloDetailsBtnClicked(veicolo) {
    viewVeicoloDetails(veicolo);
};

function viewVeicoloDetails(veicolo) {
    window.location.href = '/pages/veicolo/dettagli-veicolo.php?id=' + veicolo.telaio;
}
