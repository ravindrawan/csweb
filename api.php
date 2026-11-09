<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Passcode");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");


require_once __DIR__ . '/config.php';


$upload_dir = __DIR__ . '/uploads/';


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}


// Ensure Database & Tables exist
function ensure_database_ready($db) {
    static $ready = false;
    if ($ready) return;
    
    // Quick table existence check
    $check = $db->query("SHOW TABLES LIKE 'site_data'");
    if ($check->rowCount() == 0) {
        require_once __DIR__ . '/setup_db.php';
    }


    // Ensure phone, email, photo, reset_token columns exist on users table
    try {
        $cols = $db->query("SHOW COLUMNS FROM `users` LIKE 'phone'")->fetch();
        if (!$cols) {
            $db->exec("ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(60) NULL, ADD COLUMN `email` VARCHAR(120) NULL, ADD COLUMN `photo` VARCHAR(255) NULL");
        }
        $tok_col = $db->query("SHOW COLUMNS FROM `users` LIKE 'reset_token'")->fetch();
        if (!$tok_col) {
            $db->exec("ALTER TABLE `users` ADD COLUMN `reset_token` VARCHAR(20) NULL, ADD COLUMN `reset_expires` DATETIME NULL");
        }
    } catch (Exception $e) {}


    // User accounts table is ready and maintained by user registrations


    // Ensure divisionsData officers array is initialized safely without overwriting dynamic additions
    try {
        $stmt_div = $db->query("SELECT `data_json` FROM `site_data` WHERE `section_key` = 'divisionsData'");
        $row_div = $stmt_div->fetch();
        if ($row_div) {
            $divs = json_decode($row_div['data_json'], true);
            if (is_array($divs)) {
                $needs_up = false;
                foreach ($divs as $k => &$d_info) {
                    if (!isset($d_info['officers']) || !is_array($d_info['officers'])) {
                        $d_info['officers'] = [];
                        $needs_up = true;
                    }
                }
                if ($needs_up) {
                    $stmt_up_div = $db->prepare("UPDATE `site_data` SET `data_json` = :d WHERE `section_key` = 'divisionsData'");
                    $stmt_up_div->execute([':d' => json_encode($divs, JSON_UNESCAPED_UNICODE)]);
                }
            }
        }
    } catch (Exception $e) {}


    // Ensure individual upload sub-folders exist inside uploads/ for all active user accounts
    global $upload_dir;
    try {
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        $stmt_u_folders = $db->query("SELECT `username` FROM `users` WHERE `status` = 'Active'");
        while ($u_row = $stmt_u_folders->fetch()) {
            $u_clean = preg_replace('/[^a-zA-Z0-9_-]/', '', strtolower($u_row['username']));
            if (!empty($u_clean)) {
                $u_folder_path = $upload_dir . $u_clean . '/';
                if (!is_dir($u_folder_path)) {
                    mkdir($u_folder_path, 0755, true);
                }
            }
        }
    } catch (Exception $e) {}


    $ready = true;
}


$db = get_db_connection(true);
ensure_database_ready($db);


/**
 * High-reliability multi-engine translator (Sinhala, English, Tamil)
 * Uses Google Translate (Chrome API) with fallback to MyMemory & original text
 */
function normalize_sinhala_orthography($text) {
    if (empty($text)) return '';
    // Normalize archaic ZWJ ligature kssa (ක් + ZWJ + ෂ) to clean modern standard (ක් + ෂ)
    return str_replace("\xE0\xB6\x9A\xE0\xB7\x8A\xE2\x80\x8D\xE0\xB7\x82", "\xE0\xB6\x9A\xE0\xB7\x8A\xE0\xB7\x82", $text);
}
function translate_text_online($text, $target_lang = 'en', $source_lang = 'auto') {
    $text = trim($text);
    if (empty($text)) return '';
    if ($source_lang === $target_lang) return $text;


    $user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    ];
    $ua = $user_agents[array_rand($user_agents)];


    // 1. Google Translate dict-chrome-ex (Fastest, highest quality)
    $url1 = "https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=" . urlencode($source_lang) . "&tl=" . urlencode($target_lang) . "&dt=t&q=" . urlencode($text);
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $ua);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);


        if ($code === 200 && !empty($res)) {
            $data = json_decode($res, true);
            if (is_array($data) && isset($data[0]) && is_array($data[0])) {
                $translated = '';
                foreach ($data[0] as $part) {
                    if (isset($part[0])) $translated .= $part[0];
                }
                if (!empty(trim($translated))) return ($target_lang === 'si') ? normalize_sinhala_orthography($translated) : $translated;
            }
        }
    }


    // 2. Google Translate gtx fallback
    $url2 = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" . urlencode($source_lang) . "&tl=" . urlencode($target_lang) . "&dt=t&q=" . urlencode($text);
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url2);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $ua);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);


        if ($code === 200 && !empty($res)) {
            $data = json_decode($res, true);
            if (is_array($data) && isset($data[0]) && is_array($data[0])) {
                $translated = '';
                foreach ($data[0] as $part) {
                    if (isset($part[0])) $translated .= $part[0];
                }
                if (!empty(trim($translated))) return ($target_lang === 'si') ? normalize_sinhala_orthography($translated) : $translated;
            }
        }
    }


    // 3. MyMemory Translated API fallback
    $from = ($source_lang === 'auto') ? 'si' : $source_lang;
    $url3 = "https://api.mymemory.translated.net/get?q=" . urlencode($text) . "&langpair=" . urlencode($from) . "|" . urlencode($target_lang);
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url3);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $ua);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);


        if (!empty($res)) {
            $data = json_decode($res, true);
            if (isset($data['responseData']['translatedText']) && !empty($data['responseData']['translatedText'])) {
                return ($target_lang === 'si') ? normalize_sinhala_orthography($data['responseData']['translatedText']) : $data['responseData']['translatedText'];
            }
        }
    }


    return $text; // Fallback to original text
}



/**
 * Send Email via Gmail SMTP over SSL (Port 465)
 * Account: digitaldivisionnwp@gmail.com
 * App Password: rafv cupm vezr frfo (rafvcupmvezrfrfo)
 *
 * @param string $to_email Recipient email address
 * @param string $to_name Recipient display name
 * @param string $subject Email subject line
 * @param string $body_html HTML formatted email content
 * @param string $body_text Plain-text fallback content
 * @return array ['success' => bool, 'error' => string|null]
 */
