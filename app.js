// State Management
let currentLanguage = 'en';
let siteTranslations = {};
let divisionsData = {};
let subOrgsData = [];
let documents = [];
let currentCategory = 'All';
let projects = [];
let stats = [];
let rtiPhoto = '';
let rtiOfficers = [];
let systemsData = [];
let divisionPortals = [];

// Multilingual Document Center & Online Systems Dictionary
const docCenterTranslations = {
  en: {
    docSearchPlaceholder: "Search downloads...",
    tabAllDownloads: "All Downloads",
    filterAllDivisions: "All Divisions & Departments",
    optDcsAdmin: "1. DCS Administration",
    optAllDcsAdmin: "All DCS Administration",
    optEstablishment: "🏛️ Establishment Office",
    optStatistic: "📊 Statistical Unit",
    optLegal: "⚖️ Legal Unit",
    optAccounts: "💰 Accounts Unit",
    optDigital: "💻 Digital Division (ICT + GIS)",
    optTranslation: "🌐 Translation Unit",
    optDcsEngGroup: "2. DCS Engineering",
    optDcsEng: "📐 2. DCS Engineering",
    filterAllTypes: "All Types",
    typeCircular: "Circulars",
    typeLetter: "Letters",
    typeNotice: "Notices",
    typeApplication: "Applications",
    typeReport: "Reports",
    typePublication: "Publications",
    tableColTitle: "Document Title",
    tableColDivision: "Division",
    tableColType: "Type",
    badgeNew: "NEW",
    noDocsFound: "No documents found matching filters."
  },
  si: {
    docSearchPlaceholder: "බාගත කිරීම් සොයන්න...",
    tabAllDownloads: "සියල්ල",
    filterAllDivisions: "සියලු අංශ සහ දෙපාර්තමේන්තු",
    optDcsAdmin: "1. ප්‍රධාන ලේකම් කාර්යාල පරිපාලනය",
    optAllDcsAdmin: "සමස්ත පරිපාලන අංශය",
    optEstablishment: "🏛️ ආයතන අංශය",
    optStatistic: "📊 සංඛ්‍යාලේඛන ඒකකය",
    optLegal: "⚖️ නීති ඒකකය",
    optAccounts: "💰 ගිණුම් ඒකකය",
    optDigital: "💻 ඩිජිටල් අංශය (තොරතුරු තාක්ෂණ + GIS)",
    optTranslation: "🌐 පරිවර්තන ඒකකය",
    optDcsEngGroup: "2. DCS ඉංජිනේරු අංශය",
    optDcsEng: "📐 2. DCS ඉංජිනේරු අංශය",
    filterAllTypes: "සියලු වර්ග",
    typeCircular: "චක්‍රලේඛ",
    typeLetter: "ලිපි",
    typeNotice: "දැන්වීම්",
    typeApplication: "අයදුම්පත්",
    typeReport: "වාර්තා",
    typePublication: "ප්‍රකාශන",
    tableColTitle: "ලේඛනයේ නම",
    tableColDivision: "අංශය",
    tableColType: "වර්ගය",
    badgeNew: "නව",
    noDocsFound: "තෝරාගත් පෙරහන් සඳහා ගැළපෙන ලේඛන හමු නොවීය."
  },
  ta: {
    docSearchPlaceholder: "பதிவிறக்கங்களைத் தேடுங்கள்...",
    tabAllDownloads: "அனைத்தும்",
    filterAllDivisions: "அனைத்துப் பிரிவுகளும் திணைக்களங்களும்",
    optDcsAdmin: "1. பிரதம தலைமைச் செயலக நிர்வாகம்",
    optAllDcsAdmin: "முழு நிர்வாகப் பிரிவு",
    optEstablishment: "🏛️ ஸ்தாபன அலுவலகம்",
    optStatistic: "📊 புள்ளிவிவரப் பிரிவு",
    optLegal: "⚖️ சட்டப் பிரிவு",
    optAccounts: "💰 கணக்குப் பிரிவு",
    optDigital: "💻 டிஜிட்டல் பிரிவு (ICT + GIS)",
    optTranslation: "🌐 மொழிபெயர்ப்புப் பிரிவு",
    optDcsEngGroup: "2. DCS பொறியியல் பிரிவு",
    optDcsEng: "📐 2. DCS பொறியியல் பிரிவு",
    filterAllTypes: "அனைத்து வகைகள்",
    typeCircular: "சுற்றறிக்கைகள்",
    typeLetter: "கடிதங்கள்",
    typeNotice: "அறிவிப்புகள்",
    typeApplication: "விண்ணப்பங்கள்",
    typeReport: "அறிக்கைகள்",
    typePublication: "வெளியீடுகள்",
    tableColTitle: "ஆவணத்தின் தலைப்பு",
    tableColDivision: "பிரிவு",
    tableColType: "வகை",
    badgeNew: "புதிய",
    noDocsFound: "வடிகட்டிகளுக்குப் பொருத்தமான ஆவணங்கள் எதுவும் கிடைக்கவில்லை."
  }
};

function renderDcsDivisionDropdown() {
  const select = document.getElementById('filter-division');
  if (!select) return;

  const currentVal = currentDcsFilter || select.value || 'all';
  const t = docCenterTranslations[currentLanguage] || docCenterTranslations['en'];

  select.innerHTML = `
    <option value="all">${t.filterAllDivisions}</option>
    <optgroup label="${t.optDcsAdmin}">
      <option value="dcs-admin">${t.optAllDcsAdmin}</option>
      <option value="establishment">${t.optEstablishment}</option>
      <option value="statistic">${t.optStatistic}</option>
      <option value="legal">${t.optLegal}</option>
      <option value="accounts">${t.optAccounts}</option>
      <option value="digital">${t.optDigital}</option>
      <option value="translation">${t.optTranslation}</option>
    </optgroup>
    <optgroup label="${t.optDcsEngGroup}">
      <option value="dcs-eng">${t.optDcsEng}</option>
    </optgroup>
  `;

  select.value = currentVal;
}

function renderTypeDropdown() {
  const select = document.getElementById('filter-type');
  if (!select) return;

  const currentVal = select.value || (currentCategory !== 'All' ? currentCategory : '');
  const t = docCenterTranslations[currentLanguage] || docCenterTranslations['en'];

  select.innerHTML = `
    <option value="" data-i18n="filterAllTypes">${t.filterAllTypes}</option>
    <option value="Circular">${t.typeCircular}</option>
    <option value="Letter">${t.typeLetter}</option>
    <option value="Notice">${t.typeNotice}</option>
    <option value="Application">${t.typeApplication}</option>
    <option value="Report">${t.typeReport}</option>
    <option value="Publication">${t.typePublication}</option>
  `;

  select.value = currentVal;
}

function renderEServicesDropdowns() {
  const catSelect = document.getElementById('eservices-category-filter');
  const searchInput = document.getElementById('eservices-search');
  const esTranslations = {
    en: {
      searchPlaceholder: "Search online systems...",
      allCategories: "All Categories",
      publicServices: "Public Services",
      staffPortals: "Staff Portals",
      financeTenders: "Finance & Tenders"
    },
    si: {
      searchPlaceholder: "මාර්ගගත පද්ධති සොයන්න...",
      allCategories: "සියලු වර්ග",
      publicServices: "මහජන සේවා",
      staffPortals: "කාර්ය මණ්ඩල ද්වාර",
      financeTenders: "මූල්‍ය හා ටෙන්ඩර්"
    },
    ta: {
      searchPlaceholder: "ஆன்லைன் அமைப்புகளைத் தேடுங்கள்...",
      allCategories: "அனைத்து பிரிவுகள்",
      publicServices: "பொதுச் சேவைகள்",
      staffPortals: "ஊழியர் இணையவாசல்கள்",
      financeTenders: "நிதி மற்றும் டெண்டர்கள்"
    }
  };
  const t = esTranslations[currentLanguage] || esTranslations['en'];
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;
  if (catSelect) {
    const cur = catSelect.value;
    catSelect.innerHTML = `
      <option value="">${t.allCategories}</option>
      <option value="Public">${t.publicServices}</option>
      <option value="Staff">${t.staffPortals}</option>
      <option value="Finance">${t.financeTenders}</option>
    `;
    catSelect.value = cur;
  }
}

// Initialize Page
document.addEventListener('DOMContentLoaded', async () => {
  await loadDatabase();
  initLanguage();
  initNavigation();
  renderDivisionsNav();
  renderDivisionSelects();
  renderDcsDivisionDropdown();
  renderTypeDropdown();
  renderCategoryTabs();
  renderDocumentsTable();
  renderHomeDivisions();
  renderAnnouncements();
  renderFeaturedDownloads();
  renderProjects();
  renderStats();
  renderSubOrgs();
  renderEServices();
  renderRtiView();
  initHeroSlider();
  initScrollAnimations();

  // Listen for hash changes
  window.addEventListener('hashchange', handleRouting);
  handleRouting(); // Initial routing check
  setTimeout(equalizeValueCards, 150);
});

// Language & SPA Navigation Handlers
function initLanguage() {
  const savedLang = localStorage.getItem('preferred_lang') || localStorage.getItem('admin_lang');
  if (savedLang && ['en', 'si', 'ta'].includes(savedLang)) {
    currentLanguage = savedLang;
  }

  updateLangUi(currentLanguage);
  updatePageTranslations();

  // Enable click/tap toggle for mobile & desktop
  const langBtn = document.getElementById('nav-lang-btn');
  const langParent = document.querySelector('.nav-item-lang');
  if (langBtn && langParent) {
    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      langParent.classList.toggle('lang-open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item-lang')) {
        langParent.classList.remove('lang-open');
      }
    });
  }
}

function switchLanguage(lang) {
  if (!['en', 'si', 'ta'].includes(lang)) return;
  currentLanguage = lang;
  localStorage.setItem('preferred_lang', lang);
  localStorage.setItem('admin_lang', lang);

  updateLangUi(lang);
  updatePageTranslations();

  // Re-render language-dependent components
  renderDivisionsNav();
  renderDivisionSelects();
  renderDcsDivisionDropdown();
  renderTypeDropdown();
  renderCategoryTabs();
  renderDocumentsTable();
  renderHomeDivisions();
  renderAnnouncements();
  renderFeaturedDownloads();
  renderProjects();
  renderStats();
  renderSubOrgs();
  renderEServices();
  renderRtiView();

  handleRouting();
}

function updateLangUi(lang) {
  // Update body and html lang attributes so language-specific CSS takes effect
  if (document.body) {
    document.body.classList.remove('lang-en', 'lang-si', 'lang-ta');
    document.body.classList.add('lang-' + lang);
  }
  if (document.documentElement) {
    document.documentElement.lang = lang;
  }

  const langLabels = {
    en: 'English',
    si: 'සිංහල',
    ta: 'தமிழ்'
  };

  const labelEl = document.getElementById('current-lang-label');
  if (labelEl) {
    labelEl.textContent = langLabels[lang] || 'English';
  }

  // Update checkmarks and active states in dropdown
  ['en', 'si', 'ta'].forEach(l => {
    const opt = document.getElementById(`lang-opt-${l}`);
    const check = document.getElementById(`lang-check-${l}`);
    if (opt) {
      if (l === lang) {
        opt.classList.add('active');
        if (check) check.textContent = '✓';
      } else {
        opt.classList.remove('active');
        if (check) check.textContent = '';
      }
    }
  });
}

function closeLangDropdown() {
  if (document.activeElement) document.activeElement.blur();
  const dropdown = document.querySelector('.nav-item-lang');
  if (dropdown) {
    dropdown.classList.remove('lang-open');
    dropdown.classList.add('dropdown-force-closed');
    setTimeout(() => dropdown.classList.remove('dropdown-force-closed'), 350);
  }
}

