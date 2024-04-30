<?php
// Include database connection
include '../includes/db_connection.php';

// Retrieve search criteria from POST data
$targa = $_POST['targa'] ?? '';
$telaio = $_POST['telaio'] ?? '';
$status = $_POST['status'] ?? '';

//status is both as default
// Ricorda che per le relazioni 0:n è utile mostarre il numero di entità collegate
// Construct the SQL query based on the provided criteria


$sql_condition = "";
if (!empty($targa)) {
    $sql_condition .= " AND numero = '$targa'";
}
if (!empty($telaio)) {
    $sql_condition .= " AND veicolo = '$telaio'";
}

$sql_only_active = "SELECT Targa.numero, Targa.dataEm, TargaAttiva.targa AS targa_attiva, TargaAttiva.veicolo, 'active' AS origin
                    FROM Targa
                    INNER JOIN TargaAttiva ON Targa.numero = TargaAttiva.targa
                    WHERE 1 $sql_condition";

$sql_only_returned = "SELECT Targa.numero, Targa.dataEm, TargaRestituita.targa AS targa_restituita, TargaRestituita.veicolo, TargaRestituita.dataRes, 'non-active' as origin
                    FROM Targa
                    INNER JOIN TargaRestituita ON Targa.numero = TargaRestituita.targa
                    WHERE 1 $sql_condition";

$sql_both = "SELECT Targa.numero, Targa.dataEm, TargaAttiva.targa AS targa_attiva, TargaAttiva.veicolo, NULL AS dataRes, 'active' AS origin
        FROM Targa
        INNER JOIN TargaAttiva ON Targa.numero = TargaAttiva.targa
        WHERE 1 $sql_condition 
        UNION ALL 
        SELECT Targa.numero, Targa.dataEm, TargaRestituita.targa AS targa_restituita, TargaRestituita.veicolo, TargaRestituita.dataRes, 'non-active' AS origin
        FROM Targa
        INNER JOIN TargaRestituita ON Targa.numero = TargaRestituita.targa
        WHERE 1 $sql_condition";

if ($status === 'active') {
    $sql = $sql_only_active;
} elseif ($status === 'returned') {
    $sql = $sql_only_returned;
} elseif ($status === 'both') {
    $sql = $sql_both;
}

try {
    // Prepare and execute the query
    $stmt = $conn->query($sql);
    if ($stmt->rowCount() == 0) {
        $response = array(
            'success' => false,
            'message' => 'No results found'
        );
        echo json_encode($response);
        exit(); // Stop further execution
    }

    $output = '<ul>';
    // Process the result directly in the loop
    foreach ($stmt as $row) {
        // Do something with each row
        if ($row['origin'] === 'non-active') {
            $output .= '<li>' . $row['numero'] . ' emessa il ' . $row['dataEm'] . ': ultimo veicolo ' . $row['veicolo'] . ', restituita il ' . $row['dataRes'] . '</li>';
        }
        else {
            $output .= '<li>' . $row['numero'] . ' emessa il ' . $row['dataEm'] . ': veicolo attuale ' . $row['veicolo'] . '</li>';
        }
    }
    $output .= '</ul>';

    $response = array(
        'success' => true,
        'message' => 'Query executed successfully',
        'data' => $output
    );

    echo json_encode($response);
} catch (PDOException $e) {
    // Handle errors
    $response = array(
        'success' => false,
        'message' => 'Error executing query: ' . $e->getMessage()
    );
    echo json_encode($response);
}
?>
