// this function check if the revions fields are correct, it responds back to the addForm and when in edit mode
export async function checkRevision(targa, dataRev) {
    return new Promise((resolve, reject) => {
        handleAjaxRequest("/php/search_targa.php", "GET", "targa=" + targa, function (response) {
            if (response.success === true) {
                const dataEm = response.data[0]["dataEm"];
                const dataRes = response.data[0]["dataRes"];
                const dataEmObj = new Date(dataEm);
                const dataResObj = new Date(dataRes);
                const dataRevObj = new Date(dataRev);

                if (dataRevObj < dataEmObj) {
                    alert("Data di revisione antecedente alla data di emissione della targa associata");
                    resolve(false);
                } else if (dataRevObj > dataResObj) {
                    alert("Data di revisione posteriore alla data di restituzione della targa associata");
                    resolve(false);
                } else {
                    resolve(true);
                }
            } else {
                alert("Targa non presente nel database");
                resolve(false);
            }
        }, function (xhr, status, error) {
            console.error("Error", xhr.responseText);
            alert("Error occurred while fetching data.");
            reject(new Error("Error occurred while fetching data: " + error));
        });
    });
}
