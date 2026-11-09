/**
 * Ultra-Modern Kalypso-Style Admin CMS Engine
 * Chief Secretariat - North Western Province
 */


// Global State
let db = {
  siteTranslations: {},
  divisionsData: {},
  documents: [],
  projects: [],
  stats: [],
  systems: [],
  inquiries: [],
  rtiOfficers: []
};


let currentUser = null;


// Chief Secretariat Official Units / Divisions
// Helper to dynamically collect all Main Divisions and Sub-Divisions from db.divisionsData
function getAllAssignableUnits() {
  const units = [];
  const divs = Object.values(db.divisionsData || {});


  divs.forEach(div => {
    const divId = parseInt(div.id, 10);
    const divNameEn = div.name_en || `Division ${divId}`;
    const divNameSi = div.name_si || divNameEn;
    const divNameTa = div.name_ta || divNameEn;


    // 1. Main Division Head Office
    units.push({
      id: divId,
      name_en: divNameEn,
      name_si: divNameSi,
      name_ta: divNameTa,
      is_main: true,
      parent_id: null,
      parent_name: divNameEn
    });


    // 2. Sub-Units / Sections
    const rawSectionsEn = div.sections_en || [];
    const rawSectionsSi = div.sections_si || [];
    const rawSectionsTa = div.sections_ta || [];


    const sectionsEn = Array.isArray(rawSectionsEn) ? rawSectionsEn : (typeof rawSectionsEn === 'string' ? rawSectionsEn.split(',').map(s=>s.trim()).filter(Boolean) : []);
    const sectionsSi = Array.isArray(rawSectionsSi) ? rawSectionsSi : [];
    const sectionsTa = Array.isArray(rawSectionsTa) ? rawSectionsTa : [];


    sectionsEn.forEach((secEn, idx) => {
      const subId = (divId * 100) + (idx + 1);
      const secSi = sectionsSi[idx] || secEn;
      const secTa = sectionsTa[idx] || secEn;


      units.push({
        id: subId,
        name_en: `${secEn} (${divNameEn})`,
        unit_raw: secEn,
        name_si: `${secSi} (${divNameSi})`,
        name_ta: `${secTa} (${divNameTa})`,
        is_main: false,
        parent_id: divId,
        parent_name: divNameEn
      });
    });
  });


  if (units.length === 0) {
    return CHIEF_SECRETARIAT_UNITS.map(u => ({
      id: u.id,
      name_en: u.name_en,
      name_si: u.name_si,
      name_ta: u.name_ta,
      is_main: true,
      parent_id: null,
      parent_name: u.name_en
    }));
  }


  return units;
}


const CHIEF_SECRETARIAT_UNITS = [
  { id: 1, code: 'administration', name_en: 'Administration Division', name_si: 'පරිපාලන අංශය', name_ta: 'நிர்வாகப் பிரிவு', badge: '🏛️ NWP • ADMINISTRATION' },
  { id: 2, code: 'establishment', name_en: 'Establishment Office', name_si: 'ආයතන අංශය', name_ta: 'ஸ்தாபன அலுவலகம்', badge: '🏛️ NWP • ESTABLISHMENT' },
  { id: 3, code: 'statistical', name_en: 'Statistical Unit', name_si: 'සංඛ්‍යාලේඛන ඒකකය', name_ta: 'புள்ளிவிவரப் பிரிவு', badge: '📊 NWP • STATISTICS' },
  { id: 4, code: 'legal', name_en: 'Legal Unit', name_si: 'නීති ඒකකය', name_ta: 'சட்டப் பிரிவு', badge: '⚖️ NWP • LEGAL' },
  { id: 5, code: 'accounts', name_en: 'Accounts Unit', name_si: 'ගිණුම් ඒකකය', name_ta: 'கணக்குப் பிரிவு', badge: '💰 NWP • ACCOUNTS' },
  { id: 6, code: 'digital', name_en: 'Digital Division (ICT + GIS)', name_si: 'ඩිජිටල් අංශය (තොරතුරු තාක්ෂණ + GIS)', name_ta: 'டிஜிட்டல் பிரிவு (ICT + GIS)', badge: '💻 NWP • DIGITAL' },
  { id: 7, code: 'translation', name_en: 'Translation Unit', name_si: 'පරිවර්තන ඒකකය', name_ta: 'மொழிபெயர்ப்புப் பிரிவு', badge: '🌐 NWP • TRANSLATION' }
];


let usersList = [];
let activeAdminLang = 'en';
let currentDashboardLang = 'en';
let pendingUploadFile = null;


// Comprehensive Multilingual Dashboard Translations (English, Sinhala, Tamil)
const adminTranslations = {
  en: {
    tabSignIn: "Sign In",
    tabRegisterOfficer: "Register Officer",
    btnBackToHome: "Back to Website",
    loginGateTitle: "NWP Executive Gate",
    loginGateDesc: "Chief Secretariat – North Western Province\nCentral Content & Operations CMS",
    lblUsername: "Username",
    lblPassword: "Password",
    authForgotPassword: "Forgot Password?",
    btnAuthSession: "Authenticate Session",
    loginPromptNewStaff: "New secretariat staff?",
    loginLinkCreateAccount: "Create an account",
    regGateTitle: "Officer Registration",
    regGateDesc: "North Western Provincial Council • Request administrative publishing access",
    lblFullName: "Full Name",
    lblOfficialUsername: "Official Username",
    lblAssignedUnit: "Assigned Unit (Chief Secretariat)",
    lblPhone: "Official Contact No (Phone)",
    lblEmail: "Official Email Address",
    btnSaveProfile: "Save Profile Changes",
    btnChangePhoto: "Change Photo",
    btnRemovePhoto: "Remove",
    lblAccountSecurity: "Account Security",
    lblAccountSecuritySub: "Manage your credentials & sign-in security",
    lblCurrentPassword: "Current Password",
    lblNewPassword: "New Password",
    lblConfirmPassword: "Confirm New Password",
    btnUpdatePassword: "Update Password",
    lblCreatePassword: "Create Password",
    btnSubmitRegistration: "Submit Registration",
    regPromptHaveAccount: "Already have an account?",
    regLinkSignIn: "Sign In",
        chartPieTitle: "Directives by Classification",
    userRecentDocsTitle: "📑 My Uploaded Documents",
    officerProfileCardTitle: "Officer Profile & Authority",
    officerProfileCardSub: "Identity, assigned unit & publishing credentials",
    lblParentDivision: "Parent Secretariat:",
    lblDesignation: "Official Designation:",
    lblOfficialEmail: "Email:",
    lblOfficialPhone: "Contact:",
    btnManageProfileCredentials: "Edit Profile & Credentials",
    unitPublishingCardTitle: "My Unit Publishing Hub",
    unitPublishingCardSub: "Directives, homepage articles & live citizen portal updates",
    livePortalBadge: "Live Sync",
    metricDirectivesShort: "Directives",
    metricArticlesShort: "Articles",
    metricAlertsShort: "Alerts",
    directPublishGuarantee: "Saved items are published immediately to the public portal without prior secretariat review.",
    btnUploadDirective: "Upload Directive",
    btnPublishArticle: "Add Article",
    userRecentDocsSub: "Directives and files uploaded by your account",
    userRecentProjectsTitle: "🚀 My Homepage Articles",
    userRecentProjectsSub: "Articles published to 'Provincial Projects' section",
    btnAddArticle: "Add Article",
    btnViewAllMyDocs: "View All My Documents ➔",
    btnViewAllMyProjects: "View All My Articles ➔",
    chartPieSub: "Distribution of publications by category & type",
    liveDistBadge: "Live Distribution",
    forgotStep1Desc: "Enter your account username or registered email. We will send a secure 6-digit verification code to your email.",
    lblAccountIdentifier: "Username or Registered Email",
    btnSendCode: "Send Verification Code",
    forgotStep2Desc: "A 6-digit verification code has been sent to",
    codeValidMins: "Valid for 15 minutes.",
    lblVerificationCode: "6-Digit Verification Code",
    btnChangeEmailResend: "Change Email / Resend",
    btnVerifyAndReset: "Verify & Reset Password",
    btnBack: "Back",
    typeCircular: "Circulars",
    typePublication: "Rate Books & Pubs",
    typeApplication: "Applications & Forms",
    typeReport: "Gazettes & Reports",
    typeOther: "Notices & Other",
    totalDirectivesWord: "Directives",
    modalDocTitleAdd: "Publish New Document",
    modalDocTitleEdit: "Edit Official Document",
    modalDocDirectPushText: "Direct Live Publishing: Saved documents are pushed directly to the citizen website without administrative pre-approval.",
    modalDocDirectPushActive: "🟢 Direct Push Active",
    modalDocSmartTransHelp: "<strong>Smart Multilingual:</strong> Type title in ANY language. Other languages translate automatically!",
    btnAutoTranslateShort: "Auto-Translate",
    lblDocTitleEn: "Document Title (English)",
    lblDocTitleSi: "Document Title (Sinhala - සිංහල)",
    lblDocTitleTa: "Document Title (Tamil - தமிழ்)",
    lblDocTitle: "Document Title",
    lblDivision: "Division / Unit",
    lblDocType: "Document Type",
    lblUploadFile: "Upload PDF / Document File",
    lblDropzonePrompt: "Click to browse or drop file here",
    lblDropzoneSub: "PDF, DOC, DOCX, XLS (Max 50MB)",
    lblDocSize: "Document Size",
    lblPinFeatured: "Pin to Featured",
    btnCancel: "Cancel",
    btnSaveDoc: "Save Document",
    btnSaveDocEditing: "Save Changes",
    btnEdit: "Edit",
    btnDelete: "Delete",
    modalProjTitleAdd: "Publish News Article / Project",
    modalProjTitleEdit: "Edit News Article / Project",
    modalProjDirectPushText: "Direct Live Publishing: Pushed immediately to the live public portal carousel & articles without admin approval.",
    lblHeadlineEn: "Headline / Title (English)",
    lblHeadlineSi: "Headline / Title (Sinhala - සිංහල)",
    lblHeadlineTa: "Headline / Title (Tamil - தமிழ்)",
    lblHeadline: "Headline / Title",
    lblArticleSummaryEn: "Article Summary / Description (English)",
    lblArticleSummarySi: "Article Summary / Description (Sinhala - සිංහල)",
    lblArticleSummaryTa: "Article Summary / Description (Tamil - தமிழ்)",
    lblArticleSummary: "Article Summary / Description",
    lblKeyword: "Category / Keyword",
    lblPublishDate: "Publish Date",
    lblCoverImage: "Cover Image File or Asset URL",
    btnUploadNewImage: "Upload New Image",
    btnPublishArticleDirect: "Publish Article Directly",
    btnPublishArticleDirectEditing: "Save Article Changes",
    btnAddProject: "Add New Project",
    projHeaderTitle: "Key Provincial Projects",
    projHeaderSub: "Featured regional development initiatives on the homepage",
    lblProjectImage: "Featured Image / Cover Photo",
    dropzoneProjectImage: "Click to browse or drop cover photo here",
    dropzoneProjectImageSub: "JPG, PNG, WEBP (Max 15MB)",
    lblContentLang: "Content Language:",
    optTypeCircular: "Circular",
    optTypePublication: "Publication / Rate Book",
    optTypeApplication: "Application / Form",
    optTypeReport: "Report / Gazette",
    optTypeNotice: "Notice",
    brandTitle: "NWP Portal",
    brandSub: "Chief Secretariat",
    councilCentralSec: "Council Central Secretariat",
    councilTitle: "NORTH WESTERN PROVINCIAL COUNCIL",
    councilSub: "NORTH WESTERN PROVINCE",
    navPublishNew: "Publish New Directive",
    navProfileSec: "My Profile & Security",
    btnSignOut: "Sign Out",
    btnCreateDivision: "Add Division / Sub-Division",
    modalDivTitle: "Create Division or Sub-Division",
    modalDivInfoNotice: "Live Secretariat Architecture: Divisions and sub-units created here immediately appear across public portal navigation, directories, document filters, and officer registration.",
    tabMainDivision: "🏛️ 1. Main Division",
    tabSubDivision: "📂 2. Sub-Division / Unit",
    lblInitialSubUnits: "Initial Sub-Units / Sections (Optional, comma-separated)",
    hintInitialSubUnits: "Separate multiple sub-units with commas. You can also add more sub-units later anytime.",
    lblParentMainDiv: "Parent Main Division *",
    btnCreateMainDiv: "Create Main Division",
    btnCreateSubDiv: "Create Sub-Division",
    navOverview: "Overview",
    navDocuments: "Documents",
    navDivisions: "Divisions",
    navInquiries: "Inquiries",
    navAlerts: "Alerts",
    navEServices: "Division Web Portals",
    navDivisionPortals: "Division Web Portals",
    divPortalsHeaderTitle: "Division Web Portals & Links",
    divPortalsHeaderSub: "Manage official public web hyperlinks for statutory divisions and their sub-units",
    btnSetPortalLink: "Configure Portal URL",
    thDivision: "Division",
    thPortalScope: "Target Scope / Sub-Unit",
    thPortalUrl: "Configured URL (Hyperlink)",
    navProjects: "Projects",
    navUsers: "Users",
    navSiteTexts: "Site Texts",
    livePublicPortal: "Live Public Portal",
    livePublicPortalSub: "Review public changes live on citizen website",
    launchSite: "Launch Site",
    searchPlaceholder: "Search...",
    searchCircularsPlaceholder: "Search circulars...",
    metricDocs: "Circulars & Rate Books",
    metricDivisions: "Secretarial Divisions",
    metricInquiries: "Citizen Inquiries Received",
    metricSystems: "Online Systems & BoQ",
    metricAnnouncements: "Live Announcements",
    metricAnnouncementsSub: "Public broadcasts & urgent notices",
    annSmartTitle: "Smart Single-Language Input & Auto-Translation",
    annSmartSub: "Type in ANY one language below. It automatically translates across Sinhala, English, and Tamil!",
    btnAutoTranslateAll: "Auto-Translate All Languages",
    btnBroadcast: "Broadcast",
    btnManage: "Manage",
    btnReview: "Review",
    btnExplore: "Explore",
    metricDocsSub: "Official gazettes, circulars & rate books",
    metricInquiriesSub: "Public inquiries & petitions",
    metricDivisionsSub: "Provincial statutory units",
    officerDocsSub: "Directives published by your account",
    officerProjectsSub: "Live articles in provincial projects",
    officerAnnouncementsSub: "Live marquee broadcasts & urgent notices",
    chartDivTitle: "Circulars by Division",
    chartDivSub: "Document publication volume across secretariats",
    liveCountBadge: "Live Count",
    govMilestones: "Governance Milestones",
    govMilestonesSub: "Provincial council compliance status",
    milestone1: "2027 Annual Transfers Issued",
    milestone1Sub: "Development Officers & MSO lists online",
    milestone2: "RTI Citizen Compliance",
    milestone2Sub: "Information Officers designated & published",
    milestone3: "Engineering Rate Books 2026",
    milestone3Sub: "Kurunegala & Puttalam 2nd Half rates",
    milestone4: "BoQ Online Integration",
    milestone4Sub: "Public portal link & manual online",
    tabDirectives: "Thematic Directives",
    tabInProgress: "In Progress",
    tabArchived: "Archived Directives",
    folderDirectiveName: "Directive Name",
    folderSearchPlaceholder: "Enter a keyword to search",
    folderDivision: "Division",
    folderChooseDivision: "All Divisions / Choose",
    btnSearch: "Search",
    btnRelease: "+ Release",
    btnLaunch: "Launch",
    btnRevise: "Revise",
    btnView: "View",
    btnAction: "Action",
    lblCircularNo: "Circular No:",
    lblPublished: "Published",
    authorized: "Authorized",
    officerDocsTitle: "My Documents & Circulars",
    officerProjectsTitle: "My Projects & Articles",
    officerAuthorityTitle: "Assigned Authority",
    chartSplineTitle: "Citizen Inquiries & Directives Dynamic",
    chartSplineSub: "Public inquiries vs resolved direct requests",
    yearBadge: "Year 2026",
    recentInquiriesTitle: "Recent Inquiries",
    recentInquiriesSub: "Latest citizen messages from web portal",
    btnViewAll: "View All",
    optAllDivisions: "All Divisions",
    optAllTypes: "All Types",
    optCircular: "Circular",
    optPublication: "Publication / Rate Book",
    optApplication: "Application / Form",
    optReport: "Report / Gazette",
    btnAddDoc: "Add New Document",
    thDocTitle: "Title & Subject",
    thDocDivision: "Division",
    thDocType: "Type",
    thDocFiles: "Files",
    thDocSize: "Size",
    thDocFeatured: "Featured",
    thDocStatus: "Status",
    btnCreateProject: "+ Add News / Project",
    thAction: "Action",
    thInqDate: "Date",
    thInqName: "Citizen Name",
    thInqNic: "NIC Number",
    thInqContact: "Phone / Email",
    thInqMessage: "Inquiry Message",
    thSysTitle: "System Title",
    thSysCategory: "Category",
    thSysDesc: "Description",
    thSysUrl: "URL",
    thUserUsername: "Username",
    thUserFullname: "Full Name",
    thUserRole: "Role",
    thUserDiv: "Division Access",
    thUserStatus: "Status",
    btnAddOfficer: "Add Key Official",
    btnAddSystem: "Add System",
    btnCreateUser: "Create User",
    btnSaveAnnouncements: "Save Live Announcements",
    btnSaveSiteTexts: "Save Site Content Changes",
    heroTextSectionTitle: "Hero Banner Search Header Text (Home Banner)",
    lblHeroBadge: "Badge Pill Text (e.g. Chief Secretariat • NWPC)",
    lblHeroTitle: "Main Search Title (e.g. How can we help you today?)",
    lblHeroSubtitle: "Search Subtitle Description",
    divisionsHeaderTitle: "Secretarial Divisions & Key Officials",
    divisionsHeaderSub: "Manage Deputy Chief Secretaries, sub-units, and division descriptions",
    inquiriesHeaderTitle: "Citizen Inquiries Desk",
    inquiriesHeaderSub: "Incoming requests submitted with National Identity Card (NIC)",
    announcementsHeaderTitle: "Live Announcement Marquee Ticker",
    announcementsHeaderSub: "This text scrolls in real-time across the top ribbon of the public portal in 3 languages.",
    eservicesHeaderTitle: "e-Services & Online Systems",
    eservicesHeaderSub: "Manage links to BoQ, Provincial Treasury, GIS, and staff portals",
    projectsHeaderTitle: "Key Provincial Projects",
    projectsHeaderSub: "Featured regional development initiatives on the homepage",
    usersHeaderTitle: "Administrator User Accounts",
    usersHeaderSub: "Manage login credentials, roles (Super Admin, Admin, Editor), and division access",
    textsHeaderTitle: "Site Texts & Governance Values",
    textsHeaderSub: "Edit Vision, Mission, Citizen Charter, and Header/Footer texts",
            lblCurrentPassword: "Current Password",
    lblNewPassword: "New Password",
    lblConfirmPassword: "Confirm New Password",
    superRecentDocsTitle: "Council Directives & Publications",
    superRecentDocsSub: "Directives published across all secretariat divisions",
    superRecentInqTitle: "Incoming Citizen Inquiries",
    superRecentInqSub: "Public inquiries & service requests from citizen portal",
    btnPublish: "Publish",
    btnReviewAll: "Review",
    btnViewAllDocs: "View All Wayamba Directives ➔",
    btnViewAllInquiries: "Open Inquiries Registry ➔",
modalPwdTitle: "Change Account Password",
    modalForgotTitle: "Account Password Recovery",
views: {
      'view-overview': ['Overview', 'Central operations & administrative metrics'],
      'view-documents': ['Document Registry', 'Official circulars, rate books, and gazettes'],
      'view-divisions': ['Divisions & Key Officials', 'Structure, deputy secretaries, and official profiles'],
      'view-inquiries': ['Citizen Inquiries', 'Incoming requests & feedback with citizen NIC details'],
      'view-announcements': ['Live Announcements', 'Top marquee ticker broadcast management'],
      'view-eservices': ['Division Web Portals', 'Official departmental portals and hyperlinks for statutory units'],
      'view-projects': ['Provincial Projects', 'Featured regional development initiatives'],
      'view-users': ['Administrator Users', 'Access permissions, roles, and division assignments'],
      'view-texts': ['Site Texts & Values', 'Vision, Mission, Citizen Charter, and trilingual copy'],
      'view-profile': ['Officer Profile & Security', 'Manage identity, contact information, and security credentials']
    }
  },
  si: {
    tabSignIn: "ප්‍රවේශ වන්න",
    tabRegisterOfficer: "නිලධාරී ලියාපදිංචිය",
    btnBackToHome: "ආපසු වෙබ් අඩවියට",
    loginGateTitle: "වයඹ විධායක පිවිසුම",
    loginGateDesc: "ප්‍රධාන ලේකම් කාර්යාලය – වයඹ පළාත\nමධ්‍යම මෙහෙයුම් සහ අන්තර්ගත කළමනාකරණය",
    lblUsername: "පරිශීලක නාමය",
    lblPassword: "මුරපදය",
    authForgotPassword: "මුරපදය අමතකද?",
    btnAuthSession: "පද්ධතියට ඇතුළු වන්න",
    loginPromptNewStaff: "නව ලේකම් කාර්යාල නිලධාරියෙක්ද?",
    loginLinkCreateAccount: "ගිණුමක් සාදන්න",
    regGateTitle: "නිලධාරී ලියාපදිංචිය",
    regGateDesc: "වයඹ පළාත් සභාව • පරිපාලන ප්‍රකාශන ප්‍රවේශය ඉල්ලුම් කිරීම",
    lblFullName: "සම්පූර්ණ නම",
    lblOfficialUsername: "නිල පරිශීලක නාමය",
    lblAssignedUnit: "අනුයුක්ත ඒකකය (ප්‍රධාන ලේකම් කාර්යාලය)",
    lblPhone: "නිල දුරකථන අංකය",
    lblEmail: "නිල විද්‍යුත් තැපෑල",
    btnSaveProfile: "පැතිකඩ වෙනස්කම් සුරකින්න",
    btnChangePhoto: "ඡායාරූපය වෙනස් කරන්න",
    btnRemovePhoto: "ඉවත් කරන්න",
    lblAccountSecurity: "ගිණුමේ ආරක්ෂාව",
    lblAccountSecuritySub: "ඔබගේ මුරපදය සහ පිවිසුම් ආරක්ෂාව කළමනාකරණය කරන්න",
    lblCurrentPassword: "වත්මන් මුරපදය",
    lblNewPassword: "නව මුරපදය",
    lblConfirmPassword: "නව මුරපදය තහවුරු කරන්න",
    btnUpdatePassword: "මුරපදය යාවත්කාලීන කරන්න",
    lblCreatePassword: "මුරපදයක් සාදන්න",
    btnSubmitRegistration: "ලියාපදිංචිය ඉදිරිපත් කරන්න",
    regPromptHaveAccount: "දැනටමත් ගිණුමක් තිබේද?",
    regLinkSignIn: "ප්‍රවේශ වන්න",
        chartPieTitle: "ප්‍රවර්ගය අනුව පළාත් සභා නියෝග",
    userRecentDocsTitle: "📑 මා විසින් උඩුගත කළ ලේඛන",
    officerProfileCardTitle: "නිලධාරී පැතිකඩ සහ බලතල",
    officerProfileCardSub: "නියමිත ඒකකය සහ සජීවී ප්‍රකාශන තොරතුරු",
    lblParentDivision: "ප්‍රධාන අමාත්‍යාංශය/අංශය:",
    lblDesignation: "නිල තනතුර:",
    lblOfficialEmail: "විද්‍යුත් තැපෑල:",
    lblOfficialPhone: "දුරකථනය:",
    btnManageProfileCredentials: "පැතිකඩ සහ මුරපදය කළමනාකරණය",
    unitPublishingCardTitle: "මාගේ ඒකකයේ ප්‍රකාශන කේන්ද්‍රය",
    unitPublishingCardSub: "චක්‍රලේඛ, මුල් පිටුවේ ලිපි සහ සජීවී යාවත්කාලීන",
    livePortalBadge: "සජීවී සබැඳිය",
    metricDirectivesShort: "නියෝග",
    metricArticlesShort: "ලිපි",
    metricAlertsShort: "නිවේදන",
    directPublishGuarantee: "සුරැකි ලේඛන සහ ලිපි පූර්ව අනුමැතියකින් තොරව වහාම මහජන වෙබ් අඩවියේ සජීවීව පළ වේ.",
    btnUploadDirective: "නියෝගයක් උඩුගත කරන්න",
    btnPublishArticle: "ලිපියක් එක් කරන්න",
    userRecentDocsSub: "ඔබගේ ගිණුම මගින් නිකුත් කර උඩුගත කරන ලද ලේඛන",
    userRecentProjectsTitle: "🚀 මාගේ මුල් පිටුවේ ලිපි සහ ව්‍යාපෘති",
    userRecentProjectsSub: "'පළාත් සංවර්ධන ව්‍යාපෘති' අංශයේ පළ වූ ලිපි",
    btnAddArticle: "ලිපියක් එක් කරන්න",
    btnViewAllMyDocs: "මාගේ සියලුම ලේඛන බලන්න ➔",
    btnViewAllMyProjects: "මාගේ සියලුම ලිපි බලන්න ➔",
    chartPieSub: "ලේඛන වර්ගීකරණය සහ ප්‍රකාශන ප්‍රතිශතය",
    liveDistBadge: "සජීවී ප්‍රතිශතය",
    forgotStep1Desc: "ඔබගේ පරිශීලක නාමය හෝ ලියාපදිංචි විද්‍යුත් තැපෑල ඇතුළත් කරන්න. ඔබගේ විද්‍යුත් තැපෑලට ඉලක්කම් 6ක සත්‍යාපන කේතයක් එවනු ලැබේ.",
    lblAccountIdentifier: "පරිශීලක නාමය හෝ ලියාපදිංචි විද්‍යුත් තැපෑල",
    btnSendCode: "සත්‍යාපන කේතය එවන්න",
    forgotStep2Desc: "ඉලක්කම් 6ක සත්‍යාපන කේතයක් වෙත යවන ලදී:",
    codeValidMins: "මිනිත්තු 15ක් වලංගු වේ.",
    lblVerificationCode: "ඉලක්කම් 6ක සත්‍යාපන කේතය",
    btnChangeEmailResend: "විද්‍යුත් තැපෑල වෙනස් කරන්න / නැවත එවන්න",
    btnVerifyAndReset: "කේතය තහවුරු කර මුරපදය යාවත්කාලීන කරන්න",
    btnBack: "ආපසු",
    typeCircular: "චක්‍රලේඛ",
    typePublication: "මිල ගණන් පොත් සහ ප්‍රකාශන",
    typeApplication: "අයදුම්පත් සහ ආකෘති",
    typeReport: "ගැසට් සහ වාර්තා",
    typeOther: "නිවේදන සහ වෙනත්",
    totalDirectivesWord: "නියෝග",
    modalDocTitleAdd: "නව ලේඛනයක් පළ කිරීම",
    modalDocTitleEdit: "නිල ලේඛනය සංස්කරණය",
    modalDocDirectPushText: "සජීවී සෘජු ප්‍රකාශනය: සුරකින ලද ලේඛන පූර්ව පරිපාලන අනුමැතියකින් තොරව සෘජුවම මහජන වෙබ් අඩවියට එකතු වේ.",
    modalDocDirectPushActive: "🟢 සජීවී සෘජු ප්‍රකාශනය ක්‍රියාත්මකයි",
    modalDocSmartTransHelp: "<strong>ස්වයංක්‍රීය බහුභාෂා පරිවර්තනය:</strong> ඕනෑම එක් භාෂාවකින් මාතෘකාව ඇතුළත් කළ විට අනෙක් භාෂා ස්වයංක්‍රීයව පරිවර්තනය වේ!",
    btnAutoTranslateShort: "ස්වයංක්‍රීය පරිවර්තනය",
    lblDocTitleEn: "ලේඛන මාතෘකාව (ඉංග්‍රීසි - English)",
    lblDocTitleSi: "ලේඛන මාතෘකාව (සිංහල)",
    lblDocTitleTa: "ලේඛන මාතෘකාව (දෙමළ - தமிழ்)",
    lblDocTitle: "ලේඛන මාතෘකාව",
    lblDivision: "අංශය / ඒකකය",
    lblDocType: "ලේඛන වර්ගය",
    lblUploadFile: "PDF / ලේඛන ගොනුව උඩුගත කරන්න",
    lblDropzonePrompt: "ගොනුව තේරීමට ක්ලික් කරන්න හෝ මෙතැනට ඇද දමන්න",
    lblDropzoneSub: "PDF, DOC, DOCX, XLS (උපරිම 50MB)",
    lblDocSize: "ලේඛන ප්‍රමාණය",
    lblPinFeatured: "විශේෂාංගයක් ලෙස සලකුණු කරන්න",
    btnCancel: "අවලංගු කරන්න",
    btnSaveDoc: "ලේඛනය සුරකින්න",
    btnSaveDocEditing: "වෙනස්කම් සුරකින්න",
    btnEdit: "සංස්කරණය",
    btnDelete: "මකන්න",
    modalProjTitleAdd: "නව පුවත් / ව්‍යාපෘති ලිපියක් පළ කිරීම",
    modalProjTitleEdit: "පුවත් / ව්‍යාපෘති ලිපිය සංස්කරණය",
    modalProjDirectPushText: "සජීවී සෘජු ප්‍රකාශනය: පරිපාලන අනුමැතියකින් තොරව මහජන ද්වාරයේ ප්‍රධාන පුවත් තීරුවට සහ ලිපි වලට සජීවීව එක් වේ.",
    lblHeadlineEn: "ප්‍රධාන සිරස්තලය / මාතෘකාව (ඉංග්‍රීසි)",
    lblHeadlineSi: "ප්‍රධාන සිරස්තලය / මාතෘකාව (සිංහල)",
    lblHeadlineTa: "ප්‍රධාන සිරස්තලය / මාතෘකාව (දෙමළ)",
    lblHeadline: "ප්‍රධාන සිරස්තලය / මාතෘකාව",
    lblArticleSummaryEn: "ලිපි සාරාංශය / විස්තරය (ඉංග්‍රීසි)",
    lblArticleSummarySi: "ලිපි සාරාංශය / විස්තරය (සිංහල)",
    lblArticleSummaryTa: "ලිපි සාරාංශය / විස්තරය (දෙමළ)",
    lblArticleSummary: "ලිපි සාරාංශය / විස්තරය",
    lblKeyword: "ප්‍රවර්ගය / මූලපදය",
    lblPublishDate: "ප්‍රකාශිත දිනය",
    lblCoverImage: "කවරයේ ඡායාරූපය හෝ සබැඳිය",
    btnUploadNewImage: "නව ඡායාරූපයක් උඩුගත කරන්න",
    btnPublishArticleDirect: "ලිපිය සජීවීව පළ කරන්න",
    btnPublishArticleDirectEditing: "වෙනස්කම් සුරකින්න",
    btnAddProject: "නව ව්‍යාපෘතියක් එක් කරන්න",
    projHeaderTitle: "ප්‍රධාන පළාත් සංවර්ධන ව්‍යාපෘති",
    projHeaderSub: "මුල් පිටුවේ විශේෂාංගගත ප්‍රාදේශීය සංවර්ධන වැඩසටහන්",
    lblProjectImage: "විශේෂාංග ඡායාරූපය / ආවරණ පින්තූරය",
    dropzoneProjectImage: "කවරයේ ඡායාරූපය තේරීමට ක්ලික් කරන්න හෝ මෙතැනට අදින්න",
    dropzoneProjectImageSub: "JPG, PNG, WEBP (උපරිම 15MB)",
    lblContentLang: "අන්තර්ගත භාෂාව:",
    optTypeCircular: "චක්‍රලේඛ",
    optTypePublication: "ප්‍රකාශන / මිල ගණන් පොත්",
    optTypeApplication: "අයදුම්පත් / ආකෘති පත්‍ර",
    optTypeReport: "වාර්තා / ගැසට් පත්‍ර",
    optTypeNotice: "නිවේදන",
    brandTitle: "වයඹ ද්වාරය",
    brandSub: "ප්‍රධාන ලේකම් කාර්යාලය",
    councilCentralSec: "සභා මධ්‍යම ලේකම් කාර්යාලය",
    councilTitle: "වයඹ පළාත් සභාව",
    councilSub: "වයඹ පළාත",
    navPublishNew: "නව නියෝගයක් නිකුත් කිරීම",
    navProfileSec: "මගේ ගිණුම සහ ආරක්ෂාව",
    btnSignOut: "ඉවත් වන්න",
    btnCreateDivision: "නව අංශයක් / අනු අංශයක් එක් කරන්න",
    modalDivTitle: "නව ලේකම් කාර්යාල අංශයක් හෝ අනු අංශයක් එක් කරන්න",
    modalDivInfoNotice: "සජීවී ව්‍යුහය: මෙහි එක් කරන අංශ සහ අනු ඒකක මහජන වෙබ් අඩවිය, ලේඛන පෙරහන් සහ නිලධාරී ලියාපදිංචි ලැයිස්තු වෙත ක්ෂණිකව එකතු වේ.",
    tabMainDivision: "🏛️ 1. ප්‍රධාන අංශය",
    tabSubDivision: "📂 2. අනු අංශය / ඒකකය",
    lblInitialSubUnits: "අදාළ අනු අංශ / ඒකක (කොමාවලින් වෙන්කර ලියන්න - විකල්ප)",
    hintInitialSubUnits: "උදා: ක්‍රමසම්පාදන ඒකකය, විගණන ඒකකය. (පසුවද ඕනෑම අවස්ථාවක අනු අංශ එක් කළ හැක)",
    lblParentMainDiv: "මව් ප්‍රධාන අංශය *",
    btnCreateMainDiv: "ප්‍රධාන අංශය සාදන්න",
    btnCreateSubDiv: "අනු අංශය එක් කරන්න",
    navOverview: "දළ විශ්ලේෂණය",
    navDocuments: "ලේඛන",
    navDivisions: "අංශ",
    navInquiries: "විමසීම්",
    navAlerts: "නිවේදන",
    navEServices: "අංශ වෙබ් සබැඳි",
    navDivisionPortals: "අංශ වෙබ් සබැඳි",
    divPortalsHeaderTitle: "අංශ වෙබ් සබැඳි සහ ද්වාර කළමනාකරණය",
    divPortalsHeaderSub: "ව්‍යවස්ථාපිත අංශ සහ අනු ඒකක සඳහා නිල මහජන වෙබ් සබැඳි කළමනාකරණය කරන්න",
    btnSetPortalLink: "නව සබැඳියක් සකසන්න",
    thDivision: "ලේකම් කාර්යාල අංශය",
    thPortalScope: "අදාළ අනු ඒකකය / විෂය පථය",
    thPortalUrl: "වෙබ් අඩවි සබැඳිය (Hyperlink)",
    navProjects: "ව්‍යාපෘති",
    navUsers: "පරිශීලකයින්",
    navSiteTexts: "වෙබ් අඩවි පාඨ",
    livePublicPortal: "මහජන වෙබ් අඩවිය",
    livePublicPortalSub: "පුරවැසි වෙබ් අඩවියේ සජීවීව වෙනස්කම් සමාලෝචනය කරන්න",
    launchSite: "පිවිසෙන්න",
    searchPlaceholder: "සොයන්න...",
    searchCircularsPlaceholder: "චක්‍රලේඛ සොයන්න...",
    metricDocs: "චක්‍රලේඛ සහ මිල ගණන් පොත්",
    metricDivisions: "ලේකම් කාර්යාල අංශ",
    metricInquiries: "ලැබුණු පුරවැසි විමසීම්",
    metricSystems: "මාර්ගගත පද්ධති සහ BoQ",
    metricAnnouncements: "සජීවී නිවේදන",
    metricAnnouncementsSub: "මහජන විකාශන සහ හදිසි නිවේදන",
    annSmartTitle: "ස්වයංක්‍රීය භාෂා පරිවර්තනය (Smart 1-Language Input)",
    annSmartSub: "ඕනෑම එක් භාෂාවකින් නිවේදනය ඇතුළත් කරන්න. වෙබ් අඩවියේදී අනෙක් භාෂාවලට එය ස්වයංක්‍රීයව පරිවර්තනය වේ!",
    btnAutoTranslateAll: "භාෂා 3ටම පරිවර්තනය කරන්න (Auto-Translate)",
    btnBroadcast: "විකාශනය",
    btnManage: "කළමනාකරණය",
    btnReview: "සමාලෝචනය",
    btnExplore: "ගවේෂණය",
    metricDocsSub: "නිල ගැසට්, චක්‍රලේඛ සහ මිල ගණන් පොත්",
    metricInquiriesSub: "මහජන විමසීම් සහ පෙත්සම්",
    metricDivisionsSub: "පළාත් ව්‍යවස්ථාපිත අංශ",
    officerDocsSub: "ඔබගේ ගිණුමෙන් පළ කළ චක්‍රලේඛ",
    officerProjectsSub: "පළාත් සංවර්ධන ව්‍යාපෘති සඳහා පළ කළ ලිපි",
    officerAnnouncementsSub: "සජීවී පුවත් තීරුව සහ හදිසි නිවේදන",
    chartDivTitle: "අංශ අනුව චක්‍රලේඛ",
    chartDivSub: "ලේකම් කාර්යාල හරහා ලේඛන ප්‍රකාශන ප්‍රමාණය",
    liveCountBadge: "සජීවී ගණන",
    govMilestones: "පාලන සන්ධිස්ථාන",
    govMilestonesSub: "පළාත් සභා අනුකූලතා තත්ත්වය",
    milestone1: "2027 වාර්ෂික ස්ථාන මාරු නිකුත් කෙරිණි",
    milestone1Sub: "සංවර්ධන නිලධාරී සහ MSO ලැයිස්තු මාර්ගගතව",
    milestone2: "තොරතුරු දැනගැනීමේ අයිතිය (RTI)",
    milestone2Sub: "තොරතුරු නිලධාරීන් නම් කර පළ කර ඇත",
    milestone3: "ඉංජිනේරු මිල ගණන් පොත් 2026",
    milestone3Sub: "කුරුණෑගල සහ පුත්තලම 2 වන භාගය",
    milestone4: "BoQ මාර්ගගත පද්ධතිය",
    milestone4Sub: "මහජන ද්වාර සබැඳිය සහ අත්පොත",
    chartSplineTitle: "පුරවැසි විමසීම් සහ නියෝග ප්‍රවණතාවය",
    chartSplineSub: "මහජන විමසීම් සහ විසඳන ලද ඉල්ලීම්",
    yearBadge: "2026 වර්ෂය",
    recentInquiriesTitle: "මෑත පුරවැසි විමසීම්",
    recentInquiriesSub: "වෙබ් ද්වාරයෙන් ලැබුණු නවතම පණිවිඩ",
    btnViewAll: "සියල්ල බලන්න",
    optAllDivisions: "සියලුම අංශ",
    optAllTypes: "සියලු වර්ග",
    optCircular: "චක්‍රලේඛ",
    optPublication: "ප්‍රකාශන / මිල ගණන් පොත්",
    optApplication: "අයදුම්පත් / ආකෘති පත්‍ර",
    optReport: "වාර්තා / ගැසට් පත්‍ර",
    btnAddDoc: "නව ලේඛනයක් එක් කරන්න",
    thDocTitle: "ලේඛන නාමය සහ විෂය",
    thDocDivision: "අංශය",
    thDocType: "වර්ගය",
    thDocFiles: "ගොනු",
    thDocSize: "ප්‍රමාණය",
    thDocFeatured: "විශේෂිත",
    thAction: "ක්‍රියා",
    thInqDate: "දිනය",
    thInqName: "පුරවැසියාගේ නම",
    thInqNic: "ජා.හැ. අංකය",
    thInqContact: "දුරකථන / විද්‍යුත් තැපෑල",
    thInqMessage: "විමසුම් පණිවිඩය",
    thSysTitle: "පද්ධති නාමය",
    thSysCategory: "ප්‍රවර්ගය",
    thSysDesc: "විස්තරය",
    thSysUrl: "වෙබ් සබැඳිය",
    thUserUsername: "පරිශීලක නාමය",
    thUserFullname: "සම්පූර්ණ නම",
    thUserRole: "භූමිකාව",
    thUserDiv: "අංශ ප්‍රවේශය",
    thUserStatus: "තත්ත්වය",
    btnAddOfficer: "ප්‍රධාන නිලධාරියෙකු එක් කරන්න",
    btnAddSystem: "පද්ධතියක් එක් කරන්න",
    btnCreateUser: "පරිශීලකයෙකු සාදන්න",
    btnSaveAnnouncements: "සජීවී නිවේදන සුරකින්න",
    btnSaveSiteTexts: "අන්තර්ගත වෙනස්කම් සුරකින්න",
    heroTextSectionTitle: "මුල් පිටුවේ ප්‍රධාන සිරස්තල කොටස (Hero Banner)",
    lblHeroBadge: "ලාංඡන පෙළ (Badge Pill Text)",
    lblHeroTitle: "ප්‍රධාන සිරස්තලය (Main Search Title)",
    lblHeroSubtitle: "උප සිරස්තලය / විස්තරය",
    divisionsHeaderTitle: "ලේකම් කාර්යාල අංශ සහ ප්‍රධාන නිලධාරීන්",
    divisionsHeaderSub: "නියෝජ්‍ය ප්‍රධාන ලේකම්වරුන්, අනු අංශ සහ අංශ විස්තර කළමනාකරණය",
    inquiriesHeaderTitle: "පුරවැසි විමසීම් කාර්යාංශය",
    inquiriesHeaderSub: "ජාතික හැඳුනුම්පත් අංකය (NIC) සහිතව ලැබුණු ඉල්ලීම්",
    announcementsHeaderTitle: "සජීවී නිවේදන පුවත් තීරුව",
    announcementsHeaderSub: "මෙම පාඨය මහජන වෙබ් අඩවියේ ඉහළ තීරුවේ භාෂා 3 කින් සජීවීව දිස්වේ.",
    eservicesHeaderTitle: "ඊ-සේවා සහ මාර්ගගත පද්ධති",
    eservicesHeaderSub: "BoQ, පළාත් භාණ්ඩාගාරය, GIS සහ සේවක ද්වාර සබැඳි කළමනාකරණය",
    projectsHeaderTitle: "ප්‍රධාන පළාත් ව්‍යාපෘති",
    projectsHeaderSub: "මුල් පිටුවේ විශේෂාංග කර ඇති කලාපීය සංවර්ධන වැඩසටහන්",
    usersHeaderTitle: "පරිපාලක පරිශීලක ගිණුම්",
    usersHeaderSub: "පිවිසුම් තොරතුරු, භූමිකාවන් (ප්‍රධාන පරිපාලක, පරිපාලක, සංස්කාරක) සහ අංශ ප්‍රවේශය කළමනාකරණය",
    textsHeaderTitle: "වෙබ් අඩවි පාඨ සහ පාලන අගයන්",
    textsHeaderSub: "දැක්ම, මෙහෙවර, පුරවැසි ප්‍රකාශය සහ ශීර්ෂක/පාදක පාඨ සංස්කරණය",
        tabDirectives: "තේමාත්මක නියෝග",
    tabInProgress: "ක්‍රියාත්මක වෙමින් පවතින",
    tabArchived: "ලේඛනාගාර නියෝග",
    folderDirectiveName: "නියෝගයේ නම",
    folderSearchPlaceholder: "සෙවීමට වචනයක් ඇතුළත් කරන්න",
    folderDivision: "අංශය",
    folderChooseDivision: "සියලුම අංශ / තෝරන්න",
    btnSearch: "සොයන්න",
    btnRelease: "+ නිකුත් කරන්න",
    btnLaunch: "විකාශනය",
    btnRevise: "සංශෝධනය",
    btnView: "බලන්න",
    btnAction: "ක්‍රියාමාර්ග",
    lblCircularNo: "චක්‍රලේඛ අංක:",
    lblPublished: "පළ කළ දිනය",
    authorized: "බලයලත්",
    officerDocsTitle: "මගේ ලේඛන සහ චක්‍රලේඛ",
    officerProjectsTitle: "මගේ ව්‍යාපෘති සහ ලිපි",
    officerAuthorityTitle: "අනුයුක්ත බලධාරී අංශය",
        lblCurrentPassword: "වත්මන් මුරපදය (Current Password)",
    lblNewPassword: "නව මුරපදය (New Password)",
    lblConfirmPassword: "නව මුරපදය තහවුරු කරන්න",
modalPwdTitle: "ගිණුමේ මුරපදය වෙනස් කිරීම",
    modalForgotTitle: "මුරපදය ප්‍රතිසාධනය කිරීම (Forgot Password)",
    btnCreateProject: "+ ව්‍යාපෘතියක් / ලිපියක් එක් කරන්න",
    thDocStatus: "තත්ත්වය",
    superRecentDocsTitle: "පළාත් සභා නිල නියෝග සහ ප්‍රකාශන",
    superRecentDocsSub: "සියලුම ලේකම් කාර්යාල අංශ මඟින් පළ කරන ලද නියෝග",
    superRecentInqTitle: "ලැබුණු පුරවැසි විමසීම් සහ පෙත්සම්",
    superRecentInqSub: "මහජන වෙබ් අඩවිය හරහා පුරවැසියන් යොමු කළ විමසීම්",
    btnPublish: "පළ කරන්න",
    btnReviewAll: "සමාලෝචනය",
    btnViewAllDocs: "සියලුම වයඹ නියෝග බලන්න ➔",
    btnViewAllInquiries: "පුරවැසි විමසීම් ලේඛනය විවෘත කරන්න ➔",
views: {
      'view-overview': ['දළ විශ්ලේෂණය', 'මධ්‍යම මෙහෙයුම් සහ පරිපාලන දර්ශක'],
      'view-documents': ['නිල ලේඛන ලේඛකාගාරය', 'නිල චක්‍රලේඛ, මිල ගණන් පොත් සහ ගැසට් පත්‍ර'],
      'view-divisions': ['අංශ සහ ප්‍රධාන නිලධාරීන්', 'ව්‍යුහය, නියෝජ්‍ය ලේකම්වරුන් සහ නිල පැතිකඩ'],
      'view-inquiries': ['පුරවැසි විමසීම්', 'ජාතික හැඳුනුම්පත් විස්තර සහිත ලැබෙන ඉල්ලීම්'],
      'view-announcements': ['සජීවී නිවේදන', 'ප්‍රධාන සජීවී පුවත් තීරු විකාශන කළමනාකරණය'],
      'view-eservices': ['අංශ වෙබ් සබැඳි', 'ව්‍යවස්ථාපිත අංශ සහ අනු ඒකක සඳහා නිල මහජන වෙබ් සබැඳි'],
      'view-projects': ['පළාත් ව්‍යාපෘති', 'විශේෂිත ප්‍රාදේශීය සංවර්ධන වැඩසටහන්'],
      'view-users': ['පරිපාලක පරිශීලකයින්', 'ප්‍රවේශ අවසර, භූමිකාවන් සහ අංශ පැවරුම්'],
      'view-texts': ['වෙබ් අඩවි පාඨ සහ අගයන්', 'දැක්ම, මෙහෙවර, පුරවැසි ප්‍රකාශය සහ ත්‍රෛභාෂා පාඨ'],
      'view-profile': ['නිලධාරී පැතිකඩ සහ ආරක්ෂාව', 'අනන්‍යතාවය, දුරකථන/විද්‍යුත් තැපෑල සහ මුරපදය කළමනාකරණය']
    }
  },
  
  
  ta: {
    tabSignIn: "உள்நுழைக",
    tabRegisterOfficer: "அதிகாரி பதிவு",
    btnBackToHome: "இணையத்தளத்திற்கு திரும்பு",
    loginGateTitle: "வடமேல் நிறைவேற்று நுழைவு",
    loginGateDesc: "பிரதம தலைமைச் செயலகம் – வடமேல் மாகாணம்\nமத்திய உள்ளடக்கம் மற்றும் செயல்பாட்டு தொகுதி",
    lblUsername: "பயனர் பெயர்",
    lblPassword: "கடவுச்சொல்",
    authForgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    btnAuthSession: "அமர்வை அங்கீகரிக்கவும்",
    loginPromptNewStaff: "புதிய தலைமைச் செயலக உத்தியோகத்தரா?",
    loginLinkCreateAccount: "கணக்கை உருவாக்கவும்",
    regGateTitle: "உத்தியோகத்தர் பதிவு",
    regGateDesc: "வடமேல் மாகாண சபை • நிர்வாக வெளியீட்டு அணுகலை கோருங்கள்",
    lblFullName: "முழுப் பெயர்",
    lblOfficialUsername: "அதிகாரபூர்வ பயனர் பெயர்",
    lblAssignedUnit: "ஒதுக்கப்பட்ட பிரிவு (பிரதம செயலகம்)",
    lblPhone: "அலுவலக தொடர்பு எண் (தொலைபேசி)",
    lblEmail: "அலுவலக மின்னஞ்சல் முகவரி",
    btnSaveProfile: "சுயவிவர மாற்றங்களைச் சேமிக்கவும்",
    btnChangePhoto: "புகைப்படத்தை மாற்றவும்",
    btnRemovePhoto: "நீக்கு",
    lblAccountSecurity: "கணக்கு பாதுகாப்பு",
    lblAccountSecuritySub: "உங்கள் கடவுச்சொல் மற்றும் உள்நுழைவு பாதுகாப்பை நிர்வகிக்கவும்",
    lblCurrentPassword: "தற்போதைய கடவுச்சொல்",
    lblNewPassword: "புதிய கடவுச்சொல்",
    lblConfirmPassword: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    btnUpdatePassword: "கடவுச்சொல்லைப் புதுப்பிக்கவும்",
    lblCreatePassword: "கடவுச்சொல்லை உருவாக்கவும்",
    btnSubmitRegistration: "பதிவை சமர்ப்பிக்கவும்",
    regPromptHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    regLinkSignIn: "உள்நுழைக",
        chartPieTitle: "வகைப்படுத்தலின் அடிப்படையில் வழிகாட்டல்கள்",
    userRecentDocsTitle: "📑 நான் பதிவேற்றிய ஆவணங்கள்",
    officerProfileCardTitle: "அதிகாரி சுயவிவரம் மற்றும் அதிகாரங்கள்",
    officerProfileCardSub: "ஒதுக்கப்பட்ட பிரிவு மற்றும் வெளியீட்டு சான்றுகள்",
    lblParentDivision: "முதன்மை செயலகம்:",
    lblDesignation: "உத்தியோகபூர்வ பதவி:",
    lblOfficialEmail: "மின்னஞ்சல்:",
    lblOfficialPhone: "தொடர்பு:",
    btnManageProfileCredentials: "சுயவிவரம் மற்றும் கடவுச்சொல் மேலாண்மை",
    unitPublishingCardTitle: "எனது பிரிவின் வெளியீட்டு மையம்",
    unitPublishingCardSub: "வழிகாட்டல்கள், முகப்புப் பக்க கட்டுரைகள் மற்றும் நேரலை புதுப்பிப்புகள்",
    livePortalBadge: "நேரலை இணைப்பு",
    metricDirectivesShort: "வழிகாட்டல்கள்",
    metricArticlesShort: "கட்டுரைகள்",
    metricAlertsShort: "அறிவிப்புகள்",
    directPublishGuarantee: "சேமிக்கப்பட்ட ஆவணங்கள் மற்றும் கட்டுரைகள் முன் அனுமதியின்றி உடனடியாக நேரலையில் வெளியிடப்படும்.",
    btnUploadDirective: "வழிகாட்டலை பதிவேற்றுக",
    btnPublishArticle: "கட்டுரை சேர்க்க",
    userRecentDocsSub: "உங்கள் கணக்கினால் பதிவேற்றப்பட்ட வழிகாட்டல்கள்",
    userRecentProjectsTitle: "🚀 எனது முகப்புப் பக்க கட்டுரைகள்",
    userRecentProjectsSub: "'மாகாண அபிவிருத்தி திட்டங்கள்' பகுதியில் பிரசுரிக்கப்பட்ட கட்டுரைகள்",
    btnAddArticle: "கட்டுரை சேர்க்க",
    btnViewAllMyDocs: "எனது அனைத்து ஆவணங்களையும் காண்க ➔",
    btnViewAllMyProjects: "எனது அனைத்து கட்டுரைகளையும் காண்க ➔",
    chartPieSub: "வகை மற்றும் வெளியீடுகளின் விகிதாசாரம்",
    liveDistBadge: "நேரலை விநியோகம்",
    forgotStep1Desc: "உங்கள் பயனர் பெயர் அல்லது பதிவுசெய்யப்பட்ட மின்னஞ்சலை உள்ளிடவும். உங்கள் மின்னஞ்சலுக்கு 6 இலக்க சரிபார்ப்புக் குறியீடு அனுப்பப்படும்.",
    lblAccountIdentifier: "பயனர் பெயர் அல்லது பதிவுசெய்யப்பட்ட மின்னஞ்சல்",
    btnSendCode: "சரிபார்ப்புக் குறியீட்டை அனுப்புக",
    forgotStep2Desc: "6 இலக்க சரிபார்ப்புக் குறியீடு அனுப்பப்பட்டது:",
    codeValidMins: "15 நிமிடங்களுக்கு செல்லுபடியாகும்.",
    lblVerificationCode: "6-இலக்க சரிபார்ப்புக் குறியீடு",
    btnChangeEmailResend: "மின்னஞ்சலை மாற்று / மீண்டும் அனுப்புக",
    btnVerifyAndReset: "சரிபார்த்து கடவுச்சொல்லை மீட்டமைக்க",
    btnBack: "பின்செல்",
    typeCircular: "சுற்றறிக்கைகள்",
    typePublication: "விகித புத்தகங்கள் & வெளியீடுகள்",
    typeApplication: "விண்ணப்பங்கள் & படிவங்கள்",
    typeReport: "வர்த்தமானிகள் & அறிக்கைகள்",
    typeOther: "அறிவிப்புகள் & பிற",
    totalDirectivesWord: "வழிகாட்டல்கள்",
    modalDocTitleAdd: "புதிய ஆவணத்தை வெளியிடுக",
    modalDocTitleEdit: "அதிகாரப்பூர்வ ஆவணத்தைத் திருத்துக",
    modalDocDirectPushText: "நேரடி நேரலை வெளியீடு: சேமிக்கப்பட்ட ஆவணங்கள் நிர்வாக முன் அனுமதியின்றி நேரடியாக பொது இணையதளத்தில் வெளியிடப்படும்.",
    modalDocDirectPushActive: "🟢 நேரலை வெளியீடு இயங்குகிறது",
    modalDocSmartTransHelp: "<strong>பன்மொழி தானியங்கி:</strong> ஏதேனும் ஒரு மொழியில் தலைப்பை உள்ளிடவும். மற்ற மொழிகள் தானாகவே மொழிபெயர்க்கப்படும்!",
    btnAutoTranslateShort: "தானியங்கி மொழிபெயர்ப்பு",
    lblDocTitleEn: "ஆவணத் தலைப்பு (ஆங்கிலம் - English)",
    lblDocTitleSi: "ஆவணத் தலைப்பு (சிங்களம் - සිංහල)",
    lblDocTitleTa: "ஆவணத் தலைப்பு (தமிழ்)",
    lblDocTitle: "ஆவணத் தலைப்பு",
    lblDivision: "பிரிவு / அலகு",
    lblDocType: "ஆவண வகை",
    lblUploadFile: "PDF / ஆவணக் கோப்பை பதிவேற்றுக",
    lblDropzonePrompt: "கோப்பை உலாவ அல்லது இங்கே விட கிளிக் செய்க",
    lblDropzoneSub: "PDF, DOC, DOCX, XLS (அதிகபட்சம் 50MB)",
    lblDocSize: "ஆவண அளவு",
    lblPinFeatured: "சிறப்பாகக் குறிக்கவும்",
    btnCancel: "இரத்து செய்க",
    btnSaveDoc: "ஆவணத்தைச் சேமிக்குக",
    btnSaveDocEditing: "மாற்றங்களைச் சேமிக்கவும்",
    btnEdit: "திருத்து",
    btnDelete: "நீக்கு",
    modalProjTitleAdd: "புதிய செய்தி / திட்டத்தை வெளியிடுக",
    modalProjTitleEdit: "செய்தி / திட்டக் கட்டுரையைத் திருத்துக",
    modalProjDirectPushText: "நேரடி நேரலை வெளியீடு: நிர்வாக அனுமதியின்றி நேரடி பொது தள சுழல் மற்றும் கட்டுரைகளுக்கு உடனடியாக சேர்க்கப்படும்.",
    lblHeadlineEn: "தலைப்பு (ஆங்கிலம்)",
    lblHeadlineSi: "தலைப்பு (சிங்களம்)",
    lblHeadlineTa: "தலைப்பு (தமிழ்)",
    lblHeadline: "தலைப்பு / விடயம்",
    lblArticleSummaryEn: "கட்டுரை சுருக்கம் (ஆங்கிலம்)",
    lblArticleSummarySi: "கட்டுரை சுருக்கம் (சிங்களம்)",
    lblArticleSummaryTa: "கட்டுரை சுருக்கம் (தமிழ்)",
    lblArticleSummary: "கட்டுரை சுருக்கம் / விளக்கம்",
    lblKeyword: "வகை / முக்கிய சொல்",
    lblPublishDate: "வெளியீட்டு தேதி",
    lblCoverImage: "அட்டைப் படம் அல்லது URL",
    btnUploadNewImage: "புதிய படத்தைப் பதிவேற்றுக",
    btnPublishArticleDirect: "கட்டுரையை நேரடியாக வெளியிடுக",
    btnPublishArticleDirectEditing: "மாற்றங்களைச் சேமிக்கவும்",
    btnAddProject: "புதிய திட்டத்தைச் சேர்க்க",
    projHeaderTitle: "முக்கிய மாகாண திட்டங்கள்",
    projHeaderSub: "முகப்புப் பக்கத்தில் சிறப்பிக்கப்படும் பிராந்திய அபிவிருத்தி முயற்சிகள்",
    lblProjectImage: "சிறப்பு படம் / அட்டைப் படம்",
    dropzoneProjectImage: "அட்டைப் படத்தைத் தேர்ந்தெடுக்க கிளிக் செய்யவும் அல்லது இங்கே இழுத்துப் போடவும்",
    dropzoneProjectImageSub: "JPG, PNG, WEBP (அதிகபட்சம் 15MB)",
    lblContentLang: "உள்ளடக்க மொழி:",
    optTypeCircular: "சுற்றறிக்கை",
    optTypePublication: "வெளியீடு / விகிதப் புத்தகம்",
    optTypeApplication: "விண்ணப்பம் / படிவம்",
    optTypeReport: "அறிக்கை / வர்த்தமானி",
    optTypeNotice: "அறிவிப்பு",
    brandTitle: "வடமேல் போர்டல்",
    brandSub: "பிரதம செயலகம்",
    councilCentralSec: "சபை மத்திய செயலகம்",
    councilTitle: "வடமேல் மாகாண சபை",
    councilSub: "வடமேல் மாகாணம்",
    navPublishNew: "புதிய வழிகாட்டல் வெளியீடு",
    navProfileSec: "எனது சுயவிவரம் & பாதுகாப்பு",
    btnSignOut: "வெளியேறு",
    btnCreateDivision: "புதிய பிரிவு / துணைப் பிரிவைச் சேர்க்க",
    modalDivTitle: "புதிய செயலகப் பிரிவு அல்லது துணைப் பிரிவை உருவாக்குங்கள்",
    modalDivInfoNotice: "நேரலை கட்டமைப்பு: இங்கே உருவாக்கப்படும் பிரிவுகள் மற்றும் துணை அலகுகள் உடனடியாக பொது வலைத்தளம், ஆவண வடிகட்டிகள் மற்றும் அதிகாரி பதிவுகளில் தோன்றும்.",
    tabMainDivision: "🏛️ 1. முதன்மைப் பிரிவு",
    tabSubDivision: "📂 2. துணைப் பிரிவு / அலகு",
    lblInitialSubUnits: "துணைப் பிரிவுகள் / அலகுகள் (விருப்பத்தேர்வு, காற்புள்ளியால் பிரிக்கவும்)",
    hintInitialSubUnits: "எ.கா: திட்டமிடல் அலகு, தணிக்கை அலகு. பின்னர் எப்போது வேண்டுமானாலும் சேர்க்கலாம்.",
    lblParentMainDiv: "முதன்மைப் பிரிவு *",
    btnCreateMainDiv: "முதன்மைப் பிரிவை உருவாக்கவும்",
    btnCreateSubDiv: "துணைப் பிரிவைச் சேர்க்கவும்",
    navOverview: "கண்ணோட்டம்",
    navDocuments: "ஆவணங்கள்",
    navDivisions: "பிரிவுகள்",
    navInquiries: "விசாரணைகள்",
    navAlerts: "விழிப்பூட்டல்கள்",
    navEServices: "பிரிவு வலை இணையங்கள்",
    navDivisionPortals: "பிரிவு வலை இணையங்கள்",
    divPortalsHeaderTitle: "பிரிவு வலை இணையங்கள் மற்றும் இணைப்புகள்",
    divPortalsHeaderSub: "சட்டப்பூர்வ பிரிவுகள் மற்றும் துணை அலகுகளுக்கான அதிகாரப்பூர்வ வலை இணைப்புகளை நிர்வகிக்கவும்",
    btnSetPortalLink: "வலை முகவரியை அமைக்க",
    thDivision: "பிரிவு",
    thPortalScope: "இலக்கு துணை அலகு",
    thPortalUrl: "வலை முகவரி (URL)",
    navProjects: "திட்டங்கள்",
    navUsers: "பயனர்கள்",
    navSiteTexts: "தள உரைகள்",
    livePublicPortal: "நேரடி பொது தளம்",
    livePublicPortalSub: "குடிமக்கள் இணையதளத்தில் மாற்றங்களை நேரலையில் மதிப்பாய்வு செய்க",
    launchSite: "தளத்தைத் தொடங்கு",
    searchPlaceholder: "தேடுக...",
    searchCircularsPlaceholder: "சுற்றறிக்கைகளைத் தேடுக...",
    metricDocs: "சுற்றறிக்கைகள் & விகிதப் புத்தகங்கள்",
    metricDivisions: "செயலகப் பிரிவுகள்",
    metricInquiries: "பெறப்பட்ட குடிமக்கள் விசாரணைகள்",
    metricSystems: "ஆன்லைன் அமைப்புகள் & BoQ",
    metricAnnouncements: "நேரலை அறிவிப்புகள்",
    metricAnnouncementsSub: "பொது ஒளிபரப்புகள் மற்றும் அவசர அறிவிப்புகள்",
    annSmartTitle: "தானியங்கி மொழிபெயர்ப்பு (Smart 1-Language Input)",
    annSmartSub: "ஏதேனும் ஒரு மொழியில் அறிவிப்பை உள்ளிடவும். இணையதளத்தில் மற்ற மொழிகளுக்கு இது தானாக மொழிபெயர்க்கப்படும்!",
    btnAutoTranslateAll: "அனைத்து மொழிகளுக்கும் மொழிபெயர்க்கவும்",
    btnBroadcast: "ஒளிபரப்பு",
    btnManage: "நிர்வகி",
    btnReview: "மதிப்பாய்வு",
    btnExplore: "ஆராய்க",
    metricDocsSub: "அதிகாரப்பூர்வ சுற்றறிக்கைகள் மற்றும் விகிதப் புத்தகங்கள்",
    metricInquiriesSub: "பொது விசாரணைகள் மற்றும் மனுக்கள்",
    metricDivisionsSub: "மாகாண சட்டரீதியான பிரிவுகள்",
    officerDocsSub: "உங்கள் கணக்கினால் வெளியிடப்பட்ட உத்தரவுகள்",
    officerProjectsSub: "மாகாண திட்டங்களில் நேரலை கட்டுரைகள்",
    officerAnnouncementsSub: "நேரலை அறிவிப்புப் பட்டை மற்றும் அவசர அறிவிப்புகள்",
    chartDivTitle: "பிரிவு வாரியாக சுற்றறிக்கைகள்",
    chartDivSub: "செயலகங்கள் முழுவதும் ஆவண வெளியீட்டு அளவு",
    liveCountBadge: "நேரலை எண்ணிக்கை",
    govMilestones: "ஆளுகை மைல்கற்கள்",
    govMilestonesSub: "மாகாண சபை இணக்க நிலை",
    milestone1: "2027 வருடாந்திர இடமாற்றங்கள் வெளியிடப்பட்டன",
    milestone1Sub: "அபிவிருத்தி உத்தியோகத்தர்கள் & MSO பட்டியல்கள் ஆன்லைனில்",
    milestone2: "தகவல் அறியும் உரிமை (RTI)",
    milestone2Sub: "தகவல் அதிகாரிகள் நியமிக்கப்பட்டு வெளியிடப்பட்டனர்",
    milestone3: "பொறியியல் விலை புத்தகங்கள் 2026",
    milestone3Sub: "குருணாகல் & புத்தளம் 2ஆம் அரையாண்டு விலைகள்",
    milestone4: "BoQ ஆன்லைன் ஒருங்கிணைப்பு",
    milestone4Sub: "பொது இணையதள இணைப்பு மற்றும் கையேடு",
    chartSplineTitle: "குடிமக்கள் விசாரணைகள் மற்றும் கட்டளைகள் இயக்கம்",
    chartSplineSub: "பொது விசாரணைகள் vs தீர்க்கப்பட்ட நேரடி கோரிக்கைகள்",
    yearBadge: "ஆண்டு 2026",
    recentInquiriesTitle: "சமீபத்திய விசாரணைகள்",
    recentInquiriesSub: "இணையதளத்திலிருந்து சமீபத்திய செய்திகள்",
    btnViewAll: "அனைத்தையும் காண்க",
    optAllDivisions: "அனைத்து பிரிவுகளும்",
    optAllTypes: "அனைத்து வகைகளும்",
    optCircular: "சுற்றறிக்கை",
    optPublication: "வெளியீடு / விகிதப் புத்தகம்",
    optApplication: "விண்ணப்பம் / படிவம்",
    optReport: "அறிக்கை / வர்த்தமானி",
    btnAddDoc: "புதிய ஆவணம் சேர்க்க",
    thDocTitle: "தலைப்பு & விடயம்",
    thDocDivision: "பிரிவு",
    thDocType: "வகை",
    thDocFiles: "கோப்புகள்",
    thDocSize: "அளவு",
    thDocFeatured: "சிறப்பு",
    thAction: "செயல்",
    thInqDate: "தேதி",
    thInqName: "குடிமகன் பெயர்",
    thInqNic: "அடையாள அட்டை எண்",
    thInqContact: "தொலைபேசி / மின்னஞ்சல்",
    thInqMessage: "விசாரணை செய்தி",
    thSysTitle: "அமைப்பு தலைப்பு",
    thSysCategory: "வகை",
    thSysDesc: "விளக்கம்",
    thSysUrl: "இணைய முகவரி",
    thUserUsername: "பயனர் பெயர்",
    thUserFullname: "முழுப் பெயர்",
    thUserRole: "பாத்திரம்",
    thUserDiv: "பிரிவு அணுகல்",
    thUserStatus: "நிலை",
    btnAddOfficer: "முக்கிய அதிகாரியைச் சேர்க்க",
    btnAddSystem: "அமைப்பைச் சேர்க்க",
    btnCreateUser: "பயனரை உருவாக்குக",
    btnSaveAnnouncements: "அறிவிப்புகளைச் சேமிக்கவும்",
    btnSaveSiteTexts: "தள மாற்றங்களைச் சேமிக்கவும்",
    heroTextSectionTitle: "முகப்பு தேடல் தலைப்புப் பகுதி (Hero Banner)",
    lblHeroBadge: "அடையாள உரை (Badge Pill Text)",
    lblHeroTitle: "பிரதான தேடல் தலைப்பு (Main Search Title)",
    lblHeroSubtitle: "துணைத் தலைப்பு விளக்கம்",
    divisionsHeaderTitle: "செயலகப் பிரிவுகள் & முக்கிய அதிகாரிகள்",
    divisionsHeaderSub: "பிரதி பிரதான செயலாளர்கள், துணைப் பிரிவுகள் மற்றும் விளக்கங்களை நிர்வகிக்கவும்",
    inquiriesHeaderTitle: "குடிமக்கள் விசாரணைகள் மேசை",
    inquiriesHeaderSub: "தேசிய அடையாள அட்டையுடன் சமர்ப்பிக்கப்பட்ட கோரிக்கைகள்",
    announcementsHeaderTitle: "நேரலை அறிவிப்புகள் பட்டை",
    announcementsHeaderSub: "இந்த உரை பொது இணையதளத்தின் மேல் பட்டையில் 3 மொழிகளில் நேரலையில் நகரும்.",
        superRecentDocsTitle: "மாகாண சபை உத்தியோகபூர்வ வழிகாட்டல்கள் & வெளியீடுகள்",
    superRecentDocsSub: "அனைத்து செயலகப் பிரிவுகளாலும் வெளியிடப்பட்ட வழிகாட்டல்கள்",
    superRecentInqTitle: "உள்வரும் குடிமக்கள் விசாரணைகள்",
    superRecentInqSub: "பொது இணையதளம் மூலம் சமர்ப்பிக்கப்பட்ட கோரிக்கைகள்",
    btnPublish: "வெளியிடுக",
    btnReviewAll: "மதிப்பாய்வு",
    btnViewAllDocs: "அனைத்து வழிகாட்டல்களையும் பார்க்க ➔",
    btnViewAllInquiries: "விசாரணைப் பதிவேட்டைத் திறக்குக ➔",
    lblCurrentPassword: "தற்போதைய கடவுச்சொல் (Current Password)",
    lblNewPassword: "புதிய கடவுச்சொல் (New Password)",
    lblConfirmPassword: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
eservicesHeaderTitle: "மின்-சேவைகள் & ஆன்லைன் அமைப்புகள்",
    eservicesHeaderSub: "BoQ, மாகாண கருவூலம், GIS மற்றும் பணியாளர் தள இணைப்புகளை நிர்வகிக்கவும்",
    projectsHeaderTitle: "முக்கிய மாகாண திட்டங்கள்",
    projectsHeaderSub: "முகப்புப் பக்கத்தில் இடம்பெற்றுள்ள பிராந்திய வளர்ச்சி முயற்சிகள்",
    usersHeaderTitle: "நிர்வாகி பயனர் கணக்குகள்",
    usersHeaderSub: "உள்நுழைவு சான்றுகள், பாத்திரங்கள் மற்றும் பிரிவு அணுகலை நிர்வகிக்கவும்",
    textsHeaderTitle: "தள உரைகள் & ஆளுகை மதிப்புகள்",
    textsHeaderSub: "தொலைநோக்கு, செயல்நோக்கம், குடிமக்கள் பிரகடனம் மற்றும் தலைப்பு/அடிக்குறிப்பு உரைகளைத் திருத்தவும்",
        tabDirectives: "கருப்பொருள் வழிகாட்டல்கள்",
    tabInProgress: "செயல்பாட்டில் உள்ளது",
    tabArchived: "காப்பகப்படுத்தப்பட்ட வழிகாட்டல்கள்",
    folderDirectiveName: "வழிகாட்டல் பெயர்",
    folderSearchPlaceholder: "தேட ஒரு முக்கிய சொல்லை உள்ளிடவும்",
    folderDivision: "பிரிவு",
    folderChooseDivision: "அனைத்துப் பிரிவுகளும் / தேர்வு",
    btnSearch: "தேடுக",
    btnRelease: "+ வெளியிடுக",
    btnLaunch: "ஒளிபரப்பு",
    btnRevise: "திருத்துக",
    btnView: "பார்க்க",
    btnAction: "செயல்",
    lblCircularNo: "சுற்றறிக்கை எண்:",
    lblPublished: "வெளியிடப்பட்டது",
    authorized: "அங்கீகரிக்கப்பட்டது",
    officerDocsTitle: "எனது ஆவணங்கள் மற்றும் சுற்றறிக்கைகள்",
    officerProjectsTitle: "எனது திட்டங்கள் & கட்டுரைகள்",
    officerAuthorityTitle: "ஒதுக்கப்பட்ட அதிகாரப் பிரிவு",
    modalPwdTitle: "கணக்கு கடவுச்சொல்லை மாற்றவும்",
    modalForgotTitle: "கடவுச்சொல் மீட்பு (Forgot Password)",
    btnCreateProject: "+ புதிய திட்டம் / கட்டுரை சேர்க்க",
    thDocStatus: "நிலை",
views: {
      'view-overview': ['கண்ணோட்டம்', 'மத்திய செயல்பாடுகள் மற்றும் நிர்வாக அளவீடுகள்'],
      'view-documents': ['ஆவணப் பதிவேடு', 'அதிகாரப்பூர்வ சுற்றறிக்கைகள், விகித புத்தகங்கள் மற்றும் வர்த்தமானிகள்'],
      'view-divisions': ['பிரிவுகள் & அதிகாரிகள்', 'அமைப்பு, பிரதி செயலாளர்கள் மற்றும் சுயவிவரங்கள்'],
      'view-inquiries': ['குடிமக்கள் விசாரணைகள்', 'அடையாள அட்டை விவரங்களுடன் உள்வரும் கோரிக்கைகள்'],
      'view-announcements': ['நேரலை அறிவிப்புகள்', 'மேல் அறிவிப்புப் பட்டை ஒளிபரப்பு மேலாண்மை'],
      'view-eservices': ['பிரிவு வலை இணையங்கள்', 'சட்டப்பூர்வ பிரிவுகள் மற்றும் துணை அலகுகளுக்கான வலை இணைப்புகள்'],
      'view-projects': ['மாகாண திட்டங்கள்', 'சிறப்பு பிராந்திய அபிவிருத்தி முயற்சிகள்'],
      'view-users': ['நிர்வாகி பயனர்கள்', 'அணுகல் அனுமதிகள், பாத்திரங்கள் மற்றும் பிரிவு ஒதுக்கீடுகள்'],
      'view-texts': ['தள உரைகள் & மதிப்புகள்', 'தொலைநோக்கு, செயல்நோக்கம் மற்றும் மும்மொழி உரைகள்'],
      'view-profile': ['அதிகாரி சுயவிவரம் மற்றும் பாதுகாப்பு', 'சுயவிவரம், தொடர்பு மற்றும் கடவுச்சொல் மேலாண்மை']
    }
  }
};




// =========================================================================
// Form & Modal Multilingual Hints / Placeholders and Labels
// =========================================================================
Object.assign(adminTranslations.en, {
  phDocTitleEn: "e.g. Kurunegala Rate Book 2026...",
  phDocTitleSi: "e.g. Kurunegala Rate Book (Sinhala)...",
  phDocTitleTa: "e.g. Kurunegala Rate Book (Tamil)...",
  phDocSize: "e.g. 2.4 MB",
  phSelectDivision: "Select Division / Unit...",
  lblDocDirectPushText: "<strong>Direct Live Publishing:</strong> Saved documents are pushed directly to the citizen website without administrative pre-approval.",
  lblDocDirectPushActive: "🟢 Direct Push Active",
  lblDocTitleEn: "Document Title (English)",
  lblDocTitleSi: "Document Title (Sinhala - සිංහල)",
  lblDocTitleTa: "Document Title (Tamil - தமிழ்)",
  lblDivision: "Division / Unit",
  lblDocType: "Document Type",
  lblUploadFile: "Upload PDF / Document File",
  lblDropzonePrompt: "Click to browse or drop file here",
  lblDropzoneSub: "PDF, DOC, DOCX, XLS (Max 50MB)",
  lblDocSize: "Document Size",
  lblPinFeatured: "Pin to Featured",
  btnSaveDoc: "Save Document",
  btnSaveDocEditing: "Save Changes",
  btnCancel: "Cancel",


  modalOfficerTitle: "Add Key Official",
  modalOfficerBannerText: "<strong>Live Official Directory:</strong> Key officials added appear immediately on public division profiles and staff rosters.",
  lblSecretariatDivision: "Secretariat Division",
  lblOfficerNameEn: "Full Name (English)",
  lblOfficerNameSi: "Name (Sinhala - සිංහල)",
  lblOfficerNameTa: "Name (Tamil - தமிழ்)",
  lblOfficerRoleEn: "Designation / Role (English)",
  lblOfficerRoleSi: "Designation (Sinhala - සිංහල)",
  lblOfficerRoleTa: "Designation (Tamil - தமிழ்)",
  lblOfficerPhone: "Official Phone Number",
  lblOfficerEmail: "Official Email Address",
  lblOfficerAssignedUnit: "Assigned Sub-Unit / Section",
  phOfficerNameEn: "e.g. H.M. Sisira Bandara",
  phOfficerNameSi: "e.g. H.M. Sisira Bandara (Sinhala)",
  phOfficerNameTa: "e.g. H.M. Sisira Bandara (Tamil)",
  phOfficerRoleEn: "e.g. Deputy Chief Secretary (Administration)",
  phOfficerRoleSi: "e.g. Deputy Chief Secretary (Sinhala)",
  phOfficerRoleTa: "e.g. Deputy Chief Secretary (Tamil)",
  phOfficerPhone: "e.g. 077 453 2864",
  phOfficerEmail: "e.g. dcsadmin@nw.gov.lk",
  btnSaveOfficer: "Save Official Profile",


  phSysTitle: "e.g. BoQ Online Engineering System",
  phSysDesc: "Brief description of the service...",
  phSysUrl: "https://cs.nw.gov.lk/...",
  phPortalTitle: "e.g. BoQ Online Engineering System",
  phPortalUrl: "https://cs.nw.gov.lk/boq/",
  lblSysTitle: "System Title",
  lblSysCategory: "Category",
  lblSysDesc: "Description",
  lblSysUrl: "URL",
  btnSaveSystem: "Save System",


  phUserUsername: "e.g. admin_legal",
  phUserFullname: "e.g. K.M. Bandara",
  phUserEmail: "e.g. legal@nw.gov.lk",
  phUserPhone: "e.g. 037 222 8901",
  phUserPassword: "Min. 6 characters",


  phProjectTitleEn: "e.g. Provincial Smart Governance Initiative...",
  phProjectDescEn: "Brief summary of the initiative...",
  phProjectKeyword: "e.g. BoQ, Infrastructure, Health",
  phInitialSubUnits: "e.g. Planning Unit, Clinical Affairs, Nutrition Unit",
  phMainDivNameEn: "e.g. Health & Indigenous Medicine Division",
  phMainDivHeadEn: "e.g. Deputy Chief Secretary (Health)",
  phMainDivDescEn: "Mandate, statutory scope, and responsibilities...",
  phSubDivNameEn: "e.g. Statistical Planning Unit",
  phSubDivDescEn: "Core mandate and responsibilities of this unit...",


  phProfileFullName: "Enter full name",
  phProfilePhone: "e.g. +94 77 123 4567",
  phProfileEmail: "e.g. officer@nw.gov.lk",
  phCurrentPassword: "Current password",
  phNewPassword: "Min. 6 characters",
  phConfirmPassword: "Re-enter new password"
});


Object.assign(adminTranslations.si, {
  phDocTitleEn: "උදා: Kurunegala Rate Book 2026...",
  phDocTitleSi: "උදා: කුරුණෑගල මිල ගණන් පොත 2026...",
  phDocTitleTa: "උදා: குருணாகல் விலைப்பட்டியல் 2026...",
  phDocSize: "උදා: 2.4 MB",
  phSelectDivision: "අංශය / ඒකකය තෝරන්න...",
  lblDocDirectPushText: "<strong>සජීවී සෘජු ප්‍රකාශනය:</strong> සුරකින ලද ලේඛන පූර්ව පරිපාලන අනුමැතියකින් තොරව සෘජුවම මහජන වෙබ් අඩවියට එකතු වේ.",
  lblDocDirectPushActive: "🟢 සජීවී සෘජු ප්‍රකාශනය ක්‍රියාත්මකයි",
  lblDocTitleEn: "ලේඛන මාතෘකාව (ඉංග්‍රීසි - English)",
  lblDocTitleSi: "ලේඛන මාතෘකාව (සිංහල)",
  lblDocTitleTa: "ලේඛන මාතෘකාව (දෙමළ - தமிழ்)",
  lblDivision: "අංශය / ඒකකය",
  lblDocType: "ලේඛන වර්ගය",
  lblUploadFile: "PDF / ලේඛන ගොනුව උඩුගත කරන්න",
  lblDropzonePrompt: "ගොනුව තේරීමට ක්ලික් කරන්න හෝ මෙතැනට ඇද දමන්න",
  lblDropzoneSub: "PDF, DOC, DOCX, XLS (උපරිම 50MB)",
  lblDocSize: "ලේඛන ප්‍රමාණය",
  lblPinFeatured: "විශේෂාංගයක් ලෙස සලකුණු කරන්න",
  btnSaveDoc: "ලේඛනය සුරකින්න",
  btnSaveDocEditing: "වෙනස්කම් සුරකින්න",
  btnCancel: "අවලංගු කරන්න",


  modalOfficerTitle: "ප්‍රධාන නිලධාරියෙකු එක් කරන්න",
  modalOfficerBannerText: "<strong>සජීවී නිල නාමාවලිය:</strong> මෙහි එක් කරන ප්‍රධාන නිලධාරීන් මහජන අංශ පැතිකඩ සහ කාර්ය මණ්ඩල නාමාවලිය වෙත සජීවීව එක් වේ.",
  lblSecretariatDivision: "ලේකම් කාර්යාල අංශය",
  lblOfficerNameEn: "සම්පූර්ණ නම (ඉංග්‍රීසි - English)",
  lblOfficerNameSi: "සම්පූර්ණ නම (සිංහල)",
  lblOfficerNameTa: "සම්පූර්ණ නම (දෙමළ - தமிழ்)",
  lblOfficerRoleEn: "තනතුර (ඉංග්‍රීසි - English)",
  lblOfficerRoleSi: "තනතුර (සිංහල)",
  lblOfficerRoleTa: "තනතුර (දෙමළ - தமிழ்)",
  lblOfficerPhone: "නිල දුරකථන අංකය",
  lblOfficerEmail: "නිල විද්‍යුත් තැපෑල",
  lblOfficerAssignedUnit: "අනුයුක්ත අනු අංශය / ඒකකය",
  phOfficerNameEn: "උදා: H.M. Sisira Bandara",
  phOfficerNameSi: "උදා: එච්.එම්. සිසිර බණ්ඩාර",
  phOfficerNameTa: "උදා: எச்.எம். சிசிர பண்டார",
  phOfficerRoleEn: "උදා: Deputy Chief Secretary (Administration)",
  phOfficerRoleSi: "උදා: නියෝජ්‍ය ප්‍රධාන ලේකම් (පරිපාලන)",
  phOfficerRoleTa: "උදා: பிரதி பிரதம செயலாளர் (நிர்வாகம்)",
  phOfficerPhone: "උදා: 077 453 2864",
  phOfficerEmail: "උදා: dcsadmin@nw.gov.lk",
  btnSaveOfficer: "නිලධාරී පැතිකඩ සුරකින්න",


  phSysTitle: "උදා: BoQ මාර්ගගත ඉංජිනේරු පද්ධතිය",
  phSysDesc: "සේවාව පිළිබඳ කෙටි විස්තරයක්...",
  phSysUrl: "https://cs.nw.gov.lk/...",
  phPortalTitle: "උදා: BoQ මාර්ගගත ඉංජිනේරු පද්ධතිය",
  phPortalUrl: "https://cs.nw.gov.lk/boq/",
  lblSysTitle: "පද්ධති නම",
  lblSysCategory: "ප්‍රවර්ගය",
  lblSysDesc: "විස්තරය",
  lblSysUrl: "වෙබ් සබැඳිය (URL)",
  btnSaveSystem: "පද්ධතිය සුරකින්න",


  phUserUsername: "උදා: admin_legal",
  phUserFullname: "උදා: කේ.එම්. බණ්ඩාර",
  phUserEmail: "උදා: legal@nw.gov.lk",
  phUserPhone: "උදා: 037 222 8901",
  phUserPassword: "අවම අක්ෂර 6ක්",


  phProjectTitleEn: "උදා: Provincial Smart Governance Initiative...",
  phProjectDescEn: "වැඩසටහන පිළිබඳ කෙටි සාරාංශයක්...",
  phProjectKeyword: "උදා: BoQ, යටිතල පහසුකම්, සෞඛ්‍ය",
  phInitialSubUnits: "උදා: සැලසුම් ඒකකය, සායනික කටයුතු, පෝෂණ ඒකකය",
  phMainDivNameEn: "උදා: සෞඛ්‍ය හා දේශීය වෛද්‍ය අංශය (English)",
  phMainDivHeadEn: "උදා: Deputy Chief Secretary (Health)",
  phMainDivDescEn: "අංශයේ වගකීම් සහ විෂය පථය පිළිබඳ විස්තරය...",
  phSubDivNameEn: "උදා: සංඛ්‍යාලේඛන සැලසුම් ඒකකය (English)",
  phSubDivDescEn: "මෙම ඒකකයේ ප්‍රධාන වගකීම් සහ කාර්යභාරය...",


  phProfileFullName: "සම්පූර්ණ නම ඇතුළත් කරන්න",
  phProfilePhone: "උදා: +94 77 123 4567",
  phProfileEmail: "උදා: officer@nw.gov.lk",
  phCurrentPassword: "වත්මන් මුරපදය",
  phNewPassword: "අවම අක්ෂර 6ක්",
  phConfirmPassword: "නව මුරපදය නැවත ඇතුළත් කරන්න"
});


Object.assign(adminTranslations.ta, {
  phDocTitleEn: "உதா: Kurunegala Rate Book 2026...",
  phDocTitleSi: "உதா: කුරුණෑගල මිල ගණන් පොත 2026...",
  phDocTitleTa: "உதா: குருணாகல் விலைப்பட்டியல் 2026...",
  phDocSize: "உதா: 2.4 MB",
  phSelectDivision: "பிரிவு / அலகைத் தேர்ந்தெடுக்கவும்...",
  lblDocDirectPushText: "<strong>நேரடி நேரலை வெளியீடு:</strong> சேமிக்கப்பட்ட ஆவணங்கள் நிர்வாக முன் அனுமதியின்றி நேரடியாக பொது இணையதளத்தில் வெளியிடப்படும்.",
  lblDocDirectPushActive: "🟢 நேரலை வெளியீடு இயங்குகிறது",
  lblDocTitleEn: "ஆவணத் தலைப்பு (ஆங்கிலம் - English)",
  lblDocTitleSi: "ஆவணத் தலைப்பு (சிங்களம் - සිංහල)",
  lblDocTitleTa: "ஆவணத் தலைப்பு (தமிழ்)",
  lblDivision: "பிரிவு / அலகு",
  lblDocType: "ஆவண வகை",
  lblUploadFile: "PDF / ஆவணக் கோப்பை பதிவேற்றுக",
  lblDropzonePrompt: "கோப்பை உலாவ அல்லது இங்கே விட கிளிக் செய்க",
  lblDropzoneSub: "PDF, DOC, DOCX, XLS (அதிகபட்சம் 50MB)",
  lblDocSize: "ஆவண அளவு",
  lblPinFeatured: "சிறப்பாகக் குறிக்கவும்",
  btnSaveDoc: "ஆவணத்தைச் சேமிக்குக",
  btnSaveDocEditing: "மாற்றங்களைச் சேமிக்கவும்",
  btnCancel: "இரத்து செய்க",


  modalOfficerTitle: "முக்கிய அதிகாரியைச் சேர்க்கவும்",
  modalOfficerBannerText: "<strong>நேரலை அதிகாரப்பூர்வ அடைவு:</strong> சேர்க்கப்படும் முக்கிய அதிகாரிகள் உடனடியாக பொது பிரிவு சுயவிவரங்கள் மற்றும் பணியாளர் பட்டியலில் தோன்றுவார்கள்.",
  lblSecretariatDivision: "செயலகப் பிரிவு",
  lblOfficerNameEn: "முழுப் பெயர் (ஆங்கிலம் - English)",
  lblOfficerNameSi: "முழுப் பெயர் (சிங்களம் - සිංහල)",
  lblOfficerNameTa: "முழுப் பெயர் (தமிழ்)",
  lblOfficerRoleEn: "பதவி (ஆங்கிலம் - English)",
  lblOfficerRoleSi: "பதவி (சிங்களம் - සිංහල)",
  lblOfficerRoleTa: "பதவி (தமிழ்)",
  lblOfficerPhone: "அலுவலக தொலைபேசி எண்",
  lblOfficerEmail: "அலுவலக மின்னஞ்சல் முகவரி",
  lblOfficerAssignedUnit: "ஒதுக்கப்பட்ட துணைப் பிரிவு / அலகு",
  phOfficerNameEn: "எ.கா: H.M. Sisira Bandara",
  phOfficerNameSi: "எ.கா: එච්.එම්. සිසිර බණ්ඩාර",
  phOfficerNameTa: "எ.கா: எச்.எம். சிசிர பண்டார",
  phOfficerRoleEn: "எ.கா: Deputy Chief Secretary (Administration)",
  phOfficerRoleSi: "எ.கா: නියෝජ්‍ය ප්‍රධාන ලේකම් (පරිපාලන)",
  phOfficerRoleTa: "எ.கா: பிரதி பிரதம செயலாளர் (நிர்வாகம்)",
  phOfficerPhone: "எ.கா: 077 453 2864",
  phOfficerEmail: "எ.கா: dcsadmin@nw.gov.lk",
  btnSaveOfficer: "அதிகாரி சுயவிவரத்தைச் சேமிக்கவும்",


  phSysTitle: "எ.கா: BoQ இணையவழி பொறியியல் அமைப்பு",
  phSysDesc: "சேவை பற்றிய சுருக்கமான விளக்கம்...",
  phSysUrl: "https://cs.nw.gov.lk/...",
  phPortalTitle: "எ.கா: BoQ இணையவழி பொறியியல் அமைப்பு",
  phPortalUrl: "https://cs.nw.gov.lk/boq/",
  lblSysTitle: "அமைப்பு தலைப்பு",
  lblSysCategory: "வகை",
  lblSysDesc: "விளக்கம்",
  lblSysUrl: "இணைப்பு (URL)",
  btnSaveSystem: "அமைப்பைச் சேமிக்கவும்",


  phUserUsername: "எ.கா: admin_legal",
  phUserFullname: "எ.கா: கே.எம். பண்டார",
  phUserEmail: "எ.கா: legal@nw.gov.lk",
  phUserPhone: "எ.கா: 037 222 8901",
  phUserPassword: "குறைந்தது 6 எழுத்துக்கள்",


  phProjectTitleEn: "எ.கா: Provincial Smart Governance Initiative...",
  phProjectDescEn: "திட்டம் பற்றிய சுருக்கமான விளக்கம்...",
  phProjectKeyword: "எ.கா: BoQ, உள்கட்டமைப்பு, சுகாதாரம்",
  phInitialSubUnits: "எ.கா: திட்டமிடல் பிரிவு, மருத்துவ விவகாரங்கள், ஊட்டச்சத்து பிரிவு",
  phMainDivNameEn: "எ.கா: Health & Indigenous Medicine Division",
  phMainDivHeadEn: "எ.கா: Deputy Chief Secretary (Health)",
  phMainDivDescEn: "பிரிவின் நோக்கம் மற்றும் பொறுப்புகள்...",
  phSubDivNameEn: "எ.கா: Statistical Planning Unit",
  phSubDivDescEn: "இந்த பிரிவின் முக்கிய பொறுப்புகள்...",


  phProfileFullName: "முழுப் பெயரை உள்ளிடவும்",
  phProfilePhone: "எ.கா: +94 77 123 4567",
  phProfileEmail: "எ.கா: officer@nw.gov.lk",
  phCurrentPassword: "தற்போதைய கடவுச்சொல்",
  phNewPassword: "குறைந்தது 6 எழுத்துக்கள்",
  phConfirmPassword: "புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடவும்"
});


function initDashboardLanguage() {
  const saved = localStorage.getItem('preferred_lang') || localStorage.getItem('admin_lang') || 'en';
  setDashboardLanguage(saved, false);
}


function setDashboardLanguage(lang, showNotification = true) {
  if (!['en', 'si', 'ta'].includes(lang)) lang = 'en';
  currentDashboardLang = lang;
  localStorage.setItem('admin_lang', lang);
  localStorage.setItem('preferred_lang', lang);


  // Update body classes for language-specific fonts
  if (document.body) {
    document.body.classList.remove('lang-en', 'lang-si', 'lang-ta');
    document.body.classList.add(`lang-${lang}`);
  }


  // Update topbar buttons
  document.querySelectorAll('.lang-pill-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-admin-lang-${lang}`);
  if (activeBtn) activeBtn.classList.add('active');


  // Update auth overlay & modal lang switcher pills
  document.querySelectorAll('.auth-lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll(`.auth-lang-btn[data-lang="${lang}"]`).forEach(btn => btn.classList.add('active'));


  // Update mobile select
  const mobSelect = document.getElementById('mobile-lang-select');
  if (mobSelect) mobSelect.value = lang;


  const langNames = { en: 'English', si: 'සිංහල', ta: 'தமிழ்' };
  const activeLangEl = document.getElementById('topbar-active-lang-text');
  if (activeLangEl) activeLangEl.textContent = langNames[lang] || 'English';


  // Apply translations to all data-i18n-admin elements
  const dict = adminTranslations[lang] || adminTranslations['en'];
  document.querySelectorAll('[data-i18n-admin]').forEach(el => {
    const key = el.getAttribute('data-i18n-admin');
    if (dict[key]) {
      if (dict[key].includes('<')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });


  // Apply placeholder translations to all data-i18n-admin-ph elements
  document.querySelectorAll('[data-i18n-admin-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-admin-ph');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });


  updateDocTypeOptions(lang);


  // Update placeholders
  const searchInput = document.getElementById('global-search-input');
  if (searchInput && dict.searchPlaceholder) {
    searchInput.placeholder = dict.searchPlaceholder;
  }
  const circInput = document.getElementById('search-circulars-input');
  if (circInput && dict.searchCircularsPlaceholder) {
    circInput.placeholder = dict.searchCircularsPlaceholder;
  }
  const forgotIdInput = document.getElementById('modal-forgot-identifier');
  if (forgotIdInput) {
    forgotIdInput.placeholder = lang === 'si' ? 'උදා: test@gmail.com හෝ admin' : (lang === 'ta' ? 'உதா: test@gmail.com அல்லது admin' : 'e.g. test@gmail.com or admin');
  }
  const forgotNewPwd = document.getElementById('modal-forgot-new-pwd');
  if (forgotNewPwd) {
    forgotNewPwd.placeholder = lang === 'si' ? 'අවම අක්ෂර 6ක්' : (lang === 'ta' ? 'குறைந்தது 6 எழுத்துக்கள்' : 'Min. 6 characters');
  }
  const forgotConfirmPwd = document.getElementById('modal-forgot-confirm-pwd');
  if (forgotConfirmPwd) {
    forgotConfirmPwd.placeholder = lang === 'si' ? 'මුරපදය නැවත ඇතුළත් කරන්න' : (lang === 'ta' ? 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்' : 'Re-type password');
  }
  const loginUser = document.getElementById('login-username');
  if (loginUser) {
    loginUser.placeholder = lang === 'si' ? 'පරිශීලක නාමය ඇතුළත් කරන්න' : (lang === 'ta' ? 'பயனர் பெயரை உள்ளிடவும்' : 'Enter username');
  }
  const loginPwd = document.getElementById('login-password');
  if (loginPwd) {
    loginPwd.placeholder = lang === 'si' ? 'මුරපදය ඇතුළත් කරන්න' : (lang === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Enter password');
  }
  const portalsSearch = document.getElementById('search-portals-input');
  if (portalsSearch) {
    portalsSearch.placeholder = lang === 'si' ? 'අංශය, අනු ඒකකය හෝ URL සොයන්න...' : (lang === 'ta' ? 'பிரிவு, துணை அலகு அல்லது URL ஐத் தேடுக...' : 'Search division, sub-unit, or URL...');
  }
  renderPortalsCategoryPills();
  populatePortalDivisionSelect();


  // Update active view title & subtitle
  const activeView = document.querySelector('.content-view.active');
  const viewId = activeView ? activeView.id : 'view-overview';
  const titleEl = document.getElementById('top-view-title');
  const subEl = document.getElementById('top-view-sub');
  if (viewId === 'view-overview') {
    const welcomeWord = lang === 'si' ? 'ආයුබෝවන්' : (lang === 'ta' ? 'வணக்கம்' : 'Welcome');
    const fullName = currentUser ? (currentUser.full_name || currentUser.username) : 'Chief Secretary';
    const roleText = currentUser ? (currentUser.role || 'Super Administrator') : 'Super Administrator';
    if (titleEl) titleEl.innerHTML = `${welcomeWord}, <span id="top-user-greeting">${escapeHtml(fullName)}</span> 👋`;
    if (subEl) subEl.textContent = dict.councilCentralSec || 'Council Central Secretariat';
  } else if (dict.views && dict.views[viewId] && titleEl && subEl) {
    titleEl.innerHTML = dict.views[viewId][0];
    subEl.textContent = dict.views[viewId][1];
  }


  // Update filter-doc-type options with translations
  const docTypeFilter = document.getElementById('filter-doc-type');
  if (docTypeFilter) {
    const curVal = docTypeFilter.value;
    docTypeFilter.innerHTML = `
      <option value="">${dict.optAllTypes || 'All Types'}</option>
      <option value="Circular">${dict.optCircular || 'Circular'}</option>
      <option value="Publication">${dict.optPublication || 'Publication / Rate Book'}</option>
      <option value="Application">${dict.optApplication || 'Application / Form'}</option>
      <option value="Report">${dict.optReport || 'Report / Gazette'}</option>
    `;
    docTypeFilter.value = curVal;
  }






  // Populate division dropdowns in selected language
  populateDocDivisionDropdown();


  // Update date format
  updateLiveDateLang(lang);


  // Redraw charts with translated division labels if on overview
  if (activeView && activeView.id === 'view-overview') {
    drawDivisionsBarChart();
    drawDirectivesPieChart();
  }
  renderSuperAdminOverviewLists();
  populateUserOverviewHub();


  // Re-render views if database is loaded to show language-specific content
  if (db && Object.keys(db.divisionsData || {}).length > 0) {
    renderAdminDocuments();
    renderAdminDivisions();
    renderAdminSystems();
  renderAdminPortals();
    renderAdminProjects();
  }


  // Synchronize modal language displays with active dashboard language
  syncModalLangWithDashboard(lang);


  // Synchronize profile card (category / unit & greeting) with active dashboard language
  updateProfileCard();
  updateMetricCounters();


  // Synchronize overview folder toolbar, dropdowns, and items
  const folderSearchInput = document.getElementById('folder-search-input');
  if (folderSearchInput) {
    folderSearchInput.placeholder = dict.folderSearchPlaceholder || (lang === 'si' ? 'සෙවීමට වචනයක් ඇතුළත් කරන්න' : (lang === 'ta' ? 'தேட ஒரு முக்கிய சொல்லை உள்ளிடவும்' : 'Enter a keyword to search'));
  }
  populateFolderDivisionSelect(lang);
  renderOverviewDirectives();
  enforceRoleRestrictions();






  if (showNotification) {
    const toastMsgs = {
      en: "Dashboard language set to English",
      si: "පාලක පුවරුවේ භාෂාව සිංහලට මාරු කරන ලදී",
      ta: "நிர்வாக பலக மொழி தமிழுக்கு மாற்றப்பட்டது"
    };
    showToast(toastMsgs[lang] || "Language changed");
  }
}


function updateLiveDateLang(lang) {
  const dateEl = document.getElementById('current-date-text');
  if (!dateEl) return;
  const now = new Date();
  const localeMap = { en: 'en-US', si: 'si-LK', ta: 'ta-LK' };
  try {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString(localeMap[lang] || 'en-US', options);
  } catch (e) {
    dateEl.textContent = now.toDateString();
  }
}


// DOM Elements
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const loginErrorMsg = document.getElementById('login-error-msg');
const toastEl = document.getElementById('admin-toast');
const toastText = document.getElementById('toast-text');




// Modal Language Synchronization Engine (automatically matches dashboard language)
let divisionModalLang = null;


function setDocModalLang(lang) {
  syncModalLangWithDashboard(lang || currentDashboardLang);
}


function setProjectModalLang(lang) {
  syncModalLangWithDashboard(lang || currentDashboardLang);
}


function setDivisionModalLang(lang) {
  divisionModalLang = lang;
  syncModalLangWithDashboard(lang || currentDashboardLang);
}


function updateDocTypeOptions(lang) {
  const docTypeSelect = document.getElementById('doc-type');
  if (!docTypeSelect) return;
  const curVal = docTypeSelect.value || 'Circular';
  const dict = adminTranslations[lang] || adminTranslations['en'];


  docTypeSelect.innerHTML = `
    <option value="Circular">${dict.optTypeCircular || dict.typeCircular || 'Circular'}</option>
    <option value="Publication">${dict.optTypePublication || dict.typePublication || 'Publication / Rate Book'}</option>
    <option value="Application">${dict.optTypeApplication || dict.typeApplication || 'Application / Form'}</option>
    <option value="Report">${dict.optTypeReport || dict.typeReport || 'Report / Gazette'}</option>
    <option value="Notice">${dict.optTypeNotice || dict.typeOther || 'Notice'}</option>
  `;
  docTypeSelect.value = curVal;
}


function updateModalTranslations(lang) {
  syncModalLangWithDashboard(lang);
}


function syncModalLangWithDashboard(lang) {
  const activeLang = (lang && ['en', 'si', 'ta'].includes(lang)) ? lang : (currentDashboardLang || 'en');


  // Toggle language panel inputs (only the panel matching active dashboard language is shown)
  ['si', 'en', 'ta'].forEach(l => {
    const docP = document.getElementById(`doc-lang-panel-${l}`);
    if (docP) docP.style.display = (l === activeLang) ? 'block' : 'none';
    const projP = document.getElementById(`proj-lang-panel-${l}`);
    if (projP) projP.style.display = (l === activeLang) ? 'block' : 'none';
    const divMainP = document.getElementById(`main-div-lang-panel-${l}`);
    if (divMainP) divMainP.style.display = (l === activeLang) ? 'block' : 'none';
    const divSubP = document.getElementById(`sub-div-lang-panel-${l}`);
    if (divSubP) divSubP.style.display = (l === activeLang) ? 'block' : 'none';
  });


  // Highlight active modal language pills (projects and divisions)
  document.querySelectorAll('.proj-modal-lang-btn, .div-modal-lang-btn').forEach(btn => {
    const bLang = btn.getAttribute('data-lang');
    if (bLang === activeLang) {
      btn.style.background = '#380000';
      btn.style.color = '#fff';
      btn.style.borderColor = '#380000';
    } else {
      btn.style.background = '#fff';
      btn.style.color = '#555';
      btn.style.borderColor = 'transparent';
    }
  });


  // Re-translate all modal & page elements matching [data-i18n-admin] and [data-i18n-admin-ph]
  const dict = adminTranslations[activeLang] || adminTranslations['en'];
  document.querySelectorAll('[data-i18n-admin]').forEach(el => {
    const k = el.getAttribute('data-i18n-admin');
    if (dict[k]) {
      if (dict[k].includes('<')) {
        el.innerHTML = dict[k];
      } else {
        el.textContent = dict[k];
      }
    }
  });


  document.querySelectorAll('[data-i18n-admin-ph]').forEach(el => {
    const k = el.getAttribute('data-i18n-admin-ph');
    if (dict[k]) el.placeholder = dict[k];
  });


  updateDocTypeOptions(activeLang);


  // Dynamic titles and buttons
  const docId = document.getElementById('doc-id')?.value;
  const docTitleEl = document.getElementById('modal-doc-title');
  if (docTitleEl) {
    docTitleEl.textContent = docId ? (dict.modalDocTitleEdit || 'Edit Official Document') : (dict.modalDocTitleAdd || 'Publish New Document');
  }
  const docSaveBtn = document.getElementById('btn-save-doc');
  if (docSaveBtn) {
    docSaveBtn.innerHTML = `<span>💾</span> <span>${docId ? (dict.btnSaveDocEditing || 'Save Changes') : (dict.btnSaveDoc || 'Save Document')}</span>`;
  }


  const projId = document.getElementById('project-id')?.value;
  const projTitleEl = document.getElementById('modal-project-title');
  if (projTitleEl) {
    projTitleEl.textContent = projId ? (dict.modalProjTitleEdit || 'Edit News Article / Project') : (dict.modalProjTitleAdd || 'Publish News Article / Project');
  }
  const projSaveBtn = document.getElementById('btn-save-project');
  if (projSaveBtn) {
    projSaveBtn.innerHTML = `<span>💾</span> <span>${projId ? (dict.btnPublishArticleDirectEditing || 'Save Article Changes') : (dict.btnPublishArticleDirect || 'Publish Article Directly')}</span>`;
  }


  // Division manage modal dynamic tabs and button text
  const divManageType = document.getElementById('div-manage-type')?.value || 'main';
  const saveDivBtn = document.getElementById('btn-save-div-manage');
  if (saveDivBtn) {
    saveDivBtn.disabled = false;
    const btnLabel = (divManageType === 'main') 
      ? (dict.btnCreateMainDiv || (activeLang === 'si' ? 'ප්‍රධාන අංශය සාදන්න' : (activeLang === 'ta' ? 'முதன்மைப் பிரிவை உருவாக்கவும்' : 'Create Main Division')))
      : (dict.btnCreateSubDiv || (activeLang === 'si' ? 'අනු අංශය එක් කරන්න' : (activeLang === 'ta' ? 'துணைப் பிரிவைச் சேர்க்கவும்' : 'Create Sub-Division')));
    saveDivBtn.innerHTML = `<span>💾</span> <span id="btn-save-div-manage-text">${escapeHtml(btnLabel)}</span>`;
  }


  const tabMainSpan = document.querySelector('#btn-type-main-div [data-i18n-admin="tabMainDivision"]');
  if (tabMainSpan) tabMainSpan.textContent = dict.tabMainDivision || '🏛️ 1. Main Division';


  const tabSubSpan = document.querySelector('#btn-type-sub-div [data-i18n-admin="tabSubDivision"]');
  if (tabSubSpan) tabSubSpan.textContent = dict.tabSubDivision || '📂 2. Sub-Division / Unit';
}


// 1. Initialization
document.addEventListener('DOMContentLoaded', () => {
  initDashboardLanguage();
  initLiveDate();
  populateRegisterUnitsDropdown();
  checkAuthenticationState();


  // Responsive chart redraw on full-screen / window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const overview = document.getElementById('view-overview');
      if (overview && overview.classList.contains('active')) {
        drawDivisionsBarChart();
        drawDirectivesPieChart();
        drawSplineLineChart();
      }
    }, 120);
  });
});


function initLiveDate() {
  const dateEl = document.getElementById('current-date-text');
  if (dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);
  }
}


// 2. Authentication Handling
function checkAuthenticationState() {
  const isAuth = sessionStorage.getItem('admin_authenticated');
  const storedUser = sessionStorage.getItem('admin_user');


  if (isAuth === 'true' && storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      loginOverlay.style.display = 'none';
      initDashboard();
    } catch (e) {
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
}


function showLoginScreen() {
  loginOverlay.style.display = 'flex';
}


async function handleLoginSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const submitBtn = document.getElementById('btn-login-submit');


  loginErrorMsg.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Verifying...</span> ⏳';


  try {
    const res = await fetch('api.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();


    if (res.ok && data.success) {
      currentUser = data.user;
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_user', JSON.stringify(currentUser));
      loginOverlay.style.display = 'none';
      showToast(`Welcome back, ${currentUser.full_name}!`);
      initDashboard();
    } else {
      loginErrorMsg.textContent = data.error || "Invalid username or password.";
      loginErrorMsg.style.display = 'block';
    }
  } catch (err) {
    loginErrorMsg.textContent = "Server connection error. Check XAMPP Apache/MySQL.";
    loginErrorMsg.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Authenticate Session</span> ➔';
  }
}


function handleLogout() {
  if (confirm("Are you sure you want to log out of the administration panel?")) {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_user');
    window.location.reload();
  }
}


// 2.1 Password Visibility Toggle
function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btnEl) {
      btnEl.textContent = '🙈';
      btnEl.title = 'Hide Password';
    }
  } else {
    input.type = 'password';
    if (btnEl) {
      btnEl.textContent = '👁️';
      btnEl.title = 'Show Password';
    }
  }
}


// 2.2 Auth Switcher (Sign In / Register / Forgot Password)
function switchAuthMode(mode) {
  const viewLogin = document.getElementById('auth-view-login');
  const viewReg = document.getElementById('auth-view-register');
  const viewForgot = document.getElementById('auth-view-forgot');
  const tabLogin = document.getElementById('btn-tab-login');
  const tabReg = document.getElementById('btn-tab-register');
  const tabBar = document.getElementById('auth-tab-bar');


  // Hide any existing error / alert messages
  const loginErr = document.getElementById('login-error-msg');
  const regErr = document.getElementById('reg-error-msg');
  const forgotMsg = document.getElementById('forgot-msg');
  if (loginErr) loginErr.style.display = 'none';
  if (regErr) { regErr.style.display = 'none'; regErr.textContent = ''; }
  if (forgotMsg) { forgotMsg.style.display = 'none'; forgotMsg.textContent = ''; }


  // Reset active classes
  if (viewLogin) viewLogin.classList.remove('active');
  if (viewReg) viewReg.classList.remove('active');
  if (viewForgot) viewForgot.classList.remove('active');


  if (tabLogin) tabLogin.classList.remove('active');
  if (tabReg) tabReg.classList.remove('active');


  const box = document.querySelector('.login-box');
  if (box) {
    box.style.maxWidth = '540px';
    box.style.minHeight = '540px';
  }
  if (mode === 'register') {
    if (tabBar) tabBar.style.display = 'flex';
    if (viewReg) viewReg.classList.add('active');
    if (tabReg) tabReg.classList.add('active');
    populateRegisterUnitsDropdown();
    const firstInput = document.getElementById('reg-fullname');
    if (firstInput) setTimeout(() => firstInput.focus(), 60);
  } else if (mode === 'forgot') {
    openForgotPasswordModal();
    return;
  } else {
    // Default: 'login'
    if (tabBar) tabBar.style.display = 'flex';
    if (viewLogin) viewLogin.classList.add('active');
    if (tabLogin) tabLogin.classList.add('active');
    const firstInput = document.getElementById('login-username');
    if (firstInput) setTimeout(() => firstInput.focus(), 60);
  }
}


// 2.2.1 Dynamically Populate Registration Units Dropdown (1 User Per Unit Enforcement)
async function populateRegisterUnitsDropdown() {
  const sel = document.getElementById('reg-division');
  if (!sel) return;


  const lang = currentDashboardLang || 'en';
  const defaultLabel = lang === 'si' ? '-- පවරා ඇති ඒකකය තෝරන්න --' : (lang === 'ta' ? '-- ஒதுக்கப்பட்ட அலகைத் தேர்ந்தெடுக்கவும் --' : '-- Select Assigned Unit --');
  sel.innerHTML = `<option value="" disabled selected>${defaultLabel}</option>`;


  const assignedByDivId = {};
  const assignedByName = {};


  try {
    const res = await fetch('api.php?action=units_availability');
    if (res.ok) {
      const data = await res.json();
      if (data.assigned && Array.isArray(data.assigned)) {
        data.assigned.forEach(u => {
          if (u.division_id) assignedByDivId[String(u.division_id)] = u;
          if (u.unit_name) assignedByName[String(u.unit_name).toLowerCase().trim()] = u;
        });
      }
      if (data.divisionsData && typeof data.divisionsData === 'object' && Object.keys(data.divisionsData).length > 0) {
        if (!db) db = {};
        db.divisionsData = data.divisionsData;
      }
    }
  } catch (e) {
    console.warn("Could not fetch unit availability:", e);
  }


  // Fallback: If db.divisionsData is still not loaded, fetch from api.php
  if (!db || !db.divisionsData || Object.keys(db.divisionsData).length === 0) {
    try {
      const res = await fetch('api.php');
      if (res.ok) {
        const fullData = await res.json();
        if (fullData.divisionsData && typeof fullData.divisionsData === 'object' && Object.keys(fullData.divisionsData).length > 0) {
          if (!db) db = {};
          db.divisionsData = fullData.divisionsData;
        }
      }
    } catch (e) {}
  }


  const regLabel = lang === 'si' ? 'ලියාපදිංචි කර ඇත' : (lang === 'ta' ? 'பதிவு செய்யப்பட்டது' : 'Registered');
  const divs = db.divisionsData || {};
  const sortedDivIds = Object.keys(divs).map(k => parseInt(k, 10)).filter(n => !isNaN(n)).sort((a,b) => a - b);

  // Default statutory divisions: 1 is the Chief Secretariat Administration Division (always shown).
  // Non-admin statutory divisions (2, 3, 4, 5) are hidden by default, unless newly added custom units or custom divisions exist.
  const defaultSectionCounts = {
    1: 6, // Establishment Office, Statistical Unit, Legal Unit, Accounts Unit, Digital Division (ICT + GIS), Translation Unit
    2: 3, // MDTU Office, Wayamba Training Institute, Drug Prevention Unit
    3: 3, // Provincial Treasury, Revenue Unit, Budget and Payments
    4: 2, // Quality Control Lab, BoQ Online System
    5: 2  // Provincial Planning, Project Monitoring & Evaluation
  };

  const allowedDivIds = sortedDivIds.filter(divId => {
    // 1. Division 1 (Chief Secretariat / Administration Division) is ALWAYS included
    if (divId === 1) return true;

    const div = divs[divId] || divs[String(divId)];
    if (!div) return false;

    // 2. Custom or newly created divisions by admin (ID > 5 or flagged as custom)
    if (divId > 5 || div.is_custom || div.created_by_admin) return true;

    // 3. Any division where new custom units have been added beyond the default seed count
    const defCount = defaultSectionCounts[divId] !== undefined ? defaultSectionCounts[divId] : 0;
    const curCount = Array.isArray(div.sections_en) ? div.sections_en.length : 0;
    if (curCount > defCount || div.has_custom_units || (Array.isArray(div.custom_sections) && div.custom_sections.length > 0)) {
      return true;
    }

    return false;
  });

  allowedDivIds.forEach(divId => {
    const div = divs[divId] || divs[String(divId)];
    if (!div) return;


    const divName = div['name_' + lang] || div.name_en || (`Division ${divId}`);
    const divNameEn = div.name_en || (`Division ${divId}`);


    const optgroup = document.createElement('optgroup');
    optgroup.label = `🏛️ ${divName}`;


    // 1. Main Division Option
    const mainOpt = document.createElement('option');
    mainOpt.value = divId;
    mainOpt.setAttribute('data-parent-id', divId);
    mainOpt.setAttribute('data-unit-name', divNameEn);


    const mainAssigned = assignedByName[divNameEn.toLowerCase().trim()] || (assignedByDivId[String(divId)] && !assignedByDivId[String(divId)].unit_name);
    if (mainAssigned) {
      mainOpt.textContent = `${divName} — [${regLabel}: ${mainAssigned.username}]`;
      mainOpt.disabled = true;
      mainOpt.style.color = '#94A3B8';
    } else {
      mainOpt.textContent = divName;
    }
    optgroup.appendChild(mainOpt);


    // 2. Sub-Units / Sections
    const rawSec = div['sections_' + lang] || div.sections_en || [];
    const sections = Array.isArray(rawSec) 
      ? rawSec 
      : (typeof rawSec === 'string' ? rawSec.split(',').map(s=>s.trim()).filter(Boolean) : []);


    const rawSecEn = div.sections_en || [];
    const sectionsEn = Array.isArray(rawSecEn) 
      ? rawSecEn 
      : (typeof rawSecEn === 'string' ? rawSecEn.split(',').map(s=>s.trim()).filter(Boolean) : []);


    sections.forEach((sec, sIdx) => {
      const secEn = sectionsEn[sIdx] || sec;
      const subOpt = document.createElement('option');
      subOpt.value = (divId * 100) + (sIdx + 1);
      subOpt.setAttribute('data-parent-id', divId);
      subOpt.setAttribute('data-unit-name', secEn);


      const subFullName = `${sec} (${divName})`;
      const subFullNameEn = `${secEn} (${divNameEn})`;


      const subAssigned = assignedByName[secEn.toLowerCase().trim()] ||
                          assignedByName[sec.toLowerCase().trim()] ||
                          assignedByName[subFullNameEn.toLowerCase().trim()] ||
                          assignedByDivId[String(subOpt.value)];


      if (subAssigned) {
        subOpt.textContent = `${subFullName} — [${regLabel}: ${subAssigned.username}]`;
        subOpt.disabled = true;
        subOpt.style.color = '#94A3B8';
      } else {
        subOpt.textContent = subFullName;
      }
      optgroup.appendChild(subOpt);
    });


    sel.appendChild(optgroup);
  });
}


// 2.3 Handle Officer Registration Form Submission
async function handleRegisterSubmit(e) {
  e.preventDefault();
  const fullName = document.getElementById('reg-fullname').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const divisionId = document.getElementById('reg-division').value;
  const phone = document.getElementById('reg-phone')?.value.trim() || '';
  const email = document.getElementById('reg-email')?.value.trim() || '';
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  const submitBtn = document.getElementById('btn-reg-submit');
  const regErrorMsg = document.getElementById('reg-error-msg');


  if (!fullName || !username || !password || !divisionId) {
    regErrorMsg.style.background = '#FFEAEF';
    regErrorMsg.style.color = 'var(--pill-coral)';
    regErrorMsg.textContent = !divisionId ? 'Please select your assigned unit from the list.' : 'Please fill out all required fields.';
    regErrorMsg.style.display = 'block';
    return;
  }


  if (password.length < 6) {
    regErrorMsg.style.background = '#FFEAEF';
    regErrorMsg.style.color = 'var(--pill-coral)';
    regErrorMsg.textContent = 'Password must be at least 6 characters long.';
    regErrorMsg.style.display = 'block';
    return;
  }


  if (password !== confirmPassword) {
    regErrorMsg.style.background = '#FFEAEF';
    regErrorMsg.style.color = 'var(--pill-coral)';
    regErrorMsg.textContent = 'Passwords do not match. Please re-enter carefully.';
    regErrorMsg.style.display = 'block';
    return;
  }


  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Creating Account...</span> ⏳';
  regErrorMsg.style.display = 'none';


  const regDivSelect = document.getElementById('reg-division');
  const selectedOpt = regDivSelect ? regDivSelect.options[regDivSelect.selectedIndex] : null;
  const optParentId = selectedOpt ? selectedOpt.getAttribute('data-parent-id') : null;
  const optUnitName = selectedOpt ? selectedOpt.getAttribute('data-unit-name') : null;


  const rawDivVal = parseInt(divisionId, 10);
  const resolvedParentId = optParentId ? parseInt(optParentId, 10) : (rawDivVal > 100 ? Math.floor(rawDivVal / 100) : rawDivVal);
  const allUnits = getAllAssignableUnits();
  const matchedUnit = divisionId ? allUnits.find(u => String(u.id) === String(divisionId)) : null;
  const unitName = optUnitName || (matchedUnit ? (matchedUnit.unit_raw || matchedUnit.name_en) : null);


  try {
    const res = await fetch('api.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        full_name: fullName,
        password: password,
        division_id: resolvedParentId,
        unit_name: unitName,
        phone: phone,
        email: email,
        role: 'Admin',
        status: 'Active'
      })
    });
    const data = await res.json();


    if (res.ok && data.success) {
      alert(`Registration Successful!\n\nOfficial account for ${fullName} (${username}) has been registered.\nYou can now authenticate using your credentials.`);
      
      // Pre-fill username on login screen
      const loginUserInput = document.getElementById('login-username');
      if (loginUserInput) loginUserInput.value = username;
      const loginPassInput = document.getElementById('login-password');
      if (loginPassInput) {
        loginPassInput.value = '';
        loginPassInput.focus();
      }


      // Reset register form & switch back to login view
      document.getElementById('register-form').reset();
      switchAuthMode('login');
    } else {
      regErrorMsg.style.background = '#FFEAEF';
      regErrorMsg.style.color = 'var(--pill-coral)';
      regErrorMsg.textContent = data.error || 'Failed to complete registration. Username might already exist.';
      regErrorMsg.style.display = 'block';
    }
  } catch (err) {
    regErrorMsg.style.background = '#FFEAEF';
    regErrorMsg.style.color = 'var(--pill-coral)';
    regErrorMsg.textContent = 'Server connection error. Please verify XAMPP Apache/MySQL is running.';
    regErrorMsg.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Registration</span> ➔';
  }
}


// 2.4 Handle Password Recovery Request
async function handleForgotSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('forgot-username').value.trim();
  const phoneOrEmail = document.getElementById('forgot-phone').value.trim();
  const newPassword = document.getElementById('forgot-new-password')?.value.trim() || '';
  const confirmPassword = document.getElementById('forgot-confirm-password')?.value.trim() || '';
  const msgEl = document.getElementById('forgot-msg');
  const submitBtn = document.getElementById('btn-forgot-submit');


  if (newPassword.length < 6) {
    msgEl.style.background = '#FFEAEF';
    msgEl.style.color = 'var(--pill-coral)';
    msgEl.textContent = 'New password must be at least 6 characters.';
    msgEl.style.display = 'block';
    return;
  }


  if (newPassword !== confirmPassword) {
    msgEl.style.background = '#FFEAEF';
    msgEl.style.color = 'var(--pill-coral)';
    msgEl.textContent = 'Passwords do not match. Please re-enter carefully.';
    msgEl.style.display = 'block';
    return;
  }


  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Verifying & Resetting...</span> ⏳';
  msgEl.style.display = 'none';


  try {
    const res = await fetch('api.php?action=forgot_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        phone_or_email: phoneOrEmail,
        new_password: newPassword
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      msgEl.style.background = '#ECFDF5';
      msgEl.style.color = 'var(--accent-green)';
      msgEl.innerHTML = `<strong>Password Reset Successful!</strong><br>${data.message}`;
      msgEl.style.display = 'block';
      
      setTimeout(() => {
        const loginUserInput = document.getElementById('login-username');
        if (loginUserInput) loginUserInput.value = username;
        const loginPassInput = document.getElementById('login-password');
        if (loginPassInput) {
          loginPassInput.value = newPassword;
          loginPassInput.focus();
        }
        document.getElementById('forgot-form').reset();
        switchAuthMode('login');
      }, 1800);
    } else {
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = data.error || 'Verification failed. Please check username and phone/email.';
      msgEl.style.display = 'block';
    }
  } catch (err) {
    msgEl.style.background = '#FFEAEF';
    msgEl.style.color = 'var(--pill-coral)';
    msgEl.textContent = 'Server connection error. Please verify Apache/MySQL is running.';
    msgEl.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Reset Password & Authenticate</span> ➔';
  }
}


// 2.5 Mobile Navigation Drawer Toggle
function toggleMobileSidebar(open) {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!sidebar) return;


  const shouldOpen = open !== undefined ? open : !sidebar.classList.contains('open');
  if (shouldOpen) {
    sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}


// 3. Initialize Dashboard Data & UI
async function initDashboard() {
  await refreshCurrentUserDetails();
  updateProfileCard();
  enforceRoleRestrictions();
  await fetchAllDatabase();
  renderAllViews();
  setDashboardLanguage(currentDashboardLang, false);
}


function getUnitIcon(name) {
  if (!name) return '🏛️';
  const n = String(name).toLowerCase();
  if (n.includes('legal') || n.includes('නීති') || n.includes('சட்ட')) return '⚖️';
  if (n.includes('statistic') || n.includes('සංඛ්යා') || n.includes('සංඛ්‍යා') || n.includes('புள்ளி')) return '📊';
  if (n.includes('account') || n.includes('ගිණුම්') || n.includes('கணக்கு') || n.includes('treasury') || n.includes('භාණ්ඩා')) return '💰';
  if (n.includes('digital') || n.includes('ict') || n.includes('gis') || n.includes('ඩිජිටල්') || n.includes('டிஜிட்டல்')) return '💻';
  if (n.includes('translat') || n.includes('පරිවර්තන') || n.includes('மொழிபெயர்ப்பு')) return '🌐';
  if (n.includes('engineer') || n.includes('ඉංජිනේරු') || n.includes('பொறியியல்')) return '📐';
  if (n.includes('plan') || n.includes('ක්රමසම්පාදන') || n.includes('ක්‍රමසම්පාදන') || n.includes('திட்டமிடல்')) return '📈';
  if (n.includes('training') || n.includes('පුහුණු') || n.includes('பயிற்சி')) return '🎓';
  if (n.includes('establishment') || n.includes('ආයතන') || n.includes('ஸ்தாபන')) return '🏛️';
  return '🏛️';
}


function getUserCategoryName(user, lang = currentDashboardLang) {
  if (!user) return '';


  // 1. If user has a specific assigned sub-unit / branch (e.g. Legal Unit)
  if (user.unit_name && user.unit_name !== 'Chief Secretariat (All Units)' && user.unit_name !== 'General Unit') {
    return getTranslatedUnitName(user.unit_name, lang);
  }


  // 2. Main division lookup
  const divId = user.division_id;
  if (divId) {
    if (db && db.divisionsData && db.divisionsData[String(divId)]) {
      const d = db.divisionsData[String(divId)];
      return d['name_' + lang] || d.name_en || d.name_si || `Division ${divId}`;
    }
    const allUnits = getAllAssignableUnits();
    const unitObj = allUnits.find(u => String(u.id) === String(divId));
    if (unitObj) {
      return unitObj['name_' + lang] || unitObj.name_en;
    }
    return `Division ${divId}`;
  }


  // 3. Super Admin / Central Admin (All Units)
  if (user.role === 'Super Admin') {
    if (lang === 'si') return 'ප්‍රධාන ලේකම් කාර්යාලය (සියලු අංශ)';
    if (lang === 'ta') return 'பிரதம தலைமைச் செயலகம் (அனைத்து பிரிவுகளும்)';
    return 'Chief Secretariat (All Units)';
  }


  return user.unit_name || 'General Unit';
}


async function refreshCurrentUserDetails() {
  if (!currentUser || !currentUser.username) return;
  try {
    const res = await fetch('api.php?action=users');
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.users)) {
      const fresh = data.users.find(u => u.username === currentUser.username || String(u.id) === String(currentUser.id));
      if (fresh) {
        currentUser.division_id = (fresh.division_id !== null && fresh.division_id !== undefined && fresh.division_id !== '') ? parseInt(fresh.division_id, 10) : null;
        currentUser.unit_name = fresh.unit_name || currentUser.unit_name;
        currentUser.role = fresh.role || currentUser.role;
        currentUser.full_name = fresh.full_name || currentUser.full_name;
        currentUser.phone = fresh.phone || currentUser.phone;
        currentUser.email = fresh.email || currentUser.email;
        if (fresh.photo !== undefined) currentUser.photo = fresh.photo;
        sessionStorage.setItem('admin_user', JSON.stringify(currentUser));
        sessionStorage.setItem('nwp_admin_user', JSON.stringify(currentUser));
        updateProfileCard();
      }
    }
  } catch (e) {
    console.warn("Could not refresh current user:", e);
  }
}


function updateProfileCard() {
  if (!currentUser) return;
  const nameEl = document.getElementById('user-display-name');
  const sideNameEl = document.getElementById('sidebar-user-fullname');
  const sideBadgeEl = document.getElementById('sidebar-user-badge');
  const sideCatEl = document.getElementById('sidebar-user-category');
  const sideCatText = document.getElementById('sidebar-user-category-text');
  const sideCatIcon = document.getElementById('sidebar-user-category-icon');
  const greetingEl = document.getElementById('top-user-greeting');


  const fullName = currentUser.full_name || currentUser.username || 'Chief Secretary';
  const roleText = currentUser.role || 'Super Administrator';
  const categoryName = getUserCategoryName(currentUser, currentDashboardLang);


  const displayFull = categoryName ? `${fullName} (${roleText} • ${categoryName})` : `${fullName} (${roleText})`;


  if (nameEl) {
    nameEl.textContent = `${fullName} (${roleText})`;
    nameEl.title = displayFull;
  }
  if (greetingEl) greetingEl.textContent = fullName;
  if (sideNameEl) {
    sideNameEl.textContent = fullName;
    sideNameEl.title = fullName;
  }
  if (sideBadgeEl) sideBadgeEl.textContent = '👑 ' + roleText.toUpperCase();
  const sideAvatarEl = document.getElementById('sidebar-user-avatar');
  if (sideAvatarEl) {
    sideAvatarEl.src = (currentUser.photo && currentUser.photo.trim()) ? currentUser.photo : 'logo.jpg';
  }
  const topAvatarEl = document.getElementById('topbar-user-avatar') || document.querySelector('.topbar-profile-avatar');
  if (topAvatarEl) {
    topAvatarEl.src = (currentUser.photo && currentUser.photo.trim()) ? currentUser.photo : 'logo.jpg';
  }


  if (sideCatEl && sideCatText) {
    if (categoryName) {
      sideCatText.textContent = categoryName;
      const parentDiv = (currentUser.division_id && db && db.divisionsData) ? db.divisionsData[String(currentUser.division_id)] : null;
      const parentName = parentDiv ? (parentDiv['name_' + currentDashboardLang] || parentDiv.name_en) : '';
      if (parentName && parentName !== categoryName) {
        sideCatEl.title = `${categoryName} (${parentName})`;
      } else {
        sideCatEl.title = `Category / Assigned Unit: ${categoryName}`;
      }
      sideCatEl.style.display = 'inline-flex';
      if (sideCatIcon) {
        sideCatIcon.textContent = getUnitIcon(currentUser.unit_name || categoryName);
      }
    } else {
      sideCatEl.style.display = 'none';
    }
  }
}


function openCurrentUserModal() {
  switchAdminTab('view-profile', null);
}


function enforceRoleRestrictions() {
  if (!currentUser) return;
  const isSuperAdmin = currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser.division_id;


  const unitObj = CHIEF_SECRETARIAT_UNITS.find(u => String(u.id) === String(userDivId));
  const unitName = getUserCategoryName(currentUser, currentDashboardLang) || (currentUser.unit_name || 'My Unit');


  // Super Admin Navigation Items (strictly hidden for division officers)
  const superAdminNavIds = [
    'nav-item-inquiries',
    'sidebar-divider-group2',
    'nav-item-users',
    'nav-item-divisions',
    'nav-item-eservices',
    'sidebar-divider-group3'
  ];


  const docLabel = document.getElementById('nav-label-documents');
  const alertLabel = document.getElementById('nav-label-alerts');
  const projLabel = document.getElementById('nav-label-projects');
  const userOver = document.getElementById('user-overview-section');
  const superOver = document.getElementById('superadmin-overview-section');


  if (isSuperAdmin) {
    superAdminNavIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
    if (docLabel) docLabel.textContent = currentDashboardLang === 'si' ? 'සියලුම වයඹ නියෝග' : (currentDashboardLang === 'ta' ? 'அனைத்து வடமேல் வழிகாட்டல்கள்' : 'All Wayamba Directives');
    if (alertLabel) alertLabel.textContent = currentDashboardLang === 'si' ? 'සජීවී නිවේදන' : (currentDashboardLang === 'ta' ? 'நேரலை அறிவிப்புகள்' : 'Live Announcements');
    if (projLabel) projLabel.textContent = currentDashboardLang === 'si' ? 'පළාත් ව්‍යාපෘති' : (currentDashboardLang === 'ta' ? 'மாகாண திட்டங்கள்' : 'Provincial Projects');
    if (userOver) userOver.style.display = 'none';
    if (superOver) superOver.style.display = 'block';
    renderSuperAdminOverviewLists();
    drawDivisionsBarChart();
    drawDirectivesPieChart();
  } else {
    // Non-SuperAdmin accounts (Establishment, Statistical, Legal, Accounts, Digital, Translation)
    superAdminNavIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });


    if (docLabel) docLabel.textContent = currentDashboardLang === 'si' ? 'මගේ ලේඛන සහ චක්‍රලේඛ' : (currentDashboardLang === 'ta' ? 'எனது ஆவணங்கள்' : 'My Uploaded Directives');
    if (alertLabel) alertLabel.textContent = currentDashboardLang === 'si' ? 'සජීවී නිවේදන' : (currentDashboardLang === 'ta' ? 'நேரலை அறிவிப்புகள்' : 'Live Announcements');
    if (projLabel) projLabel.textContent = currentDashboardLang === 'si' ? 'මගේ ව්‍යාපෘති සහ ලිපි' : (currentDashboardLang === 'ta' ? 'எனது திட்டங்கள்' : 'My Projects & Articles');
    if (userOver) userOver.style.display = 'block';
    if (superOver) superOver.style.display = 'none';
    drawDivisionsBarChart();
    drawDirectivesPieChart();
  }


  // Lock and configure Division filters
  const filterDocDiv = document.getElementById('filter-doc-division');
  if (filterDocDiv) {
    if (!isSuperAdmin && userDivId) {
      filterDocDiv.value = String(userDivId);
      filterDocDiv.disabled = true;
      filterDocDiv.style.display = 'none';
    } else {
      filterDocDiv.disabled = false;
      filterDocDiv.style.display = '';
    }
  }


  const folderDivSelect = document.getElementById('folder-division-select');
  if (folderDivSelect) {
    if (!isSuperAdmin && userDivId) {
      folderDivSelect.value = String(userDivId);
      folderDivSelect.disabled = true;
      folderDivSelect.style.opacity = '0.7';
    } else {
      folderDivSelect.disabled = false;
      folderDivSelect.style.opacity = '1';
    }
  }
}


async function fetchAllDatabase() {
  try {
    const res = await fetch('api.php');
    if (res.ok) {
      db = await res.json();
    }
  } catch (err) {
    console.warn("API load failed, fallback to local state:", err);
  }


  // Fetch users if Super Admin or Admin
  if (currentUser && currentUser.role === 'Super Admin') {
    await fetchUsers();
  }
}


async function fetchUsers() {
  try {
    const res = await fetch('api.php?action=users');
    if (res.ok) {
      const data = await res.json();
      usersList = data.users || [];
    }
  } catch (err) {
    console.error("Failed to load users:", err);
  }
}


// 4. Tab Switching
function switchAdminTab(viewId, clickedBtn) {
  toggleMobileSidebar(false);


  // Update view title and subtitle based on active dashboard language
  const titleEl = document.getElementById('top-view-title');
  const subEl = document.getElementById('top-view-sub');


  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  if (viewId === 'view-overview') {
    const welcomeWord = currentDashboardLang === 'si' ? 'ආයුබෝවන්' : (currentDashboardLang === 'ta' ? 'வணக்கம்' : 'Welcome');
    const fullName = currentUser ? (currentUser.full_name || currentUser.username) : 'Chief Secretary';
    const roleText = currentUser ? (currentUser.role || 'Super Administrator') : 'Super Administrator';
    if (titleEl) titleEl.innerHTML = `${welcomeWord}, <span id="top-user-greeting">${escapeHtml(fullName)}</span> 👋`;
    if (subEl) subEl.textContent = dict.councilCentralSec || 'Council Central Secretariat';
  } else if (dict.views && dict.views[viewId] && titleEl && subEl) {
    titleEl.innerHTML = dict.views[viewId][0];
    subEl.textContent = dict.views[viewId][1];
  }


  // Toggle active view
  document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.add('active');


  // Toggle active nav button
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  } else {
    const matchBtn = document.querySelector(`.nav-btn[onclick*="${viewId}"]`);
    if (matchBtn) matchBtn.classList.add('active');
  }


  // Populate profile fields when opening view-profile
  if (viewId === 'view-profile') {
    populateProfileView();
  }


  if (viewId === 'view-divisions') {
    renderAdminDivisions();
  }


  if (viewId === 'view-eservices') {
    renderPortalsCategoryPills();
    renderAdminPortals();
    populatePortalDivisionSelect();
  }


  if (viewId === 'view-projects') {
    renderAdminProjects();
  }


  // Re-draw charts when opening overview
  if (viewId === 'view-overview') {
    setTimeout(() => {
      drawDivisionsBarChart();
      drawDirectivesPieChart();
      drawSplineLineChart();
      renderSuperAdminOverviewLists();
      populateUserOverviewHub();
    }, 50);
  }


  // Ensure view-documents is rendered with active language on switch
  if (viewId === 'view-documents') {
    renderAdminDocuments();
    populateDocDivisionDropdown();
    const circInput = document.getElementById('search-circulars-input');
    if (circInput) {
      circInput.placeholder = dict.searchCircularsPlaceholder || (currentDashboardLang === 'si' ? 'චක්‍රලේඛ සොයන්න...' : (currentDashboardLang === 'ta' ? 'சுற்றறிக்கைகளைத் தேடுக...' : 'Search circulars...'));
    }
  }
}


// 5. Render All Views & Synchronize Counts
function renderAllViews() {
  renderOverviewDirectives();
  updateMetricCounters();
  drawDivisionsBarChart();
  drawDirectivesPieChart();
  drawSplineLineChart();
  renderOverviewRecentInquiries();
  renderAdminDocuments();
  populateDocDivisionDropdown();
  renderAdminDivisions();
  renderAdminInquiries();
  populateAnnouncementsForm();
  renderAdminSystems();
  renderAdminProjects();
  renderAdminUsers();
  populateSiteTextsForm();
  populateProfileView();
  renderPortalsCategoryPills();
  renderAdminPortals();
  populatePortalDivisionSelect();
}


function updateMetricCounters() {
  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;
  const unitObj = CHIEF_SECRETARIAT_UNITS.find(u => String(u.id) === String(userDivId));
  const unitName = getUserCategoryName(currentUser, currentDashboardLang) || (currentUser?.unit_name || 'My Unit');


  // Documents count strictly scoped to user's uploads for non-superadmin
  const scopedDocs = isSuperAdmin
    ? (db.documents || [])
    : (db.documents || []).filter(d => 
        (d.created_by_user_id && String(d.created_by_user_id) === String(currentUser?.id)) ||
        (d.created_by_username && d.created_by_username === currentUser?.username) ||
        (userDivId && String(d.division) === String(userDivId))
      );
  const docsCount = scopedDocs.length;


  const scopedProjects = isSuperAdmin
    ? (db.projects || [])
    : (db.projects || []).filter(p => 
        (p.created_by_user_id && String(p.created_by_user_id) === String(currentUser?.id)) ||
        (p.created_by_username && p.created_by_username === currentUser?.username) ||
        (userDivId && String(p.division_id) === String(userDivId))
      );
  const projectsCount = scopedProjects.length;


  const inqCount = Array.isArray(db.inquiries) ? db.inquiries.length : 0;
  const divsCount = Object.keys(db.divisionsData || {}).length;


  // Announcements count
  let annCount = 0;
  if (Array.isArray(db.announcements) && db.announcements.length > 0) {
    annCount = db.announcements.length;
  } else {
    const rawAnnText = db.siteTranslations?.[currentDashboardLang]?.announcementsText || db.siteTranslations?.si?.announcementsText || db.siteTranslations?.en?.announcementsText || '';
    if (rawAnnText.trim()) {
      const parts = rawAnnText.split(/(?<=[.!?])\s+|\n|•/).map(s => s.trim()).filter(s => s.length > 5);
      annCount = Math.max(1, parts.length);
    }
  }


  const docEl = document.getElementById('metric-docs-count');
  const inqEl = document.getElementById('metric-inquiries-count');
  const annEl = document.getElementById('metric-announcements-count');
  const divEl = document.getElementById('metric-divisions-count');


  // Sidebar badges
  const sideDoc = document.getElementById('sidebar-doc-count');
  const sideInq = document.getElementById('sidebar-inq-count');
  const inqPill = document.getElementById('inq-total-pill');


  if (sideDoc) sideDoc.textContent = docsCount;
  if (sideInq) sideInq.textContent = inqCount;
  if (inqPill) inqPill.textContent = `${inqCount} Inquiries`;


  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];


  if (isSuperAdmin) {
    if (docEl) docEl.textContent = docsCount;
    if (inqEl) inqEl.textContent = inqCount;
    if (annEl) annEl.textContent = annCount;
    if (divEl) divEl.textContent = divsCount || 5;


    // Card 1: Circulars & Rate Books
    const card1Label = document.querySelector('.metric-pill-card.card-blue .pill-card-label');
    const card1Sub = document.querySelector('.metric-pill-card.card-blue .pill-card-sub');
    const card1Btn = document.querySelector('.metric-pill-card.card-blue .pill-card-btn');
    if (card1Label) card1Label.textContent = dict.metricDocs || 'Circulars & Rate Books';
    if (card1Sub) card1Sub.textContent = dict.metricDocsSub || 'Official gazettes, circulars & rate books';
    if (card1Btn) {
      card1Btn.innerHTML = `<span>${dict.btnManage || 'Manage'}</span> ➔`;
      card1Btn.onclick = () => switchAdminTab('view-documents', null);
    }


    // Card 2: Citizen Inquiries
    const card2Label = document.querySelector('.metric-pill-card.card-cyan .pill-card-label');
    const card2Sub = document.querySelector('.metric-pill-card.card-cyan .pill-card-sub');
    const card2Btn = document.querySelector('.metric-pill-card.card-cyan .pill-card-btn');
    if (card2Label) card2Label.textContent = dict.metricInquiries || 'Citizen Inquiries Received';
    if (card2Sub) card2Sub.textContent = dict.metricInquiriesSub || 'Public inquiries & petitions';
    if (card2Btn) {
      card2Btn.innerHTML = `<span>${dict.btnReview || 'Review'}</span> ➔`;
      card2Btn.onclick = () => switchAdminTab('view-inquiries', null);
    }


    // Card 3: Live Announcements (card-violet)
    const card3Label = document.querySelector('.metric-pill-card.card-violet .pill-card-label');
    const card3Sub = document.querySelector('.metric-pill-card.card-violet .pill-card-sub');
    const card3Btn = document.querySelector('.metric-pill-card.card-violet .pill-card-btn');
    if (card3Label) card3Label.textContent = dict.metricAnnouncements || 'Live Announcements';
    if (card3Sub) card3Sub.textContent = dict.metricAnnouncementsSub || 'Public broadcasts & urgent notices';
    if (card3Btn) {
      card3Btn.innerHTML = `<span>${dict.btnLaunch || 'Launch'}</span> ➔`;
      card3Btn.onclick = () => switchAdminTab('view-announcements', null);
    }


    // Card 4: Secretariat Divisions (card-mint)
    const card4Label = document.querySelector('.metric-pill-card.card-mint .pill-card-label');
    const card4Sub = document.querySelector('.metric-pill-card.card-mint .pill-card-sub');
    const card4Btn = document.querySelector('.metric-pill-card.card-mint .pill-card-btn');
    if (card4Label) card4Label.textContent = dict.metricDivisions || 'Secretariat Divisions';
    if (card4Sub) card4Sub.textContent = dict.metricDivisionsSub || 'Provincial statutory units';
    if (card4Btn) {
      card4Btn.innerHTML = `<span>${dict.btnExplore || 'Explore'}</span> ➔`;
      card4Btn.onclick = () => switchAdminTab('view-divisions', null);
    }


    renderSuperAdminOverviewLists();
    drawDivisionsBarChart();
    drawDirectivesPieChart();
  } else {
    // Tailored strictly for Officer Accounts
    if (docEl) docEl.textContent = docsCount;
    if (inqEl) inqEl.textContent = projectsCount;
    if (annEl) annEl.textContent = annCount;
    if (divEl) divEl.textContent = dict.authorized || (currentDashboardLang === 'si' ? 'බලයලත්' : (currentDashboardLang === 'ta' ? 'அங்கீகரிக்கப்பட்டது' : 'Authorized'));


    // Card 1: My Uploaded Directives
    const card1Label = document.querySelector('.metric-pill-card.card-blue .pill-card-label');
    const card1Sub = document.querySelector('.metric-pill-card.card-blue .pill-card-sub');
    const card1Btn = document.querySelector('.metric-pill-card.card-blue .pill-card-btn');
    if (card1Label) card1Label.textContent = dict.officerDocsTitle || 'My Uploaded Directives';
    if (card1Sub) card1Sub.textContent = `${dict.officerDocsSub || 'Directives published by your account'} (${unitName})`;
    if (card1Btn) {
      card1Btn.innerHTML = `<span>${dict.btnManage || 'Manage'}</span> ➔`;
      card1Btn.onclick = () => switchAdminTab('view-documents', null);
    }


    // Card 2: My Homepage Articles
    const card2Label = document.querySelector('.metric-pill-card.card-cyan .pill-card-label');
    const card2Sub = document.querySelector('.metric-pill-card.card-cyan .pill-card-sub');
    const card2Btn = document.querySelector('.metric-pill-card.card-cyan .pill-card-btn');
    if (card2Label) card2Label.textContent = dict.officerProjectsTitle || 'My Homepage Articles';
    if (card2Sub) card2Sub.textContent = dict.officerProjectsSub || 'Live articles in "Provincial Projects"';
    if (card2Btn) {
      card2Btn.innerHTML = `<span>${dict.btnReview || 'Review'}</span> ➔`;
      card2Btn.onclick = () => switchAdminTab('view-projects', null);
    }


    // Card 3: Live Announcements (card-violet)
    const card3Label = document.querySelector('.metric-pill-card.card-violet .pill-card-label');
    const card3Sub = document.querySelector('.metric-pill-card.card-violet .pill-card-sub');
    const card3Btn = document.querySelector('.metric-pill-card.card-violet .pill-card-btn');
    if (card3Label) card3Label.textContent = dict.metricAnnouncements || 'Live Announcements';
    if (card3Sub) card3Sub.textContent = dict.officerAnnouncementsSub || 'Live marquee broadcasts & urgent notices';
    if (card3Btn) {
      card3Btn.innerHTML = `<span>${dict.btnLaunch || 'Launch'}</span> ➔`;
      card3Btn.onclick = () => switchAdminTab('view-announcements', null);
    }


    // Card 4: Assigned Authority (card-mint)
    const card4Label = document.querySelector('.metric-pill-card.card-mint .pill-card-label');
    const card4Sub = document.querySelector('.metric-pill-card.card-mint .pill-card-sub');
    const card4Btn = document.querySelector('.metric-pill-card.card-mint .pill-card-btn');
    if (card4Label) card4Label.textContent = dict.officerAuthorityTitle || 'Assigned Authority';
    if (card4Sub) card4Sub.textContent = unitName;
    if (card4Btn) {
      card4Btn.innerHTML = `<span>${dict.btnExplore || 'Explore'}</span> ➔`;
      card4Btn.onclick = () => switchAdminTab('view-profile', null);
    }


    populateUserOverviewHub(scopedDocs, scopedProjects, annCount);
    renderUserOverviewLists(scopedDocs, scopedProjects);
  }
}



function populateUserOverviewHub(userDocs, userProjects, announcementsCount) {
  if (!currentUser || (currentUser.role === 'Super Admin' && !currentUser.division_id)) return;

  const nameEl = document.getElementById('user-ov-name');
  const roleEl = document.getElementById('user-ov-role');
  const unitEl = document.getElementById('user-ov-unit');
  const divEl = document.getElementById('user-ov-div');
  const desigEl = document.getElementById('user-ov-desig');
  const emailEl = document.getElementById('user-ov-email');
  const phoneEl = document.getElementById('user-ov-phone');
  const avatarEl = document.getElementById('user-ov-avatar');
  const docCountEl = document.getElementById('user-ov-doc-count');
  const projCountEl = document.getElementById('user-ov-proj-count');
  const annCountEl = document.getElementById('user-ov-ann-count');
  const docTypesEl = document.getElementById('user-ov-doc-types');

  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];

  if (nameEl) nameEl.textContent = currentUser.full_name || 'Unit Officer';
  if (roleEl) roleEl.textContent = dict.roleAdmin || (currentDashboardLang === 'si' ? 'පරිපාලක' : (currentDashboardLang === 'ta' ? 'நிர்வாகி' : 'Admin'));

  const unitName = getUserCategoryName(currentUser, currentDashboardLang) || (currentUser.unit_name || 'Unit Officer');
  const icon = getUnitIcon(currentUser.unit_name);
  if (unitEl) unitEl.textContent = `${icon} ${unitName}`;

  // Localized Parent Division
  const divId = currentUser.division_id;
  let divName = 'Administration Division';
  if (divId) {
    const divNamesMap = {
      1: { en: 'Administration Division', si: 'පරිපාලන අංශය', ta: 'நிர்வாகப் பிரிவு' },
      2: { en: 'Establishment Division', si: 'ආයතන අංශය', ta: 'ஸ்தாபනப் பிரிவு' },
      3: { en: 'Provincial Treasury / Accounts', si: 'පළාත් භාණ්ඩාගාරය / ගිණුම්', ta: 'மாகாண திறைசேரி / கணக்குகள்' },
      4: { en: 'Engineering Division', si: 'ඉංජිනේරු අංශය', ta: 'பொறியியல் பிரிவு' },
      5: { en: 'Planning Division', si: 'ක්‍රමසම්පාදන අංශය', ta: 'திட்டமிடல் பிரிவு' },
      6: { en: 'Digital Division (ICT + GIS)', si: 'ඩිජිටල් අංශය (ICT + GIS)', ta: 'டிஜிட்டல் பிரிவு' },
      7: { en: 'Translation Unit', si: 'පරිවර්තන ඒකකය', ta: 'மொழிபெயர்ப்பு பிரிவு' }
    };
    divName = divNamesMap[divId]?.[currentDashboardLang] || divNamesMap[divId]?.['en'] || 'Administration Division';
  }
  if (divEl) divEl.textContent = divName;

  // Localized Designation
  let desig = 'Unit Officer';
  const uLower = String(currentUser.unit_name || '').toLowerCase();
  if (uLower.includes('legal') || uLower.includes('නීති') || uLower.includes('சட்ட')) {
    desig = currentDashboardLang === 'si' ? 'පළාත් නීති නිලධාරී' : (currentDashboardLang === 'ta' ? 'மாகாண சட்ட அதிகாரி' : 'Provincial Legal Officer');
  } else if (uLower.includes('statistic') || uLower.includes('සංඛ්‍යා') || uLower.includes('புள்ளி')) {
    desig = currentDashboardLang === 'si' ? 'සංඛ්‍යාලේඛන නිලධාරී' : (currentDashboardLang === 'ta' ? 'புள்ளிவிவர அதிகாரி' : 'Statistical Officer');
  } else if (uLower.includes('account') || uLower.includes('ගිණුම්') || uLower.includes('கணக்கு')) {
    desig = currentDashboardLang === 'si' ? 'ගණකාධිකාරී' : (currentDashboardLang === 'ta' ? 'கணக்காளர்' : 'Accountant');
  } else if (uLower.includes('digital') || uLower.includes('ict') || uLower.includes('gis')) {
    desig = currentDashboardLang === 'si' ? 'තොරතුරු තාක්ෂණ නිලධාරී' : (currentDashboardLang === 'ta' ? 'தகவல் தொழில்நுட்ப அதிகாரி' : 'Digital Systems Officer');
  } else if (uLower.includes('establishment') || uLower.includes('ආයතන')) {
    desig = currentDashboardLang === 'si' ? 'ආයතන නිලධාරී' : (currentDashboardLang === 'ta' ? 'ஸ்தாபன அதிகாரி' : 'Establishment Officer');
  } else if (uLower.includes('translat') || uLower.includes('පරිවර්තන')) {
    desig = currentDashboardLang === 'si' ? 'පරිවර්තක' : (currentDashboardLang === 'ta' ? 'மொழிபெயர்ப்பாளர்' : 'Translator');
  } else {
    desig = currentDashboardLang === 'si' ? 'බලයලත් විධායක නිලධාරී' : (currentDashboardLang === 'ta' ? 'அங்கீகரிக்கப்பட்ட நிறைவேற்று அதிகாரி' : 'Authorized Executive Officer');
  }
  if (desigEl) desigEl.textContent = desig;

  if (emailEl) emailEl.textContent = currentUser.email || currentUser.username || 'officer@nw.gov.lk';
  if (phoneEl) phoneEl.textContent = currentUser.phone || '+94 37 222 3451';

  if (avatarEl) {
    if (currentUser.photo) {
      avatarEl.innerHTML = `<img src="${currentUser.photo}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.outerHTML='${icon}'">`;
    } else {
      avatarEl.innerHTML = icon;
    }
  }

  // Scoped documents and projects calculation
  const userDivId = currentUser.division_id;
  const docs = userDocs || (db.documents || []).filter(d => 
    (d.created_by_user_id && String(d.created_by_user_id) === String(currentUser.id)) ||
    (d.created_by_username && d.created_by_username === currentUser.username) ||
    (userDivId && String(d.division) === String(userDivId))
  );

  const projs = userProjects || (db.projects || []).filter(p => 
    (p.created_by_user_id && String(p.created_by_user_id) === String(currentUser.id)) ||
    (p.created_by_username && p.created_by_username === currentUser.username) ||
    (userDivId && String(p.division_id) === String(userDivId))
  );

  let annCount = announcementsCount !== undefined ? announcementsCount : 0;
  if (announcementsCount === undefined) {
    if (Array.isArray(db.announcements) && db.announcements.length > 0) {
      annCount = db.announcements.length;
    } else {
      const rawAnnText = db.siteTranslations?.[currentDashboardLang]?.announcementsText || db.siteTranslations?.si?.announcementsText || db.siteTranslations?.en?.announcementsText || '';
      if (rawAnnText.trim()) annCount = 1;
    }
  }

  if (docCountEl) docCountEl.textContent = docs.length;
  if (projCountEl) projCountEl.textContent = projs.length;
  if (annCountEl) annCountEl.textContent = annCount;

  // Breakdown detail under Directives
  if (docTypesEl) {
    let circs = 0, forms = 0, pubs = 0;
    docs.forEach(d => {
      const t = (d.type || '').toLowerCase();
      if (t.includes('circ')) circs++;
      else if (t.includes('app') || t.includes('form')) forms++;
      else pubs++;
    });

    if (docs.length === 0) {
      docTypesEl.textContent = currentDashboardLang === 'si' ? 'ලේඛන නොමැත' : (currentDashboardLang === 'ta' ? 'ஆவணங்கள் இல்லை' : 'No docs yet');
    } else {
      const parts = [];
      if (circs > 0) parts.push(`${circs} ${dict.typeCircular || 'Circulars'}`);
      if (forms > 0) parts.push(`${forms} ${dict.typeApplication || 'Forms'}`);
      if (pubs > 0) parts.push(`${pubs} ${dict.typePublication || 'Pubs'}`);
      docTypesEl.textContent = parts.join(' • ') || `${docs.length} items`;
    }
  }
}


function renderUserOverviewLists(userDocs, userProjects) {
  const docsListEl = document.getElementById('user-recent-docs-list');
  const projListEl = document.getElementById('user-recent-projects-list');


  if (docsListEl) {
    if (!userDocs || userDocs.length === 0) {
      docsListEl.innerHTML = `<div style="text-align:center; padding:18px; font-size:0.8rem; color:var(--text-muted); background:var(--bg-panel); border-radius:10px;">No directives uploaded yet. Click "+ Upload" above to add your first document.</div>`;
    } else {
      const recent = userDocs.slice(0, 5);
      docsListEl.innerHTML = recent.map(doc => {
        const title = doc['title_' + currentDashboardLang] || doc.title_en || doc.title_si || 'Untitled Document';
        const type = doc.type || 'Circular';
        const size = doc.size || '1.0 MB';
        const dateStr = doc.date || (doc.created_at ? doc.created_at.slice(0, 10) : '');
        return `
          <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="min-width:0; flex:1;">
              <div style="font-weight:700; font-size:0.82rem; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(title)}</div>
              <div style="font-size:0.72rem; color:var(--text-muted); display:flex; align-items:center; gap:8px; margin-top:2px;">
                <span class="badge-pill badge-pill-navy" style="font-size:0.65rem; padding:1px 6px;">${escapeHtml(type)}</span>
                <span>📁 ${escapeHtml(size)}</span>
                ${dateStr ? `<span>📅 ${escapeHtml(dateStr)}</span>` : ''}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <button class="btn-table-action" onclick="openEditDocModal(${doc.id})" title="${dict.btnEdit || 'Edit'}">
                <span>✏️</span> <span>${dict.btnEdit || 'Edit'}</span>
              </button>
              <button class="btn-table-action btn-del" onclick="handleDeleteDocument(${doc.id})" title="${dict.btnDelete || 'Delete'}">
                <span>🗑️</span> <span>${dict.btnDelete || 'Delete'}</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }


  if (projListEl) {
    if (!userProjects || userProjects.length === 0) {
      projListEl.innerHTML = `<div style="text-align:center; padding:18px; font-size:0.8rem; color:var(--text-muted); background:var(--bg-panel); border-radius:10px;">No articles published to the homepage yet. Click "+ Add Article" above to create one.</div>`;
    } else {
      const recent = userProjects.slice(0, 5);
      projListEl.innerHTML = recent.map(p => {
        const title = p['title_' + currentDashboardLang] || p.title_en || p.title_si || 'Untitled Article';
        const dateStr = p.date || '';
        return `
          <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <img src="${p.image || 'assets/project1.jpg'}" style="width:40px; height:40px; border-radius:8px; object-fit:cover; flex-shrink:0;" onerror="this.src='logo.jpg'">
            <div style="min-width:0; flex:1;">
              <div style="font-weight:700; font-size:0.82rem; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(title)}</div>
              <div style="font-size:0.72rem; color:var(--text-muted); display:flex; align-items:center; gap:8px; margin-top:2px;">
                <span class="badge-pill badge-pill-green" style="font-size:0.65rem; padding:1px 6px;">Live</span>
                ${dateStr ? `<span>📅 ${escapeHtml(dateStr)}</span>` : ''}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <button class="btn-table-action" onclick="openEditProjectModal(${p.id})" title="${dict.btnEdit || 'Edit'}">
                <span>✏️</span> <span>${dict.btnEdit || 'Edit'}</span>
              </button>
              <button class="btn-table-action btn-del" onclick="handleDeleteProject(${p.id})" title="${dict.btnDelete || 'Delete'}">
                <span>🗑️</span> <span>${dict.btnDelete || 'Delete'}</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}


// 6. Modern Canvas Charts (Ultra-Crisp, High-DPI Safe, Modern Aesthetic)
// 6.1 Directives Distribution Pie / Donut Chart (High-DPI Safe, Modern Aesthetic)
function renderPieCanvas(canvasId, legendId, isOfficer) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const legendEl = document.getElementById(legendId);
  // If container is hidden in DOM, skip drawing until visible
  const parentCard = canvas.closest('.data-table-card') || canvas.parentElement;
  if (canvas.offsetParent === null && (!parentCard || parentCard.offsetParent === null)) {
    return;
  }
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
  const w = rect.width > 50 ? rect.width : (parentW > 50 ? parentW : 480);
  const h = 180;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  let docs = db.documents || [];
  if (isOfficer && currentUser && currentUser.role !== 'Super Admin') {
    const userDivId = currentUser.division_id;
    const scoped = docs.filter(d => 
      (d.created_by_user_id && String(d.created_by_user_id) === String(currentUser.id)) ||
      (d.created_by_username && d.created_by_username === currentUser.username) ||
      (userDivId && String(d.division) === String(userDivId))
    );
    if (scoped.length > 0) {
      docs = scoped;
    }
  }
  let counts = {
    circular: 0,
    publication: 0,
    application: 0,
    report: 0,
    other: 0
  };
  docs.forEach(doc => {
    const t = (doc.type || '').toLowerCase();
    if (t.includes('circ') || t === 'circular') {
      counts.circular++;
    } else if (t.includes('pub') || t.includes('rate') || t === 'publication') {
      counts.publication++;
    } else if (t.includes('app') || t.includes('form') || t === 'application') {
      counts.application++;
    } else if (t.includes('rep') || t.includes('gaz') || t === 'report') {
      counts.report++;
    } else {
      counts.other++;
    }
  });
  const total = docs.length;
  const slices = [
    { label: dict.typePublication || 'Rate Books & Pubs', count: counts.publication, color: '#D97706', bgSoft: '#FEF3C7', textCol: '#92400E' },
    { label: dict.typeCircular || 'Circulars', count: counts.circular, color: '#800000', bgSoft: '#FCEBE9', textCol: '#800000' },
    { label: dict.typeApplication || 'Applications', count: counts.application, color: '#059669', bgSoft: '#D1FAE5', textCol: '#064E3B' },
    { label: dict.typeReport || 'Gazettes & Reports', count: counts.report, color: '#2563EB', bgSoft: '#DBEAFE', textCol: '#1E40AF' },
    { label: dict.typeOther || 'Notices', count: counts.other, color: '#7C3AED', bgSoft: '#EDE9FE', textCol: '#5B21B6' }
  ].filter(s => s.count > 0);
  if (total === 0) {
    slices.push({ 
      label: currentDashboardLang === 'si' ? 'ලේඛන නොමැත' : (currentDashboardLang === 'ta' ? 'ஆவணங்கள் இல்லை' : 'No Directives'), 
      count: 1, 
      color: '#E2E8F0', 
      bgSoft: '#F1F5F9', 
      textCol: '#64748B' 
    });
  }
  const centerX = w / 2;
  const centerY = h / 2;
  const outerRadius = Math.max(20, Math.min(centerX, centerY) - 8);
  const innerRadius = outerRadius * 0.58;
  let startAngle = -Math.PI / 2;
  const sliceGap = slices.length > 1 ? 0.038 : 0;
  slices.forEach(slice => {
    const sliceAngle = total > 0 ? (slice.count / total) * (Math.PI * 2) : Math.PI * 2;
    const endAngle = startAngle + sliceAngle;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle + sliceGap / 2, endAngle - sliceGap / 2, false);
    ctx.arc(centerX, centerY, innerRadius, endAngle - sliceGap / 2, startAngle + sliceGap / 2, true);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.shadowColor = 'rgba(0,0,0,0.06)';
    ctx.shadowBlur = 4;
    ctx.fill();
    startAngle = endAngle;
  });
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  // Center Counter & Label
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#380000';
  ctx.font = "800 20px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(total, centerX, centerY - 7);
  ctx.fillStyle = '#64748B';
  ctx.font = "600 10px 'Plus Jakarta Sans', sans-serif";
  const labelWord = dict.totalDirectivesWord || (currentDashboardLang === 'si' ? 'නියෝග' : (currentDashboardLang === 'ta' ? 'வழிகாட்டல்கள்' : 'Directives'));
  ctx.fillText(labelWord, centerX, centerY + 11);
  // Update HTML Legend
  if (legendEl) {
    if (total === 0) {
      const emptyMsg = currentDashboardLang === 'si' 
        ? 'ඔබගේ අංශයේ නියෝග තවමත් පළ කර නොමැත.' 
        : (currentDashboardLang === 'ta' ? 'உங்கள் பிரிவில் இதுவரை வழிகாட்டல்கள் வெளியிடப்படவில்லை.' : 'No directives published for your division yet.');
      legendEl.innerHTML = `<span style="color:var(--text-muted); font-size:0.75rem;">${emptyMsg}</span>`;
    } else {
      legendEl.innerHTML = slices.map(s => {
        const pct = Math.round((s.count / total) * 100);
        return `
          <div style="display:inline-flex; align-items:center; gap:5px; background:${s.bgSoft}; padding:3px 8px; border-radius:6px; font-weight:700; color:${s.textCol}; font-size:0.72rem; line-height:1.2;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${s.color}; flex-shrink:0;"></span>
            <span>${escapeHtml(s.label)}: <strong>${s.count}</strong> <span style="font-weight:500; opacity:0.8;">(${pct}%)</span></span>
          </div>
        `;
      }).join('');
    }
  }
}
function drawDirectivesPieChart(targetCanvasId, targetLegendId, isOfficer) {
  if (targetCanvasId) {
    renderPieCanvas(targetCanvasId, targetLegendId, isOfficer);
    return;
  }
  // Draw for superadmin if present
  renderPieCanvas('chart-directives-pie', 'pie-chart-legend', false);
  // Draw for officer if present
  renderPieCanvas('chart-user-directives-pie', 'user-pie-chart-legend', true);
}
// 6.2 Circulars by Division Bar Chart (High-DPI Safe, Modern Vertical Rounded Bars)
function renderBarCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  // If container is hidden in DOM, skip drawing until visible
  const parentCard = canvas.closest('.data-table-card') || canvas.parentElement;
  if (canvas.offsetParent === null && (!parentCard || parentCard.offsetParent === null)) {
    return;
  }
  const ctx = canvas.getContext('2d');
  
  // High-DPI screen support & avoid layout feedback loop
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
  const w = rect.width > 50 ? rect.width : (parentW > 50 ? parentW : 500);
  const h = rect.height > 50 ? rect.height : 295;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  // Multilingual Chief Secretariat Unit names
  const divLabelsMap = {
    en: ["Administration", "Establishment", "Statistics", "Legal", "Accounts", "Digital", "Translation"],
    si: ["පරිපාලන", "ආයතන", "සංඛ්‍යාලේඛන", "නීති", "ගිණුම්", "ඩිජිටල්", "පරිවර්තන"],
    ta: ["நிர்வாகம்", "ஸ்தாபனம்", "புள்ளிவிவரம்", "சட்டம்", "கணக்குகள்", "டிஜிட்டல்", "மொழிபெயர்ப்பு"]
  };
  const divLabels = divLabelsMap[currentDashboardLang] || divLabelsMap['en'];
  const divCounts = [0, 0, 0, 0, 0, 0, 0];
  
  // Theme styling per bar
  const barThemes = [
    { start: "#380000", end: "#5A0A0A", shadow: "rgba(56, 0, 0, 0.35)", badgeBg: "#FCEBE9", text: "#380000" },
    { start: "#B45309", end: "#D97706", shadow: "rgba(180, 83, 9, 0.35)", badgeBg: "#FEF3C7", text: "#92400E" },
    { start: "#065F46", end: "#059669", shadow: "rgba(6, 95, 70, 0.35)", badgeBg: "#D1FAE5", text: "#064E3B" },
    { start: "#7C1D1D", end: "#991B1B", shadow: "rgba(124, 29, 29, 0.35)", badgeBg: "#FEE2E2", text: "#7F1D1D" },
    { start: "#92400E", end: "#B45309", shadow: "rgba(146, 64, 14, 0.35)", badgeBg: "#FDE68A", text: "#78350F" },
    { start: "#831843", end: "#9D174D", shadow: "rgba(131, 24, 67, 0.35)", badgeBg: "#FCE7F3", text: "#700A34" },
    { start: "#9A3412", end: "#C2410C", shadow: "rgba(154, 52, 18, 0.35)", badgeBg: "#FFEDD5", text: "#7C2D12" }
  ];
  (db.documents || []).forEach(doc => {
    const dId = parseInt(doc.division, 10);
    if (dId >= 1 && dId <= 7) {
      divCounts[dId - 1]++;
    }
  });
  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;
  const highestCount = Math.max(...divCounts, 4);
  const maxVal = Math.ceil((highestCount + 1) / 2) * 2; // e.g. 6 or 8
  const leftMargin = 38;
  const rightMargin = 16;
  const topMargin = 30;
  const bottomMargin = 56;
  const chartWidth = w - leftMargin - rightMargin;
  const chartHeight = h - topMargin - bottomMargin;
  // 1. Horizontal dashed grid lines & Y-axis scale numbers
  const ySteps = 4;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
  ctx.fillStyle = "#94A3B8";
  ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= ySteps; i++) {
    const val = Math.round(maxVal - (maxVal / ySteps) * i);
    const y = topMargin + (chartHeight / ySteps) * i;
    // Y-axis value
    ctx.fillText(val, leftMargin - 10, y);
    // Grid line
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(leftMargin, y);
    ctx.lineTo(w - rightMargin, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  // 2. Compute Bar Sizing & Spacing
  const numBars = divLabels.length || 7;
  const slotWidth = chartWidth / numBars;
  const barWidth = Math.min(34, Math.max(22, slotWidth * 0.44));
  divCounts.forEach((count, i) => {
    const isUserDivision = (!isSuperAdmin && userDivId && (i + 1) === Number(userDivId));
    const isOtherDivisionWhenScoped = (!isSuperAdmin && userDivId && (i + 1) !== Number(userDivId));
    const slotCenterX = leftMargin + i * slotWidth + slotWidth / 2;
    const x = slotCenterX - barWidth / 2;
    const barH = count > 0 ? Math.max(10, (count / maxVal) * chartHeight) : 5;
    const y = topMargin + chartHeight - barH;
    const theme = barThemes[i] || barThemes[0];
    ctx.save();
    if (isOtherDivisionWhenScoped) {
      ctx.globalAlpha = 0.35; // Softly dim other divisions for division officer
    }
    // 2a. Background slot pill (Track)
    ctx.fillStyle = "#F1F5F9";
    ctx.beginPath();
    ctx.roundRect(x, topMargin, barWidth, chartHeight, [12, 12, 8, 8]);
    ctx.fill();
    // 2b. Foreground Bar with Vertical Gradient
    const gradient = ctx.createLinearGradient(0, y, 0, topMargin + chartHeight);
    gradient.addColorStop(0, theme.start);
    gradient.addColorStop(1, theme.end);
    ctx.shadowColor = theme.shadow;
    ctx.shadowBlur = isUserDivision ? 14 : 8;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [10, 10, 6, 6]);
    ctx.fill();
    ctx.restore();
    // 2c. Value Pill Badge above the bar
    const badgeW = isUserDivision ? 30 : 24;
    const badgeH = 18;
    const badgeY = y - badgeH - 6;
    ctx.save();
    if (isOtherDivisionWhenScoped) ctx.globalAlpha = 0.4;
    ctx.fillStyle = theme.badgeBg;
    ctx.beginPath();
    ctx.roundRect(slotCenterX - badgeW / 2, badgeY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.fillStyle = theme.text;
    ctx.font = isUserDivision ? "800 11.5px 'Plus Jakarta Sans', sans-serif" : "800 11px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(count, slotCenterX, badgeY + badgeH / 2);
    ctx.restore();
    // 2d. Bottom Division Label (Bold, Multilingual)
    ctx.save();
    if (isOtherDivisionWhenScoped) ctx.globalAlpha = 0.45;
    ctx.fillStyle = isUserDivision ? "#380000" : "#420808";
    ctx.font = isUserDivision ? "800 11px 'Plus Jakarta Sans', sans-serif" : "700 10.5px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(divLabels[i], slotCenterX, topMargin + chartHeight + 10);
    // 2e. Secondary subtle text (e.g. "Directives" / "ලේඛන" / "Your Div")
    let subLabel = currentDashboardLang === 'si' ? 'ලේඛන' : (currentDashboardLang === 'ta' ? 'ஆவணங்கள்' : 'Directives');
    if (isUserDivision) {
      subLabel = currentDashboardLang === 'si' ? '★ ඔබගේ අංශය' : (currentDashboardLang === 'ta' ? '★ உங்கள் பிரிவு' : '★ Your Division');
    }
    ctx.fillStyle = isUserDivision ? "#380000" : "#6E5356";
    ctx.font = isUserDivision ? "800 9.5px 'Plus Jakarta Sans', sans-serif" : "600 9.5px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(subLabel, slotCenterX, topMargin + chartHeight + 25);
    ctx.restore();
  });
}
function drawDivisionsBarChart(targetCanvasId) {
  if (targetCanvasId) {
    renderBarCanvas(targetCanvasId);
    return;
  }
  // Draw for superadmin if present
  renderBarCanvas('chart-divisions-bar');
  // Draw for officer if present
  renderBarCanvas('chart-user-divisions-bar');
}
function drawSplineLineChart() {
  const canvas = document.getElementById('chart-spline-line');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');


  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width > 0 ? rect.width : 480;
  const h = rect.height > 0 ? rect.height : 270;


  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);


  ctx.clearRect(0, 0, w, h);


  const monthsMap = {
    en: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
    si: ['ජන', 'මාර්තු', 'මැයි', 'ජූලි', 'සැප්', 'නොවැ'],
    ta: ['ஜன', 'மார்ச்', 'மே', 'ஜூலை', 'செப்', 'நவ']
  };
  const months = monthsMap[currentDashboardLang] || monthsMap['en'];
  const data1 = [25, 45, 80, 55, 95, 75]; // Planned leads / circulars
  const data2 = [18, 30, 60, 42, 70, 90]; // Actual inquiries


  const bottomMargin = 40;
  const topMargin = 25;
  const leftMargin = 38;
  const rightMargin = 20;
  const chartWidth = w - leftMargin - rightMargin;
  const chartHeight = h - bottomMargin - topMargin;
  const maxVal = 100;


  // Grid lines & Y-axis labels
  const ySteps = 4;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(226, 232, 240, 0.85)";
  ctx.fillStyle = "#94A3B8";
  ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";


  for (let i = 0; i <= ySteps; i++) {
    const val = Math.round(maxVal - (maxVal / ySteps) * i);
    const y = topMargin + (chartHeight / ySteps) * i;
    ctx.fillText(val, leftMargin - 10, y);


    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(leftMargin, y);
    ctx.lineTo(w - rightMargin, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);


  // Draw smooth curve helper with gradient fill
  function drawSmoothLine(points, strokeColor, shadowColor) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);


    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);


    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.stroke();
    ctx.restore();


    // Data points circles
    points.forEach(p => {
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });
  }


  const stepX = chartWidth / (months.length - 1);
  const points1 = data1.map((val, i) => ({
    x: leftMargin + i * stepX,
    y: topMargin + chartHeight - (val / maxVal) * chartHeight
  }));


  const points2 = data2.map((val, i) => ({
    x: leftMargin + i * stepX,
    y: topMargin + chartHeight - (val / maxVal) * chartHeight
  }));


  drawSmoothLine(points1, "#ECAC58", "rgba(236, 172, 88, 0.4)");
  drawSmoothLine(points2, "#380000", "rgba(56, 0, 0, 0.4)");


  // Draw month labels
  ctx.fillStyle = "#64748B";
  ctx.font = "700 11.5px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  months.forEach((m, i) => {
    ctx.fillText(m, leftMargin + i * stepX, topMargin + chartHeight + 12);
  });
}




function renderSuperAdminOverviewLists() {
  const docsListEl = document.getElementById('superadmin-recent-docs-list');
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];


  if (docsListEl) {
    const allDocs = db.documents || [];
    if (allDocs.length === 0) {
      docsListEl.innerHTML = `<div style="text-align:center; padding:18px; font-size:0.8rem; color:var(--text-muted); background:var(--bg-panel); border-radius:10px;">No directives published yet. Click "+ Publish" above to add a document.</div>`;
    } else {
      const recent = allDocs.slice(0, 5);
      docsListEl.innerHTML = recent.map(doc => {
        const title = doc['title_' + currentDashboardLang] || doc.title_en || doc.title_si || doc.title_ta || 'Untitled Directive';
        const type = doc.type || 'Circular';
        const size = doc.size || '1.0 MB';
        const dateStr = doc.date || (doc.created_at ? doc.created_at.slice(0, 10) : '');
        const divId = doc.division;
        const unitObj = divId ? CHIEF_SECRETARIAT_UNITS.find(u => String(u.id) === String(divId)) : null;
        const divBadge = unitObj ? (unitObj['name_' + currentDashboardLang] || unitObj.name_en) : (doc.division_name || 'Directive');


        return `
          <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <div style="min-width:0; flex:1;">
              <div style="font-weight:700; font-size:0.82rem; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(title)}</div>
              <div style="font-size:0.72rem; color:var(--text-muted); display:flex; align-items:center; gap:8px; margin-top:2px; flex-wrap:wrap;">
                <span class="badge-pill badge-pill-navy" style="font-size:0.65rem; padding:1px 6px;">${escapeHtml(divBadge)}</span>
                <span style="opacity:0.85;">📁 ${escapeHtml(size)}</span>
                ${dateStr ? `<span style="opacity:0.85;">📅 ${escapeHtml(dateStr)}</span>` : ''}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <button class="btn-table-action" onclick="openEditDocModal(${doc.id})" title="${dict.btnEdit || 'Edit'}">
                <span>✏️</span> <span>${dict.btnEdit || 'Edit'}</span>
              </button>
              <button class="btn-table-action btn-del" onclick="handleDeleteDocument(${doc.id})" title="${dict.btnDelete || 'Delete'}">
                <span>🗑️</span> <span>${dict.btnDelete || 'Delete'}</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }


  // Populate recent live citizen inquiries
  renderOverviewRecentInquiries();
}


function renderOverviewRecentInquiries() {
  const container = document.getElementById('overview-recent-inquiries-list');
  if (!container) return;
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];


  const inqs = (db.inquiries || []).slice(0, 5);
  if (inqs.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:18px; font-size:0.8rem; background:var(--bg-panel); border-radius:10px;">No citizen inquiries received yet.</div>`;
    return;
  }


  container.innerHTML = inqs.map(inq => {
    const name = inq.name || inq.full_name || 'Citizen Inquirer';
    const msg = inq.message || inq.inquiry_text || inq.subject || 'Inquiry details';
    const tag = inq.nic || inq.phone || inq.email || 'Citizen';
    const dateStr = inq.date || inq.created_at || '';
    const dateFormatted = dateStr ? dateStr.slice(0, 10) : '';


    return `
      <div style="background:var(--bg-panel); border-radius:10px; padding:10px 14px; border:1px solid var(--border-soft); display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <div style="min-width:0; flex:1;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="font-weight:700; font-size:0.82rem; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(name)}</div>
            <span class="badge-pill badge-pill-amber" style="font-size:0.65rem; padding:1px 6px;">${escapeHtml(tag)}</span>
            ${dateFormatted ? `<span style="font-size:0.7rem; color:var(--text-muted);">📅 ${escapeHtml(dateFormatted)}</span>` : ''}
          </div>
          <div style="font-size:0.72rem; color:var(--text-muted); line-height:1.3; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${escapeHtml(msg)}
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button class="btn-table-action" onclick="switchAdminTab('view-inquiries', null)" style="padding:4px 10px; font-size:0.72rem;">
            <span>👁️</span> <span>${dict.btnView || 'View'}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}


// 7. Documents Management (7-Column Precision, Fully Trilingual)
function renderAdminDocuments() {
  const tableBody = document.getElementById('admin-docs-table-body');
  if (!tableBody) return;
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  const txtEdit = dict.btnEdit || (currentDashboardLang === 'si' ? 'සංස්කරණය' : (currentDashboardLang === 'ta' ? 'திருத்து' : 'Edit'));
  const txtDelete = dict.btnDelete || (currentDashboardLang === 'si' ? 'මකන්න' : (currentDashboardLang === 'ta' ? 'நீக்கு' : 'Delete'));


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;


  let docs = db.documents || [];
  if (!isSuperAdmin) {
    docs = docs.filter(doc => 
      (doc.created_by_user_id && String(doc.created_by_user_id) === String(currentUser?.id)) ||
      (doc.created_by_username && doc.created_by_username === currentUser?.username) ||
      (userDivId && String(doc.division) === String(userDivId))
    );
  }


  if (docs.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:35px;">No circulars or documents found for this division. Click "Publish New Directive" to add one.</td></tr>`;
    return;
  }


  tableBody.innerHTML = docs.map(doc => {
    // 1. Division Name resolution in active language
    const divIdStr = String(doc.division || '');
    const divObj = db.divisionsData ? db.divisionsData[divIdStr] : null;
    const unitObj = CHIEF_SECRETARIAT_UNITS.find(u => String(u.id) === divIdStr);
    let divName = '';
    if (unitObj) {
      divName = unitObj['name_' + currentDashboardLang] || unitObj.name_en;
    } else if (divObj) {
      divName = divObj['name_' + currentDashboardLang] || divObj.name_en;
    } else {
      divName = doc.division == 1 
        ? (currentDashboardLang === 'si' ? 'පරිපාලන අංශය' : (currentDashboardLang === 'ta' ? 'நிர்வாகப் பிரிவு' : 'Administration Division'))
        : (doc.division == 4 ? (currentDashboardLang === 'si' ? 'ඉංජිනේරු අංශය' : (currentDashboardLang === 'ta' ? 'பொறியியல் பிரிவு' : 'Engineering Division')) : 'Provincial Directive');
    }


    // 2. Pure Single Language Title (no bilingual subtitle)
    let title = '';


    if (currentDashboardLang === 'si') {
      title = doc.title_si || doc.title_en || doc.title_ta || 'නිල නියෝගය';


    } else if (currentDashboardLang === 'ta') {
      title = doc.title_ta || doc.title_en || doc.title_si || 'அதிகாரப்பூர்வ வழிகாட்டல்';


    } else {
      title = doc.title_en || doc.title_si || doc.title_ta || 'Official Directive';


    }


    // 3. Document Type translated badge
    const typeLabelMap = {
      'Circular': dict.optCircular || (currentDashboardLang === 'si' ? 'චක්‍රලේඛ' : (currentDashboardLang === 'ta' ? 'சுற்றறிக்கை' : 'Circular')),
      'Publication': dict.optPublication || (currentDashboardLang === 'si' ? 'ප්‍රකාශන / මිල ගණන් පොත්' : (currentDashboardLang === 'ta' ? 'வெளியீடு / விகிதப் புத்தகம்' : 'Publication / Rate Book')),
      'Application': dict.optApplication || (currentDashboardLang === 'si' ? 'අයදුම්පත් / ආකෘති' : (currentDashboardLang === 'ta' ? 'விண்ணப்பம் / படிவம்' : 'Application / Form')),
      'Report': dict.optReport || (currentDashboardLang === 'si' ? 'වාර්තා / ගැසට් පත්‍ර' : (currentDashboardLang === 'ta' ? 'அறிக்கை / வர்த்தமானி' : 'Report / Gazette')),
      'Notice': dict.typeOther || (currentDashboardLang === 'si' ? 'නිවේදන' : (currentDashboardLang === 'ta' ? 'அறிவிப்பு' : 'Notice'))
    };
    const translatedType = typeLabelMap[doc.type] || doc.type || 'Circular';


        return `
      <tr>
        <td>
          <div style="font-weight:700; color:var(--text-main); font-size:0.88rem; line-height:1.35;">${escapeHtml(title)}</div>
        </td>
        <td><span class="badge-pill badge-pill-navy" style="font-size:0.72rem;">${escapeHtml(divName)}</span></td>
        <td><span class="badge-pill badge-pill-amber" style="font-size:0.72rem;">${escapeHtml(translatedType)}</span></td>
        <td style="text-align:right;">
          ${(!currentUser || !currentUser.division_id || String(doc.division) === String(currentUser.division_id)) ? `
            <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:6px;">
              <button class="btn-table-action" title="${txtEdit}" onclick="openEditDocModal(${doc.id})">
                <span>✏️</span> <span>${txtEdit}</span>
              </button>
              <button class="btn-table-action btn-del" title="${txtDelete}" onclick="handleDeleteDocument(${doc.id})">
                <span>🗑️</span> <span>${txtDelete}</span>
              </button>
            </div>
          ` : `<span style="font-size:0.75rem; color:var(--text-muted); font-style:italic; padding-right:8px;">Read only</span>`}
        </td>
      </tr>
    `;
  }).join('');
}


function filterAdminDocs() {
  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;


  const q = (document.querySelector('#view-documents input[type="text"]')?.value || '').toLowerCase();
  const divFilter = (!isSuperAdmin && userDivId) ? String(userDivId) : (document.getElementById('filter-doc-division')?.value || '');
  const typeFilter = document.getElementById('filter-doc-type')?.value || '';


  const tableBody = document.getElementById('admin-docs-table-body');
  if (!tableBody) return;


  let baseDocs = db.documents || [];
  if (!isSuperAdmin && userDivId) {
    baseDocs = baseDocs.filter(doc => String(doc.division) === String(userDivId));
  }


  const filtered = baseDocs.filter(doc => {
    const title = ((doc.title_en || '') + ' ' + (doc.title_si || '') + ' ' + (doc.title_ta || '')).toLowerCase();
    const matchQ = title.includes(q);
    const matchDiv = divFilter === '' || String(doc.division) === String(divFilter);
    const matchType = typeFilter === '' || doc.type === typeFilter;
    return matchQ && matchDiv && matchType;
  });


  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:30px;">No documents match the active search or filters.</td></tr>`;
    return;
  }


  // Render filtered list
  const original = db.documents;
  db.documents = filtered;
  renderAdminDocuments();
  db.documents = original;
}


function populateDocDivisionDropdown(editingUserId = null) {
  const allUnits = getAllAssignableUnits();
  const mainDivs = Object.values(db.divisionsData || {});


  // 1. User selection dropdown for Admin User Management (Rich grouped hierarchy)
  const userSelects = [
    document.getElementById('user-division')
  ];


  userSelects.forEach(sel => {
    if (!sel) return;
    const firstOpt = sel.options[0];
    const keepFirst = firstOpt && (firstOpt.value === '' || firstOpt.disabled);
    sel.innerHTML = '';
    if (keepFirst) sel.appendChild(firstOpt);


    mainDivs.forEach(div => {
      const divId = parseInt(div.id, 10);
      const divUnits = allUnits.filter(u => u.id === divId || u.parent_id === divId);
      if (divUnits.length === 0) return;


      const optgroup = document.createElement('optgroup');
      optgroup.label = `🏛️ ${div['name_' + currentDashboardLang] || div.name_en}`;


      divUnits.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.setAttribute('data-parent-id', u.parent_id || u.id);
        opt.setAttribute('data-unit-name', u.unit_raw || u.name_en);
        const uDisplayName = u['name_' + currentDashboardLang] || u.name_en;


        if (Array.isArray(usersList)) {
          const assignedUser = usersList.find(usr => {
            if (editingUserId && String(usr.id) === String(editingUserId)) return false;
            const targetUnit = (u.unit_raw || u.name_en || '').toLowerCase().trim();
            const usrUnit = (usr.unit_name || '').toLowerCase().trim();
            if (usrUnit && (usrUnit === targetUnit || targetUnit.includes(usrUnit) || usrUnit.includes(targetUnit))) return true;
            if (!u.parent_id && String(usr.division_id) === String(u.id) && (!usr.unit_name || usr.unit_name === u.name_en)) return true;
            return false;
          });
          if (assignedUser) {
            opt.textContent = `${uDisplayName} — [Assigned: ${assignedUser.username}]`;
            opt.disabled = true;
            opt.style.color = '#94A3B8';
          } else {
            opt.textContent = uDisplayName;
          }
        } else {
          opt.textContent = uDisplayName;
        }


        optgroup.appendChild(opt);
      });


      sel.appendChild(optgroup);
    });
  });


  // 2. Document & Filter dropdowns (Main Divisions)
  const docSelects = [
    document.getElementById('doc-division'),
    document.getElementById('filter-doc-division'),
    document.getElementById('folder-division-select'),
    document.getElementById('officer-division-select'),
    document.getElementById('sub-div-parent-select')
  ];


  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  docSelects.forEach(sel => {
    if (!sel) return;
    const curVal = sel.value;
    sel.innerHTML = '';


    if (sel.id === 'filter-doc-division') {
      const allDivOpt = document.createElement('option');
      allDivOpt.value = '';
      allDivOpt.textContent = dict.optAllDivisions || (currentDashboardLang === 'si' ? 'සියලුම අංශ' : (currentDashboardLang === 'ta' ? 'அனைத்துப் பிரிவுகளும்' : 'All Divisions'));
      sel.appendChild(allDivOpt);
    } else if (sel.id === 'folder-division-select') {
      const allDivOpt = document.createElement('option');
      allDivOpt.value = '';
      allDivOpt.textContent = dict.folderChooseDivision || (currentDashboardLang === 'si' ? 'සියලුම අංශ / තෝරන්න' : (currentDashboardLang === 'ta' ? 'அனைத்துப் பிரிவுகளும் / தேர்வு' : 'All Divisions / Choose'));
      sel.appendChild(allDivOpt);
    } else {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = dict.lblDivision || 'Select Division';
      sel.appendChild(defaultOpt);
    }


    mainDivs.forEach(div => {
      const opt = document.createElement('option');
      opt.value = div.id;
      const dName = div['name_' + currentDashboardLang] || div.name_en;
      opt.textContent = `${div.id}. ${dName}`;
      sel.appendChild(opt);
    });


    if (curVal && Array.from(sel.options).some(o => o.value === curVal)) {
      sel.value = curVal;
    }
  });

  // Keep officer registration dropdown synchronized
  if (typeof populateRegisterUnitsDropdown === 'function') {
    populateRegisterUnitsDropdown();
  }
}


// Document Modal
function openAddDocModal() {
  document.getElementById('form-doc').reset();
  document.getElementById('doc-id').value = '';
  pendingUploadFile = null;


  syncModalLangWithDashboard(currentDashboardLang);
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  const titleEl = document.getElementById('modal-doc-title');
  if (titleEl) titleEl.textContent = dict.modalDocTitleAdd || 'Publish New Document';
  const saveBtn = document.getElementById('btn-save-doc');
  if (saveBtn) saveBtn.innerHTML = `<span>💾</span> <span>${dict.btnSaveDoc || 'Save Document'}</span>`;
  const fileLbl = document.getElementById('doc-file-label');
  if (fileLbl) fileLbl.textContent = dict.lblDropzonePrompt || 'Click to browse or drop file here';
  const fileSub = document.getElementById('doc-file-sub');
  if (fileSub) fileSub.textContent = dict.lblDropzoneSub || 'PDF, DOC, DOCX, XLS (Max 50MB)';
  updateDocTypeOptions(currentDashboardLang);


  const divSelect = document.getElementById('doc-division');
  const divHint = document.getElementById('doc-division-hint');


  // Normalize division_id for Chief Secretariat units (Legal Unit belongs strictly to 1)
  const chiefUnits = ['legal unit', 'establishment office', 'statistical unit', 'accounts unit', 'digital division (ict + gis)', 'translation unit', 'administration division'];
  if (currentUser && currentUser.unit_name && chiefUnits.includes(currentUser.unit_name.toLowerCase().trim())) {
    currentUser.division_id = 1;
    sessionStorage.setItem('admin_user', JSON.stringify(currentUser));
    sessionStorage.setItem('nwp_admin_user', JSON.stringify(currentUser));
  }


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;


  // RBAC: Division officers can ONLY publish to their assigned division / unit
  if (!isSuperAdmin && userDivId) {
    const divObj = db.divisionsData?.[String(userDivId)];
    const divName = divObj ? (divObj['name_' + currentDashboardLang] || divObj.name_en) : `Division ${userDivId}`;
    const rawUnit = currentUser.unit_name;
    const isSubUnit = rawUnit && rawUnit !== 'Chief Secretariat (All Units)' && rawUnit !== 'General Unit';
    const unitName = isSubUnit ? getTranslatedUnitName(rawUnit, currentDashboardLang) : '';
    const icon = getUnitIcon(rawUnit || divName);
    const displayLabel = unitName && unitName !== divName
      ? `${icon} ${unitName} (${userDivId}. ${divName})`
      : `${icon} ${userDivId}. ${divName}`;


    divSelect.innerHTML = `<option value="${userDivId}" selected>${escapeHtml(displayLabel)}</option>`;
    divSelect.disabled = true;
    divSelect.style.background = '#F1F5F9';
    divSelect.style.cursor = 'not-allowed';
    if (divHint) {
      const hintText = currentDashboardLang === 'si' ? `🔒 සෘජු ප්‍රකාශනය: ලේඛනය ඔබගේ අංශය යටතේ සෘජුව පළ කරනු ලැබේ (${displayLabel}).` :
                       currentDashboardLang === 'ta' ? `🔒 நேரடி வெளியீடு: ஆவணம் உங்கள் பிரிவின் கீழ் வெளியிடப்படும் (${displayLabel}).` :
                       `🔒 Direct Publishing: Document will be published under your assigned unit (${displayLabel}).`;
      divHint.textContent = hintText;
      divHint.style.display = 'block';
    }
  } else {
    // Super Admin / Central Admin can publish to any division
    divSelect.disabled = false;
    divSelect.style.background = '';
    divSelect.style.cursor = '';
    populateDocDivisionDropdown();
    if (divHint) divHint.style.display = 'none';
  }


  openModal('modal-doc');
}


function openEditDocModal(id) {
  const doc = (db.documents || []).find(d => d.id === id);
  if (!doc) return;


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;


  // RBAC: Division officers can ONLY edit their own division documents
  if (!isSuperAdmin && userDivId && String(doc.division) !== String(userDivId)) {
    alert(currentDashboardLang === 'si' ? "ප්‍රවේශය ප්‍රතික්ෂේප විය: ඔබට සංස්කරණය කළ හැක්කේ ඔබගේ අංශයට අයත් ලේඛන පමණි." :
          currentDashboardLang === 'ta' ? "அணுகல் மறுக்கப்பட்டது: உங்கள் பிரிவுக்குரிய ஆவணங்களை மட்டுமே நீங்கள் திருத்த முடியும்." :
          "Access Denied: You can only edit documents belonging to your assigned division.");
    return;
  }


  const primaryTitle = (currentDashboardLang === 'si' ? (doc.title_si || doc.title_en || doc.title_ta) :
                        currentDashboardLang === 'ta' ? (doc.title_ta || doc.title_en || doc.title_si) :
                        (doc.title_en || doc.title_si || doc.title_ta)) || '';


  document.getElementById('doc-id').value = doc.id;
  document.getElementById('doc-title-en').value = doc.title_en || primaryTitle;
  document.getElementById('doc-title-si').value = doc.title_si || primaryTitle;
  document.getElementById('doc-title-ta').value = doc.title_ta || primaryTitle;
  document.getElementById('doc-type').value = doc.type;
  document.getElementById('doc-size').value = doc.size;
  document.getElementById('doc-featured').checked = !!doc.featured;
  pendingUploadFile = null;


  syncModalLangWithDashboard(currentDashboardLang);
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  const titleEl = document.getElementById('modal-doc-title');
  if (titleEl) titleEl.textContent = dict.modalDocTitleEdit || 'Edit Official Document';
  const saveBtn = document.getElementById('btn-save-doc');
  if (saveBtn) saveBtn.innerHTML = `<span>💾</span> <span>${dict.btnSaveDocEditing || 'Save Changes'}</span>`;
  document.getElementById('doc-file-label').textContent = doc.url ? `Existing file: ${doc.url.split('/').pop()}` : (dict.lblDropzonePrompt || 'Click to change file');


  const divSelect = document.getElementById('doc-division');
  const divHint = document.getElementById('doc-division-hint');


  if (!isSuperAdmin && userDivId) {
    const divObj = db.divisionsData?.[String(userDivId)];
    const divName = divObj ? (divObj['name_' + currentDashboardLang] || divObj.name_en) : `Division ${userDivId}`;
    const rawUnit = currentUser.unit_name;
    const isSubUnit = rawUnit && rawUnit !== 'Chief Secretariat (All Units)' && rawUnit !== 'General Unit';
    const unitName = isSubUnit ? getTranslatedUnitName(rawUnit, currentDashboardLang) : '';
    const icon = getUnitIcon(rawUnit || divName);
    const displayLabel = unitName && unitName !== divName
      ? `${icon} ${unitName} (${userDivId}. ${divName})`
      : `${icon} ${userDivId}. ${divName}`;


    divSelect.innerHTML = `<option value="${userDivId}" selected>${escapeHtml(displayLabel)}</option>`;
    divSelect.disabled = true;
    divSelect.style.background = '#F1F5F9';
    divSelect.style.cursor = 'not-allowed';
    if (divHint) {
      const hintText = currentDashboardLang === 'si' ? `🔒 සෘජු ප්‍රකාශනය: ලේඛනය ඔබගේ අංශය යටතේ සෘජුව පළ කරනු ලැබේ (${displayLabel}).` :
                       currentDashboardLang === 'ta' ? `🔒 நேரடி வெளியீடு: ஆவணம் உங்கள் பிரிவின் கீழ் வெளியிடப்படும் (${displayLabel}).` :
                       `🔒 Direct Publishing: Document is assigned to your unit (${displayLabel}).`;
      divHint.textContent = hintText;
      divHint.style.display = 'block';
    }
  } else {
    populateDocDivisionDropdown();
    divSelect.value = doc.division;
    divSelect.disabled = false;
    divSelect.style.background = '';
    divSelect.style.cursor = '';
    if (divHint) divHint.style.display = 'none';
  }


  openModal('modal-doc');
}


/**
 * Automatically compress and downscale an image file using browser Canvas before upload.
 * Reduces bandwidth usage, accelerates upload speeds, and avoids server file limit errors.
 *
 * @param {File} file - The original File object from <input type="file">
 * @param {number} maxWidth - Maximum width in pixels (default: 1920)
 * @param {number} maxHeight - Maximum height in pixels (default: 1920)
 * @param {number} quality - Compression quality between 0.1 and 1.0 (default: 0.82)
 * @returns {Promise<File>} - Resolves with compressed File, or original if compression is not beneficial
 */
async function compressImageFile(file, maxWidth = 1920, maxHeight = 1920, quality = 0.82) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file;
  }
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }
  if (file.size < 250 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          return resolve(file);
        }

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        const isPng = file.type === 'image/png';
        const mimeType = isPng ? 'image/png' : 'image/jpeg';
        if (!isPng) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob && blob.size > 0 && blob.size < file.size) {
            const compressedFile = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now()
            });
            console.log(`[Compression] Client-optimized ${file.name}: ${(file.size / 1024).toFixed(1)} KB -> ${(compressedFile.size / 1024).toFixed(1)} KB`);
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, mimeType, quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    } catch (err) {
      console.warn("Client-side image compression fallback:", err);
      resolve(file);
    }
  });
}


/**
 * Automatically compress and optimize document files (PDFs and Scanned Images)
 * entirely inside the browser prior to uploading.
 * 100% Client-side, 100% Free, Zero server overhead.
 *
 * @param {File} file - Original file chosen by user
 * @returns {Promise<{file: File, origBytes: number, newBytes: number, savings: number, optimized: boolean}>}
 */
async function compressDocumentFile(file) {
  if (!file) return { file, origBytes: 0, newBytes: 0, savings: 0, optimized: false };
  const origBytes = file.size;

  // 1. If it's an Image Document (JPG/PNG/WebP scanned circular/letter)
  if (file.type && file.type.startsWith('image/')) {
    const compressed = await compressImageFile(file, 1920, 1920, 0.82);
    const newBytes = compressed.size;
    const savings = origBytes > 0 && newBytes < origBytes ? Math.round(((origBytes - newBytes) / origBytes) * 100) : 0;
    return {
      file: compressed,
      origBytes,
      newBytes,
      savings,
      optimized: savings > 0
    };
  }

  // 2. If it's a PDF Document
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (isPdf && window.PDFLib && window.PDFLib.PDFDocument) {
    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await window.PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
      const optimizedBytes = await pdfDoc.save({ useObjectStreams: true });
      if (optimizedBytes && optimizedBytes.length > 0 && optimizedBytes.length < origBytes) {
        const compressedFile = new File([optimizedBytes], file.name, {
          type: 'application/pdf',
          lastModified: Date.now()
        });
        const savings = Math.round(((origBytes - compressedFile.size) / origBytes) * 100);
        console.log(`[PDF Compression] Client-optimized ${file.name}: ${(origBytes / 1024).toFixed(1)} KB -> ${(compressedFile.size / 1024).toFixed(1)} KB (-${savings}%)`);
        return {
          file: compressedFile,
          origBytes,
          newBytes: compressedFile.size,
          savings,
          optimized: true
        };
      }
    } catch (pdfErr) {
      console.warn("Client-side PDF optimization fallback:", pdfErr);
    }
  }

  // Fallback: Return original
  return {
    file,
    origBytes,
    newBytes: origBytes,
    savings: 0,
    optimized: false
  };
}


async function handleFileChosen(input) {
  if (!input.files || !input.files[0]) return;
  const rawFile = input.files[0];
  const labelEl = document.getElementById('doc-file-label');
  const sizeInput = document.getElementById('doc-size');

  const lang = currentDashboardLang || 'en';
  const optimizingText = lang === 'si' 
    ? '⚡ ගොනුව Browser එකෙන්ම Compress වෙමින් පවතී... ⏳' 
    : (lang === 'ta' ? '⚡ ஆவணம் சுருக்கப்படுகிறது... ⏳' : '⚡ Optimizing document in browser... ⏳');
  if (labelEl) labelEl.textContent = optimizingText;

  // Run client-side optimization immediately upon selection
  const result = await compressDocumentFile(rawFile);
  pendingUploadFile = result.file;

  const formatSize = (bytes) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return Math.round(bytes / 1024) + ' KB';
  };

  const origStr = formatSize(result.origBytes);
  const newStr = formatSize(result.newBytes);

  if (result.optimized) {
    const savedStr = lang === 'si' 
      ? `${result.savings}% ඉතිරියි` 
      : (lang === 'ta' ? `${result.savings}% சேமிக்கப்பட்டது` : `-${result.savings}% saved`);
    if (labelEl) {
      labelEl.innerHTML = `<span style="color:#059669; font-weight:700;">✅ ${rawFile.name}</span> <span style="font-size:0.75rem; color:#475569;">(${origStr} ➔ ⚡ <strong>${newStr}</strong> | ${savedStr})</span>`;
    }
  } else {
    const prefix = lang === 'si' ? 'තෝරාගත් ගොනුව' : (lang === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected');
    if (labelEl) {
      labelEl.textContent = `${prefix}: ${rawFile.name} (${newStr})`;
    }
  }

  if (sizeInput) {
    sizeInput.value = newStr;
  }
}


let docTitleTranslateTimer = null;
function handleDocTitleBlur(inputEl) {
  if (!inputEl) return;
  const val = inputEl.value.trim();
  if (!val) return;


  const enInput = document.getElementById('doc-title-en');
  const siInput = document.getElementById('doc-title-si');
  const taInput = document.getElementById('doc-title-ta');


  const enVal = enInput ? enInput.value.trim() : '';
  const siVal = siInput ? siInput.value.trim() : '';
  const taVal = taInput ? taInput.value.trim() : '';


  // Only auto-translate if at least one other field is currently empty
  if (!enVal || !siVal || !taVal) {
    clearTimeout(docTitleTranslateTimer);
    docTitleTranslateTimer = setTimeout(() => {
      handleAutoTranslateDocTitles(false);
    }, 250);
  }
}
window.handleDocTitleBlur = handleDocTitleBlur;


let projTitleTranslateTimer = null;
let projDescTranslateTimer = null;


function handleProjTitleBlur(inputEl) {
  if (!inputEl) return;
  const val = inputEl.value.trim();
  if (!val || /^[\s\.\,\-]+$/.test(val)) return;


  const enInput = document.getElementById('project-title-en');
  const siInput = document.getElementById('project-title-si');
  const taInput = document.getElementById('project-title-ta');


  const enVal = enInput ? enInput.value.trim() : '';
  const siVal = siInput ? siInput.value.trim() : '';
  const taVal = taInput ? taInput.value.trim() : '';


  const isBlank = s => !s || /^[\s\.\,\-]+$/.test(s);
  if (isBlank(enVal) || isBlank(siVal) || isBlank(taVal)) {
    clearTimeout(projTitleTranslateTimer);
    projTitleTranslateTimer = setTimeout(async () => {
      let sl = (inputEl.id === 'project-title-si') ? 'si' : ((inputEl.id === 'project-title-ta') ? 'ta' : 'auto');
      try {
        const res = await fetch(`api.php?action=translate_all&text=${encodeURIComponent(val)}&sl=${sl}`);
        if (res.ok) {
          const d = await res.json();
          if (d.success && d.translations) {
            if (enInput && isBlank(enInput.value)) enInput.value = d.translations.en || val;
            if (siInput && isBlank(siInput.value)) siInput.value = cleanSinhalaOrthography(d.translations.si || val);
            if (taInput && isBlank(taInput.value)) taInput.value = d.translations.ta || val;
          }
        }
      } catch (e) {}
    }, 350);
  }
}
window.handleProjTitleBlur = handleProjTitleBlur;


function handleProjDescBlur(inputEl) {
  if (!inputEl) return;
  const val = inputEl.value.trim();
  if (!val || /^[\s\.\,\-]+$/.test(val)) return;


  const enInput = document.getElementById('project-desc-en');
  const siInput = document.getElementById('project-desc-si');
  const taInput = document.getElementById('project-desc-ta');


  const enVal = enInput ? enInput.value.trim() : '';
  const siVal = siInput ? siInput.value.trim() : '';
  const taVal = taInput ? taInput.value.trim() : '';


  const isBlank = s => !s || /^[\s\.\,\-]+$/.test(s);
  if (isBlank(enVal) || isBlank(siVal) || isBlank(taVal)) {
    clearTimeout(projDescTranslateTimer);
    projDescTranslateTimer = setTimeout(async () => {
      let sl = (inputEl.id === 'project-desc-si') ? 'si' : ((inputEl.id === 'project-desc-ta') ? 'ta' : 'auto');
      try {
        const res = await fetch(`api.php?action=translate_all&text=${encodeURIComponent(val)}&sl=${sl}`);
        if (res.ok) {
          const d = await res.json();
          if (d.success && d.translations) {
            if (enInput && isBlank(enInput.value)) enInput.value = d.translations.en || val;
            if (siInput && isBlank(siInput.value)) siInput.value = cleanSinhalaOrthography(d.translations.si || val);
            if (taInput && isBlank(taInput.value)) taInput.value = d.translations.ta || val;
          }
        }
      } catch (e) {}
    }, 350);
  }
}
window.handleProjDescBlur = handleProjDescBlur;




async function handleAutoTranslateDocTitles(showToastNotice = false) {
  const enInput = document.getElementById('doc-title-en');
  const siInput = document.getElementById('doc-title-si');
  const taInput = document.getElementById('doc-title-ta');
  const btn = document.getElementById('btn-doc-auto-trans');
  const icon = document.getElementById('doc-auto-trans-icon');
  const textSpan = document.getElementById('doc-auto-trans-text');


  const enVal = enInput ? enInput.value.trim() : '';
  const siVal = siInput ? siInput.value.trim() : '';
  const taVal = taInput ? taInput.value.trim() : '';


  let sourceText = '';
  let sl = 'auto';


  // Priority order based on which has input
  if (siVal && !enVal && !taVal) {
    sourceText = siVal;
    sl = 'si';
  } else if (taVal && !enVal && !siVal) {
    sourceText = taVal;
    sl = 'ta';
  } else if (enVal && !siVal && !taVal) {
    sourceText = enVal;
    sl = 'en';
  } else if (siVal) {
    sourceText = siVal;
    sl = 'si';
  } else if (enVal) {
    sourceText = enVal;
    sl = 'en';
  } else if (taVal) {
    sourceText = taVal;
    sl = 'ta';
  }


  if (!sourceText) {
    if (showToastNotice) {
      showToast(currentDashboardLang === 'si' ? "කරුණාකර අවම වශයෙන් එක් භාෂාවකින් මාතෘකාවක් ඇතුළත් කරන්න." : "Please enter a title in at least one language first.");
    }
    return;
  }


  if (btn) btn.disabled = true;
  if (icon) icon.textContent = '⏳';
  if (textSpan) textSpan.textContent = currentDashboardLang === 'si' ? 'පරිවර්තනය වෙමින්...' : 'Translating...';


  try {
    const res = await fetch(`api.php?action=translate_doc_title&sl=${sl}&text=${encodeURIComponent(sourceText)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.translations) {
        if (enInput && (!enVal || showToastNotice)) enInput.value = data.translations.en || sourceText;
        if (siInput && (!siVal || showToastNotice)) siInput.value = cleanSinhalaOrthography(data.translations.si || sourceText);
        if (taInput && (!taVal || showToastNotice)) taInput.value = data.translations.ta || sourceText;


        if (showToastNotice) {
          showToast(currentDashboardLang === 'si' ? "✨ මාතෘකාව භාෂා 3ටම සාර්ථකව පරිවර්තනය විය!" : "✨ Title auto-translated into all 3 languages!");
        }
      }
    }
  } catch (err) {
    console.warn("Document auto-translate error:", err);
    if (showToastNotice) showToast("⚠️ Translation request failed.");
  } finally {
    if (btn) btn.disabled = false;
    if (icon) icon.textContent = '⚡';
    if (textSpan) textSpan.textContent = adminTranslations[currentDashboardLang]?.btnAutoTranslateShort || 'Auto-Translate';
  }
}
window.handleAutoTranslateDocTitles = handleAutoTranslateDocTitles;


async function handleSaveDocument(e) {
  e.preventDefault();
  const id = document.getElementById('doc-id').value;
  const saveBtn = document.getElementById('btn-save-doc');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span>Saving...</span> ⏳';


  let uploadedUrl = '';
  let uploadedSize = '';


  // Upload file if new file chosen (with auto image optimization)
  if (pendingUploadFile) {
    let fileToUpload = pendingUploadFile;
    if (fileToUpload.type && fileToUpload.type.startsWith('image/')) {
      fileToUpload = await compressImageFile(fileToUpload);
    }
    const formData = new FormData();
    formData.append('file', fileToUpload);
    if (currentUser && currentUser.username) {
      formData.append('username', currentUser.username);
    }
    try {
      const upRes = await fetch('api.php?action=upload', {
        method: 'POST',
        body: formData
      });
      const upData = await upRes.json();
      if (upRes.ok && upData.success) {
        uploadedUrl = upData.url;
        uploadedSize = upData.size;
      }
    } catch (err) {
      console.warn("File upload failed, proceeding with form values:", err);
    }
  }


  let titleEn = document.getElementById('doc-title-en').value.trim();
  let titleSi = document.getElementById('doc-title-si').value.trim();
  let titleTa = document.getElementById('doc-title-ta').value.trim();


  let primaryDocTitle = '';
  if (currentDashboardLang === 'si' && titleSi) primaryDocTitle = titleSi;
  else if (currentDashboardLang === 'ta' && titleTa) primaryDocTitle = titleTa;
  else if (currentDashboardLang === 'en' && titleEn) primaryDocTitle = titleEn;
  else primaryDocTitle = titleSi || titleEn || titleTa;


  if (!primaryDocTitle) {
    const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
    alert(currentDashboardLang === 'si' ? "කරුණාකර අවම වශයෙන් එක් භාෂාවකින් හෝ ලේඛන මාතෘකාව ඇතුළත් කරන්න." :
          currentDashboardLang === 'ta' ? "தயவுசெய்து குறைந்தபட்சம் ஒரு மொழියிலாவது ஆவணத்தின் தலைப்பை உள்ளிடவும்." :
          "Please enter a document title in at least one language.");
    saveBtn.disabled = false;
    saveBtn.innerHTML = `<span>💾</span> ${dict.btnSaveDoc || 'Save Document'}`;
    return;
  }


  // Seamless auto-translation: If user entered any 1 language, auto-translate missing ones without user involvement!
  if (!titleEn || !titleSi || !titleTa) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span>⚡</span> <span>${currentDashboardLang === 'si' ? 'ස්වයංක්‍රීය පරිවර්තනය සිදුවේ...' : (currentDashboardLang === 'ta' ? 'தானியங்கி மொழிபெயர்ப்பு...' : 'Auto-translating titles...')}</span>`;
    try {
      let sl = 'auto';
      if (titleSi && !titleEn && !titleTa) sl = 'si';
      else if (titleTa && !titleEn && !titleSi) sl = 'ta';
      else if (titleEn && !titleSi && !titleTa) sl = 'en';
      else if (titleSi) sl = 'si';
      else if (titleEn) sl = 'en';


      const res = await fetch(`api.php?action=translate_doc_title&sl=${sl}&text=${encodeURIComponent(primaryDocTitle)}`);
      if (res.ok) {
        const tData = await res.json();
        if (tData.success && tData.translations) {
          if (!titleEn) titleEn = tData.translations.en || primaryDocTitle;
          if (!titleSi) titleSi = cleanSinhalaOrthography(tData.translations.si || primaryDocTitle);
          if (!titleTa) titleTa = tData.translations.ta || primaryDocTitle;
        }
      }
    } catch (e) {
      console.warn("Auto translation on save error:", e);
    }
  }


  if (!titleEn) titleEn = primaryDocTitle;
  if (!titleSi) titleSi = primaryDocTitle;
  if (!titleTa) titleTa = primaryDocTitle;


  // Sync inputs back so user sees all 3 fields populated
  if (document.getElementById('doc-title-en')) document.getElementById('doc-title-en').value = titleEn;
  if (document.getElementById('doc-title-si')) document.getElementById('doc-title-si').value = titleSi;
  if (document.getElementById('doc-title-ta')) document.getElementById('doc-title-ta').value = titleTa;
  
  // Enforce assigned division for division officers (chief units strictly belong to 1)
  const chiefUnits = ['legal unit', 'establishment office', 'statistical unit', 'accounts unit', 'digital division (ict + gis)', 'translation unit', 'administration division'];
  if (currentUser && currentUser.unit_name && chiefUnits.includes(currentUser.unit_name.toLowerCase().trim())) {
    currentUser.division_id = 1;
  }


  let division = document.getElementById('doc-division').value;
  if (currentUser && currentUser.division_id) {
    division = String(currentUser.division_id);
  }


  const type = document.getElementById('doc-type').value;
  const size = uploadedSize || document.getElementById('doc-size').value.trim() || '1.0 MB';
  const featured = document.getElementById('doc-featured').checked ? 1 : 0;


  if (id) {
    // Edit existing
    const existing = db.documents.find(d => d.id == id);
    if (existing) {
      existing.title_en = titleEn;
      existing.title_si = titleSi;
      existing.title_ta = titleTa;
      existing.division = division;
      existing.type = type;
      existing.size = size;
      existing.featured = featured;
      if (uploadedUrl) {
        existing.url = uploadedUrl;
        existing.url_en = uploadedUrl;
      }
      if (!existing.created_at) {
        existing.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      if (!existing.date) {
        existing.date = existing.created_at.slice(0, 10);
      }
    }
  } else {
    // Create new
    const nowIso = new Date().toISOString();
    const newDoc = {
      id: Date.now(),
      title_en: titleEn,
      title_si: titleSi,
      title_ta: titleTa,
      division: division,
      type: type,
      size: size,
      url: uploadedUrl || 'uploads/Citizen_Declaration_1786465539.pdf',
      url_en: uploadedUrl || 'uploads/Citizen_Declaration_1786465539.pdf',
      url_si: uploadedUrl || '',
      url_ta: uploadedUrl || '',
      is_new: 1,
      featured: featured,
      created_by_user_id: currentUser ? currentUser.id : 1,
      created_by_username: currentUser ? currentUser.username : 'admin',
      created_at: nowIso.slice(0, 19).replace('T', ' '),
      date: nowIso.slice(0, 10)
    };
    db.documents.unshift(newDoc);
  }


  // Persist to MySQL
  await saveEntireDatabaseToServer();
  closeModal('modal-doc');
  saveBtn.disabled = false;
  saveBtn.innerHTML = '<span>💾</span> Save Document';
  showToast("⚡ Document published live to web portal immediately! (No admin approval required)");
  renderAllViews();
}


async function handleDeleteDocument(id) {
  const doc = (db.documents || []).find(d => d.id == id);
  if (!doc) return;


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  if (!isSuperAdmin) {
    const isOwner = (doc.created_by_user_id && String(doc.created_by_user_id) === String(currentUser.id)) ||
                    (doc.created_by_username && doc.created_by_username === currentUser.username) ||
                    (currentUser.division_id && String(doc.division) === String(currentUser.division_id));
    if (!isOwner) {
      alert("Access Denied: You can only delete documents uploaded by your account.");
      return;
    }
  }


  if (confirm("Are you sure you want to delete this document from the registry?")) {
    db.documents = (db.documents || []).filter(d => d.id != id);
    await saveEntireDatabaseToServer();
    showToast("Document deleted.");
    renderAllViews();
  }
}


// 8. Divisions Management
function getTranslatedUnitName(unitName, lang = currentDashboardLang) {
  if (!unitName) return '';
  const clean = String(unitName).trim().toLowerCase();
  
  if (typeof getAllAssignableUnits === 'function') {
    const allUnits = getAllAssignableUnits();
    const match = allUnits.find(u => 
      (u.name_en && u.name_en.trim().toLowerCase() === clean) ||
      (u.name_si && u.name_si.trim().toLowerCase() === clean) ||
      (u.name_ta && u.name_ta.trim().toLowerCase() === clean)
    );
    if (match) return match['name_' + lang] || match.name_en || unitName;
  }
  
  if (typeof CHIEF_SECRETARIAT_UNITS !== 'undefined' && Array.isArray(CHIEF_SECRETARIAT_UNITS)) {
    const cMatch = CHIEF_SECRETARIAT_UNITS.find(u =>
      (u.name_en && u.name_en.trim().toLowerCase() === clean) ||
      (u.name_si && u.name_si.trim().toLowerCase() === clean) ||
      (u.name_ta && u.name_ta.trim().toLowerCase() === clean)
    );
    if (cMatch) return cMatch['name_' + lang] || cMatch.name_en || unitName;
  }


  return unitName;
}


function renderAdminDivisions() {
  const container = document.getElementById('admin-divisions-accordion');
  if (!container) return;


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;


  let divs = Object.values(db.divisionsData || {});
  if (!isSuperAdmin && userDivId) {
    divs = divs.filter(div => String(div.id) === String(userDivId));
  }


  const lang = currentDashboardLang || 'en';


  const noDivsText = lang === 'si'
    ? 'කිසිදු අංශයක් වින්‍යාස කර නොමැත.'
    : (lang === 'ta' ? 'பிரிவுகள் எதுவும் கட்டமைக்கப்படவில்லை.' : 'No divisions configured.');


  if (divs.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">${noDivsText}</div>`;
    return;
  }


  // Multilingual UI labels
  const subUnitsLabel = lang === 'si' ? 'අනු අංශ සහ ඒකක:' : (lang === 'ta' ? 'துணைப் பிரிவுகள் & அலகுகள்:' : 'Sub-Units & Sections:');
  const addSubBtnText = lang === 'si' ? '+ අනු අංශයක් එක් කරන්න' : (lang === 'ta' ? '+ துணைப் பிரிவைச் சேர்க்க' : '+ Add Sub-Unit');
  const keyOfficialsLabel = lang === 'si' ? 'පත් කරන ලද ප්‍රධාන නිලධාරීන්:' : (lang === 'ta' ? 'நியமிக்கப்பட்ட முக்கிய அதிகாரிகள்:' : 'Designated Key Officials:');
  const addBtnText = lang === 'si' ? '+ නිලධාරියෙකු එක් කරන්න' : (lang === 'ta' ? '+ அதிகாரியைச் சேர்க்க' : '+ Add Official');
  const editBtnText = lang === 'si' ? '✏️ සංස්කරණය' : (lang === 'ta' ? '✏️ திருத்துக' : '✏️ Edit');
  const deleteBtnText = lang === 'si' ? '🗑️ මකන්න' : (lang === 'ta' ? '🗑️ நீக்குக' : '🗑️ Delete');
  const deleteDivBtnText = lang === 'si' ? '🗑️ අංශය මකන්න' : (lang === 'ta' ? '🗑️ பிரிவை நீக்குக' : '🗑️ Delete Division');
  const noOfficialsText = lang === 'si' ? 'තවමත් ප්‍රධාන නිලධාරීන් පවරා නොමැත.' : (lang === 'ta' ? 'இன்னும் முக்கிய அதிகாரிகள் நியமிக்கப்படவில்லை.' : 'No key officials assigned yet.');
  const noneText = lang === 'si' ? 'නැත' : (lang === 'ta' ? 'இல்லை' : 'None');


  container.innerHTML = divs.map(div => {
    // Extract sections according to active dashboard language
    let rawSec = div['sections_' + lang];
    if (!rawSec || (Array.isArray(rawSec) && rawSec.length === 0)) {
      rawSec = div.sections_en || div.sections_si || [];
    }
    const sections = Array.isArray(rawSec) 
      ? rawSec 
      : (typeof rawSec === 'string' ? rawSec.split(',').map(s=>s.trim()).filter(Boolean) : []);
    const secPills = sections.map(s => `<span class="badge-pill badge-pill-navy" style="font-size:0.75rem;">${escapeHtml(s)}</span>`).join(' ');
    
    const chiefUnits = ['legal unit', 'establishment office', 'statistical unit', 'accounts unit', 'digital division (ict + gis)', 'translation unit', 'administration division'];
    let officers = div.officers || [];
    if (String(div.id) !== '1') {
      officers = officers.filter(o => !chiefUnits.includes((o.unit || '').toLowerCase().trim()));
    }
    const officerCards = officers.length > 0 
      ? officers.map(o => {
          const oName = escapeHtml(o['name_' + lang] || o.name_en || o.name_si || o.name || '');
          const oRole = escapeHtml(o['role_' + lang] || o.role_en || o.role_si || o.role || '');
          const oPhone = escapeHtml(o.phone || '');
          const oEmail = escapeHtml(o.email || '');
          const rawUnit = o.unit || '';
          const oUnit = rawUnit ? escapeHtml(getTranslatedUnitName(rawUnit, lang)) : '';


          return `
            <div style="background:#FFFFFF; border:1px solid var(--border-soft); border-radius:12px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px;">
              <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, #380000 0%, #6E1212 100%); display:flex; align-items:center; justify-content:center; color:#FFFFFF; font-size:1.25rem; flex-shrink:0;">👤</div>
                <div style="min-width:0;">
                  <div style="font-weight:700; font-size:0.88rem; color:var(--text-main); line-height:1.2;">${oName}</div>
                  <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px; display:flex; flex-wrap:wrap; align-items:center; gap:6px;">
                    <span style="font-weight:600; color:var(--pill-navy);">${oRole}</span>
                    ${oPhone ? `<span>• 📞 ${oPhone}</span>` : ''}
                    ${oEmail ? `<span>• ✉️ ${oEmail}</span>` : ''}
                    ${oUnit ? `<span class="badge-pill badge-pill-gray" style="font-size:0.7rem; padding:1px 7px;">🏛️ ${oUnit}</span>` : ''}
                  </div>
                </div>
              </div>
              <div style="display:flex; gap:6px; flex-shrink:0;">
                <button type="button" class="btn-table-action" onclick="openEditOfficerModal(${div.id}, '${o.id}')" title="${editBtnText}" style="padding:4px 10px; font-size:0.74rem; border:1px solid var(--border-soft); border-radius:6px; background:#F8FAFC; cursor:pointer;">${editBtnText}</button>
                <button type="button" class="btn-table-action" onclick="handleDeleteOfficer(${div.id}, '${o.id}')" title="${deleteBtnText}" style="padding:4px 10px; font-size:0.74rem; border:1px solid #FECACA; border-radius:6px; background:#FEF2F2; color:#DC2626; cursor:pointer;">${deleteBtnText}</button>
              </div>
            </div>
          `;
        }).join('')
      : `<div style="font-size:0.8rem; color:var(--text-muted); font-style:italic; padding:10px 0;">${noOfficialsText}</div>`;


    const divName = div['name_' + lang] || div.name_en;
    const divHead = div['head_title_' + lang] || div.head_title_en || (lang === 'si' ? 'අංශ ප්‍රධානී' : (lang === 'ta' ? 'பிரிவுத் தலைவர்' : 'Head of Division'));
    const divDesc = div['desc_' + lang] || div.desc_en || '';


    const isCustomDiv = parseInt(div.id, 10) > 5;
    const deleteDivBtn = (isSuperAdmin && isCustomDiv) 
      ? `<button type="button" class="btn-table-action" onclick="handleDeleteDivision(${div.id})" title="${deleteDivBtnText}" style="padding:3px 10px; font-size:0.74rem; border:1px solid #FECACA; border-radius:6px; background:#FEF2F2; color:#DC2626; cursor:pointer;">${deleteDivBtnText}</button>`
      : '';


    return `
      <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:16px; padding:20px 22px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.2rem;">🏛️</span>
            <div>
              <h4 style="font-weight:800; font-size:1rem; color:var(--text-main);">${div.id}. ${escapeHtml(divName)}</h4>
              <span style="font-size:0.76rem; color:var(--pill-navy); font-weight:700;">${escapeHtml(divHead)}</span>
            </div>
          </div>
          <div>${deleteDivBtn}</div>
        </div>


        <p style="font-size:0.82rem; color:var(--text-subtle); line-height:1.5; margin-bottom:14px;">${escapeHtml(divDesc)}</p>
        
        <div style="margin-bottom:14px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:0.74rem; font-weight:700; text-transform:uppercase; color:var(--text-muted);">${subUnitsLabel}</div>
            <button type="button" class="btn-table-action" onclick="openCreateDivisionModal('sub', ${div.id})" style="padding:2px 9px; font-size:0.72rem; border:1px dashed #ECAC58; border-radius:6px; background:#FFFBEB; color:#92400E; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
              <span>➕</span> <span>${addSubBtnText}</span>
            </button>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">${secPills || `<span style="font-size:0.75rem; color:var(--text-muted);">${noneText}</span>`}</div>
        </div>


        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <div style="font-size:0.74rem; font-weight:700; text-transform:uppercase; color:var(--text-muted);">${keyOfficialsLabel}</div>
            <button type="button" class="btn-table-action" onclick="openAddOfficerModal(${div.id})" style="padding:3px 10px; font-size:0.72rem; display:inline-flex; align-items:center; gap:4px; border:1px solid var(--border-soft); border-radius:6px; background:#FFFFFF; cursor:pointer;">${addBtnText}</button>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">${officerCards}</div>
        </div>
      </div>
    `;
  }).join('');
}


// Key Official Management Functions
function openAddOfficerModal(defaultDivId) {
  const form = document.getElementById('form-officer');
  if (form) form.reset();


  const titleEl = document.getElementById('modal-officer-title');
  if (titleEl) {
    const titles = {
      en: "👤 Add Key Official",
      si: "👤 ප්‍රධාන නිලධාරියෙකු එක් කරන්න",
      ta: "👤 புதிய அதிகாரியைச் சேர்க்க"
    };
    titleEl.textContent = titles[currentDashboardLang] || titles.en;
  }


  const editIdEl = document.getElementById('officer-edit-id');
  const editDivIdEl = document.getElementById('officer-edit-divid');
  if (editIdEl) editIdEl.value = '';
  if (editDivIdEl) editDivIdEl.value = '';


  const divSelect = document.getElementById('officer-division-select');
  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;


  if (divSelect) {
    if (!isSuperAdmin && userDivId) {
      divSelect.value = String(userDivId);
      divSelect.disabled = true;
    } else {
      divSelect.disabled = false;
      divSelect.value = defaultDivId ? String(defaultDivId) : '1';
    }
  }


  updateOfficerSubUnitOptions();
  openModal('modal-officer');
}


function openEditOfficerModal(divId, officerId) {
  const divObj = db.divisionsData?.[divId];
  if (!divObj) return;


  const officers = divObj.officers || [];
  const officer = officers.find(o => String(o.id) === String(officerId));
  if (!officer) return;


  const titleEl = document.getElementById('modal-officer-title');
  if (titleEl) {
    const titles = {
      en: "✏️ Edit Key Official",
      si: "✏️ නිලධාරී තොරතුරු සංස්කරණය",
      ta: "✏️ அதிகாரி தகவலைத் திருத்துக"
    };
    titleEl.textContent = titles[currentDashboardLang] || titles.en;
  }


  const editIdEl = document.getElementById('officer-edit-id');
  const editDivIdEl = document.getElementById('officer-edit-divid');
  if (editIdEl) editIdEl.value = officer.id;
  if (editDivIdEl) editDivIdEl.value = divId;


  const divSelect = document.getElementById('officer-division-select');
  if (divSelect) {
    divSelect.value = String(divId);
    divSelect.disabled = true;
  }


  const nameEnEl = document.getElementById('officer-name-en');
  const nameSiEl = document.getElementById('officer-name-si');
  const nameTaEl = document.getElementById('officer-name-ta');
  if (nameEnEl) nameEnEl.value = officer.name_en || officer.name || '';
  if (nameSiEl) nameSiEl.value = officer.name_si || '';
  if (nameTaEl) nameTaEl.value = officer.name_ta || '';


  const roleEnEl = document.getElementById('officer-role-en');
  const roleSiEl = document.getElementById('officer-role-si');
  const roleTaEl = document.getElementById('officer-role-ta');
  if (roleEnEl) roleEnEl.value = officer.role_en || officer.role || '';
  if (roleSiEl) roleSiEl.value = officer.role_si || '';
  if (roleTaEl) roleTaEl.value = officer.role_ta || '';


  const phoneEl = document.getElementById('officer-phone');
  const emailEl = document.getElementById('officer-email');
  if (phoneEl) phoneEl.value = officer.phone || '';
  if (emailEl) emailEl.value = officer.email || '';


  updateOfficerSubUnitOptions();
  const unitSelect = document.getElementById('officer-unit');
  if (unitSelect && officer.unit) {
    unitSelect.value = officer.unit;
  }


  openModal('modal-officer');
}


function updateOfficerSubUnitOptions() {
  const divSelect = document.getElementById('officer-division-select');
  const unitSelect = document.getElementById('officer-unit');
  if (!divSelect || !unitSelect) return;


  const divId = divSelect.value || '1';
  const divObj = db.divisionsData?.[divId];
  
  const rawSec = divObj?.sections_en || [];
  const sections = Array.isArray(rawSec) ? rawSec : (typeof rawSec === 'string' ? rawSec.split(',').map(s => s.trim()) : []);


  let opts = '<option value="">General / Head of Division (ප්‍රධාන කාර්යාලය)</option>';
  sections.forEach(sec => {
    if (sec) {
      opts += `<option value="${escapeHtml(sec)}">${escapeHtml(sec)}</option>`;
    }
  });
  unitSelect.innerHTML = opts;
}


async function handleSaveOfficer(e) {
  e.preventDefault();
  const editId = document.getElementById('officer-edit-id')?.value;
  const editDivId = document.getElementById('officer-edit-divid')?.value;
  const divSelect = document.getElementById('officer-division-select');
  const divId = editDivId || (divSelect ? divSelect.value : '1');


  if (!db.divisionsData) db.divisionsData = {};
  if (!db.divisionsData[divId]) {
    db.divisionsData[divId] = { id: parseInt(divId), officers: [] };
  }
  if (!Array.isArray(db.divisionsData[divId].officers)) {
    db.divisionsData[divId].officers = [];
  }


  const nameEn = document.getElementById('officer-name-en')?.value.trim() || '';
  const nameSi = document.getElementById('officer-name-si')?.value.trim() || nameEn;
  const nameTa = document.getElementById('officer-name-ta')?.value.trim() || nameEn;


  const roleEn = document.getElementById('officer-role-en')?.value.trim() || '';
  const roleSi = document.getElementById('officer-role-si')?.value.trim() || roleEn;
  const roleTa = document.getElementById('officer-role-ta')?.value.trim() || roleEn;


  const phone = document.getElementById('officer-phone')?.value.trim() || '';
  const email = document.getElementById('officer-email')?.value.trim() || '';
  const unit = document.getElementById('officer-unit')?.value.trim() || '';


  const saveBtn = document.getElementById('btn-save-officer');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>⏳</span> Saving...';
  }


  if (editId) {
    const idx = db.divisionsData[divId].officers.findIndex(o => String(o.id) === String(editId));
    if (idx !== -1) {
      db.divisionsData[divId].officers[idx] = {
        ...db.divisionsData[divId].officers[idx],
        name_en: nameEn,
        name_si: nameSi,
        name_ta: nameTa,
        role_en: roleEn,
        role_si: roleSi,
        role_ta: roleTa,
        phone,
        email,
        unit
      };
    }
  } else {
    const newOfficer = {
      id: 'off_' + Date.now(),
      division_id: parseInt(divId),
      name_en: nameEn,
      name_si: nameSi,
      name_ta: nameTa,
      role_en: roleEn,
      role_si: roleSi,
      role_ta: roleTa,
      phone,
      email,
      unit,
      photo: ''
    };
    db.divisionsData[divId].officers.push(newOfficer);
  }


  await saveEntireDatabaseToServer();
  closeModal('modal-officer');
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<span>💾</span> Save Key Official';
  }


  const toastMsg = currentDashboardLang === 'si' 
    ? 'ප්‍රධාන නිලධාරී තොරතුරු සාර්ථකව සුරකින ලදී!' 
    : (currentDashboardLang === 'ta' ? 'முக்கிய அதிகாரி விபரம் வெற்றிகரமாக சேமிக்கப்பட்டது!' : 'Key Official saved successfully!');
  showToast(toastMsg);


  renderAdminDivisions();
}


async function handleDeleteOfficer(divId, officerId) {
  const confirmMsg = currentDashboardLang === 'si'
    ? 'මෙම ප්‍රධාන නිලධාරියා ඉවත් කිරීමට ඔබට විශ්වාසද?'
    : (currentDashboardLang === 'ta' ? 'இந்த அதிகாரியை நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to remove this Key Official?');
  
  if (!confirm(confirmMsg)) return;


  if (db.divisionsData && db.divisionsData[divId] && Array.isArray(db.divisionsData[divId].officers)) {
    db.divisionsData[divId].officers = db.divisionsData[divId].officers.filter(o => String(o.id) !== String(officerId));
    await saveEntireDatabaseToServer();
    
    const toastMsg = currentDashboardLang === 'si' 
      ? 'නිලධාරියා ඉවත් කරන ලදී!' 
      : (currentDashboardLang === 'ta' ? 'அதிகாரி நீக்கப்பட்டார்!' : 'Key Official removed successfully!');
    showToast(toastMsg);
    
    renderAdminDivisions();
  }
}


// 9. Citizen Inquiries Management
function renderAdminInquiries() {
  const tableBody = document.getElementById('admin-inquiries-table-body');
  if (!tableBody) return;


  const inqs = db.inquiries || [];
  if (inqs.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:30px;">No inquiries in inbox.</td></tr>`;
    return;
  }


  tableBody.innerHTML = inqs.map(inq => `
    <tr>
      <td style="font-size:0.78rem; color:var(--text-muted); white-space:nowrap;">${escapeHtml(inq.date || 'Today')}</td>
      <td style="font-weight:700; color:var(--text-main);">${escapeHtml(inq.name)}</td>
      <td><span class="badge-pill badge-pill-amber">${escapeHtml(inq.nic)}</span></td>
      <td>
        <div style="font-size:0.82rem; font-weight:600;">${escapeHtml(inq.phone)}</div>
        <div style="font-size:0.74rem; color:var(--text-muted);">${escapeHtml(inq.email || '')}</div>
      </td>
      <td style="font-size:0.82rem; color:var(--text-subtle); max-width:320px; line-height:1.4;">
        ${escapeHtml(inq.message)}
      </td>
      <td style="text-align:right;">
        <button class="btn-table-action btn-del" title="${adminTranslations[currentDashboardLang]?.btnDelete || 'Delete'}" onclick="handleDeleteInquiry('${inq.id}')">
          <span>🗑️</span> <span>${adminTranslations[currentDashboardLang]?.btnDelete || 'Delete'}</span>
        </button>
      </td>
    </tr>
  `).join('');
}


async function handleDeleteInquiry(id) {
  if (confirm("Are you sure you want to delete this citizen inquiry from the inbox?")) {
    db.inquiries = (db.inquiries || []).filter(i => i.id !== id);
    await saveEntireDatabaseToServer();
    showToast("Inquiry deleted.");
    renderAllViews();
  }
}


// 10. Announcements Ticker Management
function populateAnnouncementsForm() {
  const tEn = db.siteTranslations?.en?.announcementsText || '';
  const tSi = db.siteTranslations?.si?.announcementsText || '';
  const tTa = db.siteTranslations?.ta?.announcementsText || '';


  const elEn = document.getElementById('edit-ann-en');
  const elSi = document.getElementById('edit-ann-si');
  const elTa = document.getElementById('edit-ann-ta');


  if (elEn) elEn.value = tEn;
  if (elSi) elSi.value = tSi;
  if (elTa) elTa.value = tTa;
}


// Auto-Translate Announcements in Admin Dashboard
function cleanSinhalaOrthography(text) {
  if (!text || typeof text !== 'string') return text || '';
  return text.replace(/\u0D9A\u0DCA\u200D\u0DC2/g, '\u0D9A\u0DCA\u0DC2');
}


async function handleAutoTranslateAnnouncements(forceSourceLang = null) {
  const elSi = document.getElementById('edit-ann-si');
  const elEn = document.getElementById('edit-ann-en');
  const elTa = document.getElementById('edit-ann-ta');
  const btn = document.getElementById('btn-auto-trans-ann');
  const icon = document.getElementById('auto-trans-icon');
  const textSpan = document.getElementById('auto-trans-text');


  const valSi = elSi?.value.trim() || '';
  const valEn = elEn?.value.trim() || '';
  const valTa = elTa?.value.trim() || '';


  // Helper detection functions
  const hasSinhala = text => /[\u0D80-\u0DFF]/.test(text);
  const hasTamil = text => /[\u0B80-\u0BFF]/.test(text);
  const hasEnglish = text => /[a-zA-Z]/.test(text);


  let sourceText = '';
  let sl = 'auto';


  if (forceSourceLang === 'si' && valSi) {
    sourceText = valSi;
    sl = 'si';
  } else if (forceSourceLang === 'en' && valEn) {
    sourceText = valEn;
    sl = 'en';
  } else if (forceSourceLang === 'ta' && valTa) {
    sourceText = valTa;
    sl = 'ta';
  } else {
    // Intelligent language detection across fields
    if (valSi && hasSinhala(valSi)) {
      sourceText = valSi;
      sl = 'si';
    } else if (valEn && hasEnglish(valEn) && !hasSinhala(valEn) && !hasTamil(valEn)) {
      sourceText = valEn;
      sl = 'en';
    } else if (valTa && hasTamil(valTa)) {
      sourceText = valTa;
      sl = 'ta';
    } else if (valSi) {
      sourceText = valSi;
      sl = hasSinhala(valSi) ? 'si' : (hasTamil(valSi) ? 'ta' : 'auto');
    } else if (valEn) {
      sourceText = valEn;
      sl = hasSinhala(valEn) ? 'si' : (hasTamil(valEn) ? 'ta' : 'auto');
    } else if (valTa) {
      sourceText = valTa;
      sl = hasSinhala(valTa) ? 'si' : (hasTamil(valTa) ? 'ta' : 'auto');
    }
  }


  if (!sourceText) {
    showToast(currentDashboardLang === 'si' 
      ? 'කරුණාකර අවම වශයෙන් එක් භාෂාවකින් නිවේදනය ඇතුළත් කරන්න.' 
      : (currentDashboardLang === 'ta' ? 'குறைந்தது ஒரு மொழியில் அறிவிப்பை உள்ளிடவும்.' : 'Please enter an announcement in at least one language first!'));
    return;
  }


  // Set loading state on auto-translate buttons
  document.querySelectorAll('.btn-auto-trans').forEach(b => b.disabled = true);
  if (btn) btn.disabled = true;
  if (icon) icon.textContent = '⏳';
  if (textSpan) textSpan.textContent = currentDashboardLang === 'si' ? 'පරිවර්තනය වෙමින් පවතී...' : (currentDashboardLang === 'ta' ? 'மொழிபெயர்க்கப்படுகிறது...' : 'Translating...');


  showToast(currentDashboardLang === 'si' ? 'භාෂා ත්‍රිත්වයටම ස්වයංක්‍රීයව පරිවර්තනය වෙමින් පවතී... ⏳' : 'Auto-translating into all 3 languages... ⏳');


  try {
    const res = await fetch(`api.php?action=translate_announcement&sl=${sl}&text=${encodeURIComponent(sourceText)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.translations) {
        if (elEn) elEn.value = data.translations.en || elEn.value;
        if (elSi) elSi.value = cleanSinhalaOrthography(data.translations.si || elSi.value);
        if (elTa) elTa.value = data.translations.ta || elTa.value;
        showToast(currentDashboardLang === 'si' ? "✨ සාර්ථකව භාෂා 3ටම පරිවර්තනය කරන ලදී!" : (currentDashboardLang === 'ta' ? "✨ அனைத்து மொழிகளுக்கும் வெற்றிகரமாக மொழிபெயர்க்கப்பட்டது!" : "✨ Successfully auto-translated into all 3 languages!"));
      } else {
        showToast("⚠️ Translation service unavailable, please enter manually.");
      }
    } else {
      showToast("⚠️ Translation request failed.");
    }
  } catch (err) {
    console.error("Auto-translate error:", err);
    showToast("⚠️ Translation failed: " + err.message);
  } finally {
    document.querySelectorAll('.btn-auto-trans').forEach(b => b.disabled = false);
    if (btn) btn.disabled = false;
    if (icon) icon.textContent = '✨';
    const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
    if (textSpan) textSpan.textContent = dict.btnAutoTranslateAll || 'Auto-Translate All Languages';
  }
}
window.handleAutoTranslateAnnouncements = handleAutoTranslateAnnouncements;


async function handleSaveAnnouncements(e) {
  e.preventDefault();
  const elSi = document.getElementById('edit-ann-si');
  const elEn = document.getElementById('edit-ann-en');
  const elTa = document.getElementById('edit-ann-ta');
  const statusEl = document.getElementById('ann-trans-status');
  const saveBtn = document.getElementById('btn-save-ann');


  let valSi = elSi?.value.trim() || '';
  let valEn = elEn?.value.trim() || '';
  let valTa = elTa?.value.trim() || '';


  const isDotsOrEmpty = str => !str || /^[\s\.\,\-]+$/.test(str);


  // Check if at least one language has real content
  if (isDotsOrEmpty(valSi) && isDotsOrEmpty(valEn) && isDotsOrEmpty(valTa)) {
    showToast(currentDashboardLang === 'si' 
      ? 'කරුණාකර අවම වශයෙන් එක් භාෂාවකින් නිවේදනය ඇතුළත් කරන්න.' 
      : 'Please enter an announcement in at least one language.');
    return;
  }


  // If some languages are missing or dots, auto-translate them before saving!
  const hasMissing = isDotsOrEmpty(valSi) || isDotsOrEmpty(valEn) || isDotsOrEmpty(valTa);
  if (hasMissing) {
    if (saveBtn) saveBtn.disabled = true;
    if (statusEl) statusEl.textContent = "⚡ Auto-translating missing languages...";


    const sourceText = !isDotsOrEmpty(valSi) ? valSi : (!isDotsOrEmpty(valEn) ? valEn : valTa);
    const sl = (!isDotsOrEmpty(valSi)) ? 'si' : ((!isDotsOrEmpty(valEn)) ? 'en' : 'ta');


    try {
      const res = await fetch(`api.php?action=translate_announcement&sl=${sl}&text=${encodeURIComponent(sourceText)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.translations) {
          if (!valEn) { valEn = data.translations.en || sourceText; if (elEn) elEn.value = valEn; }
          if (!valSi) { valSi = cleanSinhalaOrthography(data.translations.si || sourceText); if (elSi) elSi.value = valSi; }
          if (!valTa) { valTa = data.translations.ta || sourceText; if (elTa) elTa.value = valTa; }
        }
      }
    } catch (err) {
      console.warn("Auto-translate on save warning:", err);
    } finally {
      if (saveBtn) saveBtn.disabled = false;
      if (statusEl) statusEl.textContent = "";
    }
  }


  if (!db.siteTranslations) db.siteTranslations = {};
  if (!db.siteTranslations.en) db.siteTranslations.en = {};
  if (!db.siteTranslations.si) db.siteTranslations.si = {};
  if (!db.siteTranslations.ta) db.siteTranslations.ta = {};


  db.siteTranslations.en.announcementsText = valEn;
  db.siteTranslations.si.announcementsText = valSi;
  db.siteTranslations.ta.announcementsText = valTa;


  await saveEntireDatabaseToServer();
  if (typeof updateMetricCounters === 'function') updateMetricCounters();
  showToast("⚡ Live ticker announcements saved and active in all 3 languages!");
}


// 11. e-Services Management
// 11. e-Services & Online Systems Management
let currentSystemsCategory = 'all';


function setSystemsCategoryFilter(cat, btn) {
  currentSystemsCategory = cat;
  const pillContainer = document.getElementById('systems-category-pills');
  if (pillContainer) {
    pillContainer.querySelectorAll('button').forEach(b => {
      b.style.background = '#FFFFFF';
      b.style.color = 'var(--text-main, #380000)';
      b.style.border = '1px solid #DEC5C3';
    });
  }
  if (btn) {
    btn.style.background = 'var(--primary-maroon, #380000)';
    btn.style.color = '#FFFFFF';
    btn.style.border = 'none';
  }
  filterAdminSystems();
}


function filterAdminSystems() {
  const query = (document.getElementById('search-systems-input')?.value || '').trim();
  renderAdminSystems(currentSystemsCategory, query);
}


function renderAdminSystems(filterCat = 'all', filterQuery = '') {
  const tableBody = document.getElementById('admin-systems-table-body');
  if (!tableBody) return;


  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  const txtEdit = dict.btnEdit || 'Edit';
  const txtDelete = dict.btnDelete || 'Delete';


  let systems = db.systems || [];


  // Filter by category
  if (filterCat && filterCat !== 'all') {
    systems = systems.filter(s => (s.category || '').toLowerCase() === filterCat.toLowerCase());
  }


  // Filter by search query
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    systems = systems.filter(s => {
      const tEn = (s.title_en || '').toLowerCase();
      const tSi = (s.title_si || '').toLowerCase();
      const tTa = (s.title_ta || '').toLowerCase();
      const dEn = (s.desc_en || '').toLowerCase();
      const dSi = (s.desc_si || '').toLowerCase();
      const dTa = (s.desc_ta || '').toLowerCase();
      const u = (s.url || '').toLowerCase();
      return tEn.includes(q) || tSi.includes(q) || tTa.includes(q) || dEn.includes(q) || dSi.includes(q) || dTa.includes(q) || u.includes(q);
    });
  }


  // Update active systems count badge
  const badgeEl = document.getElementById('systems-count-badge');
  if (badgeEl) {
    const totalCount = (db.systems || []).length;
    const badgeText = currentDashboardLang === 'si' 
      ? `🟢 පද්ධති ${totalCount} ක් ක්‍රියාත්මකයි` 
      : (currentDashboardLang === 'ta' ? `🟢 ${totalCount} அமைப்புகள் இயங்குகின்றன` : `🟢 ${totalCount} Systems Active`);
    badgeEl.innerHTML = `<span>${badgeText}</span>`;
  }


  if (systems.length === 0) {
    const noMatchText = currentDashboardLang === 'si' 
      ? 'සෙවුම් නිර්ණායකයන්ට අදාළ මාර්ගගත පද්ධති හමු නොවීය.' 
      : (currentDashboardLang === 'ta' ? 'தேடல் நிபந்தனைகளுடன் அமைப்புகள் எதுவும் கிடைக்கவில்லை.' : 'No matching online systems found. Click "Add System" to create one.');
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:35px 20px;">${noMatchText}</td></tr>`;
    return;
  }


  tableBody.innerHTML = systems.map(sys => {
    const sysTitle = sys['title_' + currentDashboardLang] || sys.title_en || sys.title_si || '';
    const secTitle = currentDashboardLang === 'en' ? (sys.title_si || '') : (sys.title_en || '');
    const sysDesc = sys['desc_' + currentDashboardLang] || sys.desc_en || '';
    const icon = sys.icon || '💻';


    // Category Badge matching system colors
    let catBadgeClass = 'badge-pill-navy';
    const catLower = (sys.category || '').toLowerCase();
    if (catLower.includes('finance')) catBadgeClass = 'badge-pill-amber';
    else if (catLower.includes('public')) catBadgeClass = 'badge-pill-green';
    else if (catLower.includes('staff')) catBadgeClass = 'badge-pill-navy';


    const catLabel = sys.category || 'General';


    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg, #380000 0%, #630808 100%); display:flex; align-items:center; justify-content:center; font-size:1.25rem; color:#FFFFFF; flex-shrink:0; box-shadow:0 3px 8px rgba(56,0,0,0.18);">
              ${icon}
            </div>
            <div>
              <div style="font-weight:700; color:var(--text-main, #380000); font-size:0.88rem; line-height:1.2;">
                ${escapeHtml(sysTitle)}
              </div>
              ${secTitle ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${escapeHtml(secTitle)}</div>` : ''}
            </div>
          </div>
        </td>
        <td>
          <span class="badge-pill ${catBadgeClass}" style="font-weight:700; font-size:0.76rem; padding:4px 10px;">
            ${escapeHtml(catLabel)}
          </span>
        </td>
        <td>
          <div style="font-size:0.8rem; color:var(--text-subtle, #555); line-height:1.45; max-width:380px;">
            ${escapeHtml(sysDesc)}
          </div>
        </td>
        <td>
          <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-start;">
            <span class="badge-pill badge-pill-green" style="display:inline-flex; align-items:center; gap:5px; font-weight:700; font-size:0.72rem; padding:2px 8px;">
              <span style="width:6px; height:6px; border-radius:50%; background:#10B981; display:inline-block;"></span> Live Active
            </span>
            <a href="${escapeHtml(sys.url)}" target="_blank" style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; font-size:0.75rem; font-weight:700; color:#380000; background:#FAF5F5; border:1px solid #DEC5C3; border-radius:6px; text-decoration:none; transition:all 0.15s ease;" onmouseover="this.style.background='#F5EBEA'" onmouseout="this.style.background='#FAF5F5'">
              <span>🌐</span> <span>Open Portal ↗</span>
            </a>
          </div>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:6px;">
            <button type="button" class="btn-table-action" onclick="openEditSystemModal(${sys.id})" title="${txtEdit}">
              <span>✏️</span> <span>${txtEdit}</span>
            </button>
            <button type="button" class="btn-table-action btn-del" onclick="handleDeleteSystem(${sys.id})" title="${txtDelete}">
              <span>🗑️</span> <span>${txtDelete}</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


function openAddSystemModal() {
  const form = document.getElementById('form-system');
  if (form) form.reset();


  const titleEl = document.getElementById('modal-system-title');
  if (titleEl) {
    const titles = {
      en: "➕ Add Online System / e-Service",
      si: "➕ නව මාර්ගගත පද්ධතියක් / ඊ-සේවාවක් එක් කරන්න",
      ta: "➕ புதிய இணைய அமைப்பு / மின்-சேவை சேர்க்க"
    };
    titleEl.textContent = titles[currentDashboardLang] || titles.en;
  }


  const editIdEl = document.getElementById('system-edit-id');
  if (editIdEl) editIdEl.value = '';


  openModal('modal-system');
}


function openEditSystemModal(id) {
  const sys = (db.systems || []).find(s => String(s.id) === String(id));
  if (!sys) return;


  const titleEl = document.getElementById('modal-system-title');
  if (titleEl) {
    const titles = {
      en: "✏️ Edit Online System / e-Service",
      si: "✏️ මාර්ගගත පද්ධති තොරතුරු සංස්කරණය",
      ta: "✏️ இணைய அமைப்பு தகவலைத் திருத்துக"
    };
    titleEl.textContent = titles[currentDashboardLang] || titles.en;
  }


  const editIdEl = document.getElementById('system-edit-id');
  if (editIdEl) editIdEl.value = sys.id;


  const catEl = document.getElementById('system-category');
  const iconEl = document.getElementById('system-icon');
  if (catEl) catEl.value = sys.category || 'Staff';
  if (iconEl) iconEl.value = sys.icon || '📐';


  const tEn = document.getElementById('system-title-en');
  const tSi = document.getElementById('system-title-si');
  const tTa = document.getElementById('system-title-ta');
  if (tEn) tEn.value = sys.title_en || '';
  if (tSi) tSi.value = sys.title_si || '';
  if (tTa) tTa.value = sys.title_ta || '';


  const urlEl = document.getElementById('system-url');
  if (urlEl) urlEl.value = sys.url || '';


  const dEn = document.getElementById('system-desc-en');
  const dSi = document.getElementById('system-desc-si');
  const dTa = document.getElementById('system-desc-ta');
  if (dEn) dEn.value = sys.desc_en || '';
  if (dSi) dSi.value = sys.desc_si || '';
  if (dTa) dTa.value = sys.desc_ta || '';


  openModal('modal-system');
}


async function handleSaveSystem(e) {
  e.preventDefault();
  const editId = document.getElementById('system-edit-id')?.value;
  const category = document.getElementById('system-category')?.value || 'Staff';
  const icon = document.getElementById('system-icon')?.value || '📐';


  const titleEn = document.getElementById('system-title-en')?.value.trim() || '';
  const titleSi = document.getElementById('system-title-si')?.value.trim() || titleEn;
  const titleTa = document.getElementById('system-title-ta')?.value.trim() || titleEn;


  const url = document.getElementById('system-url')?.value.trim() || '';
  const descEn = document.getElementById('system-desc-en')?.value.trim() || '';
  const descSi = document.getElementById('system-desc-si')?.value.trim() || descEn;
  const descTa = document.getElementById('system-desc-ta')?.value.trim() || descEn;


  if (!Array.isArray(db.systems)) db.systems = [];


  const saveBtn = document.getElementById('btn-save-system');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>⏳</span> Saving...';
  }


  if (editId) {
    const idx = db.systems.findIndex(s => String(s.id) === String(editId));
    if (idx !== -1) {
      db.systems[idx] = {
        ...db.systems[idx],
        category,
        icon,
        title_en: titleEn,
        title_si: titleSi,
        title_ta: titleTa,
        url,
        desc_en: descEn,
        desc_si: descSi,
        desc_ta: descTa
      };
    }
  } else {
    const newId = db.systems.length > 0 ? Math.max(...db.systems.map(s => Number(s.id) || 0)) + 1 : 1;
    db.systems.push({
      id: newId,
      category,
      icon,
      title_en: titleEn,
      title_si: titleSi,
      title_ta: titleTa,
      url,
      desc_en: descEn,
      desc_si: descSi,
      desc_ta: descTa
    });
  }


  await saveEntireDatabaseToServer();
  closeModal('modal-system');
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<span>💾</span> Save Online System';
  }


  const toastMsg = currentDashboardLang === 'si' 
    ? 'මාර්ගගත පද්ධතිය සාර්ථකව සුරකින ලදී!' 
    : (currentDashboardLang === 'ta' ? 'இணைய அமைப்பு வெற்றிகரமாக சேமிக்கப்பட்டது!' : 'Online system saved successfully!');
  showToast(toastMsg);


  renderAdminSystems(currentSystemsCategory);
}


async function handleDeleteSystem(id) {
  const confirmMsg = currentDashboardLang === 'si'
    ? 'මෙම මාර්ගගත පද්ධති සබැඳිය ඉවත් කිරීමට ඔබට විශ්වාසද?'
    : (currentDashboardLang === 'ta' ? 'இந்த இணைய அமைப்பை நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to remove this online service link?');


  if (!confirm(confirmMsg)) return;


  db.systems = (db.systems || []).filter(s => String(s.id) !== String(id));
  await saveEntireDatabaseToServer();


  const toastMsg = currentDashboardLang === 'si' 
    ? 'පද්ධති සබැඳිය ඉවත් කරන ලදී!' 
    : (currentDashboardLang === 'ta' ? 'அமைப்பு நீக்கப்பட்டது!' : 'e-Service link removed successfully.');
  showToast(toastMsg);


  renderAdminSystems(currentSystemsCategory);
}


// 12. Provincial Projects & News Article Management
let pendingProjectFile = null;


async function handleProjectImageSelect(input) {
  if (input.files && input.files[0]) {
    const rawFile = input.files[0];
    const label = document.getElementById('project-image-label');
    const lang = currentDashboardLang || 'en';
    const optText = lang === 'si' ? '⚡ පින්තූරය Compress වෙමින් පවතී... ⏳' : (lang === 'ta' ? '⚡ படம் சுருக்கப்படுகிறது... ⏳' : '⚡ Optimizing image in browser... ⏳');
    if (label) label.textContent = optText;

    const compressed = await compressImageFile(rawFile, 1920, 1920, 0.82);
    pendingProjectFile = compressed;

    const formatSize = (bytes) => (bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB');
    const origStr = formatSize(rawFile.size);
    const newStr = formatSize(compressed.size);

    if (label) {
      if (compressed.size < rawFile.size) {
        const savings = Math.round(((rawFile.size - compressed.size) / rawFile.size) * 100);
        const saveLabel = lang === 'si' ? `${savings}% ඉතිරියි` : (lang === 'ta' ? `${savings}% சேமிக்கப்பட்டது` : `-${savings}% saved`);
        label.innerHTML = `<span style="color:#059669; font-weight:700;">✅ ${rawFile.name}</span> <span style="font-size:0.75rem; color:#475569;">(${origStr} ➔ ⚡ <strong>${newStr}</strong> | ${saveLabel})</span>`;
      } else {
        label.textContent = `✅ Selected: ${rawFile.name} (${newStr})`;
      }
    }
  }
}


function openAddProjectModal() {
  pendingProjectFile = null;
  const form = document.getElementById('form-project');
  if (form) form.reset();
  const idEl = document.getElementById('project-id');
  if (idEl) idEl.value = '';
  const dateEl = document.getElementById('project-date');
  if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];


  syncModalLangWithDashboard(currentDashboardLang);
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  const label = document.getElementById('project-image-label');
  if (label) label.textContent = dict.dropzoneProjectImage || 'Click to browse or drop cover photo here';
  const titleEl = document.getElementById('modal-project-title');
  if (titleEl) titleEl.textContent = dict.modalProjTitleAdd || 'Publish News Article / Project';
  const saveBtn = document.getElementById('btn-save-project');
  if (saveBtn) saveBtn.innerHTML = `<span>💾</span> <span>${dict.btnPublishArticleDirect || 'Publish Article Directly'}</span>`;


  openModal('modal-project');
}


function openEditProjectModal(id) {
  pendingProjectFile = null;
  const proj = (db.projects || []).find(p => p.id == id);
  if (!proj) return;


  const primaryTitle = (currentDashboardLang === 'si' ? (proj.title_si || proj.title_en || proj.title_ta) :
                        currentDashboardLang === 'ta' ? (proj.title_ta || proj.title_en || proj.title_si) :
                        (proj.title_en || proj.title_si || proj.title_ta)) || '';
  const primaryDesc = (currentDashboardLang === 'si' ? (proj.desc_si || proj.desc_en || proj.desc_ta) :
                       currentDashboardLang === 'ta' ? (proj.desc_ta || proj.desc_en || proj.desc_si) :
                       (proj.desc_en || proj.desc_si || proj.desc_ta)) || '';


  document.getElementById('project-id').value = proj.id;
  document.getElementById('project-title-en').value = proj.title_en || primaryTitle;
  document.getElementById('project-title-si').value = proj.title_si || primaryTitle;
  document.getElementById('project-title-ta').value = proj.title_ta || primaryTitle;
  document.getElementById('project-desc-en').value = proj.desc_en || primaryDesc;
  document.getElementById('project-desc-si').value = proj.desc_si || primaryDesc;
  document.getElementById('project-desc-ta').value = proj.desc_ta || primaryDesc;
  document.getElementById('project-keyword').value = proj.keyword || '';
  document.getElementById('project-date').value = proj.date || '';
  document.getElementById('project-image').value = proj.image || '';


  syncModalLangWithDashboard(currentDashboardLang);
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
  const label = document.getElementById('project-image-label');
  if (label) {
    label.textContent = proj.image ? ('Existing Image: ' + proj.image.split('/').pop()) : (dict.dropzoneProjectImage || 'Click to change cover photo');
  }
  const titleEl = document.getElementById('modal-project-title');
  if (titleEl) titleEl.textContent = dict.modalProjTitleEdit || 'Edit News Article / Project';
  const saveBtn = document.getElementById('btn-save-project');
  if (saveBtn) saveBtn.innerHTML = `<span>💾</span> <span>${dict.btnPublishArticleDirectEditing || 'Save Article Changes'}</span>`;


  openModal('modal-project');
}


async function handleSaveProject(e) {
  e.preventDefault();
  const id = document.getElementById('project-id').value;
  const saveBtn = document.getElementById('btn-save-project');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span>Publishing Live...</span> ⏳';


  let uploadedUrl = '';
  if (pendingProjectFile) {
    let fileToUpload = pendingProjectFile;
    if (fileToUpload.type && fileToUpload.type.startsWith('image/')) {
      fileToUpload = await compressImageFile(fileToUpload);
    }
    const formData = new FormData();
    formData.append('file', fileToUpload);
    if (currentUser && currentUser.username) {
      formData.append('username', currentUser.username);
    }
    try {
      const upRes = await fetch('api.php?action=upload', {
        method: 'POST',
        body: formData
      });
      const upData = await upRes.json();
      if (upRes.ok && upData.success) {
        uploadedUrl = upData.url;
      }
    } catch (err) {
      console.warn("Project image upload failed, proceeding with url:", err);
    }
  }


  let titleEn = document.getElementById('project-title-en').value.trim();
  let titleSi = document.getElementById('project-title-si').value.trim();
  let titleTa = document.getElementById('project-title-ta').value.trim();
  let descEn = document.getElementById('project-desc-en').value.trim();
  let descSi = document.getElementById('project-desc-si').value.trim();
  let descTa = document.getElementById('project-desc-ta').value.trim();


  let primaryProjTitle = '';
  if (currentDashboardLang === 'si' && titleSi) primaryProjTitle = titleSi;
  else if (currentDashboardLang === 'ta' && titleTa) primaryProjTitle = titleTa;
  else if (currentDashboardLang === 'en' && titleEn) primaryProjTitle = titleEn;
  else primaryProjTitle = titleSi || titleEn || titleTa;


  let primaryProjDesc = '';
  if (currentDashboardLang === 'si' && descSi) primaryProjDesc = descSi;
  else if (currentDashboardLang === 'ta' && descTa) primaryProjDesc = descTa;
  else if (currentDashboardLang === 'en' && descEn) primaryProjDesc = descEn;
  else primaryProjDesc = descSi || descEn || descTa;


  if (!primaryProjTitle) {
    alert(currentDashboardLang === 'si' ? "කරුණාකර පුවත් හෝ ව්‍යාපෘති සිරස්තලය ඇතුළත් කරන්න." :
          currentDashboardLang === 'ta' ? "தயவுசெய்து தலைப்பை உள்ளிடவும்." :
          "Please enter an article headline / title.");
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<span>💾</span> Publish Article Directly';
    return;
  }


  const isBlankProj = s => !s || /^[\s\.\,\-]+$/.test(s);


  // Auto-translate project titles across all 3 languages if any are missing
  if (isBlankProj(titleEn) || isBlankProj(titleSi) || isBlankProj(titleTa)) {
    saveBtn.innerHTML = `<span>⚡</span> <span>${currentDashboardLang === 'si' ? 'සිරස්තල පරිවර්තනය වෙමින් පවතී...' : (currentDashboardLang === 'ta' ? 'தலைப்புகள் மொழிபெயர்க்கப்படுகின்றன...' : 'Translating titles...')}</span>`;
    try {
      let sl = (primaryProjTitle === titleSi) ? 'si' : ((primaryProjTitle === titleTa) ? 'ta' : 'auto');
      const res = await fetch(`api.php?action=translate_all&text=${encodeURIComponent(primaryProjTitle)}&sl=${sl}`);
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.translations) {
          if (isBlankProj(titleEn)) titleEn = d.translations.en || primaryProjTitle;
          if (isBlankProj(titleSi)) titleSi = cleanSinhalaOrthography(d.translations.si || primaryProjTitle);
          if (isBlankProj(titleTa)) titleTa = d.translations.ta || primaryProjTitle;
        }
      }
    } catch (e) {
      console.warn("Auto-translate project title error:", e);
    }
  }


  // Auto-translate project descriptions across all 3 languages if any are missing
  if ((isBlankProj(descEn) || isBlankProj(descSi) || isBlankProj(descTa)) && primaryProjDesc) {
    saveBtn.innerHTML = `<span>⚡</span> <span>${currentDashboardLang === 'si' ? 'විස්තරය පරිවර්තනය වෙමින් පවතී...' : (currentDashboardLang === 'ta' ? 'விளக்கம் மொழிபெயர்க்கப்படுகிறது...' : 'Translating descriptions...')}</span>`;
    try {
      let sl = (primaryProjDesc === descSi) ? 'si' : ((primaryProjDesc === descTa) ? 'ta' : 'auto');
      const res = await fetch(`api.php?action=translate_all&text=${encodeURIComponent(primaryProjDesc)}&sl=${sl}`);
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.translations) {
          if (isBlankProj(descEn)) descEn = d.translations.en || primaryProjDesc;
          if (isBlankProj(descSi)) descSi = cleanSinhalaOrthography(d.translations.si || primaryProjDesc);
          if (isBlankProj(descTa)) descTa = d.translations.ta || primaryProjDesc;
        }
      }
    } catch (e) {
      console.warn("Auto-translate project desc error:", e);
    }
  }


  if (isBlankProj(titleEn)) titleEn = primaryProjTitle;
  if (isBlankProj(titleSi)) titleSi = primaryProjTitle;
  if (isBlankProj(titleTa)) titleTa = primaryProjTitle;


  if (isBlankProj(descEn)) descEn = primaryProjDesc || primaryProjTitle;
  if (isBlankProj(descSi)) descSi = primaryProjDesc || primaryProjTitle;
  if (isBlankProj(descTa)) descTa = primaryProjDesc || primaryProjTitle;


  // Sync inputs back to DOM so user sees all 3 fields populated
  if (document.getElementById('project-title-en')) document.getElementById('project-title-en').value = titleEn;
  if (document.getElementById('project-title-si')) document.getElementById('project-title-si').value = titleSi;
  if (document.getElementById('project-title-ta')) document.getElementById('project-title-ta').value = titleTa;
  if (document.getElementById('project-desc-en')) document.getElementById('project-desc-en').value = descEn;
  if (document.getElementById('project-desc-si')) document.getElementById('project-desc-si').value = descSi;
  if (document.getElementById('project-desc-ta')) document.getElementById('project-desc-ta').value = descTa;
  const keyword = document.getElementById('project-keyword').value.trim() || 'Provincial';
  const projDate = document.getElementById('project-date').value || new Date().toISOString().split('T')[0];
  const image = uploadedUrl || document.getElementById('project-image').value.trim() || 'assets/project1.jpg';


  if (!Array.isArray(db.projects)) db.projects = [];


  if (id) {
    const existing = db.projects.find(p => p.id == id);
    if (existing) {
      existing.title_en = titleEn;
      existing.title_si = titleSi;
      existing.title_ta = titleTa;
      existing.desc_en = descEn;
      existing.desc_si = descSi;
      existing.desc_ta = descTa;
      existing.keyword = keyword;
      existing.date = projDate;
      if (image) existing.image = image;
      existing.status = 'Active';
      existing.status_key = 'projStatusActive';
    }
  } else {
    const newProj = {
      id: Date.now(),
      title_en: titleEn,
      title_si: titleSi,
      title_ta: titleTa,
      desc_en: descEn,
      desc_si: descSi,
      desc_ta: descTa,
      keyword: keyword,
      date: projDate,
      image: image,
      status: 'Active',
      status_key: 'projStatusActive',
      created_by_user_id: currentUser ? currentUser.id : null,
      created_by_username: currentUser ? currentUser.username : null,
      division_id: currentUser ? currentUser.division_id : null
    };
    db.projects.unshift(newProj);
  }


  await saveEntireDatabaseToServer();
  closeModal('modal-project');
  saveBtn.disabled = false;
  saveBtn.innerHTML = '<span>💾</span> Publish Article Directly';
  showToast("⚡ News article & project published live to web portal immediately! (No admin approval required)");
  renderAllViews();
}


async function handleDeleteProject(id) {
  const proj = (db.projects || []).find(p => p.id == id);
  if (!proj) return;


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  if (!isSuperAdmin) {
    const isOwner = (proj.created_by_user_id && String(proj.created_by_user_id) === String(currentUser.id)) ||
                    (proj.created_by_username && proj.created_by_username === currentUser.username) ||
                    (currentUser.division_id && String(proj.division_id) === String(currentUser.division_id));
    if (!isOwner) {
      alert("Access Denied: You can only delete articles published by your account.");
      return;
    }
  }


  if (confirm("Are you sure you want to delete this project / article from the live portal?")) {
    db.projects = db.projects.filter(p => p.id != id);
    await saveEntireDatabaseToServer();
    showToast("Project / article removed successfully.");
    renderAllViews();
  }
}


function renderAdminProjects() {
  const grid = document.getElementById('admin-projects-grid');
  if (!grid) return;


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  let projects = db.projects || [];
  if (!isSuperAdmin && currentUser) {
    projects = projects.filter(p => 
      (p.created_by_user_id && String(p.created_by_user_id) === String(currentUser.id)) ||
      (p.created_by_username && p.created_by_username === currentUser.username) ||
      (currentUser.division_id && String(p.division_id) === String(currentUser.division_id))
    );
  }


  if (projects.length === 0) {
    const emptyMsg = isSuperAdmin
      ? 'No projects or news stories added yet. Click "+ Add News / Project" to publish one.'
      : 'You have not published any projects or news articles yet. Click "+ Add News / Project" above to publish directly to the live homepage!';
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:35px; color:var(--text-muted); background:var(--bg-panel); border-radius:12px; border:1px dashed var(--border-soft);">${emptyMsg}</div>`;
    return;
  }


  grid.innerHTML = projects.map(p => {
    const projTitle = p['title_' + currentDashboardLang] || p.title_en || '';
    const projDesc = p['desc_' + currentDashboardLang] || p.desc_en || '';
    const keyword = p.keyword || 'Provincial';
    const dateStr = p.date || '2026-10-24';


    return `
    <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:16px; overflow:hidden; display:flex; flex-direction:column; box-shadow:var(--shadow-sm);">
      <div style="height:140px; background:#1C2346; position:relative; overflow:hidden;">
        <img src="${p.image || 'assets/project1.jpg'}" alt="${escapeHtml(projTitle)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='logo.jpg'">
        <div style="position:absolute; top:10px; left:10px; display:flex; gap:6px;">
          <span class="badge-pill badge-pill-green" style="display:inline-flex; align-items:center; gap:4px; font-weight:700;">
            <span style="width:6px; height:6px; border-radius:50%; background:#10B981; display:inline-block;"></span> Live
          </span>
          <span class="badge-pill badge-pill-navy">${escapeHtml(keyword)}</span>
        </div>
      </div>
      <div style="padding:16px; flex:1; display:flex; flex-direction:column;">
        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">📅 ${escapeHtml(dateStr)}</div>
        <h4 style="font-weight:800; font-size:0.92rem; color:var(--text-main); margin-bottom:6px; line-height:1.3;">${escapeHtml(projTitle)}</h4>
        <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.4; flex:1;">${escapeHtml(projDesc.substring(0, 100))}...</p>
        <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--border-soft); display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn-table-action" title="${adminTranslations[currentDashboardLang]?.btnEdit || 'Edit'}" onclick="openEditProjectModal(${p.id})">
            <span>✏️</span> <span>${adminTranslations[currentDashboardLang]?.btnEdit || 'Edit'}</span>
          </button>
          <button class="btn-table-action btn-del" title="${adminTranslations[currentDashboardLang]?.btnDelete || 'Delete'}" onclick="handleDeleteProject(${p.id})">
            <span>🗑️</span> <span>${adminTranslations[currentDashboardLang]?.btnDelete || 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}


// 13. User Management (Super Admin)
function renderAdminUsers() {
  const tableBody = document.getElementById('admin-users-table-body');
  if (!tableBody) return;


  if (usersList.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:30px;">Loading administrator users...</td></tr>`;
    return;
  }


  tableBody.innerHTML = usersList.map(u => {
    const roleBadge = u.role === 'Super Admin' 
      ? '<span class="badge-pill badge-pill-navy">Super Admin</span>' 
      : (u.role === 'Editor' ? '<span class="badge-pill badge-pill-amber">Editor</span>' : '<span class="badge-pill badge-pill-coral">Admin</span>');


    const unitObj = CHIEF_SECRETARIAT_UNITS.find(unit => String(unit.id) === String(u.division_id));
    const divName = u.unit_name || (unitObj ? unitObj.name_en : (u.role === 'Super Admin' ? 'Chief Secretariat (All Units)' : 'General Unit'));


    return `
      <tr>
        <td style="font-weight:700; color:var(--text-main);">${escapeHtml(u.username)}</td>
        <td>${escapeHtml(u.full_name)}</td>
        <td>${roleBadge}</td>
        <td style="font-size:0.82rem; color:var(--text-subtle);">${escapeHtml(divName)}</td>
        <td><span class="badge-pill badge-pill-green">${escapeHtml(u.status)}</span></td>
        <td style="text-align:right;">
          <div style="display:inline-flex; align-items:center; justify-content:flex-end; gap:6px;">
            <button class="btn-table-action" onclick="openEditUserModal(${u.id})" title="${adminTranslations[currentDashboardLang]?.btnEdit || 'Edit'}">
              <span>✏️</span> <span>${adminTranslations[currentDashboardLang]?.btnEdit || 'Edit'}</span>
            </button>
            <button class="btn-table-action btn-del" onclick="handleDeleteUser(${u.id})" title="${adminTranslations[currentDashboardLang]?.btnDelete || 'Delete'}">
              <span>🗑️</span> <span>${adminTranslations[currentDashboardLang]?.btnDelete || 'Delete'}</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


function openAddUserModal() {
  document.getElementById('form-user').reset();
  document.getElementById('user-id').value = '';
  document.getElementById('modal-user-title').textContent = 'Create Admin User';
  document.getElementById('user-pass-note').textContent = '(Mandatory for new user)';
  document.getElementById('user-password').required = true;
  populateDocDivisionDropdown(null);
  openModal('modal-user');
}


function openEditUserModal(id) {
  const u = (usersList && usersList.find(x => x.id == id)) || (currentUser && currentUser.id == id ? currentUser : null);
  if (!u) return;


  populateDocDivisionDropdown(u.id);


  document.getElementById('user-id').value = u.id;
  document.getElementById('user-username').value = u.username || '';
  document.getElementById('user-fullname').value = u.full_name || '';
  document.getElementById('user-phone').value = u.phone || '';
  document.getElementById('user-email').value = u.email || '';
  document.getElementById('user-password').value = '';
  document.getElementById('user-password').required = false;
  document.getElementById('user-pass-note').textContent = '(Leave empty to keep existing)';
  document.getElementById('user-role').value = u.role || 'Admin';
  const userDivSel = document.getElementById('user-division');
  if (userDivSel) {
    let matchedOption = null;
    if (u.unit_name) {
      const uClean = u.unit_name.toLowerCase().trim();
      matchedOption = Array.from(userDivSel.options).find(opt => {
        const optUnit = (opt.getAttribute('data-unit-name') || '').toLowerCase().trim();
        return optUnit === uClean || optUnit.includes(uClean) || uClean.includes(optUnit);
      });
    }
    if (!matchedOption && u.division_id) {
      matchedOption = Array.from(userDivSel.options).find(opt => opt.value === String(u.division_id));
    }
    if (matchedOption) {
      userDivSel.value = matchedOption.value;
    } else {
      userDivSel.value = u.division_id || '';
    }
  }


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const isEditingSelf = currentUser && String(currentUser.id) === String(u.id);


  document.getElementById('modal-user-title').textContent = (isEditingSelf && !isSuperAdmin) ? 'My Profile & Security' : 'Edit Admin User';


  const roleDivRow = document.getElementById('user-role-div-row');
  if (roleDivRow) {
    roleDivRow.style.display = isSuperAdmin ? 'grid' : 'none';
  }


  openModal('modal-user');
}


async function handleSaveUser(e) {
  e.preventDefault();
  const id = document.getElementById('user-id').value;
  const username = document.getElementById('user-username').value.trim();
  const full_name = document.getElementById('user-fullname').value.trim();
  const password = document.getElementById('user-password').value.trim();
  const phone = (document.getElementById('user-phone')?.value || '').trim();
  const email = (document.getElementById('user-email')?.value || '').trim();
  const role = document.getElementById('user-role').value;
  const division_id_raw = document.getElementById('user-division').value || null;
  const userDivSelect = document.getElementById('user-division');
  const selUserOpt = userDivSelect ? userDivSelect.options[userDivSelect.selectedIndex] : null;
  const optParentId = selUserOpt ? selUserOpt.getAttribute('data-parent-id') : null;
  const optUnitName = selUserOpt ? selUserOpt.getAttribute('data-unit-name') : null;


  const rawVal = division_id_raw ? parseInt(division_id_raw, 10) : null;
  const division_id = optParentId ? parseInt(optParentId, 10) : (rawVal && rawVal > 100 ? Math.floor(rawVal / 100) : rawVal);


  const allUnits = getAllAssignableUnits();
  const matchedUnit = division_id_raw ? allUnits.find(u => String(u.id) === String(division_id_raw)) : null;
  const unit_name = optUnitName || (matchedUnit ? (matchedUnit.unit_raw || matchedUnit.name_en) : (role === 'Super Admin' ? 'Chief Secretariat (All Units)' : null));


  // Client-side validation: enforce only 1 user account per unit
  if (unit_name && unit_name !== 'Chief Secretariat (All Units)' && usersList && usersList.length > 0) {
    const existing = usersList.find(u => {
      if (id && String(u.id) === String(id)) return false;
      const uNorm = (u.unit_name || '').toLowerCase().trim();
      const targetNorm = unit_name.toLowerCase().trim();
      return uNorm && (uNorm === targetNorm || targetNorm.includes(uNorm) || uNorm.includes(targetNorm));
    });
    if (existing) {
      alert(`The unit '${unit_name}' is already assigned to officer account '${existing.username}' (${existing.full_name}). Each unit can only have ONE officer account.`);
      return;
    }
  }


  const action = id ? 'update_user' : 'create_user';
  const payload = { id, username, full_name, password, phone, email, role, division_id, unit_name };


  try {
    const res = await fetch(`api.php?action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();


    if (res.ok && data.success) {
      showToast(data.message || "User saved successfully.");
      closeModal('modal-user');


      // Update active user state if updating self
      if (currentUser && String(currentUser.id) === String(id)) {
        currentUser.full_name = full_name;
        currentUser.phone = phone;
        currentUser.email = email;
        sessionStorage.setItem('nwp_admin_user', JSON.stringify(currentUser));
        updateUserDisplayInfo();
      }


      if (currentUser && currentUser.role === 'Super Admin') {
        await fetchUsers();
        renderAdminUsers();
      }
    } else {
      alert(data.error || "Failed to save user.");
    }
  } catch (err) {
    alert("Server error connecting to API.");
  }
}


async function handleDeleteUser(id) {
  if (confirm("Are you sure you want to delete this administrator account?")) {
    try {
      const res = await fetch('api.php?action=delete_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("User account deleted.");
        await fetchUsers();
        renderAdminUsers();
      } else {
        alert(data.error || "Failed to delete user.");
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  }
}


// 14. Site Texts & i18n
function setAdminLangTab(lang) {
  activeAdminLang = lang;
  document.querySelectorAll('#view-texts .select-pill').forEach(btn => {
    btn.style.background = 'var(--bg-input)';
    btn.style.color = 'var(--text-main)';
  });
  const activeBtn = document.getElementById(`btn-lang-tab-${lang}`);
  if (activeBtn) {
    activeBtn.style.background = 'var(--pill-navy)';
    activeBtn.style.color = '#FFFFFF';
  }
  populateSiteTextsForm();
}


function populateSiteTextsForm() {
  const t = db.siteTranslations[activeAdminLang] || db.siteTranslations['en'] || {};
  const fields = ['portalTitle', 'portalSubtitle', 'emergencyContact', 'heroBadgeText', 'homeSearchTitle', 'homeSearchSubtitle', 'valIntegrityDesc', 'valSpeedDesc', 'valAccessDesc'];
  fields.forEach(f => {
    const el = document.getElementById(`edit-${f}`);
    if (el) el.value = t[f] || '';
  });
}


async function handleSaveSiteTexts(e) {
  e.preventDefault();
  if (!db.siteTranslations[activeAdminLang]) {
    db.siteTranslations[activeAdminLang] = {};
  }
  const t = db.siteTranslations[activeAdminLang];
  const fields = ['portalTitle', 'portalSubtitle', 'emergencyContact', 'heroBadgeText', 'homeSearchTitle', 'homeSearchSubtitle', 'valIntegrityDesc', 'valSpeedDesc', 'valAccessDesc'];
  fields.forEach(f => {
    const el = document.getElementById(`edit-${f}`);
    if (el) t[f] = el.value.trim();
  });


  await saveEntireDatabaseToServer();
  showToast(`Site texts (${activeAdminLang.toUpperCase()}) saved successfully!`);
}


// 15. Server Persistence Helper
async function saveEntireDatabaseToServer() {
  try {
    const res = await fetch('api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Passcode': 'admin123'
      },
      body: JSON.stringify(db)
    });
    return res.ok;
  } catch (err) {
    console.error("Save error:", err);
    return false;
  }
}


// Global Search in Topbar
function handleGlobalSearch(q) {
  if (!q || q.trim() === '') return;
  switchAdminTab('view-documents', null);
  const docSearch = document.querySelector('#view-documents input[type="text"]');
  if (docSearch) {
    docSearch.value = q;
    filterAdminDocs();
  }
}


// Modal Helpers
function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.display = 'flex';
    updateModalTranslations(currentDashboardLang);
  }
}


function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.style.display = 'none';
}


// Toast Helper
function showToast(msg) {
  if (!toastEl) return;
  toastText.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3500);
}


function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}




// ============================================================================
// FOLDER-STYLE TABBED DIRECTIVES LOGIC (Matching reference design)
// ============================================================================
let currentOverviewSubTab = 'directives'; // 'directives' | 'inprogress' | 'archived'


function switchOverviewSubTab(tabName) {
  currentOverviewSubTab = tabName;
  document.querySelectorAll('.folder-tab-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById('tab-folder-' + tabName);
  if (btn) btn.classList.add('active');
  renderOverviewDirectives();
}




function populateFolderDivisionSelect(lang = currentDashboardLang) {
  const sel = document.getElementById('folder-division-select');
  if (!sel) return;
  const currentVal = sel.value;


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;


  const allText = lang === 'si' ? 'සියලුම අංශ / තෝරන්න' : (lang === 'ta' ? 'அனைத்துப் பிரிவுகளும் / தேர்வு' : 'All Divisions / Choose');


  let html = `<option value="all">${allText}</option>`;
  CHIEF_SECRETARIAT_UNITS.forEach(u => {
    const name = u['name_' + lang] || u.name_en;
    html += `<option value="${u.id}">${escapeHtml(name)}</option>`;
  });


  sel.innerHTML = html;
  if (!isSuperAdmin && userDivId) {
    sel.value = String(userDivId);
    sel.disabled = true;
    sel.style.opacity = '0.75';
  } else if (currentVal && Array.from(sel.options).some(o => o.value === currentVal)) {
    sel.value = currentVal;
  }
}


function filterOverviewDirectives() {
  renderOverviewDirectives();
}


function renderOverviewDirectives() {
  const container = document.getElementById('folder-rows-list');
  if (!container) return;


  const isSuperAdmin = currentUser && currentUser.role === 'Super Admin' && !currentUser.division_id;
  const userDivId = currentUser ? currentUser.division_id : null;
  const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];


  const divSelectEl = document.getElementById('folder-division-select');
  if (divSelectEl) {
    if (!isSuperAdmin && userDivId) {
      divSelectEl.value = String(userDivId);
      divSelectEl.disabled = true;
      divSelectEl.style.opacity = '0.75';
    } else {
      divSelectEl.disabled = false;
      divSelectEl.style.opacity = '1';
    }
  }


  const keyword = (document.getElementById('folder-search-input')?.value || '').toLowerCase().trim();
  const selectedDiv = (!isSuperAdmin && userDivId) ? String(userDivId) : (divSelectEl?.value || 'all');


  // Base administrative directives with trilingual support
  const defaultDirectives = [
    {
      id: 'd1',
      badgeClass: 'badge-blue',
      badgeText: currentDashboardLang === 'si' ? '🏛️ වයඹ • නියෝගය' : (currentDashboardLang === 'ta' ? '🏛️ வடமேல் • வழிகாட்டல்' : '🏛️ NWP • DIRECTIVE'),
      title: currentDashboardLang === 'si' ? 'වයඹ පළාත් ස්මාර්ට් පාලන සහ ඩිජිටල්කරණ ප්‍රොටෝකෝලය 2026' : (currentDashboardLang === 'ta' ? 'வடமேல் மாகாண ஸ்மார்ட் ஆளுகை & டிஜிட்டல் நெறிமுறை 2026' : 'North Western Provincial Smart Governance & Digitization Protocol 2026'),
      sub: currentDashboardLang === 'si' ? 'සියලුම ලේකම් කාර්යාල අංශ 5 සඳහා විස්තීර්ණ ඩිජිටල් නවීකරණ නියෝගය.' : (currentDashboardLang === 'ta' ? 'அனைத்து 5 செயலகப் பிரிவுகளுக்குமான விரிவான டிஜிட்டல் நவீனமயமாக்கல் உத்தரவு.' : 'Comprehensive digital modernization directive for all 5 secretariat divisions.'),
      status: 'active',
      division: '1'
    },
    {
      id: 'd2',
      badgeClass: 'badge-cyan',
      badgeText: currentDashboardLang === 'si' ? '📊 වයඹ • මුදල්' : (currentDashboardLang === 'ta' ? '📊 வடமேல் • நிதி' : '📊 NWP • FINANCE'),
      title: currentDashboardLang === 'si' ? 'පළාත් භාණ්ඩාගාර ඉංජිනේරු සහ ගොඩනැගිලි මිල ගණන් පොත සංශෝධනය 2026/27' : (currentDashboardLang === 'ta' ? 'மாகாண திறைசேரி பொறியியல் மற்றும் கட்டட விலைப்பட்டியல் திருத்தம் 2026/27' : 'Provincial Treasury Engineering & Building Rate Book Revision 2026/27'),
      sub: currentDashboardLang === 'si' ? 'කුරුණෑගල සහ පුත්තලම දිස්ත්‍රික්ක සඳහා සම්මත මිල ගණන් සහ BoQ පිරිවිතර.' : (currentDashboardLang === 'ta' ? 'குருநாகல் மற்றும் புத்தளம் மாவட்டங்களுக்கான தரப்படுத்தப்பட்ட விலை அட்டவணைகள்.' : 'Standardized rate schedules and BoQ specifications across Kurunegala and Puttalam districts.'),
      status: 'inprogress',
      division: '3'
    },
    {
      id: 'd3',
      badgeClass: 'badge-emerald',
      badgeText: currentDashboardLang === 'si' ? '🚀 වයඹ • මානව සම්පත් & MDTU' : (currentDashboardLang === 'ta' ? '🚀 வடமேல் • மனிதவளம் & MDTU' : '🚀 NWP • HR & MDTU'),
      title: currentDashboardLang === 'si' ? 'රාජ්‍ය අංශයේ මානව ප්‍රාග්ධනය සහ වාර්ෂික කාඩර් සංශෝධනය 2026' : (currentDashboardLang === 'ta' ? 'அரசுத் துறை மனித மூலதனம் மற்றும் வருடாந்திர பதவியணி திருத்தம் 2026' : 'Public Sector Human Capital & Annual Cadre Revision 2026'),
      sub: currentDashboardLang === 'si' ? 'MDTU ධාරිතා සංවර්ධන සම්මන්ත්‍රණ, නායකත්ව පුහුණු සහ පළාත් ස්ථාන මාරු ලේඛනය.' : (currentDashboardLang === 'ta' ? 'MDTU திறன் மேம்பாட்டு கருத்தரங்குகள், தலைமைத்துவ பயிற்சி மற்றும் மாகாண இடமாற்ற பட்டியல்.' : 'MDTU capacity enhancement seminars, leadership training and provincial transfer list.'),
      status: 'active',
      division: '2'
    },
    {
      id: 'd4',
      badgeClass: 'badge-amber',
      badgeText: currentDashboardLang === 'si' ? '⚖️ වයඹ • විගණන' : (currentDashboardLang === 'ta' ? '⚖️ வடமேல் • தணிக்கை' : '⚖️ NWP • AUDIT'),
      title: currentDashboardLang === 'si' ? 'පළාත් තොරතුරු දැනගැනීමේ (RTI) අනුකූලතාව සහ ව්‍යවස්ථාපිත විගණන මාර්ගෝපදේශ' : (currentDashboardLang === 'ta' ? 'மாகாண தகவல் அறியும் உரிமை (RTI) இணக்கம் மற்றும் தணிக்கை வழிகாட்டுதல்கள்' : 'Provincial RTI Compliance & Statutory Audit Guidelines'),
      sub: currentDashboardLang === 'si' ? 'පළාත් සභා ව්‍යවස්ථාපිත අධිකාරීන් සඳහා කාර්තුමය අනුකූලතා නියෝග.' : (currentDashboardLang === 'ta' ? 'மாகாண சபை சட்டரீதியான அதிகார சபைகளுக்கான காலாண்டு இணக்க உத்தரவுகள்.' : 'Quarterly compliance directives for provincial council statutory authorities.'),
      status: 'archived',
      division: '5'
    }
  ];


  let allItems = [];


  // Include user-published documents from db.documents
  if (Array.isArray(db.documents) && db.documents.length > 0) {
    db.documents.forEach((doc, idx) => {
      let divCode = 'DIRECTIVE';
      if (currentDashboardLang === 'si') {
        divCode = doc.division == 2 ? 'MDTU' : (doc.division == 3 ? 'මුදල්' : (doc.division == 4 ? 'ඉංජිනේරු' : (doc.division == 5 ? 'ක්‍රමසම්පාදන' : 'නියෝගය')));
      } else if (currentDashboardLang === 'ta') {
        divCode = doc.division == 2 ? 'MDTU' : (doc.division == 3 ? 'நிதி' : (doc.division == 4 ? 'பொறியியல்' : (doc.division == 5 ? 'திட்டமிடல்' : 'வழிகாட்டல்')));
      } else {
        divCode = doc.division == 2 ? 'MDTU' : (doc.division == 3 ? 'FINANCE' : (doc.division == 4 ? 'ENGINEERING' : (doc.division == 5 ? 'PLANNING' : 'DIRECTIVE')));
      }


      const pfx = currentDashboardLang === 'si' ? '📜 වයඹ • ' : (currentDashboardLang === 'ta' ? '📜 வடமேல் • ' : '📜 NWP • ');
      const circLabel = dict.lblCircularNo || (currentDashboardLang === 'si' ? 'චක්‍රලේඛ අංක: ' : (currentDashboardLang === 'ta' ? 'சுற்றறிக்கை எண்: ' : 'Circular No: '));
      const pubLabel = dict.lblPublished ? ` • ${dict.lblPublished}: ` : (currentDashboardLang === 'si' ? ' • පළ කළ දිනය: ' : (currentDashboardLang === 'ta' ? ' • வெளியிடப்பட்டது: ' : ' • Published: '));


      const docTitle = doc['title_' + currentDashboardLang] || doc.title_en || doc.title_si || doc.title_ta || 'Provincial Document';


      allItems.unshift({
        id: 'doc_' + (doc.id || idx),
        badgeText: pfx + divCode,
        badgeClass: idx % 2 === 0 ? 'badge-blue' : 'badge-cyan',
        title: docTitle,
        sub: circLabel + ' ' + (doc.circular_no || ('NWP/CS/' + (2026 - idx))) + pubLabel + (doc.date || '2026'),
        status: idx === 0 ? 'active' : 'inprogress',
        division: String(doc.division || '1'),
        realDocId: doc.id
      });
    });
  }


  // Include default administrative items
  defaultDirectives.forEach(dd => {
    if (isSuperAdmin || (userDivId && String(dd.division) === String(userDivId))) {
      allItems.push(dd);
    }
  });


  // Filter strictly by division for division officer
  if (!isSuperAdmin && userDivId) {
    allItems = allItems.filter(item => String(item.division) === String(userDivId));
  } else if (selectedDiv !== 'all') {
    allItems = allItems.filter(item => String(item.division) === String(selectedDiv));
  }


  // Filter by Tab
  if (currentOverviewSubTab === 'inprogress') {
    allItems = allItems.filter(item => item.status === 'inprogress');
  } else if (currentOverviewSubTab === 'archived') {
    allItems = allItems.filter(item => item.status === 'archived');
  }


  // Filter by Keyword
  if (keyword) {
    allItems = allItems.filter(item => 
      item.title.toLowerCase().includes(keyword) || 
      item.sub.toLowerCase().includes(keyword) ||
      item.badgeText.toLowerCase().includes(keyword)
    );
  }


  if (allItems.length === 0) {
    if (!isSuperAdmin && userDivId) {
      const emptyTitle = currentDashboardLang === 'si' ? 'ඔබේ අංශය සඳහා තවමත් නියෝග පළ කර නොමැත' : (currentDashboardLang === 'ta' ? 'உங்கள் பிரிவுக்கான வழிகாட்டல்கள் இன்னும் வெளியிடப்படவில்லை' : 'No Directives Published for Your Division Yet');
      const emptyDesc = currentDashboardLang === 'si' ? 'ඔබේ අංශය මඟින් පළ කරන නියෝග, චක්‍රලේඛ සහ නිවේදන මෙහි දිස්වන අතර මහජන වෙබ් අඩවියට සෘජුවම එකතු වේ.' : (currentDashboardLang === 'ta' ? 'உங்கள் பிரிவால் வெளியிடப்பட்ட வழிகாட்டல்கள், சுற்றறிக்கைகள் மற்றும் அறிவிப்புகள் இங்கு தோன்றும் மற்றும் இணையதளத்தில் நேரடியாக வெளியிடப்படும்.' : 'Directives, circulars, and notices published by your division will appear here and push directly to the public web portal.');
      const btnReleaseFirst = currentDashboardLang === 'si' ? '+ ප්‍රථම නියෝගය නිකුත් කරන්න' : (currentDashboardLang === 'ta' ? '+ முதல் வழிகாட்டலை வெளியிடுக' : '+ Release First Directive');
      container.innerHTML = `
        <div style="text-align:center; padding:38px 20px; color:var(--text-muted); background:#FAF5F5; border-radius:14px; border:1px dashed #DEC5C3;">
          <div style="font-size:2rem; margin-bottom:8px;">📂</div>
          <div style="font-weight:700; font-size:0.95rem; color:var(--text-main); margin-bottom:4px;">${emptyTitle}</div>
          <div style="font-size:0.82rem; margin-bottom:14px;">${emptyDesc}</div>
          <button class="btn-folder-release" style="margin:0 auto; display:inline-flex;" onclick="openAddDocModal()">${btnReleaseFirst}</button>
        </div>
      `;
    } else {
      const noMatchText = currentDashboardLang === 'si' ? 'වත්මන් පෙරහන් නිර්ණායක සඳහා ගැළපෙන නියෝග හෝ ක්‍රියාකාරකම් හමු නොවීය.' : (currentDashboardLang === 'ta' ? 'தேடல் நிபந்தனைகளுடன் பொருந்தக்கூடிய வழிகாட்டல்கள் எதுவும் கிடைக்கவில்லை.' : 'No matching directives or activities found for current filter criteria.');
      container.innerHTML = `<div style="text-align:center; padding:36px; color:#94A3B8; font-size:0.9rem;">${noMatchText}</div>`;
    }
    return;
  }


  const btnReviseText = dict.btnRevise || (currentDashboardLang === 'si' ? 'සංශෝධනය' : (currentDashboardLang === 'ta' ? 'திருத்துக' : 'Revise'));
  const btnViewText = dict.btnView || (currentDashboardLang === 'si' ? 'බලන්න' : (currentDashboardLang === 'ta' ? 'பார்க்க' : 'View'));
  const btnActionText = dict.btnAction || (currentDashboardLang === 'si' ? 'ක්‍රියාමාර්ග' : (currentDashboardLang === 'ta' ? 'செயல்' : 'Action'));
  const actionAppliedToast = currentDashboardLang === 'si' ? 'නියෝගය සඳහා ක්‍රියාමාර්ගය යොදන ලදී' : (currentDashboardLang === 'ta' ? 'வழிகாட்டலுக்கான செயல்முறை பயன்படுத்தப்பட்டது' : 'Action applied to directive');


  container.innerHTML = allItems.map(item => `
    <div class="folder-row-item">
      <div class="folder-row-left">
        <div class="folder-row-badge ${item.badgeClass}">
          <span>${item.badgeText}</span>
        </div>
        <div class="folder-row-content">
          <div class="folder-row-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</div>
          <div class="folder-row-sub" title="${escapeHtml(item.sub)}">${escapeHtml(item.sub)}</div>
        </div>
      </div>
      <div class="folder-row-actions">
        <button class="btn-folder-action" onclick="${item.realDocId ? `openEditDocModal(${item.realDocId})` : `switchAdminTab('view-documents', null)`}">${btnReviseText}</button>
        <button class="btn-folder-action" onclick="${item.realDocId ? `openEditDocModal(${item.realDocId})` : `switchAdminTab('view-documents', null)`}">${btnViewText}</button>
        <button class="btn-folder-action" onclick="showToast('${actionAppliedToast}')">${btnActionText}</button>
      </div>
    </div>
  `).join('');
}




function toggleTopLangDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('topbar-lang-dropdown-menu');
  if (menu) menu.classList.toggle('show');
}


function closeTopLangDropdown() {
  const menu = document.getElementById('topbar-lang-dropdown-menu');
  if (menu) menu.classList.remove('show');
}


document.addEventListener('click', (e) => {
  if (!e.target.closest('#topbar-lang-pill-wrap')) {
    closeTopLangDropdown();
  }
});


// 14. Officer Profile & Security Management
function populateProfileView() {
  if (!currentUser) return;
  const unitName = (currentUser.unit_name && currentUser.unit_name !== 'Chief Secretariat (All Units)' && currentUser.unit_name !== 'General Unit')
    ? currentUser.unit_name
    : getUserCategoryName(currentUser, 'en');


  const fnEl = document.getElementById('prof-full-name') || document.getElementById('prof-fullname');
  const unEl = document.getElementById('prof-username');
  const phEl = document.getElementById('prof-phone');
  const emEl = document.getElementById('prof-email');
  const utEl = document.getElementById('prof-unit');


  const dispName = document.getElementById('prof-display-name') || document.getElementById('profile-display-fullname');
  const roleBadge = document.getElementById('prof-badge-role') || document.getElementById('profile-role-badge');
  const unitTag = document.getElementById('prof-display-unit') || document.getElementById('profile-unit-tag');


  if (fnEl) fnEl.value = currentUser.full_name || '';
  if (unEl) unEl.value = currentUser.username || '';
  if (phEl) phEl.value = currentUser.phone || '';
  if (emEl) emEl.value = currentUser.email || '';
  if (utEl) utEl.value = unitName;


  const displayOfficerName = currentUser.full_name || currentUser.username || 'Officer';
  if (dispName) dispName.textContent = displayOfficerName;
  if (roleBadge) roleBadge.textContent = currentUser.role || 'Officer';
  if (unitTag) unitTag.textContent = unitName;


  const avatarCircle = document.getElementById('profile-avatar-circle');
  const removePhotoBtn = document.getElementById('btn-remove-photo');
  const secUnitText = document.getElementById('profile-sec-unit-text');


  if (avatarCircle) {
    if (currentUser.photo && currentUser.photo.trim()) {
      avatarCircle.innerHTML = `<img src="${currentUser.photo}" alt="Avatar" style="width:100%; height:100%; object-fit:cover; display:block; border-radius:50%;">`;
    } else {
      avatarCircle.innerHTML = '👤';
    }
  }
  if (removePhotoBtn) {
    removePhotoBtn.style.display = (currentUser.photo && currentUser.photo.trim()) ? 'inline-flex' : 'none';
  }
  if (secUnitText) {
    secUnitText.textContent = `${unitName} Authorized Officer`;
  }
}


async function handleSaveProfileInfo(e) {
  e.preventDefault();
  if (!currentUser || !currentUser.id) return;


  const fnInput = document.getElementById('prof-full-name') || document.getElementById('prof-fullname');
  const phInput = document.getElementById('prof-phone');
  const emInput = document.getElementById('prof-email');
  const saveBtn = document.getElementById('btn-save-prof-info') || document.getElementById('btn-save-prof-details');
  const msgEl = document.getElementById('prof-info-msg');


  const fullName = fnInput ? fnInput.value.trim() : '';
  const phone = phInput ? phInput.value.trim() : '';
  const email = emInput ? emInput.value.trim() : '';


  if (!fullName) {
    if (msgEl) {
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'කරුණාකර සම්පූර්ණ නම ඇතුළත් කරන්න. (Full name is required)';
      msgEl.style.display = 'block';
    }
    return;
  }


  const savingText = activeLang === 'si' ? 'සුරකිමින්...' : (activeLang === 'ta' ? 'சேமிக்கிறது...' : 'Saving...');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span>${savingText}</span> ⏳`;
  }
  if (msgEl) msgEl.style.display = 'none';


  try {
    const res = await fetch('api.php?action=update_profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: currentUser.id,
        full_name: fullName,
        phone: phone,
        email: email,
        photo: currentUser.photo || ''
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      currentUser.full_name = data.user.full_name;
      currentUser.phone = data.user.phone;
      currentUser.email = data.user.email;
      if (data.user.photo !== undefined) currentUser.photo = data.user.photo;
      sessionStorage.setItem('admin_user', JSON.stringify(currentUser));
      sessionStorage.setItem('nwp_admin_user', JSON.stringify(currentUser));
      updateProfileCard();
      populateProfileView();
      if (msgEl) {
        msgEl.style.background = '#ECFDF5';
        msgEl.style.color = 'var(--accent-green)';
        msgEl.textContent = 'පැතිකඩ තොරතුරු සාර්ථකව සුරකින ලදී! (Profile updated successfully)';
        msgEl.style.display = 'block';
      }
      showToast('පැතිකඩ තොරතුරු සාර්ථකව සුරකින ලදී! 💾');
    } else {
      if (msgEl) {
        msgEl.style.background = '#FFEAEF';
        msgEl.style.color = 'var(--pill-coral)';
        msgEl.textContent = data.error || 'Failed to update profile.';
        msgEl.style.display = 'block';
      } else {
        alert(data.error || 'Failed to update profile.');
      }
    }
  } catch (err) {
    alert('Server connection error.');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
      saveBtn.innerHTML = `<span>💾</span> <span>${dict.btnSaveProfile || 'Save Profile Changes'}</span>`;
    }
  }
}
function handleSaveProfileDetails(e) {
  return handleSaveProfileInfo(e);
}
window.handleSaveProfileInfo = handleSaveProfileInfo;
window.handleSaveProfileDetails = handleSaveProfileDetails;


async function handleSaveProfilePassword(e) {
  e.preventDefault();
  if (!currentUser || !currentUser.id) return;


  const currentPwd = (document.getElementById('prof-current-password')?.value || '').trim();
  const newPwd = (document.getElementById('prof-new-password')?.value || '').trim();
  const confirmPwd = (document.getElementById('prof-confirm-password')?.value || '').trim();
  const msgEl = document.getElementById('prof-pwd-msg');
  const saveBtn = document.getElementById('btn-save-prof-pwd');


  if (!currentPwd) {
    if (msgEl) {
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'කරුණාකර වත්මන් මුරපදය ඇතුළත් කරන්න. (Current password is required)';
      msgEl.style.display = 'block';
    }
    return;
  }


  if (newPwd.length < 6) {
    if (msgEl) {
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'නව මුරපදය අවම වශයෙන් අකුරු 6ක් විය යුතුය. (New password must be at least 6 characters)';
      msgEl.style.display = 'block';
    }
    return;
  }


  if (newPwd !== confirmPwd) {
    if (msgEl) {
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'මුරපද නොගැලපේ. කරුණාකර නැවත පරීක්ෂා කරන්න. (Passwords do not match)';
      msgEl.style.display = 'block';
    }
    return;
  }


  if (saveBtn) {
    saveBtn.disabled = true;
    const pwLang = currentDashboardLang || 'en';
    const pwUpdatingText = pwLang === 'si' ? 'යාවත්කාලීන කරමින්...' : (pwLang === 'ta' ? 'புதுப்பிக்கிறது...' : 'Updating...');
    saveBtn.innerHTML = `<span>${pwUpdatingText}</span> ⏳`;
  }
  if (msgEl) msgEl.style.display = 'none';


  try {
    const res = await fetch('api.php?action=update_profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: currentUser.id,
        full_name: currentUser.full_name || currentUser.username,
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        current_password: currentPwd,
        password: newPwd
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (msgEl) {
        msgEl.style.background = '#ECFDF5';
        msgEl.style.color = 'var(--accent-green)';
        msgEl.textContent = 'මුරපදය සාර්ථකව යාවත්කාලීන විය! (Password updated successfully)';
        msgEl.style.display = 'block';
      }
      document.getElementById('form-profile-password')?.reset();
      showToast('මුරපදය සාර්ථකව යාවත්කාලීන කරන ලදී! 🔑');
    } else {
      if (msgEl) {
        msgEl.style.background = '#FFEAEF';
        msgEl.style.color = 'var(--pill-coral)';
        msgEl.textContent = data.error || 'Failed to update password.';
        msgEl.style.display = 'block';
      }
    }
  } catch (err) {
    if (msgEl) {
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'Server error while connecting to API.';
      msgEl.style.display = 'block';
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      const dict = adminTranslations[currentDashboardLang] || adminTranslations['en'];
      saveBtn.innerHTML = `<span>🔑</span> <span>${dict.btnUpdatePassword || 'Update Password'}</span>`;
    }
  }
}
window.handleSaveProfilePassword = handleSaveProfilePassword;


// 14.1 Profile Photo Upload & Remove Handlers
async function handleProfilePhotoSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;


  if (!currentUser || !currentUser.id) {
    alert('කරුණාකර පළමුව පද්ධතියට ලොග් වන්න. Please log in to update your profile photo.');
    return;
  }


  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('ගොනුවේ ප්‍රමාණය විශාල වැඩියි (උපරිම 10MB). Image size exceeds 10MB.');
    event.target.value = '';
    return;
  }


  // Visual loading feedback
  const avatarCircle = document.getElementById('profile-avatar-circle');
  if (avatarCircle) {
    avatarCircle.innerHTML = '<div style="font-size:1.6rem; display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:rgba(0,0,0,0.4); border-radius:50%;">⏳</div>';
  }


  let fileToUpload = file;
  if (fileToUpload.type && fileToUpload.type.startsWith('image/')) {
    fileToUpload = await compressImageFile(fileToUpload, 800, 800, 0.85);
  }
  const formData = new FormData();
  formData.append('file', fileToUpload);
  if (currentUser.username) {
    formData.append('username', currentUser.username);
  }


  const avLang = currentDashboardLang || 'en';
  const avToast = avLang === 'si' ? 'පැතිකඩ ඡායාරූපය උඩුගත කරමින්... ⏳' : (avLang === 'ta' ? 'சுயவிவரப் படம் பதிவேற்றப்படுகிறது... ⏳' : 'Uploading profile photo... ⏳');
  showToast(avToast);


  try {
    const uploadRes = await fetch('api.php?action=upload', {
      method: 'POST',
      body: formData
    });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok || !uploadData.success || !uploadData.url) {
      alert(uploadData.error || 'Failed to upload photo file.');
      populateProfileView();
      return;
    }


    const photoUrl = uploadData.url;


    const updateRes = await fetch('api.php?action=update_profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: currentUser.id,
        full_name: currentUser.full_name || currentUser.username || 'Officer',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        photo: photoUrl
      })
    });
    const updateData = await updateRes.json();
    if (updateRes.ok && updateData.success) {
      currentUser.photo = photoUrl;
      if (updateData.user) {
        currentUser = { ...currentUser, ...updateData.user };
      }
      sessionStorage.setItem('admin_user', JSON.stringify(currentUser));
      sessionStorage.setItem('nwp_admin_user', JSON.stringify(currentUser));
      updateProfileCard();
      populateProfileView();
      showToast('පැතිකඩ ඡායාරූපය සාර්ථකව යාවත්කාලීන විය! 📷');
    } else {
      alert(updateData.error || 'Failed to save profile photo.');
      populateProfileView();
    }
  } catch (err) {
    console.error('Profile photo upload error:', err);
    alert('Error uploading profile photo.');
    populateProfileView();
  } finally {
    event.target.value = '';
  }
}


function handleProfileAvatarUpload(event) {
  return handleProfilePhotoSelected(event);
}
window.handleProfileAvatarUpload = handleProfileAvatarUpload;
window.handleProfilePhotoSelected = handleProfilePhotoSelected;


async function handleRemoveProfilePhoto() {
  if (!currentUser || !currentUser.id) return;
  if (!confirm('පැතිකඩ ඡායාරූපය ඉවත් කිරීමට ඔබට විශ්වාසද? (Are you sure you want to remove your custom profile photo?)')) return;


  try {
    const updateRes = await fetch('api.php?action=update_profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: currentUser.id,
        full_name: currentUser.full_name || currentUser.username || 'Officer',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        photo: ''
      })
    });
    const updateData = await updateRes.json();
    if (updateRes.ok && updateData.success) {
      currentUser.photo = '';
      if (updateData.user) {
        currentUser = { ...currentUser, ...updateData.user, photo: '' };
      }
      sessionStorage.setItem('admin_user', JSON.stringify(currentUser));
      sessionStorage.setItem('nwp_admin_user', JSON.stringify(currentUser));
      updateProfileCard();
      populateProfileView();
      showToast('පැතිකඩ ඡායාරූපය සාර්ථකව ඉවත් කරන ලදී.');
    } else {
      alert(updateData.error || 'Failed to remove profile photo.');
    }
  } catch (err) {
    alert('Error removing profile photo.');
  }
}
window.handleRemoveProfilePhoto = handleRemoveProfilePhoto;


// 14.2 Password Modal Functions (Popup Window)
function openChangePasswordModal() {
  const form = document.getElementById('form-profile-password-modal');
  if (form) form.reset();
  const msg = document.getElementById('modal-prof-pwd-msg');
  if (msg) msg.style.display = 'none';
  openModal('modal-profile-password');
}


async function handleSaveProfilePasswordModal(e) {
  e.preventDefault();
  if (!currentUser || !currentUser.id) return;


  const currentPwd = document.getElementById('modal-prof-current-pwd').value.trim();
  const newPwd = document.getElementById('modal-prof-new-pwd').value.trim();
  const confirmPwd = document.getElementById('modal-prof-confirm-pwd').value.trim();
  const msgEl = document.getElementById('modal-prof-pwd-msg');
  const saveBtn = document.getElementById('btn-save-modal-prof-pwd');


  if (!currentPwd) {
    msgEl.style.background = '#FFEAEF';
    msgEl.style.color = 'var(--pill-coral)';
    msgEl.textContent = currentDashboardLang === 'si' ? "කරුණාකර ඔබගේ වත්මන් මුරපදය ඇතුළත් කරන්න." : (currentDashboardLang === 'ta' ? "தயவுசெய்து உங்கள் தற்போதைய கடவுச்சொல்லை உள்ளிடவும்." : "Please enter your current password.");
    msgEl.style.display = 'block';
    return;
  }


  if (newPwd.length < 6) {
    msgEl.style.background = '#FFEAEF';
    msgEl.style.color = 'var(--pill-coral)';
    msgEl.textContent = currentDashboardLang === 'si' ? "නව මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය." : (currentDashboardLang === 'ta' ? "புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துகளாக இருக்க வேண்டும்." : "New password must be at least 6 characters.");
    msgEl.style.display = 'block';
    return;
  }


  if (newPwd !== confirmPwd) {
    msgEl.style.background = '#FFEAEF';
    msgEl.style.color = 'var(--pill-coral)';
    msgEl.textContent = currentDashboardLang === 'si' ? "නව මුරපද නොගැළපේ. කරුණාකර නැවත පරීක්ෂා කරන්න." : (currentDashboardLang === 'ta' ? "கடவுச்சொற்கள் பொருந்தவில்லை. தயவுசெய்து மீண்டும் உள்ளிடவும்." : "Passwords do not match. Please re-enter carefully.");
    msgEl.style.display = 'block';
    return;
  }


  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span>Verifying & Updating...</span> ⏳';
  msgEl.style.display = 'none';


  try {
    const res = await fetch('api.php?action=update_profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: currentUser.id,
        full_name: currentUser.full_name,
        phone: currentUser.phone,
        email: currentUser.email,
        current_password: currentPwd,
        password: newPwd
      })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      msgEl.style.background = '#ECFDF5';
      msgEl.style.color = 'var(--accent-green)';
      msgEl.textContent = currentDashboardLang === 'si' ? "මුරපදය සාර්ථකව යාවත්කාලීන කරන ලදී!" : (currentDashboardLang === 'ta' ? "கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!" : "Password updated successfully! Keep your credentials secure.");
      msgEl.style.display = 'block';
      showToast("Password updated successfully!");
      document.getElementById('form-profile-password-modal').reset();
      setTimeout(() => {
        closeModal('modal-profile-password');
      }, 1500);
    } else {
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = data.error || (currentDashboardLang === 'si' ? "මුරපදය වෙනස් කිරීම අසාර්ථක විය." : "Failed to update password.");
      msgEl.style.display = 'block';
    }
  } catch (err) {
    msgEl.style.background = '#FFEAEF';
    msgEl.style.color = 'var(--pill-coral)';
    msgEl.textContent = "Server error while connecting to API.";
    msgEl.style.display = 'block';
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<span>🔑</span> Update Password';
  }
}


// 12.3 Forgot Password Email Verification Flow
function openForgotPasswordModal() {
  const activeLang = localStorage.getItem('preferred_lang') || localStorage.getItem('admin_lang') || 'en';
  setDashboardLanguage(activeLang, false);
  const step1 = document.getElementById('forgot-step-1');
  const step2 = document.getElementById('forgot-step-2');
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';


  const form1 = document.getElementById('form-forgot-step1');
  const form2 = document.getElementById('form-forgot-step2');
  if (form1) form1.reset();
  if (form2) form2.reset();


  const msg1 = document.getElementById('modal-forgot-step1-msg');
  const msg2 = document.getElementById('modal-forgot-step2-msg');
  if (msg1) { msg1.style.display = 'none'; msg1.textContent = ''; }
  if (msg2) { msg2.style.display = 'none'; msg2.textContent = ''; }


  const idInput = document.getElementById('modal-forgot-identifier');
  if (idInput && currentUser) {
    idInput.value = currentUser.username || currentUser.email || '';
  }


  openModal('modal-forgot-password');
}


function backToForgotStep1() {
  const step1 = document.getElementById('forgot-step-1');
  const step2 = document.getElementById('forgot-step-2');
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
  const msg1 = document.getElementById('modal-forgot-step1-msg');
  if (msg1) msg1.style.display = 'none';
}


async function handleSendForgotCode(e) {
  e.preventDefault();
  const idInput = document.getElementById('modal-forgot-identifier');
  const identifier = idInput ? idInput.value.trim() : '';
  const msgEl = document.getElementById('modal-forgot-step1-msg');
  const btn = document.getElementById('btn-forgot-send-code');


  if (!identifier) return;


  if (btn) { btn.disabled = true; btn.innerHTML = `<span>Sending... ⏳</span>`; }
  if (msgEl) { msgEl.style.display = 'none'; msgEl.textContent = ''; }


  try {
    const res = await fetch('api.php?action=forgot_send_code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: identifier })
    });
    const data = await res.json();


    if (res.ok && data.success) {
      const targetEmailEl = document.getElementById('forgot-target-email');
      if (targetEmailEl) targetEmailEl.textContent = data.masked_email || identifier;


      const userHidden = document.getElementById('modal-forgot-confirmed-user');
      if (userHidden) userHidden.value = data.username || identifier;


      // Transition to Step 2
      const step1 = document.getElementById('forgot-step-1');
      const step2 = document.getElementById('forgot-step-2');
      if (step1) step1.style.display = 'none';
      if (step2) {
        step2.style.display = 'block';
        const codeInput = document.getElementById('modal-forgot-code');
        if (codeInput) {
          codeInput.value = data.code || '';
          setTimeout(() => codeInput.focus(), 100);
        }
      }
    } else {
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.style.background = '#FFEAEF';
        msgEl.style.color = 'var(--pill-coral)';
        msgEl.textContent = data.error || 'Failed to send verification code.';
      }
    }
  } catch (err) {
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'Server connection error. Please try again.';
    }
  } finally {
      const lang = typeof currentAdminLang !== 'undefined' ? currentAdminLang : 'en';
      const label = (typeof translations !== 'undefined' && translations[lang]?.btnSendCode) ? translations[lang].btnSendCode : 'Send Verification Code';
      btn.innerHTML = `<span data-i18n-admin="btnSendCode">${label}</span> ➔`;
  }
}


async function handleVerifyAndResetPassword(e) {
  e.preventDefault();
  const username = document.getElementById('modal-forgot-confirmed-user')?.value || '';
  const code = document.getElementById('modal-forgot-code')?.value.trim() || '';
  const newPwd = document.getElementById('modal-forgot-new-pwd')?.value.trim() || '';
  const confirmPwd = document.getElementById('modal-forgot-confirm-pwd')?.value.trim() || '';
  const msgEl = document.getElementById('modal-forgot-step2-msg');
  const btn = document.getElementById('btn-forgot-verify-reset');


  if (code.length !== 6) {
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'Please enter the valid 6-digit verification code.';
    }
    return;
  }


  if (newPwd.length < 6) {
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'Password must be at least 6 characters long.';
    }
    return;
  }


  if (newPwd !== confirmPwd) {
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'Passwords do not match.';
    }
    return;
  }


  if (btn) { btn.disabled = true; btn.innerHTML = `<span>Verifying... ⏳</span>`; }
  if (msgEl) { msgEl.style.display = 'none'; msgEl.textContent = ''; }


  try {
    const res = await fetch('api.php?action=forgot_verify_reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        code: code,
        new_password: newPwd
      })
    });
    const data = await res.json();


    if (res.ok && data.success) {
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.style.background = '#ECFDF5';
        msgEl.style.color = 'var(--accent-green)';
        msgEl.textContent = '✅ ' + (data.message || 'Password successfully reset!');
      }


      setTimeout(() => {
        closeModal('modal-forgot-password');
        showToast('Password reset successfully! Please sign in with your new credentials.');
        switchAuthMode('login');
      }, 1500);
    } else {
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.style.background = '#FFEAEF';
        msgEl.style.color = 'var(--pill-coral)';
        msgEl.textContent = data.error || 'Verification failed.';
      }
    }
  } catch (err) {
    if (msgEl) {
      msgEl.style.display = 'block';
      msgEl.style.background = '#FFEAEF';
      msgEl.style.color = 'var(--pill-coral)';
      msgEl.textContent = 'Connection error. Please try again.';
    }
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = `<span>Verify & Reset Password</span> ➔`; }
  }
}




// ============================================================================
// DIVISION & SUB-DIVISION CREATION / MANAGEMENT
// ============================================================================
function populateSubDivParentSelect(defaultParentId = null) {
  const parentSelect = document.getElementById('sub-div-parent-select');
  if (!parentSelect) return;
  parentSelect.innerHTML = '';
  const mainDivs = Object.values(db.divisionsData || {});
  mainDivs.forEach(div => {
    const opt = document.createElement('option');
    opt.value = div.id;
    const dName = div['name_' + currentDashboardLang] || div.name_en;
    opt.textContent = `${div.id}. ${dName}`;
    parentSelect.appendChild(opt);
  });
  if (defaultParentId) {
    parentSelect.value = String(defaultParentId);
  }
}


function openCreateDivisionModal(defaultType = 'main', defaultParentId = null) {
  const form = document.getElementById('form-create-division');
  if (form) form.reset();


  const msgEl = document.getElementById('div-manage-msg');
  if (msgEl) msgEl.style.display = 'none';


  divisionModalLang = currentDashboardLang || 'en';


  // Populate parent division select
  populateSubDivParentSelect(defaultParentId);


  switchDivisionCreateType(defaultType);
  syncModalLangWithDashboard(divisionModalLang);
  openModal('modal-division-manage');
}


function switchDivisionCreateType(type) {
  const typeInput = document.getElementById('div-manage-type');
  if (typeInput) typeInput.value = type;


  const btnMain = document.getElementById('btn-type-main-div');
  const btnSub = document.getElementById('btn-type-sub-div');
  const secMain = document.getElementById('section-main-division-fields');
  const secSub = document.getElementById('section-sub-division-fields');
  const saveBtnText = document.getElementById('btn-save-div-manage-text');
  const lang = divisionModalLang || currentDashboardLang || 'en';
  const dict = adminTranslations[lang] || adminTranslations['en'];


  if (type === 'main') {
    if (btnMain) {
      btnMain.style.background = '#380000';
      btnMain.style.color = '#FFFFFF';
    }
    if (btnSub) {
      btnSub.style.background = 'transparent';
      btnSub.style.color = 'var(--text-main)';
    }
    if (secMain) secMain.style.display = 'block';
    if (secSub) secSub.style.display = 'none';
    const saveBtn = document.getElementById('btn-save-div-manage');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>💾</span> <span id="btn-save-div-manage-text">${escapeHtml(dict.btnCreateMainDiv || 'Create Main Division')}</span>`;
    }
  } else {
    if (btnMain) {
      btnMain.style.background = 'transparent';
      btnMain.style.color = 'var(--text-main)';
    }
    if (btnSub) {
      btnSub.style.background = '#380000';
      btnSub.style.color = '#FFFFFF';
    }
    if (secMain) secMain.style.display = 'none';
    if (secSub) secSub.style.display = 'block';
    const saveBtn = document.getElementById('btn-save-div-manage');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>💾</span> <span id="btn-save-div-manage-text">${escapeHtml(dict.btnCreateSubDiv || 'Create Sub-Division')}</span>`;
    }
  }
}


async function handleSaveDivisionOrSub(e) {
  e.preventDefault();
  const type = document.getElementById('div-manage-type').value;
  const msgEl = document.getElementById('div-manage-msg');
  if (msgEl) msgEl.style.display = 'none';


  if (!db.divisionsData) db.divisionsData = {};


  const saveBtn = document.getElementById('btn-save-div-manage');
  const activeLang = divisionModalLang || currentDashboardLang || 'en';
  const dict = adminTranslations[activeLang] || adminTranslations['en'];


  const savingText = activeLang === 'si' ? 'සුරකිමින්...' : (activeLang === 'ta' ? 'சேமிக்கிறது...' : 'Saving...');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span>${savingText}</span> ⏳`;
  }


  if (type === 'main') {
    let name_en = document.getElementById('main-div-name-en')?.value.trim() || '';
    let name_si = document.getElementById('main-div-name-si')?.value.trim() || '';
    let name_ta = document.getElementById('main-div-name-ta')?.value.trim() || '';


    let head_en = document.getElementById('main-div-head-en')?.value.trim() || '';
    let head_si = document.getElementById('main-div-head-si')?.value.trim() || '';
    let head_ta = document.getElementById('main-div-head-ta')?.value.trim() || '';


    let desc_en = document.getElementById('main-div-desc-en')?.value.trim() || '';
    let desc_si = document.getElementById('main-div-desc-si')?.value.trim() || '';
    let desc_ta = document.getElementById('main-div-desc-ta')?.value.trim() || '';
    const rawSections = document.getElementById('main-div-initial-sections')?.value.trim() || '';


    // Primary name check based on active modal language
    const primaryName = (activeLang === 'si' && name_si) ? name_si :
                        ((activeLang === 'ta' && name_ta) ? name_ta :
                        (name_en || name_si || name_ta));


    const primaryHead = (activeLang === 'si' && head_si) ? head_si :
                        ((activeLang === 'ta' && head_ta) ? head_ta :
                        (head_en || head_si || head_ta));


    if (!primaryName || !primaryHead) {
      if (msgEl) {
        msgEl.textContent = activeLang === 'si'
          ? 'කරුණාකර අංශයේ නම සහ ප්‍රධානියාගේ තනතුර ඇතුළත් කරන්න.'
          : (activeLang === 'ta' ? 'தயவுசெய்து பிரிவு பெயர் மற்றும் தலைவர் பதவியை உள்ளிடவும்.' : 'Division Name and Head of Division are required.');
        msgEl.style.display = 'block';
      }
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<span>💾</span> <span id="btn-save-div-manage-text">${dict.btnCreateMainDiv || 'Create Main Division'}</span>`;
      }
      return;
    }


    const isBlankDiv = s => !s || /^[\s\.\,\-]+$/.test(s);
    if (isBlankDiv(name_en) || isBlankDiv(name_si) || isBlankDiv(name_ta)) {
      try {
        let sl = (primaryName === name_si) ? 'si' : ((primaryName === name_ta) ? 'ta' : 'auto');
        const res = await fetch(`api.php?action=translate_all&text=${encodeURIComponent(primaryName)}&sl=${sl}`);
        if (res.ok) {
          const d = await res.json();
          if (d.success && d.translations) {
            if (isBlankDiv(name_en)) name_en = d.translations.en || primaryName;
            if (isBlankDiv(name_si)) name_si = cleanSinhalaOrthography(d.translations.si || primaryName);
            if (isBlankDiv(name_ta)) name_ta = d.translations.ta || primaryName;
          }
        }
      } catch (e) {}
    }


    if (isBlankDiv(head_en) || isBlankDiv(head_si) || isBlankDiv(head_ta)) {
      try {
        let sl = (primaryHead === head_si) ? 'si' : ((primaryHead === head_ta) ? 'ta' : 'auto');
        const res = await fetch(`api.php?action=translate_all&text=${encodeURIComponent(primaryHead)}&sl=${sl}`);
        if (res.ok) {
          const d = await res.json();
          if (d.success && d.translations) {
            if (isBlankDiv(head_en)) head_en = d.translations.en || primaryHead;
            if (isBlankDiv(head_si)) head_si = cleanSinhalaOrthography(d.translations.si || primaryHead);
            if (isBlankDiv(head_ta)) head_ta = d.translations.ta || primaryHead;
          }
        }
      } catch (e) {}
    }


    if (!name_en) name_en = primaryName;
    if (!name_si) name_si = primaryName;
    if (!name_ta) name_ta = primaryName;


    if (!head_en) head_en = primaryHead;
    if (!head_si) head_si = primaryHead;
    if (!head_ta) head_ta = primaryHead;


    const primaryDesc = (activeLang === 'si' && desc_si) ? desc_si :
                        ((activeLang === 'ta' && desc_ta) ? desc_ta :
                        (desc_en || desc_si || desc_ta || `Oversees ${name_en} operations and provincial public services.`));
    if (!desc_en) desc_en = primaryDesc;
    if (!desc_si) desc_si = primaryDesc;
    if (!desc_ta) desc_ta = primaryDesc;


    const existingIds = Object.keys(db.divisionsData).map(k => parseInt(k, 10)).filter(n => !isNaN(n));
    const nextId = existingIds.length > 0 ? (Math.max(...existingIds) + 1) : 1;


    const sections = rawSections ? rawSections.split(',').map(s => s.trim()).filter(Boolean) : [];
    let sections_en = [...sections];
    let sections_si = [...sections];
    let sections_ta = [...sections];

    if (sections.length > 0) {
      try {
        const sl = (activeLang === 'si') ? 'si' : ((activeLang === 'ta') ? 'ta' : 'auto');
        const trPromises = sections.map(async (sec) => {
          try {
            const trRes = await fetch(`api.php?action=translate_all&text=${encodeURIComponent(sec)}&sl=${sl}`);
            if (trRes.ok) {
              const trData = await trRes.json();
              if (trData.success && trData.translations) {
                return {
                  en: trData.translations.en || sec,
                  si: cleanSinhalaOrthography(trData.translations.si || sec),
                  ta: trData.translations.ta || sec
                };
              }
            }
          } catch (e) {}
          return { en: sec, si: sec, ta: sec };
        });
        const trResults = await Promise.all(trPromises);
        sections_en = trResults.map(r => r.en);
        sections_si = trResults.map(r => r.si);
        sections_ta = trResults.map(r => r.ta);
      } catch (e) {}
    }


    const newDivision = {
      id: nextId,
      code: name_en.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30) || ('division_' + nextId),
      name_en: name_en,
      name_si: name_si,
      name_ta: name_ta,
      desc_en: desc_en,
      desc_si: desc_si,
      desc_ta: desc_ta,
      head_title_en: head_en,
      head_title_si: head_si,
      head_title_ta: head_ta,
      sections_en: sections_en,
      sections_si: sections_si,
      sections_ta: sections_ta,
      officers: [],
      is_custom: true
    };


    db.divisionsData[String(nextId)] = newDivision;
  } else {
    const parentId = document.getElementById('sub-div-parent-select').value;
    let sub_en = document.getElementById('sub-div-name-en')?.value.trim() || '';
    let sub_si = document.getElementById('sub-div-name-si')?.value.trim() || '';
    let sub_ta = document.getElementById('sub-div-name-ta')?.value.trim() || '';


    const primarySub = (activeLang === 'si' && sub_si) ? sub_si :
                       ((activeLang === 'ta' && sub_ta) ? sub_ta :
                       (sub_en || sub_si || sub_ta));


    if (!primarySub) {
      if (msgEl) {
        msgEl.textContent = activeLang === 'si'
          ? 'කරුණාකර අනු අංශයේ / ඒකකයේ නම ඇතුළත් කරන්න.'
          : (activeLang === 'ta' ? 'தயவுசெய்து துணைப் பிரிவு பெயரை உள்ளிடவும்.' : 'Sub-Unit Name is required.');
        msgEl.style.display = 'block';
      }
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<span>💾</span> <span id="btn-save-div-manage-text">${dict.btnCreateSubDiv || 'Create Sub-Division'}</span>`;
      }
      return;
    }


    const isBlankSub = s => !s || /^[\s\.\,\-]+$/.test(s);
    if (isBlankSub(sub_en) || isBlankSub(sub_si) || isBlankSub(sub_ta)) {
      try {
        let sl = (primarySub === sub_si) ? 'si' : ((primarySub === sub_ta) ? 'ta' : 'auto');
        const res = await fetch(`api.php?action=translate_all&text=${encodeURIComponent(primarySub)}&sl=${sl}`);
        if (res.ok) {
          const d = await res.json();
          if (d.success && d.translations) {
            if (isBlankSub(sub_en)) sub_en = d.translations.en || primarySub;
            if (isBlankSub(sub_si)) sub_si = cleanSinhalaOrthography(d.translations.si || primarySub);
            if (isBlankSub(sub_ta)) sub_ta = d.translations.ta || primarySub;
          }
        }
      } catch (e) {}
    }


    if (!sub_en) sub_en = primarySub;
    if (!sub_si) sub_si = primarySub;
    if (!sub_ta) sub_ta = primarySub;


    const parentDiv = db.divisionsData[String(parentId)];
    if (!parentDiv) {
      if (msgEl) {
        msgEl.textContent = 'Parent main division not found.';
        msgEl.style.display = 'block';
      }
      if (saveBtn) saveBtn.disabled = false;
      return;
    }


    if (!Array.isArray(parentDiv.sections_en)) parentDiv.sections_en = [];
    if (!Array.isArray(parentDiv.sections_si)) parentDiv.sections_si = [];
    if (!Array.isArray(parentDiv.sections_ta)) parentDiv.sections_ta = [];


    parentDiv.sections_en.push(sub_en);
    parentDiv.sections_si.push(sub_si);
    parentDiv.sections_ta.push(sub_ta);
    parentDiv.has_custom_units = true;
    if (!Array.isArray(parentDiv.custom_sections)) parentDiv.custom_sections = [];
    parentDiv.custom_sections.push(sub_en);
  }


  try {
    const success = await saveEntireDatabaseToServer();
    if (success) {
      showToast(activeLang === 'si' 
        ? 'අංශ ව්‍යුහය සාර්ථකව සුරකින ලදී! සියලුම ලැයිස්තු යාවත්කාලීන විය.' 
        : (activeLang === 'ta' ? 'பிரிவு அமைப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Division structure updated successfully! All lists updated across the system.'));
      closeModal('modal-division-manage');


      // Refresh every place in the system where divisions / units are displayed!
      populateSubDivParentSelect();
      renderAdminDivisions();
      populateDocDivisionDropdown();
      populateRegisterUnitsDropdown();
      populatePortalDivisionSelect();
      renderPortalsCategoryPills();
      renderAdminPortals();
      if (typeof updateMetricCounts === 'function') updateMetricCounts();
      if (typeof updateMetricCounters === 'function') updateMetricCounters();
    } else {
      if (msgEl) {
        msgEl.textContent = 'Failed to save division. Server returned error.';
        msgEl.style.display = 'block';
      }
    }
  } catch (err) {
    if (msgEl) {
      msgEl.textContent = 'Network or server error: ' + err.message;
      msgEl.style.display = 'block';
    }
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      const btnLabel = (type === 'main') 
        ? (dict.btnCreateMainDiv || (activeLang === 'si' ? 'ප්‍රධාන අංශය සාදන්න' : (activeLang === 'ta' ? 'முதன்மைப் பிரிவை உருவாக்கவும்' : 'Create Main Division')))
        : (dict.btnCreateSubDiv || (activeLang === 'si' ? 'අනු අංශය එක් කරන්න' : (activeLang === 'ta' ? 'துணைப் பிரிவைச் சேர்க்கவும்' : 'Create Sub-Division')));
      saveBtn.innerHTML = `<span>💾</span> <span id="btn-save-div-manage-text">${escapeHtml(btnLabel)}</span>`;
    }
  }
}


async function handleDeleteDivision(divId) {
  const confirmMsg = currentDashboardLang === 'si'
    ? `${divId} වන අංශය මකා දැමීමට ඔබට විශ්වාසද? මෙම ක්‍රියාව නැවත හැරවිය නොහැක.`
    : `Are you sure you want to delete Division ${divId}? This action cannot be undone.`;
  if (!confirm(confirmMsg)) return;


  if (db.divisionsData && db.divisionsData[String(divId)]) {
    delete db.divisionsData[String(divId)];
    const ok = await saveEntireDatabaseToServer();
    if (ok) {
      showToast(currentDashboardLang === 'si' ? 'අංශය සාර්ථකව ඉවත් කරන ලදී.' : 'Division deleted successfully.');
      populateSubDivParentSelect();
      renderAdminDivisions();
      populateDocDivisionDropdown();
      populateRegisterUnitsDropdown();
      populatePortalDivisionSelect();
      renderPortalsCategoryPills();
      renderAdminPortals();
      if (typeof updateMetricCounts === 'function') updateMetricCounts();
      if (typeof updateMetricCounters === 'function') updateMetricCounters();
    }
  }
}


function saveSiteDatabase() {
  return saveEntireDatabaseToServer();
}
window.saveSiteDatabase = saveSiteDatabase;


// ============================================================================
// STATUTORY DIVISION WEB PORTALS & LINKS MANAGER (Divisions 2, 3, 4, 5)
// ============================================================================
let currentPortalsDivision = 'all';


function renderPortalsCategoryPills() {
  const container = document.getElementById('portals-category-pills');
  if (!container) return;


  const lang = currentDashboardLang || 'en';
  const divs = db.divisionsData || {};
  const divKeys = Object.keys(divs).sort((a,b) => parseInt(a,10) - parseInt(b,10));


  const allLabel = lang === 'si' ? `සියලු අංශ (${divKeys.length})` : (lang === 'ta' ? `அனைத்து பிரிவுகளும் (${divKeys.length})` : `All ${divKeys.length} Divisions`);


  let html = `<button type="button" class="select-pill ${currentPortalsDivision === 'all' ? 'active' : ''}" onclick="setPortalsFilter('all', this)" style="padding:6px 16px; font-size:0.78rem; border-radius:20px; font-weight:700; background:${currentPortalsDivision === 'all' ? 'var(--primary-maroon, #380000)' : '#FFFFFF'}; color:${currentPortalsDivision === 'all' ? '#FFFFFF' : 'var(--text-main, #380000)'}; border:${currentPortalsDivision === 'all' ? 'none' : '1.5px solid #DEC5C3'}; cursor:pointer; transition:all 0.2s ease;">${escapeHtml(allLabel)}</button>`;


  divKeys.forEach(k => {
    const d = divs[k];
    const isActive = String(currentPortalsDivision) === String(k);
    const dName = d[`name_${lang}`] || d.name_en || d.name_si || `Division ${k}`;
    const shortLabel = `${k}. ${dName.split('(')[0].replace(/Division|Department|අංශය|பிரிவு/gi, '').trim()}`;
    const bg = isActive ? 'var(--primary-maroon, #380000)' : '#FFFFFF';
    const color = isActive ? '#FFFFFF' : 'var(--text-main, #380000)';
    const border = isActive ? 'none' : '1.5px solid #DEC5C3';


    html += `<button type="button" class="select-pill ${isActive ? 'active' : ''}" onclick="setPortalsFilter('${k}', this)" style="padding:6px 16px; font-size:0.78rem; border-radius:20px; font-weight:700; background:${bg}; color:${color}; border:${border}; cursor:pointer; transition:all 0.2s ease;">${escapeHtml(shortLabel)}</button>`;
  });


  container.innerHTML = html;
}


function setPortalsFilter(divId, btn) {
  currentPortalsDivision = divId;
  renderPortalsCategoryPills();
  filterAdminPortals();
}


function filterAdminPortals() {
  const query = (document.getElementById('search-portals-input')?.value || '').trim();
  renderAdminPortals(currentPortalsDivision, query);
}


function populatePortalDivisionSelect(selectedVal = null) {
  const sel = document.getElementById('portal-division-select');
  if (!sel) return;
  const lang = currentDashboardLang || 'en';
  const divs = db.divisionsData || {};
  const divKeys = Object.keys(divs).sort((a,b) => parseInt(a,10) - parseInt(b,10));


  const current = selectedVal || sel.value || (divKeys.length > 0 ? divKeys[0] : '1');
  sel.innerHTML = divKeys.map(k => {
    const div = divs[k];
    const text = `${k}. ${div['name_' + lang] || div.name_en || div.name_si || ('Division ' + k)}`;
    return `<option value="${k}" ${String(k) === String(current) ? 'selected' : ''}>${escapeHtml(text)}</option>`;
  }).join('');
}


function renderAdminPortals(filterDivId = 'all', filterQuery = '') {
  const tableBody = document.getElementById('admin-portals-table-body');
  if (!tableBody) return;


  const lang = currentDashboardLang || 'en';
  const divs = db.divisionsData || {};
  const allDivIds = Object.keys(divs).map(k => parseInt(k, 10)).filter(n => !isNaN(n)).sort((a,b) => a - b);


  const divisionIcons = {
    1: '🏛️',
    2: '🎓',
    3: '💰',
    4: '📐',
    5: '🗺️'
  };


  let items = [];


  allDivIds.forEach(id => {
    const d = divs[id] || divs[String(id)] || { id };
    const divName = d[`name_${lang}`] || d.name_en || d.name_si || `Division ${id}`;
    const divIcon = divisionIcons[id] || '🏛️';


    // 1. Main Division Portal
    // Respect explicit clear or absence of configured URL so user can delete anytime
    let mainUrl = '';
    let mainTitle = '';
    if (d.portal_cleared === true || d.portal_url === '') {
      mainUrl = '';
      mainTitle = '';
    } else if (d.portal_url) {
      mainUrl = String(d.portal_url).trim();
      mainTitle = d.portal_title ? String(d.portal_title).trim() : `${divName} Online Portal`;
    } else if (Array.isArray(db.divisionPortals)) {
      const pMatch = db.divisionPortals.find(p => String(p.division_id) === String(id) && p.target_unit === '__MAIN__');
      if (pMatch && pMatch.url) {
        mainUrl = pMatch.url;
        mainTitle = pMatch.title || `${divName} Online Portal`;
      } else {
        mainUrl = '';
        mainTitle = '';
      }
    } else {
      mainUrl = '';
      mainTitle = '';
    }


    const mainLabel = lang === 'si' ? '🏛️ ප්‍රධාන අංශ ද්වාරය' : (lang === 'ta' ? '🏛️ முதன்மை பிரிவு தளம்' : '🏛️ Main Division Portal');


    items.push({
      divId: id,
      divName,
      divIcon,
      targetUnit: '__MAIN__',
      targetLabel: mainLabel,
      isMain: true,
      url: mainUrl,
      title: mainTitle
    });


    // 2. Sub-Units
    const rawSections = d[`sections_${lang}`] || d.sections_en || d.sections_si || [];
    const sections = Array.isArray(rawSections) ? rawSections : (typeof rawSections === 'string' ? rawSections.split(',').map(s => s.trim()).filter(Boolean) : []);
    const subPrefix = lang === 'si' ? '🔹 අනු ඒකකය' : (lang === 'ta' ? '🔹 துணை அலகு' : '🔹 Sub-Unit');


    sections.forEach((sec, sIdx) => {
      let subUrl = '';
      let subTitle = '';
      if (d.section_urls && typeof d.section_urls === 'object') {
        const counterpartEn = d.sections_en?.[sIdx];
        const counterpartSi = d.sections_si?.[sIdx];
        const counterpartTa = d.sections_ta?.[sIdx];


        subUrl = d.section_urls[sec] ||
                 (counterpartEn && d.section_urls[counterpartEn]) ||
                 (counterpartSi && d.section_urls[counterpartSi]) ||
                 (counterpartTa && d.section_urls[counterpartTa]) ||
                 '';


        subTitle = (d.section_titles && (d.section_titles[sec] ||
                   (counterpartEn && d.section_titles[counterpartEn]) ||
                   (counterpartSi && d.section_titles[counterpartSi]) ||
                   (counterpartTa && d.section_titles[counterpartTa]))) ||
                   (subUrl ? `${sec} Portal` : '');
      }


      if (!subUrl && Array.isArray(db.divisionPortals)) {
        const pSub = db.divisionPortals.find(p => String(p.division_id) === String(id) && (
          String(p.target_unit).toLowerCase().trim() === String(sec).toLowerCase().trim() ||
          (d.sections_en?.[sIdx] && String(p.target_unit).toLowerCase().trim() === String(d.sections_en[sIdx]).toLowerCase().trim()) ||
          (d.sections_si?.[sIdx] && String(p.target_unit).toLowerCase().trim() === String(d.sections_si[sIdx]).toLowerCase().trim()) ||
          (d.sections_ta?.[sIdx] && String(p.target_unit).toLowerCase().trim() === String(d.sections_ta[sIdx]).toLowerCase().trim())
        ));
        if (pSub && pSub.url) {
          subUrl = pSub.url;
          subTitle = pSub.title || `${sec} Portal`;
        }
      }


      items.push({
        divId: id,
        divName,
        divIcon,
        targetUnit: sec,
        targetLabel: `${subPrefix}: ${sec}`,
        isMain: false,
        url: subUrl,
        title: subTitle
      });
    });
  });


  // Filter by Division ID pill
  if (filterDivId && filterDivId !== 'all') {
    items = items.filter(it => String(it.divId) === String(filterDivId));
  }


  // Filter by search query
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    items = items.filter(it => {
      return it.divName.toLowerCase().includes(q) ||
             it.targetLabel.toLowerCase().includes(q) ||
             it.url.toLowerCase().includes(q) ||
             it.title.toLowerCase().includes(q);
    });
  }


  // Update badge count in active language
  const badgeEl = document.getElementById('portals-count-badge');
  if (badgeEl) {
    const activeCount = items.filter(it => Boolean(it.url)).length;
    const badgeText = lang === 'si'
      ? `🟢 සක්‍රීය මහජන සබැඳි ${activeCount} ක්`
      : (lang === 'ta'
        ? `🟢 ${activeCount} செயலில் உள்ள வலை இணைப்புகள்`
        : `🟢 ${activeCount} Active Public Hyperlinks`);
    badgeEl.innerHTML = `<span>${badgeText}</span>`;
  }


  // Update search input placeholder in active language
  const portalsSearch = document.getElementById('search-portals-input');
  if (portalsSearch) {
    portalsSearch.placeholder = lang === 'si'
      ? 'අංශය, අනු ඒකකය හෝ URL සොයන්න...'
      : (lang === 'ta' ? 'பிரிவு, துணை அலகு அல்லது URL ஐத் தேடுக...' : 'Search division, sub-unit, or URL...');
  }


  if (items.length === 0) {
    const emptyMsg = lang === 'si'
      ? 'ගැලපෙන අංශ වෙබ් සබැඳි හමු නොවීය.'
      : (lang === 'ta' ? 'பொருந்தும் பிரிவு வலைத்தளங்கள் எதுவும் காணப்படவில்லை.' : 'No matching division web portals found.');
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:35px 20px;">${emptyMsg}</td></tr>`;
    return;
  }


  const divPrefix = lang === 'si' ? 'අංශ අංක' : (lang === 'ta' ? 'பிரிவு #' : 'Division #');
  const liveLabel = lang === 'si' ? 'සක්‍රීය මහජන සබැඳිය' : (lang === 'ta' ? 'செயலில் உள்ள இணைப்பு' : 'Live Public Link');
  const notConfLabel = lang === 'si' ? '⚪ සකසා නැත' : (lang === 'ta' ? '⚪ அமைக்கப்படவில்லை' : '⚪ Not Configured');
  const noUrlLabel = lang === 'si' ? 'සබැඳියක් සකසා නැත' : (lang === 'ta' ? 'வலை முகவரி அமைக்கப்படவில்லை' : 'No URL Configured');
  const editBtnText = lang === 'si' ? 'සබැඳිය සකසන්න' : (lang === 'ta' ? 'அமைக்க / திருத்துக' : 'Set / Edit URL');


  tableBody.innerHTML = items.map(item => {
    const hasUrl = Boolean(item.url);
    const itemUnitEsc = item.targetUnit.replace(/'/g, "\\'");
    const itemUrlEsc = item.url.replace(/'/g, "\\'");
    const itemTitleEsc = item.title.replace(/'/g, "\\'");


    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, #380000 0%, #630808 100%); display:flex; align-items:center; justify-content:center; font-size:1.2rem; color:#FFFFFF; flex-shrink:0;">
              ${item.divIcon}
            </div>
            <div>
              <div style="font-weight:700; color:#380000; font-size:0.88rem;">${escapeHtml(item.divName)}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${divPrefix} ${item.divId}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-size:0.83rem; font-weight:${item.isMain ? '700' : '600'}; color:${item.isMain ? '#380000' : '#4B5563'};">
            ${escapeHtml(item.targetLabel)}
          </span>
        </td>
        <td>
          ${hasUrl ? `
            <div style="display:flex; flex-direction:column; gap:2px; max-width:280px;">
              <a href="${escapeHtml(item.url)}" target="_blank" style="font-size:0.82rem; font-weight:700; color:#380000; text-decoration:underline; word-break:break-all; display:inline-flex; align-items:center; gap:4px;">
                <span>${escapeHtml(item.url)}</span> <span style="font-size:0.75rem;">↗</span>
              </a>
              <span style="font-size:0.74rem; color:var(--text-muted);">${escapeHtml(item.title)}</span>
            </div>
          ` : `
            <span style="font-size:0.78rem; color:#9CA3AF; font-style:italic;">${noUrlLabel}</span>
          `}
        </td>
        <td>
          ${hasUrl ? `
            <span class="badge-pill badge-pill-green" style="font-size:0.72rem; font-weight:700; display:inline-flex; align-items:center; gap:5px;">
              <span style="width:6px; height:6px; border-radius:50%; background:#10B981; display:inline-block;"></span> ${liveLabel}
            </span>
          ` : `
            <span class="badge-pill" style="font-size:0.72rem; font-weight:600; background:#F3F4F6; color:#6B7280;">
              ${notConfLabel}
            </span>
          `}
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:6px;">
            <button type="button" class="btn-table-action" onclick="openConfigurePortalModal(${item.divId}, '${itemUnitEsc}', '${itemUrlEsc}', '${itemTitleEsc}')" title="${editBtnText}">
              <span>✏️</span> <span>${editBtnText}</span>
            </button>
            ${hasUrl ? `
              <button type="button" class="btn-table-action btn-del" onclick="handleClearPortalLink(${item.divId}, '${itemUnitEsc}')" title="Delete URL">
                <span>🗑️</span>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


function updatePortalSubUnitsDropdown(divId, selectedUnit = '__MAIN__') {
  const unitSelect = document.getElementById('portal-target-unit');
  if (!unitSelect) return;
  const lang = currentDashboardLang || 'en';


  const mainLabel = lang === 'si' ? '🏛️ ප්‍රධාන අංශ ද්වාරය' : (lang === 'ta' ? '🏛️ முதன்மை பிரிவு தளம்' : '🏛️ Main Division Portal');
  unitSelect.innerHTML = `<option value="__MAIN__">${mainLabel}</option>`;


  const divs = db.divisionsData || {};
  const div = divs[divId] || divs[String(divId)];
  if (!div) return;


  const rawSections = div[`sections_${lang}`] || div.sections_en || div.sections_si || [];
  const sections = Array.isArray(rawSections) ? rawSections : (typeof rawSections === 'string' ? rawSections.split(',').map(s => s.trim()).filter(Boolean) : []);
  const subPrefix = lang === 'si' ? '🔹 අනු ඒකකය' : (lang === 'ta' ? '🔹 துணை அலகு' : '🔹 Sub-Unit');


  sections.forEach(sec => {
    const opt = document.createElement('option');
    opt.value = sec;
    opt.textContent = `${subPrefix}: ${sec}`;
    if (selectedUnit && (selectedUnit === sec || String(selectedUnit).toLowerCase() === String(sec).toLowerCase())) {
      opt.selected = true;
    }
    unitSelect.appendChild(opt);
  });


  if (selectedUnit === '__MAIN__') {
    unitSelect.value = '__MAIN__';
  }
}


function syncPortalTitleDefault(force = false) {
  const divSelect = document.getElementById('portal-division-select');
  const unitSelect = document.getElementById('portal-target-unit');
  const titleInput = document.getElementById('portal-title-input');
  if (!divSelect || !unitSelect || !titleInput) return;


  const currentVal = titleInput.value.trim();
  const isDefaultLike = !currentVal ||
    currentVal.includes('Online Portal') ||
    currentVal.includes('Portal') ||
    currentVal.includes('වෙබ් ද්වාරය') ||
    currentVal.includes('வலைத்தளம்') ||
    currentVal.includes('Administration Division');


  if (force || isDefaultLike) {
    const lang = currentDashboardLang || 'en';
    const divId = divSelect.value;
    const targetUnit = unitSelect.value;
    const divs = db.divisionsData || {};
    const div = divs[divId] || divs[String(divId)];
    const divName = div ? (div[`name_${lang}`] || div.name_en) : `Division ${divId}`;
    const portalWord = lang === 'si' ? 'නිල වෙබ් ද්වාරය' : (lang === 'ta' ? 'வலைத்தளம்' : 'Online Portal');


    if (targetUnit === '__MAIN__') {
      titleInput.value = `${divName} ${portalWord}`;
    } else {
      titleInput.value = `${targetUnit} ${portalWord}`;
    }
  }
}
window.syncPortalTitleDefault = syncPortalTitleDefault;


function openConfigurePortalModal(divId = null, targetUnit = '__MAIN__', currentUrl = '', currentTitle = '') {
  const availableDivKeys = Object.keys(db.divisionsData || {}).sort((a,b) => parseInt(a,10) - parseInt(b,10));
  if (!divId) {
    divId = availableDivKeys.length > 0 ? availableDivKeys[0] : 1;
  }
  const lang = currentDashboardLang || 'en';
  populatePortalDivisionSelect(divId);


  const divSelect = document.getElementById('portal-division-select');
  if (divSelect) {
    divSelect.value = String(divId || 2);
  }


  updatePortalSubUnitsDropdown(divSelect ? divSelect.value : divId, targetUnit);


  const urlInput = document.getElementById('portal-url-input');
  if (urlInput) urlInput.value = currentUrl || '';


  const titleInput = document.getElementById('portal-title-input');
  if (titleInput) {
    const isCorruptTitle = currentTitle && String(divId) !== '1' && currentTitle.includes('Administration Division');
    if (currentTitle && !isCorruptTitle) {
      titleInput.value = currentTitle;
    } else {
      const divs = db.divisionsData || {};
      const div = divs[divSelect ? divSelect.value : divId] || divs[String(divSelect ? divSelect.value : divId)];
      const divName = div ? (div[`name_${lang}`] || div.name_en) : '';
      const portalWord = lang === 'si' ? 'නිල වෙබ් ද්වාරය' : (lang === 'ta' ? 'வலைத்தளம்' : 'Online Portal');
      titleInput.value = targetUnit === '__MAIN__' ? `${divName} ${portalWord}` : `${targetUnit} ${portalWord}`;
    }
    titleInput.placeholder = lang === 'si'
      ? 'උදා: BoQ ඔන්ලයින් ඉංජිනේරු පද්ධතිය'
      : (lang === 'ta' ? 'உதா: BoQ ஆன்லைன் பொறியியல் அமைப்பு' : 'e.g. BoQ Online Engineering System');
  }


  const modalTitle = document.getElementById('modal-portal-title');
  if (modalTitle) {
    const isEdit = Boolean(currentUrl);
    if (lang === 'si') {
      modalTitle.innerHTML = isEdit ? '🌐 අංශ වෙබ් සබැඳිය සංස්කරණය' : '🌐 අංශ වෙබ් සබැඳිය සැකසීම';
    } else if (lang === 'ta') {
      modalTitle.innerHTML = isEdit ? '🌐 வலை முகவரியைத் திருத்துக' : '🌐 பிரிவு வலை முகவரியை அமைக்க';
    } else {
      modalTitle.innerHTML = isEdit ? '🌐 Edit Division Web Portal URL' : '🌐 Configure Division Web Portal URL';
    }
  }


  openModal('modal-portal-link');
}


async function handleSavePortalLink(e) {
  e.preventDefault();
  const divSelect = document.getElementById('portal-division-select');
  const unitSelect = document.getElementById('portal-target-unit');
  const urlInput = document.getElementById('portal-url-input');
  const titleInput = document.getElementById('portal-title-input');


  const divId = divSelect ? divSelect.value : '2';
  const targetUnit = unitSelect ? unitSelect.value : '__MAIN__';
  const url = (urlInput ? urlInput.value : '').trim();
  let title = (titleInput ? titleInput.value : '').trim();


  if (!url) return;


  if (!db.divisionsData) db.divisionsData = {};
  const divIdStr = String(divId);
  if (!db.divisionsData[divIdStr] && !db.divisionsData[divId]) {
    db.divisionsData[divIdStr] = { id: Number(divId) };
  }
  const div = db.divisionsData[divIdStr] || db.divisionsData[divId];
  const lang = currentDashboardLang || 'en';
  const divName = div ? (div[`name_${lang}`] || div.name_en) : `Division ${divId}`;


  // Sanitize title if empty or incorrectly defaulted from another division
  if (!title || (String(divId) !== '1' && title.includes('Administration Division'))) {
    title = targetUnit === '__MAIN__' ? `${divName} Online Portal` : `${targetUnit} Online Portal`;
  }


  if (targetUnit === '__MAIN__') {
    div.portal_url = url;
    div.portal_title = title;
    delete div.portal_cleared;


    if (!Array.isArray(db.divisionPortals)) db.divisionPortals = [];
    const existingIdx = db.divisionPortals.findIndex(p => String(p.division_id) === String(divId) && p.target_unit === '__MAIN__');
    if (existingIdx !== -1) {
      db.divisionPortals[existingIdx] = { division_id: Number(divId), target_unit: '__MAIN__', url, title };
    } else {
      db.divisionPortals.push({ division_id: Number(divId), target_unit: '__MAIN__', url, title });
    }
  } else {
    if (!div.section_urls || typeof div.section_urls !== 'object') div.section_urls = {};
    if (!div.section_titles || typeof div.section_titles !== 'object') div.section_titles = {};


    div.section_urls[targetUnit] = url;
    div.section_titles[targetUnit] = title;


    // Cross-link to other languages of this sub-unit so it stays unified across languages
    const parseSecs = (raw) => {
      if (Array.isArray(raw)) return raw;
      if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };


    const secsEn = parseSecs(div.sections_en);
    const secsSi = parseSecs(div.sections_si);
    const secsTa = parseSecs(div.sections_ta);


    let matchedIdx = -1;
    const targetNorm = String(targetUnit).toLowerCase().trim();
    [secsEn, secsSi, secsTa].forEach(list => {
      const idx = list.findIndex(s => {
        const sNorm = String(s).toLowerCase().trim();
        return sNorm === targetNorm || sNorm.includes(targetNorm) || targetNorm.includes(sNorm);
      });
      if (idx !== -1 && matchedIdx === -1) matchedIdx = idx;
    });


    const aliases = [targetUnit];
    if (matchedIdx !== -1) {
      if (secsEn[matchedIdx]) aliases.push(secsEn[matchedIdx]);
      if (secsSi[matchedIdx]) aliases.push(secsSi[matchedIdx]);
      if (secsTa[matchedIdx]) aliases.push(secsTa[matchedIdx]);
    }


    aliases.forEach(a => {
      div.section_urls[a] = url;
      div.section_titles[a] = title;
    });


    // Also update top-level divisionPortals list in db with all aliases
    if (!Array.isArray(db.divisionPortals)) db.divisionPortals = [];
    aliases.forEach(a => {
      const existingIdx = db.divisionPortals.findIndex(p => String(p.division_id) === String(divId) && p.target_unit === a);
      if (existingIdx !== -1) {
        db.divisionPortals[existingIdx] = { division_id: Number(divId), target_unit: a, url, title };
      } else {
        db.divisionPortals.push({ division_id: Number(divId), target_unit: a, url, title });
      }
    });
  }


  const saveBtn = document.getElementById('btn-save-portal-link');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>⏳</span> Saving...';
  }


  await saveEntireDatabaseToServer();


  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<span>💾</span> Save Portal Link';
  }


  closeModal('modal-portal-link');
  renderAdminPortals(currentPortalsDivision);


  const toastMsg = currentDashboardLang === 'si'
    ? 'අංශ වෙබ් සබැඳිය සාර්ථකව යාවත්කාලීන විය!'
    : (currentDashboardLang === 'ta' ? 'வலை இணைப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Division web portal URL updated successfully!');
  showToast(toastMsg);
}


async function handleClearPortalLink(divId, targetUnit) {
  const confirmMsg = currentDashboardLang === 'si'
    ? 'ඔබට මෙම වෙබ් සබැඳිය ඉවත් කිරීමට අවශ්‍ය බව තහවුරු කරන්නද?'
    : (currentDashboardLang === 'ta' ? 'இந்த வலை இணைப்பை நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to clear this web portal link?');


  if (!confirm(confirmMsg)) return;


  const divIdStr = String(divId);
  const div = (db.divisionsData && (db.divisionsData[divIdStr] || db.divisionsData[divId])) ? (db.divisionsData[divIdStr] || db.divisionsData[divId]) : null;


  const parseSecs = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };


  const secsEn = parseSecs(div ? div.sections_en : []);
  const secsSi = parseSecs(div ? div.sections_si : []);
  const secsTa = parseSecs(div ? div.sections_ta : []);


  let matchedIdx = -1;
  const targetNorm = String(targetUnit).toLowerCase().trim();
  [secsEn, secsSi, secsTa].forEach(list => {
    const idx = list.findIndex(s => {
      const sNorm = String(s).toLowerCase().trim();
      return sNorm === targetNorm || sNorm.includes(targetNorm) || targetNorm.includes(sNorm);
    });
    if (idx !== -1 && matchedIdx === -1) matchedIdx = idx;
  });


  const namesToDelete = [targetUnit, targetNorm];
  if (matchedIdx !== -1) {
    if (secsEn[matchedIdx]) namesToDelete.push(secsEn[matchedIdx], String(secsEn[matchedIdx]).toLowerCase().trim());
    if (secsSi[matchedIdx]) namesToDelete.push(secsSi[matchedIdx], String(secsSi[matchedIdx]).toLowerCase().trim());
    if (secsTa[matchedIdx]) namesToDelete.push(secsTa[matchedIdx], String(secsTa[matchedIdx]).toLowerCase().trim());
  }


  if (div) {
    if (targetUnit === '__MAIN__') {
      div.portal_url = '';
      div.portal_title = '';
      div.portal_cleared = true;
    } else {
      if (div.section_urls && typeof div.section_urls === 'object') {
        namesToDelete.forEach(nm => {
          delete div.section_urls[nm];
        });
        Object.keys(div.section_urls).forEach(k => {
          const kNorm = k.toLowerCase().trim();
          if (namesToDelete.some(n => String(n).toLowerCase().trim() === kNorm) || kNorm === targetNorm) {
            delete div.section_urls[k];
          }
        });
      }
      if (div.section_titles && typeof div.section_titles === 'object') {
        namesToDelete.forEach(nm => {
          delete div.section_titles[nm];
        });
        Object.keys(div.section_titles).forEach(k => {
          const kNorm = k.toLowerCase().trim();
          if (namesToDelete.some(n => String(n).toLowerCase().trim() === kNorm) || kNorm === targetNorm) {
            delete div.section_titles[k];
          }
        });
      }
    }
  }


  // Clear from db.divisionPortals
  if (Array.isArray(db.divisionPortals)) {
    db.divisionPortals = db.divisionPortals.filter(p => {
      if (String(p.division_id) !== divIdStr) return true;
      if (targetUnit === '__MAIN__') {
        return p.target_unit !== '__MAIN__';
      }
      const pUnit = String(p.target_unit || '').trim();
      const pUnitNorm = pUnit.toLowerCase();
      const isMatch = namesToDelete.some(n => String(n).toLowerCase().trim() === pUnitNorm) ||
                      pUnitNorm === targetNorm ||
                      (matchedIdx !== -1 && (
                        (secsEn[matchedIdx] && pUnitNorm === String(secsEn[matchedIdx]).toLowerCase().trim()) ||
                        (secsSi[matchedIdx] && pUnitNorm === String(secsSi[matchedIdx]).toLowerCase().trim()) ||
                        (secsTa[matchedIdx] && pUnitNorm === String(secsTa[matchedIdx]).toLowerCase().trim())
                      ));
      return !isMatch; // false means delete
    });
  }


  await saveEntireDatabaseToServer();
  renderAdminPortals(currentPortalsDivision);


  const toastMsg = currentDashboardLang === 'si'
    ? 'වෙබ් සබැඳිය සාර්ථකව ඉවත් කරන ලදී!'
    : (currentDashboardLang === 'ta' ? 'வலை இணைப்பு வெற்றிகரமாக நீக்கப்பட்டது!' : 'Web portal link removed successfully!');
  showToast(toastMsg);
}
