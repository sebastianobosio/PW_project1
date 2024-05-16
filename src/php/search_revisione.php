<?php
// Include database connection
include '../includes/db_connection.php';

// Function to handle query execution and response generation
function executeQuery($sql, $params = []) {
    global $conn;

    try {
        // Prepare and execute the query
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() == 0) {
            return array(
                'success' => false,
                'message' => 'No results found'
            );
        }

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $formattedResults = array();

        foreach ($results as $row) {
            $formattedRow = array(
                'numero' => $row['id'],
                'dataRev' => $row['revisionDate'],
                'targa' => $row['plateNumber'],
                'esito' => $row['outcome']
            );

            if ($row['outcome'] === 'negative') {
                $formattedRow['motivazione'] = $row['motivation'];
            }

            $formattedResults[] = $formattedRow;
        }

        return array(
            'success' => true,
            'message' => 'Query executed successfully',
            'data' => $formattedResults
        );
    } catch (PDOException $e) {
        // Handle errors
        return array(
            'success' => false,
            'message' => 'Error executing query: ' . $e->getMessage()
        );
    }
}

// Read operation for array input
if ($_GET['action'] == 'read-array') {
    $targhe = $_GET['targhe'];
    $total_results = array();

    // Check if 'targa' is provided as a comma-separated list of values
    if (!empty($targhe) && is_string($targhe)) {
        // Split the comma-separated values into an array
        $targhe = explode(',', $targhe);
    }

    foreach ($targhe as $targa) {
        $sql_condition = "";
        $params = array();

        if (!empty($targa)) {
            $sql_condition .= " AND plateNumber = ?";
            $params[] = $targa;
        }

        $sql = "SELECT * FROM Revisions WHERE 1 $sql_condition";
        $queryResult = executeQuery($sql, $params);

        if ($queryResult['success']) {
            $total_results = array_merge($total_results, $queryResult['data']);
        } else {
            echo json_encode($queryResult);
            exit(); // Stop further execution
        }
    }

    if (empty($total_results)) {
        $response = array(
            'success' => false,
            'message' => 'No results found'
        );
    } else {
        // Sort the results by revision date
        usort($total_results, function ($a, $b) {
            return strtotime($b['dataRev']) - strtotime($a['dataRev']);
        });
        $response = array(
            'success' => true,
            'message' => 'Queries executed successfully',
            'data' => $total_results
        );
    }

    echo json_encode($response);
}

// Read operation for single record
if ($_GET['action'] == 'read') {
    // Retrieve search criteria from GET data
    $numero = $_GET['numero'] ?? '';
    $targa = $_GET['targa'] ?? '';
    $dataRev = $_GET['dataRev'] ?? '';
    $esito = $_GET['esito'] ?? '';

    $sql_condition = "";
    $params = array();

    if (!empty($targa)) {
        $sql_condition .= " AND plateNumber = ?";
        $params[] = $targa;
    }
    if (!empty($numero)) {
        $sql_condition .= " AND id = ?";
        $params[] = $numero;
    }
    if (!empty($dataRev)) {
        $sql_condition .= " AND revisionDate = ?";
        $params[] = $dataRev;
    }
    if ($esito === 'positive') {
        $sql_condition .= " AND outcome = ?";
        $params[] = 'positive';
    } elseif ($esito === 'negative') {
        $sql_condition .= " AND outcome = ?";
        $params[] = 'negative';
    }

    $sql = "SELECT * FROM Revisions WHERE 1 $sql_condition";
    $queryResult = executeQuery($sql, $params);

    echo json_encode($queryResult);
}

// Create operation
if ($_POST['action'] == 'create') {
    $targa = $_POST['addTarga'];
    $dataRev = $_POST['addDataRev'];
    $esito = $_POST['addEsito'];
    $motivazione = $_POST['addMotivazione'] ?? null;
    $sql = "INSERT INTO Revisions (plateNumber, revisionDate, outcome, motivation) VALUES (?, ?, ?, ?)";

    $params = array($targa, $dataRev, $esito, $motivazione);

    $queryResult = executeQuery($sql, $params);
    echo json_encode($queryResult);
}

// Update operation
if ($_POST['action'] == 'update') {
    $id = $_POST['editId'];
    $targa = $_POST['editTarga'];
    $dataRev = $_POST['editDataRev'];
    $esito = $_POST['editEsito'];
    $motivazione = $_POST['editMotivazione'] ?? null;

    $sql = "UPDATE Revisions SET plateNumber = ?, revisionDate = ?, outcome = ?, motivation = ? WHERE id = ?";
    $params = array($targa, $dataRev, $esito, $motivazione, $id);

    $queryResult = executeQuery($sql, $params);
    echo json_encode($queryResult);
}

// Delete operation
if ($_POST['action'] == 'delete') {
    $id = $_POST['id'];
    $sql = "DELETE FROM Revisions WHERE id = ?";
    $params = array($id);

    $queryResult = executeQuery($sql, $params);
    echo json_encode($queryResult);
}
?>
