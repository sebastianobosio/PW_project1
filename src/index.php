<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Motorizzazione</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Libre+Baskerville&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <script type="text/javascript" src="../js/jquery-3.7.1.js"></script>
    <script src="js/activePage.js"></script>
</head>

<body>
    <?php include 'includes/header.php'; ?>
    <div class="container">
        <nav class="navigation">
            <?php include 'includes/navigation.php'; ?>
        </nav>
        <div class="content">
            <!-- This is where the results will be displayed -->
            <h1>Benvenuti</h1>
            <h4>In questo sito è possible effettuare le seguenti operazioni</h4>
            <ul>
                <li>Cercare informazioni su un veicolo tramite la targa</li>
                <li>Verificare lo stato di revisione di un veicolo</li>
                <li>Visualizzare informazioni dettagliate su un veicolo e la sua storia</li>
            </ul>
            <p>Effettua queste ricerche navigando tra le pagine a lato</p>
            <p>Le modifiche delle revisioni possono essere effettuate direttamente dalla card.
                Sia per le modifiche che per l'aggiunta vengono effettuati dei controlli sui campi.
                Nel caso dell'edit vengono ripristinati i valori originali.
                Nelle pagine dettaglio-targa/veicolo il form di aggiunta revisione è già riempito
                con la targa o targa-attiva. Form che è presente solo se il veicolo è targato con targa attiva.
            </p>
            <p>I dati sono stati generati tramite uno script python che crea un database SQLite che ho poi convertito in uno MySQL</P>
            <p>Targhe e revisioni sono caricati in ordine di data di emissione e revisione rispettivamente</p>
            <p>Sarebbe bello implementare anche un sistema di paginazione, così da non caricare le card tutte insieme. Cosa che potrebbe essere problematica quando il database è pieno.</p>
        </div>
    </div>
</body>
<?php include 'includes/footer.php'; ?>