<?php
    $dbHost = 'localhost'; // Change this if your database host is different
    $dbUsername = 'sbunibgpw'; // Change this to your database username
    $dbName = 'my_sbunibgpw'; // Change this to your database name
	$password = null;
	$error = false;
	
	try {
		$conn = new PDO("mysql:host=" . $dbHost. ";" . "dbname=" . $dbName, $dbUsername, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch(PDOException$e) {
		echo "<p>DB Error: " . $e->getMessage() . "</p>";
		$error = true;
	}
?>