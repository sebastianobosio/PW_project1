<?php
// Database configuration
$dbHost = 'localhost'; // Change this if your database host is different
$dbUsername = 'sbunibgpw'; // Change this to your database username
$dbPassword = ''; // Change this to your database password
$dbName = 'my_sbunibgpw'; // Change this to your database name

// Create a connection to the database
$conn = mysqli_connect($dbHost, $dbUsername, $dbPassword, $dbName);

// Check if the connection was successful
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Set UTF-8 character set
mysqli_set_charset($conn, 'utf8');

// Optionally, you can define other database-related functions or configurations here

?>
