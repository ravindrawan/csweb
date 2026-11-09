<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
require_once __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard – Chief Secretariat North Western Province</title>
  <!-- Google Fonts: Plus Jakarta Sans & Inter for Ultra-Modern UI -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    /* ==========================================================================
       MODERN KALYPSO-INSPIRED DESIGN SYSTEM & VARIABLES
       ========================================================================== */
    :root {
      --bg-canvas: #FAF5F5;
      --bg-canvas-card: #FFFFFF;
      --bg-sidebar: #240000;
      --bg-panel: #FFFFFF;
      --bg-input: #FFFFFF;
      --border-soft: #EBDCDA;
      --border-subtle: #DEC5C3;
      
      --text-main: #1D080A;
      --text-muted: #6E5356;
      --text-subtle: #420808;
      
      /* Vibrant Pill Accent Colors Aligned with Regal Maroon & Warm Gold */
      --pill-blue: #380000;
      --pill-blue-hover: #520606;
      --pill-coral: #991B1B;
      --pill-coral-bg: #FEE2E2;
      --pill-navy: #380000;
      --pill-navy-bg: #4A0808;
      --pill-amber: #D97706;
      --pill-amber-bg: #FEF3C7;
      --pill-lavender: #7C1D1D;
      --pill-lavender-bg: #FCE7F3;
      
      --accent-gold: #ECAC58;
      --accent-gold-light: #F5C27C;
      --accent-maroon: #380000;
      --accent-maroon-light: #520606;
      --accent-green: #059669;
      --accent-red: #DC2626;
      --accent-blue: #380000;
      
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
      --radius-sm: 10px;
      --radius-pill: 9999px;
      
      --shadow-canvas: 0 20px 50px rgba(56, 0, 0, 0.05);
      --shadow-card: 0 6px 20px rgba(56, 0, 0, 0.03);
      --shadow-hover: 0 12px 28px rgba(56, 0, 0, 0.08);
      --transition-smooth: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }


    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }


    body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #FAF5F5;
      color: var(--text-main);
      min-height: 100vh;
      margin: 0;
      padding: 0;
      position: relative;
      overflow-x: hidden;
    }


    /* Ambient blobs & dots hidden for crisp edge-to-edge full-screen UI */
    .bg-dot, body::before, body::after {
      display: none;
    }


    /* ==========================================================================
       LOGIN AUTH SCREEN (Soft Card Modal)
       ========================================================================== */
    #login-overlay {
      position: fixed;
      inset: 0;
      background: rgba(36, 0, 0, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-y: auto;
      animation: fadeIn 0.3s ease;
    }

    .auth-screen-back-btn {
      position: fixed;
      top: 24px;
      left: 24px;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 9px 20px;
      background: rgba(255, 255, 255, 0.94);
      color: #380000;
      font-size: 0.86rem;
      font-weight: 700;
      text-decoration: none;
      border-radius: 9999px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.22), 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      z-index: 10002;
    }

    .auth-screen-back-btn:hover {
      background: #FFFFFF;
      color: #7A0C0C;
      transform: translateX(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.32);
    }

    .auth-screen-back-btn .auth-back-arrow {
      font-size: 1.15rem;
      line-height: 1;
      font-weight: 800;
      transition: transform 0.2s ease;
    }

    .auth-screen-back-btn:hover .auth-back-arrow {
      transform: translateX(-3px);
    }

    @media (max-width: 640px) {
      .auth-screen-back-btn {
        top: 14px;
        left: 14px;
        padding: 7px 14px;
        font-size: 0.78rem;
        gap: 6px;
      }
    }



    .login-box {
      width: 100%;
      max-width: 540px;
      min-height: 540px;
      background: #FFFFFF;
      border-radius: var(--radius-xl);
      padding: 24px 32px 20px 32px;
      box-shadow: 0 20px 50px rgba(56, 0, 0, 0.16);
      text-align: center;
      border: 1px solid var(--border-soft);
      margin: auto;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }


    .login-crest {
      width: 46px;
      height: 46px;
      background: linear-gradient(135deg, #380000, #520606); border: 1.5px solid rgba(236, 172, 88, 0.4);
      color: #FFFFFF;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 8px;
      box-shadow: 0 6px 16px rgba(56, 0, 0, 0.25);
    }


    .login-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.4px;
      margin-bottom: 2px;
    }


    .login-desc {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-bottom: 12px;
      line-height: 1.35;
    }


    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }


    .form-group {
      text-align: left;
      margin-bottom: 10px;
    }


    .form-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 4px;
      display: block;
    }


    .form-control,
    input.form-control,
    textarea.form-control,
    select.form-control,
    .modal-box .form-control,
    .modal-box input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"]),
    .modal-box textarea,
    .modal-box select,
    .data-table-card .form-control,
    .content-view .form-control,
    .admin-card .form-control {
      width: 100%;
      background: #FFFFFF !important;
      border: 1.5px solid #A88D8B !important;
      border-radius: 10px;
      padding: 9px 14px;
      font-size: 0.88rem;
      font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text-main);
      outline: none;
      transition: var(--transition-smooth);
      box-sizing: border-box;
    }


    .form-control:hover,
    input.form-control:hover,
    textarea.form-control:hover,
    select.form-control:hover,
    .modal-box .form-control:hover,
    .modal-box input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"]):hover,
    .modal-box textarea:hover,
    .modal-box select:hover,
    .data-table-card .form-control:hover,
    .content-view .form-control:hover,
    .admin-card .form-control:hover {
      border-color: #6E1212 !important;
    }


    .form-control:focus,
    input.form-control:focus,
    textarea.form-control:focus,
    select.form-control:focus,
    .modal-box .form-control:focus,
    .modal-box input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"]):focus,
    .modal-box textarea:focus,
    .modal-box select:focus,
    .data-table-card .form-control:focus,
    .content-view .form-control:focus,
    .admin-card .form-control:focus {
      background: #FFFFFF !important;
      border-color: var(--pill-navy) !important;
      box-shadow: 0 0 0 4px rgba(56, 0, 0, 0.12) !important;
    }


    .form-control:disabled,
    input.form-control:disabled {
      background: #F1F5F9 !important;
      border-color: #CBD5E1 !important;
      color: #64748B !important;
      cursor: not-allowed;
    }


    #modal-forgot-code {
      border-color: #F59E0B !important;
      background: #FFFBEB !important;
    }


    select.form-control {
      cursor: pointer;
    }


    textarea.form-control {
      resize: vertical;
      min-height: 70px;
    }


    /* Dedicated clean typography for Sinhala and Tamil fields */
    #edit-ann-si,
    #doc-title-si,
    #proj-title-si,
    #proj-desc-si,
    textarea[id*="-si"],
    input[id*="-si"],
    textarea[placeholder*="සිංහල"],
    input[placeholder*="සිංහල"],
    .form-control-si {
      font-family: 'Noto Sans Sinhala', 'Plus Jakarta Sans', sans-serif !important;
      font-size: 0.94rem !important;
      line-height: 1.65 !important;
    }


    #edit-ann-ta,
    #doc-title-ta,
    #proj-title-ta,
    #proj-desc-ta,
    textarea[id*="-ta"],
    input[id*="-ta"],
    textarea[placeholder*="தமிழ்"],
    input[placeholder*="தமிழ்"],
    .form-control-ta {
      font-family: 'Noto Sans Tamil', 'Plus Jakarta Sans', sans-serif !important;
      font-size: 0.94rem !important;
      line-height: 1.65 !important;
    }
    .btn-login-submit {
      width: 100%;
      background: var(--pill-navy);
      color: #FFFFFF;
      border: none;
      border-radius: 10px;
      padding: 11px;
      font-size: 0.92rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition-smooth);
      margin-top: 6px;
      box-shadow: 0 6px 16px rgba(42, 51, 98, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }


    .btn-login-submit:hover {
      background: #520606;
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(56, 0, 0, 0.35);
    }


    .password-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }


    .password-input-wrap .form-control {
      padding-right: 42px;
    }


    .btn-toggle-pwd {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      font-size: 1.05rem;
      cursor: pointer;
      color: var(--text-muted);
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
    }


    .btn-toggle-pwd:hover {
      color: var(--text-main);
      transform: scale(1.1);
    }


    /* Auth Switcher Tabs */
    .auth-tabs {
      display: flex;
      background: var(--bg-input);
      border-radius: var(--radius-pill);
      padding: 3px;
      margin-bottom: 14px;
    }


    .auth-tab-btn {
      flex: 1;
      padding: 7px 14px;
      border: none;
      background: transparent;
      border-radius: var(--radius-pill);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
      font-family: inherit;
      transition: var(--transition-smooth);
    }


    .auth-tab-btn.active {
      background: #FFFFFF;
      color: var(--pill-navy);
      box-shadow: 0 4px 10px rgba(56, 0, 0, 0.08);
    }


    /* Auth Language Switcher Pills */
    .auth-lang-pills {
      display: inline-flex;
      background: var(--bg-input);
      padding: 3px;
      border-radius: var(--radius-pill);
      gap: 3px;
      border: 1px solid var(--border-soft);
      align-items: center;
    }


    .auth-lang-btn {
      border: none;
      background: transparent;
      padding: 4px 10px;
      font-size: 0.73rem;
      font-weight: 700;
      color: var(--text-muted);
      border-radius: var(--radius-pill);
      cursor: pointer;
      font-family: inherit;
      transition: var(--transition-smooth);
      line-height: 1.2;
    }


    .auth-lang-btn:hover {
      color: var(--text-main);
    }


    .auth-lang-btn.active {
      background: #380000;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(56, 0, 0, 0.2);
    }


    .auth-view {
      display: none;
      flex: 1;
      flex-direction: column;
    }


    .auth-view.active {
      display: flex;
      animation: fadeIn 0.25s ease;
    }


    .auth-form-flex {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      width: 100%;
    }


    .auth-footer-link {
      margin-top: 10px;
      font-size: 0.78rem;
      color: var(--text-muted);
      text-align: center;
    }


    .auth-link {
      color: var(--pill-navy);
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: var(--transition-smooth);
    }


    .auth-link:hover {
      color: var(--pill-coral);
      text-decoration: underline;
    }


    .auth-sub-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
      margin-bottom: 6px;
      font-size: 0.74rem;
    }


    /* Mobile Header & Sidebar Drawer */
    .mobile-header-bar {
      display: none;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: #FFFFFF;
      border-bottom: 1px solid var(--border-soft);
      border-top-left-radius: var(--radius-xl);
      border-top-right-radius: var(--radius-xl);
    }


    .btn-hamburger {
      width: 40px;
      height: 40px;
      background: var(--bg-input);
      border: none;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--text-main);
    }


    .sidebar-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(36, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      z-index: 998;
      display: none;
    }
    .sidebar-backdrop.active {
      display: block;
    }


    .btn-close-sidebar {
      display: none;
      background: var(--bg-input);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 0.95rem;
      cursor: pointer;
      color: var(--text-main);
      margin-left: auto;
    }


    .login-alert {
      margin-top: 16px;
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      background: var(--pill-coral-bg);
      color: var(--pill-coral);
      font-weight: 600;
      display: none;
    }


    /* ==========================================================================
       MAIN APP CANVAS CONTAINER (Full Screen Edge-to-Edge Layout)
       ========================================================================== */
    #app-canvas {
      width: 100%;
      min-height: 100vh;
      background: #FAF5F5;
      border-radius: 0;
      box-shadow: none;
      display: grid;
      grid-template-columns: 260px 1fr;
      position: relative;
      z-index: 10;
      border: none;
    }


    /* ==========================================================================
       COLUMN 1: LEFT SIDEBAR NAVIGATION (Matching Reference Design)
       ========================================================================== */
    .app-sidebar {
      background: linear-gradient(180deg, #240000 0%, #350000 50%, #200000 100%);
      border-right: 1px solid rgba(236, 172, 88, 0.18);
      padding: 10px 10px 10px 10px;
      display: flex;
      flex-direction: column;
      height: 100vh;
      max-height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      box-sizing: border-box;
      z-index: 50;
    }


    .app-sidebar::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }


    /* Centered Header Section */
    .sidebar-header-centered {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2px 4px 4px 4px;
      position: relative;
      flex-shrink: 0;
    }


    .sidebar-header-centered .btn-close-sidebar {
      position: absolute;
      right: 0;
      top: 0;
      background: transparent;
      border: none;
      color: #D4B2B6;
      font-size: 1.15rem;
      cursor: pointer;
      display: none;
    }


    .sidebar-emblem-wrap {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid #ECAC58;
      padding: 1.5px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 12px rgba(236, 172, 88, 0.35);
      margin-bottom: 4px;
      flex-shrink: 0;
    }


    .sidebar-emblem-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }


    .sidebar-council-title {
      font-size: 0.74rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.3px;
      line-height: 1.15;
      text-transform: uppercase;
    }


    .sidebar-council-sub {
      font-size: 0.58rem;
      font-weight: 600;
      color: #ECAC58;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 1px;
      line-height: 1.1;
    }


    /* User Profile Card */
    .sidebar-user-card {
      display: flex;
      align-items: center;
      gap: 9px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(236, 172, 88, 0.2);
      border-radius: 10px;
      padding: 6px 10px;
      margin: 6px 0 6px 0;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }


    .sidebar-user-card:hover {
      background: rgba(236, 172, 88, 0.15);
      border-color: rgba(236, 172, 88, 0.45);
    }


    .sidebar-user-avatar-wrap {
      width: 32px;
      height: 32px;
      min-width: 32px;
      border-radius: 50%;
      border: 1.5px solid #ECAC58;
      padding: 1px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 7px rgba(236, 172, 88, 0.3);
      flex-shrink: 0;
    }


    .sidebar-user-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }


    .sidebar-user-meta {
      display: flex;
      flex-direction: column;
      gap: 1.5px;
      overflow: hidden;
      flex: 1;
    }


    .sidebar-user-name {
      font-size: 0.76rem;
      font-weight: 700;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: -0.2px;
      line-height: 1.15;
    }


    .sidebar-user-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: rgba(236, 172, 88, 0.18);
      border: 1px solid rgba(236, 172, 88, 0.5);
      color: #F5C27C;
      font-size: 0.55rem;
      font-weight: 800;
      border-radius: 4px;
      padding: 1.5px 6px;
      width: fit-content;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: 1.1;
    }


    .sidebar-user-category {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.62rem;
      font-weight: 600;
      color: #F8D3A2;
      margin-top: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.15;
      max-width: 100%;
    }


    .sidebar-user-category-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    /* Navigation Menu */
    .nav-menu {
      list-style: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 8px;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }


    .nav-item {
      position: relative;
      flex-shrink: 0;
    }


    .nav-btn {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      padding: 9px 13px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #D4B2B6;
      font-size: 0.86rem; /* Kept strictly unchanged as requested */
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
      line-height: 1.25;
      box-sizing: border-box;
    }


    .nav-btn .nav-icon {
      font-size: 0.98rem;
      width: 18px;
      text-align: center;
      color: #D4B2B6;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }


    .nav-btn:hover {
      color: #FFFFFF;
      background: #450808;
    }
    .nav-btn:hover .nav-icon {
      color: #FFFFFF;
    }


    /* Active Nav Item - Vibrant Pill */
    .nav-btn.active {
      color: #FFFFFF !important;
      background: linear-gradient(135deg, #520606 0%, #750A0A 100%) !important;
      font-weight: 700 !important;
      border-radius: 8px !important;
      border: 1px solid rgba(236, 172, 88, 0.45) !important;
      box-shadow: 0 3px 10px rgba(56, 0, 0, 0.45) !important;
    }
    .nav-btn.active .nav-icon {
      color: #FFFFFF !important;
    }


    .nav-badge {
      margin-left: auto;
      background: #ECAC58;
      color: #240000;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 1.5px 6.5px;
      border-radius: var(--radius-pill);
      box-shadow: 0 2px 6px rgba(236, 172, 88, 0.4);
      line-height: 1.1;
    }


    .sidebar-nav-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin: 4px 4px;
      flex-shrink: 0;
    }


    .sidebar-nav-divider-bottom {
      margin-top: 2px;
      margin-bottom: 2px;
    }


    /* Special Sign Out styling from image */
    .nav-btn-signout {
      color: #F87171 !important;
    }
    .nav-btn-signout .nav-icon {
      color: #F87171 !important;
    }
    .nav-btn-signout:hover {
      background: rgba(248, 113, 113, 0.16) !important;
      color: #FCA5A5 !important;
    }
    .nav-btn-signout:hover .nav-icon {
      color: #FCA5A5 !important;
    }


    /* Large displays (> 960px vertical height) - allow gentle breathing room */
    @media (min-height: 960px) {
      .app-sidebar {
        padding: 14px 12px;
      }
      .sidebar-emblem-wrap {
        width: 48px;
        height: 48px;
        margin-bottom: 6px;
      }
      .sidebar-user-card {
        padding: 8px 11px;
        margin: 8px 0 10px 0;
      }
      .nav-menu {
        gap: 8px;
      }
      .nav-btn {
        padding: 9px 13px;
      }
      .sidebar-nav-divider {
        margin: 6px 4px;
      }
    }


    /* Constrained vertical displays (< 640px height) - preserve 0.86rem font size while reducing padding */
    @media (max-height: 640px) {
      .app-sidebar {
        padding: 6px 8px !important;
      }
      .sidebar-header-centered {
        padding: 1px 2px 2px 2px !important;
      }
      .sidebar-emblem-wrap {
        width: 34px !important;
        height: 34px !important;
        margin-bottom: 2px !important;
      }
      .sidebar-council-sub {
        display: none !important;
      }
      .sidebar-user-card {
        padding: 4px 8px !important;
        margin: 3px 0 4px 0 !important;
      }
      .sidebar-user-category {
        display: none !important;
      }
      .nav-menu {
        gap: 1.5px !important;
      }
      .nav-btn {
        padding: 4px 9px !important;
        font-size: 0.86rem !important; /* Preserved strictly unchanged */
      }
      .sidebar-nav-divider {
        margin: 2px 2px !important;
      }
    }


    /* Language typography support */
    body.lang-si, body.lang-si input, body.lang-si button, body.lang-si select, body.lang-si textarea {
      font-family: 'Noto Sans Sinhala', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    body.lang-ta, body.lang-ta input, body.lang-ta button, body.lang-ta select, body.lang-ta textarea {
      font-family: 'Noto Sans Tamil', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }


    /* Topbar Grouped Controls & Right-Side Language Switcher */
    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: nowrap;
    }


    .topbar-utility-group {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }


    .topbar-controls-group {
      display: inline-flex;
      align-items: center;
      background: #FFFFFF;
      border: 1.5px solid var(--border-soft);
      border-radius: var(--radius-pill);
      padding: 4px 6px 4px 10px;
      gap: 10px;
      box-shadow: 0 4px 16px rgba(28, 38, 77, 0.05);
      transition: var(--transition-smooth);
    }


    .topbar-controls-group:hover {
      border-color: var(--border-subtle);
      box-shadow: 0 6px 20px rgba(28, 38, 77, 0.08);
    }


    .topbar-divider {
      width: 1px;
      height: 22px;
      background: var(--border-soft);
      flex-shrink: 0;
    }


    .user-top-pill {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      background: transparent;
      padding: 2px 2px;
      border: none;
    }


    .topbar-icon-actions {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }


    /* Topbar Dashboard Language Switcher (Grouped on the Right) */
    .topbar-lang-switcher {
      display: inline-flex;
      align-items: center;
      background: #FFFFFF;
      border: 1px solid #EBDCDA;
      border-radius: var(--radius-pill);
      padding: 4px 6px 4px 10px;
      gap: 6px;
      box-shadow: 0 2px 8px rgba(50, 80, 130, 0.04);
      transition: var(--transition-smooth);
    }


    .topbar-lang-switcher:hover {
      border-color: var(--border-subtle);
      background: #FFFFFF;
    }


    .lang-globe-icon {
      font-size: 0.90rem;
      display: inline-flex;
      align-items: center;
      color: var(--pill-navy);
    }


    .lang-pills-group {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }


    .lang-pill-btn {
      border: none;
      background: transparent;
      padding: 4px 9px;
      border-radius: var(--radius-pill);
      font-size: 0.76rem;
      font-weight: 700;
      font-family: inherit;
      color: var(--text-subtle);
      cursor: pointer;
      transition: var(--transition-smooth);
      line-height: 1.2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }


    .lang-pill-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.75);
    }


    .lang-pill-btn.active {
      background: #FFFFFF;
      color: var(--pill-navy);
      box-shadow: 0 2px 8px rgba(42, 51, 98, 0.14);
    }


    .mobile-lang-select-wrap {
      display: flex;
      align-items: center;
    }


    .mobile-lang-select {
      background: var(--bg-input);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-pill);
      padding: 4px 8px;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-main);
      outline: none;
      cursor: pointer;
      font-family: inherit;
    }


    /* ==========================================================================
       COLUMN 2: CENTER MAIN CONTENT AREA (Full Screen Dynamic View)
       ========================================================================== */
    .app-main {
      padding: 28px 36px 48px 36px;
      overflow-y: auto;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 22px;
      background: #FAF5F5;
    }


    /* ==========================================================================
       MAIN TOPBAR (Exact Replica of Reference Design 1)
       ========================================================================== */
    .main-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 24px;
      background: transparent;
      position: relative;
      z-index: 20;
    }


    .topbar-welcome-title {
      font-size: 1.25rem !important;
      font-weight: 800 !important;
      color: #1D080A !important;
      letter-spacing: -0.3px;
      line-height: 1.25;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }


    .topbar-welcome-sub {
      font-size: 0.82rem !important;
      font-weight: 500 !important;
      color: #6E5356 !important;
      margin-top: 3px;
    }


    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }


    /* 1. Language Dropdown Pill */
    .topbar-lang-pill-wrap {
      position: relative;
    }


    .topbar-lang-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      border: 1px solid #EBDCDA;
      border-radius: 9999px;
      padding: 7px 18px;
      font-size: 0.84rem;
      font-weight: 600;
      font-family: inherit;
      color: #1D080A;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(50, 80, 130, 0.04);
      transition: all 0.2s ease;
    }


    .topbar-lang-pill-btn:hover {
      background: #FAF5F5;
      border-color: #DEC5C3;
    }


    .topbar-chevron {
      font-size: 0.70rem;
      color: #6E5356;
      margin-left: 2px;
      font-weight: 800;
    }


    .topbar-lang-dropdown-menu {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: #FFFFFF;
      border: 1px solid #EBDCDA;
      border-radius: 14px;
      box-shadow: 0 10px 25px rgba(50, 80, 130, 0.12);
      padding: 6px;
      min-width: 150px;
      display: none;
      flex-direction: column;
      gap: 2px;
      z-index: 100;
    }


    .topbar-lang-dropdown-menu.show {
      display: flex;
      animation: fadeIn 0.18s ease;
    }


    .topbar-lang-menu-opt {
      display: flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      border: none;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: inherit;
      color: #1D080A;
      cursor: pointer;
      text-align: left;
      transition: background 0.15s ease;
      width: 100%;
    }


    .topbar-lang-menu-opt:hover {
      background: #FFF8EE;
      color: #380000;
    }


    /* 2. User Profile Pill */
    .topbar-profile-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FFF8EE;
      border: 1px solid #F5D8A8;
      border-radius: 9999px;
      padding: 5px 16px 5px 6px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(236, 172, 88, 0.15);
      transition: all 0.2s ease;
      text-decoration: none;
    }


    .topbar-profile-pill:hover {
      background: #FDF1DC;
      border-color: #ECAC58;
      transform: translateY(-1px);
    }


    .topbar-profile-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ECAC58;
      background: #FFFFFF;
      flex-shrink: 0;
    }


    .topbar-profile-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: #380000;
      white-space: nowrap;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    /* 3. Sign Out Pill */
    .topbar-signout-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FDF2F2;
      border: 1px solid #FECACA;
      border-radius: 9999px;
      padding: 7px 18px;
      font-size: 0.82rem;
      font-weight: 700;
      font-family: inherit;
      color: #991B1B;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(153, 27, 27, 0.08);
      transition: all 0.2s ease;
      white-space: nowrap;
    }


    .topbar-signout-pill:hover {
      background: #FEE2E2;
      border-color: #F87171;
      transform: translateY(-1px);
    }


    .signout-power-icon {
      width: 14px;
      height: 14px;
      stroke: #991B1B;
      flex-shrink: 0;
    }


    .btn-badge-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: var(--pill-coral);
      border-radius: 50%;
      border: 2px solid #FFFFFF;
    }


    /* ==========================================================================
       3D CLAYMORPHIC GRADIENT METRIC CARDS (Direct from reference image)
       ========================================================================== */
    .metric-pills-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
      align-items: stretch;
    }


    .metric-pill-card {
      border-radius: 16px;
      padding: 12px 18px 11px 18px;
      color: #FFFFFF;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 22px rgba(56, 0, 0, 0.18);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      cursor: default;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 140px;
      min-height: 140px;
      max-height: 140px;
      box-sizing: border-box;
    }


    .metric-pill-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 18px 36px rgba(37, 99, 235, 0.28);
    }


    .metric-pill-card.card-blue {
      background: linear-gradient(135deg, #380000 0%, #630808 100%);
      box-shadow: 0 12px 28px rgba(56, 0, 0, 0.28);
      border: 1px solid rgba(236, 172, 88, 0.25);
    }


    .metric-pill-card.card-cyan {
      background: linear-gradient(135deg, #A15200 0%, #D97706 50%, #ECAC58 100%);
      box-shadow: 0 12px 28px rgba(180, 83, 9, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }


    .metric-pill-card.card-mint {
      background: linear-gradient(135deg, #064E3B 0%, #059669 100%);
      box-shadow: 0 12px 28px rgba(6, 78, 59, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }


    .metric-pill-card.card-violet {
      background: linear-gradient(135deg, #6B0E23 0%, #9B1C36 100%);
      box-shadow: 0 12px 28px rgba(107, 14, 35, 0.28);
      border: 1px solid rgba(236, 172, 88, 0.25);
    }


    .pill-card-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      flex: 1;
      min-width: 0;
      padding-right: 8px;
      z-index: 2;
    }


    .pill-card-val {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      line-height: 1;
      margin-bottom: 2px;
      flex-shrink: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .pill-card-label {
      font-size: 0.95rem;
      font-weight: 800;
      letter-spacing: -0.1px;
      line-height: 1.2;
      min-height: 2.4em;
      max-height: 2.4em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .pill-card-sub {
      font-size: 0.66rem;
      font-weight: 500;
      opacity: 0.88;
      margin-top: 1px;
      margin-bottom: 4px;
      line-height: 1.22;
      min-height: 2.44em;
      max-height: 2.44em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .pill-card-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.45);
      color: #FFFFFF;
      font-size: 0.68rem;
      font-weight: 700;
      font-family: inherit;
      border-radius: 6px;
      padding: 2.5px 10px;
      cursor: pointer;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      width: fit-content;
      height: 23px;
      box-sizing: border-box;
      white-space: nowrap;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }


    .pill-card-btn:hover {
      background: rgba(255, 255, 255, 0.35);
      transform: translateY(-1px);
    }


    .clay-3d-graphic {
      width: 58px;
      height: 58px;
      min-width: 58px;
      max-width: 58px;
      flex-shrink: 0;
      align-self: center;
      filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
      transition: transform 0.3s ease;
      user-select: none;
      pointer-events: none;
      z-index: 2;
    }


    .metric-pill-card:hover .clay-3d-graphic {
      transform: scale(1.06) rotate(-2deg);
    }


    /* ==========================================================================
       FOLDER TABBED DIRECTIVES CONTAINER (Centerpiece from reference image)
       ========================================================================== */
    .folder-card-wrapper {
      margin-top: 24px;
      margin-bottom: 24px;
    }


    .folder-tab-bar {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      padding-left: 12px;
    }


    .folder-tab-btn {
      border: none;
      outline: none;
      font-family: inherit;
      font-size: 0.92rem;
      font-weight: 600;
      padding: 12px 30px 14px 30px;
      cursor: pointer;
      background: #EAE0DF;
      color: #6E5356;
      border-radius: 16px 16px 0 0;
      transition: all 0.2s ease;
      position: relative;
    }


    .folder-tab-btn:hover {
      background: #F3EBEA;
      color: #1D080A;
    }


    .folder-tab-btn.active {
      background: #FFFFFF;
      color: #380000;
      font-weight: 800;
      border-top: 3px solid #380000;
      box-shadow: 0 -4px 14px rgba(56, 0, 0, 0.05);
      z-index: 2;
    }


    .folder-card-body {
      background: #FFFFFF;
      border-radius: 0 24px 24px 24px;
      padding: 28px 32px;
      box-shadow: 0 10px 30px rgba(56, 0, 0, 0.05);
      border: 1px solid #EBDCDA;
      border-top: none;
      position: relative;
      z-index: 1;
    }


    .folder-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 14px;
      margin-bottom: 4px;
      border-bottom: 1px solid #F5ECEB;
      flex-wrap: wrap;
    }


    .folder-input {
      border: 1px solid #DEC5C3;
      background: #FFFFFF;
      border-radius: 8px;
      padding: 7px 14px;
      font-size: 0.82rem;
      font-family: inherit;
      color: #1D080A;
      min-width: 220px;
      outline: none;
      transition: border-color 0.2s;
    }


    .folder-select {
      border: 1px solid #DEC5C3;
      background: #FFFFFF;
      border-radius: 8px;
      padding: 7px 14px;
      font-size: 0.82rem;
      font-family: inherit;
      color: #1D080A;
      min-width: 170px;
      outline: none;
    }


    .btn-folder-search {
      border: 1.5px solid #380000;
      background: #FFFFFF;
      color: #380000;
      font-size: 0.82rem;
      font-weight: 700;
      font-family: inherit;
      border-radius: 8px;
      padding: 6px 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-folder-search:hover {
      background: #FAF5F5;
      color: #520606;
      border-color: #520606;
    }


    .btn-folder-release {
      margin-left: auto;
      border: 1px solid rgba(236, 172, 88, 0.35);
      background: linear-gradient(135deg, #380000 0%, #520606 100%);
      color: #FFFFFF;
      font-size: 0.82rem;
      font-weight: 700;
      font-family: inherit;
      border-radius: 8px;
      padding: 7px 22px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(56, 0, 0, 0.35);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-folder-release:hover {
      background: linear-gradient(135deg, #520606 0%, #6E0909 100%);
      box-shadow: 0 6px 16px rgba(56, 0, 0, 0.45);
      transform: translateY(-1px);
    }


    .folder-rows-list {
      display: flex;
      flex-direction: column;
    }


    .folder-row-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      height: 52px;
      min-height: 52px;
      max-height: 52px;
      padding: 0 8px;
      border-bottom: 1px solid #F5ECEB;
      box-sizing: border-box;
      transition: background 0.15s ease;
    }


    .folder-row-item:hover {
      background: #F8FAFC;
      border-radius: 8px;
    }


    .folder-row-item:last-child {
      border-bottom: none;
    }


    .folder-row-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 0;
    }


    .folder-row-badge {
      width: 155px;
      min-width: 155px;
      max-width: 155px;
      height: 32px;
      min-height: 32px;
      max-height: 32px;
      border-radius: 7px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.72rem;
      letter-spacing: 0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.18);
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      position: relative;
      flex-shrink: 0;
    }


    .folder-row-badge.badge-blue {
      background: linear-gradient(135deg, #380000, #5A0808);
      border: 1px solid rgba(236, 172, 88, 0.4);
      box-shadow: 0 2px 6px rgba(56, 0, 0, 0.25);
    }


    .folder-row-badge.badge-cyan {
      background: linear-gradient(135deg, #B45309, #D97706);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 2px 6px rgba(180, 83, 9, 0.25);
    }


    .folder-row-badge.badge-emerald {
      background: linear-gradient(135deg, #065F46, #047857);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 6px rgba(6, 95, 70, 0.25);
    }


    .folder-row-badge.badge-amber {
      background: linear-gradient(135deg, #7C1D1D, #991B1B);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 6px rgba(124, 29, 29, 0.25);
    }


    .folder-row-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }


    .folder-row-title {
      font-size: 0.86rem;
      font-weight: 700;
      color: #1D080A;
      letter-spacing: -0.2px;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .folder-row-sub {
      font-size: 0.73rem;
      color: #6E5356;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .folder-row-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }


    .btn-folder-action {
      border: 1.5px solid #380000;
      background: #FFFFFF;
      color: #380000;
      font-size: 0.76rem;
      font-weight: 600;
      font-family: inherit;
      border-radius: 6px;
      padding: 0 14px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }


    .btn-folder-action:hover {
      background: #FAF5F5;
      border-color: #520606;
      color: #520606;
    }


    /* ==========================================================================
       OVERVIEW DASHBOARD CONTENT (Charts & Widgets)
       ========================================================================== */
    .dashboard-grid-2 {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 20px;
    }


    .dashboard-card {
      background: #FFFFFF;
      border: 1px solid #EBDCDA;
      border-radius: 22px;
      padding: 24px 26px;
      box-shadow: 0 8px 24px rgba(50, 80, 130, 0.04);
      position: relative;
    }


    .card-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }


    .card-header-title {
      font-size: 1rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.3px;
    }


    .card-header-sub {
      font-size: 0.78rem;
      color: var(--text-muted);
    }


    /* Chart Containers */
    .chart-container-bar {
      width: 100%;
      height: 295px;
      position: relative;
    }


    .chart-container-bar canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }


    .chart-container-pie {
      width: 100%;
      height: 250px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }


    .chart-container-pie canvas {
      width: 100% !important;
      height: 175px !important;
      display: block;
    }


    /* Milestones List matching Image */
    .milestones-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }


    .milestone-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }


    .milestone-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2.5px solid;
      flex-shrink: 0;
    }
    .dot-coral { border-color: var(--pill-coral); }
    .dot-navy { border-color: var(--pill-navy); }
    .dot-amber { border-color: var(--pill-amber); }
    .dot-lavender { border-color: var(--pill-lavender); }


    .milestone-info {
      flex: 1;
    }


    .milestone-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.2;
    }


    .milestone-sub {
      font-size: 0.72rem;
      color: var(--text-muted);
    }


    .milestone-progress-bar {
      width: 70px;
      height: 5px;
      background: var(--bg-input);
      border-radius: var(--radius-pill);
      overflow: hidden;
      margin-left: 10px;
    }


    .milestone-fill {
      height: 100%;
      border-radius: var(--radius-pill);
    }


    .milestone-pct {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-subtle);
      width: 32px;
      text-align: right;
    }


    /* Bottom Dynamics Grid */
    .dynamics-grid-2 {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 20px;
    }


    /* ==========================================================================
       COLUMN 3: RIGHT PROFILE & ACTIONS PANEL
       ========================================================================== */
    .app-panel {
      background: var(--bg-panel);
      border-left: 1px solid var(--border-soft);
      padding: 32px 22px;
      display: flex;
      flex-direction: column;
      gap: 26px;
      overflow-y: auto;
    }


    /* Top User Profile Card */
    .profile-card {
      text-align: center;
      padding: 10px 0;
    }


    .profile-avatar-wrap {
      width: 76px;
      height: 76px;
      margin: 0 auto 12px auto;
      position: relative;
    }


    .profile-avatar-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #FFFFFF;
      border: 3.5px solid #FFBE4A; /* Golden accent ring matching image */
      box-shadow: 0 8px 18px rgba(255, 190, 74, 0.28);
    }


    .profile-name {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 2px;
    }


    .profile-role {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 600;
    }


    .profile-badge {
      display: inline-block;
      margin-top: 6px;
      padding: 3px 10px;
      border-radius: var(--radius-pill);
      font-size: 0.7rem;
      font-weight: 700;
      background: var(--pill-navy-bg);
      color: var(--pill-navy);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }


    /* Admin Action List Cards (from image) */
    .action-panel-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }


    .action-section-title {
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.2px;
    }


    .action-card-item {
      background: #FFFFFF;
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: var(--transition-smooth);
      box-shadow: 0 2px 6px rgba(28, 38, 77, 0.02);
      text-decoration: none;
    }


    .action-card-item:hover {
      border-color: var(--border-subtle);
      transform: translateY(-2px);
      box-shadow: var(--shadow-card);
    }


    .action-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .icon-coral-box { background: var(--pill-coral-bg); color: var(--pill-coral); }
    .icon-lavender-box { background: var(--pill-lavender-bg); color: var(--pill-lavender); }
    .icon-amber-box { background: var(--pill-amber-bg); color: var(--pill-amber); }
    .icon-navy-box { background: var(--pill-navy-bg); color: var(--pill-navy); }


    .action-card-text {
      flex: 1;
    }


    .action-card-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.2;
    }


    .action-card-desc {
      font-size: 0.7rem;
      color: var(--text-muted);
    }


    /* System Health Widget */
    .system-health-card {
      margin-top: auto;
      background: #FFFFFF;
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 16px;
    }


    .health-status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-subtle);
      margin-bottom: 8px;
    }


    .status-badge-live {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--accent-green);
      font-size: 0.72rem;
      font-weight: 700;
    }
    .status-dot-pulse {
      width: 7px;
      height: 7px;
      background: var(--accent-green);
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    }


    /* ==========================================================================
       MANAGEMENT VIEWS & DATA TABLES (Documents, Divisions, Inquiries, Users)
       ========================================================================== */
    .content-view {
      display: none;
      flex-direction: column;
      gap: 20px;
      animation: fadeIn 0.25s ease-out;
    }


    .content-view.active {
      display: flex;
    }


    /* Data Table Styling */
    .data-table-card {
      background: #FFFFFF;
      border: 1px solid #EBDCDA;
      border-radius: 22px;
      padding: 24px 26px;
      box-shadow: 0 8px 24px rgba(50, 80, 130, 0.04);
    }


    .table-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
      flex-wrap: nowrap;
    }


    .table-filters {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
      flex-wrap: nowrap;
    }


    .table-filters .select-pill {
      max-width: 190px;
      padding: 7px 12px;
      font-size: 0.82rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }


    @media (max-width: 860px) {
      .table-toolbar {
        flex-wrap: wrap;
        gap: 10px;
      }
      .table-filters {
        flex-wrap: wrap;
      }
    }


    .select-pill {
      background: var(--bg-input);
      border: 1px solid transparent;
      border-radius: var(--radius-pill);
      padding: 8px 16px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-main);
      outline: none;
      cursor: pointer;
    }
    select.select-pill {
      background: #FFFFFF;
      border: 1.5px solid #C4B0AE;
      transition: var(--transition-smooth);
    }


    select.select-pill:hover {
      border-color: #8C2828;
    }


    select.select-pill:focus {
      border-color: var(--pill-navy);
      box-shadow: 0 0 0 3px rgba(56, 0, 0, 0.08);
    }


    .live-push-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      border-radius: 20px;
      font-size: 0.75rem;
      color: #065F46;
      font-weight: 700;
    }
    .btn-create-action {
      white-space: nowrap;
      flex-shrink: 0;
      background: linear-gradient(135deg, #380000 0%, #520606 100%);
      color: #FFFFFF;
      border: 1px solid rgba(236, 172, 88, 0.3);
      border-radius: var(--radius-pill);
      padding: 9px 18px;
      font-size: 0.84rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: var(--transition-smooth);
      box-shadow: 0 4px 12px rgba(56, 0, 0, 0.25);
    }


    .btn-create-action:hover {
      background: linear-gradient(135deg, #520606 0%, #6E0909 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(56, 0, 0, 0.35);
    }


    .custom-table-responsive {
      width: 100%;
      overflow-x: auto;
    }


    .clean-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.88rem;
      text-align: left;
    }


    .clean-table th {
      padding: 12px 14px;
      color: var(--text-muted);
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      border-bottom: 2px solid var(--border-soft);
      background: #FAF5F5;
    }
    .clean-table th:first-child { border-top-left-radius: var(--radius-sm); border-bottom-left-radius: var(--radius-sm); }
    .clean-table th:last-child { border-top-right-radius: var(--radius-sm); border-bottom-right-radius: var(--radius-sm); }


    .clean-table td {
      padding: 14px;
      border-bottom: 1px solid var(--border-soft);
      color: var(--text-main);
      vertical-align: middle;
    }


    .clean-table tr:hover td {
      background: #FDFDFE;
    }


    /* Status and Type Pills */
    .badge-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .badge-pill-navy { background: #380000 !important; color: #FFFFFF !important; font-weight: 700; border: 1px solid rgba(236, 172, 88, 0.25); }
    .live-count-badge {
      background: #380000 !important;
      color: #FFFFFF !important;
      font-size: 0.74rem !important;
      font-weight: 700 !important;
      padding: 5px 12px !important;
      border-radius: 20px !important;
      display: inline-flex !important;
      align-items: center !important;
      box-shadow: 0 2px 8px rgba(56, 0, 0, 0.25) !important;
      letter-spacing: 0.3px !important;
      border: 1px solid rgba(236, 172, 88, 0.35) !important;
    }
    .live-count-badge::before {
      content: "";
      display: inline-block;
      width: 6.5px;
      height: 6.5px;
      border-radius: 50%;
      background: #10B981;
      margin-right: 6px;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.85);
      flex-shrink: 0;
    }
    .badge-pill-coral { background: var(--pill-coral-bg); color: var(--pill-coral); }
    .badge-pill-amber { background: var(--pill-amber-bg); color: var(--pill-amber); }
    .badge-pill-green { background: #ECFDF5; color: var(--accent-green); }


    /* Action Buttons inside Table */
    .btn-table-action {
      background: #FFF9F2;
      border: 1px solid rgba(236, 172, 88, 0.45);
      min-width: 32px;
      width: auto;
      height: 30px;
      border-radius: 7px;
      padding: 3px 10px;
      color: #8A4800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-size: 0.77rem;
      font-weight: 700;
      line-height: 1.2;
      white-space: nowrap;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    .btn-table-action:hover {
      background: #FDF0E0;
      border-color: #ECAC58;
      color: #5B2F00;
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(236, 172, 88, 0.25);
    }
    .btn-table-action.btn-del {
      background: #FFF1F2;
      border: 1px solid #FECDD3;
      color: #BE123C;
    }
    .btn-table-action.btn-del:hover {
      background: #FFE4E6;
      border-color: #FDA4AF;
      color: #9F1239;
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(190, 18, 60, 0.2);
    }


    /* ==========================================================================
       MODALS (New Document, Edit User, Edit Division)
       ========================================================================== */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(29, 36, 64, 0.45);
      backdrop-filter: blur(6px);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }


    .modal-box,
    .modal-card {
      width: 95%;
      max-width: 760px;
      background: #FFFFFF;
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-xl);
      padding: 28px 32px;
      box-shadow: 0 24px 60px rgba(56, 0, 0, 0.18);
      max-height: 92vh;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #DEC5C3 transparent;
      animation: modalSlide 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }


    .modal-box-wide {
      max-width: 960px !important;
      padding: 26px 34px !important;
      max-height: 92vh !important;
      overflow-y: auto !important;
    }


    /* Modal Content Language Tabs */
    .modal-lang-tabs {
      display: inline-flex;
      align-items: center;
      background: #F5ECEB;
      border: 1px solid #EBDCDA;
      border-radius: var(--radius-pill);
      padding: 3px 5px;
      gap: 4px;
      margin-bottom: 14px;
    }


    .modal-lang-tab-btn {
      border: none;
      background: transparent;
      padding: 5px 14px;
      border-radius: var(--radius-pill);
      font-size: 0.78rem;
      font-weight: 700;
      color: #6E5356;
      cursor: pointer;
      font-family: inherit;
      transition: var(--transition-smooth);
      line-height: 1.2;
    }


    .modal-lang-tab-btn:hover {
      color: #1D080A;
      background: rgba(255, 255, 255, 0.6);
    }


    .modal-lang-tab-btn.active {
      background: #FFFFFF;
      color: #380000;
      box-shadow: 0 2px 8px rgba(56, 0, 0, 0.12);
      border: 1px solid rgba(236, 172, 88, 0.3);
    }


    .modal-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
    }


    .modal-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-main);
    }


    .btn-close-modal {
      background: var(--bg-input);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 1rem;
      cursor: pointer;
      color: var(--text-muted);
      transition: var(--transition-smooth);
    }
    .btn-close-modal:hover {
      background: var(--border-soft);
      color: var(--text-main);
    }


    /* Modal footer actions */
    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }


    .btn-cancel {
      background: transparent;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 10px 18px;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-subtle);
      cursor: pointer;
    }


    /* File upload drop area */
    .file-dropzone {
      border: 2px dashed var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 24px 20px;
      text-align: center;
      background: var(--bg-panel);
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .file-dropzone:hover {
      border-color: var(--pill-navy);
      background: var(--pill-navy-bg);
    }


    /* Toast Notification */
    .toast-msg {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #380000;
      color: #FFFFFF;
      padding: 14px 22px;
      border-radius: var(--radius-md);
      border: 1px solid rgba(236, 172, 88, 0.35);
      font-size: 0.88rem;
      font-weight: 700;
      box-shadow: 0 12px 30px rgba(56, 0, 0, 0.35);
      z-index: 20000;
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .toast-msg.show {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0);
    }


    /* Keyframe Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalSlide {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }


    /* Responsive Breakdown */
    @media (max-width: 900px) {
      body {
        padding: 0;
      }
      #app-canvas {
        grid-template-columns: 1fr;
        border-radius: 0;
        min-height: 100vh;
      }
      .mobile-header-bar {
        display: flex;
      }
      .app-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 280px;
        z-index: 1000;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 10px 40px rgba(28, 38, 77, 0.25);
      }
      .app-sidebar.open {
        transform: translateX(0);
      }
      .btn-close-sidebar {
        display: block;
      }
      .app-main {
        padding: 20px 16px;
      }
      .main-topbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .topbar-actions {
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .metric-pills-grid {
        grid-template-columns: 1fr 1fr;
      }
      .dashboard-grid-2, .dynamics-grid-2 {
        grid-template-columns: 1fr;
      }
      .login-box {
        padding: 34px 22px;
        border-radius: var(--radius-lg);
      }
    }


    @media (max-width: 500px) {
      body {
        padding: 0;
      }
      .metric-pills-grid {
        grid-template-columns: 1fr;
      }
      .pill-card-val {
        font-size: 1.6rem;
      }
      .topbar-actions {
        gap: 8px;
      }
      .date-pill {
        display: none;
      }
      .top-search-input {
        width: 110px;
      }
      .login-box {
        padding: 28px 16px;
        min-height: auto;
      }
      .table-toolbar {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>
<body>


  <!-- Floating Background Dots for Modern Vibe -->
  <div class="bg-dot bg-dot-1"></div>
  <div class="bg-dot bg-dot-2"></div>
  <div class="bg-dot bg-dot-3"></div>
  <div class="bg-dot bg-dot-4"></div>


  <!-- ==========================================================================
       LOGIN GATE OVERLAY
       ========================================================================== -->
  <!-- ==========================================================================
       LOGIN & REGISTRATION GATE OVERLAY
       ========================================================================== -->
  <div id="login-overlay">
    <!-- Top-Left Floating Back to Website Button -->
    <a href="index.php" class="auth-screen-back-btn" id="auth-screen-back-btn" title="Back to Public Website">
      <span class="auth-back-arrow">←</span>
      <span class="auth-back-text" data-i18n-admin="btnBackToHome">Back to Website</span>
    </a>

    <div class="login-box">
      
      <!-- Auth Switcher Tabs (Sign In / Register) -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 8px;">
        <div class="auth-tabs" id="auth-tab-bar" style="margin-bottom: 0; flex: 1;">
        <button type="button" class="auth-tab-btn active" id="btn-tab-login" onclick="switchAuthMode('login')" data-i18n-admin="tabSignIn">Sign In</button>
        <button type="button" class="auth-tab-btn" id="btn-tab-register" onclick="switchAuthMode('register')" data-i18n-admin="tabRegisterOfficer">Register Officer</button>
      </div>
      <div class="auth-lang-pills" id="login-auth-lang-pills">
        <button type="button" class="auth-lang-btn" data-lang="en" onclick="setDashboardLanguage('en')">EN</button>
        <button type="button" class="auth-lang-btn" data-lang="si" onclick="setDashboardLanguage('si')">සිං</button>
        <button type="button" class="auth-lang-btn" data-lang="ta" onclick="setDashboardLanguage('ta')">தம</button>
      </div>
      </div>


      <!-- VIEW 1: SIGN IN FORM -->
      <div class="auth-view active" id="auth-view-login">
        <div class="login-crest">🛡️</div>
        <h1 class="login-title" data-i18n-admin="loginGateTitle">NWP Executive Gate</h1>
        <p class="login-desc">Chief Secretariat – North Western Province<br>Central Content & Operations CMS</p>
        
        <form id="login-form" onsubmit="handleLoginSubmit(event)" class="auth-form-flex">
          <div style="margin: auto 0; width: 100%; padding: 8px 0;">
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label" for="login-username" data-i18n-admin="lblUsername">Username</label>
              <input type="text" id="login-username" class="form-control" placeholder="Enter username" required autocomplete="username">
            </div>
            
            <div class="form-group" style="margin-bottom: 14px;">
              <label class="form-label" for="login-password" data-i18n-admin="lblPassword">Password</label>
              <div class="password-input-wrap">
                <input type="password" id="login-password" class="form-control" placeholder="Enter password" required autocomplete="current-password">
                <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('login-password', this)" title="Show/Hide Password" aria-label="Toggle Password Visibility">👁️</button>
              </div>
              <div class="auth-sub-row" style="margin-top: 6px; justify-content: flex-end;">
                <a class="auth-link" onclick="openForgotPasswordModal()" data-i18n-admin="authForgotPassword">Forgot Password?</a>
              </div>
            </div>


            <button type="submit" class="btn-login-submit" id="btn-login-submit" style="margin-top: 10px;">
              <span data-i18n-admin="btnAuthSession">Authenticate Session</span> ➔
            </button>


            <div class="login-alert" id="login-error-msg">
              Invalid username or password. Please try again.
            </div>
          </div>


          <div class="auth-footer-link" style="margin-top: auto; padding-top: 8px;">
            <span data-i18n-admin="loginPromptNewStaff">New secretariat staff?</span> <a class="auth-link" onclick="switchAuthMode('register')" data-i18n-admin="loginLinkCreateAccount">Create an account</a>
          </div>
        </form>
      </div>


      <!-- VIEW 2: REGISTER OFFICER FORM (Compact 2-Column Layout) -->
      <div class="auth-view" id="auth-view-register">
        <div class="login-crest" style="background:linear-gradient(135deg, var(--pill-coral), var(--pill-amber));">✍️</div>
        <h1 class="login-title" data-i18n-admin="regGateTitle">Officer Registration</h1>
        <p class="login-desc">North Western Provincial Council • Request administrative publishing access</p>


        <form id="register-form" onsubmit="handleRegisterSubmit(event)" class="auth-form-flex">
          <div style="margin: auto 0; width: 100%;">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="reg-fullname" data-i18n-admin="lblFullName">Full Name</label>
                <input type="text" id="reg-fullname" class="form-control" placeholder="e.g. K.M. Bandara" required>
              </div>


              <div class="form-group">
                <label class="form-label" for="reg-username" data-i18n-admin="lblOfficialUsername">Official Username</label>
                <input type="text" id="reg-username" class="form-control" placeholder="e.g. kbandara_admin" required autocomplete="username">
              </div>
            </div>


            <div class="form-group">
              <label class="form-label" for="reg-division" data-i18n-admin="lblAssignedUnit">Assigned Unit (Chief Secretariat)</label>
              <select id="reg-division" class="form-control" required>
                <option value="" disabled selected>-- Select Assigned Unit --</option>
                <optgroup label="🏛️ Administration Division">
                  <option value="1" data-parent-id="1" data-unit-name="Administration Division">Administration Division</option>
                  <option value="101" data-parent-id="1" data-unit-name="Establishment Office">Establishment Office (Administration Division)</option>
                  <option value="102" data-parent-id="1" data-unit-name="Statistical Unit">Statistical Unit (Administration Division)</option>
                  <option value="103" data-parent-id="1" data-unit-name="Legal Unit">Legal Unit (Administration Division)</option>
                  <option value="104" data-parent-id="1" data-unit-name="Accounts Unit">Accounts Unit (Administration Division)</option>
                  <option value="105" data-parent-id="1" data-unit-name="Digital Division (ICT + GIS)">Digital Division (ICT + GIS) (Administration Division)</option>
                  <option value="106" data-parent-id="1" data-unit-name="Translation Unit">Translation Unit (Administration Division)</option>
                </optgroup>
              </select>
            </div>


            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="reg-phone" data-i18n-admin="lblPhone">Official Contact No (Phone)</label>
                <input type="tel" id="reg-phone" class="form-control" placeholder="e.g. +94 37 222 3451">
              </div>


              <div class="form-group">
                <label class="form-label" for="reg-email" data-i18n-admin="lblEmail">Official Email Address</label>
                <input type="email" id="reg-email" class="form-control" placeholder="e.g. officer@nw.gov.lk">
              </div>
            </div>


            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="reg-password" data-i18n-admin="lblCreatePassword">Create Password</label>
                <div class="password-input-wrap">
                  <input type="password" id="reg-password" class="form-control" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password">
                  <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('reg-password', this)" title="Show/Hide Password" aria-label="Toggle Password Visibility">👁️</button>
                </div>
              </div>


              <div class="form-group">
                <label class="form-label" for="reg-confirm-password" data-i18n-admin="lblConfirmPassword">Confirm Password</label>
                <div class="password-input-wrap">
                  <input type="password" id="reg-confirm-password" class="form-control" placeholder="Re-enter password" required minlength="6" autocomplete="new-password">
                  <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('reg-confirm-password', this)" title="Show/Hide Password" aria-label="Toggle Password Visibility">👁️</button>
                </div>
              </div>
            </div>


            <button type="submit" class="btn-login-submit" id="btn-reg-submit" style="background:linear-gradient(135deg, var(--pill-navy), #3D4A88); margin-top: 10px;">
              <span data-i18n-admin="btnSubmitRegistration">Submit Registration</span> ➔
            </button>


            <div class="login-alert" id="reg-error-msg"></div>
          </div>


          <div class="auth-footer-link" style="margin-top: auto; padding-top: 8px;">
            <span data-i18n-admin="regPromptHaveAccount">Already have an account?</span> <a class="auth-link" onclick="switchAuthMode('login')" data-i18n-admin="regLinkSignIn">Sign In</a>
          </div>
        </form>
      </div>


      <!-- VIEW 3: FORGOT PASSWORD RECOVERY -->
      <div class="auth-view" id="auth-view-forgot">
        <div class="login-crest" style="background:linear-gradient(135deg, var(--pill-amber), #FFAE61);">🔑</div>
        <h1 class="login-title">Password Recovery</h1>
        <p class="login-desc">Chief Secretariat IT Helpdesk • NWPC Complex, Kurunegala</p>


        <form id="forgot-form" onsubmit="handleForgotSubmit(event)" class="auth-form-flex">
          <div style="margin: auto 0; width: 100%;">
            <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:10px 14px; text-align:left; font-size:0.78rem; color:var(--text-subtle); line-height:1.4; margin-bottom:12px;">
              <div style="font-weight:700; color:var(--text-main); margin-bottom:2px;">Direct IT Assistance Hotline:</div>
              <div>📞 <strong>+94 37 223 1769</strong> &nbsp;|&nbsp; ✉️ <strong>csnwp@sltnet.lk</strong></div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">Office Hours: Mon - Fri (8:30 AM - 4:15 PM)</div>
            </div>


            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="forgot-username">Registered Username</label>
                <input type="text" id="forgot-username" class="form-control" placeholder="Enter username" required>
              </div>


              <div class="form-group">
                <label class="form-label" for="forgot-phone">Official Phone or Email</label>
                <input type="text" id="forgot-phone" class="form-control" placeholder="e.g. +94 77 123 4567 or email" required>
              </div>
            </div>


            <div class="form-grid-2" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label" for="forgot-new-password">New Password</label>
                <div class="password-input-wrap">
                  <input type="password" id="forgot-new-password" class="form-control" placeholder="Min. 6 characters" minlength="6" required>
                  <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('forgot-new-password', this)" title="Show/Hide">👁️</button>
                </div>
              </div>


              <div class="form-group">
                <label class="form-label" for="forgot-confirm-password">Confirm Password</label>
                <div class="password-input-wrap">
                  <input type="password" id="forgot-confirm-password" class="form-control" placeholder="Re-type password" minlength="6" required>
                  <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('forgot-confirm-password', this)" title="Show/Hide">👁️</button>
                </div>
              </div>
            </div>


            <button type="submit" class="btn-login-submit" id="btn-forgot-submit" style="background:var(--pill-amber); margin-top: 12px;">
              <span>Reset Password & Authenticate</span> ➔
            </button>


            <div class="login-alert" id="forgot-msg" style="background:#ECFDF5; color:var(--accent-green);"></div>
          </div>


          <div class="auth-footer-link" style="margin-top: auto; padding-top: 8px;">
            <a class="auth-link" onclick="switchAuthMode('login')">← Back to Sign In</a>
          </div>
        </form>
      </div>


    </div>
  </div>


  <!-- Mobile Sidebar Backdrop -->
  <div class="sidebar-backdrop" id="sidebar-backdrop" onclick="toggleMobileSidebar(false)"></div>


  <!-- ==========================================================================
       MAIN APP CANVAS (2-COLUMN MODERN DASHBOARD)
       ========================================================================== -->
  <div id="app-canvas">


    <!-- 1. LEFT SIDEBAR (Matching Reference Design) -->
    <aside class="app-sidebar" id="app-sidebar">
      <!-- Top Section: Province Emblem & Council Titles -->
      <div class="sidebar-header-centered">
        <button class="btn-close-sidebar" onclick="toggleMobileSidebar(false)" aria-label="Close Menu">✕</button>
        <div class="sidebar-emblem-wrap">
          <img src="logo.jpg" alt="Province Emblem" class="sidebar-emblem-img">
        </div>
        <div class="sidebar-council-title" data-i18n-admin="councilTitle">NORTH WESTERN PROVINCIAL COUNCIL</div>
        <div class="sidebar-council-sub" data-i18n-admin="councilSub">NORTH WESTERN PROVINCE</div>
      </div>


      <!-- User Profile & Role Card (Matching Reference Design) -->
      <div class="sidebar-user-card" onclick="openCurrentUserModal()" title="View / Edit Profile & Security">
        <div class="sidebar-user-avatar-wrap">
          <img src="logo.jpg" alt="Profile" class="sidebar-user-avatar" id="sidebar-user-avatar">
        </div>
        <div class="sidebar-user-meta">
          <div class="sidebar-user-name" id="sidebar-user-fullname">Chief Secretary (Super Admin)</div>
          <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
            <div class="sidebar-user-badge" id="sidebar-user-badge">👑 SUPER ADMIN</div>
          </div>
          <div class="sidebar-user-category" id="sidebar-user-category" title="Assigned Unit / Category">
            <span id="sidebar-user-category-icon">🏛️</span>
            <span class="sidebar-user-category-text" id="sidebar-user-category-text">Chief Secretariat</span>
          </div>
        </div>
      </div>


      <!-- Navigation Menu Groups -->
      <ul class="nav-menu">
        <!-- Group 1: Operations -->
        <li class="nav-item" id="nav-item-overview">
          <button class="nav-btn active" onclick="switchAdminTab('view-overview', this)">
            <span class="nav-icon">📊</span>
            <span data-i18n-admin="navOverview" id="nav-label-overview">Dashboard</span>
          </button>
        </li>
        <li class="nav-item" id="nav-item-documents">
          <button class="nav-btn" onclick="switchAdminTab('view-documents', this)">
            <span class="nav-icon">📑</span>
            <span data-i18n-admin="navDocuments" id="nav-label-documents">All Wayamba Directives</span>
          </button>
        </li>
        <li class="nav-item" id="nav-item-publish-quick">
          <button class="nav-btn" onclick="openAddDocModal()">
            <span class="nav-icon">➕</span>
            <span data-i18n-admin="navPublishNew">Publish New Directive</span>
          </button>
        </li>
        <li class="nav-item" id="nav-item-announcements">
          <button class="nav-btn" onclick="switchAdminTab('view-announcements', this)">
            <span class="nav-icon">📢</span>
            <span data-i18n-admin="navAlerts" id="nav-label-alerts">Home Notices & Alerts</span>
          </button>
        </li>
        <li class="nav-item" id="nav-item-inquiries">
          <button class="nav-btn" onclick="switchAdminTab('view-inquiries', this)">
            <span class="nav-icon">📥</span>
            <span data-i18n-admin="navInquiries">Citizen Inquiries</span>
            <span class="nav-badge" id="sidebar-inq-count" style="background:var(--pill-amber);">0</span>
          </button>
        </li>


        <li class="sidebar-nav-divider" id="sidebar-divider-group2"></li>


        <!-- Group 2: Administration & Services (Super Admin Only) -->
        <li class="nav-item" id="nav-item-users">
          <button class="nav-btn" onclick="switchAdminTab('view-users', this)">
            <span class="nav-icon">👥</span>
            <span data-i18n-admin="navUsers">Council Users</span>
          </button>
        </li>
        <li class="nav-item" id="nav-item-divisions">
          <button class="nav-btn" onclick="switchAdminTab('view-divisions', this)">
            <span class="nav-icon">🏛️</span>
            <span data-i18n-admin="navDivisions">Departments</span>
          </button>
        </li>
                <li class="nav-item" id="nav-item-eservices">
          <button class="nav-btn" onclick="switchAdminTab('view-eservices', this)">
            <span class="nav-icon">🌐</span>
            <span data-i18n-admin="navDivisionPortals">Division Web Portals</span>
          </button>
        </li>
        <li class="nav-item" id="nav-item-projects">
          <button class="nav-btn" onclick="switchAdminTab('view-projects', this)">
            <span class="nav-icon">🚀</span>
            <span data-i18n-admin="navProjects" id="nav-label-projects">Provincial Projects</span>
          </button>
        </li>


        <li class="sidebar-nav-divider sidebar-nav-divider-bottom" id="sidebar-divider-group3"></li>


        <!-- Group 3: Profile & Sign Out -->
        <li class="nav-item" id="nav-item-profile">
          <button class="nav-btn" onclick="switchAdminTab('view-profile', this)">
            <span class="nav-icon">🪪</span>
            <span data-i18n-admin="navProfileSec" id="nav-label-profile">My Profile & Security</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-btn" onclick="window.open('index.php', '_blank')">
            <span class="nav-icon">🌐</span>
            <span data-i18n-admin="launchSite">Live Public Portal</span>
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-btn nav-btn-signout" onclick="handleLogout()">
            <span class="nav-icon">🚪</span>
            <span data-i18n-admin="btnSignOut">Sign Out</span>
          </button>
        </li>
      </ul>
    </aside>


    <!-- 2. CENTER MAIN DASHBOARD -->
    <main class="app-main">


      <!-- Mobile Top Bar with Hamburger Menu (Visible on mobile/tablets < 900px) -->
      <div class="mobile-header-bar">
        <button class="btn-hamburger" onclick="toggleMobileSidebar(true)" aria-label="Open Navigation">☰</button>
        <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
          <span>🏛️</span> NWP Admin
        </div>
        <!-- Mobile Language Selector -->
        <div class="mobile-lang-select-wrap">
          <select id="mobile-lang-select" onchange="setDashboardLanguage(this.value)" class="mobile-lang-select" aria-label="Dashboard Language">
            <option value="en">🇬🇧 EN</option>
            <option value="si">🇱🇰 සිංහල</option>
            <option value="ta">🇱🇰 தமிழ்</option>
          </select>
        </div>
        <button class="icon-action-btn" title="Logout Session" onclick="handleLogout()" style="width: 34px; height: 34px;">
          🚪
        </button>
      </div>


      <!-- Main Top Bar (Matching Reference Design 1) -->
      <header class="main-topbar">
        <div class="view-title-group">
          <h2 id="top-view-title" class="topbar-welcome-title">
            Welcome, <span id="top-user-greeting">Chief Secretary</span> 👋
          </h2>
          <p id="top-view-sub" class="topbar-welcome-sub" data-i18n-admin="councilCentralSec">Council Central Secretariat</p>
        </div>


        <div class="topbar-actions">
          <!-- 1. Language Dropdown Pill -->
          <div class="topbar-lang-pill-wrap" id="topbar-lang-pill-wrap">
            <button type="button" class="topbar-lang-pill-btn" onclick="toggleTopLangDropdown(event)" aria-label="Select Language">
              <span class="lang-globe-icon">🌐</span>
              <span id="topbar-active-lang-text">English</span>
              <span class="topbar-chevron">⌵</span>
            </button>
            <div class="topbar-lang-dropdown-menu" id="topbar-lang-dropdown-menu">
              <button type="button" class="topbar-lang-menu-opt" onclick="setDashboardLanguage('en'); closeTopLangDropdown();">
                <span>🇬🇧</span> <span>English</span>
              </button>
              <button type="button" class="topbar-lang-menu-opt" onclick="setDashboardLanguage('si'); closeTopLangDropdown();">
                <span>🇱🇰</span> <span>සිංහල</span>
              </button>
              <button type="button" class="topbar-lang-menu-opt" onclick="setDashboardLanguage('ta'); closeTopLangDropdown();">
                <span>🇱🇰</span> <span>தமிழ்</span>
              </button>
            </div>
          </div>


          <!-- 2. User Profile Pill -->
          <button type="button" class="topbar-profile-pill" onclick="openCurrentUserModal()" title="View / Edit Profile">
            <img src="logo.jpg" alt="User" class="topbar-profile-avatar" id="topbar-user-avatar">
            <span class="topbar-profile-name" id="user-display-name">Chief Secretary (Super Adminis...</span>
          </button>


          <!-- 3. Sign Out Pill Button -->
          <button type="button" class="topbar-signout-pill" onclick="handleLogout()" title="Sign Out">
            <svg class="signout-power-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
            <span data-i18n-admin="btnSignOut">Sign Out</span>
          </button>
        </div>
      </header>


      


      <!-- ======================================================================
           VIEW 1: OVERVIEW DASHBOARD (Charts & Milestones from Image)
           ====================================================================== -->
      <div id="view-overview" class="content-view active">
        
        <!-- 4 3D CLAYMORPHIC GRADIENT METRIC CARDS (Direct from reference image) -->
      <section class="metric-pills-grid">
        <!-- Card 1 (Blue): Circulars & Rate Books -->
        <div class="metric-pill-card card-blue">
          <div class="pill-card-content">
            <div>
              <div class="pill-card-val" id="metric-docs-count">0</div>
              <div class="pill-card-label" data-i18n-admin="metricDocs">Circulars & Rate Books</div>
              <div class="pill-card-sub">Official gazettes, circulars & rate books</div>
            </div>
            <button class="pill-card-btn" onclick="switchAdminTab('view-documents', null)">
              <span>Manage</span> ➔
            </button>
          </div>
          <!-- 3D Clay Cylinders SVG -->
          <svg class="clay-3d-graphic" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="discGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFDF5" />
                <stop offset="50%" stop-color="#FDE68A" />
                <stop offset="100%" stop-color="#F59E0B" />
              </linearGradient>
              <linearGradient id="discGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="60%" stop-color="#FEF3C7" />
                <stop offset="100%" stop-color="#FBBF24" />
              </linearGradient>
            </defs>
            <!-- Bottom Disc -->
            <g>
              <path d="M22 66 C22 58 78 58 78 66 L78 74 C78 82 22 82 22 74 Z" fill="#78350F" opacity="0.6"/>
              <ellipse cx="50" cy="66" rx="28" ry="9" fill="url(#discGrad1)" />
              <path d="M22 66 C22 74 78 74 78 66 L78 72 C78 80 22 80 22 72 Z" fill="#B45309" opacity="0.35"/>
            </g>
            <!-- Middle Disc -->
            <g>
              <path d="M22 48 C22 40 78 40 78 48 L78 56 C78 64 22 64 22 56 Z" fill="#B45309" opacity="0.5"/>
              <ellipse cx="50" cy="48" rx="28" ry="9" fill="url(#discGrad2)" />
              <path d="M22 48 C22 56 78 56 78 48 L78 54 C78 62 22 62 22 54 Z" fill="#D97706" opacity="0.25"/>
            </g>
            <!-- Top Disc -->
            <g>
              <path d="M22 30 C22 22 78 22 78 30 L78 38 C78 46 22 46 22 38 Z" fill="#FDE68A" opacity="0.4"/>
              <ellipse cx="50" cy="30" rx="28" ry="9" fill="#FFFFFF" />
              <ellipse cx="50" cy="30" rx="26" ry="8" fill="url(#discGrad2)" />
              <ellipse cx="46" cy="28" rx="18" ry="4.5" fill="#FFFFFF" opacity="0.8"/>
            </g>
          </svg>
        </div>


        <!-- Card 2 (Cyan): Citizen Inquiries -->
        <div class="metric-pill-card card-cyan">
          <div class="pill-card-content">
            <div>
              <div class="pill-card-val" id="metric-inquiries-count">0</div>
              <div class="pill-card-label" data-i18n-admin="metricInquiries">Citizen Inquiries</div>
              <div class="pill-card-sub">Public inquiries & petitions</div>
            </div>
            <button class="pill-card-btn" onclick="switchAdminTab('view-inquiries', null)">
              <span>Review</span> ➔
            </button>
          </div>
          <!-- 3D Stacked Sheets SVG -->
          <svg class="clay-3d-graphic" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sheetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFBEB" />
                <stop offset="100%" stop-color="#FDE68A" />
              </linearGradient>
              <linearGradient id="sheetGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#FEF3C7" />
              </linearGradient>
            </defs>
            <!-- Bottom Sheet -->
            <g transform="translate(0, 22)">
              <path d="M50 48 L78 35 L50 22 L22 35 Z" fill="#78350F" opacity="0.4"/>
              <path d="M50 56 L78 43 L50 30 L22 43 Z" fill="url(#sheetGrad1)" />
            </g>
            <!-- Middle Sheet -->
            <g transform="translate(0, 10)">
              <path d="M50 48 L78 35 L50 22 L22 35 Z" fill="#92400E" opacity="0.3"/>
              <path d="M50 56 L78 43 L50 30 L22 43 Z" fill="url(#sheetGrad1)" />
            </g>
            <!-- Top Sheet -->
            <g transform="translate(0, -2)">
              <path d="M50 56 L78 43 L50 30 L22 43 Z" fill="url(#sheetGrad2)" />
              <path d="M50 30 L76 42 L50 54 L24 42 Z" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.8" fill="none"/>
            </g>
          </svg>
        </div>


        <!-- Card 3 (Violet/Wine): Live Announcements -->
        <div class="metric-pill-card card-violet">
          <div class="pill-card-content">
            <div>
              <div class="pill-card-val" id="metric-announcements-count">0</div>
              <div class="pill-card-label" data-i18n-admin="metricAnnouncements">Live Announcements</div>
              <div class="pill-card-sub" data-i18n-admin="metricAnnouncementsSub">Public broadcasts & urgent notices</div>
            </div>
            <button class="pill-card-btn" onclick="switchAdminTab('view-announcements', null)">
              <span data-i18n-admin="btnBroadcast">Broadcast</span> ➔
            </button>
          </div>
          <!-- 3D Sphere SVG -->
          <svg class="clay-3d-graphic" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sphereGrad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="30%" stop-color="#FCE7F3" />
                <stop offset="70%" stop-color="#BE185D" />
                <stop offset="100%" stop-color="#4C0519" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="30" fill="url(#sphereGrad)" />
            <ellipse cx="50" cy="52" rx="40" ry="13" stroke="#FDE68A" stroke-width="3" stroke-dasharray="140" stroke-dashoffset="25" stroke-linecap="round" fill="none" transform="rotate(-25 50 52)" opacity="0.9"/>
            <ellipse cx="50" cy="52" rx="40" ry="13" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" fill="none" transform="rotate(-25 50 52)" opacity="0.45"/>
            <ellipse cx="40" cy="38" rx="8" ry="4.5" fill="#FFFFFF" opacity="0.7" transform="rotate(-30 40 38)"/>
          </svg>
        </div>


        <!-- Card 4 (Mint Green): Secretariat Divisions -->
        <div class="metric-pill-card card-mint">
          <div class="pill-card-content">
            <div>
              <div class="pill-card-val" id="metric-divisions-count">5</div>
              <div class="pill-card-label" data-i18n-admin="metricDivisions">Secretariat Divisions</div>
              <div class="pill-card-sub" data-i18n-admin="metricDivisionsSub">Provincial statutory units</div>
            </div>
            <button class="pill-card-btn" onclick="switchAdminTab('view-divisions', null)">
              <span data-i18n-admin="btnExplore">Explore</span> ➔
            </button>
          </div>
          <!-- 3D Clover Vortex SVG -->
          <svg class="clay-3d-graphic" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="cloverGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#D1FAE5" />
                <stop offset="40%" stop-color="#A7F3D0" />
                <stop offset="85%" stop-color="#34D399" />
                <stop offset="100%" stop-color="#059669" />
              </radialGradient>
            </defs>
            <path d="M50 16 C62 16 68 28 68 36 C76 36 88 42 88 54 C88 66 76 72 68 72 C68 80 62 92 50 92 C38 92 32 80 32 72 C24 72 12 66 12 54 C12 42 24 36 32 36 C32 28 38 16 50 16 Z" fill="url(#cloverGrad)" />
            <circle cx="50" cy="54" r="14" fill="#047857" opacity="0.4" />
            <circle cx="50" cy="54" r="11" fill="#059669" opacity="0.8" />
            <circle cx="50" cy="54" r="8" fill="#10B981" />
            <path d="M50 28 C58 28 62 38 62 54" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.8" fill="none"/>
            <path d="M68 54 C68 62 58 68 50 68" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-opacity="0.6" fill="none"/>
          </svg>
        </div>
      </section>


        


        <!-- NON-SUPER-ADMIN OFFICER OVERVIEW HUB (Tailored strictly to logged-in user) -->
        <div id="user-overview-section" style="display:none; margin-top: 22px;">
          
          <!-- Row 1: Authorized Officer Profile & Unit Publishing Hub (Tailored for User Admin Profile) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; margin-bottom: 22px;">
            
            <!-- Card 1: Authorized Officer Profile & Unit Credentials -->
            <div class="data-table-card" style="padding: 22px; background:var(--bg-card); border:1px solid var(--border-soft); border-radius:var(--radius-lg); display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--border-soft);">
                  <div>
                    <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0;" data-i18n-admin="officerProfileCardTitle">Officer Profile & Authority</h4>
                    <div style="font-size:0.75rem; color:var(--text-muted);" data-i18n-admin="officerProfileCardSub">Identity, assigned unit & publishing credentials</div>
                  </div>
                  <span class="badge-pill badge-pill-green" style="font-size:0.72rem; padding:3px 10px; font-weight:700;">🟢 Direct Push Active</span>
                </div>

                <!-- Profile Info Row -->
                <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">
                  <div style="position:relative; width:64px; height:64px; flex-shrink:0;">
                    <div id="user-ov-avatar" style="width:64px; height:64px; border-radius:50%; overflow:hidden; border:2.5px solid #ECAC58; background:linear-gradient(135deg, #380000, #6E1212); display:flex; align-items:center; justify-content:center; font-size:1.6rem; color:#fff; box-shadow:0 4px 12px rgba(56,0,0,0.15);">
                      👤
                    </div>
                  </div>
                  <div style="min-width:0; flex:1;">
                    <h3 id="user-ov-name" style="font-size:1.15rem; font-weight:800; color:var(--text-main); margin:0 0 4px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Chamika D Adhikari</h3>
                    <div style="display:flex; align-items:center; flex-wrap:wrap; gap:6px;">
                      <span class="badge-pill badge-pill-navy" id="user-ov-role" style="font-size:0.7rem; padding:2px 8px;">Admin</span>
                      <span class="badge-pill badge-pill-amber" id="user-ov-unit" style="font-size:0.7rem; padding:2px 8px; font-weight:700;">⚖️ Legal Unit</span>
                    </div>
                  </div>
                </div>

                <!-- Unit & Authority Attributes Table -->
                <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; gap:8px; font-size:0.78rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--text-muted);" data-i18n-admin="lblParentDivision">Parent Secretariat:</span>
                    <strong id="user-ov-div" style="color:var(--text-main);">Administration Division</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--text-muted);" data-i18n-admin="lblDesignation">Official Designation:</span>
                    <strong id="user-ov-desig" style="color:var(--text-main);">Provincial Legal Officer</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--text-muted);" data-i18n-admin="lblOfficialEmail">Email:</span>
                    <span id="user-ov-email" style="color:var(--text-main); font-weight:600;">chamikadinisuru2@gmail.com</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--text-muted);" data-i18n-admin="lblOfficialPhone">Contact:</span>
                    <span id="user-ov-phone" style="color:var(--text-main); font-weight:600;">+94 37 222 3451</span>
                  </div>
                </div>
              </div>

              <!-- Card Action Button -->
              <div style="margin-top:16px;">
                <button class="btn-table-action" onclick="switchAdminTab('view-profile', null)" style="width:100%; justify-content:center; padding:8px 12px; font-weight:700;">
                  <span>⚙️</span> <span data-i18n-admin="btnManageProfileCredentials">Edit Profile & Credentials</span> ➔
                </button>
              </div>
            </div>

            <!-- Card 2: Unit Publishing Activity & Quick Direct Actions -->
            <div class="data-table-card" style="padding: 22px; background:var(--bg-card); border:1px solid var(--border-soft); border-radius:var(--radius-lg); display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--border-soft);">
                  <div>
                    <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0;" data-i18n-admin="unitPublishingCardTitle">My Unit Publishing Hub</h4>
                    <div style="font-size:0.75rem; color:var(--text-muted);" data-i18n-admin="unitPublishingCardSub">Directives, homepage articles & live citizen portal updates</div>
                  </div>
                  <span class="badge-pill badge-pill-navy" id="user-ov-active-badge" data-i18n-admin="livePortalBadge">Live Sync</span>
                </div>

                <!-- 3 Key Metric Tiles -->
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:16px;">
                  
                  <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:12px 10px; text-align:center;">
                    <div style="font-size:1.35rem; font-weight:900; color:#800000; line-height:1.1;" id="user-ov-doc-count">0</div>
                    <div style="font-size:0.7rem; font-weight:700; color:var(--text-main); margin-top:4px;" data-i18n-admin="metricDirectivesShort">Directives</div>
                    <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;" id="user-ov-doc-types">Circulars & Forms</div>
                  </div>

                  <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:12px 10px; text-align:center;">
                    <div style="font-size:1.35rem; font-weight:900; color:#0891B2; line-height:1.1;" id="user-ov-proj-count">0</div>
                    <div style="font-size:0.7rem; font-weight:700; color:var(--text-main); margin-top:4px;" data-i18n-admin="metricArticlesShort">Articles</div>
                    <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">Homepage</div>
                  </div>

                  <div style="background:var(--bg-panel); border:1px solid var(--border-soft); border-radius:10px; padding:12px 10px; text-align:center;">
                    <div style="font-size:1.35rem; font-weight:900; color:#059669; line-height:1.1;" id="user-ov-ann-count">0</div>
                    <div style="font-size:0.7rem; font-weight:700; color:var(--text-main); margin-top:4px;" data-i18n-admin="metricAlertsShort">Alerts</div>
                    <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">Live Banner</div>
                  </div>

                </div>

                <!-- Direct Publishing Guarantee Banner -->
                <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; padding:10px 14px; margin-bottom:16px; font-size:0.75rem; color:#166534; line-height:1.4; display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1rem;">⚡</span>
                  <div data-i18n-admin="directPublishGuarantee">Saved items are published immediately to the public portal without prior secretariat review.</div>
                </div>
              </div>

              <!-- Direct Action Buttons Row -->
              <div style="display:flex; gap:10px;">
                <button class="btn-create-action" onclick="openAddDocModal()" style="flex:1; justify-content:center; padding:9px 12px; font-size:0.8rem; font-weight:700;">
                  <span>➕</span> <span data-i18n-admin="btnUploadDirective">Upload Directive</span>
                </button>
                <button class="btn-create-action" onclick="openAddProjectModal()" style="flex:1; justify-content:center; padding:9px 12px; font-size:0.8rem; font-weight:700; background:linear-gradient(135deg, #0891B2, #0E7490);">
                  <span>🚀</span> <span data-i18n-admin="btnPublishArticle">Add Article</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Row 2: Recent Directives & Homepage Articles -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px;">
            
            <!-- Card 1: My Recent Directives / Documents -->
            <div class="data-table-card" style="padding: 20px; background:var(--bg-card); border:1px solid var(--border-soft); border-radius:var(--radius-lg);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid var(--border-soft);">
                <div>
                  <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0;" data-i18n-admin="userRecentDocsTitle">📑 My Uploaded Documents</h4>
                  <div style="font-size:0.75rem; color:var(--text-muted);" data-i18n-admin="userRecentDocsSub">Directives and files uploaded by your account</div>
                </div>
                <button class="btn-create-action" onclick="openAddDocModal()" style="padding:6px 14px; font-size:0.78rem;">
                  <span>➕</span> <span data-i18n-admin="btnUpload">Upload</span>
                </button>
              </div>
              <div id="user-recent-docs-list" style="display:flex; flex-direction:column; gap:8px;">
                <!-- Dynamically populated -->
              </div>
              <div style="margin-top:14px; text-align:center;">
                <button class="btn-table-action" onclick="switchAdminTab('view-documents', null)" style="width:100%; justify-content:center; padding:8px 12px; font-weight:600;" data-i18n-admin="btnViewAllMyDocs">View All My Documents ➔</button>
              </div>
            </div>


            <!-- Card 2: My Published Homepage Articles & Projects -->
            <div class="data-table-card" style="padding: 20px; background:var(--bg-card); border:1px solid var(--border-soft); border-radius:var(--radius-lg);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid var(--border-soft);">
                <div>
                  <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0;" data-i18n-admin="userRecentProjectsTitle">🚀 My Homepage Articles</h4>
                  <div style="font-size:0.75rem; color:var(--text-muted);" data-i18n-admin="userRecentProjectsSub">Articles published to "පළාත් සංවර්ධන ව්‍යාපෘති" section</div>
                </div>
                <button class="btn-create-action" onclick="openAddProjectModal()" style="padding:6px 14px; font-size:0.78rem;">
                  <span>➕</span> <span data-i18n-admin="btnAddArticle">Add Article</span>
                </button>
              </div>
              <div id="user-recent-projects-list" style="display:flex; flex-direction:column; gap:8px;">
                <!-- Dynamically populated -->
              </div>
              <div style="margin-top:14px; text-align:center;">
                <button class="btn-table-action" onclick="switchAdminTab('view-projects', null)" style="width:100%; justify-content:center; padding:8px 12px; font-weight:600;" data-i18n-admin="btnViewAllMyProjects">View All My Articles ➔</button>
              </div>
            </div>


          </div>
        </div>


        <!-- SUPER ADMIN OVERVIEW HUB (Matching User Dashboard Standard & Council-Wide Live Activity) -->
        <div id="superadmin-overview-section" style="display:none; margin-top: 22px;">
          
          <!-- Row 1: Charts (2 Columns: Pie / Donut Chart & Bar Chart) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; margin-bottom: 22px;">
            
            <!-- Card 1: Directives & Publications Distribution (Donut / Pie Chart) -->
            <div class="data-table-card" style="padding: 20px; background:var(--bg-card); border:1px solid var(--border-soft); border-radius:var(--radius-lg);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid var(--border-soft);">
                <div>
                  <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0;" data-i18n-admin="chartPieTitle">Directives by Classification</h4>
                  <div style="font-size:0.75rem; color:var(--text-muted);" data-i18n-admin="chartPieSub">Distribution of publications by category & type</div>
                </div>
                <span class="badge-pill badge-pill-navy live-count-badge" data-i18n-admin="liveDistBadge">Live Distribution</span>
              </div>
              <div class="chart-container-pie" style="height: 250px; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <canvas id="chart-directives-pie" style="max-height: 185px; width: 100%;"></canvas>
                <div id="pie-chart-legend" style="display:flex; flex-wrap:wrap; justify-content:center; gap:6px 14px; margin-top:10px; width:100%; font-size:0.75rem;"></div>
              </div>
            </div>


            <!-- Card 2: Circulars & Directives by Division (Bar Chart Analytics) -->
            <div class="data-table-card" style="padding: 20px; background:var(--bg-card); border:1px solid var(--border-soft); border-radius:var(--radius-lg);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid var(--border-soft);">
                <div>
                  <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0;" data-i18n-admin="chartDivTitle">Circulars by Division</h4>
                  <div style="font-size:0.75rem; color:var(--text-muted);" data-i18n-admin="chartDivSub">Document publication volume across secretariats</div>
                </div>
                <span class="badge-pill badge-pill-navy live-count-badge" data-i18n-admin="liveCountBadge">Live Count</span>
              </div>
              <div class="chart-container-bar" style="height: 250px;">
                <canvas id="chart-divisions-bar"></canvas>
              </div>
            </div>


          </div>


          <!-- Row 2: Council Directives & Publications (Full-Width Card Below Both Charts) -->
          <div class="data-table-card" style="padding: 20px; background:var(--bg-card); border:1px solid var(--border-soft); border-radius:var(--radius-lg); margin-bottom: 22px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid var(--border-soft);">
              <div>
                <h4 style="font-size:0.95rem; font-weight:800; color:var(--text-main); margin:0;" data-i18n-admin="superRecentDocsTitle">📑 Council Directives & Publications</h4>
                <div style="font-size:0.75rem; color:var(--text-muted);" data-i18n-admin="superRecentDocsSub">Directives published across all secretariat divisions</div>
              </div>
              <button class="btn-create-action" onclick="openAddDocModal()" style="padding:6px 14px; font-size:0.78rem;">
                <span>➕</span> <span data-i18n-admin="btnPublish">Publish</span>
              </button>
            </div>
            <div id="superadmin-recent-docs-list" style="display:flex; flex-direction:column; gap:8px;">
              <!-- Dynamically populated -->
            </div>
            <div style="margin-top:14px; text-align:center;">
              <button class="btn-table-action" onclick="switchAdminTab('view-documents', null)" style="width:100%; justify-content:center; padding:8px 12px; font-weight:600;" data-i18n-admin="btnViewAllDocs">View All Wayamba Directives ➔</button>
            </div>
          </div>


        </div>


      </div>


      <div id="view-documents" class="content-view">
        <div class="data-table-card">
          <div class="table-toolbar">
            <div class="table-filters">
              <input type="text" id="search-circulars-input" class="form-control" style="min-width: 130px; max-width: 200px; flex: 1 1 160px; padding: 7px 12px; font-size: 0.83rem;" placeholder="Search circulars..." oninput="filterAdminDocs(this.value)">
              
              <select class="select-pill" id="filter-doc-division" onchange="filterAdminDocs()">
                <option value="" data-i18n-admin="optAllDivisions">All Divisions</option>
                <!-- Populated dynamically -->
              </select>


              <select class="select-pill" id="filter-doc-type" onchange="filterAdminDocs()">
                <option value="" data-i18n-admin="optAllTypes">All Types</option>
                <option value="Circular" data-i18n-admin="optCircular">Circular</option>
                <option value="Publication" data-i18n-admin="optPublication">Publication / Rate Book</option>
                <option value="Application" data-i18n-admin="optApplication">Application / Form</option>
                <option value="Report" data-i18n-admin="optReport">Report / Gazette</option>
              </select>
            </div>


            <button class="btn-create-action" onclick="openAddDocModal()">
              <span>➕</span> <span data-i18n-admin="btnAddDoc">Add New Document</span>
            </button>
          </div>


          <div class="custom-table-responsive">
            <table class="clean-table">
              <thead>
                <tr>
                  <th data-i18n-admin="thDocTitle">Title & Subject</th>
                  <th data-i18n-admin="thDocDivision">Division</th>
                  <th data-i18n-admin="thDocType">Type</th>






                  <th style="text-align: right;" data-i18n-admin="thAction">Action</th>
                </tr>
              </thead>
              <tbody id="admin-docs-table-body">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>
      </div>


      <!-- ======================================================================
           VIEW 3: DIVISIONS & KEY OFFICIALS
           ====================================================================== -->
      <div id="view-divisions" class="content-view">
        <div class="data-table-card">
          <div class="table-toolbar">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 800;" data-i18n-admin="divisionsHeaderTitle">Secretarial Divisions & Key Officials</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted);" data-i18n-admin="divisionsHeaderSub">Manage Deputy Chief Secretaries, sub-units, and division descriptions</p>
            </div>
            <button class="btn-create-action" onclick="openCreateDivisionModal()">
              <span>🏛️</span> <span data-i18n-admin="btnCreateDivision">Add Division / Sub-Division</span>
            </button>
          </div>


          <div id="admin-divisions-accordion" style="display:flex; flex-direction:column; gap:16px;">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>


      <!-- ======================================================================
           VIEW 4: CITIZEN INQUIRIES INBOX
           ====================================================================== -->
      <div id="view-inquiries" class="content-view">
        <div class="data-table-card">
          <div class="table-toolbar">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 800;">Citizen Inquiries Desk</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted);">Incoming requests submitted with National Identity Card (NIC)</p>
            </div>
            <span class="badge-pill badge-pill-amber" id="inq-total-pill">0 Inquiries</span>
          </div>


          <div class="custom-table-responsive">
            <table class="clean-table">
              <thead>
                <tr>
                  <th data-i18n-admin="thInqDate">Date</th>
                  <th data-i18n-admin="thInqName">Citizen Name</th>
                  <th data-i18n-admin="thInqNic">NIC Number</th>
                  <th data-i18n-admin="thInqContact">Phone / Email</th>
                  <th data-i18n-admin="thInqMessage">Inquiry Message</th>
                  <th style="text-align: right;" data-i18n-admin="thAction">Action</th>
                </tr>
              </thead>
              <tbody id="admin-inquiries-table-body">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>
      </div>


      <!-- ======================================================================
           VIEW 5: ALERTS & ANNOUNCEMENTS
           ====================================================================== -->
      <div id="view-announcements" class="content-view">
        <div class="data-table-card" style="padding: 24px 28px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #380000; margin: 0 0 6px 0;" data-i18n-admin="navAlerts">Live Announcement Marquee Ticker</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">This text scrolls in real-time across the top ribbon of the public portal in 3 languages.</p>
            </div>
            <!-- Auto-Translate All Action Button in header -->
            <button type="button" id="btn-auto-trans-ann" onclick="handleAutoTranslateAnnouncements()" class="btn-auto-trans" style="background: linear-gradient(135deg, #380000, #5B0000); color: #FFF; border: none; padding: 8px 18px; font-size: 0.82rem; font-weight: 700; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(56,0,0,0.25); transition: all 0.15s ease;">
              <span id="auto-trans-icon">✨</span> <span id="auto-trans-text" data-i18n-admin="btnAutoTranslateAll">Auto-Translate All Languages</span>
            </button>
          </div>


          <!-- Smart Translation Informational Banner -->
          <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 10px 14px; margin-bottom: 20px; font-size: 0.78rem; color: #92400E; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.2rem; line-height: 1;">🌐</span>
              <div>
                <strong data-i18n-admin="annSmartTitle">Smart Single-Language Input & Auto-Translation:</strong>
                <span data-i18n-admin="annSmartSub" style="margin-left: 4px;">Type in ANY one language below. Click "Auto-Translate" to instantly convert into Sinhala, English, and Tamil!</span>
              </div>
            </div>
          </div>


          <form onsubmit="handleSaveAnnouncements(event)">
            <div class="form-group" style="margin-bottom: 18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label class="form-label" style="margin:0; font-weight:700;">English Announcement</label>
                <button type="button" onclick="handleAutoTranslateAnnouncements('en')" class="btn-table-action" style="padding: 3px 10px; font-size: 0.72rem; border-radius: 6px; border: 1px solid var(--border-soft); background: var(--bg-canvas); cursor: pointer; color: var(--text-main); font-weight: 600;">
                  ✨ Translate from English
                </button>
              </div>
              <textarea id="edit-ann-en" class="form-control" rows="3" required placeholder="Type announcement in English..."></textarea>
            </div>


            <div class="form-group" style="margin-bottom: 18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label class="form-label" style="margin:0; font-weight:700;">Sinhala Announcement (සිංහල)</label>
                <button type="button" onclick="handleAutoTranslateAnnouncements('si')" class="btn-table-action" style="padding: 3px 10px; font-size: 0.72rem; border-radius: 6px; border: 1px solid var(--border-soft); background: var(--bg-canvas); cursor: pointer; color: var(--text-main); font-weight: 600;">
                  ✨ සිංහලෙන් පරිවර්තනය කරන්න
                </button>
              </div>
              <textarea id="edit-ann-si" class="form-control" rows="3" required placeholder="සිංහලෙන් නිවේදනය ඇතුළත් කරන්න..."></textarea>
            </div>


            <div class="form-group" style="margin-bottom: 22px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label class="form-label" style="margin:0; font-weight:700;">Tamil Announcement (தமிழ்)</label>
                <button type="button" onclick="handleAutoTranslateAnnouncements('ta')" class="btn-table-action" style="padding: 3px 10px; font-size: 0.72rem; border-radius: 6px; border: 1px solid var(--border-soft); background: var(--bg-canvas); cursor: pointer; color: var(--text-main); font-weight: 600;">
                  ✨ தமிழிலிருந்து மொழிபெயர்க்கவும்
                </button>
              </div>
              <textarea id="edit-ann-ta" class="form-control" rows="3" required placeholder="தமிழில் அறிவிப்பை உள்ளிடவும்..."></textarea>
            </div>


            <div style="display:flex; align-items:center; gap:12px;">
              <button type="submit" id="btn-save-ann" class="btn-create-action" style="padding: 10px 24px; font-size: 0.9rem;">
                <span>💾</span> <span data-i18n-admin="btnSaveAnnouncements">Save Live Announcements</span>
              </button>
              <button type="button" onclick="handleAutoTranslateAnnouncements()" class="btn-table-action" style="padding: 9px 18px; font-size: 0.85rem; font-weight: 700; border-radius: 8px; border: 1px solid #CBD5E1; background: #F8FAFC; cursor: pointer; color: #1E293B; display: inline-flex; align-items: center; gap: 6px;">
                <span>✨</span> <span data-i18n-admin="btnAutoTranslateAll">Auto-Translate All Languages</span>
              </button>
              <span id="ann-trans-status" style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;"></span>
            </div>
          </form>
        </div>
      </div>


      <!-- ======================================================================
           VIEW 6: DIVISION WEB PORTALS & LINKS MANAGER
           ====================================================================== -->
      <div id="view-eservices" class="content-view">
        <div class="data-table-card">
          <div class="table-toolbar" style="margin-bottom: 14px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #380000; margin-bottom: 4px;" data-i18n-admin="divPortalsHeaderTitle">Division Web Portals & Links</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;" data-i18n-admin="divPortalsHeaderSub">Manage official public web hyperlinks for statutory divisions and their sub-units</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span id="portals-count-badge" class="badge-pill badge-pill-green" style="font-weight:700; font-size:0.75rem; padding: 5px 12px; display:inline-flex; align-items:center; gap:6px;">
                <span style="width:7px; height:7px; border-radius:50%; background:#10B981; display:inline-block;"></span>
                <span>Active Statutory Divisions</span>
              </span>
              <button class="btn-create-action" onclick="openConfigurePortalModal()">
                <span>➕</span> <span data-i18n-admin="btnSetPortalLink">Configure Portal URL</span>
              </button>
            </div>
          </div>


          <!-- Category Pills & Search Controls -->
          <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; padding:12px 14px; background:#FAF5F5; border:1px solid #EBDCDA; border-radius:12px;">
            <div style="display:flex; flex-wrap:wrap; gap:8px;" id="portals-category-pills">
              <!-- Dynamically populated in admin.js based on language -->
            </div>


            <div style="position:relative; min-width:240px; flex:1; max-width:340px;">
              <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:0.85rem; color:#888;">🔍</span>
              <input type="text" id="search-portals-input" oninput="filterAdminPortals()" placeholder="Search division, sub-unit, or URL..." style="width:100%; padding:6px 12px 6px 32px; border-radius:8px; border:1px solid #DEC5C3; font-size:0.82rem; background:#FFFFFF; outline:none; box-sizing:border-box;">
            </div>
          </div>


          <div class="custom-table-responsive">
            <table class="clean-table">
              <thead>
                <tr>
                  <th data-i18n-admin="thDivision" style="min-width: 190px;">Division</th>
                  <th data-i18n-admin="thPortalScope" style="min-width: 170px;">Target Scope</th>
                  <th data-i18n-admin="thPortalUrl" style="min-width: 220px;">Configured URL (Hyperlink)</th>
                  <th data-i18n-admin="thStatus" style="min-width: 120px;">Public Status</th>
                  <th style="text-align: right; min-width: 140px;" data-i18n-admin="thAction">Action</th>
                </tr>
              </thead>
              <tbody id="admin-portals-table-body">
                <!-- Dynamically populated in admin.js -->
              </tbody>
            </table>
          </div>
        </div>
      </div>


      <!-- ======================================================================
           VIEW 7: PROVINCIAL PROJECTS
           ====================================================================== -->
      <div id="view-projects" class="content-view">
        <div class="data-table-card">
          <div class="table-toolbar">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 800;" data-i18n-admin="projHeaderTitle">Key Provincial Projects</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted);" data-i18n-admin="projHeaderSub">Featured regional development initiatives on the homepage</p>
            </div>
            <button class="btn-create-action" onclick="openAddProjectModal()" id="btn-add-project" style="white-space: nowrap; flex-shrink: 0;">
              <span>➕</span> <span data-i18n-admin="btnAddProject">Add New Project</span>
            </button>
          </div>


          <div id="admin-projects-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>


      <!-- ======================================================================
           VIEW 8: USER MANAGEMENT (Super Admin)
           ====================================================================== -->
      <div id="view-users" class="content-view">
        <div class="data-table-card">
          <div class="table-toolbar">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 800;">Administrator User Accounts</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted);">Manage login credentials, roles (Super Admin, Admin, Editor), and division access</p>
            </div>
            <button class="btn-create-action" onclick="openAddUserModal()">
              <span>➕</span> Create User
            </button>
          </div>


          <div class="custom-table-responsive">
            <table class="clean-table">
              <thead>
                <tr>
                  <th data-i18n-admin="thUserUsername">Username</th>
                  <th data-i18n-admin="thUserFullname">Full Name</th>
                  <th data-i18n-admin="thUserRole">Role</th>
                  <th data-i18n-admin="thUserDiv">Division Access</th>
                  <th data-i18n-admin="thDocStatus">Status</th>
                  <th style="text-align: right;" data-i18n-admin="thAction">Action</th>
                </tr>
              </thead>
              <tbody id="admin-users-table-body">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>
      </div>


      


      <!-- ======================================================================
           VIEW 9: USER PROFILE & SECURITY MANAGEMENT
           ====================================================================== -->
      <div id="view-profile" class="content-view">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            <!-- Column 1: Identity & Contact Info with Avatar Upload -->
            <div style="background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 16px; padding: 26px;">
              <div style="display:flex; align-items:center; gap:20px; margin-bottom:28px; padding-bottom:22px; border-bottom:1px solid var(--border-soft);">
                <!-- Avatar with Camera Badge Upload -->
                <div style="position:relative; width:92px; height:92px; flex-shrink:0;">
                  <div style="width:92px; height:92px; border-radius:50%; overflow:hidden; border:3px solid #ECAC58; background:linear-gradient(135deg, var(--pill-navy), #3D4A88); display:flex; align-items:center; justify-content:center; font-size:2.4rem; color:#fff; box-shadow:0 6px 16px rgba(56,0,0,0.14); cursor:pointer; transition:all 0.2s ease;" id="profile-avatar-circle" onclick="document.getElementById('prof-avatar-input').click()" title="Click to upload profile photo">
                    👤
                  </div>
                  <label for="prof-avatar-input" style="position:absolute; bottom:0px; right:0px; width:30px; height:30px; border-radius:50%; background:#380000; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.85rem; cursor:pointer; border:2.5px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,0.25); transition:transform 0.15s ease;" title="Upload Profile Photo" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    📷
                  </label>
                  <input type="file" id="prof-avatar-input" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none;" onchange="handleProfileAvatarUpload(event)">
                </div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  <h3 id="prof-display-name" style="font-size:1.28rem; font-weight:800; color:var(--text-main); margin:0; line-height:1.25;">Chief Secretary</h3>
                  <div style="display:flex; align-items:center; flex-wrap:wrap; gap:8px;">
                    <span class="badge-pill badge-pill-navy" id="prof-badge-role" style="font-size:0.75rem; padding:4px 10px;">Super Admin</span>
                    <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;" id="prof-display-unit">Chief Secretariat</span>
                  </div>
                  <div style="margin-top:6px; display:flex; align-items:center; gap:8px;">
                    <button type="button" class="btn-table-action" onclick="document.getElementById('prof-avatar-input').click()" style="padding:4px 10px; font-size:0.75rem; border-radius:6px; border:1px solid var(--border-soft); background:var(--bg-canvas); cursor:pointer; color:var(--text-main); font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                      📷 <span data-i18n-admin="btnChangePhoto">Change Photo</span>
                    </button>
                    <button type="button" class="btn-table-action btn-table-delete" id="btn-remove-photo" onclick="handleRemoveProfilePhoto()" style="padding:4px 10px; font-size:0.75rem; border-radius:6px; display:none; cursor:pointer; font-weight:600;">
                      🗑️ <span data-i18n-admin="btnRemovePhoto">Remove</span>
                    </button>
                  </div>
                </div>
              </div>


              <form id="form-profile-info" onsubmit="handleSaveProfileInfo(event)" style="margin-top: 10px;">
                <div class="form-group" style="margin-bottom:18px;">
                  <label class="form-label" style="font-weight:700; margin-bottom:6px;" data-i18n-admin="lblFullName">Full Name</label>
                  <input type="text" id="prof-full-name" class="form-control" required placeholder="Enter full name">
                </div>


                <div class="form-group" style="margin-bottom:18px;">
                  <label class="form-label" style="font-weight:700; margin-bottom:6px;" data-i18n-admin="lblUsername">Username</label>
                  <input type="text" id="prof-username" class="form-control" readonly style="background:var(--bg-canvas); cursor:not-allowed;">
                </div>


                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:24px;">
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label" style="font-weight:700; margin-bottom:6px;" data-i18n-admin="lblPhone">Official Contact No</label>
                    <input type="tel" id="prof-phone" class="form-control" placeholder="e.g. +94 37 222 3451">
                  </div>
                  <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label" style="font-weight:700; margin-bottom:6px;" data-i18n-admin="lblEmail">Email Address</label>
                    <input type="email" id="prof-email" class="form-control" placeholder="e.g. officer@nw.gov.lk">
                  </div>
                </div>


                <div class="login-alert" id="prof-info-msg" style="display:none; margin-bottom:18px;"></div>


                <button type="submit" class="btn-create-action" id="btn-save-prof-info" style="width: 100%; justify-content: center; padding: 11px 20px; font-size: 0.9rem;">
                  <span>💾</span> <span data-i18n-admin="btnSaveProfile">Save Profile Changes</span>
                </button>
              </form>
            </div>


            <!-- Column 2: Account Security & Password Update -->
            <div style="background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 16px; padding: 26px; display:flex; flex-direction:column;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid var(--border-soft);">
                <div>
                  <h4 style="font-size:1rem; font-weight:800; color:var(--text-main); margin:0 0 2px 0;" data-i18n-admin="lblAccountSecurity">Account Security</h4>
                  <div style="font-size:0.75rem; color:var(--text-muted);" data-i18n-admin="lblAccountSecuritySub">Manage your credentials & sign-in security</div>
                </div>
                <span class="badge-pill badge-pill-amber" style="font-size:0.72rem;">2FA Ready</span>
              </div>


              <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:10px; padding:10px 14px; margin-bottom:18px; font-size:0.78rem; color:#92400E; line-height:1.4;">
                <span>🛡️</span> Use a strong password with letters, numbers, and symbols to protect administrative publishing permissions.
              </div>


              <form id="form-profile-password" onsubmit="handleSaveProfilePassword(event)" style="display:flex; flex-direction:column; flex:1;">
                <div class="form-group" style="margin-bottom:14px;">
                  <label class="form-label" style="font-weight:700;" data-i18n-admin="lblCurrentPassword">Current Password</label>
                  <div class="password-input-wrap">
                    <input type="password" id="prof-current-password" class="form-control" required placeholder="Enter current password">
                    <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('prof-current-password', this)" title="Show/Hide">👁️</button>
                  </div>
                </div>


                <div class="form-group" style="margin-bottom:14px;">
                  <label class="form-label" style="font-weight:700;" data-i18n-admin="lblNewPassword">New Password</label>
                  <div class="password-input-wrap">
                    <input type="password" id="prof-new-password" class="form-control" required placeholder="Min. 6 characters" minlength="6">
                    <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('prof-new-password', this)" title="Show/Hide">👁️</button>
                  </div>
                </div>


                <div class="form-group" style="margin-bottom:18px;">
                  <label class="form-label" style="font-weight:700;" data-i18n-admin="lblConfirmPassword">Confirm New Password</label>
                  <div class="password-input-wrap">
                    <input type="password" id="prof-confirm-password" class="form-control" required placeholder="Re-type new password" minlength="6">
                    <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('prof-confirm-password', this)" title="Show/Hide">👁️</button>
                  </div>
                </div>


                <div class="login-alert" id="prof-pwd-msg" style="display:none; margin-bottom:16px;"></div>


                <div style="margin-top:auto;">
                  <button type="submit" class="btn-create-action" id="btn-save-prof-pwd" style="width: 100%; justify-content: center; background:var(--pill-navy);">
                    <span>🔑</span> Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>


    </main>


  </div>


  <!-- ==========================================================================
       MODAL: ADD / EDIT DOCUMENT (Ultra-Compact No-Scroll 2-Column Design)
       ========================================================================== -->


  <div class="modal-backdrop" id="modal-doc">


    <div class="modal-box modal-box-wide">


      <div class="modal-header-bar" style="margin-bottom: 12px;">


        <h3 class="modal-title" id="modal-doc-title" style="font-size: 1.15rem; font-weight: 800;" data-i18n-admin="modalDocTitleAdd">Publish New Document</h3>


        <button class="btn-close-modal" onclick="closeModal('modal-doc')">✕</button>


      </div>






      <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:6px 12px; margin-bottom:12px; font-size:0.75rem; color:#166534; display:flex; align-items:center; justify-content:space-between; gap:8px;">


        <div style="display:flex; align-items:center; gap:6px;">


          <span>⚡</span>


          <span data-i18n-admin="modalDocDirectPushText"><strong>Direct Live Publishing:</strong> Saved documents are pushed directly to the citizen website without administrative pre-approval.</span>


        </div>


        <span style="background:#DCFCE7; color:#15803D; font-weight:700; padding:2px 7px; border-radius:4px; font-size:0.7rem; white-space:nowrap;" data-i18n-admin="modalDocDirectPushActive">🟢 Direct Push Active</span>


      </div>






      <form id="form-doc" onsubmit="handleSaveDocument(event)">


        <input type="hidden" id="doc-id">






        <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 14px 20px; align-items: start;">


          <!-- Left Column: Titles & Division -->


          <div>


            <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:6px 12px; margin-bottom:10px; font-size:0.75rem; color:#166534; display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span>✨</span>
                <span data-i18n-admin="modalDocSmartTransHelp"><strong>Smart Multilingual:</strong> Type title in ANY language. Other languages translate automatically!</span>
              </div>
              <button type="button" id="btn-doc-auto-trans" onclick="handleAutoTranslateDocTitles(true)" style="padding:3px 10px; font-size:0.72rem; font-weight:700; border:1px solid #86EFAC; background:#DCFCE7; color:#15803D; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; white-space:nowrap;">
                <span id="doc-auto-trans-icon">⚡</span> <span id="doc-auto-trans-text" data-i18n-admin="btnAutoTranslateShort">Auto-Translate</span>
              </button>
            </div>


            <div class="form-group" style="margin-bottom: 8px;">


              <label class="form-label" data-i18n-admin="lblDocTitleEn">Document Title (English)</label>


              <input type="text" id="doc-title-en" class="form-control" placeholder="e.g. Kurunegala Rate Book 2026..." data-i18n-admin-ph="phDocTitleEn" onblur="handleDocTitleBlur(this)" style="padding: 7px 12px; font-size: 0.84rem;">


            </div>






            <div class="form-group" style="margin-bottom: 8px;">


              <label class="form-label" data-i18n-admin="lblDocTitleSi">Document Title (Sinhala - සිංහල)</label>


              <input type="text" id="doc-title-si" class="form-control" placeholder="උදා: කුරුණෑගල මිල ගණන් පොත 2026..." data-i18n-admin-ph="phDocTitleSi" onblur="handleDocTitleBlur(this)" style="padding: 7px 12px; font-size: 0.84rem;">


            </div>






            <div class="form-group" style="margin-bottom: 8px;">


              <label class="form-label" data-i18n-admin="lblDocTitleTa">Document Title (Tamil - தமிழ்)</label>


              <input type="text" id="doc-title-ta" class="form-control" placeholder="உதா: குருணாகல் விலைப்பட்டியல் 2026..." data-i18n-admin-ph="phDocTitleTa" onblur="handleDocTitleBlur(this)" style="padding: 7px 12px; font-size: 0.84rem;">


            </div>






            <div class="form-group" style="margin-bottom: 0;">


              <label class="form-label" data-i18n-admin="lblDivision">Division</label>


              <select id="doc-division" class="form-control" required style="padding: 7px 12px; font-size: 0.84rem;">


                <!-- Populated dynamically -->


              </select>


              <small id="doc-division-hint" style="display:none; color:#2563EB; font-size:0.73rem; font-weight:700; margin-top:3px;"></small>


            </div>


          </div>






          <!-- Right Column: Document Type, File Upload, Size & Featured Pin -->


          <div>


            <div class="form-group" style="margin-bottom: 8px;">


              <label class="form-label" data-i18n-admin="lblDocType">Document Type</label>


              <select id="doc-type" class="form-control" required style="padding: 7px 12px; font-size: 0.84rem;">


                <option value="Circular">Circular</option>


                <option value="Publication">Publication / Rate Book</option>


                <option value="Application">Application / Form</option>


                <option value="Report">Report / Gazette</option>


                <option value="Notice">Notice</option>


              </select>


            </div>






            <div class="form-group" style="margin-bottom: 8px;">


              <label class="form-label" data-i18n-admin="lblUploadFile">Upload PDF / Document File</label>


              <div class="file-dropzone" onclick="document.getElementById('doc-file-input').click()" style="padding: 10px 14px; display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 56px; background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 8px; cursor: pointer;">


                <span style="font-size: 1.5rem; line-height: 1;">📄</span>


                <div style="text-align: left; line-height: 1.25; flex: 1; min-width: 0;">


                  <div style="font-weight: 700; font-size: 0.82rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="doc-file-label" data-i18n-admin="lblDropzonePrompt">Click to browse or drop file here</div>


                  <div style="font-size: 0.71rem; color: var(--text-muted); margin-top: 2px;" id="doc-file-sub" data-i18n-admin="lblDropzoneSub">PDF, DOC, DOCX, XLS (Max 50MB)</div>


                </div>


                <input type="file" id="doc-file-input" style="display:none;" onchange="handleFileChosen(this)">


              </div>


            </div>






            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 0;">


              <div class="form-group" style="margin-bottom: 0;">


                <label class="form-label" data-i18n-admin="lblDocSize">Document Size</label>


                <input type="text" id="doc-size" class="form-control" placeholder="e.g. 2.4 MB" data-i18n-admin-ph="phDocSize" required style="padding: 7px 12px; font-size: 0.84rem;">


              </div>






              <div class="form-group" style="margin-bottom: 0; display: flex; align-items: flex-end; padding-bottom: 6px;">


                <label style="display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-size: 0.82rem; cursor: pointer; color: var(--text-main);">


                  <input type="checkbox" id="doc-featured" style="width: 17px; height: 17px; accent-color: #2563EB;">


                  <span data-i18n-admin="lblPinFeatured">Pin to Featured</span>


                </label>


              </div>


            </div>


          </div>


        </div>






        <div class="modal-footer" style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #F1F5F9;">


          <button type="button" class="btn-cancel" onclick="closeModal('modal-doc')" style="padding: 7px 18px; font-size: 0.84rem;" data-i18n-admin="btnCancel">Cancel</button>


          <button type="submit" class="btn-create-action" id="btn-save-doc" style="padding: 8px 24px; font-size: 0.84rem;">


            <span>💾</span> <span data-i18n-admin="btnSaveDoc">Save Document</span>


          </button>


        </div>


      </form>


    </div>


  </div>






  <!-- ==========================================================================


       MODAL: CREATE / EDIT USER


       ========================================================================== -->


  <div class="modal-backdrop" id="modal-user">


    <div class="modal-box">


      <div class="modal-header-bar">


        <h3 class="modal-title" id="modal-user-title">Create Admin User</h3>


        <button class="btn-close-modal" onclick="closeModal('modal-user')">✕</button>


      </div>






      <form id="form-user" onsubmit="handleSaveUser(event)">


        <input type="hidden" id="user-id">






        <div class="form-group">


          <label class="form-label">Username</label>


          <input type="text" id="user-username" class="form-control" placeholder="e.g. dcs_admin" required>


        </div>






        <div class="form-group">


          <label class="form-label">Full Name</label>


          <input type="text" id="user-fullname" class="form-control" placeholder="e.g. H.M. Sisira Bandara" required>


        </div>






        <div class="form-group">


          <label class="form-label">Password <span id="user-pass-note" style="font-weight:normal; font-size:0.75rem; color:var(--text-muted);">(Leave empty to keep existing)</span></label>


          <input type="password" id="user-password" class="form-control" placeholder="Enter secure password">


        </div>






        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">


          <div class="form-group">


            <label class="form-label">Official Contact No (Phone)</label>


            <input type="tel" id="user-phone" class="form-control" placeholder="e.g. +94 37 222 3451">


          </div>


          <div class="form-group">


            <label class="form-label">Official Email Address</label>


            <input type="email" id="user-email" class="form-control" placeholder="e.g. officer@nw.gov.lk">


          </div>


        </div>






        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;" id="user-role-div-row">


          <div class="form-group">


            <label class="form-label">User Role</label>


            <select id="user-role" class="form-control" required>


              <option value="Admin">Admin / Officer (Documents & News Direct Publishing)</option>


              <option value="Super Admin">Super Admin (User Management + Full Publishing)</option>


              <option value="Editor">Officer / Editor (Documents & News Direct Publishing)</option>


            </select>


          </div>






          <div class="form-group">


            <label class="form-label">Assigned Unit (Chief Secretariat)</label>


            <select id="user-division" class="form-control">


              <option value="">All Units (Super Administrator)</option>


              <!-- Populated dynamically -->


            </select>


          </div>


        </div>






        <div class="modal-footer">


          <button type="button" class="btn-cancel" onclick="closeModal('modal-user')">Cancel</button>


          <button type="submit" class="btn-create-action" id="btn-save-user">


            <span>💾</span> Save User Account


          </button>


        </div>


      </form>


    </div>


  </div>






  


  <!-- ==========================================================================
       MODAL: ADD / EDIT PROVINCIAL PROJECT / NEWS ARTICLE
       ========================================================================== -->
  <div class="modal-backdrop" id="modal-project">
    <div class="modal-box" style="max-width: 620px; max-height: 94vh; overflow: visible; padding: 20px 24px;">
      <div class="modal-header-bar" style="margin-bottom: 12px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h3 class="modal-title" id="modal-project-title" style="font-size: 1.15rem; font-weight: 800; color: #380000; display:flex; align-items:center; gap:8px; margin:0;">
          <span>🚀</span> <span data-i18n-admin="modalProjTitleAdd">Publish News Article / Project</span>
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <!-- Language Tabs matching active dashboard language -->
          <div style="display:flex; align-items:center; gap:4px; background:#F1F5F9; padding:2px 4px; border-radius:20px; border:1px solid #E2E8F0;">
            <button type="button" class="proj-modal-lang-btn" data-lang="si" onclick="setProjectModalLang('si')" style="padding:2px 10px; font-size:0.72rem; font-weight:700; border-radius:14px; border:1px solid transparent; cursor:pointer; transition:all 0.15s ease;">සිංහල</button>
            <button type="button" class="proj-modal-lang-btn" data-lang="en" onclick="setProjectModalLang('en')" style="padding:2px 10px; font-size:0.72rem; font-weight:700; border-radius:14px; border:1px solid transparent; cursor:pointer; transition:all 0.15s ease;">English</button>
            <button type="button" class="proj-modal-lang-btn" data-lang="ta" onclick="setProjectModalLang('ta')" style="padding:2px 10px; font-size:0.72rem; font-weight:700; border-radius:14px; border:1px solid transparent; cursor:pointer; transition:all 0.15s ease;">தமிழ்</button>
          </div>
          <button class="btn-close-modal" onclick="closeModal('modal-project')" style="margin:0;">✕</button>
        </div>
      </div>


      <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:6px 12px; margin-bottom:12px; font-size:0.75rem; color:#166534; display:flex; align-items:center; justify-content:space-between; gap:8px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:0.95rem; line-height:1;">⚡</span>
          <span data-i18n-admin="modalProjDirectPushText"><strong>Direct Live Publishing:</strong> Pushed immediately to the live public portal carousel & articles without admin approval.</span>
        </div>
        <span style="background:#DCFCE7; color:#15803D; font-weight:700; padding:2px 7px; border-radius:4px; font-size:0.68rem; white-space:nowrap;">🟢 Direct Push Active</span>
      </div>


      <form id="form-project" onsubmit="handleSaveProject(event)">
        <input type="hidden" id="project-id" value="">
        <input type="hidden" id="project-image" value="">


        <!-- Language Panel: English (shown when dashboard language is English) -->
        <div id="proj-lang-panel-en" style="display:none;">
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblHeadlineEn">Headline / Title (English) <span style="color:#DC2626;">*</span></label>
            <input type="text" id="project-title-en" class="form-control" onblur="handleProjTitleBlur(this)" placeholder="e.g. Provincial Smart Governance Initiative..." style="padding: 7px 12px; font-size: 0.85rem;">
          </div>
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblArticleSummaryEn">Article Summary / Description (English) <span style="color:#DC2626;">*</span></label>
            <textarea id="project-desc-en" class="form-control" onblur="handleProjDescBlur(this)" rows="2" placeholder="Brief summary of the initiative..." style="padding: 7px 12px; font-size: 0.85rem; resize: vertical; min-height: 52px;"></textarea>
          </div>
        </div>


        <!-- Language Panel: Sinhala (shown when dashboard language is Sinhala) -->
        <div id="proj-lang-panel-si" style="display:none;">
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblHeadlineSi">ප්‍රවෘත්ති / ව්‍යාපෘති සිරස්තලය (Sinhala) <span style="color:#DC2626;">*</span></label>
            <input type="text" id="project-title-si" class="form-control form-control-si" onblur="handleProjTitleBlur(this)" placeholder="උදා: වයඹ පළාත් සභා ස්මාර්ට් ඩිජිටල් පාලන ව්‍යාපෘතිය..." style="padding: 7px 12px; font-size: 0.85rem;">
          </div>
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblArticleSummarySi">කෙටි හැඳින්වීම සහ විස්තරය (Sinhala) <span style="color:#DC2626;">*</span></label>
            <textarea id="project-desc-si" class="form-control form-control-si" onblur="handleProjDescBlur(this)" rows="2" placeholder="වැඩසටහන පිළිබඳ කෙටි හැඳින්වීම..." style="padding: 7px 12px; font-size: 0.85rem; resize: vertical; min-height: 52px;"></textarea>
          </div>
        </div>


        <!-- Language Panel: Tamil (shown when dashboard language is Tamil) -->
        <div id="proj-lang-panel-ta" style="display:none;">
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblHeadlineTa">செய்தி / திட்டத் தலைப்பு (Tamil) <span style="color:#DC2626;">*</span></label>
            <input type="text" id="project-title-ta" class="form-control form-control-ta" onblur="handleProjTitleBlur(this)" placeholder="உதா: வடமேல் மாகாண ஸ்மார்ட் டிஜிட்டல் ஆளுகை திட்டம்..." style="padding: 7px 12px; font-size: 0.85rem;">
          </div>
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblArticleSummaryTa">கட்டுரைச் சுருக்கம் / விளக்கம் (Tamil) <span style="color:#DC2626;">*</span></label>
            <textarea id="project-desc-ta" class="form-control form-control-ta" onblur="handleProjDescBlur(this)" rows="2" placeholder="திட்டம் பற்றிய சுருக்கமான விளக்கம்..." style="padding: 7px 12px; font-size: 0.85rem; resize: vertical; min-height: 52px;"></textarea>
          </div>
        </div>


        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom: 10px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblKeyword">Category / Keyword</label>
            <input type="text" id="project-keyword" class="form-control" placeholder="e.g. BoQ, Infrastructure, Health" data-i18n-admin-ph="phProjectKeyword" style="padding: 7px 12px; font-size: 0.85rem;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblPublishDate">Publish Date</label>
            <input type="date" id="project-date" class="form-control" style="padding: 7px 12px; font-size: 0.85rem;">
          </div>
        </div>


        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:4px;" data-i18n-admin="lblProjectImage">Featured Image / Cover Photo</label>
          <div class="file-dropzone" onclick="document.getElementById('project-file-input').click()" style="padding: 8px 12px; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 42px; background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 8px; cursor: pointer;">
            <span style="font-size: 1.3rem; line-height: 1;">🖼️</span>
            <div style="text-align: left; line-height: 1.2; flex: 1; min-width: 0;">
              <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="project-image-label" data-i18n-admin="dropzoneProjectImage">Click to browse or drop cover photo here</div>
              <div style="font-size: 0.68rem; color: var(--text-muted);" data-i18n-admin="dropzoneProjectImageSub">JPG, PNG, WEBP (Max 15MB)</div>
            </div>
            <input type="file" id="project-file-input" accept="image/*" style="display:none;" onchange="handleProjectImageSelect(this)">
          </div>
        </div>


        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top: 14px;">
          <button type="button" class="btn-cancel" onclick="closeModal('modal-project')" style="padding: 7px 16px; border-radius: 8px; border: 1px solid #CCC; background: #FFF; font-weight: 600; cursor: pointer; font-size: 0.84rem;" data-i18n-admin="btnCancel">Cancel</button>
          <button type="submit" id="btn-save-project" class="btn-create-action" style="padding: 7px 20px; font-size: 0.84rem;">
            <span>💾</span> <span data-i18n-admin="btnPublishArticleDirect">Publish Article Directly</span>
          </button>
        </div>
      </form>
    </div>
  </div>


  <div class="modal-backdrop" id="modal-division-manage">
    <div class="modal-box" style="max-width: 580px; max-height: 90vh; overflow: hidden; padding: 18px 22px; border-radius: 16px;">
      <div class="modal-header-bar" style="margin-bottom: 10px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h3 class="modal-title" id="modal-division-title" style="font-size: 1.15rem; font-weight: 800; color: #380000; display:flex; align-items:center; gap:8px; margin:0;">
          <span>🏛️</span> <span data-i18n-admin="modalDivTitle">Create Division or Sub-Division</span>
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <!-- Language Tabs matching active dashboard language -->
          <div style="display:flex; align-items:center; gap:4px; background:#F1F5F9; padding:2px 4px; border-radius:20px; border:1px solid #E2E8F0;">
            <button type="button" class="div-modal-lang-btn" data-lang="si" onclick="setDivisionModalLang('si')" style="padding:2px 10px; font-size:0.72rem; font-weight:700; border-radius:14px; border:1px solid transparent; cursor:pointer; transition:all 0.15s ease;">සිංහල</button>
            <button type="button" class="div-modal-lang-btn" data-lang="en" onclick="setDivisionModalLang('en')" style="padding:2px 10px; font-size:0.72rem; font-weight:700; border-radius:14px; border:1px solid transparent; cursor:pointer; transition:all 0.15s ease;">English</button>
            <button type="button" class="div-modal-lang-btn" data-lang="ta" onclick="setDivisionModalLang('ta')" style="padding:2px 10px; font-size:0.72rem; font-weight:700; border-radius:14px; border:1px solid transparent; cursor:pointer; transition:all 0.15s ease;">தமிழ்</button>
          </div>
          <button class="btn-close-modal" onclick="closeModal('modal-division-manage')" style="margin:0;">✕</button>
        </div>
      </div>


      <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:8px; padding:6px 12px; margin-bottom:10px; font-size:0.74rem; color:#92400E; line-height:1.35; display:flex; align-items:center; gap:6px;">
        <span>ℹ️</span> <span data-i18n-admin="modalDivInfoNotice">Live Secretariat Architecture: Divisions and sub-units created here immediately appear across public portal navigation, directories, document filters, and officer registration.</span>
      </div>


      <!-- Type Switcher Tabs: Main Division vs Sub-Division -->
      <div style="display:flex; background:var(--bg-input); border:1px solid var(--border-soft); border-radius:10px; padding:3px; gap:6px; margin-bottom:12px;">
        <button type="button" class="btn-tab-div-type active" id="btn-type-main-div" onclick="switchDivisionCreateType('main')" style="flex:1; padding:6px 12px; border:none; border-radius:7px; font-weight:700; font-size:0.8rem; cursor:pointer; background:#380000; color:#FFFFFF; transition:all 0.2s ease;">
          <span data-i18n-admin="tabMainDivision">🏛️ 1. Main Division</span>
        </button>
        <button type="button" class="btn-tab-div-type" id="btn-type-sub-div" onclick="switchDivisionCreateType('sub')" style="flex:1; padding:6px 12px; border:none; border-radius:7px; font-weight:700; font-size:0.8rem; cursor:pointer; background:transparent; color:var(--text-main); transition:all 0.2s ease;">
          <span data-i18n-admin="tabSubDivision">📂 2. Sub-Division / Unit</span>
        </button>
      </div>


      <form id="form-create-division" onsubmit="handleSaveDivisionOrSub(event)">
        <input type="hidden" id="div-manage-type" value="main">


        <!-- SECTION A: MAIN DIVISION FIELDS -->
        <div id="section-main-division-fields">
          <!-- English Main Division Panel -->
          <div id="main-div-lang-panel-en" style="display:none;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:8px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">Division Name (English) <span style="color:#DC2626;">*</span></label>
                <input type="text" id="main-div-name-en" class="form-control" placeholder="e.g. Health & Indigenous Medicine Division" style="padding:6px 10px; font-size:0.83rem; height:36px;">
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">Designated Head (English) <span style="color:#DC2626;">*</span></label>
                <input type="text" id="main-div-head-en" class="form-control" placeholder="e.g. Deputy Chief Secretary (Health)" style="padding:6px 10px; font-size:0.83rem; height:36px;">
              </div>
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">Division Description (English)</label>
              <input type="text" id="main-div-desc-en" class="form-control" placeholder="Mandate, statutory scope, and responsibilities..." style="padding:6px 10px; font-size:0.83rem; height:36px;">
            </div>
          </div>


          <!-- Sinhala Main Division Panel -->
          <div id="main-div-lang-panel-si" style="display:none;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:8px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">අංශයේ නම (සිංහල) <span style="color:#DC2626;">*</span></label>
                <input type="text" id="main-div-name-si" class="form-control" placeholder="උදා: සෞඛ්‍ය හා දේශීය වෛද්‍ය අංශය" style="padding:6px 10px; font-size:0.83rem; height:36px;">
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">තනතුර / ප්‍රධානියා (සිංහල) <span style="color:#DC2626;">*</span></label>
                <input type="text" id="main-div-head-si" class="form-control" placeholder="උදා: නියෝජ්‍ය ප්‍රධාන ලේකම් (සෞඛ්‍ය)" style="padding:6px 10px; font-size:0.83rem; height:36px;">
              </div>
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">විස්තරය (සිංහල)</label>
              <input type="text" id="main-div-desc-si" class="form-control" placeholder="අංශයේ වගකීම් සහ විෂය පථය පිළිබඳ විස්තරය..." style="padding:6px 10px; font-size:0.83rem; height:36px;">
            </div>
          </div>


          <!-- Tamil Main Division Panel -->
          <div id="main-div-lang-panel-ta" style="display:none;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:8px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">பிரிவு பெயர் (தமிழ்) <span style="color:#DC2626;">*</span></label>
                <input type="text" id="main-div-name-ta" class="form-control" placeholder="எ.கா: சுகாதாரம் மற்றும் சுதேச மருத்துவப் பிரிவு" style="padding:6px 10px; font-size:0.83rem; height:36px;">
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">பதவி / தலைவர் (தமிழ்) <span style="color:#DC2626;">*</span></label>
                <input type="text" id="main-div-head-ta" class="form-control" placeholder="எ.கா: பிரதி தலைமைச் செயலாளர் (சுகாதாரம்)" style="padding:6px 10px; font-size:0.83rem; height:36px;">
              </div>
            </div>
            <div class="form-group" style="margin-bottom:8px;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">விளக்கம் (தமிழ்)</label>
              <input type="text" id="main-div-desc-ta" class="form-control" placeholder="பிரிவின் நோக்கம் மற்றும் பொறுப்புகள்..." style="padding:6px 10px; font-size:0.83rem; height:36px;">
            </div>
          </div>


          <!-- Common: Initial Sub-units (comma-separated) -->
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;" data-i18n-admin="lblInitialSubUnits">Initial Sub-Units / Sections (Optional, comma-separated)</label>
            <input type="text" id="main-div-initial-sections" class="form-control" placeholder="e.g. Planning Unit, Clinical Affairs, Nutrition Unit" data-i18n-admin-ph="phInitialSubUnits" style="padding:6px 10px; font-size:0.83rem; height:36px;">
            <span style="font-size:0.69rem; color:var(--text-muted); display:block; margin-top:2px;" data-i18n-admin="hintInitialSubUnits">Separate multiple sub-units with commas. You can also add more sub-units later anytime.</span>
          </div>
        </div>


        <!-- SECTION B: SUB-DIVISION / SUB-UNIT FIELDS -->
        <div id="section-sub-division-fields" style="display:none;">
          <div class="form-group" style="margin-bottom:10px;">
            <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;" data-i18n-admin="lblParentMainDiv">Parent Main Division *</label>
            <select id="sub-div-parent-select" class="form-control" style="font-weight:600; padding:6px 10px; font-size:0.83rem; height:36px;">
              <!-- Populated dynamically with all main divisions -->
            </select>
          </div>


          <!-- English Sub-Unit Panel -->
          <div id="sub-div-lang-panel-en" style="display:none;">
            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">Sub-Unit Name (English) *</label>
              <input type="text" id="sub-div-name-en" class="form-control" placeholder="e.g. Internal Audit Unit" style="padding:6px 10px; font-size:0.83rem; height:36px;">
            </div>
          </div>


          <!-- Sinhala Sub-Unit Panel -->
          <div id="sub-div-lang-panel-si" style="display:none;">
            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">අනු අංශයේ / ඒකකයේ නම (සිංහල) *</label>
              <input type="text" id="sub-div-name-si" class="form-control" placeholder="උදා: අභ්‍යන්තර විගණන ඒකකය" style="padding:6px 10px; font-size:0.83rem; height:36px;">
            </div>
          </div>


          <!-- Tamil Sub-Unit Panel -->
          <div id="sub-div-lang-panel-ta" style="display:none;">
            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:0.76rem; font-weight:700; margin-bottom:3px;">துணைப் பிரிவு பெயர் (தமிழ்) *</label>
              <input type="text" id="sub-div-name-ta" class="form-control" placeholder="எ.கா: உள் தணிக்கைப் பிரிவு" style="padding:6px 10px; font-size:0.83rem; height:36px;">
            </div>
          </div>
        </div>


        <div class="login-alert" id="div-manage-msg" style="display:none; margin-bottom:10px;"></div>


        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:12px; padding-top:10px; border-top:1px solid var(--border-soft);">
          <button type="button" class="btn-cancel" onclick="closeModal('modal-division-manage')" style="padding: 7px 18px; border-radius: 8px; border: 1px solid #CCC; background: #FFF; font-weight: 600; cursor: pointer; font-size: 0.84rem;" data-i18n-admin="btnCancel">Cancel</button>
          <button type="submit" class="btn-create-action" id="btn-save-div-manage" style="padding: 7px 22px; font-size: 0.84rem; background:#380000; color:#fff; border:none; border-radius:8px; font-weight:700; cursor:pointer;">
            <span>💾</span> <span id="btn-save-div-manage-text" data-i18n-admin="btnCreateMainDiv">Create Main Division</span>
          </button>
        </div>
      </form>
    </div>
  </div>


  <!-- ======================================================================
       MODAL: ADD / EDIT KEY OFFICIAL
       ====================================================================== -->
  <div class="modal-backdrop" id="modal-officer">


    <div class="modal-box" style="max-width: 620px;">


      <div class="modal-header-bar" style="margin-bottom: 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">


        <h3 class="modal-title" id="modal-officer-title" style="font-size: 1.15rem; font-weight: 800; color: #380000;">👤 Add Key Official</h3>


        <button class="btn-close-modal" onclick="closeModal('modal-officer')">✕</button>


      </div>






      <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:8px 14px; margin-bottom:14px; font-size:0.76rem; color:#166534; display:flex; align-items:center; gap:8px;">


        <span style="font-size:1.1rem;">⚡</span>


        <span data-i18n-admin="modalOfficerBannerText"><strong>Live Official Directory:</strong> Key officials added appear immediately on public division profiles and staff rosters.</span>


      </div>






      <form id="form-officer" onsubmit="handleSaveOfficer(event)">


        <input type="hidden" id="officer-edit-id">


        <input type="hidden" id="officer-edit-divid">






        <!-- Division Selection -->


        <div class="form-group" style="margin-bottom: 12px;">


          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;"><span data-i18n-admin="lblSecretariatDivision">Secretariat Division</span> <span style="color:#DC2626;">*</span></label>


          <select id="officer-division-select" class="form-control" required onchange="updateOfficerSubUnitOptions()" style="padding: 8px 12px; font-size: 0.86rem;">


            <option value="1">1. Administration Division</option>


            <option value="2">2. Management & Training Division</option>


            <option value="3">3. Provincial Treasury & Finance Division</option>


            <option value="4">4. Engineering Division</option>


            <option value="5">5. Planning & Monitoring Division</option>


          </select>


        </div>






        <!-- Trilingual Full Names -->


        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom: 12px;">


          <div class="form-group" style="margin-bottom:0;">


            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;"><span data-i18n-admin="lblOfficerNameEn">Full Name (English)</span> <span style="color:#DC2626;">*</span></label>


            <input type="text" id="officer-name-en" class="form-control" placeholder="e.g. H.M. Sisira Bandara" data-i18n-admin-ph="phOfficerNameEn" required style="padding: 8px 12px; font-size: 0.86rem;">


          </div>


          <div class="form-group" style="margin-bottom:0;">


            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;" data-i18n-admin="lblOfficerNameSi">නම (සිංහල - Sinhala)</label>


            <input type="text" id="officer-name-si" class="form-control" placeholder="උදා: එච්.එම්. සිසිර බණ්ඩාර" data-i18n-admin-ph="phOfficerNameSi" style="padding: 8px 12px; font-size: 0.86rem;">


          </div>


        </div>






        <div class="form-group" style="margin-bottom: 12px;">


          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;" data-i18n-admin="lblOfficerNameTa">பெயர் (தமிழ் - Tamil)</label>


          <input type="text" id="officer-name-ta" class="form-control" placeholder="எ.கா: எச்.எம். சிசிர பண்டார" data-i18n-admin-ph="phOfficerNameTa" style="padding: 8px 12px; font-size: 0.86rem;">


        </div>






        <!-- Trilingual Designations -->


        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom: 12px;">


          <div class="form-group" style="margin-bottom:0;">


            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;"><span data-i18n-admin="lblOfficerRoleEn">Designation / Role (English)</span> <span style="color:#DC2626;">*</span></label>


            <input type="text" id="officer-role-en" class="form-control" placeholder="e.g. Deputy Chief Secretary (Administration)" data-i18n-admin-ph="phOfficerRoleEn" required style="padding: 8px 12px; font-size: 0.86rem;">


          </div>


          <div class="form-group" style="margin-bottom:0;">


            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;" data-i18n-admin="lblOfficerRoleSi">තනතුර (සිංහල - Sinhala)</label>


            <input type="text" id="officer-role-si" class="form-control" placeholder="උදා: නියෝජ්‍ය ප්‍රධාන ලේකම් (පරිපාලන)" data-i18n-admin-ph="phOfficerRoleSi" style="padding: 8px 12px; font-size: 0.86rem;">


          </div>


        </div>






        <div class="form-group" style="margin-bottom: 12px;">


          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;" data-i18n-admin="lblOfficerRoleTa">பதவி (தமிழ் - Tamil)</label>


          <input type="text" id="officer-role-ta" class="form-control" placeholder="எ.கா: பிரதி பிரதம செயலாளர் (நிர்வாகம்)" data-i18n-admin-ph="phOfficerRoleTa" style="padding: 8px 12px; font-size: 0.86rem;">


        </div>






        <!-- Contacts -->


        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom: 12px;">


          <div class="form-group" style="margin-bottom:0;">


            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;" data-i18n-admin="lblOfficerPhone">Official Phone Number</label>


            <input type="tel" id="officer-phone" class="form-control" placeholder="e.g. 077 453 2864" data-i18n-admin-ph="phOfficerPhone" style="padding: 8px 12px; font-size: 0.86rem;">


          </div>


          <div class="form-group" style="margin-bottom:0;">


            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;" data-i18n-admin="lblOfficerEmail">Official Email Address</label>


            <input type="email" id="officer-email" class="form-control" placeholder="e.g. dcsadmin@nw.gov.lk" data-i18n-admin-ph="phOfficerEmail" style="padding: 8px 12px; font-size: 0.86rem;">


          </div>


        </div>






        <!-- Sub-unit / Section Selection -->


        <div class="form-group" style="margin-bottom: 14px;">


          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;" data-i18n-admin="lblOfficerAssignedUnit">Assigned Sub-Unit / Section (අනු අංශය / ඒකකය)</label>


          <select id="officer-unit" class="form-control" style="padding: 8px 12px; font-size: 0.86rem;">


            <option value="">General / Head of Division (ප්‍රධාන කාර්යාලය)</option>


          </select>


        </div>






        <div class="modal-footer" style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-soft); display:flex; justify-content:flex-end; gap:10px;">


          <button type="button" class="btn-cancel" onclick="closeModal('modal-officer')" style="padding: 8px 20px; font-size: 0.84rem;">Cancel</button>


          <button type="submit" class="btn-create-action" id="btn-save-officer" style="padding: 8px 24px; font-size: 0.84rem;">


            <span>💾</span> Save Key Official


          </button>


        </div>


      </form>


    </div>


  </div>






  




  <!-- ======================================================================
       MODAL: ADD / EDIT ONLINE SYSTEM & E-SERVICE
       ====================================================================== -->
  <div class="modal-backdrop" id="modal-system">
    <div class="modal-box" style="max-width: 620px;">
      <div class="modal-header-bar" style="margin-bottom: 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h3 class="modal-title" id="modal-system-title" style="font-size: 1.15rem; font-weight: 800; color: #380000;">➕ Add Online System / e-Service</h3>
        <button class="btn-close-modal" onclick="closeModal('modal-system')">✕</button>
      </div>


      <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:8px 14px; margin-bottom:14px; font-size:0.76rem; color:#166534; display:flex; align-items:center; gap:8px;">
        <span style="font-size:1.1rem;">⚡</span>
        <span><strong>Live Public Portal Integration:</strong> Systems added here appear instantly in the citizen portal e-Services & BoQ hub.</span>
      </div>


      <form id="form-system" onsubmit="handleSaveSystem(event)">
        <input type="hidden" id="system-edit-id">


        <!-- Category & Icon -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom: 12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">Category / කාණ්ඩය <span style="color:#DC2626;">*</span></label>
            <select id="system-category" class="form-control" required style="padding: 8px 12px; font-size: 0.86rem;">
              <option value="Staff">Staff Portals (කාර්ය මණ්ඩල පද්ධති)</option>
              <option value="Finance">Finance & Budget (මුදල් හා අයවැය)</option>
              <option value="Public">Public Services (මහජන සේවා)</option>
              <option value="General">General Administrative (සාමාන්‍ය පරිපාලන)</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">System Icon / අයිකනය</label>
            <select id="system-icon" class="form-control" style="padding: 8px 12px; font-size: 0.86rem;">
              <option value="📐">📐 Engineering / BoQ</option>
              <option value="💰">💰 Finance / Treasury</option>
              <option value="🗺️">🗺️ GIS / Regional Planning</option>
              <option value="🎓">🎓 Training / Education</option>
              <option value="💻">💻 IT / Online Portal</option>
              <option value="🏛️">🏛️ Secretariat Division</option>
              <option value="📊">📊 Statistics / Performance</option>
              <option value="⚡">⚡ General e-Services</option>
            </select>
          </div>
        </div>


        <!-- Trilingual Titles -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom: 12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">System Title (English) <span style="color:#DC2626;">*</span></label>
            <input type="text" id="system-title-en" class="form-control" placeholder="e.g. BoQ Online System" required style="padding: 8px 12px; font-size: 0.86rem;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">පද්ධතියේ නම (සිංහල - Sinhala)</label>
            <input type="text" id="system-title-si" class="form-control" placeholder="උදා: BoQ මාර්ගගත ඉංජිනේරු පද්ධතිය" style="padding: 8px 12px; font-size: 0.86rem;">
          </div>
        </div>


        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">அமைப்பின் பெயர் (தமிழ் - Tamil)</label>
          <input type="text" id="system-title-ta" class="form-control" placeholder="எ.கா: BoQ இணைய பொறியியல் அமைப்பு" style="padding: 8px 12px; font-size: 0.86rem;">
        </div>


        <!-- Target URL -->
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">Portal Target URL / සබැඳිය <span style="color:#DC2626;">*</span></label>
          <input type="url" id="system-url" class="form-control" placeholder="https://cs.nw.gov.lk/boq/" required style="padding: 8px 12px; font-size: 0.86rem;">
        </div>


        <!-- Trilingual Descriptions -->
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">Description (English)</label>
          <textarea id="system-desc-en" class="form-control" rows="2" placeholder="Brief technical summary or objective of the system..." style="padding: 8px 12px; font-size: 0.84rem;"></textarea>
        </div>


        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom: 14px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">විස්තරය (සිංහල - Sinhala)</label>
            <textarea id="system-desc-si" class="form-control" rows="2" placeholder="පද්ධතිය පිළිබඳ කෙටි හැඳින්වීම..." style="padding: 8px 12px; font-size: 0.84rem;"></textarea>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">விளக்கம் (தமிழ் - Tamil)</label>
            <textarea id="system-desc-ta" class="form-control" rows="2" placeholder="அமைப்பு பற்றிய சுருக்கமான விளக்கம்..." style="padding: 8px 12px; font-size: 0.84rem;"></textarea>
          </div>
        </div>


        <div class="modal-footer" style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-soft); display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn-cancel" onclick="closeModal('modal-system')" style="padding: 8px 20px; font-size: 0.84rem;">Cancel</button>
          <button type="submit" class="btn-create-action" id="btn-save-system" style="padding: 8px 24px; font-size: 0.84rem;">
            <span>💾</span> Save Online System
          </button>
        </div>
      </form>
    </div>
  </div>




  <!-- MODAL: CONFIGURE DIVISION PORTAL URL -->
  <div id="modal-portal-link" class="modal-backdrop" style="display:none;" onclick="if(event.target===this) closeModal('modal-portal-link')">
    <div class="modal-box" style="max-width: 560px;">
      <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 class="modal-title" id="modal-portal-title" style="font-size: 1.15rem; font-weight: 800; color: #380000;" data-i18n-admin="modalPortalTitle">🌐 Configure Division Web Portal URL</h3>
        <button class="btn-close-modal" onclick="closeModal('modal-portal-link')">✕</button>
      </div>


      <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; margin-bottom:16px; font-size:0.78rem; color:#166534; display:flex; align-items:flex-start; gap:8px;">
        <span style="font-size:1.1rem; line-height:1;">⚡</span>
        <div>
          <strong data-i18n-admin="portalModalDescTitle">Live Hyperlink Integration:</strong> <span data-i18n-admin="portalModalDesc">The URL configured here will immediately appear as an active, clickable hyperlink card and button on the public portal when visitors select this statutory division or its sub-unit.</span>
        </div>
      </div>


      <form id="form-portal-link" onsubmit="handleSavePortalLink(event)">
        <!-- Select Statutory Division (Strictly Restricted to Divisions 2, 3, 4, 5) -->
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;"><span data-i18n-admin="lblStatutoryDivision">Statutory Division</span> <span style="color:#DC2626;">*</span></label>
          <select id="portal-division-select" class="form-control" required style="padding: 8px 12px; font-size: 0.86rem;" onchange="updatePortalSubUnitsDropdown(this.value); syncPortalTitleDefault(true);">
            <!-- Populated dynamically based on language -->
          </select>
        </div>


        <!-- Target Scope: Main Division or Specific Sub-Unit -->
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;"><span data-i18n-admin="lblTargetScope">Target Scope</span> <span style="color:#DC2626;">*</span></label>
          <select id="portal-target-unit" class="form-control" required style="padding: 8px 12px; font-size: 0.86rem;" onchange="syncPortalTitleDefault(true);">
            <!-- Populated dynamically based on language -->
          </select>
        </div>


        <!-- Portal Name/Title -->
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;"><span data-i18n-admin="lblPortalDisplayTitle">Portal Display Title</span> <span style="color:#DC2626;">*</span></label>
          <input type="text" id="portal-title-input" class="form-control" placeholder="e.g. BoQ Online Engineering System" data-i18n-admin-ph="phPortalTitle" required style="padding: 8px 12px; font-size: 0.86rem;">
        </div>


        <!-- Target URL -->
        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label" style="font-size: 0.8rem; font-weight: 700;"><span data-i18n-admin="lblWebPortalUrl">Web Portal URL (Hyperlink)</span> <span style="color:#DC2626;">*</span></label>
          <input type="url" id="portal-url-input" class="form-control" placeholder="https://cs.nw.gov.lk/boq/" required style="padding: 8px 12px; font-size: 0.86rem;">
          <small data-i18n-admin="lblEnterValidUrl" style="color:var(--text-muted); font-size:0.75rem; margin-top:3px; display:block;">Enter a full valid web address (including https://)</small>
        </div>


        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top: 18px;">
          <button type="button" class="btn-cancel" onclick="closeModal('modal-portal-link')" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #CCC; background: #FFF; font-weight: 600; cursor: pointer;" data-i18n-admin="btnCancel">Cancel</button>
          <button type="submit" id="btn-save-portal-link" class="btn-create-action" style="padding: 8px 20px;">
            <span>💾</span> <span data-i18n-admin="btnSavePortalLink">Save Portal Link</span>
          </button>
        </div>
      </form>
    </div>
  </div>




  <!-- Toast Message Element -->
  <div class="toast-msg" id="admin-toast">
    <span>✅</span> <span id="toast-text">Action completed successfully.</span>
  </div>


  <!-- Client-side PDF Optimization Engine (100% Free & Standalone) -->
  <script src="assets/pdf-lib.min.js"></script>

  <!-- Include Core Admin Script -->
  <script src="admin.js?v=90.0"></script>
  <!-- ======================================================================
       MODAL: CHANGE ACCOUNT PASSWORD (POPUP WINDOW)
       ====================================================================== -->
  <div class="modal-backdrop" id="modal-profile-password">
    <div class="modal-box" style="max-width: 480px;">
      <div class="modal-header-bar" style="margin-bottom: 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h3 class="modal-title" style="font-size: 1.15rem; font-weight: 800; color: #380000; display:flex; align-items:center; gap:8px;">
          <span>🔐</span> <span data-i18n-admin="modalPwdTitle">Change Account Password</span>
        </h3>
        <button class="btn-close-modal" onclick="closeModal('modal-profile-password')">✕</button>
      </div>


      <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:10px; padding:10px 14px; margin-bottom:18px; font-size:0.78rem; color:#92400E; line-height:1.4;">
        <span>🛡️</span> Enter a new secure password (at least 6 characters) to safeguard your council account credentials.
      </div>


      <form id="form-profile-password-modal" onsubmit="handleSaveProfilePasswordModal(event)">
        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" style="font-weight:700;" data-i18n-admin="lblCurrentPassword">Current Password</label>
          <div class="password-input-wrap">
            <input type="password" id="modal-prof-current-pwd" class="form-control" required placeholder="Enter current password">
            <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('modal-prof-current-pwd', this)" title="Show/Hide">👁️</button>
          </div>
        </div>


        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" style="font-weight:700;" data-i18n-admin="lblNewPassword">New Password</label>
          <div class="password-input-wrap">
            <input type="password" id="modal-prof-new-pwd" class="form-control" required placeholder="Min. 6 characters" minlength="6">
            <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('modal-prof-new-pwd', this)" title="Show/Hide">👁️</button>
          </div>
        </div>


        <div class="form-group" style="margin-bottom: 18px;">
          <label class="form-label" style="font-weight:700;" data-i18n-admin="lblConfirmPassword">Confirm New Password</label>
          <div class="password-input-wrap">
            <input type="password" id="modal-prof-confirm-pwd" class="form-control" required placeholder="Re-type new password" minlength="6">
            <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('modal-prof-confirm-pwd', this)" title="Show/Hide">👁️</button>
          </div>
        </div>


        <div class="login-alert" id="modal-prof-pwd-msg" style="display:none; margin-bottom:16px;"></div>


        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn-folder-search" onclick="closeModal('modal-profile-password')" style="padding:9px 18px; border-radius:8px;">
            Cancel
          </button>
          <button type="submit" class="btn-login-submit" id="btn-modal-prof-pwd-submit" style="background:var(--pill-navy); width:auto; padding:9px 24px;">
            <span>Update Password</span> ➔
          </button>
        </div>
      </form>
    </div>
  </div>


  <!-- ======================================================================
       MODAL: FORGOT PASSWORD RECOVERY (POPUP WINDOW)
       ====================================================================== -->
  <div class="modal-backdrop" id="modal-forgot-password">
    <div class="modal-box" style="max-width: 480px;">
      <div class="modal-header-bar" style="margin-bottom: 14px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h3 class="modal-title" style="font-size: 1.15rem; font-weight: 800; color: #380000; display:flex; align-items:center; gap:8px;">
          <span>🔑</span> <span data-i18n-admin="modalForgotTitle">Account Password Recovery</span>
        </h3>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="auth-lang-pills">
            <button type="button" class="auth-lang-btn" data-lang="en" onclick="setDashboardLanguage('en')">EN</button>
            <button type="button" class="auth-lang-btn" data-lang="si" onclick="setDashboardLanguage('si')">සිං</button>
            <button type="button" class="auth-lang-btn" data-lang="ta" onclick="setDashboardLanguage('ta')">தம</button>
          </div>
          <button class="btn-close-modal" onclick="closeModal('modal-forgot-password')">✕</button>
        </div>
      </div>


      <!-- STEP 1: Enter Username or Registered Email -->
      <div id="forgot-step-1">
        <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; padding:12px 14px; margin-bottom:18px; font-size:0.8rem; color:#1E40AF; line-height:1.45; display:flex; gap:10px; align-items:flex-start;">
          <span style="font-size:1.1rem; line-height:1;">📧</span>
          <span data-i18n-admin="forgotStep1Desc">Enter your account username or registered email. We will send a secure 6-digit verification code to your email.</span>
        </div>


        <form id="form-forgot-step1" onsubmit="handleSendForgotCode(event)">
          <div class="form-group" style="margin-bottom: 18px;">
            <label class="form-label" style="font-weight:700;" data-i18n-admin="lblAccountIdentifier">Username or Registered Email</label>
            <input type="text" id="modal-forgot-identifier" class="form-control" placeholder="e.g. test@gmail.com or admin" required autocomplete="username">
          </div>


          <div class="login-alert" id="modal-forgot-step1-msg" style="display:none; margin-bottom:14px;"></div>


          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" class="btn-folder-search" onclick="closeModal('modal-forgot-password')" style="padding:9px 18px; border-radius:8px;" data-i18n-admin="btnCancel">
              Cancel
            </button>
            <button type="submit" class="btn-login-submit" id="btn-forgot-send-code" style="background:var(--pill-amber); width:auto; padding:9px 22px;">
              <span data-i18n-admin="btnSendCode">Send Verification Code</span> ➔
            </button>
          </div>
        </form>
      </div>


      <!-- STEP 2: Enter Code & New Password -->
      <div id="forgot-step-2" style="display:none;">
        <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; padding:12px 14px; margin-bottom:16px; font-size:0.8rem; color:#166534; line-height:1.45; display:flex; gap:10px; align-items:flex-start;">
          <span style="font-size:1.1rem; line-height:1;">✅</span>
          <div>
            <span data-i18n-admin="forgotStep2Desc">A 6-digit code has been sent to</span> <strong id="forgot-target-email" style="text-decoration:underline;"></strong>. <span data-i18n-admin="codeValidMins">Valid for 15 minutes.</span>
          </div>
        </div>


        <form id="form-forgot-step2" onsubmit="handleVerifyAndResetPassword(event)">
          <input type="hidden" id="modal-forgot-confirmed-user" value="">


          <div class="form-group" style="margin-bottom: 16px;">
            <label class="form-label" style="font-weight:700; display:flex; justify-content:space-between; align-items:center;">
              <span data-i18n-admin="lblVerificationCode">6-Digit Verification Code</span>
              <button type="button" onclick="backToForgotStep1()" style="background:none; border:none; color:var(--pill-amber); font-size:0.75rem; font-weight:700; cursor:pointer; text-decoration:underline;" data-i18n-admin="btnChangeEmailResend">Change Email / Resend</button>
            </label>
            <input type="text" id="modal-forgot-code" class="form-control" placeholder="••••••" maxlength="6" pattern="[0-9]{6}" required style="text-align:center; font-size:1.25rem; letter-spacing:6px; font-weight:800; color:#380000; background:#FFFBEB; border-color:#F59E0B;">
          </div>


          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom: 16px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-weight:700;" data-i18n-admin="lblNewPassword">New Password</label>
              <div class="password-input-wrap">
                <input type="password" id="modal-forgot-new-pwd" class="form-control" placeholder="Min. 6 characters" minlength="6" required>
                <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('modal-forgot-new-pwd', this)" title="Show/Hide">👁️</button>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-weight:700;" data-i18n-admin="lblConfirmPassword">Confirm Password</label>
              <div class="password-input-wrap">
                <input type="password" id="modal-forgot-confirm-pwd" class="form-control" placeholder="Re-type password" minlength="6" required>
                <button type="button" class="btn-toggle-pwd" onclick="togglePasswordVisibility('modal-forgot-confirm-pwd', this)" title="Show/Hide">👁️</button>
              </div>
            </div>
          </div>


          <div class="login-alert" id="modal-forgot-step2-msg" style="display:none; margin-bottom:14px;"></div>


          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <button type="button" class="btn-folder-search" onclick="backToForgotStep1()" style="padding:9px 16px; border-radius:8px;">
              ⬅️ <span data-i18n-admin="btnBack">Back</span>
            </button>
            <button type="submit" class="btn-login-submit" id="btn-forgot-verify-reset" style="background:var(--pill-amber); width:auto; padding:9px 24px;">
              <span data-i18n-admin="btnVerifyAndReset">Verify & Reset Password</span> ➔
            </button>
          </div>
        </form>
      </div>
    </div>
  </div></body>
</html>
