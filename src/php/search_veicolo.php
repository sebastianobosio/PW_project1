<?php
// Include database connection
include '../includes/db_connection.php';

// Retrieve search criteria from POST data
$telaio = $_GET['telaio'] ?? '';
$modello = $_GET['modello'] ?? '';
$marca = $_GET['marca'] ?? '';

// Construct the SQL query based on the provided criteria
$sql = "SELECT * FROM Veicolo WHERE 1";

if (!empty($telaio)) {
    $sql .= " AND telaio = '$telaio'";
}
if (!empty($modello)) {
    $sql .= " AND modello = '$modello'";
}
if (!empty($marca)) {
    $sql .= " AND marca = '$marca'";
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
        exit();
    }

    $results = array();
    foreach ($stmt as $row) {
        $result = array();
        $result['telaio'] = $row['telaio'];
        $result['marca'] = $row['marca'];
        $result['modello'] = $row['modello'];
        $results[] = $result;
    }

    $response = array(
        'success' => true,
        'message' => 'Query executed successfully',
        'data' => $results
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