function updatePageTranslations() {
  const builtInNav = {
    en: {
      portalTitle: 'NORTH WESTERN PROVINCIAL COUNCIL',
      portalTitleL1: 'NORTH WESTERN',
      portalTitleL2: 'PROVINCIAL COUNCIL',
      portalSubtitle: 'NORTH WESTERN PROVINCE',
      navHome: 'Home',
      navDivisions: 'Our Divisions',
      navAbout: 'About',
      navProjects: 'Projects',
      navDocs: 'Download Page',
      navContact: 'Contact',
      navBoq: 'BOQ',
      navEvents: 'Public Events',
      navCalendar: 'Monthly Calendar',
      navDepartments: 'Our Divisions',
      navGovernance: 'BOQ',
      navStaffPortal: 'Staff Portal',
      dcsFilterTitle: 'Select Secretariat Authority & Branch',
      contactCallUs: 'Call us',
      contactEmailUs: 'Email',
      contactOffices: 'Offices',
      contactAddress: '1st Floor, NWP Office Complex, Kurunegala',
      contactInquiryTitle: 'Send Us an Inquiry',
      contactUsTitle: 'Get in Touch',
      contactMainOfficeLabel: 'Main Office',
      contactEmailLabel: 'Email Desk',
      contactPhoneLabel: 'General Inquiries',
      contactFullName: 'Full Name',
      contactNic: 'NIC Number',
      contactNicPlaceholder: 'National Identity Card No.',
      contactPhone: 'Contact Number',
      contactPhonePlaceholder: 'e.g. +94 77 123 4567',
      contactEmail: 'Email Address',
      contactOptional: '(Optional)',
      contactMessage: 'Message / Inquiry',
      contactMessagePlaceholder: 'Enter your inquiry details...',
      btnSendInquiry: 'Send Inquiry'
    },
    si: {
      portalTitle: 'වයඹ පළාත් සභාව',
      portalTitleL1: 'වයඹ පළාත්',
      portalTitleL2: 'සභාව',
      portalSubtitle: 'වයඹ පළාත',
      navHome: 'මුල් පිටුව',
      navDivisions: 'අපගේ අංශ',
      navAbout: 'අප ගැන',
      navProjects: 'ව්‍යාපෘති',
      navDocs: 'බාගත කිරීම්',
      navContact: 'සම්බන්ධ වන්න',
      navBoq: 'BOQ පද්ධතිය',
      navEvents: 'ප්‍රසිද්ධ සිදුවීම්',
      navCalendar: 'මාසික දින දර්ශනය',
      navDepartments: 'අපගේ අංශ',
      navGovernance: 'BOQ පද්ධතිය',
      navStaffPortal: 'කාර්ය මණ්ඩල ද්වාරය',
      dcsFilterTitle: 'ලේකම් කාර්යාල අංශය සහ ශාඛාව තෝරන්න',
      contactCallUs: 'අප අමතන්න',
      contactEmailUs: 'විද්‍යුත් තැපෑල',
      contactOffices: 'කාර්යාලය',
      contactAddress: '1 වන මහල, පළාත් සභා කාර්යාල සංකීර්ණය, කුරුණෑගල',
      contactInquiryTitle: 'ඔබේ විමසීම යොමු කරන්න',
      contactUsTitle: 'අප හා සම්බන්ධ වන්න',
      contactMainOfficeLabel: 'ප්‍රධාන කාර්යාලය',
      contactEmailLabel: 'විද්‍යුත් තැපැල් අංශය',
      contactPhoneLabel: 'පොදු විමසීම්',
      contactFullName: 'සම්පූර්ණ නම',
      contactNic: 'ජාතික හැඳුනුම්පත් අංකය',
      contactNicPlaceholder: 'ජාතික හැඳුනුම්පත් අංකය ඇතුළත් කරන්න',
      contactPhone: 'දුරකථන අංකය',
      contactPhonePlaceholder: 'උදා: +94 77 123 4567',
      contactEmail: 'විද්‍යුත් තැපැල් ලිපිනය',
      contactOptional: '(විකල්ප)',
      contactMessage: 'පණිවිඩය / විමසීම',
      contactMessagePlaceholder: 'ඔබගේ විමසීමේ විස්තර මෙහි සටහන් කරන්න...',
      btnSendInquiry: 'විමසීම යොමු කරන්න'
    },
    ta: {
      portalTitle: 'வடமேல் மாகாண சபை',
      portalTitleL1: 'வடமேல்',
      portalTitleL2: 'மாகாண சபை',
      portalSubtitle: 'வடமேல் மாகாணம்',
      navHome: 'முகப்பு',
      navDivisions: 'எமது பிரிவுகள்',
      navAbout: 'எங்களை பற்றி',
      navProjects: 'திட்டங்கள்',
      navDocs: 'பதிவிறக்கப் பக்கம்',
      navContact: 'தொடர்பு கொள்ள',
      navBoq: 'BOQ முறைமை',
      navEvents: 'நிகழ்வுகள்',
      navCalendar: 'மாதாந்த நாட்காட்டி',
      navDepartments: 'எமது பிரிவுகள்',
      navGovernance: 'BOQ முறைமை',
      navStaffPortal: 'ஊழியர் தளம்',
      dcsFilterTitle: 'செயலகப் பிரிவு மற்றும் கிளையைத் தேர்ந்தெடுக்கவும்',
      contactCallUs: 'அழைக்க',
      contactEmailUs: 'மின்னஞ்சல்',
      contactOffices: 'அலுவலகம்',
      contactAddress: '1வது மாடி, மாகாண சபை வளாகம், குருணாகல்',
      contactInquiryTitle: 'உங்கள் விசாரணையை அனுப்பவும்',
      contactUsTitle: 'எம்முடன் தொடர்பு கொள்ள',
      contactMainOfficeLabel: 'பிரதான அலுவலகம்',
      contactEmailLabel: 'மின்னஞ்சல் பிரிவு',
      contactPhoneLabel: 'பொது விசாரணைகள்',
      contactFullName: 'முழுப் பெயர்',
      contactNic: 'தேசிய அடையாள அட்டை எண்',
      contactNicPlaceholder: 'தேசிய அடையாள அட்டை இலக்கம்',
      contactPhone: 'தொலைபேசி எண்',
      contactPhonePlaceholder: 'எ.கா: +94 77 123 4567',
      contactEmail: 'மின்னஞ்சல் முகவரி',
      contactOptional: '(விருப்பமானது)',
      contactMessage: 'செய்தி / விசாரணை',
      contactMessagePlaceholder: 'உங்கள் விசாரணை விவரங்களை உள்ளிடவும்...',
      btnSendInquiry: 'விசாரணையை அனுப்புக'
    }
  };

  const dt = docCenterTranslations[currentLanguage] || docCenterTranslations['en'];
  const t = { ...dt, ...((siteTranslations && siteTranslations[currentLanguage]) || (siteTranslations && siteTranslations['en']) || {}) };
  const defaultEn = { ...(docCenterTranslations['en'] || {}), ...((siteTranslations && siteTranslations['en']) || {}) };
  const currentNav = builtInNav[currentLanguage] || builtInNav['en'];
  const defaultNavEn = builtInNav['en'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    } else if (currentNav && currentNav[key] !== undefined) {
      el.textContent = currentNav[key];
    } else if (defaultEn[key] !== undefined) {
      el.textContent = defaultEn[key];
    } else if (defaultNavEn && defaultNavEn[key] !== undefined) {
      el.textContent = defaultNavEn[key];
    }
  });

  // Update search placeholders if present
  const searchInput = document.getElementById('home-search-input');
  if (searchInput && t['searchPlaceholder']) {
    searchInput.placeholder = t['searchPlaceholder'];
  }
  const docSearchInput = document.getElementById('doc-search');
  if (docSearchInput) {
    docSearchInput.placeholder = dt.docSearchPlaceholder;
  }

  // Update contact inquiry input placeholders
  const contactNicInput = document.getElementById('contact-nic');
  if (contactNicInput) {
    contactNicInput.placeholder = (currentNav && currentNav.contactNicPlaceholder) || defaultNavEn.contactNicPlaceholder || "National Identity Card No.";
  }
  const contactPhoneInput = document.getElementById('contact-phone');
  if (contactPhoneInput) {
    contactPhoneInput.placeholder = (currentNav && currentNav.contactPhonePlaceholder) || defaultNavEn.contactPhonePlaceholder || "e.g. +94 77 123 4567";
  }
  const contactMsgInput = document.getElementById('contact-message');
  if (contactMsgInput) {
    contactMsgInput.placeholder = (currentNav && currentNav.contactMessagePlaceholder) || defaultNavEn.contactMessagePlaceholder || "";
  }

  // Update dynamic dropdowns for active language
  renderDcsDivisionDropdown();
  renderTypeDropdown();
  renderEServicesDropdowns();

  // Equalize Vision & Mission cards to exact same size
  setTimeout(equalizeValueCards, 40);
}

// Equalize Vision and Mission value cards to identical height
function equalizeValueCards() {
  const cards = document.querySelectorAll('.charter-values-grid .value-card');
  if (!cards || cards.length < 2) return;
  // Reset inline min-height first to get natural content heights
  cards.forEach(c => { c.style.minHeight = ''; });
  // Find maximum natural height
  let maxHeight = 0;
  cards.forEach(c => {
    const h = c.offsetHeight;
    if (h > maxHeight) maxHeight = h;
  });
  // Apply maximum height to both cards
  if (maxHeight > 0) {
    cards.forEach(c => {
      c.style.minHeight = maxHeight + 'px';
    });
  }
}
window.equalizeValueCards = equalizeValueCards;
window.addEventListener('resize', () => {
  equalizeValueCards();
});

// Monthly Calendar Modal Handlers
window.openCalendarModal = function () {
  const modal = document.getElementById('calendar-modal');
  if (modal) {
    modal.classList.add('open');
    renderCalendarEvents();
  }
};


