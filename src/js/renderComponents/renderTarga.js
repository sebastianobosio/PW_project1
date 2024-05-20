export function renderTargaCard(targa) {
    const targaComponent = createTargaCardComponent(targa);
    return targaComponent;
}

export function renderTargaDetail(targa) {
    const targaComponent = createTargaDetailComponent(targa);
    return targaComponent;
}

function createTargaCardComponent(targa) {
    const targaDiv = $('<div>').addClass('targa card');
    const infoDiv = $('<div>').addClass('info');
    const targaNumberDiv = $('<div>').addClass('targaDiv').text('Targa: ' + targa.numero).appendTo(infoDiv);
    const dataEmDiv = $('<div>').text('Data di Emissione: ' + targa.dataEm).appendTo(infoDiv);
    if (targa.status == 'non-active') {
        const vehicle = $('<div>').text('Ultimo veicolo: ' + targa.veicolo).appendTo(infoDiv);
        const dataRes = $('<div>').text('Data di restituzione: ' + targa.dataRes).appendTo(infoDiv);
        targaDiv.addClass('non-active');
        $('<div>').addClass('dot non-active-dot').text('non attiva').appendTo(targaNumberDiv);
    } else if (targa.status == 'active') {
        const vehicle = $('<div>').text('Veicolo associato: ' + targa.veicolo).appendTo(infoDiv);
        targaDiv.addClass('active');
        $('<div>').addClass('dot active-dot').text('attiva').appendTo(targaNumberDiv);
    }
    infoDiv.appendTo(targaDiv);
    const detailsBtnDiv = $('<div>').addClass('action-btn');
    const detailsButton = $('<button>').html('Scopri di più' + '<i class="fa-solid fa-circle-info"></i>').addClass('detail-button');
    detailsButton.appendTo(detailsBtnDiv);
    detailsButton.on('click', function () {
        targaDetailsBtnClicked(targa)
    });
    detailsBtnDiv.appendTo(targaDiv);

    return targaDiv;
}

function createTargaDetailComponent(targa) {
    const targaDiv = $('<div>').addClass('targa card');
    const infoDiv = $('<div>').addClass('info');
    const targaNumberDiv = $('<div>').addClass('targaDiv').text('Targa: ' + targa.numero).appendTo(infoDiv);
    const dataEmDiv = $('<div>').text('Data di Emissione: ' + targa.dataEm).appendTo(infoDiv);
    if (targa.status == 'non-active') {
        const vehicle = $('<div>').text('Ultimo veicolo: ' + targa.veicolo).appendTo(infoDiv);
        const dataRes = $('<div>').text('Data di restituzione: ' + targa.dataRes).appendTo(infoDiv);
        targaDiv.addClass('non-active');
        $('<div>').addClass('dot non-active-dot').text('non attiva').appendTo(targaNumberDiv);
    } else if (targa.status == 'active') {
        const vehicle = $('<div>').text('Veicolo associato: ' + targa.veicolo).appendTo(infoDiv);
        targaDiv.addClass('active');
        $('<div>').addClass('dot active-dot').text('attiva').appendTo(targaNumberDiv);
    }
    infoDiv.appendTo(targaDiv);
    /*const detailsBtnDiv = $('<div>').addClass('action-btn');
    const detailsButton = $('<button>').html('Scopri di più' + '<i class="fa-solid fa-circle-info"></i>').addClass('detail-button');
    detailsButton.appendTo(detailsBtnDiv);
    detailsButton.on('click', function() {targaDetailsBtnClicked(targa)});
    detailsBtnDiv.appendTo(targaDiv);*/

    return targaDiv;
}

function targaDetailsBtnClicked(targa) {
    viewTargaDetails(targa);
};

function viewTargaDetails(targa) {
    window.location.href = '/pages/targa/dettagli-targa.php?id=' + targa.numero;
}
