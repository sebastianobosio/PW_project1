<?php
// Include database connection
include '../includes/db_connection.php';

if ($_GET['action'] == 'read') {
    // Retrieve search criteria from POST data
    $numero = $_GET['numero'] ?? '';
    $targa = $_GET['targa'] ?? '';
    $dataRev = $_GET['dataRev'] ?? '';
    $esito = $_GET['esito'] ?? '';

    //status is both as default
    // Ricorda che per le relazioni 0:n è utile mostarre il numero di entità collegate

    $sql_condition = "";
    if (!empty($targa)) {
        $sql_condition .= " AND targa = '$targa'";
    }
    if (!empty($numero)) {
        $sql_condition .= " AND numero = '$numero'";
    }
    if (!empty($dataRev)) {
        $sql_condition .= " AND dataRev = '$dataRev'";
    }
    
    if ($esito === 'positive') {
        $sql_condition .= " AND esito = 'positivo'";
    } elseif ($esito === 'negative') {
        $sql_condition .= " AND esito = 'negativo'";
    }

    $sql = "SELECT * FROM Revisione WHERE 1 $sql_condition";

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
            //Do something with each row
            if ($row['esito'] === 'negativo') {
                //$output .= '<li>' . 'Revisione ' . $row['numero'] . ' fatta il ' . $row['dataRev'] . ' alla targa ' . $row['targa'] . ', ha avuto esito ' . $row['esito'] . '. La motivazione: ' . $row['motivazione'] . '<button onclick="editRevision(' + $row['numero'] + ')">Edit</button>' . '<button onclick="deleteRevision(' + $row['numero'] + ')">Delete</button>' . '</li>';
                $output .= '<li data-id="' . $row['numero'] . '">' . 'Revisione ' . $row['numero'] . ' fatta il ' . $row['dataRev'] . ' alla targa ' . $row['targa'] . ', ha avuto esito ' . $row['esito'] . '. La motivazione: ' . $row['motivazione'] . '<button class="editBtn">Edit</button>' . '<button class="deleteBtn">Delete</button>' . '</li>';
            }
            else {
                $output .= '<li data-id="' . $row['numero'] . '">' . 'Revisione ' . $row['numero'] . ' fatta il ' . $row['dataRev'] . ' alla targa ' . $row['targa'] . ', ha avuto esito ' . $row['esito'] . '<button class="editBtn">Edit</button>' . '<button class="deleteBtn">Delete</button>' . '</li>';
                //$output .= '<li>' . 'Revisione ' . $row['numero'] . ' fatta il ' . $row['dataRev'] . ' alla targa ' . $row['targa'] . ', ha avuto esito ' . $row['esito'] . '<button onclick="editRevision(' + $row['numero'] + ')">Edit</button>' . '<button onclick="deleteRevision(' + $row['numero'] + ')">Delete</button>' . '</li>';
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
}


// Create operation
if($_POST['action'] == 'create') {
    $targa = $_POST['addTarga'];
    $dataRev = $_POST['addDataRev'];
    $esito = $_POST['addEsito'];
    if ($esito === 'negativo') {
        $motivazione = $_POST['addMotivazione'];
        $sql = "INSERT INTO Revisione (numero, targa, dataRev, esito, motivazione) VALUES (NULL, '$targa', '$dataRev', '$esito', '$motivazione')";
    } else {
        $sql = "INSERT INTO Revisione (numero, targa, dataRev, esito, motivazione) VALUES (NULL, '$targa', '$dataRev', '$esito', NULL)";
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
if($_POST['action'] == 'update') {
    $id = $_POST['editId'];
    $targa = $_POST['editTarga'];
    $dataRev = $_POST['editDataRev'];
    $esito = $_POST['editEsito'];
    if ($esito === 'negativo') {
        $motivazione = $_POST['editMotivazione'];
        $sql = "UPDATE Revisione SET numero='$id', targa='$targa', dataRev='$dataRev', esito='$esito', motivazione='$motivazione' WHERE numero='$id'";
    } else {
        $sql = "UPDATE Revisione SET numero='$id', targa='$targa', dataRev='$dataRev', esito='$esito', motivazione=NULL WHERE numero='$id'";
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
if($_POST['action'] == 'delete') {
    $id = $_POST['id'];

    $sql = "DELETE FROM Revisione WHERE numero='$id'";
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

?>
