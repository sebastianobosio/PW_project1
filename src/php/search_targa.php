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
$sql = "SELECT * FROM Targa WHERE 1";
if ($status === 'active') {
    $sql = "SELECT * FROM TargaAttiva WHERE 1)";
} elseif ($status === 'returned') {
    $sql = "SELECT * FROM TargaRestituita WHERE 1)";
}

if (!empty($targa)) {
    $sql .= " AND numero = '$targa'";
}

if (!empty($telaio)) {
    $sql .= " AND veicolo = '$telaio'";
}


try {
    // Prepare and execute the query
    $stmt = $conn->query($sql);

    $output = '<ul>';
    // Process the result directly in the loop
    foreach ($stmt as $row) {
        // Do something with each row
        $output .= '<li>' . $row['numero'] . ': ' . $row['veicolo'] . $row['dataEm'] . '</li>';
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
