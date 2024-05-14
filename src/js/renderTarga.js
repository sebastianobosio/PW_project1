function renderTarga(targa) {
    console.log("renderizzando la targa");
    console.log(targa);
    const targaComponent = createTargaComponent(targa);
    console.log(targaComponent);
    return targaComponent;
}

function createTargaComponent(targa) {
    const targaDiv = $('<div>').addClass('targa card');
    const infoDiv = $('<div>').addClass('info');
    const targaNumberDiv = $('<div>').text('Targa: ' + targa.numero).appendTo(infoDiv);
    const dataEmDiv = $('<div>').text('Data di Emissione: ' + targa.dataEm).appendTo(infoDiv);
    if (targa.status == 'non-active') {
        const vehicle = $('<div>').text('Ultimo veicolo: ' + targa.veicolo).appendTo(infoDiv);
        const dataRes = $('<div>').text('Data di restituzione: ' + targa.dataRes).appendTo(infoDiv);
    } else if (targa.status == 'active') {
        const vehicle = $('<div>').text('Veicolo associato: ' + targa.veicolo).appendTo(infoDiv);
    }
    infoDiv.appendTo(targaDiv);
    const detailsBtnDiv = $('<div>').addClass('action-btn');
    const detailsButton = $('<button>').html('Scopri di più' + '<i class="fa-solid fa-circle-info"></i>').addClass('detail-button');
    detailsButton.appendTo(detailsBtnDiv);
    detailsButton.on('click', function() {targaDetailsBtnClicked(targa)});
    detailsBtnDiv.appendTo(targaDiv);

    return targaDiv;
}

function targaDetailsBtnClicked(targa) {
    console.log("sono qui");
    viewTargaDetails(targa);
};    

function viewTargaDetails(targa) {
    window.location.href = '/pages/targa/dettagli-targa.php?id=' + targa.numero;
}