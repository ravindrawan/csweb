<?php
// Load local .env file if present (DevOps / Container 12-Factor App methodology)
if (file_exists(__DIR__ . '/.env')) {
    $env_lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($env_lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) continue;
        list($k, $v) = explode('=', $line, 2);
        $k = trim($k);
        $v = trim(trim($v), '"\'');
        if (getenv($k) === false) {
            putenv("{$k}={$v}");
            $_ENV[$k] = $v;
        }
    }
}

// Database configuration parameters (Environment variables with local fallback)
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_NAME', getenv('DB_NAME') ?: 'csweb_db');
define('DB_CHARSET', 'utf8mb4');

/**
 * Returns a PDO connection to the MySQL server.
 * If $select_db is true, it selects the csweb_db database.
 */
function get_db_connection($select_db = true) {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
        if ($select_db) {
            $dsn .= ";dbname=" . DB_NAME;
        }

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // Fallback to alternative port (3306 <-> 3307) for smooth local XAMPP & Docker interoperability
        $alt_port = (DB_PORT === 3307) ? 3306 : 3307;
        try {
            $dsn_fallback = "mysql:host=" . DB_HOST . ";port=" . $alt_port . ";charset=" . DB_CHARSET;
            if ($select_db) {
                $dsn_fallback .= ";dbname=" . DB_NAME;
            }
            return new PDO($dsn_fallback, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e2) {
            http_response_code(500);
            echo json_encode([
                "error" => "Database connection failed: " . $e->getMessage()
            ]);
            exit;
        }
    }
}
