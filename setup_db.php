<?php
/**
 * Automated Database Setup & Seeder for Chief Secretariat - NWP Web Portal
 * Database: csweb_db
 */

require_once __DIR__ . '/config.php';

function run_db_setup($output_json = false) {
    $db_host = DB_HOST;
    $db_user = DB_USER;
    $db_pass = DB_PASS;
    $db_name = DB_NAME;
    $charset = DB_CHARSET;

    // Connect to MySQL server without selecting database first
    $pdo = null;
    $connected_port = null;

    $ports = [DB_PORT, 3307, 3306];
    $ports = array_unique($ports);

    $last_error = "";
    foreach ($ports as $port) {
        try {
            $dsn = "mysql:host={$db_host};port={$port};charset={$charset}";
            $pdo = new PDO($dsn, $db_user, $db_pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $connected_port = $port;
            break;
        } catch (PDOException $e) {
            $last_error = $e->getMessage();
        }
    }

    if (!$pdo) {
        if ($output_json) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Could not connect to MySQL server: " . $last_error]);
            exit;
        }
        return ["success" => false, "error" => $last_error];
    }

    try {
        // 1. Create database
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `{$db_name}`");

        // 2. Create users table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `users` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `username` VARCHAR(60) NOT NULL UNIQUE,
                `password_hash` VARCHAR(255) NOT NULL,
                `full_name` VARCHAR(120) NOT NULL,
                `role` ENUM('Super Admin', 'Admin', 'Editor') NOT NULL DEFAULT 'Admin',
                `division_id` INT NULL,
                `unit_name` VARCHAR(120) NULL,
                `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY `unique_unit_name` (`unit_name`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // 3. Create site_data table (Stores JSON blobs for translations, divisions, systems, stats, RTI)
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `site_data` (
                `section_key` VARCHAR(64) PRIMARY KEY,
                `data_json` LONGTEXT NOT NULL,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // 4. Create documents table (Stores circulars, rate books, forms, transfer lists)
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `documents` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `title_en` VARCHAR(255) NOT NULL,
                `title_si` VARCHAR(255) DEFAULT '',
                `title_ta` VARCHAR(255) DEFAULT '',
                `division` VARCHAR(64) NOT NULL,
                `type` VARCHAR(64) NOT NULL DEFAULT 'Circular',
                `size` VARCHAR(32) NOT NULL DEFAULT '1.0 MB',
                `url` VARCHAR(255) DEFAULT '',
                `url_en` VARCHAR(255) DEFAULT '',
                `url_si` VARCHAR(255) DEFAULT '',
                `url_ta` VARCHAR(255) DEFAULT '',
                `is_new` TINYINT(1) NOT NULL DEFAULT 1,
                `featured` TINYINT(1) NOT NULL DEFAULT 0,
                `created_by_user_id` INT NULL,
                `created_by_username` VARCHAR(60) NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // 5. Create inquiries table (Stores citizen submissions)
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `inquiries` (
                `id` VARCHAR(64) PRIMARY KEY,
                `name` VARCHAR(120) NOT NULL,
                `nic` VARCHAR(32) NOT NULL,
                `phone` VARCHAR(32) NOT NULL,
                `email` VARCHAR(120) DEFAULT '',
                `message` TEXT NOT NULL,
                `status` ENUM('New', 'Reviewed', 'Resolved') DEFAULT 'New',
                `date` VARCHAR(32) NOT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // 6. Seed Super Admin User if none exists
        $user_count = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
        if ($user_count == 0) {
            $stmt = $pdo->prepare("
                INSERT INTO `users` (`username`, `password_hash`, `full_name`, `role`, `status`)
                VALUES (:u, :p, :n, :r, 'Active')
            ");
            $default_pass = password_hash('admin123', PASSWORD_DEFAULT);
            $stmt->execute([
                ':u' => 'admin',
                ':p' => $default_pass,
                ':n' => 'Chief Secretariat Administrator',
                ':r' => 'Super Admin'
            ]);
        }

        // 7. Seed Real NWP Divisions matching cs.nw.gov.lk
        $divisionsData = [
            "1" => [
                "id" => 1,
                "code" => "admin",
                "name_en" => "Administration Division",
                "name_si" => "පරිපාලන අංශය",
                "name_ta" => "நிர்வாகப் பிரிவு",
                "desc_en" => "Oversees executive provincial administration, personnel establishments, legal affairs, state statistics, accounting management, official translations, and digital governance.",
                "desc_si" => "ප්‍රාදේශීය පරිපාලනය, කාර්ය මණ්ඩල ආයතනික කටයුතු, නීති කටයුතු, පළාත් සංඛ්‍යාලේඛන, ගිණුම්කරණය, පරිවර්තන සහ ඩිජිටල් පාලනය මෙහෙයවනු ලබයි.",
                "desc_ta" => "மாகாண நிர்வாகம், பணியாளர் ஸ்தாபனம், சட்ட விவகாரங்கள், புள்ளிவிவரங்கள், கணக்குகள் மற்றும் டிஜிட்டல் ஆளுகையை மேற்பார்வையிடுகிறது.",
                "head_title_en" => "Deputy Chief Secretary (Administration)",
                "head_title_si" => "නියෝජ්‍ය ප්‍රධාන ලේකම් (පරිපාලන)",
                "head_title_ta" => "பிரதி தலைமைச் செயலாளர் (நிர்வாகம்)",
                "sections_en" => ["Establishment Office", "Statistical Unit", "Legal Unit", "Accounts Unit", "Digital Division (ICT + GIS)", "Translation Unit"],
                "sections_si" => ["ආයතන අංශය", "සංඛ්‍යාලේඛන ඒකකය", "නීති ඒකකය", "ගිණුම් ඒකකය", "ඩිජිටල් ඒකකය (තොරතුරු තාක්ෂණ + GIS)", "පරිවර්තන ඒකකය"],
                "sections_ta" => ["ஸ்தாபன அலுவலகம்", "புள்ளிவிவரப் பிரிவு", "சட்டப் பிரிவு", "கணக்குப் பிரிவு", "டிஜிட்டல் பிரிவு (ICT + GIS)", "மொழிபெயர்ப்புப் பிரிவு"],
                "officers" => []
            ],
            "2" => [
                "id" => 2,
                "code" => "training",
                "name_en" => "Management & Training Division",
                "name_si" => "කළමනාකරණ හා පුහුණු අංශය",
                "name_ta" => "முகாமைத்துவ மற்றும் பயிற்சிப் பிரிவு",
                "desc_en" => "Coordinates public sector capacity building, Management Development Training Unit (MDTU), Wayamba Training Institute programs, and provincial drug prevention initiatives.",
                "desc_si" => "රාජ්‍ය සේවා ධාරිතා සංවර්ධනය, කළමනාකරණ සංවර්ධන පුහුණු ඒකකය (MDTU), වයඹ පුහුණු ආයතනය සහ මත්ද්‍රව්‍ය වැළැක්වීමේ පළාත් වැඩසටහන් මෙහෙයවයි.",
                "desc_ta" => "பொதுத்துறை திறன் மேம்பாடு, முகாமைத்துவ அபிவிருத்திப் பயிற்சிப் பிரிவு (MDTU) மற்றும் வயம்ப பயிற்சி நிறுவனத்தை வழிநடத்துகிறது.",
                "head_title_en" => "Deputy Chief Secretary (Training)",
                "head_title_si" => "නියෝජ්‍ය ප්‍රධාන ලේකම් (පුහුණු)",
                "head_title_ta" => "பிரதி தலைமைச் செயலாளர் (பயிற்சி)",
                "sections_en" => ["MDTU Office", "Wayamba Training Institute", "Drug Prevention Unit"],
                "sections_si" => ["MDTU කාර්යාලය", "වයඹ පුහුණු ආයතනය", "මත්ද්‍රව්‍ය වැළැක්වීමේ ඒකකය"],
                "sections_ta" => ["MDTU அலுவலகம்", "வயம்ப பயிற்சி நிறுவனம்", "போதைப்பொருள் தடுப்புப் பிரிவு"],
                "officers" => []
            ],
            "3" => [
                "id" => 3,
                "code" => "finance",
                "name_en" => "Provincial Treasury | Financial Division",
                "name_si" => "පළාත් භාණ්ඩාගාරය සහ මුදල් අංශය",
                "name_ta" => "மாகாண திறைசேரி மற்றும் நிதிப் பிரிவு",
                "desc_en" => "Directs provincial treasury operations, annual budget allocation, revenue collection, financial accounts, and expenditure monitoring across all provincial departments.",
                "desc_si" => "පළාත් භාණ්ඩාගාර මෙහෙයුම්, වාර්ෂික අයවැය ප්‍රතිපාදන, ආදායම් කළමනාකරණය, මූල්‍ය ප්‍රකාශන සහ ගෙවීම් පාලනය මෙහෙයවනු ලබයි.",
                "desc_ta" => "மாகாண திறைசேரி செயல்பாடுகள், வருடாந்திர வரவுசெலவு ஒதுக்கீடு, வருவாய் மற்றும் கொடுப்பனவுகளை நிர்வகிக்கிறது.",
                "head_title_en" => "Deputy Chief Secretary (Financial Management)",
                "head_title_si" => "නියෝජ්‍ය ප්‍රධාන ලේකම් (මූල්‍ය කළමනාකරණ)",
                "head_title_ta" => "பிரதி தலைமைச் செயலாளர் (நிதி முகாமைத்துவம்)",
                "sections_en" => ["Provincial Treasury", "Revenue Unit", "Budget and Payments"],
                "sections_si" => ["පළාත් භාණ්ඩාගාරය", "ආදායම් ඒකකය", "අයවැය සහ ගෙවීම් ඒකකය"],
                "sections_ta" => ["மாகாண திறைசேரி", "வருவாய்ப் பிரிவு", "பட்ஜெட் மற்றும் கொடுப்பனவுகள்"],
                "officers" => []
            ],
            "4" => [
                "id" => 4,
                "code" => "engineering",
                "name_en" => "Engineering Division",
                "name_si" => "ඉංජිනේරු අංශය",
                "name_ta" => "பொறியியல் பிரிவு",
                "desc_en" => "Oversees provincial civil and infrastructure engineering, published engineering rate books (Roads, Irrigation, Buildings), Quality Control Lab operations, and the BoQ Online System.",
                "desc_si" => "පළාත් යටිතල පහසුකම් ඉංජිනේරු සැලසුම්, අනුමත මිල ගණන් පොත් (මාර්ග, වාරිමාර්ග, ගොඩනැගිලි), තත්ත්ව පාලන විද්‍යාගාරය සහ BoQ මාර්ගගත පද්ධතිය කළමනාකරණය කරයි.",
                "desc_ta" => "மாகாண உட்கட்டமைப்பு பொறியியல், வீதிகள், நீர்ப்பாசனம் மற்றும் கட்டடங்களுக்கான விலைப்பட்டியல்கள், தரக்கட்டுப்பாட்டு ஆய்வகம் மற்றும் BoQ அமைப்பை மேற்பார்வையிடுகிறது.",
                "head_title_en" => "Deputy Chief Secretary (Engineering Services)",
                "head_title_si" => "නියෝජ්‍ය ප්‍රධාන ලේකම් (ඉංජිනේරු සේවා)",
                "head_title_ta" => "பிரதி தலைமைச் செயலாளர் (பொறியியல் சேவைகள்)",
                "sections_en" => ["Quality Control Lab", "BoQ Online System"],
                "sections_si" => ["තත්ත්ව පාලන විද්‍යාගාරය", "BoQ මාර්ගගත පද්ධතිය"],
                "sections_ta" => ["தரக்கட்டுப்பாட்டு ஆய்வகம்", "BoQ இணைய அமைப்பு"],
                "officers" => []
            ],
            "5" => [
                "id" => 5,
                "code" => "planning",
                "name_en" => "Planning & Monitoring Division",
                "name_si" => "ක්‍රමසම්පාදන හා අධීක්ෂණ අංශය",
                "name_ta" => "திட்டமிடல் மற்றும் கண்காணிப்புப் பிரிவு",
                "desc_en" => "Formulates annual provincial public investment plans, coordinates regional development projects, and monitors SDG progress across Kurunegala and Puttalam districts.",
                "desc_si" => "වාර්ෂික පළාත් සංවර්ධන සැලසුම් සකස් කිරීම, කුරුණෑගල සහ පුත්තලම දිස්ත්‍රික්කවල සංවර්ධන ව්‍යාපෘති අධීක්ෂණය සහ ප්‍රගති සමාලෝචනය සිදුකරයි.",
                "desc_ta" => "மாகாண அபிவிருத்தி திட்டங்களை வகுத்தல் மற்றும் குருணாகல் மற்றும் புத்தளம் மாவட்டங்களின் திட்டங்களை கண்காணித்தல்.",
                "head_title_en" => "Deputy Chief Secretary (Planning and Monitoring)",
                "head_title_si" => "නියෝජ්‍ය ප්‍රධාන ලේකම් (ක්‍රමසම්පාදන හා අධීක්ෂණ)",
                "head_title_ta" => "பிரதி தலைமைச் செயலாளர் (திட்டமிடல் மற்றும் கண்காணிப்பு)",
                "sections_en" => ["Provincial Planning", "Project Monitoring & Evaluation"],
                "sections_si" => ["පළාත් සැලසුම් ඒකකය", "ව්‍යාපෘති අධීක්ෂණ හා ඇගයීම් ඒකකය"],
                "sections_ta" => ["மாகாண திட்டமிடல் பிரிவு", "திட்ட கண்காணிப்பு மற்றும் மதிப்பீடு"],
                "officers" => []
            ]
        ];

        // 8. Seed Real NWP Documents from cs.nw.gov.lk
        $documentsSeed = [
            [
                "title_en" => "Annual Transfers 2027 – Development Officers Service",
                "title_si" => "වයඹ පළාත් සභා සංවර්ධන නිලධාරි සේවයේ වාර්ෂික ස්ථාන මාරු – 2027",
                "title_ta" => "வடமேல் மாகாண அபிவிருத்தி உத்தியோகத்தர் சேவையின் வருடாந்த இடமாற்றங்கள் – 2027",
                "division" => 1,
                "type" => "Circular",
                "size" => "1.8 MB",
                "url" => "http://cs.nw.gov.lk/wp-content/uploads/2026/08/do_2027.pdf",
                "url_en" => "http://cs.nw.gov.lk/wp-content/uploads/2026/08/do_2027.pdf",
                "url_si" => "http://cs.nw.gov.lk/wp-content/uploads/2026/08/do_2027.pdf",
                "url_ta" => "http://cs.nw.gov.lk/wp-content/uploads/2026/08/do_2027.pdf",
                "is_new" => 1,
                "featured" => 1
            ],
            [
                "title_en" => "Annual Transfers 2027 – Management Service Officers (MSO)",
                "title_si" => "වයඹ පළාත් සභා කළමනාකරණ සේවා නිලධාරි සේවයේ වාර්ෂික ස්ථාන මාරු – 2027",
                "title_ta" => "வடமேல் மாகாண முகாமைத்துவ சேவை உத்தியோகத்தர் சேவையின் வருடாந்த இடமாற்றங்கள் – 2027",
                "division" => 1,
                "type" => "Circular",
                "size" => "2.1 MB",
                "url" => "http://cs.nw.gov.lk/wp-content/uploads/2026/08/mso_2027.pdf",
                "url_en" => "http://cs.nw.gov.lk/wp-content/uploads/2026/08/mso_2027.pdf",
                "url_si" => "http://cs.nw.gov.lk/wp-content/uploads/2026/08/mso_2027.pdf",
                "url_ta" => "http://cs.nw.gov.lk/wp-content/uploads/2026/08/mso_2027.pdf",
                "is_new" => 1,
                "featured" => 1
            ],
            [
                "title_en" => "Kurunegala Rate Book 2026 (Building Sector - 2nd Half)",
                "title_si" => "කුරුණෑගල මිල ගණන් පොත 2026 (ගොඩනැගිලි අංශය - දෙවන අර්ධය)",
                "title_ta" => "குருணாகல் விலைப்பட்டியல் 2026 (கட்டடத்துறை - 2ம் பாதி)",
                "division" => 4,
                "type" => "Publication",
                "size" => "4.5 MB",
                "url" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/kurunegala_II_compressed.pdf",
                "url_en" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/kurunegala_II_compressed.pdf",
                "url_si" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/kurunegala_II_compressed.pdf",
                "url_ta" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/kurunegala_II_compressed.pdf",
                "is_new" => 1,
                "featured" => 1
            ],
            [
                "title_en" => "Puttalam Rate Book 2026 (Building Sector - 2nd Half)",
                "title_si" => "පුත්තලම මිල ගණන් පොත 2026 (ගොඩනැගිලි අංශය - දෙවන අර්ධය)",
                "title_ta" => "புத்தளம் விலைப்பட்டியல் 2026 (கட்டடத்துறை - 2ம் பாதி)",
                "division" => 4,
                "type" => "Publication",
                "size" => "4.2 MB",
                "url" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/puttalam_II_compressed-1.pdf",
                "url_en" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/puttalam_II_compressed-1.pdf",
                "url_si" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/puttalam_II_compressed-1.pdf",
                "url_ta" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/puttalam_II_compressed-1.pdf",
                "is_new" => 1,
                "featured" => 1
            ],
            [
                "title_en" => "Kurunegala Rate Book 2026 (Road Sector - 2nd Half)",
                "title_si" => "කුරුණෑගල මිල ගණන් පොත 2026 (මාර්ග අංශය - දෙවන අර්ධය)",
                "title_ta" => "குருணாகல் விலைப்பட்டியல் 2026 (வீதித்துறை - 2ம் பாதி)",
                "division" => 4,
                "type" => "Publication",
                "size" => "3.8 MB",
                "url" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/Rate-Kurunegala-New_organized_compressed.pdf",
                "url_en" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/Rate-Kurunegala-New_organized_compressed.pdf",
                "url_si" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/Rate-Kurunegala-New_organized_compressed.pdf",
                "url_ta" => "http://cs.nw.gov.lk/wp-content/uploads/2026/07/Rate-Kurunegala-New_organized_compressed.pdf",
                "is_new" => 1,
                "featured" => 0
            ],
            [
                "title_en" => "Provincial Treasury Budget Circulars 01/2026 & 02/2026",
                "title_si" => "පළාත් භාණ්ඩාගාර (අයවැය) චක්‍රලේඛ 01/2026 සහ 02/2026",
                "title_ta" => "மாகாண திறைசேரி வரவுசெலவு சுற்றறிக்கை 01/2026 & 02/2026",
                "division" => 3,
                "type" => "Circular",
                "size" => "1.4 MB",
                "url" => "http://cs.nw.gov.lk/wp-content/uploads/2026/01/01-02_c.pdf",
                "url_en" => "http://cs.nw.gov.lk/wp-content/uploads/2026/01/01-02_c.pdf",
                "url_si" => "http://cs.nw.gov.lk/wp-content/uploads/2026/01/01-02_c.pdf",
                "url_ta" => "http://cs.nw.gov.lk/wp-content/uploads/2026/01/01-02_c.pdf",
                "is_new" => 0,
                "featured" => 0
            ],
            [
                "title_en" => "BoQ Online System Official User Manual",
                "title_si" => "BoQ මාර්ගගත මෘදුකාංගයේ නිලධාරී පරිශීලක අත්පොත",
                "title_ta" => "BoQ இணைய அமைப்பு உத்தியோகபூர்வ பயனர் கையேடு",
                "division" => 4,
                "type" => "Publication",
                "size" => "2.6 MB",
                "url" => "https://cs.nw.gov.lk/boq/",
                "url_en" => "https://cs.nw.gov.lk/boq/",
                "url_si" => "https://cs.nw.gov.lk/boq/",
                "url_ta" => "https://cs.nw.gov.lk/boq/",
                "is_new" => 1,
                "featured" => 1
            ],
            [
                "title_en" => "Right to Information (RTI) Application Format 01",
                "title_si" => "තොරතුරු දැනගැනීමේ අයිතිය (RTI) අයදුම්පත්‍රය - ආකෘති පත්‍ර 01",
                "title_ta" => "தகவல் அறியும் உரிமை (RTI) விண்ணப்பம் - படிவம் 01",
                "division" => 1,
                "type" => "Application",
                "size" => "540 KB",
                "url" => "http://www.cs.nw.gov.lk/wp-content/uploads/2025/10/rti_10.pdf",
                "url_en" => "http://www.cs.nw.gov.lk/wp-content/uploads/2025/10/rti_10.pdf",
                "url_si" => "http://www.cs.nw.gov.lk/wp-content/uploads/2025/10/rti_10.pdf",
                "url_ta" => "http://www.cs.nw.gov.lk/wp-content/uploads/2025/10/rti_10.pdf",
                "is_new" => 0,
                "featured" => 1
            ],
            [
                "title_en" => "Public Officers Code of Conduct (ආචාර ධර්ම සංග්‍රහය)",
                "title_si" => "රාජ්‍ය නිලධාරීන්ගේ ආචාර ධර්ම සංග්‍රහය",
                "title_ta" => "அரச உத்தியோகத்தர்களுக்கான ஒழுக்கக் கோவை",
                "division" => 1,
                "type" => "Report",
                "size" => "1.2 MB",
                "url" => "http://cs.nw.gov.lk/wp-content/uploads/2026/02/csnwp.pdf",
                "url_en" => "http://cs.nw.gov.lk/wp-content/uploads/2026/02/csnwp.pdf",
                "url_si" => "http://cs.nw.gov.lk/wp-content/uploads/2026/02/csnwp.pdf",
                "url_ta" => "http://cs.nw.gov.lk/wp-content/uploads/2026/02/csnwp.pdf",
                "is_new" => 0,
                "featured" => 0
            ]
        ];

        // 9. Seed Online Systems / E-Services
        $systemsSeed = [
            [
                "id" => 1,
                "title_en" => "BoQ Online System",
                "title_si" => "BoQ මාර්ගගත ඉංජිනේරු පද්ධතිය",
                "title_ta" => "BoQ இணைய பொறியியல் அமைப்பு",
                "desc_en" => "Provincial Engineering Bill of Quantities (BoQ) software and technical estimates database.",
                "desc_si" => "පළාත් ඉංජිනේරු ප්‍රමාණ පත්‍ර (BoQ) සකස් කිරීම සහ ඇස්තමේන්තු කළමනාකරණය සඳහා වන පද්ධතිය.",
                "desc_ta" => "பொறியியல் மதிப்பீடுகள் மற்றும் BoQ மேலாண்மைக்கான இணைய அமைப்பு.",
                "category" => "Staff",
                "url" => "https://cs.nw.gov.lk/boq/",
                "icon" => "📐"
            ],
            [
                "id" => 2,
                "title_en" => "Provincial Treasury e-Budget Portal",
                "title_si" => "පළාත් භාණ්ඩාගාර විද්‍යුත් අයවැය ද්වාරය",
                "title_ta" => "மாகாண திறைசேரி வரவுசெலவு இணையத்தளம்",
                "desc_en" => "Financial reporting, provincial department allocations, revenue collections, and payment disbursements.",
                "desc_si" => "මූල්‍ය වාර්තාකරණය, දෙපාර්තමේන්තු ප්‍රතිපාදන සහ රාජ්‍ය ගෙවීම් පාලන ද්වාරය.",
                "desc_ta" => "மாகாண நிதி அறிக்கையிடல் மற்றும் கொடுப்பனவுகள் மேலாண்மை இணையம்.",
                "category" => "Finance",
                "url" => "https://cs.nw.gov.lk/provincial-treasury-nwp",
                "icon" => "💰"
            ],
            [
                "id" => 3,
                "title_en" => "NWP GIS & Regional Planning Portal",
                "title_si" => "වයඹ GIS සහ භූ-තොරතුරු සැලසුම් පද්ධතිය",
                "title_ta" => "NWP GIS மற்றும் பிராந்திய திட்டமிடல் தளம்",
                "desc_en" => "Geographic Information Systems (GIS) mapping for provincial state land, public infrastructure, and assets.",
                "desc_si" => "පළාත් රාජ්‍ය ඉඩම්, යටිතල පහසුකම් සහ වත්කම් සිතියම්ගත කිරීමේ භූ-තොරතුරු පද්ධතිය.",
                "desc_ta" => "மாகாண பொது உட்கட்டமைப்பு மற்றும் சொத்துக்களை வரைபடமாக்கும் GIS அமைப்பு.",
                "category" => "Public",
                "url" => "https://cs.nw.gov.lk/",
                "icon" => "🗺️"
            ],
            [
                "id" => 4,
                "title_en" => "Wayamba Training Institute (MDTU e-Learning)",
                "title_si" => "වයඹ පුහුණු ආයතනය (MDTU ඊ-ඉගෙනුම් ද්වාරය)",
                "title_ta" => "வயம்ப பயிற்சி நிறுவனம் (MDTU மின் கற்றல்)",
                "desc_en" => "Capacity building courses, public management webinars, and continuous professional exams.",
                "desc_si" => "රාජ්‍ය නිලධාරීන්ගේ ධාරිතා සංවර්ධන පාඨමාලා, කළමනාකරණ සම්මන්ත්‍රණ සහ විභාග තොරතුරු.",
                "desc_ta" => "பொதுத்துறை திறன் மேம்பாட்டுப் படிப்புகள் மற்றும் பயிற்சிகள்.",
                "category" => "Staff",
                "url" => "https://cs.nw.gov.lk/our-divisions/",
                "icon" => "🎓"
            ]
        ];

        // 10. Seed Translations
        $siteTranslations = [
            "en" => [
                "portalTitle" => "NORTH WESTERN PROVINCIAL COUNCIL",
                "portalSubtitle" => "NORTH WESTERN PROVINCE",
                "emergencyContact" => "Address: 1st Floor, NW Provincial Council Office Complex, Kurunegala | Phone: +94 37 223 1769 | Email: csnwp@sltnet.lk",
                "aboutUsTitle" => "About Chief Secretariat - NWP",
                "aboutUsContent" => "Established as the apex provincial executive body, the Chief Secretariat of the North Western Province coordinates governance, manages civil administration, directs human and financial capital, and monitors provincial sustainable development.",
                "homeSearchTitle" => "How can we help you today?",
                "homeSearchSubtitle" => "Search official circulars, engineering rate books, transfer lists, forms, and administrative directives",
                "searchPlaceholder" => "Search by title, circular number, or keyword (e.g., Rate Book, Transfer, Tender)...",
                "homeTrendingLabel" => "Trending Searches:",
                "homeFeaturedDownloadsTitle" => "Featured Downloads & Circulars",
                "navHome" => "Home",
                "navEvents" => "Public Events",
                "navCalendar" => "Monthly Calendar",
                "navDepartments" => "Departments",
                "navGovernance" => "Governance",
                "navContact" => "Contact",
                "navStaffPortal" => "Staff Portal",
                "homeProjectsTitle" => "Key Provincial Projects",
                "homeStatsTitle" => "Transparency Dashboard",
                "latestUpdates" => "Latest Announcements",
                "announcementsText" => "Notice: Annual Transfers 2027 for Development Officers and MSO have been published. Rate Books for 2026 (Roads, Irrigation, Buildings) are available for download.",
                "homeCharterTitle" => "Citizen Service Standards & Governance Values",
                "valIntegrityTitle" => "Vision",
                "valIntegrityDesc" => "A sustainably developed and prosperous North Western Province.",
                "valSpeedTitle" => "Mission",
                "valSpeedDesc" => "To establish an efficient, accountable, and productive administration by mobilizing human, financial, and physical resources effectively to enhance the quality of life of the people of the North Western Province.",
                "valAccessTitle" => "Citizen's Declaration",
                "valAccessDesc" => "We are committed to delivering timely, transparent, and equitable public administration in compliance with legal standards and citizen rights.",
                "valAccessPdf" => "uploads/Citizen_Charter_NWP.pdf",
                "btnDownloadCharterPdf" => "Download Citizen's Charter PDF 📄",
                "rtiTitle" => "Right to Information (RTI)",
                "rtiContent" => "In accordance with RTI Act No. 12 of 2016, citizens can request official information and records from the designated RTI Officers of the Chief Secretariat.",
                "rtiOfficerName" => "Designated RTI Information Officer: Deputy Chief Secretary (Administration)",
                "rtiOfficerContact" => "Office: 1st Floor, NWP Office Complex, Kurunegala | Tel: +94 37 223 1769 | Email: csnwp@sltnet.lk",
                "footerText" => "© 2026 Chief Secretariat - North Western Province. All Rights Reserved. | Powered by Digital Division - Chief Secretariat - NWP",
                "btnDownload" => "Download PDF",
                "btnReport" => "Submit Inquiry",
                "btnVisitWebsite" => "Launch Portal"
            ],
            "si" => [
                "portalTitle" => "වයඹ පළාත් සභාව",
                "portalSubtitle" => "වයඹ පළාත",
                "emergencyContact" => "ලිපිනය: 1 වන මහල, පළාත් සභා කාර්යාල සංකීර්ණය, කුරුණෑගල | දුරකථන: +94 37 223 1769 | විද්‍යුත් තැපෑල: csnwp@sltnet.lk",
                "aboutUsTitle" => "ප්‍රධාන ලේකම් කාර්යාලය පිළිබඳව",
                "aboutUsContent" => "වයඹ පළාතේ ප්‍රමුඛතම විධායක පරිපාලන ආයතනය ලෙස ප්‍රධාන ලේකම් කාර්යාලය පළාත් පාලනය සම්බන්ධීකරණය, මානව හා මූල්‍ය සම්පත් කළමනාකරණය සහ කලාපීය තිරසර සංවර්ධනය මෙහෙයවනු ලබයි.",
                "homeSearchTitle" => "අද දින අපෙන් ඔබට අවශ්‍ය සේවාව කුමක්ද?",
                "homeSearchSubtitle" => "නිල චක්‍රලේඛ, ඉංජිනේරු මිල ගණන් පොත්, ස්ථාන මාරු නාමලේඛන සහ ආකෘති පත්‍ර සොයන්න",
                "searchPlaceholder" => "මාතෘකාව, චක්‍රලේඛ අංකය හෝ වචනයක් යොදා සොයන්න (උදා: මිල පොත, ස්ථාන මාරු, ටෙන්ඩර්)...",
                "homeTrendingLabel" => "ජනප්‍රිය සෙවුම්:",
                "homeFeaturedDownloadsTitle" => "විශේෂිත බාගත කිරීම් සහ චක්‍රලේඛ",
                "navHome" => "මුල් පිටුව",
                "navEvents" => "ප්‍රසිද්ධ සිදුවීම්",
                "navCalendar" => "මාසික දින දර්ශනය",
                "navDepartments" => "දෙපාර්තමේන්තු",
                "navGovernance" => "රාජ්‍ය පාලනය",
                "navContact" => "සම්බන්ධ වන්න",
                "navStaffPortal" => "කාර්ය මණ්ඩල ද්වාරය",
                "homeProjectsTitle" => "පළාත් සංවර්ධන ව්‍යාපෘති",
                "homeStatsTitle" => "විනිවිදභාවයේ තොරතුරු පුවරුව",
                "latestUpdates" => "නවතම නිවේදන",
                "announcementsText" => "දැනුම්දීම: සංවර්ධන නිලධාරී සහ කළමනාකරණ සේවා 2027 වාර්ෂික ස්ථාන මාරු නාමලේඛන නිකුත් කර ඇත. 2026 ඉංජිනේරු මිල ගණන් පොත් බාගත කළ හැක.",
                "homeCharterTitle" => "පුරවැසි හා සේවාලාභී ප්‍රඥප්තිය",
                "valIntegrityTitle" => "දැක්ම",
                "valIntegrityDesc" => "තිරසර ලෙස සංවර්ධිත වයඹ පළාතක්.",
                "valSpeedTitle" => "මෙහෙවර",
                "valSpeedDesc" => "වයඹ ජනතාවගේ ජීවන තත්ත්වය නඟා සිටුවීම පිණිස මානව, මූල්‍ය හා භෞතික සම්පත් කාර්යක්ෂමව මනා ඵලදායීව මෙහෙයවමින් වයඹ පළාත් සභාව තුළ විශිෂ්ඨ ආකල්ප හා හැකියාවන්ගෙන් යුත් මානව සම්පතක් ඇති කිරීම පිණිස කාර්යක්ෂම හා ඵලදායී පරිපාලනයක් ස්ථාපිත කිරීම.",
                "valAccessTitle" => "පුරවැසි ප්‍රකාශය",
                "valAccessDesc" => "නියමිත කාලරාමුව තුළ නිවැරදි, ඵලදායී හා විනිවිදභාවයෙන් යුතු රාජ්‍ය සේවාවන් සැපයීමට අපි බැඳී සිටින්නෙමු.",
                "valAccessPdf" => "uploads/Citizen_Charter_NWP.pdf",
                "btnDownloadCharterPdf" => "පුරවැසි ප්‍රඥප්තිය PDF බාගත කරන්න 📄",
                "rtiTitle" => "තොරතුරු දැනගැනීමේ අයිතිය (RTI)",
                "rtiContent" => "2016 අංක 12 දරන තොරතුරු දැනගැනීමේ පනත යටතේ ප්‍රධාන ලේකම් කාර්යාලයේ නම් කළ තොරතුරු නිලධාරීන්ගෙන් තොරතුරු ඉල්ලා සිටිය හැක.",
                "rtiOfficerName" => "නම් කළ තොරතුරු නිලධාරී: නියෝජ්‍ය ප්‍රධාන ලේකම් (පරිපාලන)",
                "rtiOfficerContact" => "කාර්යාලය: 1 වන මහල, පළාත් සභා කාර්යාල සංකීර්ණය, කුරුණෑගල | දුරකථන: +94 37 223 1769",
                "footerText" => "© 2026 වයඹ ප්‍රධාන ලේකම් කාර්යාලය. සියලු හිමිකම් ඇවිරිණි. | Powered by Digital Division - Chief Secretariat - NWP",
                "btnDownload" => "PDF බාගත කරන්න",
                "btnReport" => "විමසීම යොමු කරන්න",
                "btnVisitWebsite" => "පද්ධතියට පිවිසෙන්න"
            ],
            "ta" => [
                "portalTitle" => "வடமேல் மாகாண சபை",
                "portalSubtitle" => "வடமேல் மாகாணம்",
                "emergencyContact" => "முகவரி: 1வது மாடி, வடமேல் மாகாண சபை அலுவலக வளாகம், குருணாகல் | தொலைபேசி: +94 37 223 1769 | மின்னஞ்சல்: csnwp@sltnet.lk",
                "aboutUsTitle" => "தலைமைச் செயலகம் பற்றி",
                "aboutUsContent" => "வடமேல் மாகாணத்தின் தலைமை நிர்வாக அமைப்பாக, மாகாண நிர்வாகத்தை ஒருங்கிணைத்து, மனித மற்றும் நிதி வளங்களை நிர்வகிக்கிறது.",
                "homeSearchTitle" => "இன்று நாங்கள் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
                "homeSearchSubtitle" => "அதிகாரப்பூர்வ சுற்றறிக்கைகள், விலைப்பட்டியல்கள் மற்றும் விண்ணப்பங்களை தேடுங்கள்",
                "searchPlaceholder" => "தலைப்பு, சுற்றறிக்கை எண் அல்லது முக்கிய சொல்லைக் கொண்டு தேடுங்கள்...",
                "homeTrendingLabel" => "பிரபலமான தேடல்கள்:",
                "homeFeaturedDownloadsTitle" => "முக்கிய பதிவிறக்கங்கள் & சுற்றறிக்கைகள்",
                "navHome" => "முகப்பு",
                "navEvents" => "நிகழ்வுகள்",
                "navCalendar" => "மாதாந்த நாட்காட்டி",
                "navDepartments" => "திணைக்களங்கள்",
                "navGovernance" => "ஆளுகை",
                "navContact" => "தொடர்பு கொள்ள",
                "navStaffPortal" => "ஊழியர் தளம்",
                "homeProjectsTitle" => "மாகாண அபிவிருத்தி திட்டங்கள்",
                "homeStatsTitle" => "வெளிப்படைத்தன்மை தகவல் பலகை",
                "latestUpdates" => "சமீபத்திய அறிவிப்புகள்",
                "announcementsText" => "அறிவிப்பு: 2027 ஆம் ஆண்டிற்கான அபிவிருத்தி உத்தியோகத்தர் இடமாற்றப் பட்டியல் வெளியிடப்பட்டுள்ளது.",
                "homeCharterTitle" => "பிரஜைகள் சேவைப் பிரகடனம் மற்றும் இலக்குகள்",
                "valIntegrityTitle" => "தொலைநோக்கு",
                "valIntegrityDesc" => "நிலையான வளர்ச்சி பெற்ற வடமேல் மாகாணம்.",
                "valSpeedTitle" => "செயல்நோக்கம்",
                "valSpeedDesc" => "திறமையான மற்றும் பயனுள்ள நிர்வாகத்தை நிறுவுதல்.",
                "valAccessTitle" => "பிரஜைகள் பிரகடனம்",
                "valAccessDesc" => "நேர்மையான மற்றும் வெளிப்படையான பொதுச் சேவைகளை வழங்க கடமைப்பட்டுள்ளோம்.",
                "valAccessPdf" => "uploads/Citizen_Charter_NWP.pdf",
                "btnDownloadCharterPdf" => "பிரஜைகள் பிரகடன PDF பதிவிறக்குக 📄",
                "rtiTitle" => "தகவல் அறியும் உரிமை (RTI)",
                "rtiContent" => "2016 ஆம் ஆண்டின் 12 ஆம் இலக்க தகவல் அறியும் உரிமைச் சட்டத்தின் கீழ் அதிகாரப்பூர்வ தகவல்களைக் கோரலாம்.",
                "rtiOfficerName" => "தகவல் அதிகாரி: பிரதி தலைமைச் செயலாளர் (நிர்வாகம்)",
                "rtiOfficerContact" => "அலுவலகம்: 1வது மாடி, மாகாண சபை வளாகம், குருணாகல் | தொலைபேசி: +94 37 223 1769",
                "footerText" => "© 2026 தலைமைச் செயலகம் - வடமேல் மாகாணம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. | Powered by Digital Division - Chief Secretariat - NWP",
                "btnDownload" => "PDF பதிவிறக்குக",
                "btnReport" => "விசாரணையை சமர்ப்பிக்கவும்",
                "btnVisitWebsite" => "அமைப்பிற்குச் செல்லவும்"
            ]
        ];

        // 11. Projects & Stats Seed
        $projectsSeed = [
            [
                "id" => 1,
                "title_en" => "North Western Provincial Smart Governance & Digitization Program",
                "title_si" => "වයඹ පළාත් සභා ස්මාර්ට් ඩිජිටල් පාලන ව්‍යාපෘතිය",
                "title_ta" => "வடமேல் மாகாண ஸ்மார்ட் டிஜிட்டல் ஆளுகை திட்டம்",
                "desc_en" => "Comprehensive digital modernization of provincial secretariats, automated document processing, citizen service portals, and paperless council administration.",
                "desc_si" => "පළාත් ලේකම් කාර්යාලවල පරිපාලන ක්‍රියාවලිය ඩිජිටල්කරණය, මහජන සේවා මාර්ගගත කිරීම සහ කඩදාසි භාවිතය අවම කිරීමේ වැඩසටහන.",
                "desc_ta" => "மாகாண நிர்வாகத்தை நவீனமயமாக்குதல் மற்றும் டிஜிட்டல் சேவைகளை பொதுமக்களுக்கு வழங்குதல்.",
                "status" => "Active",
                "status_key" => "projStatusActive",
                "keyword" => "BoQ",
                "image" => "assets/project1.jpg"
            ],
            [
                "id" => 2,
                "title_en" => "Kurunegala & Puttalam Provincial Road Infrastructure Development",
                "title_si" => "කුරුණෑගල සහ පුත්තලම පළාත් මාර්ග යටිතල පහසුකම් සංවර්ධනය",
                "title_ta" => "குருணாகல் மற்றும் புத்தளம் மாகாண வீதி உட்கட்டமைப்பு அபிவிருத்தி",
                "desc_en" => "Rehabilitation and quality testing of over 450 km of rural and provincial council roads with modern quality engineering standards.",
                "desc_si" => "උසස් තත්ත්වයේ ඉංජිනේරු ප්‍රමිතීන් යටතේ ග්‍රාමීය හා පළාත් මාර්ග කිලෝමීටර් 450කට වැඩි ප්‍රමාණයක් සංවර්ධනය කිරීම.",
                "desc_ta" => "450 கி.மீ க்கும் மேற்பட்ட மாகாண வீதிகளை சீரமைக்கும் திட்டம்.",
                "status" => "Active",
                "status_key" => "projStatusActive",
                "keyword" => "Rate Book",
                "image" => "assets/project2.jpg"
            ],
            [
                "id" => 3,
                "title_en" => "Public Sector Human Capital & MDTU Capacity Building 2026",
                "title_si" => "රාජ්‍ය සේවා මානව ප්‍රාග්ධනය සහ MDTU ධාරිතා සංවර්ධන වැඩසටහන 2026",
                "title_ta" => "பொதுத்துறை மனித வள மேம்பாடு மற்றும் MDTU பயிற்சித் திட்டம் 2026",
                "desc_en" => "Advanced capacity enhancement, leadership seminars, and productivity workshops for over 2,000 provincial administrative staff.",
                "desc_si" => "පළාත් සභාවේ නිලධාරීන් 2,000කට අධික පිරිසකට නායකත්ව සහ කාර්යක්ෂමතා පුහුණු වැඩසටහන් පැවැත්වීම.",
                "desc_ta" => "2,000 க்கும் மேற்பட்ட அரச ஊழியர்களுக்கான திறன் மேம்பாட்டுப் பயிற்சிகள்.",
                "status" => "Active",
                "status_key" => "projStatusActive",
                "keyword" => "Transfers",
                "image" => "assets/project3.jpg"
            ]
        ];

        $statsSeed = [
            ["label_key" => "statsCirculars", "value" => "148+"],
            ["label_key" => "statsDivisions", "value" => "5"],
            ["label_key" => "statsRti", "value" => "100%"],
            ["label_key" => "statsSupport", "value" => "24/7"]
        ];

        $rtiOfficersSeed = [
            [
                "name" => "Designated RTI Information Officer: Deputy Chief Secretary (Administration)",
                "contact" => "1st Floor, North Western Provincial Council Complex, Kurunegala\nPhone: +94 37 223 1769 | Email: csnwp@sltnet.lk",
                "photo" => ""
            ]
        ];

        // 12. Save sections into site_data
        $stmt_site = $pdo->prepare("
            INSERT INTO `site_data` (`section_key`, `data_json`)
            VALUES (:k, :v)
            ON DUPLICATE KEY UPDATE `data_json` = VALUES(`data_json`)
        ");

        $sections_to_save = [
            'siteTranslations' => $siteTranslations,
            'divisionsData'    => $divisionsData,
            'projects'         => $projectsSeed,
            'stats'            => $statsSeed,
            'systems'          => $systemsSeed,
            'rtiOfficers'      => $rtiOfficersSeed,
            'subOrgsData'      => []
        ];

        foreach ($sections_to_save as $key => $val) {
            $stmt_site->execute([
                ':k' => $key,
                ':v' => json_encode($val, JSON_UNESCAPED_UNICODE)
            ]);
        }

        // 13. Insert Documents if table is empty
        $doc_count = $pdo->query("SELECT COUNT(*) FROM `documents`")->fetchColumn();
        if ($doc_count == 0) {
            $stmt_doc = $pdo->prepare("
                INSERT INTO `documents` 
                (`title_en`, `title_si`, `title_ta`, `division`, `type`, `size`, `url`, `url_en`, `url_si`, `url_ta`, `is_new`, `featured`, `created_by_user_id`, `created_by_username`)
                VALUES (:title_en, :title_si, :title_ta, :division, :type, :size, :url, :url_en, :url_si, :url_ta, :is_new, :featured, 1, 'admin')
            ");
            foreach ($documentsSeed as $d) {
                $stmt_doc->execute([
                    ':title_en' => $d['title_en'],
                    ':title_si' => $d['title_si'],
                    ':title_ta' => $d['title_ta'],
                    ':division' => $d['division'],
                    ':type'     => $d['type'],
                    ':size'     => $d['size'],
                    ':url'      => $d['url'],
                    ':url_en'   => $d['url_en'],
                    ':url_si'   => $d['url_si'],
                    ':url_ta'   => $d['url_ta'],
                    ':is_new'   => $d['is_new'],
                    ':featured' => $d['featured']
                ]);
            }
        }

        // 14. Insert Sample Inquiries if none exist
        $inq_count = $pdo->query("SELECT COUNT(*) FROM `inquiries`")->fetchColumn();
        if ($inq_count == 0) {
            $stmt_inq = $pdo->prepare("
                INSERT INTO `inquiries` (`id`, `name`, `nic`, `phone`, `email`, `message`, `status`, `date`)
                VALUES (:id, :name, :nic, :phone, :email, :message, 'New', :date)
            ");
            $sample_inquiries = [
                [
                    "id" => "inq_" . time() . "_1",
                    "name" => "K.M. Sunil Perera",
                    "nic" => "198524601234",
                    "phone" => "+94 77 123 4567",
                    "email" => "sunil.perera@gmail.com",
                    "message" => "Please clarify the submission deadline for the 2027 Annual Transfer applications for Development Officers.",
                    "date" => date("Y-m-d H:i:s")
                ],
                [
                    "id" => "inq_" . time() . "_2",
                    "name" => "S. Rajendran",
                    "nic" => "199015809876",
                    "phone" => "+94 71 987 6543",
                    "email" => "rajendran.civil@outlook.com",
                    "message" => "Requesting clarification on the Kurunegala Road Sector 2026 2nd Half Rate Book specifications for bridge masonry.",
                    "date" => date("Y-m-d H:i:s", strtotime("-1 day"))
                ]
            ];
            foreach ($sample_inquiries as $inq) {
                $stmt_inq->execute($inq);
            }
        }

        $res = [
            "success" => true,
            "port" => $connected_port,
            "database" => $db_name,
            "message" => "Chief Secretariat NWP database initialized and seeded successfully."
        ];

        if ($output_json) {
            echo json_encode($res, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            exit;
        }
        return $res;

    } catch (Exception $e) {
        if ($output_json) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
            exit;
        }
        return ["success" => false, "error" => $e->getMessage()];
    }
}

// When called directly via browser or CLI
if (php_sapi_name() === 'cli' || basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'setup_db.php') {
    if (php_sapi_name() !== 'cli') {
        header("Content-Type: application/json; charset=UTF-8");
    }
    $result = run_db_setup(php_sapi_name() !== 'cli');
    if (php_sapi_name() === 'cli') {
        print_r($result);
    }
}
