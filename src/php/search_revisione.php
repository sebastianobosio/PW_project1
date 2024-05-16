<?php
// Include database connection
include '../includes/db_connection.php';


if ($_GET['action'] == 'read-array') {
    $targhe = $_GET['targhe'];

    // Check if 'targa' is provided as a comma-separated list of values
    if (!empty($targhe) && is_string($targhe)) {
        // Split the comma-separated values into an array
        $targhe = explode(',', $targhe);
    }

    $total_results = array();
    foreach ($targhe as $targa) {
        $sql_condition = "";
        if (!empty($targa)) {
            $sql_condition .= " AND plateNumber = '$targa'";
        }

        $sql = "SELECT * FROM Revisions WHERE 1 $sql_condition";


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

            foreach ($stmt as $row) {
                $result = array();
                $result['numero'] = $row['id'];
                $result['dataRev'] = $row['revisionDate'];
                $result['targa'] = $row['plateNumber'];
                $result['esito'] = $row['outcome'];
                if ($row['outcome'] === 'negative') {
                    $result['motivazione'] = $row['motivation'];
                }
                $results[] = $result;
            }


            if (count($results) > 0) {
                $total_results = array_merge($total_results, $results);
            }
        } catch (PDOException $e) {
            // Handle errors
            $response = array(
                'success' => false,
                'message' => 'Error executing query: ' . $e->getMessage()
            );
            echo json_encode($response);
        }
    }

    if (empty($total_results)) {

        // here add logic for sorting the array (copy from search_targa.php)
        $response = array(
            'success' => false,
            'message' => 'No results found'
        );
    } else {
        usort($total_results, function ($b, $a) {
            return strtotime($a['dataRev']) - strtotime($b['dataRev']);
        });
        $response = array(
            'success' => true,
            'message' => 'Queries executed successfully',
            'data' => $total_results
        );
    }

    echo json_encode($response);
}

if ($_GET['action'] == 'read') {
    // Retrieve search criteria from POST data
    $numero = $_GET['numero'] ?? '';
    $targa = $_GET['targa'] ?? '';
    $dataRev = $_GET['dataRev'] ?? '';
    $esito = $_GET['esito'] ?? '';

    $sql_condition = "";
    if (!empty($targa)) {
        $sql_condition .= " AND plateNumber = '$targa'";
    }
    if (!empty($numero)) {
        $sql_condition .= " AND id = '$numero'";
    }
    if (!empty($dataRev)) {
        $sql_condition .= " AND revisionDate = '$dataRev'";
    }

    if ($esito === 'positive') {
        $sql_condition .= " AND outcome = 'positive'";
    } elseif ($esito === 'negative') {
        $sql_condition .= " AND outcome = 'negative'";
    }

    $sql = "SELECT * FROM Revisions WHERE 1 $sql_condition";

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

        foreach ($stmt as $row) {
            $result = array();
            $result['numero'] = $row['id'];
            $result['dataRev'] = $row['revisionDate'];
            $result['targa'] = $row['plateNumber'];
            $result['esito'] = $row['outcome'];
            if ($row['outcome'] === 'negative') {
                $result['motivazione'] = $row['motivation'];
            }
            $results[] = $result;
        }

        usort($results, function ($b, $a) {
            return strtotime($a['dataRev']) - strtotime($b['dataRev']);
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
}


// Create operation
if ($_POST['action'] == 'create') {
    $targa = $_POST['addTarga'];
    $dataRev = $_POST['addDataRev'];
    $esito = $_POST['addEsito'];
    if ($esito === 'negative') {
        $motivazione = $_POST['addMotivazione'];
        $sql = "INSERT INTO Revisions (id, plateNumber, revisionDate, outcome, motivation) VALUES (NULL, '$targa', '$dataRev', '$esito', '$motivazione')";
    } else {
        $sql = "INSERT INTO Revisione (id, plateNumber, revisionDate, outcome, motivation) values (null, '$targa', '$dataRev', '$esito', NULL)";
    }

    try {
        // Execute the query
        $success = $conn->query($sql);
        if ($success) {
            $response = array(
                'success' => true,
                'message' => 'Query executed successfully',
            );
        } else {
            $response = array(
                'success' => false,
                'message' => 'Query execution failed'
            );
        }

        echo json_encode($response);
    } catch (PDOException $e) {
        // Handle errors
        $response = array(
            'success' => false,
            'message' => 'Error executing query: ' . $e->getMessage()
        );
        echo json_encode($response);
    }
}

// Update operation
if ($_POST['action'] == 'update') {
    $id = $_POST['editId'];
    $targa = $_POST['editTarga'];
    $dataRev = $_POST['editDataRev'];
    $esito = $_POST['editEsito'];
    if ($esito === 'negative') {
        $motivazione = $_POST['editMotivazione'];
        $sql = "UPDATE Revisions SET id='$id', plateNumber='$targa', revisionDate='$dataRev', outcome='$esito', motivation='$motivazione' WHERE id='$id'";
    } else {
        $sql = "UPDATE Revisions SET id='$id', plateNumber='$targa', revisionDate='$dataRev', outcome='$esito', motivation=NULL WHERE id='$id'";
    }

    try {
        // Execute the query
        $success = $conn->query($sql);
        if ($success) {
            $response = array(
                'success' => true,
                'message' => 'Query executed successfully',
            );
        } else {
            $response = array(
                'success' => false,
                'message' => 'Query execution failed'
            );
        }

        echo json_encode($response);
    } catch (PDOException $e) {
        // Handle errors
        $response = array(
            'success' => false,
            'message' => 'Error executing query: ' . $e->getMessage()
        );
        echo json_encode($response);
    }
}

// Delete operation
if ($_POST['action'] == 'delete') {
    $id = $_POST['id'];

    $sql = "DELETE FROM Revisions WHERE id='$id'";
    try {
        // Execute the query
        $success = $conn->query($sql);
        if ($success) {
            $response = array(
                'success' => true,
                'message' => 'Query executed successfully',
            );
        } else {
            $response = array(
                'success' => false,
                'message' => 'Query execution failed'
            );
        }

        echo json_encode($response);
    } catch (PDOException $e) {
        // Handle errors
        $response = array(
            'success' => false,
            'message' => 'Error executing query: ' . $e->getMessage()
        );
        echo json_encode($response);
    }
}
