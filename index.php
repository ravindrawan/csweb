<?php
require_once __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chief Secretariat – North Western Province</title>
  <meta name="description" content="Official portal of the Chief Secretariat - North Western Province, Government of Sri Lanka. Access official documents, forms, rate books, and circulars.">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <link rel="stylesheet" href="styles.css?v=93.0">
</head>
<body class="lang-en">

  <!-- Unified Single-Line Navigation Header (Matching Reference Image) -->
  <header class="main-nav-bar" aria-label="Primary Navigation">
    <div class="nav-bar-container">
      
      <!-- Brand on the Left (Dual Emblems + Title) -->
      <a href="#home" class="nav-brand-group">
        <div class="nav-brand-emblems">
          <img src="Emblem_of_Sri_Lanka.svg" alt="Emblem of Sri Lanka" class="nav-emblem-crest">
          <img src="logo.jpg" alt="North Western Province Logo" class="nav-emblem-province">
        </div>
        <div class="nav-brand-titles">
          <span class="nav-brand-main">
            <span class="brand-l1" data-i18n="portalTitleL1">NORTH WESTERN</span>
            <span class="brand-l2" data-i18n="portalTitleL2">PROVINCIAL COUNCIL</span>
          </span>
          <span class="nav-brand-sub" data-i18n="portalSubtitle">NORTH WESTERN PROVINCE</span>
        </div>
      </a>

      <!-- Navigation Links (Desktop Inline, Mobile Drawer) -->
      <ul class="nav-list" id="nav-list">
        <li>
          <a href="#home" class="nav-link active">
            <span class="nav-icon">🏠</span>
            <span data-i18n="navHome">Home</span>
          </a>
        </li>
        <li class="nav-item-dropdown">
          <a href="#divisions" class="nav-link nav-has-dropdown" id="nav-divisions-dropdown" aria-expanded="false">
            <span class="nav-icon">🏛️</span>
            <span data-i18n="navDivisions">Our Divisions</span>
            <span class="nav-chevron">▾</span>
          </a>
          <ul class="dropdown-menu" id="divisions-dropdown-menu-list">
            <!-- Populated dynamically by renderDivisionsNav() in app.js -->
          </ul>
        </li>
        <li>
          <a href="#about" class="nav-link" onclick="scrollToAbout(event)">
            <span class="nav-icon">🏛️</span>
            <span data-i18n="navAbout">About</span>
          </a>
        </li>
        <li>
          <a href="#projects" class="nav-link" onclick="scrollToProjects(event)">
            <span class="nav-icon">🚀</span>
            <span data-i18n="navProjects">Projects</span>
          </a>
        </li>
        <li>
          <a href="#documents" class="nav-link">
            <span class="nav-icon">📥</span>
            <span data-i18n="navDocs">Download Page</span>
          </a>
        </li>
        <li>
          <a href="#contact" class="nav-link">
            <span class="nav-icon">📞</span>
            <span data-i18n="navContact">Contact</span>
          </a>
        </li>
      </ul>

      <!-- Right Header Actions (Language Selector + Mobile Hamburger Toggle) -->
      <div class="nav-right-actions">
        <!-- Language Selector Dropdown (Matching: 🌐 English ▾) -->
        <div class="nav-item-lang nav-lang-container" id="nav-lang-container">
          <button type="button" class="nav-lang-trigger" id="nav-lang-btn" aria-expanded="false" aria-label="Select Language">
            <span class="nav-lang-globe">🌐</span>
            <span id="current-lang-label">English</span>
            <span class="nav-chevron">▾</span>
          </button>
          <ul class="lang-dropdown-menu" id="lang-dropdown-menu">
            <li>
              <a href="javascript:void(0)" onclick="switchLanguage('en'); closeLangDropdown();" class="lang-option active" id="lang-opt-en">
                <span class="lang-flag">🇬🇧</span>
                <span class="lang-name">English</span>
                <span class="lang-check" id="lang-check-en">✓</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" onclick="switchLanguage('si'); closeLangDropdown();" class="lang-option" id="lang-opt-si">
                <span class="lang-flag">🇱🇰</span>
                <span class="lang-name">සිංහල</span>
                <span class="lang-check" id="lang-check-si"></span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" onclick="switchLanguage('ta'); closeLangDropdown();" class="lang-option" id="lang-opt-ta">
                <span class="lang-flag">🇱🇰</span>
                <span class="lang-name">தமிழ்</span>
                <span class="lang-check" id="lang-check-ta"></span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Mobile Hamburger Toggle Button (Matching Reference Image) -->
        <button class="menu-toggle" id="menu-toggle-btn" onclick="toggleMobileMenu()" aria-label="Toggle Navigation Menu" aria-expanded="false">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>

        <!-- Floating Mobile Menu Popup (Matching Reference Design) -->
        <div class="nav-mobile-popup" id="nav-mobile-popup" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          <div class="nav-mobile-popup-inner">
            <a href="#home" class="popup-nav-link active" onclick="navigateMobile('#home')">
              <span class="popup-nav-icon">🏠</span>
              <span data-i18n="navHome">Home</span>
            </a>
            <a href="#divisions" class="popup-nav-link" onclick="navigateMobile('#divisions')">
              <span class="popup-nav-icon">🏛️</span>
              <span data-i18n="navDivisions">Our Divisions</span>
            </a>
            <a href="#about" class="popup-nav-link" onclick="navigateMobile('#about')">
              <span class="popup-nav-icon">🏛️</span>
              <span data-i18n="navAbout">About</span>
            </a>
            <a href="#projects" class="popup-nav-link" onclick="navigateMobile('#projects')">
              <span class="popup-nav-icon">🚀</span>
              <span data-i18n="navProjects">Projects</span>
            </a>
            <a href="#documents" class="popup-nav-link" onclick="navigateMobile('#documents')">
              <span class="popup-nav-icon">📥</span>
              <span data-i18n="navDocs">Download Page</span>
            </a>
            <a href="#contact" class="popup-nav-link" onclick="navigateMobile('#contact')">
              <span class="popup-nav-icon">📞</span>
              <span data-i18n="navContact">Contact</span>
            </a>
          </div>
        </div>
      </div>

    </div>
    <div class="mobile-popup-backdrop" id="mobile-popup-backdrop" onclick="closeMobilePopup()" aria-hidden="true"></div>
