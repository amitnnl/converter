========================================================================
  PRESSWEBP — Unified Newsroom Media to 1:1 WebP Converter
========================================================================

A lightweight, high-performance media workstation designed for news
agencies, photojournalists, editorial desks, and digital media teams.
Features a single, unified media dropzone that auto-detects videos and
photos with zero tabs needed, routing directly into 1:1 Video or 1:1 Photo
studios with calibrated file size budgeting and editorial watermarking.

------------------------------------------------------------------------
HOW TO RUN ON ANY SYSTEM
------------------------------------------------------------------------

METHOD 1: Windows 1-Click Launcher (Recommended)
  • Just double-click "CONVERTER.bat".
  • It runs a zero-install native server and automatically opens your
    browser at http://localhost:8080/
  • Works on any Windows 11, 10, 8, or 7 computer. No installation needed.

METHOD 2: Direct Double-Click (Offline / Any OS)
  • Double-click "index.html" directly in Chrome, Edge, Firefox, or Brave.
  • The conversion engine runs 100% in your browser.

METHOD 3: Via Local Web Server (XAMPP / Apache / PHP)
  • If running inside XAMPP: http://localhost/webp_converter/
  • If using PHP CLI: Double-click "START_PHP.bat" or run:
      php -S localhost:8080
  • Enables automatic saving of converted WebP files to local "files/" folder.

METHOD 4: Android App
  • Install "PressWebP.apk" directly on your phone or tablet.

------------------------------------------------------------------------
KEY FEATURES: NEWSROOM IMAGE TO WEBP CONVERTER
------------------------------------------------------------------------
  • 1:1 Editorial Ratio Presets:
      - 1:1 News Teaser (720×720) - Standard Web & Video Muxer Match
      - 1:1 Social Feed (1080×1080) - Instagram, X, App feeds
      - 1:1 Mobile Fast (480×480) - Ultra-lightweight (<60KB)
      - 1:1 HQ Feature (1200×1200) - Retina Press wire
      - 1:1 Editorial Grid (600×600) - Story archives & columns
      - 1:1 Byline / Micro (360×360) - Reporter avatars & tickers
  • Editorial Framing Modes:
      - "Crop & Fill" with interactive draggable viewfinder & 9-point alignment
      - "Fit with Blurred Background" (preserves portrait wire photos without black bars)
      - "Fit with Dark Solid Background"
  • Editorial Watermarking & Credit Overlay:
      - Live Breaking News Badge with pulsing indicator
      - Frosted Editorial Glass Pill
      - TV Lower-Third Broadcast Bar
      - Minimalist Corner Shadow
  • Google News SEO Slug Auto-Naming:
      - Turns headline text into Google Discover-compliant filenames
  • Core Web Vitals LCP Optimizer:
      - Live byte savings comparison and LCP speed indicators
      - Lossless mode and compression quality slider (10% - 100%)
  • Batch Multi-Photo Processing:
      - Drag-and-drop or paste (Ctrl+V) multiple photos simultaneously
      - 1-Click "Download All (ZIP)" with built-in pure JS PKZIP generator
      - 1-Click "Auto-Save All to files/"
  • 100% Embargo Safe / Client-Side (No images uploaded to cloud)

------------------------------------------------------------------------
KEY FEATURES: 1:1 VIDEO TO ANIMATED WEBP CONVERTER
------------------------------------------------------------------------
  • 6-Second Standard Duration & 500KB–800KB Target File Size Budget:
      - 📰 6s News Standard (640×640 • 10 FPS • 6s • 500–800 KB) [Default]
      - ⚡ 6s Fast Wire (540×540 • 10 FPS • 6s • ~500 KB)
      - 💎 6s HD News (720×720 • 8 FPS • 6s • ~750 KB)
      - 📱 6s Social Max (720×720 • 10 FPS • 6s • ~800 KB)
  • 1-Click "Auto-Fit 500-800KB" button for instant calibration
  • 1:1 Square Video Cropping & Framing (Interactive drag or alignment presets)
  • Framing Modes: "Crop & Fill 1:1" or "Fit with Blurred Background"
  • Millisecond-accurate video trimming with quick duration chips (3s, 6s, 10s)
  • Real-time animated frame counter & live budget status indicator
  • Live side-by-side comparison (Original Video vs Converted Animated WebP)
  • 1-Click Download and "Copy WebP to Clipboard"
  • Built-in RIFF WebP Inspector to analyze frame chunks and bitrate

------------------------------------------------------------------------
FILES INCLUDED
------------------------------------------------------------------------
  • PressWebP.apk           - Pre-compiled universal Android app
  • BUILD_APK.bat           - 1-click Windows script to rebuild Android APK
  • CONVERTER.bat           - Universal Windows 1-click launcher
  • START_PHP.bat           - Alternate launcher using PHP built-in server
  • server.ps1              - Zero-install Windows HTTP server script
  • index.html              - Dual-mode newsroom application interface
  • style.css               - Editorial dark/light newsroom design system
  • app.js                  - Image & Video processing, framing, cropping engine
  • webp-muxer.js           - Standalone client-side animated WebP muxer
  • save.php                - Local disk auto-save handler for files/
  • sample_news_photo.jpg   - Sample high-res press conference wire photo
  • 1002622311_1x1_6sec.webp - Sample 720x720 10 FPS news agency WebP file
========================================================================

