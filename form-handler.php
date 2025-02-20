<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];

    $file = fopen("leads.csv", "a");
    fputcsv($file, [$name, $email]);
    fclose($file);

    echo "Thank you! We will contact you soon.";
}
?>