</header>

  <!-- Dynamic Page/View Shell -->
  <main id="main-content">
    
    <!-- HOME VIEW -->
    <div id="view-home" class="view">
      
      <!-- Full-Screen Hero Section with Background Slideshow -->
      <section class="search-header-section" id="hero-section" aria-label="Search and Welcome Header">
        
        <!-- Background Slider Carousel (7 Images from 'Hero Images') -->
        <div class="hero-bg-slider" id="hero-bg-slider" aria-hidden="true">
          <div class="hero-slide active" style="background-image: url('Hero%20Images/1.jpg');"></div>
          <div class="hero-slide" style="background-image: url('Hero%20Images/2.jpg');"></div>
          <div class="hero-slide" style="background-image: url('Hero%20Images/3.jpg');"></div>
          <div class="hero-slide" style="background-image: url('Hero%20Images/4.jpg');"></div>
          <div class="hero-slide" style="background-image: url('Hero%20Images/5.jpg');"></div>
          <div class="hero-slide" style="background-image: url('Hero%20Images/6.jpg');"></div>
          <div class="hero-slide" style="background-image: url('Hero%20Images/7.jpg');"></div>
          <div class="hero-slide" style="background-image: url('Hero%20Images/8.jpg');"></div>
          <div class="hero-slide" style="background-image: url('Hero%20Images/9.jpg');"></div>
        </div>


        <div class="search-header-container">
          
          <div class="search-bar-wrapper">
            <svg class="search-icon-svg-home" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" id="home-search-input" class="home-search-input" placeholder="Search circulars, rate books, transfers, forms..." oninput="handleHomeSearch(this.value)">
            <button type="button" class="btn-hero-search" onclick="handleHomeSearch(document.getElementById('home-search-input').value)">
              <span>Search</span> ➔
            </button>
          </div>

          <div class="trending-keywords">
            <span class="trending-label" data-i18n="homeTrendingLabel">Trending Searches:</span>
            <a href="javascript:void(0)" onclick="triggerKeywordSearch('Circular')" class="trend-pill">📄 Circulars</a>
            <a href="javascript:void(0)" onclick="triggerKeywordSearch('Rate Book')" class="trend-pill">📘 2026 Rate Books</a>
            <a href="javascript:void(0)" onclick="triggerKeywordSearch('Transfer')" class="trend-pill">📋 Annual Transfers</a>
            <a href="javascript:void(0)" onclick="triggerKeywordSearch('Form')" class="trend-pill">📑 Forms</a>
            <a href="javascript:void(0)" onclick="triggerKeywordSearch('RTI')" class="trend-pill">⚖️ RTI Applications</a>
            <a href="javascript:void(0)" onclick="triggerKeywordSearch('Budget')" class="trend-pill">💰 Budget</a>
          </div>

          <!-- Hero Highlights / Pillars (4 Interactive Cards) -->
          <div class="hero-pillars-grid">
            <a href="#divisions" class="hero-pillar-card">
              <span class="pillar-icon">🏛️</span>
              <div class="pillar-content">
                <span class="pillar-title">5 Key Divisions</span>
                <div class="pillar-sub-marquee">
                  <div class="pillar-sub-track">
                    <span class="pillar-sub-text">Administration, MDTU, Treasury, Engineering, Planning &nbsp;&bull;&nbsp; </span>
                    <span class="pillar-sub-text" aria-hidden="true">Administration, MDTU, Treasury, Engineering, Planning &nbsp;&bull;&nbsp; </span>
                  </div>
                </div>
              </div>
            </a>
            <a href="#documents" class="hero-pillar-card">
              <span class="pillar-icon">📂</span>
              <div class="pillar-content">
                <span class="pillar-title">Download Registry</span>
                <div class="pillar-sub-marquee">
                  <div class="pillar-sub-track">
                    <span class="pillar-sub-text">Circulars, Gazettes, Rate Books & Directives &nbsp;&bull;&nbsp; </span>
                    <span class="pillar-sub-text" aria-hidden="true">Circulars, Gazettes, Rate Books & Directives &nbsp;&bull;&nbsp; </span>
                  </div>
                </div>
              </div>
            </a>
            <a href="#eservices" class="hero-pillar-card">
              <span class="pillar-icon">💻</span>
              <div class="pillar-content">
                <span class="pillar-title">e-Services & BoQ</span>
                <span class="pillar-sub">Online BoQ & Systems</span>
              </div>
            </a>
            <a href="#contact" class="hero-pillar-card">
              <span class="pillar-icon">📞</span>
              <div class="pillar-content">
                <span class="pillar-title">Citizen Helpdesk</span>
                <span class="pillar-sub">+94 37 223 1769</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Announcement Ticker -->
      <section class="announcement-ticker-section" aria-label="Latest Announcements">
        <div class="announcement-container">
          <div class="ticker-label" data-i18n="latestUpdates">Latest Announcements</div>
          <div class="ticker-text-wrapper">
            <marquee behavior="scroll" direction="left" scrollamount="4" class="ticker-marquee" onmouseover="this.stop();" onmouseout="this.start();">
              <span id="announcements-marquee-content">Loading announcements...</span>
            </marquee>
          </div>
        </div>
      </section>

      <div class="content-wrapper">
        <!-- Featured Downloads Carousel -->
        <section class="featured-downloads-section reveal-on-scroll" aria-label="Featured Downloads">
          <div class="featured-header-row">
            <div>
              <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                <h3 class="home-subtitle" data-i18n="homeFeaturedDownloadsTitle" style="margin-bottom:0;">Featured Downloads</h3>
                <span id="featured-latest-month-badge" class="badge-latest-month" style="display:none;"></span>
              </div>
              <p class="featured-subtitle-desc" id="featured-downloads-subtitle" data-i18n="homeFeaturedDownloadsSub">Latest circulars, rate books, and official provincial notices</p>
            </div>
          </div>
          
          <div class="carousel-wrapper" onmouseenter="stopFeaturedAutoplay()" onmouseleave="startFeaturedAutoplay()">
            <div class="carousel-viewport">
              <div id="homepage-featured-downloads">
                <!-- Dynamically populated in app.js -->
              </div>
            </div>
          </div>
          <div class="carousel-dots-container" id="carousel-dots-container"></div>
        </section>

        <!-- Divisions Directory Grid -->
        <section id="home-divisions-section" class="home-divisions-section reveal-on-scroll" aria-label="Divisions Grid" style="margin-top: 50px;">
          <h3 class="home-subtitle" data-i18n="navDivisions">Divisions</h3>
          <div class="home-divisions-grid stagger-cascade" id="home-divisions-grid" style="margin-top: 15px;">
            <!-- Dynamically populated trilingual division cards -->
          </div>
        </section>

      </div> <!-- End first content-wrapper for full width projects section -->

      <!-- Key Provincial Projects & Articles Section (Full Screen Width Edge-to-Edge) -->
      <section class="home-projects-section reveal-on-scroll" id="projects-section" aria-label="Provincial Projects and Articles">
        <div class="projects-section-header-wrap">
          <div class="projects-section-header">
            <div>
              <h3 class="home-subtitle" style="margin-bottom:4px;" data-i18n="homeProjectsTitle">Key Provincial Projects</h3>
              <p class="projects-section-sub" style="color:var(--text-slate-light); font-size:0.92rem; margin:0;">
                Strategic regional development and public service transformation initiatives
              </p>
            </div>
            <a href="#all-articles" onclick="navigateTo('all-articles')" class="btn-showcase-viewall">
              <span>View All Articles</span> ➔
            </a>
          </div>
        </div>

        <!-- Cinematic Article Showcase Slider (Edge-to-Edge Full Width, No Curve) -->
        <div class="cinematic-slider-container" id="cinematic-slider">
          <!-- Dynamic Background Photo Crossfade Layer -->
          <div class="cinematic-bg-layer" id="cinematic-bg-layer"></div>
          <div class="cinematic-overlay-gradient"></div>

          <!-- Content Area: Single Full-Width Article Card (Overlaid Thumbnail Cards Removed) -->
          <div class="cinematic-content-grid">
            <div class="cinematic-active-pane" id="cinematic-active-pane">
              <!-- Dynamically populated by renderCinematicSlider() in app.js -->
            </div>
            <div class="cinematic-cards-track" id="cinematic-cards-track" style="display:none;"></div>
          </div>

          <!-- Bottom Controls: Arrows, Progress Bar, Large Index Counter -->
          <div class="cinematic-bottom-bar">
            <div class="cinematic-controls-group">
              <button type="button" class="cinematic-arrow-btn" onclick="prevCinematicSlide()" aria-label="Previous article">◀</button>
              <button type="button" class="cinematic-arrow-btn" onclick="nextCinematicSlide()" aria-label="Next article">▶</button>
              <div class="cinematic-progress-track">
                <div class="cinematic-progress-bar" id="cinematic-progress-bar"></div>
              </div>
            </div>
            <div class="cinematic-counter" id="cinematic-counter">01</div>
          </div>
        </div>
      </section>

      <div class="content-wrapper"> <!-- Re-open content-wrapper for Transparency Dashboard & Values -->
        <!-- Transparency Metrics Stats Counter -->
        <section class="stats-dashboard-section reveal-on-scroll" aria-label="Transparency Dashboard" style="margin-top: 50px;">
          <h3 class="home-subtitle" data-i18n="homeStatsTitle">Transparency Dashboard</h3>
          <div class="stats-counter-grid stagger-cascade" id="home-stats-grid" style="margin-top: 15px;">
            <!-- Dynamically populated in app.js -->
          </div>
        </section>

        <!-- Core Governance Values / Citizens Charter -->
        <section id="about-section" class="charter-values-section reveal-on-scroll" aria-label="Governance Values" style="margin-top: 50px; margin-bottom: 30px; scroll-margin-top: 85px;">
          <h3 class="home-subtitle" data-i18n="homeCharterTitle">Citizen Service Standards</h3>
          <div class="charter-values-grid stagger-cascade" style="margin-top: 15px;">
            <div class="value-card">
              <div class="value-icon-wrap"><span class="value-icon">🎯</span></div>
              <h4 data-i18n="valIntegrityTitle">Vision</h4>
              <p data-i18n="valIntegrityDesc">To be an exemplary, innovative, and citizen-centric provincial administration delivering transparent and sustainable governance.</p>
            </div>
            <div class="value-card">
              <div class="value-icon-wrap"><span class="value-icon">🚀</span></div>
              <h4 data-i18n="valSpeedTitle">Mission</h4>
              <p data-i18n="valSpeedDesc">To empower public administration through effective policy coordination, digital modernization, and efficient resource management for regional development.</p>
            </div>
          </div>
        </section>

        <!-- Contact Us Section (Integrated on Home page under Vision & Mission) -->
        <section id="contact-section" class="home-contact-section reveal-on-scroll" aria-label="Contact Us" style="margin-top: 55px; margin-bottom: 35px;">
          <h3 class="home-subtitle" data-i18n="navContact">Contact Us</h3>

          <!-- MOBILE ONLY: 3 Quick Contact Channel Cards (Matching Reference Image) -->
          <div class="mobile-contact-channels">
            <a href="tel:+94372231769" class="contact-channel-card">
              <div class="channel-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h4 class="channel-title" data-i18n="contactCallUs">Call us</h4>
              <p class="channel-detail">+94 37 223 1769</p>
            </a>

            <a href="mailto:csnwp@sltnet.lk" class="contact-channel-card">
              <div class="channel-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h4 class="channel-title" data-i18n="contactEmailUs">Email</h4>
              <p class="channel-detail">csnwp@sltnet.lk</p>
            </a>

            <a href="https://maps.google.com/?q=North+Western+Provincial+Council+Office+Complex+Kurunegala" target="_blank" rel="noopener" class="contact-channel-card">
              <div class="channel-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h4 class="channel-title" data-i18n="contactOffices">Offices</h4>
              <p class="channel-detail" data-i18n="contactAddress">1st Floor, NWP Office Complex, Kurunegala</p>
            </a>
          </div>

          <!-- DESKTOP & FORM GRID (Compact 2-Card Layout on Web) -->
          <div class="contact-grid">
            <div class="contact-info-panel">
              <h3 data-i18n="contactUsTitle">Get in Touch</h3>
              <div class="contact-method">
                <div class="contact-method-title" data-i18n="contactMainOfficeLabel">Main Office</div>
                <p data-i18n="contactAddress">1st Floor, North Western Provincial Council Office Complex, Kurunegala</p>
              </div>
              <div class="contact-method">
                <div class="contact-method-title" data-i18n="contactEmailLabel">Email Desk</div>
                <p>csnwp@sltnet.lk</p>
              </div>
              <div class="contact-method">
                <div class="contact-method-title" data-i18n="contactPhoneLabel">General Inquiries</div>
                <p>+94 37 223 1769</p>
              </div>
            </div>

            <div class="admin-card contact-form-card">
              <form id="contact-inquiry-form" onsubmit="handleContactSubmit(event)">
                <div class="form-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 16px; margin-bottom: 0;">
                  <div class="form-group" style="margin-bottom: 8px;">
                    <label class="form-label"><span data-i18n="contactFullName">Full Name</span> <span style="color:var(--primary-navy);">*</span></label>
                    <input type="text" id="contact-name" class="form-control" required>
                  </div>
                  <div class="form-group" style="margin-bottom: 8px;">
                    <label class="form-label"><span data-i18n="contactNic">NIC Number</span> <span style="color:var(--primary-navy);">*</span></label>
                    <input type="text" id="contact-nic" class="form-control" placeholder="National Identity Card No." required>
                  </div>
                  <div class="form-group" style="margin-bottom: 8px;">
                    <label class="form-label"><span data-i18n="contactPhone">Contact Number</span> <span style="color:var(--primary-navy);">*</span></label>
                    <input type="tel" id="contact-phone" class="form-control" placeholder="e.g. +94 77 123 4567" required>
                  </div>
                  <div class="form-group" style="margin-bottom: 8px;">
                    <label class="form-label"><span data-i18n="contactEmail">Email Address</span> <span data-i18n="contactOptional" style="font-size:0.8rem; font-weight:normal; color:var(--text-slate-light);">(Optional)</span></label>
                    <input type="email" id="contact-email" class="form-control">
                  </div>
                  <div class="form-group" style="grid-column: 1 / -1; margin-bottom: 12px;">
                    <label class="form-label"><span data-i18n="contactMessage">Message / Inquiry</span> <span style="color:var(--primary-navy);">*</span></label>
                    <textarea id="contact-message" class="form-control" rows="3" required></textarea>
                  </div>
                </div>
                <button type="submit" class="btn-primary" style="width: auto; padding: 8px 22px; font-size: 0.88rem; font-weight: 600; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                  <span>📨</span> <span data-i18n="btnSendInquiry">Send Inquiry</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

    </div>

    <!-- DIVISION DETAIL VIEW -->
    <div id="view-division" class="view" style="display:none;">
      <div class="content-wrapper" style="margin-top: 40px;">
        <!-- Breadcrumb navigation -->
        <nav aria-label="Breadcrumbs" style="margin-bottom: 25px; font-size: 0.92rem; color: var(--text-gray);">
          <a href="#home" style="color: var(--text-slate); text-decoration: none;" data-i18n="navHome">Home</a> &gt; 
          <span style="color: var(--text-slate);" data-i18n="navDivisions">Divisions ▾</span> &gt; 
          <strong id="breadcrumb-division-name" style="color: var(--primary-navy);">Division Name</strong>
        </nav>

        <div class="division-layout">
          <!-- Side Nav -->
          <aside class="sidebar-nav">
            <h3 class="sidebar-title" id="division-sidebar-title">Divisions ▾</h3>
            <ul class="sidebar-links" id="division-sidebar-sections">
              <!-- Dynamically populated divisions links in app.js -->
            </ul>
          </aside>

          <!-- Main Division Content -->
          <div class="division-content">
            <h2 class="section-title" id="division-detail-title" style="margin-bottom: 10px; font-size: 2.2rem;">Division Name</h2>
            <div style="width: 55px; height: 3.5px; background: var(--primary-navy); border-radius: 2px; margin-bottom: 24px;"></div>
            <p id="division-detail-desc" style="font-size: 1.1rem; color: var(--text-gray); line-height: 1.65; margin-bottom: 35px;"></p>

            <!-- Dynamic Official Portal Hyperlink Card (Rendered for Divisions 2, 3, 4, 5 and their sub-units) -->
            <div id="division-portal-box" style="display:none; margin-bottom: 32px;"></div>

            <h3 class="sidebar-title" id="division-officers-title">Key Officials</h3>
            <div class="officers-grid" id="division-officers-grid" style="margin-bottom: 40px;">
              <!-- Dynamically populated officers -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DOCUMENT CENTER VIEW -->
    <div id="view-documents" class="view" style="display:none;">
      <div class="content-wrapper" style="margin-top: 40px;">
        <h2 class="section-title" data-i18n="navDocs">Document Center</h2>

        <!-- Download Category Tabs -->
        <div class="download-tabs-container" id="download-categories-tabs">
          <!-- Dynamically populated in app.js -->
        </div>

        <!-- Filters -->
        <div class="doc-filter-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon-svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" id="doc-search" class="search-input" placeholder="Search downloads..." oninput="filterDocuments()">
          </div>
          <select id="filter-division" class="filter-select" onchange="handleDivisionSelectChange(this.value)">
            <option value="all">All Divisions & Departments</option>
            <optgroup label="1. DCS Administration">
              <option value="dcs-admin">All DCS Administration</option>
              <option value="establishment">🏛️ Establishment Office</option>
              <option value="statistic">📊 Statistical Unit</option>
              <option value="legal">⚖️ Legal Unit</option>
              <option value="accounts">💰 Accounts Unit</option>
              <option value="digital">💻 Digital Division (ICT + GIS)</option>
              <option value="translation">🌐 Translation Unit</option>
            </optgroup>
            <optgroup label="2. DCS Engineering">
              <option value="dcs-eng">📐 2. DCS Engineering</option>
            </optgroup>
          </select>
          <select id="filter-type" class="filter-select" onchange="filterDocuments()">
            <option value="" data-i18n="filterAllTypes">All Types</option>
            <option value="Circular">Circulars</option>
            <option value="Letter">Letters</option>
            <option value="Notice">Notices</option>
            <option value="Application">Applications</option>
            <option value="Report">Reports</option>
            <option value="Publication">Publications</option>
          </select>
        </div>

        <!-- Table -->
        <div class="table-container">
          <table class="doc-table">
            <thead>
              <tr>
                <th data-i18n="tableColTitle">Document Title</th>
                <th data-i18n="tableColDivision">Division</th>
                <th data-i18n="tableColType">Type</th>
              </tr>
            </thead>
            <tbody id="documents-table-body">
              <!-- Dynamically populated rows -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- E-SERVICES VIEW -->
    <div id="view-eservices" class="view" style="display:none;">
      <div class="content-wrapper" style="margin-top: 40px;">
        <h2 class="section-title" data-i18n="eServicesTitle">Online Systems & E-Services</h2>
        <p style="color: var(--text-slate-light); font-size: 0.95rem; margin-top:-10px; margin-bottom: 25px;" data-i18n="eServicesSubtitle">
          Access provincial electronic government portals, public e-services, and internal staff systems.
        </p>

        <!-- Filter Bar -->
        <div class="doc-filter-bar" style="grid-template-columns: 1fr auto; margin-bottom: 25px; gap: 10px;">
          <div class="search-input-wrapper">
            <svg class="search-icon-svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg>
            <input type="text" id="eservices-search" class="search-input" placeholder="Search online systems..." oninput="filterEServices()">
          </div>
          <select id="eservices-category-filter" class="filter-select" onchange="filterEServices()">
            <option value="">All Categories</option>
            <option value="Public">Public Services</option>
            <option value="Staff">Staff Portals</option>
            <option value="Finance">Finance & Tenders</option>
          </select>
        </div>

        <!-- E-Services Grid -->
        <div class="dept-grid" id="eservices-grid">
          <!-- Dynamically populated in app.js -->
        </div>
      </div>
    </div>

    <!-- RTI VIEW -->
    <div id="view-rti" class="view" style="display:none;">
      <div class="content-wrapper" style="margin-top: 40px;">
        <h2 class="section-title" data-i18n="navRti">Right to Information (RTI)</h2>
        <div class="rti-card">
          <p data-i18n="rtiContent" style="font-size: 1.1rem; margin-bottom: 20px;"></p>
          
          <div id="rti-officers-container" style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px;">
            <div class="officer-contact-box" style="display: flex; align-items: center; gap: 24px; background: var(--bg-warm-gray); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
              <img id="rti-officer-image" src="" alt="RTI Officer" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-navy); flex-shrink: 0;">
              <div>
                <h3 style="font-family: var(--font-heading); margin-bottom: 10px; color: var(--primary-navy);" data-i18n="rtiOfficerName"></h3>
                <p data-i18n="rtiOfficerContact" style="font-weight: 500; color: var(--text-slate); line-height: 1.6;"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTACT US VIEW (Moved to Home Page below Vision & Mission) -->
    </div>

    <!-- PROJECT ARTICLE VIEW -->
    <div id="view-project-article" class="view" style="display:none;">
      <div class="content-wrapper" style="margin-top: 40px; max-width: 860px;">

        <!-- Back button -->
        <button onclick="navigateTo('home')" class="btn-outline" style="margin-bottom: 28px; display:inline-flex; align-items:center; gap:8px; padding:8px 18px; font-size:0.88rem;">
          ← Back to Home
        </button>

        <!-- Hero image -->
        <div style="width:100%; height: 380px; border-radius: 16px; overflow:hidden; margin-bottom: 28px; box-shadow: var(--shadow-lg);">
          <img id="article-hero-image" src="" alt="" style="width:100%; height:100%; object-fit:cover;">
        </div>

        <!-- Status badge + title -->
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:14px; flex-wrap:wrap;">
          <span id="article-status-badge" class="project-badge active-badge"></span>
          <h1 id="article-title" style="font-size: 1.9rem; font-weight: 800; color: var(--primary-navy); line-height: 1.2; margin:0;"></h1>
        </div>

        <!-- Full description -->
        <div id="article-description" style="font-size: 1.05rem; color: var(--text-slate); line-height: 1.8; margin-bottom: 30px; white-space: pre-line;"></div>

        <!-- Divider -->
        <hr style="border: none; border-top: 2px solid var(--border-color); margin-bottom: 30px;">

        <!-- Related documents -->
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 16px;">📄 Related Documents</h3>
        <div id="article-related-docs" style="display:flex; flex-direction:column; gap:10px;"></div>

      </div>
    </div>


    <!-- ALL ARTICLES VIEW -->
    <div id="view-all-articles" class="view" style="display:none;">
      <div class="content-wrapper" style="margin-top: 40px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 class="section-title" style="margin-bottom:4px;">Provincial Projects</h2>
            <p style="color:var(--text-slate-light); font-size:0.9rem;">All key projects and initiatives</p>
          </div>
          <button onclick="navigateTo('home')" class="btn-outline" style="display:inline-flex; align-items:center; gap:8px; padding:8px 18px; font-size:0.88rem;">
            ← Back to Home
          </button>
        </div>
        <div class="projects-grid" id="all-articles-grid">
          <!-- Dynamically populated in app.js -->
        </div>
      </div>
    </div>

  </main>

  <!-- Notification Toast -->
  <div id="toast-notification" class="alert-toast" role="alert">Action completed successfully.</div>

  <!-- Main Footer -->
  <footer class="main-footer">
    <div class="footer-container">
      <span data-i18n="footerText" class="footer-copy">© 2026 Chief Secretariat - NWP. All Rights Reserved. | Powered by Digital Division - Chief Secretariat - NWP</span>
      <span class="footer-cms-wrap"><a href="admin.php" style="color: var(--border-color); font-weight: 700; text-decoration: none;" title="Administrative Control Portal">🛡️ Executive Gate CMS ↗</a></span>
    </div>
  </footer>

  <!-- Monthly Calendar Modal -->
  <div id="calendar-modal" class="custom-modal" onclick="if(event.target===this)closeCalendarModal()">
    <div class="custom-modal-content">
      <div class="custom-modal-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.4rem;">📅</span>
          <h3 style="margin:0; font-size:1.25rem; font-weight:700; color:var(--primary-navy);" data-i18n="navCalendar">Monthly Calendar</h3>
        </div>
        <button type="button" class="custom-modal-close" onclick="closeCalendarModal()" aria-label="Close modal">✕</button>
      </div>
      <div class="custom-modal-body">
        <p style="color:var(--text-slate-light); font-size:0.9rem; margin-bottom:16px;">
          Official North Western Provincial Council schedule of public meetings, development reviews, and regional observance days:
        </p>
        <div id="calendar-events-container" class="calendar-events-grid">
          <!-- Populated by renderCalendarEvents() in app.js -->
        </div>
      </div>
    </div>
  </div>

  <!-- Division / Sub-Unit Details Mobile Popup Modal -->
  <div id="modal-division-mobile-card" class="custom-modal" onclick="if(event.target===this)closeDivisionMobileModal()">
    <div class="custom-modal-content" style="max-width: 390px; border-radius: 16px;">
      <div class="custom-modal-header" style="background: linear-gradient(135deg, #380000 0%, #520909 100%); color: #FFFFFF; border-radius: 16px 16px 0 0; padding: 10px 14px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0;">🏛️</div>
          <div style="min-width: 0;">
            <div id="modal-mobile-unit-badge" style="font-size: 0.65rem; font-weight: 700; color: #F59E0B; text-transform: uppercase; letter-spacing: 0.5px;">Division / Unit</div>
            <h3 id="modal-mobile-unit-title" style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #FFFFFF; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Unit Title</h3>
          </div>
        </div>
        <button type="button" class="custom-modal-close" onclick="closeDivisionMobileModal()" aria-label="Close modal" style="color: #FFFFFF; font-size: 1.15rem; background: rgba(255,255,255,0.15); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; flex-shrink: 0;">✕</button>
      </div>
      <div class="custom-modal-body" id="modal-mobile-unit-body" style="padding: 12px 14px 18px; background: #FFFFFF; max-height: 70vh; overflow-y: auto; border-radius: 0 0 16px 16px;">
        <!-- Populated dynamically with officer profile card or official portal card -->
      </div>
      
    </div>
  </div>

  <!-- Include Scripts -->
  <script src="app.js?v=83.0"></script>
</body>
</html>