function send_gmail_smtp($to_email, $to_name, $subject, $body_html, $body_text = '') {
    $smtp_host = 'ssl://smtp.gmail.com:465';
    $smtp_user = 'digitaldivisionnwp@gmail.com';
    $smtp_pass = 'rafvcupmvezrfrfo';
    $from_email = 'digitaldivisionnwp@gmail.com';
    $from_name  = 'North Western Provincial Council';
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);
    $socket = @stream_socket_client($smtp_host, $errno, $errstr, 12, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        return ['success' => false, 'error' => "SMTP connection failed: ($errno) $errstr"];
    }
    stream_set_timeout($socket, 12);
    $read_resp = function() use ($socket) {
        $resp = '';
        while ($line = fgets($socket, 515)) {
            $resp .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        return $resp;
    };
    $send_cmd = function($cmd, $expected_code) use ($socket, $read_resp) {
        fwrite($socket, $cmd . "\r\n");
        $resp = $read_resp();
        $code = substr($resp, 0, 3);
        if ($code !== (string)$expected_code) {
            $cmd_label = (strpos($cmd, 'AUTH') === 0) ? 'AUTH' : ((strlen($cmd) > 25) ? substr($cmd, 0, 25) . '...' : $cmd);
            throw new Exception("SMTP command [{$cmd_label}] failed: expected {$expected_code}, got {$code} - {$resp}");
        }
        return $resp;
    };
    try {
        $greeting = $read_resp();
        if (substr($greeting, 0, 3) !== '220') {
            throw new Exception("Invalid greeting from mail server: " . $greeting);
        }
        $send_cmd("EHLO localhost", 250);
        $send_cmd("AUTH LOGIN", 334);
        $send_cmd(base64_encode($smtp_user), 334);
        $send_cmd(base64_encode($smtp_pass), 235);
        $send_cmd("MAIL FROM:<{$from_email}>", 250);
        $send_cmd("RCPT TO:<{$to_email}>", 250);
        $send_cmd("DATA", 354);
        $boundary = "bnd_" . md5(uniqid((string)microtime(), true));
        $encoded_subject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
        $encoded_from = "=?UTF-8?B?" . base64_encode($from_name) . "?= <{$from_email}>";
        $encoded_to = !empty($to_name) ? "=?UTF-8?B?" . base64_encode($to_name) . "?= <{$to_email}>" : "<{$to_email}>";
        $headers = [
            "Date: " . date('r'),
            "From: {$encoded_from}",
            "To: {$encoded_to}",
            "Reply-To: {$from_email}",
            "Subject: {$encoded_subject}",
            "MIME-Version: 1.0",
            "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
            "X-Mailer: ChiefSecretariatNWPC/1.0"
        ];
        $email_content = implode("\r\n", $headers) . "\r\n\r\n";
        // 1. Plain-text version
        if (empty($body_text)) {
            $body_text = strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>'], "\n", $body_html));
        }
        $email_content .= "--{$boundary}\r\n";
        $email_content .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $email_content .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $email_content .= chunk_split(base64_encode($body_text)) . "\r\n";
        // 2. Rich HTML version
        $email_content .= "--{$boundary}\r\n";
        $email_content .= "Content-Type: text/html; charset=UTF-8\r\n";
        $email_content .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $email_content .= chunk_split(base64_encode($body_html)) . "\r\n";
        $email_content .= "--{$boundary}--\r\n";
        fwrite($socket, $email_content . "\r\n.\r\n");
        $data_resp = $read_resp();
        if (substr($data_resp, 0, 3) !== '250') {
            throw new Exception("DATA content rejected: " . $data_resp);
        }
        $send_cmd("QUIT", 221);
        fclose($socket);
        return ['success' => true];
    } catch (Exception $e) {
        @fclose($socket);
        error_log("send_gmail_smtp error: " . $e->getMessage());
        return ['success' => false, 'error' => $e->getMessage()];
    }
}
// Global action handler for on-the-fly and batch translations
if (isset($_GET['action']) && in_array($_GET['action'], ['translate', 'translate_announcement', 'translate_doc_title', 'translate_all'])) {
    $raw = file_get_contents("php://input");
    $body = !empty($raw) ? json_decode($raw, true) : [];


    $text = $_POST['text'] ?? $_GET['text'] ?? $body['text'] ?? '';
    $sl = $_POST['sl'] ?? $_GET['sl'] ?? $body['sl'] ?? 'auto';


    if (empty(trim($text))) {
        echo json_encode(["success" => false, "error" => "No text provided"]);
        exit;
    }


    if ($_GET['action'] === 'translate') {
        $tl = $_POST['tl'] ?? $_GET['tl'] ?? $body['tl'] ?? 'en';
        $translated = translate_text_online($text, $tl, $sl);
        echo json_encode([
            "success" => true,
            "original" => $text,
            "translatedText" => $translated,
            "targetLang" => $tl,
            "sourceLang" => $sl
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }


    if (in_array($_GET['action'], ['translate_announcement', 'translate_doc_title', 'translate_all'])) {
        $trans_en = translate_text_online($text, 'en', $sl);
        $trans_si = translate_text_online($text, 'si', $sl);
        $trans_ta = translate_text_online($text, 'ta', $sl);


        echo json_encode([
            "success" => true,
            "translations" => [
                "en" => $trans_en,
                "si" => $trans_si,
                "ta" => $trans_ta
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}


// GET method: Read and return complete dataset from MySQL
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Action check for Users listing
    if (isset($_GET['action']) && $_GET['action'] === 'users') {
        try {
            $stmt = $db->query("SELECT `id`, `username`, `full_name`, `role`, `division_id`, `unit_name`, `status`, `phone`, `email`, `photo`, `created_at` FROM `users` ORDER BY `id` ASC");
            $users = $stmt->fetchAll();
            echo json_encode(["success" => true, "users" => $users], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch users: " . $e->getMessage()]);
            exit;
        }
    }


    // Action check for public Units availability (for registration dropdown)
    if (isset($_GET['action']) && $_GET['action'] === 'units_availability') {
        try {
            $stmt = $db->query("SELECT `division_id`, `username`, `full_name`, `unit_name` FROM `users` WHERE `division_id` IS NOT NULL");
            $assigned = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Fetch live divisionsData so registration dropdown always has all divisions & sub-units
            $stmt_d = $db->query("SELECT `data_json` FROM `site_data` WHERE `section_key` = 'divisionsData'");
            $row_d = $stmt_d->fetch();
            $divisionsData = ($row_d && !empty($row_d['data_json'])) ? json_decode($row_d['data_json'], true) : [];
            echo json_encode([
                "success" => true,
                "assigned" => $assigned,
                "divisionsData" => $divisionsData
            ], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
            exit;
        }
    }
    try {
        $result = [
            "siteTranslations" => (object)[],
            "divisionsData" => (object)[],
            "subOrgsData" => [],
            "documents" => [],
            "projects" => [],
            "stats" => [],
            "inquiries" => [],
            "rtiPhoto" => "",
            "rtiOfficers" => [],
            "systems" => [],
            "divisionPortals" => []
        ];


        // 1. Fetch site_data key-value pairs
        $stmt_site = $db->query("SELECT `section_key`, `data_json` FROM `site_data`");
        while ($row = $stmt_site->fetch()) {
            $key = $row['section_key'];
            $decoded = json_decode($row['data_json'], true);
            if ($decoded !== null) {
                $result[$key] = $decoded;
            }
        }


        // Dynamically merge registered officers from MySQL `users` table into divisionsData['1']['officers']
        if (isset($result['divisionsData'])) {
            $divs = is_object($result['divisionsData']) ? (array)$result['divisionsData'] : $result['divisionsData'];
            try {
                $stmt_u = $db->query("SELECT `id`, `username`, `full_name`, `role`, `division_id`, `unit_name`, `phone`, `email`, `photo` FROM `users` WHERE `status` = 'Active' AND `division_id` IS NOT NULL ORDER BY `division_id` ASC");
                $reg_users = $stmt_u->fetchAll(PDO::FETCH_ASSOC);


                $default_meta = [
                    1 => ['Deputy Chief Secretary (Administration)', 'නියෝජ්‍ය ප්‍රධාන ලේකම් (පරිපාලන)', 'பிரதி தலைமைச் செயலாளர் (நிர்வாகம்)', '+94 37 223 1769', 'dcsadmin@nw.gov.lk'],
                    2 => ['Senior Assistant Secretary (Establishment)', 'ජ්‍යෙෂ්ඨ සහකාර ලේකම් (ආයතන)', 'சிரேஷ்ட உதவிச் செயலாளர் (ஸ்தாபனம்)', '+94 37 222 3451', 'establishment@nw.gov.lk'],
                    3 => ['Senior Statistical Officer', 'ජ්‍යෙෂ්ඨ සංඛ්‍යාලේඛන නිලධාරී', 'சிரேஷ்ட புள்ளிவிவர அதிகாரி', '+94 37 223 1890', 'statistics@nw.gov.lk'],
                    4 => ['Provincial Legal Officer', 'පළාත් නීති නිලධාරී', 'மாகாண சட்ட அதிகாரி', '+94 37 222 8901', 'legal@nw.gov.lk'],
                    5 => ['Chief Accountant (Provincial Accounts)', 'ප්‍රධාන ගණකාධිකාරී', 'பிரதான கணக்காளர்', '+94 37 223 1542', 'accounts@nw.gov.lk'],
                    6 => ['Director (Digital Governance & GIS)', 'අධ්‍යක්ෂ (ඩිජිටල් පාලන හා GIS)', 'பணிப்பாளர் (டிஜிட்டல் ஆளுகை & GIS)', '+94 37 222 7890', 'digital@nw.gov.lk'],
                    7 => ['Senior Translator (Official Languages)', 'ජ්‍යෙෂ්ඨ රාජ්‍ය භාෂා පරිවර්තක', 'சிரேஷ்ட மொழிபெயர்ப்பாளர்', '+94 37 223 1944', 'translation@nw.gov.lk']
                ];


                $unit_map = [
                    1 => 'Administration Division',
                    2 => 'Establishment Office',
                    3 => 'Statistical Unit',
                    4 => 'Legal Unit',
                    5 => 'Accounts Unit',
                    6 => 'Digital Division (ICT + GIS)',
                    7 => 'Translation Unit'
                ];


                $chief_units = [
                    'administration division',
                    'establishment office',
                    'statistical unit',
                    'legal unit',
                    'accounts unit',
                    'digital division (ict + gis)',
                    'translation unit'
                ];
                // 1. Purge any misplaced Chief Secretariat officers (e.g. Legal Unit) from other statutory divisions (Divisions 2, 3, 4, 5)
                $cleaned_stale = false;
                foreach ($divs as $k => &$d_info) {
                    if (isset($d_info['officers']) && is_array($d_info['officers'])) {
                        if (strval($k) !== '1') {
                            $orig_count = count($d_info['officers']);
                            $d_info['officers'] = array_values(array_filter($d_info['officers'], function($o) use ($chief_units) {
                                $u = strtolower(trim($o['unit'] ?? ''));
                                return !in_array($u, $chief_units);
                            }));
                            if (count($d_info['officers']) !== $orig_count) {
                                $cleaned_stale = true;
                            }
                        }
                    }
                }
                unset($d_info);
                if ($cleaned_stale) {
                    try {
                        $stmt_clean = $db->prepare("UPDATE `site_data` SET `data_json` = :dj WHERE `section_key` = 'divisionsData'");
                        $stmt_clean->execute([':dj' => json_encode($divs, JSON_UNESCAPED_UNICODE)]);
                    } catch (Exception $e) {}
                }
                // 2. Map registered users to their correct division with full trilingual metadata
                $unit_id_by_name = [
                    'administration division' => 1,
                    'establishment office' => 2,
                    'statistical unit' => 3,
                    'legal unit' => 4,
                    'accounts unit' => 5,
                    'digital division (ict + gis)' => 6,
                    'translation unit' => 7
                ];
                foreach ($reg_users as $ru) {
                    $div_id = (int)$ru['division_id'];
                    $unit_resolved = !empty($ru['unit_name']) ? $ru['unit_name'] : ($unit_map[$div_id] ?? 'General Unit');
                    $user_role = !empty($ru['role']) ? $ru['role'] : 'Administrative Officer';
                    $unit_name_norm = strtolower(trim($unit_resolved));
                    $sub_unit_id = $unit_id_by_name[$unit_name_norm] ?? $div_id;
                    $meta = $default_meta[$sub_unit_id] ?? $default_meta[$div_id] ?? [$user_role, $user_role, $user_role, '+94 37 223 1769', 'info@nw.gov.lk'];
                    $officer_data = [
                        "id" => (int)$ru['id'],
                        "division_id" => $div_id,
                        "name_en" => $ru['full_name'],
                        "name_si" => $ru['full_name'],
                        "name_ta" => $ru['full_name'],
                        "role_en" => $meta[0],
                        "role_si" => $meta[1],
                        "role_ta" => $meta[2],
                        "unit" => $unit_resolved,
                        "phone" => !empty($ru['phone']) ? $ru['phone'] : $meta[3],
                        "email" => !empty($ru['email']) ? $ru['email'] : ($ru['username'] . '@nw.gov.lk'),
                        "photo" => !empty($ru['photo']) ? $ru['photo'] : ''
                    ];
                    $unit_norm = strtolower(trim($unit_resolved));
                    $target_div_key = null;
                    // The 7 Chief Secretariat units (IDs 1 to 7) belong exclusively to Division 1 (Administration Division)
                    if (in_array($unit_norm, $chief_units) || ($div_id <= 7 && empty($ru['unit_name']))) {
                        $target_div_key = '1';
                    } else if ($div_id > 100) {
                        $p_id = intval($div_id / 100);
                        if (isset($divs[strval($p_id)])) {
                            $target_div_key = strval($p_id);
                        }
                    } else if (isset($divs[strval($div_id)])) {
                        $target_div_key = strval($div_id);
                    } else {
                        $target_div_key = '1';
                    }
                    if ($target_div_key !== null && isset($divs[$target_div_key])) {
                        if (!isset($divs[$target_div_key]['officers']) || !is_array($divs[$target_div_key]['officers'])) {
                            $divs[$target_div_key]['officers'] = [];
                        }
                        $existing_ids = array_column($divs[$target_div_key]['officers'], 'id');
                        if (!in_array($officer_data['id'], $existing_ids)) {
                            $divs[$target_div_key]['officers'][] = $officer_data;
                        }
                    }
                }
                $result['divisionsData'] = $divs;
            } catch (Exception $e) {}
        }


        // Auto-sync hero section texts if missing or defaulted
        if (isset($result['siteTranslations']) && is_array($result['siteTranslations'])) {
            $trans = &$result['siteTranslations'];
            $needs_update = false;


            if (empty($trans['en']['heroBadgeText'])) {
                $trans['en']['heroBadgeText'] = 'Chief Secretariat • North Western Provincial Council';
                $needs_update = true;
            }
            if (empty($trans['en']['homeSearchTitle']) || $trans['en']['homeSearchTitle'] === 'Provincial Document & Service Portal') {
                $trans['en']['homeSearchTitle'] = 'How can we help you today?';
                $trans['en']['homeSearchSubtitle'] = 'Search official circulars, engineering rate books, transfer lists, forms, and administrative directives';
                $needs_update = true;
            }


            if (isset($trans['si'])) {
                if (empty($trans['si']['heroBadgeText'])) {
                    $trans['si']['heroBadgeText'] = 'ප්‍රධාන ලේකම් කාර්යාලය • වයඹ පළාත් සභාව';
                    $needs_update = true;
                }
                if (empty($trans['si']['homeSearchTitle']) || $trans['si']['homeSearchTitle'] === 'පළාත් ලේඛන සහ සේවා ද්වාරය') {
                    $trans['si']['homeSearchTitle'] = 'අද දින අපෙන් ඔබට කෙසේ සහය විය හැකිද?';
                    $trans['si']['homeSearchSubtitle'] = 'නිල චක්‍රලේඛ, ඉංජිනේරු මිල ගණන් පොත්, ස්ථාන මාරු නාමලේඛන සහ ආකෘති පත්‍ර සොයන්න';
                    $needs_update = true;
                }
            }


            if (isset($trans['ta'])) {
                if (empty($trans['ta']['heroBadgeText'])) {
                    $trans['ta']['heroBadgeText'] = 'பிரதம தலைமைச் செயலகம் • வடமேல் மாகாண சபை';
                    $needs_update = true;
                }
                if (empty($trans['ta']['homeSearchTitle'])) {
                    $trans['ta']['homeSearchTitle'] = 'இன்று நாங்கள் உங்களுக்கு எவ்வாறு உதவ முடியும்?';
                    $trans['ta']['homeSearchSubtitle'] = 'அதிகாரப்பூர்வ சுற்றறிக்கைகள், பொறியியல் விலைப்பட்டியல்கள், இடமாற்றப் பட்டியல்கள் மற்றும் படிவங்களைத் தேடுங்கள்';
                    $needs_update = true;
                }
            }


            if ($needs_update) {
                $stmt_up = $db->prepare("UPDATE `site_data` SET `data_json` = :data WHERE `section_key` = 'siteTranslations'");
                $stmt_up->execute([':data' => json_encode($trans, JSON_UNESCAPED_UNICODE)]);
            }
        }


        // 2. Fetch documents
        $stmt_docs = $db->query("SELECT * FROM `documents` ORDER BY `id` ASC");
        $docs = [];
        while ($row = $stmt_docs->fetch()) {
            $docs[] = [
                "id" => (int)$row['id'],
                "title_en" => $row['title_en'] ?? '',
                "title_si" => $row['title_si'] ?? '',
                "title_ta" => $row['title_ta'] ?? '',
                "division" => is_numeric($row['division']) ? (int)$row['division'] : $row['division'],
                "type" => $row['type'] ?? '',
                "size" => $row['size'] ?? '',
                "url" => $row['url'] ?? '',
                "url_en" => $row['url_en'] ?? '',
                "url_si" => $row['url_si'] ?? '',
                "url_ta" => $row['url_ta'] ?? '',
                "isNew" => (bool)$row['is_new'],
                "featured" => (bool)$row['featured'],
                "created_by_user_id" => $row['created_by_user_id'] ? (int)$row['created_by_user_id'] : null,
                "created_by_username" => $row['created_by_username'] ?? '',
                "created_at" => $row['created_at'] ?? '',
                "date" => !empty($row['created_at']) ? substr($row['created_at'], 0, 10) : ''
            ];
        }
        $result['documents'] = $docs;


        // 3. Fetch inquiries
        $stmt_inq = $db->query("SELECT `id`, `name`, `nic`, `phone`, `email`, `message`, `date` FROM `inquiries` ORDER BY `created_at` DESC");
        $inquiries = [];
        while ($row = $stmt_inq->fetch()) {
            $inquiries[] = [
                "id" => $row['id'],
                "name" => $row['name'],
                "nic" => $row['nic'],
                "phone" => $row['phone'],
                "email" => $row['email'],
                "message" => $row['message'],
                "date" => $row['date']
            ];
        }
        $result['inquiries'] = $inquiries;


        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch database content: " . $e->getMessage()]);
        exit;
    }
}


/**
 * Optimizes and compresses uploaded files (images & documents)
 * Automatically resizes large images to max 1920px, strips redundant metadata,
 * compresses JPEG/WebP/PNG using native PHP GD, and probes for PDF optimizers.
 *
 * @param string $file_path Absolute path to the uploaded file on disk
 * @param string $file_ext File extension in lowercase
 * @return array ['optimized' => bool, 'original_bytes' => int, 'new_bytes' => int, 'savings_percent' => float]
 */
function optimize_uploaded_file($file_path, $file_ext) {
    if (!file_exists($file_path)) {
        return ['optimized' => false, 'original_bytes' => 0, 'new_bytes' => 0, 'savings_percent' => 0];
    }

    $original_bytes = (int)filesize($file_path);
    $ext = strtolower($file_ext);
    $optimized = false;

    // 1. Optimize Images via GD (jpg, jpeg, png, webp)
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp']) && extension_loaded('gd')) {
        $img = null;

        if ($ext === 'jpg' || $ext === 'jpeg') {
            if (function_exists('imagecreatefromjpeg')) {
                $img = @imagecreatefromjpeg($file_path);
            }
        } elseif ($ext === 'png') {
            if (function_exists('imagecreatefrompng')) {
                $img = @imagecreatefrompng($file_path);
            }
        } elseif ($ext === 'webp') {
            if (function_exists('imagecreatefromwebp')) {
                $img = @imagecreatefromwebp($file_path);
            }
        }

        if (!$img && function_exists('imagecreatefromstring')) {
            $raw_data = @file_get_contents($file_path);
            if ($raw_data) {
                $img = @imagecreatefromstring($raw_data);
            }
        }

        if ($img) {
            // Check EXIF Orientation for JPEG images to preserve upright orientation
            if (($ext === 'jpg' || $ext === 'jpeg') && function_exists('exif_read_data')) {
                $exif = @exif_read_data($file_path);
                if (!empty($exif['Orientation'])) {
                    switch ($exif['Orientation']) {
                        case 3:
                            $rotated = @imagerotate($img, 180, 0);
                            if ($rotated) { imagedestroy($img); $img = $rotated; }
                            break;
                        case 6:
                            $rotated = @imagerotate($img, -90, 0);
                            if ($rotated) { imagedestroy($img); $img = $rotated; }
                            break;
                        case 8:
                            $rotated = @imagerotate($img, 90, 0);
                            if ($rotated) { imagedestroy($img); $img = $rotated; }
                            break;
                    }
                }
            }

            $orig_w = imagesx($img);
            $orig_h = imagesy($img);
            $max_dim = 1920;

            if ($orig_w > $max_dim || $orig_h > $max_dim) {
                $scale = min($max_dim / $orig_w, $max_dim / $orig_h);
                $new_w = max(1, (int)round($orig_w * $scale));
                $new_h = max(1, (int)round($orig_h * $scale));

                $canvas = imagecreatetruecolor($new_w, $new_h);
                if ($ext === 'png' || $ext === 'webp') {
                    imagealphablending($canvas, false);
                    imagesavealpha($canvas, true);
                    $transparent = imagecolorallocatealpha($canvas, 255, 255, 255, 127);
                    imagefilledrectangle($canvas, 0, 0, $new_w, $new_h, $transparent);
                }

                imagecopyresampled($canvas, $img, 0, 0, 0, 0, $new_w, $new_h, $orig_w, $orig_h);
                imagedestroy($img);
                $img = $canvas;
            }

            $tmp_opt = $file_path . '.opt.tmp';
            $saved = false;

            if ($ext === 'jpg' || $ext === 'jpeg') {
                $saved = @imagejpeg($img, $tmp_opt, 82);
            } elseif ($ext === 'png') {
                imagealphablending($img, false);
                imagesavealpha($img, true);
                $saved = @imagepng($img, $tmp_opt, 7);
            } elseif ($ext === 'webp' && function_exists('imagewebp')) {
                $saved = @imagewebp($img, $tmp_opt, 82);
            }

            imagedestroy($img);

            if ($saved && file_exists($tmp_opt)) {
                $opt_bytes = filesize($tmp_opt);
                if ($opt_bytes > 0 && $opt_bytes < $original_bytes) {
                    @unlink($file_path);
                    @rename($tmp_opt, $file_path);
                    $optimized = true;
                } else {
                    @unlink($tmp_opt);
                }
            }
        }
    }
    // 2. PDF Optimization (Ghostscript / qpdf check)
    elseif ($ext === 'pdf') {
        $gs_cmd = null;
        foreach (['gswin64c', 'gswin32c', 'gs', 'qpdf'] as $bin) {
            $check = @shell_exec("where " . escapeshellarg($bin) . " 2>&1");
            if ($check && stripos($check, 'Could not find') === false && stripos($check, 'not recognized') === false) {
                $lines = explode("\n", trim($check));
                $gs_cmd = trim($lines[0]);
                break;
            }
        }

        if ($gs_cmd) {
            $tmp_pdf = $file_path . '.opt.pdf';
            if (stripos($gs_cmd, 'qpdf') !== false) {
                $cmd = escapeshellarg($gs_cmd) . " --linearize --replace-input " . escapeshellarg($file_path) . " 2>&1";
                @shell_exec($cmd);
            } else {
                $cmd = escapeshellarg($gs_cmd) . " -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=" . escapeshellarg($tmp_pdf) . " " . escapeshellarg($file_path) . " 2>&1";
                @shell_exec($cmd);
                if (file_exists($tmp_pdf)) {
                    $opt_bytes = filesize($tmp_pdf);
                    if ($opt_bytes > 0 && $opt_bytes < $original_bytes) {
                        @unlink($file_path);
                        @rename($tmp_pdf, $file_path);
                        $optimized = true;
                    } else {
                        @unlink($tmp_pdf);
                    }
                }
            }
        }
    }

    $final_bytes = (int)filesize($file_path);
    $savings = $original_bytes > 0 ? max(0, round((($original_bytes - $final_bytes) / $original_bytes) * 100, 1)) : 0;

    return [
        'optimized' => $optimized,
        'original_bytes' => $original_bytes,
        'new_bytes' => $final_bytes,
        'savings_percent' => $savings
    ];
}


// POST method: Write updated data or handle file uploads / inquiries
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. File Upload action check
    if (isset($_GET['action']) && $_GET['action'] === 'upload') {
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(["error" => "No file uploaded in the request."]);
            exit;
        }


        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(500);
            echo json_encode(["error" => "File upload error code: " . $file['error']]);
            exit;
        }


        // Security check: Validate file extension
        $allowed_exts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'webp'];
        $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));


        if (!in_array($file_ext, $allowed_exts)) {
            http_response_code(400);
            echo json_encode(["error" => "Security Restriction: Invalid file type (.{$file_ext}). Only documents and images are permitted."]);
            exit;
        }


        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }


        // Determine user-specific subdirectory inside uploads/ (e.g. uploads/establishment/, uploads/accounts/)
        $user_raw = $_POST['username'] ?? $_GET['user'] ?? '';
        $user_slug = preg_replace('/[^a-zA-Z0-9_-]/', '', strtolower(trim($user_raw)));
        if (empty($user_slug)) {
            $user_slug = 'admin';
        }


        $target_dir = $upload_dir . $user_slug . '/';
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0755, true);
        }


        $safe_basename = pathinfo($file['name'], PATHINFO_FILENAME);
        $safe_basename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $safe_basename);
        $filename = $safe_basename . '_' . time() . '.' . $file_ext;
        $target_file = $target_dir . $filename;


        if (move_uploaded_file($file['tmp_name'], $target_file)) {
            $opt_result = optimize_uploaded_file($target_file, $file_ext);
            $bytes = filesize($target_file);
            if ($bytes >= 1048576) {
                $size_str = number_format($bytes / 1048576, 1) . ' MB';
            } else {
                $size_str = number_format($bytes / 1024, 0) . ' KB';
            }

            echo json_encode([
                "success" => true,
                "url" => "uploads/" . $user_slug . "/" . $filename,
                "size" => $size_str,
                "filename" => $filename,
                "optimized" => $opt_result['optimized'],
                "savings" => $opt_result['savings_percent'] . '%'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save uploaded file."]);
        }
        exit;
    }


    // 2. Public contact inquiry submission
    if (isset($_GET['action']) && $_GET['action'] === 'inquiry') {
        $raw_input = file_get_contents("php://input");
        $inquiry = json_decode($raw_input, true);


        if (!$inquiry || empty($inquiry['name']) || empty($inquiry['nic']) || empty($inquiry['phone']) || empty($inquiry['message'])) {
            http_response_code(400);
            echo json_encode(["error" => "Incomplete inquiry details. All mandatory fields must be filled."]);
            exit;
        }


        $new_id = time() . '_' . rand(100, 999);
        $name = strip_tags($inquiry['name']);
        $nic = strip_tags($inquiry['nic']);
        $phone = strip_tags($inquiry['phone']);
        $email = !empty($inquiry['email']) ? filter_var($inquiry['email'], FILTER_SANITIZE_EMAIL) : '';
        $message = strip_tags($inquiry['message']);
        $date = date("Y-m-d H:i:s");


        try {
            $stmt = $db->prepare("
                INSERT INTO `inquiries` (`id`, `name`, `nic`, `phone`, `email`, `message`, `date`)
                VALUES (:id, :name, :nic, :phone, :email, :message, :date)
            ");
            $stmt->execute([
                ':id' => $new_id,
                ':name' => $name,
                ':nic' => $nic,
                ':phone' => $phone,
                ':email' => $email,
                ':message' => $message,
                ':date' => $date
            ]);


            echo json_encode(["success" => true, "message" => "Inquiry submitted successfully."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save inquiry to database: " . $e->getMessage()]);
        }
        exit;
    }


    // 3. User Authentication Action (Login)
    if (isset($_GET['action']) && $_GET['action'] === 'login') {
        $raw_input = file_get_contents("php://input");
        $input = json_decode($raw_input, true);
        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');


        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(["error" => "Username and password are required."]);
            exit;
        }


        try {
            $stmt = $db->prepare("SELECT * FROM `users` WHERE `username` = :username");
            $stmt->execute([':username' => $username]);
            $user = $stmt->fetch();


            if ($user && $user['status'] === 'Active' && password_verify($password, $user['password_hash'])) {
                echo json_encode([
                    "success" => true,
                    "user" => [
                        "id" => (int)$user['id'],
                        "username" => $user['username'],
                        "full_name" => $user['full_name'],
                        "role" => $user['role'],
                        "division_id" => $user['division_id'] ? (int)$user['division_id'] : null,
                        "unit_name" => $user['unit_name'] ?? '',
                        "phone" => $user['phone'] ?? '',
                        "email" => $user['email'] ?? '',
                        "photo" => $user['photo'] ?? ''
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Invalid credentials or account is inactive."]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Login check failed: " . $e->getMessage()]);
        }
        exit;
    }


    // 4. Create User / Register Action
    if (isset($_GET['action']) && ($_GET['action'] === 'create_user' || $_GET['action'] === 'register')) {
        $raw_input = file_get_contents("php://input");
        $input = json_decode($raw_input, true);


        $username = trim($input['username'] ?? '');
        $full_name = trim($input['full_name'] ?? '');
        $password = trim($input['password'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $email = trim($input['email'] ?? '');
        $role = trim($input['role'] ?? 'Admin');
        $division_id = !empty($input['division_id']) ? (int)$input['division_id'] : null;
        $status = trim($input['status'] ?? 'Active');


        if (empty($username) || empty($full_name) || empty($password)) {
            http_response_code(400);
            echo json_encode(["error" => "Username, full name, and password are required."]);
            exit;
        }


        if ($role !== 'Super Admin' && empty($division_id)) {
            http_response_code(400);
            echo json_encode(["error" => "A division assignment is mandatory for division officer accounts."]);
            exit;
        }
        if ($role === 'Super Admin') {
            $division_id = null;
        }


        try {
            // Check username existence
            $stmt_check = $db->prepare("SELECT COUNT(*) FROM `users` WHERE `username` = :username");
            $stmt_check->execute([':username' => $username]);
            if ($stmt_check->fetchColumn() > 0) {
                http_response_code(400);
                echo json_encode(["error" => "Username already exists."]);
                exit;
            }


            $unit_name = trim($input['unit_name'] ?? '');
            $admin_sub_units = [
                'establishment office',
                'statistical unit',
                'legal unit',
                'accounts unit',
                'digital division (ict + gis)',
                'translation unit'
            ];
            $u_norm = strtolower(trim($unit_name));
            if (in_array($u_norm, $admin_sub_units)) {
                $division_id = 1;
            } else if (!empty($division_id) && $division_id > 100) {
                $p_id = intval($division_id / 100);
                $s_idx = ($division_id % 100) - 1;
                if (empty($unit_name)) {
                    $stmt_d = $db->query("SELECT `data_json` FROM `site_data` WHERE `section_key` = 'divisionsData'");
                    $r_d = $stmt_d->fetch();
                    if ($r_d && !empty($r_d['data_json'])) {
                        $all_d = json_decode($r_d['data_json'], true);
                        if (isset($all_d[$p_id]['sections_en'][$s_idx])) {
                            $unit_name = $all_d[$p_id]['sections_en'][$s_idx];
                        }
                    }
                }
                $division_id = $p_id;
            }
            if (empty($unit_name) && !empty($division_id)) {
                $stmt_d = $db->query("SELECT `data_json` FROM `site_data` WHERE `section_key` = 'divisionsData'");
                $r_d = $stmt_d->fetch();
                if ($r_d && !empty($r_d['data_json'])) {
                    $all_d = json_decode($r_d['data_json'], true);
                    if (isset($all_d[$division_id]['name_en'])) {
                        $unit_name = $all_d[$division_id]['name_en'];
                    }
                }
            }
            if (empty($unit_name)) {
                $unit_name = ($role === 'Super Admin') ? 'Chief Secretariat (All Units)' : ('Division ' . $division_id);
            }
            // Enforce: only one user account per division / unit
            if (!empty($unit_name) && $unit_name !== 'Chief Secretariat (All Units)') {
                $stmt_u_check = $db->prepare("SELECT `id`, `username`, `full_name` FROM `users` WHERE LOWER(TRIM(`unit_name`)) = :u");
                $stmt_u_check->execute([':u' => strtolower(trim($unit_name))]);
                $existing_user = $stmt_u_check->fetch();
                if ($existing_user) {
                    http_response_code(400);
                    echo json_encode(["error" => "This unit ('{$unit_name}') already has an assigned officer account ('" . $existing_user['username'] . "' - " . $existing_user['full_name'] . "). Only one user account is allowed per unit."]);
                    exit;
                }
            } else if (!empty($division_id)) {
                $stmt_div_check = $db->prepare("SELECT `id`, `username`, `full_name` FROM `users` WHERE `division_id` = :division_id AND (`unit_name` IS NULL OR `unit_name` = '' OR `unit_name` = 'General Unit')");
                $stmt_div_check->execute([':division_id' => $division_id]);
                $existing_div_user = $stmt_div_check->fetch();
                if ($existing_div_user) {
                    http_response_code(400);
                    echo json_encode(["error" => "This division already has an assigned officer account ('" . $existing_div_user['username'] . "' - " . $existing_div_user['full_name'] . "). Only one user account is allowed per unit."]);
                    exit;
                }
            }


            $pass_hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $db->prepare("
                INSERT INTO `users` (`username`, `password_hash`, `full_name`, `role`, `division_id`, `unit_name`, `phone`, `email`, `status`)
                VALUES (:username, :password_hash, :full_name, :role, :division_id, :unit_name, :phone, :email, :status)
            ");
            $stmt->execute([
                ':username' => $username,
                ':password_hash' => $pass_hash,
                ':full_name' => $full_name,
                ':role' => $role,
                ':division_id' => $division_id,
                ':unit_name' => $unit_name,
                ':phone' => $phone,
                ':email' => $email,
                ':status' => $status
            ]);


            // Create user-specific upload directory inside uploads/
            $u_clean = preg_replace('/[^a-zA-Z0-9_-]/', '', strtolower($username));
            if (!empty($u_clean)) {
                $u_dir = $upload_dir . $u_clean . '/';
                if (!is_dir($u_dir)) {
                    mkdir($u_dir, 0755, true);
                }
            }


            echo json_encode(["success" => true, "message" => "User created successfully."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create user: " . $e->getMessage()]);
        }
        exit;
    }


    // 5. Update User Action
    if (isset($_GET['action']) && $_GET['action'] === 'update_user') {
        $raw_input = file_get_contents("php://input");
        $input = json_decode($raw_input, true);


        $id = (int)($input['id'] ?? 0);
        $username = trim($input['username'] ?? '');
        $full_name = trim($input['full_name'] ?? '');
        $password = trim($input['password'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $email = trim($input['email'] ?? '');
        $role = trim($input['role'] ?? 'Admin');
        $division_id = !empty($input['division_id']) ? (int)$input['division_id'] : null;
        $status = trim($input['status'] ?? 'Active');


        if ($id <= 0 || empty($username) || empty($full_name)) {
            http_response_code(400);
            echo json_encode(["error" => "Valid User ID, username, and full name are required."]);
            exit;
        }


        if ($role !== 'Super Admin' && empty($division_id)) {
            http_response_code(400);
            echo json_encode(["error" => "A division assignment is mandatory for division officer accounts."]);
            exit;
        }
        if ($role === 'Super Admin') {
            $division_id = null;
        }


        try {
            // Check username duplicate for other users
            $stmt_check = $db->prepare("SELECT COUNT(*) FROM `users` WHERE `username` = :username AND `id` != :id");
            $stmt_check->execute([':username' => $username, ':id' => $id]);
            if ($stmt_check->fetchColumn() > 0) {
                http_response_code(400);
                echo json_encode(["error" => "Username is already used by another account."]);
                exit;
            }


            $unit_name = trim($input['unit_name'] ?? '');
            $admin_sub_units = [
                'establishment office',
                'statistical unit',
                'legal unit',
                'accounts unit',
                'digital division (ict + gis)',
                'translation unit'
            ];
            $u_norm = strtolower(trim($unit_name));
            if (in_array($u_norm, $admin_sub_units)) {
                $division_id = 1;
            } else if (!empty($division_id) && $division_id > 100) {
                $p_id = intval($division_id / 100);
                $s_idx = ($division_id % 100) - 1;
                if (empty($unit_name)) {
                    $stmt_d = $db->query("SELECT `data_json` FROM `site_data` WHERE `section_key` = 'divisionsData'");
                    $r_d = $stmt_d->fetch();
                    if ($r_d && !empty($r_d['data_json'])) {
                        $all_d = json_decode($r_d['data_json'], true);
                        if (isset($all_d[$p_id]['sections_en'][$s_idx])) {
                            $unit_name = $all_d[$p_id]['sections_en'][$s_idx];
                        }
                    }
                }
                $division_id = $p_id;
            }
            if (empty($unit_name) && !empty($division_id)) {
                $stmt_d = $db->query("SELECT `data_json` FROM `site_data` WHERE `section_key` = 'divisionsData'");
                $r_d = $stmt_d->fetch();
                if ($r_d && !empty($r_d['data_json'])) {
                    $all_d = json_decode($r_d['data_json'], true);
                    if (isset($all_d[$division_id]['name_en'])) {
                        $unit_name = $all_d[$division_id]['name_en'];
                    }
                }
            }
            if (empty($unit_name)) {
                $unit_name = ($role === 'Super Admin') ? 'Chief Secretariat (All Units)' : ('Division ' . $division_id);
            }
            // Enforce: only one user account per division / unit
            if (!empty($unit_name) && $unit_name !== 'Chief Secretariat (All Units)') {
                $stmt_u_check = $db->prepare("SELECT `id`, `username`, `full_name` FROM `users` WHERE LOWER(TRIM(`unit_name`)) = :u AND `id` != :id");
                $stmt_u_check->execute([':u' => strtolower(trim($unit_name)), ':id' => $id]);
                $existing_user = $stmt_u_check->fetch();
                if ($existing_user) {
                    http_response_code(400);
                    echo json_encode(["error" => "This unit ('{$unit_name}') already has an assigned officer account ('" . $existing_user['username'] . "' - " . $existing_user['full_name'] . "). Only one user account is allowed per unit."]);
                    exit;
                }
            } else if (!empty($division_id)) {
                $stmt_div_check = $db->prepare("SELECT `id`, `username`, `full_name` FROM `users` WHERE `division_id` = :division_id AND (`unit_name` IS NULL OR `unit_name` = '' OR `unit_name` = 'General Unit') AND `id` != :id");
                $stmt_div_check->execute([':division_id' => $division_id, ':id' => $id]);
                $existing_div_user = $stmt_div_check->fetch();
                if ($existing_div_user) {
                    http_response_code(400);
                    echo json_encode(["error" => "This division already has an assigned officer account ('" . $existing_div_user['username'] . "' - " . $existing_div_user['full_name'] . "). Only one user account is allowed per unit."]);
                    exit;
                }
            }


            if (!empty($password)) {
                $pass_hash = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $db->prepare("
                    UPDATE `users` 
                    SET `username` = :username, `password_hash` = :password_hash, `full_name` = :full_name, `role` = :role, `division_id` = :division_id, `unit_name` = :unit_name, `phone` = :phone, `email` = :email, `status` = :status
                    WHERE `id` = :id
                ");
                $stmt->execute([
                    ':username' => $username,
                    ':password_hash' => $pass_hash,
                    ':full_name' => $full_name,
                    ':role' => $role,
                    ':division_id' => $division_id,
                    ':unit_name' => $unit_name,
                    ':phone' => $phone,
                    ':email' => $email,
                    ':status' => $status,
                    ':id' => $id
                ]);
            } else {
                $stmt = $db->prepare("
                    UPDATE `users` 
                    SET `username` = :username, `full_name` = :full_name, `role` = :role, `division_id` = :division_id, `unit_name` = :unit_name, `phone` = :phone, `email` = :email, `status` = :status
                    WHERE `id` = :id
                ");
                $stmt->execute([
                    ':username' => $username,
                    ':full_name' => $full_name,
                    ':role' => $role,
                    ':division_id' => $division_id,
                    ':unit_name' => $unit_name,
                    ':phone' => $phone,
                    ':email' => $email,
                    ':status' => $status,
                    ':id' => $id
                ]);
            }


            echo json_encode(["success" => true, "message" => "User updated successfully."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update user: " . $e->getMessage()]);
        }
        exit;
    }


    // 6. Delete User Action
    if (isset($_GET['action']) && $_GET['action'] === 'delete_user') {
        $raw_input = file_get_contents("php://input");
        $input = json_decode($raw_input, true);
        $id = (int)($input['id'] ?? 0);


        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Valid User ID is required."]);
            exit;
        }


        try {
            // Check if user to delete is Super Admin
            $stmt_role = $db->prepare("SELECT `role` FROM `users` WHERE `id` = :id");
            $stmt_role->execute([':id' => $id]);
            $target_role = $stmt_role->fetchColumn();


            if ($target_role === 'Super Admin') {
                $stmt_count = $db->query("SELECT COUNT(*) FROM `users` WHERE `role` = 'Super Admin'");
                $super_count = $stmt_count->fetchColumn();
                if ($super_count <= 1) {
                    http_response_code(400);
                    echo json_encode(["error" => "Cannot delete the last remaining Super Admin account. At least one Super Admin must exist."]);
                    exit;
                }
            }


            $stmt = $db->prepare("DELETE FROM `users` WHERE `id` = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(["success" => true, "message" => "User deleted successfully."]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete user: " . $e->getMessage()]);
        }
        exit;
    }


    // 6.1 Update Profile Action (User Self-Service)
    if (isset($_GET['action']) && $_GET['action'] === 'update_profile') {
        $raw_input = file_get_contents("php://input");
        $input = json_decode($raw_input, true);
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Valid User ID is required."]);
            exit;
        }
        try {
            $stmt_curr = $db->prepare("SELECT * FROM `users` WHERE `id` = :id");
            $stmt_curr->execute([':id' => $id]);
            $user = $stmt_curr->fetch();
            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "User account not found."]);
                exit;
            }
            $full_name = trim($input['full_name'] ?? '');
            if (empty($full_name)) {
                $full_name = !empty($user['full_name']) ? $user['full_name'] : $user['username'];
            }
            $phone = trim($input['phone'] ?? ($user['phone'] ?? ''));
            $email = trim($input['email'] ?? ($user['email'] ?? ''));
            $password = trim($input['password'] ?? '');
            $current_password = trim($input['current_password'] ?? '');
            $fields = ["`full_name` = :full_name", "`phone` = :phone", "`email` = :email"];
            $params = [
                ':full_name' => $full_name,
                ':phone' => $phone,
                ':email' => $email,
                ':id' => $id
            ];


            if (!empty($password)) {
                if (empty($current_password)) {
                    http_response_code(400);
                    echo json_encode(["error" => "Current password is required to change password."]);
                    exit;
                }
                if (!password_verify($current_password, $user['password_hash'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "Incorrect current password. Please re-enter your current password."]);
                    exit;
                }
                if (strlen($password) < 6) {
                    http_response_code(400);
                    echo json_encode(["error" => "New password must be at least 6 characters long."]);
                    exit;
                }
                $fields[] = "`password_hash` = :password_hash";
                $params[':password_hash'] = password_hash($password, PASSWORD_DEFAULT);
            }


            if (isset($input['photo'])) {
                $fields[] = "`photo` = :photo";
                $params[':photo'] = trim($input['photo']);
            }


            $sql = "UPDATE `users` SET " . implode(", ", $fields) . " WHERE `id` = :id";
            $stmt_up = $db->prepare($sql);
            $stmt_up->execute($params);


            // Fetch refreshed user
            $stmt_ref = $db->prepare("SELECT * FROM `users` WHERE `id` = :id");
            $stmt_ref->execute([':id' => $id]);
            $updated = $stmt_ref->fetch();


            echo json_encode([
                "success" => true,
                "message" => "Profile updated successfully!",
                "user" => [
                    "id" => (int)$updated['id'],
                    "username" => $updated['username'],
                    "full_name" => $updated['full_name'],
                    "role" => $updated['role'],
                    "division_id" => $updated['division_id'] ? (int)$updated['division_id'] : null,
                    "unit_name" => $updated['unit_name'] ?? '',
                    "phone" => $updated['phone'] ?? '',
                    "email" => $updated['email'] ?? '',
                    "photo" => $updated['photo'] ?? ''
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update profile: " . $e->getMessage()]);
        }
        exit;
    }


    // 6.2 Password Recovery: Step 1 - Send 6-Digit OTP via Email
    if (isset($_GET['action']) && $_GET['action'] === 'forgot_send_code') {
        $raw_input = file_get_contents("php://input");
        $input = json_decode($raw_input, true);


        $identifier = trim($input['identifier'] ?? $input['username'] ?? $input['email'] ?? '');


        if (empty($identifier)) {
            http_response_code(400);
            echo json_encode(["error" => "Please enter your account username or registered email."]);
            exit;
        }


        try {
            $stmt = $db->prepare("SELECT * FROM `users` WHERE `username` = :id1 OR `email` = :id2 LIMIT 1");
            $stmt->execute([':id1' => $identifier, ':id2' => $identifier]);
            $user = $stmt->fetch();


            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "No account found matching '{$identifier}'."]);
                exit;
            }


            $email = !empty($user['email']) ? trim($user['email']) : (filter_var($user['username'], FILTER_VALIDATE_EMAIL) ? trim($user['username']) : '');


            if (empty($email)) {
                http_response_code(400);
                echo json_encode(["error" => "No registered email address found for this user account. Please contact the Chief Secretariat IT Administrator."]);
                exit;
            }


            // Generate 6-digit verification code
            $code = sprintf("%06d", mt_rand(100000, 999999));
            $expires = date('Y-m-d H:i:s', strtotime('+15 minutes'));


            $stmt_tok = $db->prepare("UPDATE `users` SET `reset_token` = :code, `reset_expires` = :expires WHERE `id` = :id");
            $stmt_tok->execute([
                ':code' => $code,
                ':expires' => $expires,
                ':id' => $user['id']
            ]);


            // Mask email for user privacy display: e.g., d***p@gmail.com
            $parts = explode('@', $email);
            $local = $parts[0];
            $domain = $parts[1] ?? '';
            $masked_local = (strlen($local) <= 2) ? substr($local, 0, 1) . '***' : substr($local, 0, 1) . str_repeat('*', min(4, max(1, strlen($local) - 2))) . substr($local, -1);
            $masked_email = $masked_local . '@' . $domain;
            // Prepare Email Content
            $recipient_name = !empty($user['full_name']) ? $user['full_name'] : $user['username'];
            $subject = "Chief Secretariat NWPC - Password Reset Verification Code: {$code}";
            $mail_body = "==================================================\n"
                       . "CHIEF SECRETARIAT - NORTH WESTERN PROVINCIAL COUNCIL\n"
                       . "වයඹ පළාත් සභාව - ප්‍රධාන ලේකම් කාර්යාලය\n"
                       . "==================================================\n\n"
                       . "Dear {$recipient_name},\n\n"
                       . "A password reset request was initiated for your Chief Secretariat portal account ({$user['username']}).\n\n"
                       . "Your 6-Digit Password Reset Verification Code is:\n"
                       . "--------------------------------------------------\n"
                       . ">>>   " . $code . "   <<<\n"
                       . "--------------------------------------------------\n\n"
                       . "This verification code is valid for 15 minutes.\n"
                       . "මෙම සත්‍යාපන කේතය වලංගු වන්නේ විනාඩි 15ක් පමණි.\n\n"
                       . "If you did not request this password reset, please contact the Chief Secretariat IT Desk immediately.\n\n"
                       . "Chief Secretariat, Provincial Council Complex, Kurunegala\n"
                       . "Official Web: https://cs.nw.gov.lk | Tel: +94 37 223 1769\n"
                       . "Sender: digitaldivisionnwp@gmail.com";
            $mail_html = <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #380000 0%, #5b0606 100%); padding: 26px 30px; text-align: center; border-bottom: 3px solid #f59e0b;">
              <h1 style="margin: 0; color: #ffffff; font-size: 19px; font-weight: 800; letter-spacing: 0.5px;">NORTH WESTERN PROVINCIAL COUNCIL</h1>
              <p style="margin: 5px 0 0 0; color: #fde68a; font-size: 13px; font-weight: 600;">CHIEF SECRETARIAT | වයඹ පළාත් සභාව - ප්‍රධාන ලේකම් කාර්යාලය</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 30px 24px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #380000; font-size: 18px; font-weight: 700;">🔑 Password Recovery Verification</h2>
              <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.6; color: #334155;">Dear <strong>{$recipient_name}</strong>,</p>
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #334155;">A password reset request was initiated for your Chief Secretariat portal account (Username: <code style="background:#f1f5f9; padding:2px 7px; border-radius:4px; font-weight:700; color:#0f172a;">{$user['username']}</code>).</p>
              <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #475569;">Your 6-Digit Verification Code is:</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 14px 0 22px 0;">
                <tr>
                  <td align="center" style="background-color: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px 15px;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">One-Time Verification Code</span>
                    <span style="display: inline-block; font-family: Courier New, Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #380000; background: #ffffff; padding: 6px 18px; border-radius: 8px; border: 1px solid #fde68a;">{$code}</span>
                    <span style="display: block; font-size: 12px; font-weight: 600; color: #b45309; margin-top: 10px;">⏱️ Valid for 15 minutes</span>
                  </td>
                </tr>
              </table>
              <div style="background-color: #f8fafc; border-left: 4px solid #380000; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 22px;">
                <p style="margin: 0 0 6px 0; font-size: 13px; line-height: 1.5; color: #1e293b;"><strong>සිංහල:</strong> මෙම සත්‍යාපන කේතය පද්ධතියට ඇතුළත් කර ඔබගේ මුරපදය නැවත සකස් කරන්න. කිසිවෙකු සමඟ මෙය බෙදා නොගන්න.</p>
                <p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #475569;"><strong>English:</strong> Enter this verification code in the portal to reset your password. Do not share this OTP with anyone.</p>
              </div>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 14px;">
                🛡️ <strong>Security Advisory:</strong> If you did not request this, please immediately notify the Chief Secretariat IT Desk at <a href="mailto:digitaldivisionnwp@gmail.com" style="color:#b45309; text-decoration:none;">digitaldivisionnwp@gmail.com</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f1f5f9; padding: 18px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11.5px; color: #64748b; line-height: 1.5;">
              <div><strong>Chief Secretariat - North Western Provincial Council</strong></div>
              <div>Provincial Council Complex, Kurunegala, Sri Lanka</div>
              <div>Official Web: <a href="https://cs.nw.gov.lk" style="color: #380000; text-decoration: underline;">cs.nw.gov.lk</a> | Tel: +94 37 223 1769</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
            // Send via Gmail SMTP (digitaldivisionnwp@gmail.com)
            $smtp_result = send_gmail_smtp($email, $recipient_name, $subject, $mail_html, $mail_body);
            if (!$smtp_result['success']) {
                error_log("Failed to send OTP to {$email}: " . ($smtp_result['error'] ?? 'Unknown SMTP error'));
                http_response_code(500);
    
            echo json_encode([
                    "error" => "Failed to deliver verification code email to {$masked_email}. " . ($smtp_result['error'] ?? 'Please check internet connection.')
                ]);
                exit;
            }
            echo json_encode([
                "success" => true,
                "message" => "Verification code sent to {$masked_email}.",
                "masked_email" => $masked_email,
                "username" => $user['username']
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to generate verification code: " . $e->getMessage()]);
        }
        exit;
    }


    // 6.3 Password Recovery: Step 2 - Verify Code & Set New Password
    if (isset($_GET['action']) && $_GET['action'] === 'forgot_verify_reset') {
        $raw_input = file_get_contents("php://input");
        $input = json_decode($raw_input, true);


        $username = trim($input['username'] ?? '');
        $code = trim($input['code'] ?? '');
        $new_password = trim($input['new_password'] ?? '');


        if (empty($username) || empty($code) || empty($new_password)) {
            http_response_code(400);
            echo json_encode(["error" => "Username, verification code, and new password are required."]);
            exit;
        }


        if (strlen($new_password) < 6) {
            http_response_code(400);
            echo json_encode(["error" => "New password must be at least 6 characters long."]);
            exit;
        }


        try {
            $stmt = $db->prepare("SELECT * FROM `users` WHERE `username` = :username LIMIT 1");
            $stmt->execute([':username' => $username]);
            $user = $stmt->fetch();


            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "Account not found for username '{$username}'."]);
                exit;
            }


            if (empty($user['reset_token'])) {
                http_response_code(400);
                echo json_encode(["error" => "No active password reset request found. Please request a new verification code."]);
                exit;
            }


            if (trim($user['reset_token']) !== $code) {
                http_response_code(400);
                echo json_encode(["error" => "Invalid 6-digit verification code. Please check your email and try again."]);
                exit;
            }


            if (!empty($user['reset_expires']) && strtotime($user['reset_expires']) < time()) {
                http_response_code(400);
                echo json_encode(["error" => "The verification code has expired (valid for 15 minutes). Please request a new one."]);
                exit;
            }


            $pwd_hash = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt_up = $db->prepare("UPDATE `users` SET `password_hash` = :hash, `reset_token` = NULL, `reset_expires` = NULL WHERE `id` = :id");
            $stmt_up->execute([
                ':hash' => $pwd_hash,
                ':id' => $user['id']
            ]);


            echo json_encode([
                "success" => true,
                "message" => "Password for '{$username}' has been successfully updated! You can now sign in with your new credentials."
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Password reset failed: " . $e->getMessage()]);
        }
        exit;
    }


    // 6.4 Legacy Password Recovery Fallback
    if (isset($_GET['action']) && $_GET['action'] === 'forgot_password') {
        $raw_input = file_get_contents("php://input");
        $input = json_decode($raw_input, true);


        $username = trim($input['username'] ?? '');
        $phone_or_email = trim($input['phone_or_email'] ?? $input['phone'] ?? '');
        $new_password = trim($input['new_password'] ?? '');


        if (empty($username) || empty($phone_or_email) || empty($new_password)) {
            http_response_code(400);
            echo json_encode(["error" => "Username, official phone/email, and a new password are required."]);
            exit;
        }


        if (strlen($new_password) < 6) {
            http_response_code(400);
            echo json_encode(["error" => "New password must be at least 6 characters long."]);
            exit;
        }


        try {
            $stmt = $db->prepare("SELECT * FROM `users` WHERE `username` = :username");
            $stmt->execute([':username' => $username]);
            $user = $stmt->fetch();


            if (!$user) {
                http_response_code(404);
                echo json_encode(["error" => "No account found with username '{$username}'."]);
                exit;
            }


            $clean_input_phone = preg_replace('/[^0-9]/', '', $phone_or_email);
            $clean_user_phone = preg_replace('/[^0-9]/', '', $user['phone'] ?? '');
            
            $phone_matches = (!empty($clean_input_phone) && !empty($clean_user_phone) && (strpos($clean_user_phone, $clean_input_phone) !== false || strpos($clean_input_phone, $clean_user_phone) !== false));
            $email_matches = (!empty($user['email']) && strtolower(trim($user['email'])) === strtolower(trim($phone_or_email)));


            if (!$phone_matches && !$email_matches && !empty($user['phone'])) {
                http_response_code(400);
                echo json_encode(["error" => "Verification failed: The phone number or email does not match our records for this user."]);
                exit;
            }


            $pwd_hash = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt_up = $db->prepare("UPDATE `users` SET `password_hash` = :password_hash WHERE `id` = :id");
            $stmt_up->execute([':password_hash' => $pwd_hash, ':id' => $user['id']]);


            echo json_encode([
                "success" => true,
                "message" => "Password for '{$username}' has been successfully reset! You can now log in with your new password."
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Password recovery failed: " . $e->getMessage()]);
        }
        exit;
    }


    // 3. Regular JSON Database Update (Admin Panel)
    $raw_input = file_get_contents("php://input");
    $decoded = json_decode($raw_input, true);


    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload."]);
        exit;
    }


    if (!isset($decoded['siteTranslations']) || !isset($decoded['documents'])) {
        http_response_code(400);
        echo json_encode(["error" => "Incompatible JSON database structure."]);
        exit;
    }


    try {
        $db->beginTransaction();


        // Save site_data sections
        $sections = ['siteTranslations', 'divisionsData', 'subOrgsData', 'projects', 'stats', 'systems', 'rtiPhoto', 'rtiOfficers', 'divisionPortals'];
        $stmt_site = $db->prepare("
            INSERT INTO `site_data` (`section_key`, `data_json`)
            VALUES (:section_key, :data_json)
            ON DUPLICATE KEY UPDATE `data_json` = VALUES(`data_json`)
        ");
        // 1. Auto-translate announcements in siteTranslations if missing or dots
        if (isset($decoded['siteTranslations']) && is_array($decoded['siteTranslations'])) {
            $ann_en = trim($decoded['siteTranslations']['en']['announcementsText'] ?? '');
            $ann_si = trim($decoded['siteTranslations']['si']['announcementsText'] ?? '');
            $ann_ta = trim($decoded['siteTranslations']['ta']['announcementsText'] ?? '');
            $is_dots = function($txt) { return empty($txt) || preg_match('/^[\s\.\,\-]+$/', $txt); };
            $pri_ann = !$is_dots($ann_si) ? $ann_si : (!$is_dots($ann_en) ? $ann_en : (!$is_dots($ann_ta) ? $ann_ta : ''));
            if (!empty($pri_ann)) {
                if ($is_dots($ann_si) || !preg_match('/[\x{0D80}-\x{0DFF}]/u', $ann_si)) {
                    $tr = translate_text_online($pri_ann, 'si', 'auto');
                    if (!empty($tr)) $decoded['siteTranslations']['si']['announcementsText'] = normalize_sinhala_orthography($tr);
                }
                if ($is_dots($ann_ta) || !preg_match('/[\x{0B80}-\x{0BFF}]/u', $ann_ta)) {
                    $tr = translate_text_online($pri_ann, 'ta', 'auto');
                    if (!empty($tr)) $decoded['siteTranslations']['ta']['announcementsText'] = $tr;
                }
                if ($is_dots($ann_en) || !preg_match('/[a-zA-Z]{3,}/', $ann_en)) {
                    $tr = translate_text_online($pri_ann, 'en', 'auto');
                    if (!empty($tr)) $decoded['siteTranslations']['en']['announcementsText'] = $tr;
                }
            }
        }
        // 2. Auto-translate projects / news articles if any language fields are missing
        if (isset($decoded['projects']) && is_array($decoded['projects'])) {
            foreach ($decoded['projects'] as &$p) {
                $p_title_en = trim($p['title_en'] ?? '');
                $p_title_si = trim($p['title_si'] ?? '');
                $p_title_ta = trim($p['title_ta'] ?? '');
                $pri_title = $p_title_si ?: ($p_title_en ?: $p_title_ta);
                if (!empty($pri_title)) {
                    $has_si = preg_match('/[\x{0D80}-\x{0DFF}]/u', $p_title_si);
                    $has_ta = preg_match('/[\x{0B80}-\x{0BFF}]/u', $p_title_ta);
                    $has_en = preg_match('/[a-zA-Z]{3,}/', $p_title_en);
                    if (empty($p_title_si) || !$has_si) {
                        $tr = translate_text_online($pri_title, 'si', 'auto');
                        if (!empty($tr)) $p['title_si'] = normalize_sinhala_orthography($tr);
                    }
                    if (empty($p_title_ta) || !$has_ta) {
                        $tr = translate_text_online($pri_title, 'ta', 'auto');
                        if (!empty($tr)) $p['title_ta'] = $tr;
                    }
                    if (empty($p_title_en) || !$has_en) {
                        $tr = translate_text_online($pri_title, 'en', 'auto');
                        if (!empty($tr)) $p['title_en'] = $tr;
                    }
                }
                $p_desc_en = trim($p['desc_en'] ?? '');
                $p_desc_si = trim($p['desc_si'] ?? '');
                $p_desc_ta = trim($p['desc_ta'] ?? '');
                $pri_desc = $p_desc_si ?: ($p_desc_en ?: $p_desc_ta);
                if (!empty($pri_desc)) {
                    $has_si = preg_match('/[\x{0D80}-\x{0DFF}]/u', $p_desc_si);
                    $has_ta = preg_match('/[\x{0B80}-\x{0BFF}]/u', $p_desc_ta);
                    $has_en = preg_match('/[a-zA-Z]{3,}/', $p_desc_en);
                    if (empty($p_desc_si) || !$has_si) {
                        $tr = translate_text_online($pri_desc, 'si', 'auto');
                        if (!empty($tr)) $p['desc_si'] = normalize_sinhala_orthography($tr);
                    }
                    if (empty($p_desc_ta) || !$has_ta) {
                        $tr = translate_text_online($pri_desc, 'ta', 'auto');
                        if (!empty($tr)) $p['desc_ta'] = $tr;
                    }
                    if (empty($p_desc_en) || !$has_en) {
                        $tr = translate_text_online($pri_desc, 'en', 'auto');
                        if (!empty($tr)) $p['desc_en'] = $tr;
                    }
                }
            }
            unset($p);
        }
        foreach ($sections as $sec) {
            if (isset($decoded[$sec])) {
                $stmt_site->execute([
                    ':section_key' => $sec,
                    ':data_json' => json_encode($decoded[$sec], JSON_UNESCAPED_UNICODE)
                ]);
            }
        }


        // Save documents with full trilingual auto-translation protection
        if (isset($decoded['documents']) && is_array($decoded['documents'])) {
            $db->exec("DELETE FROM `documents`");
            $stmt_doc = $db->prepare("
                INSERT INTO `documents` (`id`, `title_en`, `title_si`, `title_ta`, `division`, `type`, `size`, `url`, `url_en`, `url_si`, `url_ta`, `is_new`, `featured`, `created_by_user_id`, `created_by_username`, `created_at`)
                VALUES (:id, :title_en, :title_si, :title_ta, :division, :type, :size, :url, :url_en, :url_si, :url_ta, :is_new, :featured, :created_by_user_id, :created_by_username, :created_at)
            ");
            foreach ($decoded['documents'] as $doc) {
                $createdAt = !empty($doc['created_at']) ? $doc['created_at'] : (!empty($doc['date']) ? $doc['date'] . ' 00:00:00' : date('Y-m-d H:i:s'));
                $t_en = trim($doc['title_en'] ?? '');
                $t_si = trim($doc['title_si'] ?? '');
                $t_ta = trim($doc['title_ta'] ?? '');
                $primary_t = $t_si ?: ($t_en ?: $t_ta);
                // Auto-translate missing titles if any language is blank or untranslated
                if (!empty($primary_t)) {
                    $has_sinhala = preg_match('/[\x{0D80}-\x{0DFF}]/u', $t_si);
                    $has_tamil = preg_match('/[\x{0B80}-\x{0BFF}]/u', $t_ta);
                    $has_english = preg_match('/[a-zA-Z]{3,}/', $t_en);
                    if (empty($t_si) || !$has_sinhala) {
                        $tr = translate_text_online($primary_t, 'si', 'auto');
                        if (!empty($tr)) $t_si = normalize_sinhala_orthography($tr);
                    }
                    if (empty($t_ta) || !$has_tamil) {
                        $tr = translate_text_online($primary_t, 'ta', 'auto');
                        if (!empty($tr)) $t_ta = $tr;
                    }
                    if (empty($t_en) || !$has_english) {
                        $tr = translate_text_online($primary_t, 'en', 'auto');
                        if (!empty($tr)) $t_en = $tr;
                    }
                }
                if (empty($t_en)) $t_en = $primary_t;
                if (empty($t_si)) $t_si = $primary_t;
                if (empty($t_ta)) $t_ta = $primary_t;
                $stmt_doc->execute([
                    ':id' => $doc['id'] ?? null,
                    ':title_en' => $t_en,
                    ':title_si' => $t_si,
                    ':title_ta' => $t_ta,
                    ':division' => $doc['division'] ?? '',
                    ':type' => $doc['type'] ?? '',
                    ':size' => $doc['size'] ?? '',
                    ':url' => $doc['url'] ?? '',
                    ':url_en' => $doc['url_en'] ?? '',
                    ':url_si' => $doc['url_si'] ?? '',
                    ':url_ta' => $doc['url_ta'] ?? '',
                    ':is_new' => (!empty($doc['isNew']) || !empty($doc['is_new'])) ? 1 : 0,
                    ':featured' => !empty($doc['featured']) ? 1 : 0,
                    ':created_by_user_id' => !empty($doc['created_by_user_id']) ? (int)$doc['created_by_user_id'] : null,
                    ':created_by_username' => $doc['created_by_username'] ?? null,
                    ':created_at' => $createdAt
                ]);
            }
        }


        // Save inquiries if updated from admin
        if (isset($decoded['inquiries']) && is_array($decoded['inquiries'])) {
            $db->exec("DELETE FROM `inquiries`");
            $stmt_inq = $db->prepare("
                INSERT INTO `inquiries` (`id`, `name`, `nic`, `phone`, `email`, `message`, `date`)
                VALUES (:id, :name, :nic, :phone, :email, :message, :date)
            ");
            foreach ($decoded['inquiries'] as $inq) {
                $stmt_inq->execute([
                    ':id' => $inq['id'] ?? (time() . '_' . rand(100, 999)),
                    ':name' => $inq['name'] ?? '',
                    ':nic' => $inq['nic'] ?? '',
                    ':phone' => $inq['phone'] ?? '',
                    ':email' => $inq['email'] ?? '',
                    ':message' => $inq['message'] ?? '',
                    ':date' => !empty($inq['date']) ? $inq['date'] : date("Y-m-d H:i:s")
                ]);
            }
        }


        $db->commit();


        echo json_encode(["success" => true, "message" => "Database updated successfully."]);
    } catch (Exception $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        http_response_code(500);
        echo json_encode(["error" => "Failed to update database: " . $e->getMessage()]);
    }
    exit;
}


http_response_code(405);
echo json_encode(["error" => "Method Not Allowed."]);
