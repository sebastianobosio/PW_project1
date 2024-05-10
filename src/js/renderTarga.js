function renderTarga(targa) {
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
    const detailsBtnDiv = $('<div>').addClass('detailsBtn');
    const detailsButton = $('<button>').text('Dettaglio targa').addClass('detail-button');
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