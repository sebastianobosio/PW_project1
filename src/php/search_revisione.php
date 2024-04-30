<?php
// Include database connection
include '../includes/db_connection.php';

if ($_POST['action'] == 'read'){
    // Retrieve search criteria from POST data
    $numero = $_POST['numero'] ?? '';
    $targa = $_POST['targa'] ?? '';
    $dataRev = $_POST['dataRev'] ?? '';
    $esito = $_POST['esito'] ?? '';

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
            // Do something with each row
            if ($row['esito'] === 'negativo') {
                $output .= '<li>' . 'Revisione ' . $row['numero'] . ' fatta il ' . $row['dataRev'] . ' alla targa ' . $row['targa'] . ', ha avuto esito ' . $row['esito'] . '. La motivazione: ' . $row['motivazione'] . '<button onclick="editRevision(' + $row['numero'] + ')">Edit</button>' . '<button onclick="deleteRevision(' + $row['numero'] + ')">Delete</button>' . '</li>';
            }
            else {
                $output .= '<li>' . 'Revisione ' . $row['numero'] . ' fatta il ' . $row['dataRev'] . ' alla targa ' . $row['targa'] . ', ha avuto esito ' . $row['esito'] . '<button onclick="editRevision(' + $row['numero'] + ')">Edit</button>' . '<button onclick="deleteRevision(' + $row['numero'] + ')">Delete</button>' . '</li>';
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
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];

    $sql = "INSERT INTO products (name, description, price) VALUES ('$name', '$description', '$price')";
    $conn->query($sql);
    echo "success";
}

// Update operation
if($_POST['action'] == 'update') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];

    $sql = "UPDATE products SET name='$name', description='$description', price='$price' WHERE id='$id'";
    $conn->query($sql);
    echo "success";
}

// Delete operation
if($_POST['action'] == 'delete') {
    $id = $_POST['id'];

    $sql = "DELETE FROM products WHERE id='$id'";
    $conn->query($sql);
    echo "success";
}

?>
