# PressWebP — Unified Newsroom Media to 1:1 WebP Converter

A high-performance, embargo-safe media optimization workstation built specifically for digital newsrooms, photojournalists, editorial desks, and wire agency websites.

---

## ⚡ Single Unified Media Dropzone (Auto-Detection)

**No separate tabs or converters needed!**
PressWebP features a single, intelligent dropzone that automatically detects what you provide and routes to the correct 1:1 optimization studio:
- **Drop Any Video (MP4 / WebM / MOV)**: Auto-routes to the **1:1 Video Studio** with 6.0s duration trimming, 10 FPS, and calibrated 500 KB – 800 KB file size budget.
- **Drop Any Photo (JPG / PNG / WebP)**: Auto-routes to the **1:1 Editorial Photo Studio** with canonical 1:1 presets (720×720, 1080×1080, etc.), draggable crop viewfinder, and "GROUND ZERO" watermark attribution.
- **Drop Multiple Photos**: Auto-routes to the **1:1 Batch Processing Queue** with 1-click batch conversion, ZIP archive generation, and auto-saving.
- **Drop / Inspect Existing WebP**: Directly inspects RIFF chunks and frame animations.
- **Clipboard Support (`Ctrl+V`)**: Paste image data directly from system clipboard.

---

PressWebP's video engine is calibrated specifically for news website budgets:
- **Standard Duration**: 6.0 seconds (with quick 3s, 6s, 10s cutting).
- **Target File Size**: **500 KB to 800 KB** (strictly enforced via calibrated resolution & quality).
- **1-Click Auto-Fit Budget**: "Auto-Fit 500-800KB" button instantly tunes dimensions (640×640), frame rate (10 FPS), and quality (65%) to ensure the animated WebP lands directly within 500KB–800KB.
- **Editorial Presets**:
  - `📰 6s News Standard`: 640×640 • 10 FPS • 6s (500–800 KB) [Default]
  - `⚡ 6s Fast Wire`: 540×540 • 10 FPS • 6s (~500 KB)
  - `💎 6s HD News`: 720×720 • 8 FPS • 6s (~750 KB)
  - `📱 6s Social Max`: 720×720 • 10 FPS • 6s (~800 KB)

---

## 🌟 What's New: Image to WebP Newsroom Suite

PressWebP now features a full-fledged **Newsroom Image to WebP Converter** alongside the 1:1 Video to Animated WebP engine:

### 1. 1:1 Editorial Ratio Presets
- **1:1 News Teaser (720×720)**: Canonical standard 1:1 square web resolution (matches the animated WebP video standard).
- **1:1 Social Feed (1080×1080)**: High-resolution square for mobile apps, Instagram, X (Twitter), and WhatsApp news channels.
- **1:1 Mobile Fast (480×480)**: Ultra-lightweight card format (<60KB) for instant cellular loading.
- **1:1 HQ Feature (1200×1200)**: Retina display lead photojournalism.
- **1:1 Editorial Grid (600×600)**: Compact editorial story grids and photo archives.
- **1:1 Byline / Micro (360×360)**: Columnist, reporter byline portraits, and breaking alerts.

### 2. Editorial Framing & Interactive Viewfinder
- **Crop & Fill**: Interactive drag-to-reposition framing box with 9-point alignment presets (Top-Center, Center, Rule of Thirds, etc.).
- **Fit with Blurred Background**: Solves vertical / portrait wire photos on landscape news layouts without ugly black bars.
- **Fit with Dark Solid Background**: Clean studio framing.

### 3. Editorial Watermarking & Credit Overlay
- **Live Breaking Badge**: Editorial red banner with live pulse indicator and timestamp.
- **Editorial Glass Pill**: Modern semi-transparent frosted attribution stamp.
- **Lower-Third Broadcast Bar**: TV-style full lower-third banner with agency name and headline.
- **Minimalist Shadow**: Clean watermark for photo archives.

### 4. Google News SEO Auto-Slug Generator
- Type in any article headline (e.g., *"Prime Minister addresses global economic summit"*).
- Automatically formats clean, search-engine-optimized slugs:  
  `prime-minister-addresses-global-economic-summit-2026.webp`
- Maximizes Google Discover, Google News, and image search rankings.

### 5. Core Web Vitals & LCP Optimizer
- Real-time comparison between original JPG/PNG and compressed WebP.
- Shows exact byte savings percentage and Largest Contentful Paint (LCP) speed tier (⚡ Ultra Fast, ✅ Good, ⚠️ Heavy).
- WebP Quality slider (10% - 100%) and Lossless WebP mode.

### 6. Batch Multi-Photo Processing & 1-Click ZIP
- Queue dozens of wire images simultaneously via drag-and-drop or clipboard paste (`Ctrl+V`).
- Sequential batch conversion with real-time progress bar.
- **1-Click Download All (ZIP)**: Built-in pure JavaScript zero-dependency ZIP packager.
- **Auto-Save to `files/`**: Saves directly to server disk under XAMPP / PHP.

---

## 📱 Android App (`PressWebP.apk`)

The complete suite (both Image & Video converters) is packaged natively for Android:
- **APK Location**: `PressWebP.apk` (in the project root)
- **App Name**: PressWebP
- **Package ID**: `com.presswebp.app`
- **Architecture**: Universal (arm64-v8a, armeabi-v7a, x86, x86_64)
- **Engine**: Capacitor Native WebView with Hardware Acceleration (`hardwareAccelerated="true"`)
- **Privacy**: 100% Client-Side / Embargo Safe (no photos or videos are ever uploaded to any third-party cloud)

### How to Install on your Phone
1. Connect your Android phone to your PC via USB or transfer `PressWebP.apk` via Google Drive / WhatsApp / Quick Share.
2. Tap on `PressWebP.apk` on your phone to install.
3. If prompted, allow "Install from Unknown Sources".
4. Open **PressWebP** and convert both images and videos directly on your phone!

### 1-Click Rebuild on Windows
Whenever you update code (`index.html`, `style.css`, or `app.js`):
- Double-click **`BUILD_APK.bat`**.
- It will automatically synchronize your assets and recompile a fresh `PressWebP.apk` in the root directory.

---

## 💻 Running on Desktop / Web

1. **Windows 1-Click**: Double-click `CONVERTER.bat` (opens at `http://localhost:8080/`).
2. **Offline Browser**: Double-click `index.html` in Chrome, Edge, Firefox, or Brave.
3. **Local PHP / XAMPP**: Run `START_PHP.bat` or place in `c:\xampp\htdocs\webp_converter\` and access `http://localhost/webp_converter/` (enables server-side auto-save to `files/`).

