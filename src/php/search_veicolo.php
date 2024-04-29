<?php
// Include database connection
include '../includes/db_connection.php';

// Retrieve search criteria from POST data
$telaio = $_POST['telaio'] ?? '';
$model = $_POST['model'] ?? '';
$marca = $_POST['marca'] ?? '';

// Construct the SQL query based on the provided criteria
$sql = "SELECT * FROM Veicolo WHERE 1";

if (!empty($telaio)) {
    $sql .= " AND telaio = '$telaio'";
}
if (!empty($model)) {
    $sql .= " AND modello = '$model'";
}
if (!empty($marca)) {
    $sql .= " AND marca = '$marca'";
}

// Execute the query
$result = mysqli_query($conn, $sql);

// Check if query was successful
if ($result) {
    // Prepare the HTML content for displaying search results
    $output = '<ul>';
    while ($row = mysqli_fetch_assoc($result)) {
        $output .= '<li>' . $row['telaio'] . ': ' . $row['marca'] . ' ' . $row['modello'] . '</li>';
    }
    $output .= '</ul>';

    // Return JSON response with search results
    echo json_encode(['success' => true, 'message' => $output]);
} else {
    // Return JSON response with error message
    echo json_encode(['success' => false, 'message' => 'Failed to execute query: ' . mysqli_error($conn)]);
}

// Close database connection
mysqli_close($conn);
?>
