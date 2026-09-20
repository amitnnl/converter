<?php
/**
 * PressWebP - Auto-Save Endpoint
 * Automatically saves converted 1:1 WebP animations to the local files/ directory.
 */

// Enable CORS for local development environments
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method Not Allowed. Use POST.'
    ]);
    exit;
}

$saveDir = __DIR__ . DIRECTORY_SEPARATOR . 'files';

if (!is_dir($saveDir)) {
    if (!mkdir($saveDir, 0777, true) && !is_dir($saveDir)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to create destination files/ directory on server.'
        ]);
        exit;
    }
}

$rawBody = file_get_contents('php://input');
$jsonData = json_decode($rawBody, true);

$rawFilename = '';
$binaryData = null;

if ($jsonData && isset($jsonData['data'])) {
    // JSON with Base64 payload
    $rawFilename = isset($jsonData['filename']) ? (string)$jsonData['filename'] : 'converted_1x1.webp';
    $base64 = $jsonData['data'];
    
    // Strip data URL prefix if present
    if (strpos($base64, 'base64,') !== false) {
        $base64 = explode('base64,', $base64)[1];
    }
    
    $binaryData = base64_decode($base64, true);
    if ($binaryData === false) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid base64 payload provided.'
        ]);
        exit;
    }
} elseif (isset($_FILES['file']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
    // Multipart form-data upload
    $rawFilename = isset($_POST['filename']) ? (string)$_POST['filename'] : $_FILES['file']['name'];
    $binaryData = file_get_contents($_FILES['file']['tmp_name']);
}

if (!$binaryData || strlen($binaryData) < 12) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'No valid WebP data received in request.'
    ]);
    exit;
}

// Basic RIFF / WEBP header verification
$magicHeader = substr($binaryData, 0, 4);
$formatHeader = substr($binaryData, 8, 4);
if ($magicHeader !== 'RIFF' || $formatHeader !== 'WEBP') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid WebP header signature.'
    ]);
    exit;
}

// Sanitize filename to prevent directory traversal
$safeName = basename($rawFilename);
$safeName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $safeName);
$nameWithoutExt = preg_replace('/\.webp$/i', '', $safeName);
if (empty($nameWithoutExt)) {
    $nameWithoutExt = 'converted_' . time();
}

$finalFilename = $nameWithoutExt . '.webp';
$targetFilePath = $saveDir . DIRECTORY_SEPARATOR . $finalFilename;

// Write binary data safely to disk
$bytesWritten = @file_put_contents($targetFilePath, $binaryData, LOCK_EX);

if ($bytesWritten === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Could not write WebP file to files/ directory. Check folder permissions.'
    ]);
    exit;
}

// Return success response with relative path
echo json_encode([
    'success' => true,
    'filename' => $finalFilename,
    'path' => 'files/' . $finalFilename,
    'url' => 'files/' . rawurlencode($finalFilename),
    'size' => $bytesWritten,
    'savedAt' => date('Y-m-d H:i:s')
]);
