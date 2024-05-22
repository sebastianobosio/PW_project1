<?php
// Include database connection
include '../includes/db_connection.php';

// Retrieve search criteria from POST data
$telaio = $_GET['telaio'] ?? '';
$modello = $_GET['modello'] ?? '';
$marca = $_GET['marca'] ?? '';
$dataProd = $_GET['dataProd'] ?? '';

// Construct the SQL query based on the provided criteria
$sql = "SELECT * FROM Vehicle WHERE 1";

if (!empty($telaio)) {
    $sql .= " AND number = '$telaio'";
}
if (!empty($modello)) {
    $sql .= " AND model = '$modello'";
}
if (!empty($marca)) {
    $sql .= " AND brand = '$marca'";
}
if (!empty($dataProd)){
    $sql .= " AND prodDate = '$dataProd'";
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
        $result['telaio'] = $row['number'];
        $result['marca'] = $row['brand'];
        $result['modello'] = $row['model'];
        $result['dataProd'] = $row['prodDate'];
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
