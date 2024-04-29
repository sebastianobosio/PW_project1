<?php
// Include database connection
include '../includes/db_connection.php';

// Retrieve search criteria from POST data
$telaio = $_POST['telaio'] ?? '';
$modello = $_POST['modello'] ?? '';
$marca = $_POST['marca'] ?? '';

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

    $output = '<ul>';
    // Process the result directly in the loop
    foreach ($stmt as $row) {
        // Do something with each row
        $output .= '<li>' . $row['telaio'] . ': ' . $row['marca'] . ' ' . $row['modello'] . '</li>';
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
