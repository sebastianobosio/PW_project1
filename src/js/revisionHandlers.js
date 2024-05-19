import { performDefaultSearch } from "./test.js";
import { loadRevisioniDiv } from "./loadRevisions.js";
import { getTarghe} from "./dettagliVeicolo.js";
import { getTarga} from "./dettagliTarga.js";

export async function handlePageReloadOnDelete() {
    var currentPage = window.location.pathname;
    if (currentPage.endsWith("revisioni.php")) {
        performDefaultSearch(); // se sono in revisioni chiamo la funzione presente nel file searchRevisione.js
    } else if (currentPage.endsWith("dettagli-revisione.php")) {
        returnToMotherPage();
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
    console.log(
        currentPage + " " + currentPage.endsWith("dettagli-revisione.php")
    );
    if (currentPage.endsWith("dettagli-revisione.php")) {
        // se sono in una pagina dettagli
        console.log("sono finito nell'else");
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

export function returnToMotherPage() {
    var motherURL = '/'
    window.location.href = motherURL;
}
