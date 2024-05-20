import {performDefaultSearch} from "./performRevisionSearch.js";
import {loadRevisioniDiv} from "./loadRevisions.js";
import {getTarghe} from "../dettagli/dettagliVeicolo.js";
import {getTarga} from "../dettagli/dettagliTarga.js";
import {returnToMotherPage as returnToMotherPageRevisione} from "../dettagli/dettagliRevisione.js";

// this module is used to handle the edit or delete function that are possible from the revision Card
// based on the modification and on the page the are different scenario.
export async function handlePageReloadOnDelete() {
    var currentPage = window.location.pathname;
    if (currentPage.endsWith("revisioni.php")) {
        performDefaultSearch(); // se sono in revisioni chiamo la funzione presente nel file searchRevisione.js
    } else if (currentPage.endsWith("dettagli-revisione.php")) {
        returnToMotherPageRevisione();
    } else if (currentPage.endsWith("dettagli-veicolo.php")) {
        loadRevisioniDiv(getTarghe());
    } else if (currentPage.endsWith("dettagli-targa.php")) {
        loadRevisioniDiv(getTarga());
    } else {
        console.error("page not supported");
    }
}

export async function handlePageReloadOnEdit() {
    var currentPage = window.location.pathname;
    if (currentPage.endsWith("dettagli-revisione.php")) { // se sono in una pagina dettagli
        window.location.reload(); // se cambia la targa cambia anche i dettagli della targa e il veicolo
    } else if (currentPage.endsWith("revisioni.php")) {
        return;
    } else if (currentPage.endsWith("dettagli-veicolo.php")) {
        loadRevisioniDiv(getTarghe());
    } else if (currentPage.endsWith("dettagli-targa.php")) {
        loadRevisioniDiv(getTarga());
    } else {
        console.error("page not supported");
    }
}
