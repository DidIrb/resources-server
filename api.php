<?php
header("Content-Type: application/json");
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo, $input);
        break;
    case 'PUT':
        handlePut($pdo, $input);
        break;
    case 'DELETE':
        handleDelete($pdo, $input);
        break;
    default:
        echo json_encode(['message' => 'Invalid request method']);
        break;
}

function handleGet($pdo) {
    $sql = "SELECT * FROM resources";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
}

function handlePost($pdo, $input) {
    $sanitizedInput = array_map('sanitizeInput', $input);

    $sql = "INSERT INTO resources (value, resource, name, link, image_url, icon, description) VALUES (:value, :resource, :name, :link, :image_url, :icon, :description)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($sanitizedInput);
    echo json_encode(['message' => 'Resource created successfully']);
}

function handlePut($pdo, $input) {
    $sanitizedInput = array_map('sanitizeInput', $input);

    $sql = "UPDATE resources SET value = :value, resource = :resource, name = :name, link = :link, image_url = :image_url, icon = :icon, description = :description WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($sanitizedInput);
    echo json_encode(['message' => 'Resource updated successfully']);
}

function sanitizeInput($value) {
    if (is_array($value)) {
        return array_map('sanitizeInput', $value);
    }
    return htmlspecialchars(filter_var($value, FILTER_SANITIZE_STRING));
}


?>