// Mobile Division / Sub-Unit Details Modal Handlers
function openDivisionMobileModal() {
  const modal = document.getElementById('modal-division-mobile-card');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
window.openDivisionMobileModal = openDivisionMobileModal;

function closeDivisionMobileModal() {
  const modal = document.getElementById('modal-division-mobile-card');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
window.closeDivisionMobileModal = closeDivisionMobileModal;

window.closeCalendarModal = function () {
  const modal = document.getElementById('calendar-modal');
  if (modal) {
    modal.classList.remove('open');
  }
};

function renderCalendarEvents() {
  const container = document.getElementById('calendar-events-container');
  if (!container) return;

  const events = [
    { date: '1st & 3rd Tuesday', en: 'Provincial Council Executive Board Sitting', si: 'පළාත් සභා විධායක මණ්ඩල රැස්වීම', ta: 'மாகாண சபை நிர்வாகக் குழுக் கூட்டம்', type: 'official' },
    { date: 'Every Wednesday', en: 'Public Complaints & Citizen Grievance Day', si: 'මහජන දිනය සහ ගැටළු විමසීම්', ta: 'மக்கள் குறைதீர்க்கும் தினம்', type: 'public' },
    { date: '15th of Every Month', en: 'Provincial Departmental Development Review', si: 'දෙපාර්තමේන්තු සංවර්ධන සමාලෝචනය', ta: 'திணைக்கள அபிவிருத்தி மீளாய்வு', type: 'review' },
    { date: 'Full Moon Poya', en: 'National Poya Holiday & Religious Observance', si: 'පොහොය නිවාඩු දිනය', ta: 'போயா விடுமுறை', type: 'holiday' },
    { date: 'Last Friday', en: 'Provincial Engineering & BoQ Rates Committee', si: 'ඉංජිනේරු හා BoQ කමිටු රැස්වීම', ta: 'பொறியியல் மற்றும் BoQ குழுக் கூட்டம்', type: 'official' }
  ];

  const html = events.map(ev => `
    <div class="cal-event-card ${ev.type}">
      <div class="cal-event-date">📅 ${ev.date}</div>
      <div class="cal-event-title">${ev[currentLanguage] || ev.en}</div>
    </div>
  `).join('');

  container.innerHTML = html;
}

function navigateTo(target) {
  if (!target) return;
  window.location.hash = '#' + target;
}

// Load settings and data from backend MySQL database
async function loadDatabase() {
  try {
    const response = await fetch('api.php?t=' + Date.now());
    if (response.ok) {
      const data = await response.json();
      if (data.siteTranslations && Object.keys(data.siteTranslations).length > 0) siteTranslations = data.siteTranslations;
      if (data.divisionsData && Object.keys(data.divisionsData).length > 0) divisionsData = data.divisionsData;
      if (data.subOrgsData && data.subOrgsData.length > 0) subOrgsData = data.subOrgsData;
      if (Array.isArray(data.documents)) documents = data.documents;
      if (Array.isArray(data.projects)) projects = data.projects;
      if (Array.isArray(data.stats)) stats = data.stats;
      if (Array.isArray(data.systems)) systemsData = data.systems;
      if (data.rtiPhoto !== undefined) rtiPhoto = data.rtiPhoto;
      if (Array.isArray(data.rtiOfficers)) rtiOfficers = data.rtiOfficers;
      if (Array.isArray(data.divisionPortals)) divisionPortals = data.divisionPortals;
    }
  } catch (err) {
    console.warn("API load warning, ensuring fallback UI data is ready:", err);
  }

  // Ensure default fallback data if any section is empty
  if (!siteTranslations || !siteTranslations.en || Object.keys(siteTranslations.en).length === 0) {
    siteTranslations = {
      en: {
        portalTitle: "Chief Secretariat - NWP",
        portalSubtitle: "North Western Province, Sri Lanka",
        emergencyContact: "Address: 1st Floor, NW Provincial Council Office, Kurunegala | Phone: +94 37 223 1769",
        aboutUsTitle: "About Our Secretariat",
        aboutUsContent: "Established as the apex body for planning, coordinating, and executing provincial directives...",
        homeSearchTitle: "Provincial Document & Service Portal",
        homeSearchSubtitle: "Search official circulars, procurement forms, and administrative directives",
        searchPlaceholder: "Search by title, circular number, or keyword...",
        homeTrendingLabel: "Popular Searches:",
        homeCharterTitle: "Citizen Service Standards & Governance Values",
        valIntegrityTitle: "Vision",
        valIntegrityDesc: "A sustainably developed North Western Province.",
        valSpeedTitle: "Mission",
        valSpeedDesc: "To establish an efficient and productive administration by managing human, financial, and physical resources effectively and productively to enhance the living standards of the people of the North Western Province, and to develop human resources with excellent attitudes and skills within the North Western Provincial Council.",
        valAccessTitle: "Citizen's Declaration",
        valAccessDesc: "We are committed to delivering timely, transparent, and equitable public services. Download our official Citizen's Charter PDF to view complete service standards.",
        valAccessPdf: "uploads/Citizen_Charter_NWP.pdf",
        btnDownloadCharterPdf: "Download PDF 📄",
        rtiTitle: "Right to Information (RTI)",
        rtiContent: "In accordance with RTI Act No. 12 of 2016, citizens can request official information.",
        rtiOfficerName: "Designated RTI Officer: Mr. A.B. Wickramasinghe",
        rtiOfficerContact: "Email: csnwp@sltnet.lk | Phone: +94 37 223 1769",
        footerText: "© 2026 Chief Secretariat - NWP. All Rights Reserved. | Powered by Digital Division - Chief Secretariat - NWP",
        btnDownload: "Download PDF",
        btnReport: "Submit Request",
        btnVisitWebsite: "Visit Website",
        homeFeaturedDownloadsTitle: "Featured Downloads",
        navHome: "HOME",
        navDivisions: "OUR DIVISIONS",
        navAbout: "ABOUT",
        navDocs: "DOWNLOAD PAGE",
        navContact: "CONTACT",
        navBoq: "BOQ",
        homeProjectsTitle: "Key Provincial Projects",
        homeStatsTitle: "Transparency Dashboard",
        latestUpdates: "Latest Announcements",
        statsCirculars: "Official Circulars Published",
        statsRti: "RTI Compliance Rate",
        statsDivisions: "Active Secretarial Divisions",
        statsSupport: "Citizen Support Hotline",
        projStatusActive: "Active",
        projStatusPlanning: "Planning"
      },
      si: {
        navHome: "ප්‍රධාන පිටුව",
        navDivisions: "අපගේ අංශ",
        navAbout: "අප ගැන",
        navDocs: "බාගත කිරීම්",
        navContact: "සම්බන්ධ වන්න",
        navBoq: "BOQ පද්ධතිය",
        homeCharterTitle: "සේවාලාභී ප්‍රඥප්තිය සහ පරමාර්ථ",
        valIntegrityTitle: "දැක්ම",
        valIntegrityDesc: "තිරසර ලෙස සංවර්ධිත වයඹ පළාතක්",
        valSpeedTitle: "මෙහෙවර",
        valSpeedDesc: "වයඹ ජනතාවගේ ජීවන තත්ත්වය නඟා සිටුවීම පිණිස මානව, මූල්‍ය හා භෞතික සම්පත් කාර්යක්ෂමව මනා ඵලදායීව මෙහෙයවමින් වයඹ පළාත් සභාව තුළ විශිෂ්ඨ ආකල්ප හා හැකියාවන්ගෙන් යුත් මානව සම්පතක් ඇති කිරීම පිණිස කාර්යක්ෂම හා ඵලදායී පරිපාලනයක් ස්ථාපිත කිරීම",
        valAccessTitle: "පුරවැසි හා සේවාලාභී ප්‍රඥප්තිය",
        valAccessDesc: "අපගේ සේවාලාභීන් සඳහා නියමිත කාලරාමුව තුළ නිවැරදි, ඵලදායී හා විනිවිදභාවයෙන් යුතු රාජ්‍ය සේවාවන් සැපයීමට අපි බැඳී සිටින්නෙමු. සියලු සේවාවන් සහ ප්‍රමිතීන් පිළිබඳ නිල පත්‍රිකාව භාගත කර ලබාගත හැක.",
        valAccessPdf: "uploads/Citizen_Charter_NWP.pdf",
        btnDownloadCharterPdf: "PDF පත්‍රිකාව භාගත කරන්න 📄"
      },
      ta: {
        navHome: "முகப்பு",
        navDivisions: "எமது பிரிவுகள்",
        navAbout: "எங்களை பற்றி",
        navDocs: "பதிவிறக்கப் பக்கம்",
        navContact: "தொடர்பு கொள்ள",
        navBoq: "BOQ முறைமை",
        homeCharterTitle: "பிரஜைகள் சேவைப் பிரகடனம் மற்றும் இலக்குகள்",
        valIntegrityTitle: "தொலைநோக்கு",
        valIntegrityDesc: "நிலையான வளர்ச்சி பெற்ற வடமேல் மாகாணம்.",
        valSpeedTitle: "செயல்நோக்கம்",
        valSpeedDesc: "வடமேல் மாகாண மக்களின் வாழ்க்கைத்தரத்தை உயர்த்துவதற்காக மனித, நிதி மற்றும் பௌதிக வளங்களை திறமையாகவும் பயனுள்ளதாகவும் செலுத்தி, வடமேல் மாகாண சபைக்குள் சிறந்த மனப்பான்மையும் திறமையும் கொண்ட மனித வளத்தை உருவாக்குவதற்காக திறமையான மற்றும் பயனுள்ள நிர்வாகத்தை நிறுவுதல்.",
        valAccessTitle: "பிரஜைகள் மற்றும் சேவைப் பெறுனர்கள் பிரகடனம்",
        valAccessDesc: "நாங்கள் துல்லியமான மற்றும் வெளிப்படையான பொதுச் சேවைகளை வழங்க கடமைப்பட்டுள்ளோம். எங்கள் அதிகாரப்பூர்வ பிரஜைகள் பிரகடன PDF ஆவணத்தை பதிவிறக்கம் செய்து பார்க்கவும்.",
        valAccessPdf: "uploads/Citizen_Charter_NWP.pdf",
        btnDownloadCharterPdf: "PDF பதிவிறக்குக 📄"
      }
    };
  }

  if (!divisionsData || Object.keys(divisionsData).length === 0) {
    divisionsData = {
      "1": {
        id: 1,
        code: "admin",
        name_en: "Administration Division",
        name_si: "පරිපාලන අංශය",
        name_ta: "நிர்வாகப் பிரிவு",
        desc_en: "Manages administrative affairs, legal matters, statistics, accounting services, digital transformation, and official translations.",
        sections_en: ["Establishment Office", "Statistical Unit", "Legal Unit", "Accounts Unit", "Digital Division (ICT + GIS)", "Translation Unit"],
        sections_si: ["ආයතන අංශය", "සංඛ්‍යාලේඛන ඒකකය", "නීති ඒකකය", "ගිණුම් ඒකකය", "ඩිජිටල් අංශය (තොරතුරු තාක්ෂණ + GIS)", "පරිවර්තන ඒකකය"],
        sections_ta: ["ஸ்தாபன அலுவலகம்", "புள்ளிவிவரப் பிரிவு", "சட்டப் பிரிவு", "கணக்குப் பிரிவு", "டிஜிட்டல் பிரிவு (ICT + GIS)", "மொழிபெயர்ப்புப் பிரிவு"]
      },
      "2": {
        id: 2,
        code: "engineering",
        name_en: "Engineering Division",
        name_si: "ඉංජිනේරු අංශය",
        name_ta: "பொறியியல் பிரிவு",
        desc_en: "Oversees provincial infrastructure engineering, technical standards, and Quality Control Institute operations.",
        sections_en: ["Quality Control Institute"],
        sections_si: ["තත්ත්ව පාලන ආයතනය"],
        sections_ta: ["தரக்கட்டுப்பாட்டு நிறுவனம்"]
      },
      "3": {
        id: 3,
        code: "training",
        name_en: "Training Division",
        name_si: "පුහුණු අංශය",
        name_ta: "பயிற்சிප් பிரிவு",
        desc_en: "Coordinates public sector capacity building, Wayamba Training Institute programs, and drug prevention initiatives.",
        sections_en: ["Wayamba Training Institute", "Drug prevention"],
        sections_si: ["වයඹ පුහුණු ආයතනය", "මත්ද්‍රව්‍ය වැළැක්වීම"],
        sections_ta: ["வயம்ப பயிற்சி நிறுவனம்", "போதைப்பொருள் தடுப்பு"]
      },
      "4": {
        id: 4,
        code: "finance",
        name_en: "Finance Division",
        name_si: "මුදල් අංශය",
        name_ta: "நிதிப் பிரிவு",
        desc_en: "Manages provincial treasury allocations, revenue collection, annual budgeting, and accounts & payments processing.",
        sections_en: ["Treasury", "Revenue", "Budget", "Accounts & Payments"],
        sections_si: ["භාණ්ඩාගාරය", "ආදායම්", "අයවැය", "ගිණුම් සහ ගෙවීම්"],
        sections_ta: ["கருவூலம்", "வருவாய்", "பட்ஜெட்", "கணக்குகள் மற்றும் கொடுப்பனவுகள்"]
      },
      "5": {
        id: 5,
        code: "planning",
        name_en: "Planning Division",
        name_si: "ක්‍රමසම්පාදන අංශය",
        name_ta: "திட்டமிடல் பிரிவு",
        desc_en: "Formulates annual provincial development plans, capital investment monitoring, and resource allocation policies.",
        sections_en: [],
        sections_si: [],
        sections_ta: []
      }
    };
  }

  if (!documents) {
    documents = [];
  }

  // Set 'Download PDF' button link and display
  const pdfBtn = document.getElementById('btn-val-access-pdf');
  if (pdfBtn) {
    const pdfUrl = siteTranslations[currentLanguage]?.valAccessPdf || siteTranslations['en']?.valAccessPdf || 'uploads/Citizen_Charter_NWP.pdf';
    pdfBtn.href = pdfUrl;
    pdfBtn.style.display = 'inline-flex';
  }

  // Re-render dynamic list views that depend on selected language
  renderDivisionsNav();
  renderDivisionSelects();
  renderHomeDivisions();
  renderAnnouncements();
  renderFeaturedDownloads();
  renderProjects();
  renderStats();
  renderSubOrgs();
  renderRtiView();
}

// Hero Background Slider (4-second loop with smooth transition)
let currentHeroSlideIndex = 0;
let heroSliderInterval = null;

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  if (heroSliderInterval) {
    clearInterval(heroSliderInterval);
  }

  // Preload all 9 hero images for instant, seamless transitions
  const heroImages = [
    'Hero Images/1.jpg',
    'Hero Images/2.jpg',
    'Hero Images/3.jpg',
    'Hero Images/4.jpg',
    'Hero Images/5.jpg',
    'Hero Images/6.jpg',
    'Hero Images/7.jpg',
    'Hero Images/8.jpg',
    'Hero Images/9.jpg'
  ];
  heroImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Automatically cycle images every 4 seconds (4000ms)
  heroSliderInterval = setInterval(() => {
    nextHeroSlide();
  }, 4000);
}

function goToHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  currentHeroSlideIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, idx) => {
    if (idx === currentHeroSlideIndex) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === currentHeroSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function nextHeroSlide() {
  goToHeroSlide(currentHeroSlideIndex + 1);
}

function prevHeroSlide() {
  goToHeroSlide(currentHeroSlideIndex - 1);
}

function onHeroDotClick(index) {
  goToHeroSlide(index);
  restartHeroSliderTimer();
}

function onHeroArrowClick(direction) {
  if (direction > 0) {
    nextHeroSlide();
  } else {
    prevHeroSlide();
  }
  restartHeroSliderTimer();
}

function restartHeroSliderTimer() {
  if (heroSliderInterval) {
    clearInterval(heroSliderInterval);
  }
  heroSliderInterval = setInterval(() => {
    nextHeroSlide();
  }, 4000);
}

// 2. Navigation & SPA Routing
window.scrollToAbout = function(e) {
  if (e) e.preventDefault();
  window.location.hash = '#about';
  handleRouting();
};

window.scrollToProjects = function(e) {
  if (e) e.preventDefault();
  window.location.hash = '#projects';
  handleRouting();
};

function initNavigation() {
  // Toggle mobile navigation popup
  window.toggleMobileMenu = () => {
    const popup = document.getElementById('nav-mobile-popup');
    const backdrop = document.getElementById('mobile-popup-backdrop');
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const isOpen = popup && popup.classList.contains('open');

    if (isOpen) {
      window.closeMobilePopup();
    } else {
      if (popup) popup.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      if (toggleBtn) {
        toggleBtn.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
      const langParent = document.querySelector('.nav-item-lang');
      if (langParent) langParent.classList.remove('lang-open');
    }
  };

  window.closeMobilePopup = () => {
    const popup = document.getElementById('nav-mobile-popup');
    const backdrop = document.getElementById('mobile-popup-backdrop');
    const toggleBtn = document.getElementById('menu-toggle-btn');
    if (popup) popup.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (toggleBtn) {
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  };

  window.navigateMobile = (targetHash) => {
    window.closeMobilePopup();
    if (window.location.hash === targetHash) {
      handleRouting();
    } else {
      window.location.hash = targetHash;
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 20);
  };
// Handle sticky transparent navbar elevation on scroll
  const navBar = document.querySelector('.main-nav-bar');
  if (navBar) {
    const handleNavScroll = () => {
      if (window.scrollY > 20) {
        navBar.classList.add('nav-scrolled');
      } else {
        navBar.classList.remove('nav-scrolled');
      }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  // Re-trigger routing even if clicking link with current hash
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      if (link.hasAttribute('onclick')) return;
      const href = link.getAttribute('href');
      if (href && href !== '#' && window.location.hash === href) {
        handleRouting();
      }
    }
  });
}

function handleRouting() {
  const hash = window.location.hash || '#home';

  // Close mobile navigation menu & popup on routing
  window.closeMobilePopup();
  const navList = document.getElementById('nav-list');
  if (navList) navList.classList.remove('open');

  // Set popup active link
  document.querySelectorAll('.popup-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === hash ||
      (hash.startsWith('#division-') && href === '#divisions')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Set navigation link active state
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === hash ||
      (hash.startsWith('#division-') && href === '#divisions')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.style.display = 'none';
  });

  // Parse hash parameters e.g., #division-1 or #division-1?unit=Establishment%20Office
  if (hash.startsWith('#division-')) {
    const raw = hash.replace('#division-', '');
    const divisionId = parseInt(raw, 10);
    let subUnit = null;
    if (raw.includes('?unit=')) {
      subUnit = decodeURIComponent(raw.split('?unit=')[1].split('&')[0]);
    } else if (raw.includes('?sub=')) {
      subUnit = decodeURIComponent(raw.split('?sub=')[1].split('&')[0]);
    }
    if (subUnit === 'null' || subUnit === 'undefined' || !subUnit || String(subUnit).trim() === '') {
      subUnit = null;
    } else {
      subUnit = String(subUnit).trim();
    }
    const isUserSelect = Boolean(window._isDivisionUserSelect);
    window._isDivisionUserSelect = false;
    renderDivisionView(divisionId, subUnit, isUserSelect);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (hash === '#projects') {
    document.getElementById('view-home').style.display = 'block';
    const projSection = document.getElementById('projects-section') || document.querySelector('.home-projects-section');
    if (projSection) {
      projSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (hash === '#divisions') {
    document.getElementById('view-home').style.display = 'block';
    const divSection = document.getElementById('home-divisions-section') || document.querySelector('.divisions-section');
    if (divSection) {
      divSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (hash === '#contact' || hash === '#view-contact') {
    document.getElementById('view-home').style.display = 'block';
    const contactSection = document.getElementById('contact-section') || document.querySelector('.contact-grid');
    if (contactSection) {
      setTimeout(() => {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (hash === '#about' || hash === '#view-about') {
    document.getElementById('view-home').style.display = 'block';
    const aboutSection = document.getElementById('about-section') || document.querySelector('.charter-values-section');
    if (aboutSection) {
      setTimeout(() => {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (hash === '#boq') {
    window.location.hash = '#home';
    return;
  } else {
    // Show standard views
    const viewId = `view-${hash.replace('#', '')}`;
    const activeView = document.getElementById(viewId);
    if (activeView) {
      activeView.style.display = 'block';
    } else {
      // Fallback
      document.getElementById('view-home').style.display = 'block';
    }
    window.scrollTo(0, 0);
  }

  // Equalize Vision & Mission cards if home view is displayed
  if (hash === '#home' || hash === '' || hash === '#contact' || hash === '#divisions' || hash === '#projects' || hash === '#about' || hash === '#view-about') {
    setTimeout(equalizeValueCards, 80);
  }

  // Reload lists if navigating to specific views
  if (hash === '#documents') {
    renderDocumentsTable();
  } else if (hash === '#departments') {
    renderSubOrgs();
  } else if (hash === '#eservices') {
    renderEServices();
  } else if (hash === '#rti') {
    renderRtiView();
  }

  // Initialize scroll-reveal animations for newly visible view
  setTimeout(() => {
    initScrollAnimations();
  }, 60);
}


function localizeSubUnitName(unitName, div = null, lang = 'en') {
  if (!unitName || typeof unitName !== 'string') return unitName || '';
  const clean = unitName.trim().toLowerCase();

  const chief = [
    { name_en: 'Administration Division', name_si: 'පරිපාලන අංශය', name_ta: 'நிர்வாகப் பிரிவு' },
    { name_en: 'Establishment Office', name_si: 'ආයතන අංශය', name_ta: 'ஸ்தாபன அலுவலகம்' },
    { name_en: 'Statistical Unit', name_si: 'සංඛ්‍යාලේඛන ඒකකය', name_ta: 'புள்ளிவிவரப் பிரிவு' },
    { name_en: 'Legal Unit', name_si: 'නීති ඒකකය', name_ta: 'சட்டப் பிரிவு' },
    { name_en: 'Accounts Unit', name_si: 'ගිණුම් ඒකකය', name_ta: 'கணக்குப் பிரிவு' },
    { name_en: 'Digital Division (ICT + GIS)', name_si: 'ඩිජිටල් අංශය (තොරතුරු තාක්ෂණ + GIS)', name_ta: 'டிஜிட்டல் பிரிவு (ICT + GIS)' },
    { name_en: 'Translation Unit', name_si: 'පරිවර්තන ඒකකය', name_ta: 'மொழிபெயர்ப்புப் பிரிவு' }
  ];

  const cMatch = chief.find(u => 
    u.name_en.toLowerCase() === clean ||
    u.name_si.toLowerCase() === clean ||
    u.name_ta.toLowerCase() === clean
  );
  if (cMatch) return cMatch['name_' + lang] || cMatch.name_en;

  // Search in provided division sections or across all divisionsData
  const searchDivs = div ? [div] : Object.values(divisionsData || {});
  for (const d of searchDivs) {
    const sEn = Array.isArray(d.sections_en) ? d.sections_en : (typeof d.sections_en === 'string' ? d.sections_en.split(',').map(s=>s.trim()) : []);
    const sSi = Array.isArray(d.sections_si) ? d.sections_si : (typeof d.sections_si === 'string' ? d.sections_si.split(',').map(s=>s.trim()) : []);
    const sTa = Array.isArray(d.sections_ta) ? d.sections_ta : (typeof d.sections_ta === 'string' ? d.sections_ta.split(',').map(s=>s.trim()) : []);

    const maxLen = Math.max(sEn.length, sSi.length, sTa.length);
    for (let i = 0; i < maxLen; i++) {
      const en = (sEn[i] || '').toLowerCase().trim();
      const si = (sSi[i] || '').toLowerCase().trim();
      const ta = (sTa[i] || '').toLowerCase().trim();

      if (clean === en || clean === si || clean === ta) {
        if (lang === 'si' && sSi[i]) return sSi[i];
        if (lang === 'ta' && sTa[i]) return sTa[i];
        if (lang === 'en' && sEn[i]) return sEn[i];
      }
    }
  }

  return unitName;
}
window.localizeSubUnitName = localizeSubUnitName;

// 3. Dynamic division navigation links (Multi-level Sub-Menu)
function renderDivisionsNav() {
  const menuList = document.getElementById('divisions-dropdown-menu-list');
  if (!menuList) return;

  menuList.innerHTML = '';

  Object.values(divisionsData).forEach(div => {
    const li = document.createElement('li');
    const name = div[`name_${currentLanguage}`] || div.name_en;
    const rawSections = div[`sections_${currentLanguage}`] || div.sections_en || [];
    const sections = Array.isArray(rawSections) ? rawSections : (typeof rawSections === 'string' ? rawSections.split(',').map(s => s.trim()).filter(s => s !== '') : []);

    if (sections.length > 0) {
      li.className = 'dropdown-item dropdown-submenu';

      const mainLink = document.createElement('a');
      mainLink.href = `#division-${div.id}`;
      mainLink.onclick = (e) => { if (e) e.preventDefault(); closeDivisionsDropdown(); selectDivisionUnit(div.id, null, true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
      mainLink.textContent = name;
      li.appendChild(mainLink);

      const subMenuUl = document.createElement('ul');
      subMenuUl.className = 'submenu';

      sections.forEach(sec => {
        const subLi = document.createElement('li');
        subLi.className = 'submenu-item';
        const secEsc = sec.replace(/'/g, "\\'");
        subLi.innerHTML = `<a href="#division-${div.id}?unit=${encodeURIComponent(sec)}" onclick="event.preventDefault(); closeDivisionsDropdown(); selectDivisionUnit(${div.id}, '${secEsc}', true); window.scrollTo({ top: 0, behavior: 'smooth' });" style="display:flex !important; align-items:center !important; justify-content:flex-start !important; text-align:left !important; gap:8px !important;"><span style="color:var(--primary-navy); font-size:0.75rem; flex-shrink:0;">🔹</span><span style="text-align:left; flex:none;">${sec}</span></a>`;
        subMenuUl.appendChild(subLi);
      });

      li.appendChild(subMenuUl);
    } else {
      li.className = 'dropdown-item';
      li.innerHTML = `<a href="#division-${div.id}" onclick="event.preventDefault(); closeDivisionsDropdown(); selectDivisionUnit(${div.id}, null); window.scrollTo({ top: 0, behavior: 'smooth' });">${name}</a>`;
    }

    menuList.appendChild(li);
  });
}

function closeDivisionsDropdown() {
  if (document.activeElement) document.activeElement.blur();

  const navItem = document.getElementById('nav-divisions-dropdown')?.closest('.nav-item-dropdown');
  if (navItem) {
    navItem.classList.add('dropdown-force-closed');
    setTimeout(() => navItem.classList.remove('dropdown-force-closed'), 400);
  }
}

function renderDivisionSelects() {
  const filterSelect = document.getElementById('filter-division');
  const adminSelect = document.getElementById('admin-division');

  // If filterSelect has optgroups (the rich DCS hierarchy), keep them intact and don't overwrite!
  if (filterSelect && filterSelect.querySelectorAll('optgroup').length === 0) {
    filterSelect.querySelectorAll('option:not([value=""])').forEach(opt => opt.remove());
    Object.values(divisionsData).forEach(div => {
      const name = div[`name_${currentLanguage}`] || div.name_en;
      const optFilter = document.createElement('option');
      optFilter.value = div.id;
      optFilter.textContent = name;
      filterSelect.appendChild(optFilter);
    });
  }

  if (adminSelect) {
    adminSelect.innerHTML = '';
    Object.values(divisionsData).forEach(div => {
      const name = div[`name_${currentLanguage}`] || div.name_en;
      const optAdmin = document.createElement('option');
      optAdmin.value = div.id;
      optAdmin.textContent = name;
      adminSelect.appendChild(optAdmin);
    });
  }
}

window.selectDivisionUnit = function(id, subUnit = null, isUserSelect = false) {
  const clean = (subUnit && subUnit !== 'null' && subUnit !== 'undefined' && String(subUnit).trim() !== '') ? String(subUnit).trim() : null;
  const newHash = clean ? `#division-${id}?unit=${encodeURIComponent(clean)}` : `#division-${id}`;
  if (window.location.hash === newHash) {
    renderDivisionView(id, clean, isUserSelect);
  } else {
    window._isDivisionUserSelect = isUserSelect;
    window.location.hash = newHash;
  }
};

// 4. Render Individual Division Details Page

function resolvePortalInfo(div, divId, cleanSubUnit) {
  if (!div) return { url: '', title: '' };

  const parseSecs = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const secsEn = parseSecs(div.sections_en);
  const secsSi = parseSecs(div.sections_si);
  const secsTa = parseSecs(div.sections_ta);
  const secsCurrent = parseSecs(div['sections_' + currentLanguage]);
  const divName = div[`name_${currentLanguage}`] || div.name_en || `Division ${divId}`;

  if (cleanSubUnit) {
    const targetNorm = String(cleanSubUnit).toLowerCase().trim();

    // Find section index across all language arrays
    let matchedIdx = -1;
    [secsEn, secsSi, secsTa, secsCurrent].forEach(list => {
      const idx = list.findIndex(s => {
        const sNorm = String(s).toLowerCase().trim();
        return sNorm === targetNorm || sNorm.includes(targetNorm) || targetNorm.includes(sNorm);
      });
      if (idx !== -1 && matchedIdx === -1) matchedIdx = idx;
    });

    const aliases = [cleanSubUnit, targetNorm];
    if (matchedIdx !== -1) {
      if (secsEn[matchedIdx]) aliases.push(secsEn[matchedIdx], secsEn[matchedIdx].toLowerCase().trim());
      if (secsSi[matchedIdx]) aliases.push(secsSi[matchedIdx], secsSi[matchedIdx].toLowerCase().trim());
      if (secsTa[matchedIdx]) aliases.push(secsTa[matchedIdx], secsTa[matchedIdx].toLowerCase().trim());
      if (secsCurrent[matchedIdx]) aliases.push(secsCurrent[matchedIdx], secsCurrent[matchedIdx].toLowerCase().trim());
      aliases.push(String(matchedIdx));
    }

    // 1. Check in div.section_urls (configured explicitly by admin in dashboard)
    if (div.section_urls && typeof div.section_urls === 'object') {
      for (const alias of aliases) {
        if (div.section_urls[alias]) {
          const url = String(div.section_urls[alias]).trim();
          let title = (div.section_titles && div.section_titles[alias]) || '';
          if (!title && matchedIdx !== -1) {
            title = (div.section_titles && (div.section_titles[secsEn[matchedIdx]] || div.section_titles[secsSi[matchedIdx]])) || '';
          }
          if (title && (String(divId) !== '1' && title.includes('Administration Division'))) {
            title = `${cleanSubUnit} Online Portal`;
          }
          if (url) return { url, title: title || (`${cleanSubUnit} Online Portal`) };
        }
      }
      for (const [k, u] of Object.entries(div.section_urls)) {
        const kNorm = k.toLowerCase().trim();
        if (u && (aliases.some(a => String(a).toLowerCase().trim() === kNorm) || kNorm.includes(targetNorm) || targetNorm.includes(kNorm))) {
          let title = (div.section_titles && div.section_titles[k]) || (`${cleanSubUnit} Online Portal`);
          if (title && (String(divId) !== '1' && title.includes('Administration Division'))) {
            title = `${cleanSubUnit} Online Portal`;
          }
          return { url: String(u).trim(), title };
        }
      }
    }

    // 2. Check in divisionPortals array (configured explicitly by admin in dashboard)
    if (Array.isArray(divisionPortals)) {
      for (const p of divisionPortals) {
        if (String(p.division_id) === String(divId) && p.url) {
          const pUnit = String(p.target_unit || '').trim();
          const pUnitNorm = pUnit.toLowerCase();
          if (aliases.some(a => String(a).toLowerCase().trim() === pUnitNorm) || pUnitNorm.includes(targetNorm) || targetNorm.includes(pUnitNorm)) {
            let title = p.title || (`${cleanSubUnit} Online Portal`);
            if (title && (String(divId) !== '1' && title.includes('Administration Division'))) {
              title = `${cleanSubUnit} Online Portal`;
            }
            return { url: String(p.url).trim(), title };
          }
        }
      }
    }

    // Sub-unit has NO explicitly configured portal URL by admin -> return empty!
    return { url: '', title: '' };
  } else {
    // Main Division (cleanSubUnit is null)
    let url = '';
    let title = '';
    if (div.portal_cleared !== true && div.portal_url) {
      url = String(div.portal_url).trim();
      title = div.portal_title ? String(div.portal_title).trim() : (`${divName} Online Portal`);
    }
    if (!url && Array.isArray(divisionPortals)) {
      const p = divisionPortals.find(x => String(x.division_id) === String(divId) && x.target_unit === '__MAIN__');
      if (p && p.url) {
        url = String(p.url).trim();
        title = p.title || (`${divName} Online Portal`);
      }
    }

    // If main division itself has no direct portal URL, check if any of its sub-units has an explicitly configured portal
    if (!url) {
      if (Array.isArray(divisionPortals)) {
        const pSub = divisionPortals.find(x => String(x.division_id) === String(divId) && x.url && x.target_unit !== '__MAIN__');
        if (pSub) {
          url = String(pSub.url).trim();
          let subT = pSub.title || (`${pSub.target_unit || divName} Online Portal`);
          if (subT.includes('Administration Division') && String(divId) !== '1') {
            subT = (pSub.target_unit || divName) + ' Online Portal';
          }
          title = subT;
        }
      }
      if (!url && div.section_urls && typeof div.section_urls === 'object') {
        for (const [k, u] of Object.entries(div.section_urls)) {
          if (u && String(u).trim()) {
            url = String(u).trim();
            let subT = (div.section_titles && div.section_titles[k]) || (k + ' Online Portal');
            if (subT.includes('Administration Division') && String(divId) !== '1') {
              subT = k + ' Online Portal';
            }
            title = subT;
            break;
          }
        }
      }
    }

    return { url, title };
  }
}

function renderDivisionView(id, targetSubUnit = null, isUserSelect = false) {
  const div = divisionsData[id] || divisionsData[String(id)] || divisionsData[Number(id)];
  if (!div) {
    location.hash = '#home';
    return;
  }

  // Ensure division view is visible
  const divViewEl = document.getElementById('view-division');
  if (divViewEl) divViewEl.style.display = 'block';

  // Update breadcrumb with full trilingual localization
  const cleanSubUnit = (targetSubUnit && targetSubUnit !== 'null' && targetSubUnit !== 'undefined' && String(targetSubUnit).trim() !== '') ? String(targetSubUnit).trim() : null;
  const divName = div[`name_${currentLanguage}`] || div.name_en;
  const localizedSubUnit = cleanSubUnit ? localizeSubUnitName(cleanSubUnit, div, currentLanguage) : null;
  const activeUnitTarget = localizedSubUnit || divName;

  const breadcrumbEl = document.getElementById('breadcrumb-division-name');
  if (breadcrumbEl) {
    if (cleanSubUnit) {
      breadcrumbEl.innerHTML = `<a href="#division-${id}" onclick="event.preventDefault(); selectDivisionUnit(${id}, null, true);" style="color:var(--text-slate); text-decoration:none;">${escapeHtml(divName)}</a> &gt; <strong style="color:var(--primary-navy);">${escapeHtml(activeUnitTarget)}</strong>`;
    } else {
      breadcrumbEl.textContent = divName;
    }
  }

  // Update Main Heading to selected Category / Sub-unit name in active language
  const titleEl = document.getElementById('division-detail-title');
  if (titleEl) {
    titleEl.textContent = activeUnitTarget;
  }

  // Show detailed description
  const divDesc = div[`desc_${currentLanguage}`] || div.desc_en;
  document.getElementById('division-detail-desc').textContent = divDesc;

  // Resolve Portal Information
  const portalBox = document.getElementById('division-portal-box');
  const portalInfo = resolvePortalInfo(div, id, cleanSubUnit);
  const activePortalUrl = portalInfo.url;
  let activePortalTitle = portalInfo.title;

  if (activePortalUrl && !activePortalTitle) {
    activePortalTitle = cleanSubUnit ? (cleanSubUnit + ' Online Portal') : (divName + ' Online Portal');
  }

  const badgeText = currentLanguage === 'si' ? 'නිල මාර්ගගත වෙබ් ද්වාරය සහ සේවා' : (currentLanguage === 'ta' ? 'அதிகாரப்பூர்வ வலைத்தளம் & சேவைகள்' : 'Official Web Portal & Online Services');
  const btnText = currentLanguage === 'si' ? 'වෙබ් අඩවියට පිවිසෙන්න' : (currentLanguage === 'ta' ? 'வலைத்தளத்திற்குச் செல்க' : 'Launch Official Portal');
  const viewAllText = currentLanguage === 'si' ? `සියලු ${divName} නිලධාරීන් බලන්න` : (currentLanguage === 'ta' ? `அனைத்து ${divName} அதிகாரிகளையும் காண்க` : `View All ${divName} Officials`);

  // Render ALL divisions list on the sidebar with nested sub-units tree
  const sidebarList = document.getElementById('division-sidebar-sections');
  if (sidebarList) {
    sidebarList.innerHTML = '';
    Object.values(divisionsData).forEach(d => {
      const li = document.createElement('li');
      li.className = 'sidebar-group';

      const name = d[`name_${currentLanguage}`] || d.name_en;
      const isDivActive = d.id === id;
      const activeClass = isDivActive ? 'active' : '';

      const rawSections = d[`sections_${currentLanguage}`] || d.sections_en || [];
      const sections = Array.isArray(rawSections) ? rawSections : (typeof rawSections === 'string' ? rawSections.split(',').map(s => s.trim()).filter(s => s !== '') : []);

      let subUnitsHtml = '';
      if (sections.length > 0) {
        subUnitsHtml = `
          <ul class="sidebar-subunits" style="${isDivActive ? 'display:block;' : 'display:none;'}">
            ${sections.map(sec => {
          const isSubActive = isDivActive && cleanSubUnit && cleanSubUnit.toLowerCase() === sec.toLowerCase();
          return `
              <li class="sidebar-subunit-item">
                <a href="#division-${d.id}?unit=${encodeURIComponent(sec)}" class="${isSubActive ? 'highlighted' : ''}" onclick="event.preventDefault(); selectDivisionUnit(${d.id}, '${sec.replace(/'/g, "\\'")}', true);">
                  <span style="color:var(--primary-navy); font-size:0.75rem;">🔹</span> ${sec}
                </a>
              </li>
            `;
        }).join('')}
          </ul>
        `;
      }

      li.innerHTML = `
        <a href="#division-${d.id}" class="sidebar-link ${activeClass && !cleanSubUnit ? 'active' : ''}" onclick="event.preventDefault(); selectDivisionUnit(${d.id}, null, true);">${name}</a>
        ${subUnitsHtml}
      `;
      sidebarList.appendChild(li);
    });
  }

  // Filter officials by division & unit FIRST
  const officersGrid = document.getElementById('division-officers-grid');
  if (officersGrid) officersGrid.innerHTML = '';

  let officials = Array.isArray(div.officers) ? [...div.officers] : [];
  const chiefUnits = ['legal unit', 'establishment office', 'statistical unit', 'accounts unit', 'digital division (ict + gis)', 'translation unit', 'administration division'];

  if (id === 1) {
    if (cleanSubUnit) {
      const target = cleanSubUnit.toLowerCase().trim();
      officials = officials.filter(o => {
        const u = (o.unit || '').toLowerCase().trim();
        return u === target || u.includes(target) || target.includes(u);
      });
    } else {
      // Viewing root Administration Division: only show official assigned directly to Administration Division (division_id 1)
      officials = officials.filter(o => {
        const u = (o.unit || '').toLowerCase().trim();
        return o.division_id === 1 || u === 'administration division';
      });
    }
  } else if (cleanSubUnit) {
    const target = cleanSubUnit.toLowerCase().trim();
    officials = officials.filter(o => {
      const u = (o.unit || '').toLowerCase().trim();
      const role = (o.role_en || '').toLowerCase();
      // Ensure Chief Secretariat units do not bleed into sub-units of other divisions
      if (chiefUnits.includes(u) && !cleanSubUnit.toLowerCase().includes(u)) return false;
      return u === target || u.includes(target) || target.includes(u) || role.includes(target);
    });
  } else {
    // Viewing root of other divisions (e.g. Division 4 - Engineering Division, Division 2, 3, 5):
    // Strictly filter out any Chief Secretariat units (Legal Unit, Establishment Office, etc.) that belong solely to Division 1!
    const divNameNorm = (div.name_en || '').toLowerCase().trim();
    const rawSecs = div.sections_en || [];
    const secList = (Array.isArray(rawSecs) ? rawSecs : (typeof rawSecs === 'string' ? rawSecs.split(',') : [])).map(s => s.toLowerCase().trim());

    officials = officials.filter(o => {
      const u = (o.unit || '').toLowerCase().trim();
      if (chiefUnits.includes(u)) {
        return false;
      }
      if (parseInt(o.division_id, 10) === id) return true;
      if (u === divNameNorm || divNameNorm.includes(u) || u.includes(divNameNorm)) return true;
      if (secList.some(s => s === u || s.includes(u) || u.includes(s))) return true;
      return false;
    });
  }

  // Update Portal Box above Key Officials
  // CRITICAL REQUIREMENT: When there is NO officer profile (officials.length === 0),
  // the hyperlink MUST display ONLY in the officers section below ("me section ek withrai").
  // Therefore, portalBox at the top MUST be hidden so the link is never duplicated or placed above.
  if (portalBox) {
    if (activePortalUrl && officials.length > 0) {
      portalBox.style.display = 'block';
      portalBox.innerHTML = `
        <div style="background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border: 1.5px solid #F59E0B; border-radius: 14px; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 4px 15px rgba(245,158,11,0.08); flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 14px; min-width: 240px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: #380000; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: 0 4px 10px rgba(56,0,0,0.15);">🌐</div>
            <div>
              <div style="font-size: 0.74rem; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(badgeText)}</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #380000; margin-top: 2px;">${escapeHtml(activePortalTitle)}</div>
              <div style="font-size: 0.8rem; color: #78350F; margin-top: 3px; word-break: break-all;">${escapeHtml(activePortalUrl)}</div>
            </div>
          </div>
          <a href="${escapeHtml(activePortalUrl)}" target="_blank" rel="noopener noreferrer" style="background: #380000; color: #FFFFFF; font-weight: 700; font-size: 0.88rem; padding: 10px 22px; border-radius: 8px; text-decoration: none; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(56,0,0,0.15); transition: background 0.2s ease;">
            <span>${escapeHtml(btnText)}</span> <span style="font-size: 1.1rem; line-height: 1;">↗</span>
          </a>
        </div>
      `;
    } else {
      portalBox.style.display = 'none';
      portalBox.innerHTML = '';
    }
  }

  // Update Officers Section Header Title in active language
  const officersTitleEl = document.getElementById('division-officers-title');
  if (officersTitleEl) {
    if (officials.length === 0 && activePortalUrl) {
      officersTitleEl.textContent = currentLanguage === 'si' ? `නිල වෙබ් ද්වාරය - ${activeUnitTarget}` : (currentLanguage === 'ta' ? `அதிகாரப்பூர்வ தளம் - ${activeUnitTarget}` : `Official Portal - ${activeUnitTarget}`);
    } else {
      officersTitleEl.textContent = currentLanguage === 'si' ? `ප්‍රධාන නිලධාරීන් - ${activeUnitTarget}` : (currentLanguage === 'ta' ? `முக்கிய அதிகாரிகள் - ${activeUnitTarget}` : `Key Officials - ${activeUnitTarget}`);
    }
  }

  if (officials.length === 0) {
    if (activePortalUrl) {
      const subUnitNotice = currentLanguage === 'si'
        ? `මෙම ඒකකය සඳහා දැනට කාර්යාලීය නිලධාරියෙකු පවරා නොමැත. සියලු මාර්ගගත සේවා ලබා ගැනීමට ඉහත නිල වෙබ් සබැඳිය භාවිතා කරන්න.`
        : (currentLanguage === 'ta'
          ? `இந்த அலகுக்கு இன்னும் அதிகாரி நியமிக்கப்படவில்லை. அதிகாரப்பூர்வ சேவைகளுக்கு மேலே உள்ள வலைத்தளத்தைப் பயன்படுத்தவும்.`
          : `No registered officer is assigned to this unit yet. Please use the official web portal above for online services.`);

      officersGrid.innerHTML = `
        <div style="grid-column: 1 / -1; background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border: 2px solid #F59E0B; border-radius: 16px; padding: 36px 24px; text-align: center; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.12); width: 100%; box-sizing: border-box;">
          <div style="width: 58px; height: 58px; border-radius: 50%; background: #380000; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 14px; box-shadow: 0 4px 12px rgba(56,0,0,0.2);">🌐</div>
          <div style="font-size: 0.78rem; font-weight: 800; color: #B45309; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px;">${escapeHtml(badgeText)}</div>
          <div style="font-size: 1.45rem; font-weight: 800; color: #380000; margin-bottom: 8px;">${escapeHtml(activePortalTitle)}</div>
          <div style="font-size: 0.92rem; color: #78350F; margin-bottom: 20px; word-break: break-all;">
            <a href="${escapeHtml(activePortalUrl)}" target="_blank" rel="noopener noreferrer" style="color: #92400E; text-decoration: underline; font-weight: 600;">
              <span>${escapeHtml(activePortalUrl)}</span> <span style="font-size: 0.85rem;">↗</span>
            </a>
          </div>
          <div style="display: flex; gap: 12px; justify-content: center; align-items: center; flex-wrap: wrap;">
            <a href="${escapeHtml(activePortalUrl)}" target="_blank" rel="noopener noreferrer" style="background: #380000; color: #FFFFFF; font-weight: 700; font-size: 0.95rem; padding: 12px 28px; border-radius: 10px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 3px 10px rgba(56,0,0,0.2); transition: all 0.2s ease;">
              <span>🌐 ${escapeHtml(btnText)}</span> <span style="font-size: 1.2rem; line-height: 1;">↗</span>
            </a>
            ${cleanSubUnit ? `<button type="button" class="btn-outline" style="padding: 11px 20px; font-size: 0.88rem; font-weight: 600; border-radius: 10px; cursor: pointer; background: #FFFFFF; border: 1.5px solid #DEC5C3; color: #380000;" onclick="selectDivisionUnit(${id}, null, true)">${escapeHtml(viewAllText)}</button>` : (Array.isArray(div[`sections_${currentLanguage}`] || div.sections_en || []) ? (div[`sections_${currentLanguage}`] || div.sections_en || []) : (typeof (div[`sections_${currentLanguage}`] || div.sections_en) === 'string' ? (div[`sections_${currentLanguage}`] || div.sections_en).split(',').map(s=>s.trim()).filter(Boolean) : [])).map(s => `<button type="button" class="btn-outline" style="padding: 11px 20px; font-size: 0.88rem; font-weight: 600; border-radius: 10px; cursor: pointer; background: #FFFFFF; border: 1.5px solid #DEC5C3; color: #380000;" onclick="selectDivisionUnit(${id}, '${s.replace(/'/g, "\\'")}', true)">🔹 ${escapeHtml(s)}</button>`).join('')}
          </div>
          <div style="margin-top: 22px; padding-top: 14px; border-top: 1px dashed rgba(180, 83, 9, 0.3); font-size: 0.82rem; color: #78350F; line-height: 1.5;">
            ℹ️ ${escapeHtml(subUnitNotice)}
          </div>
        </div>
      `;
    } else {
      const noOfficialHeading = currentLanguage === 'si'
        ? `"${escapeHtml(activeUnitTarget)}" සඳහා තවමත් ලියාපදිංචි නිලධාරියෙකු පවරා නොමැත.`
        : (currentLanguage === 'ta'
          ? `"${escapeHtml(activeUnitTarget)}" க்கு இன்னும் பதிவுசெய்யப்பட்ட அதிகாரி நியமிக்கப்படவில்லை.`
          : `No registered official assigned to "${escapeHtml(activeUnitTarget)}" yet.`);

      const noOfficialSubtext = currentLanguage === 'si'
        ? `පරිපාලන පද්ධතියෙන් නිලධාරී ගිණුමක් ලියාපදිංචි කර සක්‍රීය කළ පසු මෙම නිල පැතිකඩ කාඩ්පත මෙහි ස්වයංක්‍රීයව දිස්වනු ඇත.`
        : (currentLanguage === 'ta'
          ? `நிர்வாக தளத்தில் அதிகாரி கணக்கு பதிவு செய்யப்பட்டு செயல்படுத்தப்பட்டதும் இந்த சுயவிவர அட்டை தானாகவே இங்கு தோன்றும்.`
          : `This official profile card will appear here automatically once an officer account is registered and activated in the administrative portal.`);

      officersGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--text-gray); padding: 35px 20px; background: #F8FAFC; border-radius: 12px; border: 1px dashed var(--border-color); width: 100%; box-sizing: border-box;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">👤</div>
          <div style="font-weight: 700; color: var(--primary-navy); font-size: 1.12rem; margin-bottom: 8px;">${noOfficialHeading}</div>
          <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">${noOfficialSubtext}</div>
          ${cleanSubUnit ? `<div style="margin-top: 14px;"><button type="button" class="btn-outline" style="padding: 6px 16px; font-size: 0.82rem; border-radius: 6px; cursor: pointer; background: #FFFFFF;" onclick="selectDivisionUnit(${id}, null, true)">${escapeHtml(viewAllText)}</button></div>` : ''}
        </div>
      `;
    }
  } else {
    officials.forEach(officer => {
      const card = document.createElement('div');
      card.className = 'officer-card';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'center';
      card.style.textAlign = 'center';
      card.style.gap = '6px';
      card.style.padding = '22px 16px';
      card.style.borderRadius = '16px';
      card.style.boxShadow = '0 6px 18px rgba(56,0,0,0.06)';
      card.style.border = '1.5px solid var(--border-color)';
      card.style.background = '#FFFFFF';
      card.style.maxWidth = '360px';
      card.style.width = '100%';
      card.style.boxSizing = 'border-box';

      const role = officer[`role_${currentLanguage}`] || officer.role_en;
      const name = officer[`name_${currentLanguage}`] || officer.name_en;
      const photo = officer.photo ? officer.photo : '';
      const phone = officer.phone || '';
      const email = officer.email || '';
      const localizedOfficerUnit = officer.unit ? localizeSubUnitName(officer.unit, div, currentLanguage) : '';
      const unitTag = localizedOfficerUnit ? `<span style="font-size:0.75rem; padding:3px 10px; background:rgba(56,0,0,0.08); color:var(--primary-navy); border-radius:12px; font-weight:700; margin-top:2px;">🏛️ ${escapeHtml(localizedOfficerUnit)}</span>` : '';

      // Dynamic avatar fallback
      const imageHtml = photo
        ? `<div style="position:relative; width:130px; height:130px; margin-bottom:4px;"><img src="${photo}" alt="${name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:3.5px solid #ECAC58; box-shadow:0 6px 16px rgba(56,0,0,0.12);" onerror="this.onerror=null; this.src='logo.jpg';"><span style="position:absolute; bottom:4px; right:4px; width:16px; height:16px; background:#10B981; border:2.5px solid #FFFFFF; border-radius:50%;" title="Active Verified Official"></span></div>`
        : `<div style="position:relative; width:130px; height:130px; margin-bottom:4px;"><div style="width:100%; height:100%; border-radius:50%; background:linear-gradient(135deg, #380000 0%, #6E1212 100%); display:flex; align-items:center; justify-content:center; font-size:3.5rem; color:#FFFFFF; border:3.5px solid #ECAC58; box-shadow:0 6px 16px rgba(56,0,0,0.12);">👤</div><span style="position:absolute; bottom:4px; right:4px; width:16px; height:16px; background:#10B981; border:2.5px solid #FFFFFF; border-radius:50%;" title="Active Verified Official"></span></div>`;

      const contactHtml = `
        <div class="officer-contacts" style="margin-top:10px; padding-top:10px; border-top:1px solid #F1F4F9; display:flex; flex-direction:column; gap:6px; font-size:0.83rem; width:100%;">
          ${phone ? `<a href="tel:${phone}" style="color:var(--text-slate); text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:6px 10px; background:#F8FAFC; border-radius:8px; font-weight:600; border:1px solid #E2E8F0;">📞 ${phone}</a>` : ''}
          ${email ? `<a href="mailto:${email}" style="color:var(--primary-navy); text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; font-weight:600; font-size:0.78rem; word-break:break-all; padding:6px 10px; background:rgba(56,0,0,0.04); border-radius:8px; border:1px solid rgba(56,0,0,0.08);">✉️ ${email}</a>` : ''}
        </div>
      `;

      card.innerHTML = `
        ${imageHtml}
        <div class="officer-role" style="font-size:0.82rem; font-weight:600; color:#6E5356; line-height:1.3; min-height:30px; display:flex; align-items:center; justify-content:center;">${role}</div>
        <div class="officer-name" style="font-size:1.08rem; font-weight:800; line-height:1.2; color:var(--primary-navy); margin-top:4px;">${name}</div>
        ${unitTag}
        ${contactHtml}
      `;
      officersGrid.appendChild(card);
    });
  }

  // Mobile popup display: When on mobile (<= 768px) and user selects a category or sub-unit,
  // display the card content in the mobile popup window!
  const isMobile = window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
  if (isMobile && isUserSelect) {
    const modalTitle = document.getElementById('modal-mobile-unit-title');
    const modalBadge = document.getElementById('modal-mobile-unit-badge');
    const modalBody = document.getElementById('modal-mobile-unit-body');

    if (modalTitle) modalTitle.textContent = activeUnitTarget;
    if (modalBadge) {
      modalBadge.textContent = cleanSubUnit 
        ? (currentLanguage === 'si' ? 'අනු ඒකකය / ශාඛාව' : (currentLanguage === 'ta' ? 'துணை பிரிவு / கிளை' : 'Sub-Unit / Branch'))
        : (currentLanguage === 'si' ? 'ප්‍රධාන ලේකම් අංශය' : (currentLanguage === 'ta' ? 'பிரதான செயலகப் பிரிவு' : 'Main Secretarial Division'));
    }
    if (modalBody && officersGrid) {
      modalBody.innerHTML = officersGrid.innerHTML;
    }
    openDivisionMobileModal();
  }

  // Display division view
  document.getElementById('view-division').style.display = 'block';
}

function highlightSubUnit(subUnitName) {
  const container = document.getElementById('division-subunits-container');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Pulse effect on target sub-unit pill
  document.querySelectorAll('#division-subunits-grid > div').forEach(pill => {
    if (pill.textContent.includes(subUnitName)) {
      pill.style.transform = 'scale(1.08)';
      pill.style.borderColor = 'var(--primary-navy)';
      pill.style.boxShadow = '0 0 12px rgba(31, 46, 74, 0.35)';
      setTimeout(() => {
        pill.style.transform = 'scale(1)';
        pill.style.borderColor = 'var(--border-color)';
        pill.style.boxShadow = '0 3px 8px rgba(10,37,64,0.03)';
      }, 1500);
    }
  });
}

function getDocUrlForActiveLang(doc) {
  if (currentLanguage === 'si' && doc.url_si) return doc.url_si;
  if (currentLanguage === 'ta' && doc.url_ta) return doc.url_ta;
  if (currentLanguage === 'en' && doc.url_en) return doc.url_en;
  return doc[`url_${currentLanguage}`] || doc.url_en || doc.url_si || doc.url_ta || doc.url || '';
}

function renderDocButtonsHtml(doc, title, compact = false) {
  const mainUrl = getDocUrlForActiveLang(doc) || '#';
  const btnText = siteTranslations[currentLanguage]?.btnDownload || 'Download PDF';
  return `
    <a href="${mainUrl}" target="_blank" class="btn-primary" aria-label="Download ${title}">
      <span>${btnText}</span> 📄
    </a>
  `;
}

function downloadDocument(url, docTitle) {
  if (url && url.trim() !== '') {
    window.open(url, '_blank');
  } else {
    showToast(`Downloading: ${docTitle}`);
  }
}

// 5. Document Center Functionality
function initDocuments() {
  // Loaded directly from MySQL database via loadDatabase()
}

// State Management for DCS Hierarchy Selection (User 1 - User 6)
let currentDcsFilter = 'all';

function matchesDcsFilter(doc, filter) {
  if (!filter || filter === 'all') return true;

  const title = (
    (doc.title_en || '') + ' ' +
    (doc.title_si || '') + ' ' +
    (doc.title_ta || '')
  ).toLowerCase();
  const divStr = String(doc.division || '').toLowerCase();
  const userId = doc.created_by_user_id ? Number(doc.created_by_user_id) : null;
  const username = String(doc.created_by_username || '').toLowerCase();

  if (filter === 'dcs-admin') {
    // 1. DCS Administration (User 1 & all its sub-branches: User 1, 2, 3, 4, 5)
    if (userId && [1, 2, 3, 4, 5].includes(userId)) return true;
    if (['user1', 'user2', 'user3', 'user4', 'user5', 'admin'].includes(username)) return true;
    if (doc.division == 1 || divStr.includes('admin') || divStr.includes('dcs admin')) return true;
    if (title.includes('transfer') || title.includes('development officer') || title.includes('mso') || title.includes('conduct') || title.includes('rti') || title.includes('ආචාර ධර්ම') || title.includes('ස්ථාන මාරු')) return true;
    return false;
  }

  if (filter === 'accounts') {
    // • Accounts (User 2)
    if (userId === 2 || username.includes('user2') || username.includes('account')) return true;
    if (divStr.includes('account') || doc.division == 3) return true; // Treasury / Finance
    if (title.includes('account') || title.includes('treasury') || title.includes('budget') || title.includes('භාණ්ඩාගාර') || title.includes('අයවැය') || title.includes('ගිණුම්') || title.includes('finance')) return true;
    return false;
  }

  if (filter === 'statistic') {
    // • Statistic (User 3)
    if (userId === 3 || username.includes('user3') || username.includes('statistic')) return true;
    if (divStr.includes('stat') || title.includes('statistic') || title.includes('සංඛ්‍යාලේඛන') || title.includes('census') || title.includes('survey')) return true;
    return false;
  }

  if (filter === 'legal') {
    // • Legal (User 4)
    if (userId === 4 || username.includes('user4') || username.includes('legal')) return true;
    if (divStr.includes('legal') || title.includes('legal') || title.includes('නීති') || title.includes('conduct') || title.includes('ආචාර ධර්ම') || title.includes('rti') || title.includes('act') || title.includes('පනත') || title.includes('තොරතුරු')) return true;
    return false;
  }

  if (filter === 'digital') {
    // • Digital Division (User 5)
    if (userId === 5 || username.includes('user5') || username.includes('digital') || username.includes('ict')) return true;
    if (divStr.includes('digital') || divStr.includes('ict') || title.includes('digital') || title.includes('ict') || title.includes('software') || title.includes('ඩිජිටල්') || title.includes('online') || title.includes('web')) return true;
    return false;
  }

  if (filter === 'dcs-eng') {
    // 2. DCS Engineering (User 6)
    if (userId === 6 || username.includes('user6') || username.includes('eng')) return true;
    if (doc.division == 4 || doc.division == 2 || divStr.includes('eng') || divStr.includes('engineering') || divStr.includes('dcs eng')) return true;
    if (title.includes('rate book') || title.includes('මිල ගණන්') || title.includes('boq') || title.includes('engineering') || title.includes('building') || title.includes('road') || title.includes('irrigation') || title.includes('qc') || title.includes('ගොඩනැගිලි') || title.includes('මාර්ග') || title.includes('වාරිමාර්ග')) return true;
    return false;
  }

  return false;
}

function setDcsHierarchyFilter(filterKey) {
  currentDcsFilter = filterKey || 'all';

  const t = docCenterTranslations[currentLanguage] || docCenterTranslations['en'];

  // Labels for viewing badge
  const labels = {
    'all': t.filterAllDivisions,
    'dcs-admin': t.optAllDcsAdmin,
    'establishment': t.optEstablishment.replace(/^[^\w\s඀-෿஀-௿]+/, '').trim(),
    'statistic': t.optStatistic.replace(/^[^\w\s඀-෿஀-௿]+/, '').trim(),
    'legal': t.optLegal.replace(/^[^\w\s඀-෿஀-௿]+/, '').trim(),
    'accounts': t.optAccounts.replace(/^[^\w\s඀-෿஀-௿]+/, '').trim(),
    'digital': t.optDigital.replace(/^[^\w\s඀-෿஀-௿]+/, '').trim(),
    'translation': t.optTranslation.replace(/^[^\w\s඀-෿஀-௿]+/, '').trim(),
    'dcs-eng': t.optDcsEng.replace(/^[^\w\s඀-෿஀-௿]+/, '').trim()
  };

  const labelEl = document.getElementById('dcs-active-name');
  if (labelEl) {
    labelEl.textContent = labels[currentDcsFilter] || currentDcsFilter;
  }

  // Update button active states
  document.querySelectorAll('.dcs-card-btn, .dcs-group-main-btn, .dcs-branch-pill').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtn = document.getElementById(`dcs-btn-${currentDcsFilter}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Highlight parent group card if a sub-branch of DCS Admin is active
  const adminGroup = document.getElementById('dcs-group-admin');
  if (['dcs-admin', 'accounts', 'statistic', 'legal', 'digital'].includes(currentDcsFilter)) {
    if (adminGroup) adminGroup.classList.add('group-active');
  } else {
    if (adminGroup) adminGroup.classList.remove('group-active');
  }

  // Sync with dropdown filter
  const divSelect = document.getElementById('filter-division');
  if (divSelect) {
    divSelect.value = currentDcsFilter;
  }

  renderCategoryTabs();
  filterDocuments();
}

function handleDivisionSelectChange(val) {
  setDcsHierarchyFilter(val);
}

function renderDocumentsTable() {
  renderCategoryTabs();
  filterDocuments();
}

function renderCategoryTabs() {
  const container = document.getElementById('download-categories-tabs');
  if (!container) return;

  const t = docCenterTranslations[currentLanguage] || docCenterTranslations['en'];

  const typeLabels = {
    Circular: t.typeCircular,
    Letter: t.typeLetter,
    Notice: t.typeNotice,
    Application: t.typeApplication,
    Report: t.typeReport,
    Publication: t.typePublication
  };

  // Only count documents matching the active DCS selection
  const dcsDocs = documents.filter(doc => matchesDcsFilter(doc, currentDcsFilter));

  const categories = [
    { id: 'All', label: t.tabAllDownloads, count: dcsDocs.length }
  ];

  Object.keys(typeLabels).forEach(typeKey => {
    const count = dcsDocs.filter(d => d.type === typeKey).length;
    categories.push({ id: typeKey, label: typeLabels[typeKey], count });
  });

  container.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `download-tab-btn ${currentCategory === cat.id ? 'active' : ''}`;
    btn.onclick = () => {
      currentCategory = cat.id;
      const typeSelect = document.getElementById('filter-type');
      if (typeSelect) typeSelect.value = cat.id === 'All' ? '' : cat.id;
      renderCategoryTabs();
      filterDocuments();
    };

    btn.innerHTML = `
      <span>${cat.label}</span>
      <span class="download-tab-count">${cat.count}</span>
    `;
    container.appendChild(btn);
  });
}

function filterDocuments() {
  const searchQuery = document.getElementById('doc-search')?.value.toLowerCase() || '';
  const typeFilter = document.getElementById('filter-type')?.value || '';
  const t = docCenterTranslations[currentLanguage] || docCenterTranslations['en'];

  const tableBody = document.getElementById('documents-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  const filtered = documents.filter(doc => {
    // 1. DCS Hierarchy Filter
    if (!matchesDcsFilter(doc, currentDcsFilter)) return false;

    // 2. Search Query Matching
    const title = (doc[`title_${currentLanguage}`] || doc.title_en || doc.title_si || doc.title_ta || '').toLowerCase();
    if (searchQuery && !title.includes(searchQuery)) return false;

    // 3. Document Type Filter (from either tab or dropdown)
    const targetType = typeFilter !== '' ? typeFilter : currentCategory;
    if (targetType !== 'All' && targetType !== '' && doc.type !== targetType) return false;

    return true;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: var(--text-slate-light); padding: 32px 16px;">
          ${t.noDocsFound}
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(doc => {
    const tr = document.createElement('tr');

    const title = doc[`title_${currentLanguage}`] || doc.title_en || doc.title_si || doc.title_ta || 'Untitled Document';
    const isNewHtml = doc.isNew ? `<span class="badge-new-item">${t.badgeNew || 'NEW'}</span>` : '';
    const divisionName = divisionsData[doc.division] ? (divisionsData[doc.division][`name_${currentLanguage}`] || divisionsData[doc.division].name_en) : 'N/A';
    const mainUrl = getDocUrlForActiveLang(doc) || '#';
    const typeLabel = t['type' + doc.type] || doc.type;

    tr.innerHTML = `
      <td>
        <div class="doc-title-cell">
          <div style="display:inline-flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <a href="${mainUrl}" target="_blank" class="doc-title-link">
              <span>📄</span>
              <span>${title}</span>
            </a>
            ${isNewHtml}
          </div>
        </div>
      </td>
      <td><span class="badge badge-division">${divisionName}</span></td>
      <td><span class="badge badge-type-${doc.type.toLowerCase()}">${typeLabel}</span></td>
    `;
    tableBody.appendChild(tr);
  });
}

// 6. Admin Panel Upload Management
function handleAdminUpload(event) {
  event.preventDefault();

  const titleEn = document.getElementById('admin-title-en').value;
  const titleSi = document.getElementById('admin-title-si').value;
  const titleTa = document.getElementById('admin-title-ta').value;
  const divisionId = parseInt(document.getElementById('admin-division').value, 10);
  const docType = document.getElementById('admin-type').value;
  const fileSize = document.getElementById('admin-size').value;

  const isFeatured = document.getElementById('admin-featured').checked;

  const newDoc = {
    id: documents.length + 1,
    title_en: titleEn,
    title_si: titleSi,
    title_ta: titleTa,
    division: divisionId,
    type: docType,
    size: fileSize,
    isNew: true,
    featured: isFeatured
  };

  documents.unshift(newDoc); // Add to the top

  // Reset Form
  event.target.reset();
  showToast("New document registered successfully!");

  // Transition to Document view to show the result
  setTimeout(() => {
    window.location.hash = '#documents';
  }, 1000);
}

async function handleContactSubmit(event) {
  event.preventDefault();

  const messages = {
    en: {
      success: "Inquiry submitted successfully!",
      local: "Inquiry recorded locally (sandbox mode).",
      failed: "Failed to submit inquiry."
    },
    si: {
      success: "ඔබගේ විමසීම සාර්ථකව යොමු කරන ලදී!",
      local: "ඔබගේ විමසීම සටහන් කරගන්නා ලදී (දේශීය ප්‍රකාරය).",
      failed: "විමසීම යොමු කිරීමට නොහැකි විය."
    },
    ta: {
      success: "உங்கள் விசாரணை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
      local: "உங்கள் விசாரணை பதிவு செய்யப்பட்டது.",
      failed: "விசாரணையை சமர்ப்பிக்க முடியவில்லை."
    }
  };
  const msg = messages[currentLanguage] || messages['en'];

  const payload = {
    name: document.getElementById('contact-name').value,
    nic: document.getElementById('contact-nic').value,
    phone: document.getElementById('contact-phone').value,
    email: document.getElementById('contact-email').value,
    message: document.getElementById('contact-message').value
  };

  try {
    const res = await fetch('api.php?action=inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast(msg.success);
      event.target.reset();
    } else {
      const err = await res.json();
      showToast(err.error || msg.failed);
    }
  } catch (err) {
    console.error(err);
    showToast(msg.local);
    event.target.reset();
  }
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

async function renderAnnouncements() {
  const container = document.getElementById('announcements-marquee-content');
  if (!container) return;

  const defaultText = currentLanguage === 'si' ? "දැනුම්දීම: වයඹ පළාත් සභාවට අදාළ 2026 රාජ්‍ය පරිපාලන චක්‍රලේඛ නිකුත් කර ඇත. තොරතුරු දැනගැනීමේ RTI ඉල්ලුම්පත්‍ර අන්තර්ජාලය ඔස්සේ භාරගැනීම සිදුකෙරේ." :
    currentLanguage === 'ta' ? "அறிவிப்பு: வடமேல் மாகாண சபைக்கான 2026 ஆம் ஆண்டிற்கான அதிகாரப்பூர்வ சுற்றறிக்கைகள் வெளியிடப்பட்டுள்ளன." :
      "Notice: Official Administrative Circulars 2026 for North Western Provincial Council have been released. RTI info request applications are open online.";

  let activeText = siteTranslations[currentLanguage]?.announcementsText?.trim() || '';

  // Language mismatch detection:
  // If user selected English, but activeText is pure Sinhala or Tamil
  // Or user selected Sinhala, but activeText is pure English or Tamil
  // Or user selected Tamil, but activeText is pure Sinhala or English
  const hasSinhala = /[\u0D80-\u0DFF]/.test(activeText);
  const hasTamil = /[\u0B80-\u0BFF]/.test(activeText);
  const hasEnglish = /[a-zA-Z]{4,}/.test(activeText);

  let needsTranslation = false;
  if (!activeText) {
    needsTranslation = true;
  } else if (currentLanguage === 'en' && !hasEnglish && (hasSinhala || hasTamil)) {
    needsTranslation = true;
  } else if (currentLanguage === 'si' && !hasSinhala && (hasEnglish || hasTamil)) {
    needsTranslation = true;
  } else if (currentLanguage === 'ta' && !hasTamil && (hasSinhala || hasEnglish)) {
    needsTranslation = true;
  }

  if (!needsTranslation && activeText) {
    container.textContent = activeText;
    return;
  }

  // Find source text in any available language
  const sourceText = activeText
    || siteTranslations['si']?.announcementsText?.trim()
    || siteTranslations['en']?.announcementsText?.trim()
    || siteTranslations['ta']?.announcementsText?.trim();

  if (!sourceText) {
    container.textContent = defaultText;
    return;
  }

  // Check in-memory cache for fast display
  const cacheKey = `ann_cache_${currentLanguage}_` + encodeURIComponent(sourceText.slice(0, 30));
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    container.textContent = cached;
    if (siteTranslations[currentLanguage]) {
      siteTranslations[currentLanguage].announcementsText = cached;
    }
    return;
  }

  // Show available text immediately so ticker isn't empty
  container.textContent = sourceText;

  // Asynchronously auto-translate into active language
  const targetLang = currentLanguage;
  try {
    const res = await fetch(`api.php?action=translate&tl=${targetLang}&sl=auto&text=${encodeURIComponent(sourceText)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.translatedText) {
        if (!siteTranslations[targetLang]) siteTranslations[targetLang] = {};
        siteTranslations[targetLang].announcementsText = data.translatedText;
        try { sessionStorage.setItem(cacheKey, data.translatedText); } catch (e) {}

        // If user is still on this language, update ticker seamlessly
        if (currentLanguage === targetLang) {
          container.textContent = data.translatedText;
        }
      }
    }
  } catch (err) {
    console.warn("Announcement auto-translate error:", err);
  }
}

function renderHomeDivisions() {
  const grid = document.getElementById('home-divisions-grid');
  if (!grid) return;

  grid.innerHTML = '';

  // Define visual icons for each division
  const icons = { 1: "💼", 2: "📊", 3: "🎯", 4: "💻", 5: "📈" };

  const divs = Object.values(divisionsData || {});
  if (divs.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-slate-light); padding: 30px;">Loading divisions...</div>`;
    return;
  }

  const btnLabels = {
    en: "Explore Division",
    si: "අංශය වෙත",
    ta: "பிரிவை ஆராய்க"
  };
  const btnText = siteTranslations[currentLanguage]?.btnExploreDivision || btnLabels[currentLanguage] || "Explore Division";

  divs.forEach(div => {
    const card = document.createElement('div');
    card.className = 'home-division-card';
    card.onclick = () => {
      window.location.hash = `#division-${div.id}`;
    };

    const name = div[`name_${currentLanguage}`] || div.name_en;
    const desc = div[`desc_${currentLanguage}`] || div.desc_en;
    const icon = icons[div.id] || "🏢";

    card.innerHTML = `
      <div class="home-division-card-icon">${icon}</div>
      <div class="home-division-card-title" title="${name}">${name}</div>
      <div class="home-division-card-desc" title="${desc}">${desc}</div>
      <button type="button" class="home-division-card-btn" aria-label="${name}">
        <span>${btnText}</span> <span class="btn-arrow">➔</span>
      </button>
    `;
    grid.appendChild(card);
  });
}

function handleHomeSearch(query) {
  // Transfer search query to Document Center search input
  const docSearchInput = document.getElementById('doc-search');
  if (docSearchInput) {
    docSearchInput.value = query;
  }

  // Switch hash route to documents page
  window.location.hash = '#documents';

  // Focus the document center search bar and trigger filter
  setTimeout(() => {
    if (docSearchInput) {
      docSearchInput.focus();
      filterDocuments();
    }
  }, 100);
}

function triggerKeywordSearch(keyword) {
  // Clear the home input to keep it clean
  const homeSearch = document.getElementById('home-search-input');
  if (homeSearch) homeSearch.value = '';

  // Set the active category tab dynamically
  if (['Circular', 'Form', 'Report'].includes(keyword)) {
    currentCategory = keyword;
    const docSearchInput = document.getElementById('doc-search');
    if (docSearchInput) docSearchInput.value = ''; // clear search when clicking main category
  } else {
    currentCategory = 'All';
    // If it's a generic word like 'Budget', we set search query
    const docSearchInput = document.getElementById('doc-search');
    if (docSearchInput) {
      docSearchInput.value = keyword;
    }
  }

  // Switch hash route to documents page
  window.location.hash = '#documents';

  // Focus the search bar and trigger render
  setTimeout(() => {
    renderCategoryTabs();
    filterDocuments();
  }, 100);
}

let currentFeaturedSlide = 0;
let featuredCarouselInterval = null;

function getFeaturedCardsPerView() {
  const vp = document.querySelector('.carousel-viewport');
  const w = vp ? vp.clientWidth : window.innerWidth;
  if (w < 560) return 1;
  if (w < 860) return 2;
  if (w < 1160) return 3;
  return 4;
}

function extractDocYearMonth(doc) {
  if (!doc) return null;

  // 1. Check explicit created_at or date field (e.g. "2026-10-28 14:15:00" or "2026-10-28")
  const raw = doc.created_at || doc.date || '';
  if (typeof raw === 'string') {
    const m = raw.match(/^(\d{4})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}`;
  }

  // 2. Check URL for /uploads/YYYY/MM/ pattern
  const url = doc.url || doc.url_en || '';
  if (typeof url === 'string') {
    const urlMatch = url.match(/\/uploads\/(\d{4})\/(\d{2})\//);
    if (urlMatch) return `${urlMatch[1]}-${urlMatch[2]}`;
  }

  // 3. Fallback to Date parse
  if (raw) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      return `${y}-${mo}`;
    }
  }

  // 4. Fallback to doc.id timestamp if numeric millisecond timestamp
  if (typeof doc.id === 'number' && doc.id > 1500000000000) {
    const d = new Date(doc.id);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      return `${y}-${mo}`;
    }
  }

  return null;
}

function getLatestMonthFeaturedDocs() {
  if (!Array.isArray(documents) || documents.length === 0) {
    return { docs: [], latestYM: '' };
  }

  // 1. Determine current live system/calendar month (e.g. "2026-11" for November 2026)
  const now = new Date();
  const curY = now.getFullYear();
  const curM = String(now.getMonth() + 1).padStart(2, '0');
  const systemCurrentYM = `${curY}-${curM}`;

  // 2. Filter for documents published in the system's current live month
  let monthDocs = documents.filter(doc => extractDocYearMonth(doc) === systemCurrentYM);
  let displayYM = systemCurrentYM;

  // 3. Fallback: If no documents published in this current month yet,
  // display the latest published / featured documents while anchoring the badge
  // to the active current system month so the portal always stays completely current.
  if (monthDocs.length === 0) {
    let latestDocYM = '';
    documents.forEach(doc => {
      const ym = extractDocYearMonth(doc);
      if (ym && ym > latestDocYM) {
        latestDocYM = ym;
      }
    });

    if (latestDocYM) {
      monthDocs = documents.filter(doc => extractDocYearMonth(doc) === latestDocYM || doc.featured);
    } else {
      monthDocs = documents.slice(0, 12);
    }
    displayYM = systemCurrentYM;
  }

  // 4. Sort: featured items first, then descending by created_at / id (newest first)
  monthDocs.sort((a, b) => {
    if (!!b.featured !== !!a.featured) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
    const timeA = new Date(a.created_at || a.date || a.id || 0).getTime() || 0;
    const timeB = new Date(b.created_at || b.date || b.id || 0).getTime() || 0;
    return timeB - timeA;
  });

  return { docs: monthDocs, latestYM: displayYM };
}

function updateFeaturedMonthLabel(latestYM) {
  const badge = document.getElementById('featured-latest-month-badge');
  if (!badge) return;

  if (!latestYM) {
    badge.style.display = 'none';
    return;
  }

  const parts = latestYM.split('-');
  const yStr = parts[0];
  const mIdx = parseInt(parts[1], 10) - 1;

  const monthNames = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    si: ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'],
    ta: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்']
  };

  let formatted = '';
  if (currentLanguage === 'si') {
    formatted = `${yStr} ${(monthNames.si[mIdx] || '')}`;
  } else if (currentLanguage === 'ta') {
    formatted = `${(monthNames.ta[mIdx] || '')} ${yStr}`;
  } else {
    formatted = `${(monthNames.en[mIdx] || '')} ${yStr}`;
  }

  badge.innerHTML = `🗓️ ${formatted}`;
  badge.style.display = 'inline-flex';
}

function renderFeaturedDownloads() {
  const container = document.getElementById('homepage-featured-downloads');
  if (!container) return;

  container.innerHTML = '';

  const { docs: featuredDocs, latestYM } = getLatestMonthFeaturedDocs();
  const prevBtn = document.getElementById('featured-carousel-prev');
  const nextBtn = document.getElementById('featured-carousel-next');

  updateFeaturedMonthLabel(latestYM);

  if (featuredDocs.length === 0) {
    const emptyMsg = currentLanguage === 'si' ? "මෙම කාලසීමාව සඳහා නවතම ලේඛන නිකුත් කර නොමැත." :
      currentLanguage === 'ta' ? "தற்போதைய காலத்திற்கு புதிய ஆவணங்கள் எதுவும் இல்லை." :
      "No documents published for the latest month.";
    container.innerHTML = `<div style="text-align: center; color: var(--text-slate-light); width:100%; padding:24px;">${emptyMsg}</div>`;
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    stopFeaturedAutoplay();
    return;
  }

  const typeIcons = {
    Circular: "📜",
    Letter: "✉️",
    Notice: "📢",
    Application: "📝",
    Report: "📊",
    Publication: "📖"
  };

  featuredDocs.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'quick-link-card carousel-card';
    card.style.cursor = 'default';

    const title = doc[`title_${currentLanguage}`] || doc.title_en;
    const icon = typeIcons[doc.type] || "📄";
    const divisionName = divisionsData[doc.division] ? (divisionsData[doc.division][`name_${currentLanguage}`] || divisionsData[doc.division].name_en) : 'N/A';
    const isNewBadge = doc.isNew ? '<span class="card-badge-new">NEW</span>' : '';

    card.innerHTML = `
      <div class="carousel-card-inner">
        <div class="carousel-card-header">
          <span class="quick-card-icon">${icon}</span>
          <div class="carousel-card-title-group">
            <div class="quick-card-title">${title} ${isNewBadge}</div>
            <div class="quick-card-meta">
              <span>🏛️ ${divisionName}</span>
              <span style="opacity:0.4;">•</span>
              <span>${doc.size}</span>
            </div>
          </div>
        </div>
        <div class="carousel-card-action">
          ${renderDocButtonsHtml(doc, title, true)}
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  currentFeaturedSlide = 0;
  container.style.transform = 'translateX(0)';

  if (prevBtn) prevBtn.style.display = 'inline-flex';
  if (nextBtn) nextBtn.style.display = 'inline-flex';

  updateFeaturedCardWidths();
  initFeaturedSwipe();
  startFeaturedAutoplay();
}

function updateFeaturedCardWidths() {
  const container = document.getElementById('homepage-featured-downloads');
  const viewport = document.querySelector('.carousel-viewport');
  if (!container || !viewport) return;

  const viewportW = viewport.clientWidth;
  if (viewportW <= 0) return;

  const cardsPerView = getFeaturedCardsPerView();
  const CARD_GAP = 14;
  let cardW;

  if (cardsPerView === 1) {
    cardW = Math.min(300, viewportW - 16);
  } else {
    const totalGaps = (cardsPerView - 1) * CARD_GAP;
    cardW = Math.max(220, Math.floor((viewportW - totalGaps) / cardsPerView));
  }

  Array.from(container.children).forEach(child => {
    child.style.flex = `0 0 ${cardW}px`;
    child.style.width = `${cardW}px`;
    child.style.boxSizing = 'border-box';
  });

  updateFeaturedCarouselPosition();
}

function slideFeatured(direction) {
  const track = document.getElementById('homepage-featured-downloads');
  if (!track || track.children.length === 0) return;
  const cardsPerView = getFeaturedCardsPerView();
  const maxSlides = Math.max(0, track.children.length - cardsPerView);
  if (maxSlides <= 0) return;

  currentFeaturedSlide += direction;

  if (currentFeaturedSlide < 0) {
    currentFeaturedSlide = maxSlides;
  } else if (currentFeaturedSlide > maxSlides) {
    currentFeaturedSlide = 0;
  }

  updateFeaturedCarouselPosition();
  startFeaturedAutoplay();
}

function updateFeaturedCarouselPosition() {
  const track = document.getElementById('homepage-featured-downloads');
  if (!track || track.children.length === 0) return;

  const cardsPerView = getFeaturedCardsPerView();
  const maxSlides = Math.max(0, track.children.length - cardsPerView);
  if (currentFeaturedSlide > maxSlides) {
    currentFeaturedSlide = maxSlides;
  }

  const cardEl = track.children[0];
  const CARD_GAP = 16;
  const cardWidth = cardEl.getBoundingClientRect().width + CARD_GAP;
  track.style.transform = `translateX(-${currentFeaturedSlide * cardWidth}px)`;

  renderCarouselDots(track.children.length, cardsPerView, currentFeaturedSlide);
}

function renderCarouselDots(totalCards, cardsPerView, activeIndex) {
  const dotsContainer = document.getElementById('carousel-dots-container');
  if (!dotsContainer) return;

  const totalSteps = Math.max(1, totalCards - cardsPerView + 1);
  if (totalSteps <= 1) {
    dotsContainer.innerHTML = '';
    return;
  }

  let html = '';
  for (let i = 0; i < totalSteps; i++) {
    html += `<span class="carousel-dot ${i === activeIndex ? 'active' : ''}" onclick="goToFeaturedSlide(${i})" aria-label="Go to slide ${i + 1}"></span>`;
  }
  dotsContainer.innerHTML = html;
}

window.goToFeaturedSlide = function(index) {
  currentFeaturedSlide = index;
  updateFeaturedCarouselPosition();
  startFeaturedAutoplay();
};

function initFeaturedSwipe() {
  const viewport = document.querySelector('.carousel-viewport');
  if (!viewport || viewport.dataset.swipeInitialized) return;
  viewport.dataset.swipeInitialized = 'true';

  let startX = 0;
  let startY = 0;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      stopFeaturedAutoplay();
    }
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;

      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          slideFeatured(1);
        } else {
          slideFeatured(-1);
        }
      } else {
        startFeaturedAutoplay();
      }
    }
  }, { passive: true });
}

window.addEventListener('resize', () => {
  if (window._featuredResizeTimeout) clearTimeout(window._featuredResizeTimeout);
  window._featuredResizeTimeout = setTimeout(() => {
    updateFeaturedCardWidths();
  }, 120);
});

function startFeaturedAutoplay() {
  stopFeaturedAutoplay();
  const track = document.getElementById('homepage-featured-downloads');
  if (!track) return;
  const cardsPerView = getFeaturedCardsPerView();
  if (track.children.length <= cardsPerView) return;

  featuredCarouselInterval = setInterval(() => {
    const maxSlides = Math.max(0, track.children.length - cardsPerView);
    if (currentFeaturedSlide >= maxSlides) {
      currentFeaturedSlide = 0;
    } else {
      currentFeaturedSlide += 1;
    }
    updateFeaturedCarouselPosition();
  }, 4500);
}

function stopFeaturedAutoplay() {
  if (featuredCarouselInterval) {
    clearInterval(featuredCarouselInterval);
    featuredCarouselInterval = null;
  }
}

// 9. Sub-organizations Directories (Disabled)
function renderSubOrgs() {
  // Institutes section removed
}

function filterSubOrgs() {
  // Institutes section removed
}

function renderEServices() {
  filterEServices();

  const boqGrid = document.getElementById('boq-eservices-grid');
  if (boqGrid) {
    boqGrid.innerHTML = '';
    (systemsData || []).filter(s => s.id !== 1).forEach(sys => {
      const card = document.createElement('div');
      card.className = 'dept-card';

      const title = sys[`title_${currentLanguage}`] || sys.title_en;
      const desc = sys[`desc_${currentLanguage}`] || sys.desc_en;
      const icon = sys.icon || "💻";
      const categoryBadge = sys.category ? `<span class="project-badge active-badge" style="margin-left:auto; font-size:0.75rem;">${sys.category}</span>` : '';

      card.innerHTML = `
        <div class="dept-card-header" style="align-items:center;">
          <span class="dept-card-icon">${icon}</span>
          <h4 class="dept-card-title">${title}</h4>
          ${categoryBadge}
        </div>
        <p class="dept-card-desc">${desc}</p>
        <a href="${sys.url || '#'}" target="_blank" class="btn-primary" style="margin-top:auto; padding:8px 16px; font-size:0.85rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
          Launch System ↗
        </a>
      `;
      boqGrid.appendChild(card);
    });
  }
}

function filterEServices() {
  const grid = document.getElementById('eservices-grid');
  if (!grid) return;

  const query = (document.getElementById('eservices-search')?.value || '').toLowerCase();
  const category = document.getElementById('eservices-category-filter')?.value || '';
  grid.innerHTML = '';

  const filtered = (systemsData || []).filter(sys => {
    const title = (sys[`title_${currentLanguage}`] || sys.title_en || '').toLowerCase();
    const desc = (sys[`desc_${currentLanguage}`] || sys.desc_en || '').toLowerCase();
    const matchesSearch = title.includes(query) || desc.includes(query);
    const matchesCategory = category === '' || sys.category === category;
    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--text-slate-light); padding: 40px 0;">No online systems found matching your search.</div>`;
    return;
  }

  filtered.forEach(sys => {
    const card = document.createElement('div');
    card.className = 'dept-card';

    const title = sys[`title_${currentLanguage}`] || sys.title_en;
    const desc = sys[`desc_${currentLanguage}`] || sys.desc_en;
    const icon = sys.icon || "💻";
    const categoryBadge = sys.category ? `<span class="project-badge active-badge" style="margin-left:auto; font-size:0.75rem;">${sys.category}</span>` : '';

    card.innerHTML = `
      <div class="dept-card-header" style="align-items:center;">
        <span class="dept-card-icon">${icon}</span>
        <h4 class="dept-card-title">${title}</h4>
        ${categoryBadge}
      </div>
      <p class="dept-card-desc">${desc}</p>
      <a href="${sys.url || '#'}" target="_blank" class="btn-primary" style="margin-top:auto; padding:8px 16px; font-size:0.85rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
        Launch System ↗
      </a>
    `;
    grid.appendChild(card);
  });
}


// ==========================================================================
// Key Provincial Projects & Articles Cinematic Slider (Edge-to-Edge Full Width, 4s Autoplay, Smooth Crossfade)
// ==========================================================================
let currentCinematicIndex = 0;
let cinematicAutoplayTimer = null;
let isCinematicTransitioning = false;
const CINEMATIC_INTERVAL = 4000; // 4 seconds interval per user request

function renderProjects() {
  // Preload all project images for instant, smooth transitions
  if (Array.isArray(projects)) {
    projects.forEach(p => {
      if (p.image) {
        const img = new Image();
        img.src = p.image;
      }
    });
  }

  renderCinematicSlideContent(false);
  startCinematicAutoplay();
}

function getProjectFormattedDate(proj) {
  const rawDate = proj.date || proj.created_at || (proj.id === 1 ? '2026-10-24' : (proj.id === 2 ? '2026-10-18' : '2026-10-12'));
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return rawDate;
  const year = d.getFullYear();
  const day = d.getDate();
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNamesSi = ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජුනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'];
  const monthNamesTa = ['ஜனவரி', 'பெப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
  if (currentLanguage === 'si') {
    return year + ' ' + monthNamesSi[d.getMonth()] + ' ' + day;
  } else if (currentLanguage === 'ta') {
    return day + ' ' + monthNamesTa[d.getMonth()] + ' ' + year;
  } else {
    return monthNamesEn[d.getMonth()] + ' ' + day + ', ' + year;
  }
}

function renderCinematicSlideContent(withTransition = false) {
  const container = document.getElementById('cinematic-slider');
  const bgLayer = document.getElementById('cinematic-bg-layer');
  const activePane = document.getElementById('cinematic-active-pane');
  const cardsTrack = document.getElementById('cinematic-cards-track');
  const counter = document.getElementById('cinematic-counter');

  if (!container || !activePane) {
    return;
  }

  // Overlaid thumbnail cards of other posts removed per user request
  if (cardsTrack) {
    cardsTrack.innerHTML = '';
    cardsTrack.style.display = 'none';
  }

  if (!projects || projects.length === 0) {
    activePane.innerHTML = '<p style="color:#FFF; padding:20px;">Loading articles...</p>';
    return;
  }

  const total = projects.length;
  if (currentCinematicIndex >= total) currentCinematicIndex = 0;
  if (currentCinematicIndex < 0) currentCinematicIndex = total - 1;

  const currentProj = projects[currentCinematicIndex];
  const numStr = String(currentCinematicIndex + 1).padStart(2, '0');

  const updateDOM = () => {
    // 1. Update Background photo
    if (bgLayer && currentProj.image) {
      bgLayer.style.backgroundImage = "url('" + currentProj.image + "')";
    }

    // 2. Update Large Number Counter
    if (counter) {
      counter.textContent = numStr;
    }

    // 3. Localized text strings & Published Date
    const title = currentProj['title_' + currentLanguage] || currentProj.title_en;
    const desc = currentProj['desc_' + currentLanguage] || currentProj.desc_en;
    const statusLabel = siteTranslations[currentLanguage]?.[currentProj.status_key] || currentProj.status;
    const regionTag = currentLanguage === 'si' ? 'වයඹ පළාත • සංවර්ධන වැඩසටහන' : (currentLanguage === 'ta' ? 'வடமேல் மாகாணம் • அபிவிருத்தி திட்டம்' : 'North Western Province • Strategic Project');
    const readArticleText = currentLanguage === 'si' ? 'ලිපිය කියවන්න' : (currentLanguage === 'ta' ? 'கட்டுரையை வாசிக்கவும்' : 'READ ARTICLE');
    const dateFormatted = getProjectFormattedDate(currentProj);
    const datePrefix = currentLanguage === 'si' ? 'පළකළ දිනය:' : (currentLanguage === 'ta' ? 'வெளியிடப்பட்டது:' : 'Published:');

    // 4. Populate Active Pane with Published Day display
    activePane.innerHTML = `
      <div class="cinematic-meta-tag">
        <span class="cinematic-meta-dash"></span>
        <span class="cinematic-meta-region">${regionTag}</span>
        <span class="cinematic-status-badge">${statusLabel}</span>
        <span class="cinematic-publish-date">
          <span class="date-icon">📅</span> ${datePrefix} ${dateFormatted}
        </span>
      </div>
      <h2 class="cinematic-title">${title}</h2>
      <p class="cinematic-desc">${desc}</p>
      <div class="cinematic-action-row">
        <button type="button" class="cinematic-icon-btn" onclick="openProjectArticle(${currentProj.id})" onmouseenter="pauseCinematicAutoplay()" onmouseleave="resumeCinematicAutoplay()" title="Read Article" aria-label="Article Details">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <button type="button" class="cinematic-read-btn" onclick="openProjectArticle(${currentProj.id})" onmouseenter="pauseCinematicAutoplay()" onmouseleave="resumeCinematicAutoplay()">
          <span>${readArticleText}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    `;

    if (withTransition) {
      requestAnimationFrame(() => {
        activePane.style.opacity = '1';
        activePane.style.transform = 'translateY(0)';
        if (bgLayer) bgLayer.style.opacity = '1';
        setTimeout(() => {
          isCinematicTransitioning = false;
        }, 320);
      });
    }
  };

  if (withTransition) {
    isCinematicTransitioning = true;
    activePane.style.opacity = '0';
    activePane.style.transform = 'translateY(-8px)';
    if (bgLayer) bgLayer.style.opacity = '0.35';
    setTimeout(updateDOM, 280);
  } else {
    activePane.style.opacity = '1';
    activePane.style.transform = 'translateY(0)';
    if (bgLayer) bgLayer.style.opacity = '1';
    updateDOM();
  }
}

function renderCinematicSlider() {
  renderCinematicSlideContent(false);
}

function resetCinematicProgressBar() {
  const progressBar = document.getElementById('cinematic-progress-bar');
  if (!progressBar) return;
  progressBar.style.transition = 'none';
  progressBar.style.width = '0%';
  void progressBar.offsetWidth; // Force reflow
  progressBar.style.transition = `width ${CINEMATIC_INTERVAL}ms linear`;
  progressBar.style.width = '100%';
}

function startCinematicAutoplay() {
  if (cinematicAutoplayTimer) {
    clearInterval(cinematicAutoplayTimer);
    cinematicAutoplayTimer = null;
  }

  resetCinematicProgressBar();

  cinematicAutoplayTimer = setInterval(() => {
    nextCinematicSlide(true);
  }, CINEMATIC_INTERVAL);
}

function pauseCinematicAutoplay() {
  if (cinematicAutoplayTimer) {
    clearInterval(cinematicAutoplayTimer);
    cinematicAutoplayTimer = null;
  }
}

function resumeCinematicAutoplay() {
  if (!cinematicAutoplayTimer) {
    startCinematicAutoplay();
  }
}

function goToCinematicSlide(idx) {
  if (isCinematicTransitioning || !projects || projects.length === 0) return;
  currentCinematicIndex = idx;
  renderCinematicSlideContent(true);
  startCinematicAutoplay();
}

function nextCinematicSlide(isAuto = false) {
  if (isCinematicTransitioning || !projects || projects.length === 0) return;
  currentCinematicIndex = (currentCinematicIndex + 1) % projects.length;
  renderCinematicSlideContent(true);
  startCinematicAutoplay();
}

function prevCinematicSlide() {
  if (isCinematicTransitioning || !projects || projects.length === 0) return;
  currentCinematicIndex = (currentCinematicIndex - 1 + projects.length) % projects.length;
  renderCinematicSlideContent(true);
  startCinematicAutoplay();
}

// Backwards compatibility aliases
function prevProject() { prevCinematicSlide(); }
function nextProject() { nextCinematicSlide(); }
function goToProject(idx) { goToCinematicSlide(idx); }
function pauseProjectAutoplay() { pauseCinematicAutoplay(); }
function resumeProjectAutoplay() { resumeCinematicAutoplay(); }

function renderAllArticles() {
  const container = document.getElementById('all-articles-grid');
  if (!container) return;

  container.innerHTML = '';
  projects.forEach(proj => {
    container.appendChild(buildProjectCard(proj));
  });
}

function buildProjectCard(proj) {
  const card = document.createElement('div');
  card.className = 'project-card';

  const title = proj[`title_${currentLanguage}`] || proj.title_en;
  const desc = proj[`desc_${currentLanguage}`] || proj.desc_en;
  const statusLabel = siteTranslations[currentLanguage]?.[proj.status_key] || proj.status;
  const badgeClass = proj.status.toLowerCase() === 'active' ? 'active-badge' : 'planning-badge';

  card.innerHTML = `
    <div class="project-image-wrapper">
      <img src="${proj.image}" alt="${title}" class="project-image"
        onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22 style=%22background:%230A2540%22><text x=%2250%25%22 y=%2250%25%22 fill=%22%23ffffff%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22>${title}</text></svg>';">
      <span class="project-badge ${badgeClass}">${statusLabel}</span>
    </div>
    <div class="project-card-content">
      <h4 class="project-card-title">${title}</h4>
      <p class="project-card-desc">${desc}</p>
      <button class="btn-primary" style="padding:9px 16px; font-size:0.85rem; width:100%; margin-top:auto;"
        onclick="openProjectArticle(${proj.id})">
        Read Article
      </button>
    </div>
  `;
  return card;
}


function openProjectArticle(id) {
  const proj = projects.find(p => p.id === id);
  if (!proj) return;

  const title = proj[`title_${currentLanguage}`] || proj.title_en;
  const desc = proj[`desc_${currentLanguage}`] || proj.desc_en;
  const statusLabel = siteTranslations[currentLanguage]?.[proj.status_key] || proj.status;
  const badgeClass = proj.status.toLowerCase() === 'active' ? 'active-badge' : 'planning-badge';

  // Populate article view
  document.getElementById('article-hero-image').src = proj.image || '';
  document.getElementById('article-hero-image').alt = title;
  document.getElementById('article-title').textContent = title;
  document.getElementById('article-description').textContent = desc;

  const badge = document.getElementById('article-status-badge');
  badge.textContent = statusLabel;
  badge.className = `project-badge ${badgeClass}`;

  // Related documents matching the project keyword
  const relatedDocs = documents.filter(d =>
    proj.keyword && d.title_en.toLowerCase().includes(proj.keyword.toLowerCase())
  );
  const docsContainer = document.getElementById('article-related-docs');
  docsContainer.innerHTML = relatedDocs.length === 0
    ? `<p style="color:var(--text-slate-light); font-size:0.9rem;">No related documents found.</p>`
    : relatedDocs.map(d => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-warm-gray); border-radius:8px; padding:12px 16px; gap:12px;">
          <span style="font-weight:600; color:var(--primary-navy); font-size:0.9rem;">📄 ${d.title_en}</span>
          <button class="btn-outline" style="padding:6px 14px; font-size:0.8rem; flex-shrink:0;" onclick="downloadDocument('${d.url || ''}','${d.title_en}')">
            Download
          </button>
        </div>`).join('');

  // Navigate to the article view
  navigateTo('project-article');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function renderStats() {
  const container = document.getElementById('home-stats-grid');
  if (!container) return;

  container.innerHTML = '';

  const statLabels = {
    en: {
      statsCirculars: "Official Circulars",
      statsDivisions: "Secretariat Divisions",
      statsRti: "RTI Compliance Rate",
      statsSupport: "Citizen Helpdesk"
    },
    si: {
      statsCirculars: "නිකුත් කළ චක්‍රලේඛ",
      statsDivisions: "පළාත් සභා අංශ",
      statsRti: "RTI අනුකූලතාව",
      statsSupport: "මහජන සහන සේවය"
    },
    ta: {
      statsCirculars: "வெளியிடப்பட்ட சுற்றறிக்கைகள்",
      statsDivisions: "செயலகப் பிரிவுகள்",
      statsRti: "RTI இணக்க விகிதம்",
      statsSupport: "மக்கள் உதவி சேவை"
    }
  };

  stats.forEach(st => {
    const card = document.createElement('div');
    card.className = 'stats-card';

    const langDict = statLabels[currentLanguage] || statLabels['en'];
    const label = siteTranslations[currentLanguage]?.[st.label_key] ||
                  langDict[st.label_key] ||
                  statLabels['en'][st.label_key] ||
                  st.label_key;

    card.innerHTML = `
      <div class="stats-num" data-raw-val="${escapeHtml(st.value)}">${escapeHtml(st.value)}</div>
      <div class="stats-lbl">${escapeHtml(label)}</div>
    `;
    container.appendChild(card);
  });
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

function renderRtiView() {
  const container = document.getElementById('rti-officers-container');
  const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 width=%22100%22 height=%22100%22 fill=%22%230A2540%22><path d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z%22/></svg>';

  const legacyImg = document.getElementById('rti-officer-image');
  if (legacyImg) {
    legacyImg.src = rtiPhoto || defaultAvatar;
  }

  if (!container) return;

  const t = (siteTranslations && siteTranslations[currentLanguage]) || (siteTranslations && siteTranslations['en']) || {};
  let list = rtiOfficers;

  if (!list || !Array.isArray(list) || list.length === 0) {
    list = [
      {
        name: t.rtiOfficerName || "Designated RTI Officer: Mr. A.B. Wickramasinghe",
        contact: t.rtiOfficerContact || "Email: csnwp@sltnet.lk | Phone: +94 37 223 1769",
        photo: rtiPhoto || ""
      }
    ];
  }

  container.innerHTML = list.map(off => {
    const nameStr = off.name || '';
    const contactStr = off.contact || '';
    const photoStr = off.photo || defaultAvatar;
    return `
      <div class="officer-contact-box" style="display: flex; align-items: center; gap: 24px; background: var(--bg-warm-gray); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <img src="${photoStr}" alt="RTI Officer" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-navy); flex-shrink: 0;" onerror="this.src='${defaultAvatar}'">
        <div>
          <h3 style="font-family: var(--font-heading); margin-bottom: 10px; color: var(--primary-navy); font-size: 1.15rem;">${escapeHtml(nameStr)}</h3>
          <p style="font-weight: 500; color: var(--text-slate); line-height: 1.6; white-space: pre-line;">${escapeHtml(contactStr)}</p>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// PROFESSIONAL SCROLL REVEAL & NUMERICAL STATS COUNTER SYSTEM
// ==========================================================================
let scrollObserverInstance = null;

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Immediate fallback for browsers without IntersectionObserver
    document.querySelectorAll('.reveal-on-scroll, .stagger-cascade').forEach(el => {
      el.classList.add('is-revealed');
    });
    triggerStatsCountup();
    return;
  }

  // Disconnect previous instance if re-initializing
  if (scrollObserverInstance) {
    scrollObserverInstance.disconnect();
  }

  scrollObserverInstance = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('is-revealed');

        // Trigger numerical count-up when stats dashboard enters viewport
        if (el.classList.contains('stats-dashboard-section') || el.id === 'home-stats-grid' || el.classList.contains('stats-card')) {
          triggerStatsCountup();
        }

        obs.unobserve(el);
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -30px 0px'
  });

  // Assign stagger delay indexes to children of any .stagger-cascade
  document.querySelectorAll('.stagger-cascade').forEach(container => {
    Array.from(container.children).forEach((child, idx) => {
      child.style.setProperty('--stagger-i', idx);
    });
    scrollObserverInstance.observe(container);
  });

  // Observe standalone reveal-on-scroll elements
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    scrollObserverInstance.observe(el);
  });
}

function triggerStatsCountup() {
  const cards = document.querySelectorAll('.stats-card');
  cards.forEach(card => {
    if (card.getAttribute('data-animated') === 'true') return;
    card.setAttribute('data-animated', 'true');

    const numEl = card.querySelector('.stats-num');
    if (!numEl) return;

    const rawStr = numEl.getAttribute('data-raw-val') || numEl.textContent.trim();
    if (!rawStr) return;

    // Match prefix, numeric portion (including commas/decimals), and suffix
    const match = rawStr.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
    if (!match) return;

    const prefix = match[1] || '';
    const numStr = match[2];
    const suffix = match[3] || '';
    const hasCommas = numStr.includes(',');
    const hasDecimal = numStr.includes('.');
    const cleanNum = parseFloat(numStr.replace(/,/g, ''));

    if (isNaN(cleanNum)) return;

    const duration = 1400; // ms
    const startTime = performance.now();

    function updateCounter(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Buttery smooth easeOutExpo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = cleanNum * ease;

      let formattedNum = hasDecimal
        ? currentVal.toFixed(1)
        : Math.floor(currentVal).toString();

      if (hasCommas) {
        const parts = formattedNum.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formattedNum = parts.join('.');
      }

      numEl.textContent = prefix + formattedNum + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        numEl.textContent = rawStr; // Ensure final exact value
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// Live sync on window focus to ensure newly published user documents & news reflect immediately
window.addEventListener('focus', () => {
  loadDatabase().then(() => {
    renderAnnouncements();
    renderFeaturedDownloads();
    renderProjects();
    if (window.location.hash === '#documents') {
      renderDocumentsTable();
    }
  });
});
