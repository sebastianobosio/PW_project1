function formatVehicleData(data) {
    $('#searchResults').empty();

    data.forEach(car => {
        const vehicleDiv = $('<div>').addClass('vehicle');
        $('<div>').text('Veicolo: ' + car.telaio).appendTo(vehicleDiv);
        $('<div>').text('Modello: ' + car.modello).appendTo(vehicleDiv);
        $('<div>').text('Marca: ' + car.marca).appendTo(vehicleDiv);
        const informationBtnDiv = $('<div>').addClass('infoBtn');
        const targaButton = $('<button>').text('Targhe associate').addClass('targa-button');
        const revisioneButton = $('<button>').text('Revisioni associate').addClass('revisione-button');
        targaButton.appendTo(informationBtnDiv)
        revisioneButton.appendTo(informationBtnDiv);

        targaButton.on('click', function() {targaDaVeicoloBtnClicked(car)});
        revisioneButton.on('click', function() {revisioneDaVeicoloBtnClicked(car)});
        informationBtnDiv.appendTo(vehicleDiv);
        vehicleDiv.appendTo($('#searchResults'));
    });
}

function targaDaVeicoloBtnClicked(car) {
    console.log(car);
    data = "telaio=" + car.telaio;
    handleAjaxRequest(
        '../php/search_targa.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
            if (response.success === true) {
                formatTargaData(response.data);
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

function revisioneDaVeicoloBtnClicked(car) {
    data = "telaio=" + car.telaio;
    handleAjaxRequest(
        '../php/search_targa.php',
        'GET',
        data,
        function(response) {
            console.log('Response:', response.message);
            if (response.success === true) {
                var targhe = [];
                response.data.forEach(targa => {
                    targhe.push(targa.numero);
                })
                data = "targhe=" + targhe + "&action=read-array";
                console.log(data);
                handleAjaxRequest(
                    '../php/search_revisione.php',
                    'GET',
                    data,
                    function(response) {
                        if (response.success === true) {
                            formatRevisioneData(response.data);
                        } else {
                            alert("Non sono state trovate corrispondenze");
                        }
                    },
                    function(xhr, status, error) {
                        console.error('Error', xhr.responseText);
                        alert("Error occurred while fetching data.");
                    }
                )
            } else {
                alert("Non sono state trovate corrispondenze");
            }
        },
        function(xhr, status, error) {
            console.error('Error', xhr.responseText);
            alert("Error occurred while fetching data.");
        }
    )
}