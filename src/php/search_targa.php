<?php
// Include database connection
include '../includes/db_connection.php';

// Retrieve search criteria from POST data
$targa = $_GET['targa'] ?? '';
$telaio = $_GET['telaio'] ?? '';
$status = $_GET['status'] ?? '';
$dataEm = $_GET['dataEm'] ?? '';
$dataRes = $_GET['dataRes'] ?? '';

//status is both as default
// Ricorda che per le relazioni 0:n è utile mostarre il numero di entità collegate
// Construct the SQL query based on the provided criteria


$sql_condition = "";
if (!empty($targa)) {
    $sql_condition .= " AND Plates.number = '$targa'"; // using only 'number' was causing an issue in the query
}
if (!empty($telaio)) {
    $sql_condition .= " AND vehicleNumber = '$telaio'";
}
if (!empty($dataEm)) {
    $sql_condition .= " AND Plates.emissionDate = '$dataEm'";
}
if (!empty($dataRes)) {
    $sql_condition .= " AND resDate = '$dataRes'";
}

$sql_only_active = "SELECT Plates.number, Plates.emissionDate, ActivePlates.number AS active_plate, ActivePlates.vehicleNumber, 'active' AS origin
                    FROM Plates
                    INNER JOIN ActivePlates ON Plates.number = ActivePlates.number
                    WHERE 1 $sql_condition";

$sql_only_returned = "SELECT Plates.number, Plates.emissionDate, InactivePlates.number AS inactive_plate, InactivePlates.vehicleNumber, InactivePlates.resDate, 'non-active' as origin
                    FROM Plates
                    INNER JOIN InactivePlates ON Plates.number = InactivePlates.number
                    WHERE 1 $sql_condition";

$sql_both = "SELECT Plates.number, Plates.emissionDate, ActivePlates.number AS active_plate, ActivePlates.vehicleNumber, NULL AS resDate, 'active' AS origin
             FROM Plates
             INNER JOIN ActivePlates ON Plates.number = ActivePlates.number
             WHERE 1 $sql_condition 
             UNION ALL 
             SELECT Plates.number, Plates.emissionDate, InactivePlates.number AS inactive_plate, InactivePlates.vehicleNumber, InactivePlates.resDate, 'non-active' as origin
             FROM Plates
             INNER JOIN InactivePlates ON Plates.number = InactivePlates.number
             WHERE 1 $sql_condition";



if ($status === 'active') {
    $sql = $sql_only_active;
} elseif ($status === 'returned' or !(empty($dataRes))) {
    $sql = $sql_only_returned;
} else {
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

    $results = array();
    // Process the result directly in the loop
    foreach ($stmt as $row) {
        $result = array();
        // Do something with each row
        $result['numero'] = $row['number'];
        $result['dataEm'] = $row['emissionDate'];
        $result['veicolo'] = $row['vehicleNumber'];
        $result['status'] = $row['origin'];
        if ($row['origin'] === 'non-active') {
            $result['dataRes'] = $row['resDate'];
        }
        $results[] = $result;
    }

    // order for emission date
    usort($results, function ($b, $a) {
        return strtotime($a['dataEm']) - strtotime($b['dataEm']);
    });

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
