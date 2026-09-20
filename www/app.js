/**
 * PressWebP - Independent 1:1 Video to WebP Converter Application Logic
 * Pure client-side processing for newspaper editorial desks.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropzone = document.getElementById('uploadSection');
    const videoFileInput = document.getElementById('videoFileInput');
    const btnBrowseFiles = document.getElementById('btnBrowseFiles');
    const btnLoadDemoVideo = document.getElementById('btnLoadDemoVideo');
    const btnLoadSampleWebp = document.getElementById('btnLoadSampleWebp');
    const btnInspectSample = document.getElementById('btnInspectSample');

    const studioSection = document.getElementById('studioSection');
    const sourceVideo = document.getElementById('sourceVideo');
    const viewfinderWrapper = document.getElementById('viewfinderWrapper');
    const cropGuideSquare = document.getElementById('cropGuideSquare');
    const videoFileName = document.getElementById('videoFileName');
    const videoNativeRes = document.getElementById('videoNativeRes');
    const videoNativeDuration = document.getElementById('videoNativeDuration');
    const btnChangeVideo = document.getElementById('btnChangeVideo');

    const btnPlayPause = document.getElementById('btnPlayPause');
    const videoScrub = document.getElementById('videoScrub');
    const timecodeDisplay = document.getElementById('timecodeDisplay');

    // Alignment & Framing
    const btnAlignLeft = document.getElementById('btnAlignLeft');
    const btnAlignCenter = document.getElementById('btnAlignCenter');
    const btnAlignRight = document.getElementById('btnAlignRight');
    const modeFillCard = document.getElementById('modeFillCard');
    const modeBlurCard = document.getElementById('modeBlurCard');
    const modeFill = document.getElementById('modeFill');
    const modeBlur = document.getElementById('modeBlur');

    // Settings & Trimming
    const presetCards = document.querySelectorAll('.preset-card');
    const trimStart = document.getElementById('trimStart');
    const trimEnd = document.getElementById('trimEnd');
    const valDuration = document.getElementById('valDuration');
    const btnDur3 = document.getElementById('btnDur3');
    const btnDur6 = document.getElementById('btnDur6');
    const btnDur10 = document.getElementById('btnDur10');
    const btnDurFull = document.getElementById('btnDurFull');
    const btnResetCut = document.getElementById('btnResetCut');

    // Timeline Cutting Controls
    const timelineCutTrack = document.getElementById('timelineCutTrack');
    const timelineCutRange = document.getElementById('timelineCutRange');
    const cutStatusText = document.getElementById('cutStatusText');
    const btnCutIn = document.getElementById('btnCutIn');
    const btnCutOut = document.getElementById('btnCutOut');
    const btnPreviewCut = document.getElementById('btnPreviewCut');

    // Watermark Elements
    const viewfinderWatermark = document.getElementById('viewfinderWatermark');
    const viewfinderWatermarkText = document.getElementById('viewfinderWatermarkText');
    const enableWatermark = document.getElementById('enableWatermark');
    const valWatermarkBadge = document.getElementById('valWatermarkBadge');
    const watermarkConfigPanel = document.getElementById('watermarkConfigPanel');
    const watermarkText = document.getElementById('watermarkText');
    const watermarkPosition = document.getElementById('watermarkPosition');
    const watermarkStyle = document.getElementById('watermarkStyle');
    const watermarkOpacity = document.getElementById('watermarkOpacity');
    const valWatermarkOpacity = document.getElementById('valWatermarkOpacity');

    const resWidth = document.getElementById('resWidth');
    const resHeight = document.getElementById('resHeight');
    const valResolution = document.getElementById('valResolution');
    const fpsRange = document.getElementById('fpsRange');
    const valFps = document.getElementById('valFps');
    const qualityRange = document.getElementById('qualityRange');
    const valQuality = document.getElementById('valQuality');

    const estFrames = document.getElementById('estFrames');
    const estSize = document.getElementById('estSize');
    const btnConvert = document.getElementById('btnConvert');

    // Progress Modal
    const progressOverlay = document.getElementById('progressOverlay');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressStatus = document.getElementById('progressStatus');
    const progressSpeed = document.getElementById('progressSpeed');
    const btnCancelConvert = document.getElementById('btnCancelConvert');

    // Results Section
    const resultsSection = document.getElementById('resultsSection');
    const comparisonVideo = document.getElementById('comparisonVideo');
    const comparisonWebp = document.getElementById('comparisonWebp');
    const origClipSize = document.getElementById('origClipSize');
    const webpResultSize = document.getElementById('webpResultSize');
    const metricSavings = document.getElementById('metricSavings');
    const metricRes = document.getElementById('metricRes');
    const metricFrames = document.getElementById('metricFrames');
    const metricDuration = document.getElementById('metricDuration');
    const btnDownloadWebp = document.getElementById('btnDownloadWebp');
    const btnCopyClipboard = document.getElementById('btnCopyClipboard');
    const btnInspectResult = document.getElementById('btnInspectResult');

    // Auto-Save & New Video Controls
    const autoSaveStatus = document.getElementById('autoSaveStatus');
    const autoSavedPath = document.getElementById('autoSavedPath');
    const btnOpenSavedFile = document.getElementById('btnOpenSavedFile');
    const btnNewVideo = document.getElementById('btnNewVideo');

    const newVideoModal = document.getElementById('newVideoModal');
    const btnCloseNewVideoModal = document.getElementById('btnCloseNewVideoModal');
    const modalSavedPath = document.getElementById('modalSavedPath');
    const btnPromptSelectNew = document.getElementById('btnPromptSelectNew');
    const btnPromptStayReview = document.getElementById('btnPromptStayReview');
    const chkAutoPromptNew = document.getElementById('chkAutoPromptNew');

    // Inspector Modal
    const inspectorModal = document.getElementById('inspectorModal');
    const inspectorModalTitle = document.getElementById('inspectorModalTitle');
    const inspectorContent = document.getElementById('inspectorContent');
    const btnCloseInspector = document.getElementById('btnCloseInspector');
    const toastContainer = document.getElementById('toastContainer');

    // Hidden canvas for frame rendering
    const offscreenCanvas = document.getElementById('offscreenCanvas');
    const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

    // Application State
    let currentVideoFile = null;
    let currentVideoBlobUrl = null;
    let currentWebpBlob = null;
    let currentWebpBlobUrl = null;
    let isConverting = false;
    let cancelRequested = false;

    // Crop Positioning: normalized (0 to 1) offset along the longer axis
    let cropOffsetRatio = 0.5; // default center
    let isDraggingCrop = false;
    let dragStartX = 0;
    let dragStartRatio = 0.5;

    // =========================================================================
    // Toast Notification System
    // =========================================================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '⚠️';
        toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // =========================================================================
    // Video Loading & Ingestion
    // =========================================================================
    btnBrowseFiles.addEventListener('click', () => videoFileInput.click());
    dropzone.addEventListener('click', (e) => {
        if (e.target !== btnBrowseFiles) videoFileInput.click();
    });

    ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('drag-over');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleUploadedFile(files[0]);
        }
    });

    videoFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUploadedFile(e.target.files[0]);
        }
    });

    btnChangeVideo.addEventListener('click', () => videoFileInput.click());

    function handleUploadedFile(file) {
        if (!file) return;

        // If user dropped an existing WebP file, open inspector mode directly
        if (file.name.endsWith('.webp') || file.type === 'image/webp') {
            inspectWebpFile(file);
            return;
        }

        currentVideoFile = file;
        videoFileName.textContent = file.name;
        
        if (currentVideoBlobUrl) {
            URL.revokeObjectURL(currentVideoBlobUrl);
        }
        currentVideoBlobUrl = URL.createObjectURL(file);
        loadVideoSource(currentVideoBlobUrl);
    }

    function loadVideoSource(url) {
        sourceVideo.src = url;
        sourceVideo.load();

        sourceVideo.onloadedmetadata = () => {
            dropzone.classList.add('hidden');
            studioSection.classList.remove('hidden');
            resultsSection.classList.add('hidden');

            const w = sourceVideo.videoWidth;
            const h = sourceVideo.videoHeight;
            const dur = sourceVideo.duration;

            videoNativeRes.textContent = `${w} × ${h}`;
            videoNativeDuration.textContent = formatTime(dur);

            // Configure trimming
            trimStart.value = '0.0';
            const defaultDuration = Math.min(6.0, Math.max(1.0, dur));
            trimEnd.value = defaultDuration.toFixed(1);
            trimStart.max = Math.max(0, dur - 0.2).toFixed(1);
            trimEnd.max = dur.toFixed(1);

            updateTrimmingValues();
            updateTimelineCutTrack();
            updateCropOverlay();
            updateEstimation();
            updateWatermarkPreview();

            // Set comparison video src too
            comparisonVideo.src = url;

            showToast(`Loaded video: ${w}x${h}, ${dur.toFixed(1)}s`, 'success');
        };

        sourceVideo.onerror = () => {
            showToast('Failed to load video file. Please check format.', 'error');
        };
    }

    // =========================================================================
    // News Demo Video Generator (Canvas MediaRecorder)
    // =========================================================================
    btnLoadDemoVideo.addEventListener('click', async () => {
        showToast('Generating newsroom demo video...', 'info');
        const demoBlob = await generateNewsroomDemoVideo();
        const demoFile = new File([demoBlob], 'breaking_news_live_feed.webm', { type: 'video/webm' });
        handleUploadedFile(demoFile);
    });

    function generateNewsroomDemoVideo() {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1280;
            canvas.height = 720;
            const ctx = canvas.getContext('2d');

            const stream = canvas.captureStream(30); // 30 fps
            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };

            recorder.start();

            let startTime = performance.now();
            const totalDuration = 6000; // 6 seconds

            function renderFrame(now) {
                const elapsed = now - startTime;
                if (elapsed >= totalDuration) {
                    recorder.stop();
                    return;
                }

                const t = elapsed / 1000;
                const progress = elapsed / totalDuration;

                // Background gradient with moving light
                const bgGrad = ctx.createRadialGradient(
                    640 + Math.sin(t * 1.5) * 200, 360 + Math.cos(t * 1.5) * 100, 50,
                    640, 360, 800
                );
                bgGrad.addColorStop(0, '#1e293b');
                bgGrad.addColorStop(0.5, '#0f172a');
                bgGrad.addColorStop(1, '#020617');
                ctx.fillStyle = bgGrad;
                ctx.fillRect(0, 0, 1280, 720);

                // Animated Tech Grid
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
                ctx.lineWidth = 1;
                const gridOffset = (t * 30) % 40;
                for (let x = gridOffset; x < 1280; x += 40) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 720);
                    ctx.stroke();
                }
                for (let y = gridOffset; y < 720; y += 40) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(1280, y);
                    ctx.stroke();
                }

                // Central Pulse Rings (Radar / News globe)
                ctx.save();
                ctx.translate(640, 340);
                for (let r = 1; r <= 3; r++) {
                    const radius = ((t * 80 + r * 90) % 300) + 40;
                    const alpha = Math.max(0, 1 - radius / 340);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.7})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, radius, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Rotating News Globe Geometry
                ctx.rotate(t * 0.6);
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(0, 0, 110, 45, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(0, 0, 45, 110, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();

                // Breaking News Top Bar
                ctx.fillStyle = '#dc2626';
                ctx.fillRect(40, 40, 240, 46);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 20px "Outfit", sans-serif';
                ctx.fillText('🔴 BREAKING NEWS', 56, 71);

                // Timecode & Live Badge
                ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                ctx.fillRect(290, 40, 200, 46);
                ctx.fillStyle = '#38bdf8';
                ctx.font = '600 16px "JetBrains Mono", monospace';
                ctx.fillText(`LIVE 00:0${Math.floor(t)}.${Math.floor((t % 1) * 100).toString().padStart(2, '0')}`, 305, 70);

                // Main Headline
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 42px "Outfit", sans-serif';
                ctx.fillText('GLOBAL TECH SUMMIT ANNOUNCEMENT', 80, 520);
                ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.fillText('Live editorial broadcast covering major market transitions and breakthroughs.', 80, 560);

                // Bottom Ticker Banner
                ctx.fillStyle = '#0284c7';
                ctx.fillRect(0, 660, 1280, 60);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 18px "Outfit", sans-serif';
                const tickerText = 'PRESSWIRE: Markets surge on digital media adoption  •  WebP format reduces web bandwidth by up to 80%  •  Instant 1:1 mobile delivery  •  ';
                const tickerX = 1280 - ((t * 140) % (ctx.measureText(tickerText).width + 600));
                ctx.fillText(tickerText.repeat(3), tickerX, 698);

                requestAnimationFrame(renderFrame);
            }

            requestAnimationFrame(renderFrame);
        });
    }

    // =========================================================================
    // Load & Inspect Sample WebP File (1002622311_1x1_6sec.webp)
    // =========================================================================
    btnLoadSampleWebp.addEventListener('click', async () => {
        try {
            showToast('Loading sample 1002622311_1x1_6sec.webp...', 'info');
            const res = await fetch('1002622311_1x1_6sec.webp');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            inspectWebpFile(blob, '1002622311_1x1_6sec.webp');
        } catch (err) {
            if (window.location.protocol === 'file:') {
                showToast('Running via file:// protocol. Run CONVERTER.bat or drop 1002622311_1x1_6sec.webp directly to inspect!', 'info');
            } else {
                showToast('Could not load sample: ' + err.message, 'error');
            }
        }
    });

    btnInspectSample.addEventListener('click', async () => {
        try {
            const res = await fetch('1002622311_1x1_6sec.webp');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            inspectWebpFile(blob, '1002622311_1x1_6sec.webp');
        } catch (err) {
            if (window.location.protocol === 'file:') {
                showToast('Running via file:// protocol. Run CONVERTER.bat or drop 1002622311_1x1_6sec.webp directly to inspect!', 'info');
            } else {
                showToast('Could not load sample: ' + err.message, 'error');
            }
        }
    });

    async function inspectWebpFile(fileOrBlob, filename = null) {
        const name = filename || fileOrBlob.name || 'sample.webp';
        const buffer = await fileOrBlob.arrayBuffer();
        try {
            const info = WebPMuxer.inspect(buffer);
            renderInspectorModal(info, name, fileOrBlob);
        } catch (err) {
            showToast('WebP Inspection error: ' + err.message, 'error');
        }
    }

    function renderInspectorModal(info, filename, blob) {
        inspectorModalTitle.textContent = `RIFF WebP Inspector: ${filename}`;
        
        const blobUrl = URL.createObjectURL(blob);
        const sizeFormatted = (info.fileSize / (1024 * 1024)).toFixed(2) + ' MB (' + info.fileSize.toLocaleString() + ' bytes)';

        inspectorContent.innerHTML = `
            <div style="display: flex; gap: 20px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div style="width: 160px; height: 160px; background: #000; border-radius: 8px; border: 1px solid var(--border-subtle); overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img src="${blobUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <div style="flex: 1; min-width: 240px;">
                    <h4 style="font-size: 16px; margin-bottom: 6px;">${filename}</h4>
                    <p style="color: var(--brand-emerald); font-size: 13px; font-weight: 600; margin-bottom: 4px;">
                        ${info.isSquare ? '✅ Exact 1:1 Aspect Ratio' : '⚠️ Non-square format'}
                    </p>
                    <p style="color: var(--text-secondary); font-size: 13px;">
                        ${info.isAnimated ? 'Animated WebP Container' : 'Static WebP Image'}
                    </p>
                </div>
            </div>

            <table class="inspector-table">
                <thead>
                    <tr>
                        <th>Specification</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Canvas Dimensions</td>
                        <td class="mono">${info.canvasWidth} × ${info.canvasHeight} px (${info.aspectRatio}:1)</td>
                    </tr>
                    <tr>
                        <td>File Size</td>
                        <td class="mono">${sizeFormatted}</td>
                    </tr>
                    <tr>
                        <td>Total Animated Frames</td>
                        <td class="mono">${info.frameCount} frames</td>
                    </tr>
                    <tr>
                        <td>Average Frame Rate</td>
                        <td class="mono">${info.avgFps} FPS (Duration: ${info.totalDurationSec}s)</td>
                    </tr>
                    <tr>
                        <td>Loop Configuration</td>
                        <td class="mono">${info.loopCount}</td>
                    </tr>
                    <tr>
                        <td>Alpha Channel</td>
                        <td class="mono">${info.hasAlpha ? 'Enabled (VP8X bit 4)' : 'Disabled'}</td>
                    </tr>
                    <tr>
                        <td>RIFF Chunks Summary</td>
                        <td style="font-size: 11.5px; color: var(--text-muted);">${info.chunksSummary}</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
                <button id="btnApplySamplePreset" class="btn btn-primary btn-sm">
                    🎯 Apply 720×720 10FPS Profile
                </button>
            </div>
        `;

        inspectorModal.classList.add('active');

        document.getElementById('btnApplySamplePreset').addEventListener('click', () => {
            selectPreset('presetSample');
            inspectorModal.classList.remove('active');
            showToast('Applied 720×720 10 FPS profile', 'success');
        });
    }

    btnCloseInspector.addEventListener('click', () => {
        inspectorModal.classList.remove('active');
    });

    inspectorModal.addEventListener('click', (e) => {
        if (e.target === inspectorModal) inspectorModal.classList.remove('active');
    });

    // =========================================================================
    // 1:1 Aspect Ratio Cropping & Viewfinder Mechanics
    // =========================================================================
    function updateCropOverlay() {
        if (!sourceVideo.videoWidth || !sourceVideo.videoHeight) return;

        const containerRect = viewfinderWrapper.getBoundingClientRect();
        const vW = sourceVideo.videoWidth;
        const vH = sourceVideo.videoHeight;

        // Calculate actual rendered dimensions of the video inside the container (object-fit: contain)
        const containerAspect = containerRect.width / containerRect.height;
        const videoAspect = vW / vH;

        let renderedW, renderedH, renderLeft, renderTop;

        if (videoAspect > containerAspect) {
            renderedW = containerRect.width;
            renderedH = containerRect.width / videoAspect;
            renderLeft = 0;
            renderTop = (containerRect.height - renderedH) / 2;
        } else {
            renderedH = containerRect.height;
            renderedW = containerRect.height * videoAspect;
            renderTop = 0;
            renderLeft = (containerRect.width - renderedW) / 2;
        }

        // The 1:1 Square Crop guide size is min(renderedW, renderedH)
        const squareSize = Math.min(renderedW, renderedH);

        let left, top;
        if (videoAspect >= 1.0) {
            // Landscape video: square can move horizontally
            const maxTravel = renderedW - squareSize;
            left = renderLeft + (maxTravel * cropOffsetRatio);
            top = renderTop;
        } else {
            // Portrait video: square can move vertically
            const maxTravel = renderedH - squareSize;
            left = renderLeft;
            top = renderTop + (maxTravel * cropOffsetRatio);
        }

        cropGuideSquare.style.width = `${squareSize}px`;
        cropGuideSquare.style.height = `${squareSize}px`;
        cropGuideSquare.style.left = `${left}px`;
        cropGuideSquare.style.top = `${top}px`;
    }

    window.addEventListener('resize', updateCropOverlay);

    // Interactive Dragging on the Crop Viewfinder
    cropGuideSquare.addEventListener('mousedown', (e) => {
        isDraggingCrop = true;
        dragStartX = e.clientX;
        dragStartRatio = cropOffsetRatio;
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingCrop) return;
        const containerRect = viewfinderWrapper.getBoundingClientRect();
        const deltaX = e.clientX - dragStartX;
        const ratioDelta = deltaX / (containerRect.width * 0.5);
        cropOffsetRatio = Math.max(0, Math.min(1, dragStartRatio + ratioDelta));
        updateCropOverlay();
        updateAlignmentButtonsState();
    });

    window.addEventListener('mouseup', () => {
        isDraggingCrop = false;
    });

    // Touch support for drag
    cropGuideSquare.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            isDraggingCrop = true;
            dragStartX = e.touches[0].clientX;
            dragStartRatio = cropOffsetRatio;
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDraggingCrop || e.touches.length === 0) return;
        const containerRect = viewfinderWrapper.getBoundingClientRect();
        const deltaX = e.touches[0].clientX - dragStartX;
        const ratioDelta = deltaX / (containerRect.width * 0.5);
        cropOffsetRatio = Math.max(0, Math.min(1, dragStartRatio + ratioDelta));
        updateCropOverlay();
        updateAlignmentButtonsState();
    });

    window.addEventListener('touchend', () => {
        isDraggingCrop = false;
    });

    // Quick Alignment Buttons
    btnAlignLeft.addEventListener('click', () => {
        cropOffsetRatio = 0.25;
        updateCropOverlay();
        updateAlignmentButtonsState();
    });

    btnAlignCenter.addEventListener('click', () => {
        cropOffsetRatio = 0.5;
        updateCropOverlay();
        updateAlignmentButtonsState();
    });

    btnAlignRight.addEventListener('click', () => {
        cropOffsetRatio = 0.75;
        updateCropOverlay();
        updateAlignmentButtonsState();
    });

    function updateAlignmentButtonsState() {
        btnAlignLeft.classList.toggle('active', Math.abs(cropOffsetRatio - 0.25) < 0.1);
        btnAlignCenter.classList.toggle('active', Math.abs(cropOffsetRatio - 0.5) < 0.1);
        btnAlignRight.classList.toggle('active', Math.abs(cropOffsetRatio - 0.75) < 0.1);
    }

    // Framing Style (Fill vs Blur)
    modeFillCard.addEventListener('click', () => {
        modeFill.checked = true;
        modeFillCard.classList.add('active');
        modeBlurCard.classList.remove('active');
        cropGuideSquare.classList.remove('framing-blur');
        cropGuideSquare.style.display = 'block';
    });

    modeBlurCard.addEventListener('click', () => {
        modeBlur.checked = true;
        modeBlurCard.classList.add('active');
        modeFillCard.classList.remove('active');
        cropGuideSquare.classList.add('framing-blur');
        cropGuideSquare.style.display = 'block';
    });

    // =========================================================================
    // Video Player & Scrubbing
    // =========================================================================
    let isPlayingCutPreview = false;

    btnPlayPause.addEventListener('click', () => {
        if (sourceVideo.paused) {
            const sTime = parseFloat(trimStart.value) || 0;
            const eTime = parseFloat(trimEnd.value) || sourceVideo.duration;
            if (sourceVideo.currentTime < sTime || sourceVideo.currentTime >= eTime) {
                sourceVideo.currentTime = sTime;
            }
            sourceVideo.play();
            btnPlayPause.textContent = '⏸ Pause';
        } else {
            sourceVideo.pause();
            btnPlayPause.textContent = '▶ Play';
            if (isPlayingCutPreview) {
                isPlayingCutPreview = false;
                if (btnPreviewCut) btnPreviewCut.classList.remove('active-preview');
            }
        }
    });

    sourceVideo.addEventListener('timeupdate', () => {
        // Critical: Never interfere while conversion engine is capturing frames!
        if (isConverting) return;

        const sTime = parseFloat(trimStart.value) || 0;
        const eTime = parseFloat(trimEnd.value) || sourceVideo.duration;

        // Loop within trimmed boundary
        if (sourceVideo.currentTime >= eTime) {
            sourceVideo.currentTime = sTime;
        } else if (sourceVideo.currentTime < sTime && !sourceVideo.paused) {
            sourceVideo.currentTime = sTime;
        }

        const dur = sourceVideo.duration || 1;
        const pct = (sourceVideo.currentTime / dur) * 100;
        videoScrub.value = pct;
        timecodeDisplay.textContent = `${formatTime(sourceVideo.currentTime)} / ${formatTime(dur)}`;
    });

    videoScrub.addEventListener('input', () => {
        if (!sourceVideo.duration) return;
        const seekTime = (videoScrub.value / 100) * sourceVideo.duration;
        sourceVideo.currentTime = seekTime;
        timecodeDisplay.textContent = `${formatTime(seekTime)} / ${formatTime(sourceVideo.duration)}`;
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    // =========================================================================
    // Trimming, Cutting & Duration Controls
    // =========================================================================
    trimStart.addEventListener('input', () => {
        let s = Math.max(0, parseFloat(trimStart.value) || 0);
        if (sourceVideo.duration) {
            s = Math.min(s, sourceVideo.duration - 0.2);
            sourceVideo.currentTime = s;
        }
        updateTrimmingValues();
    });

    trimEnd.addEventListener('input', () => {
        let e = parseFloat(trimEnd.value) || 6.0;
        if (sourceVideo.duration) {
            e = Math.min(e, sourceVideo.duration);
            sourceVideo.currentTime = e;
        }
        updateTrimmingValues();
    });

    // ✂️ Cut In (Start) button
    if (btnCutIn) {
        btnCutIn.addEventListener('click', () => {
            if (!sourceVideo.duration) return;
            const cur = Math.max(0, sourceVideo.currentTime);
            trimStart.value = cur.toFixed(1);
            let e = parseFloat(trimEnd.value) || sourceVideo.duration;
            if (e <= cur + 0.2) {
                trimEnd.value = Math.min(sourceVideo.duration, cur + 3.0).toFixed(1);
            }
            updateTrimmingValues();
            showToast(`✂️ Cut Start set to ${cur.toFixed(1)}s`, 'info');
        });
    }

    // ✂️ Cut Out (End) button
    if (btnCutOut) {
        btnCutOut.addEventListener('click', () => {
            if (!sourceVideo.duration) return;
            const cur = Math.min(sourceVideo.duration, sourceVideo.currentTime);
            let s = parseFloat(trimStart.value) || 0;
            if (cur <= s + 0.2) {
                trimStart.value = Math.max(0, cur - 3.0).toFixed(1);
            }
            trimEnd.value = cur.toFixed(1);
            updateTrimmingValues();
            showToast(`✂️ Cut End set to ${cur.toFixed(1)}s`, 'info');
        });
    }

    // 🔁 Preview Cut Segment
    if (btnPreviewCut) {
        btnPreviewCut.addEventListener('click', () => {
            if (!sourceVideo.duration) return;
            const sTime = Math.max(0, parseFloat(trimStart.value) || 0);
            sourceVideo.currentTime = sTime;
            isPlayingCutPreview = true;
            btnPreviewCut.classList.add('active-preview');
            sourceVideo.play();
            btnPlayPause.textContent = '⏸ Pause';
        });
    }

    // ↺ Reset Cut button
    if (btnResetCut) {
        btnResetCut.addEventListener('click', () => {
            if (!sourceVideo.duration) return;
            trimStart.value = '0.0';
            trimEnd.value = sourceVideo.duration.toFixed(1);
            updateTrimmingValues();
            showToast('Cut range reset to full video', 'info');
        });
    }

    btnDur3.addEventListener('click', () => setTrimDuration(3.0));
    btnDur6.addEventListener('click', () => setTrimDuration(6.0));
    btnDur10.addEventListener('click', () => setTrimDuration(10.0));
    btnDurFull.addEventListener('click', () => {
        trimStart.value = '0.0';
        trimEnd.value = (sourceVideo.duration || 6.0).toFixed(1);
        updateTrimmingValues();
    });

    function setTrimDuration(seconds) {
        if (!sourceVideo.duration) return;
        const dur = Math.min(seconds, sourceVideo.duration);
        const start = parseFloat(trimStart.value) || 0;
        if (start + dur <= sourceVideo.duration) {
            trimEnd.value = (start + dur).toFixed(1);
        } else {
            trimEnd.value = sourceVideo.duration.toFixed(1);
            trimStart.value = Math.max(0, sourceVideo.duration - dur).toFixed(1);
        }
        updateTrimmingValues();
    }

    function updateTrimmingValues() {
        let maxDur = sourceVideo.duration || 100;
        let s = Math.max(0, parseFloat(trimStart.value) || 0);
        let e = Math.min(maxDur, parseFloat(trimEnd.value) || 6.0);
        if (e <= s) e = Math.min(maxDur, s + 0.5);

        const duration = Math.max(0.1, e - s);
        valDuration.textContent = `${duration.toFixed(1)} sec`;

        // Highlight active duration chip
        btnDur3.classList.toggle('active', Math.abs(duration - 3.0) < 0.2);
        btnDur6.classList.toggle('active', Math.abs(duration - 6.0) < 0.2);
        btnDur10.classList.toggle('active', Math.abs(duration - 10.0) < 0.2);
        btnDurFull.classList.toggle('active', Math.abs(duration - (sourceVideo.duration || 0)) < 0.2);

        updateTimelineCutTrack();
        updateEstimation();
    }

    function updateTimelineCutTrack() {
        if (!timelineCutRange) return;
        const totalDur = sourceVideo.duration || 6.0;
        const s = Math.max(0, parseFloat(trimStart.value) || 0);
        const e = Math.min(totalDur, parseFloat(trimEnd.value) || totalDur);
        const duration = Math.max(0.1, e - s);

        const leftPct = (s / totalDur) * 100;
        const widthPct = (duration / totalDur) * 100;

        timelineCutRange.style.left = `${Math.max(0, Math.min(100, leftPct)).toFixed(2)}%`;
        timelineCutRange.style.width = `${Math.max(1, Math.min(100 - leftPct, widthPct)).toFixed(2)}%`;

        if (cutStatusText) {
            cutStatusText.textContent = `Cut: ${s.toFixed(1)}s – ${e.toFixed(1)}s (${duration.toFixed(1)}s)`;
        }
    }

    // =========================================================================
    // Editorial Watermark Controls & Live Viewfinder Preview
    // =========================================================================
    function updateWatermarkPreview() {
        if (!viewfinderWatermark) return;

        const enabled = enableWatermark ? enableWatermark.checked : true;
        if (!enabled) {
            viewfinderWatermark.classList.add('hidden');
            if (valWatermarkBadge) valWatermarkBadge.textContent = 'Disabled';
            if (watermarkConfigPanel) watermarkConfigPanel.classList.add('disabled');
            return;
        }

        viewfinderWatermark.classList.remove('hidden');
        if (watermarkConfigPanel) watermarkConfigPanel.classList.remove('disabled');

        const text = (watermarkText ? watermarkText.value : 'GROUND ZERO').trim();
        const displayText = text || 'GROUND ZERO';

        if (viewfinderWatermarkText) {
            viewfinderWatermarkText.textContent = displayText;
        }
        if (valWatermarkBadge) {
            valWatermarkBadge.textContent = displayText;
        }

        const pos = (watermarkPosition ? watermarkPosition.value : 'bottom-right');
        const style = (watermarkStyle ? watermarkStyle.value : 'badge');
        viewfinderWatermark.className = `viewfinder-watermark-overlay pos-${pos} style-${style}`;

        const opVal = watermarkOpacity ? (parseInt(watermarkOpacity.value, 10) || 85) : 85;
        viewfinderWatermark.style.opacity = (opVal / 100).toString();
        if (valWatermarkOpacity) valWatermarkOpacity.textContent = `${opVal}%`;
    }

    if (enableWatermark) enableWatermark.addEventListener('change', updateWatermarkPreview);
    if (watermarkText) watermarkText.addEventListener('input', updateWatermarkPreview);
    if (watermarkPosition) watermarkPosition.addEventListener('change', updateWatermarkPreview);
    if (watermarkStyle) watermarkStyle.addEventListener('change', updateWatermarkPreview);
    if (watermarkOpacity) watermarkOpacity.addEventListener('input', updateWatermarkPreview);

    // =========================================================================
    // Presets & Settings
    // =========================================================================
    presetCards.forEach(card => {
        card.addEventListener('click', () => {
            selectPreset(card.id);
        });
    });

    function selectPreset(presetId) {
        presetCards.forEach(c => c.classList.remove('active'));
        const target = document.getElementById(presetId);
        if (!target) return;
        target.classList.add('active');

        const w = parseInt(target.dataset.w, 10);
        const h = parseInt(target.dataset.h, 10);
        const fps = parseInt(target.dataset.fps, 10);
        const q = parseInt(target.dataset.q, 10);
        const dur = parseFloat(target.dataset.dur);

        resWidth.value = w;
        resHeight.value = h;
        valResolution.textContent = `${w} × ${h}`;

        fpsRange.value = fps;
        valFps.textContent = `${fps} FPS`;

        qualityRange.value = q;
        valQuality.textContent = `${q}%`;

        if (sourceVideo.duration) {
            setTrimDuration(dur);
        }
        updateEstimation();
    }

    resWidth.addEventListener('input', () => {
        resHeight.value = resWidth.value; // Enforce 1:1 Square
        valResolution.textContent = `${resWidth.value} × ${resHeight.value}`;
        updateEstimation();
    });

    resHeight.addEventListener('input', () => {
        resWidth.value = resHeight.value; // Enforce 1:1 Square
        valResolution.textContent = `${resWidth.value} × ${resHeight.value}`;
        updateEstimation();
    });

    fpsRange.addEventListener('input', () => {
        valFps.textContent = `${fpsRange.value} FPS`;
        updateEstimation();
    });

    qualityRange.addEventListener('input', () => {
        valQuality.textContent = `${qualityRange.value}%`;
        updateEstimation();
    });

    function updateEstimation() {
        const s = parseFloat(trimStart.value) || 0;
        const e = parseFloat(trimEnd.value) || 6.0;
        const duration = Math.max(0.1, e - s);
        const fps = parseInt(fpsRange.value, 10) || 10;
        const frames = Math.round(duration * fps);
        const w = parseInt(resWidth.value, 10) || 720;
        const q = parseInt(qualityRange.value, 10) || 75;

        estFrames.textContent = `${frames} frames (${duration.toFixed(1)}s @ ${fps}fps)`;

        // Heuristic size estimation based on sample 720x720 10fps @ 75% being ~45KB per frame
        const areaFactor = (w * w) / (720 * 720);
        const qualityFactor = (q / 75) ** 1.3;
        const avgFrameKb = 42 * areaFactor * qualityFactor;
        const totalEstimatedKb = frames * avgFrameKb;

        if (totalEstimatedKb > 1024) {
            const minMb = (totalEstimatedKb * 0.85 / 1024).toFixed(1);
            const maxMb = (totalEstimatedKb * 1.15 / 1024).toFixed(1);
            estSize.textContent = `~${minMb} MB – ${maxMb} MB`;
        } else {
            estSize.textContent = `~${Math.round(totalEstimatedKb)} KB`;
        }
    }

    // =========================================================================
    // High-Performance Conversion Engine
    // =========================================================================
    btnConvert.addEventListener('click', async () => {
        if (!sourceVideo.videoWidth || !sourceVideo.videoHeight) {
            showToast('Please load a video first', 'error');
            return;
        }

        if (isConverting) return;
        isConverting = true;
        cancelRequested = false;

        sourceVideo.pause();
        btnPlayPause.textContent = '▶ Play';

        // Prepare cutting and duration parameters
        const sTime = Math.max(0, parseFloat(trimStart.value) || 0);
        const rawETime = parseFloat(trimEnd.value);
        const eTime = isNaN(rawETime) || rawETime <= sTime
            ? Math.min(sourceVideo.duration || 6.0, sTime + 6.0)
            : Math.min(sourceVideo.duration || rawETime, rawETime);
        const duration = Math.max(0.2, eTime - sTime);
        const fps = parseInt(fpsRange.value, 10) || 10;
        const totalFrames = Math.max(1, Math.round(duration * fps));
        const frameDurationMs = 1000 / fps;

        const targetW = parseInt(resWidth.value, 10) || 720;
        const targetH = parseInt(resHeight.value, 10) || 720;
        const quality = (parseInt(qualityRange.value, 10) || 75) / 100;
        const isBlurMode = modeBlur.checked;

        // Watermark Configuration
        const watermarkOpts = {
            enabled: enableWatermark ? enableWatermark.checked : true,
            text: (watermarkText ? watermarkText.value : 'GROUND ZERO').trim() || 'GROUND ZERO',
            position: watermarkPosition ? watermarkPosition.value : 'bottom-right',
            style: watermarkStyle ? watermarkStyle.value : 'badge',
            opacity: watermarkOpacity ? (parseInt(watermarkOpacity.value, 10) || 85) : 85
        };

        // Set offscreen canvas dimensions
        offscreenCanvas.width = targetW;
        offscreenCanvas.height = targetH;

        // Setup WebPMuxer instance
        const muxer = new WebPMuxer({
            width: targetW,
            height: targetH,
            loopCount: 0 // infinite loop standard
        });

        // Open progress overlay
        progressOverlay.classList.add('active');
        progressBarFill.style.width = '0%';
        progressPercent.textContent = '0%';
        progressStatus.textContent = `Extracting ${totalFrames} frames from ${sTime.toFixed(1)}s to ${eTime.toFixed(1)}s...`;
        progressSpeed.textContent = 'Starting...';

        const startTimeEpoch = performance.now();

        try {
            // Source video native dimensions
            const vW = sourceVideo.videoWidth;
            const vH = sourceVideo.videoHeight;

            // Compute Crop Source Coordinates for 1:1 Aspect Ratio
            let sx, sy, sWidth, sHeight;
            if (vW >= vH) {
                // Landscape video: square crop height = vH, width = vH
                sHeight = vH;
                sWidth = vH;
                sy = 0;
                const maxTravel = vW - vH;
                sx = maxTravel * cropOffsetRatio;
            } else {
                // Portrait video: square crop width = vW, height = vW
                sWidth = vW;
                sHeight = vW;
                sx = 0;
                const maxTravel = vH - vW;
                sy = maxTravel * cropOffsetRatio;
            }

            // Frame extraction loop spanning strictly between [sTime, eTime]
            for (let i = 0; i < totalFrames; i++) {
                if (cancelRequested) {
                    throw new Error('Conversion cancelled by user.');
                }

                const frameFraction = totalFrames > 1 ? (i / (totalFrames - 1)) : 0;
                const targetTime = sTime + (frameFraction * duration);

                // Seek with bulletproof readiness check
                await seekVideoToTime(sourceVideo, targetTime);

                // Render frame onto target canvas
                offscreenCtx.clearRect(0, 0, targetW, targetH);

                if (isBlurMode) {
                    // 1:1 Contain with blurred background
                    offscreenCtx.save();
                    offscreenCtx.filter = 'blur(20px) brightness(0.65) saturate(1.3)';
                    offscreenCtx.drawImage(sourceVideo, -20, -20, targetW + 40, targetH + 40);
                    offscreenCtx.restore();

                    // Draw centered aspect-fit video
                    const scale = Math.min(targetW / vW, targetH / vH);
                    const fitW = vW * scale;
                    const fitH = vH * scale;
                    const fitX = (targetW - fitW) / 2;
                    const fitY = (targetH - fitH) / 2;
                    offscreenCtx.drawImage(sourceVideo, fitX, fitY, fitW, fitH);
                } else {
                    // Exact 1:1 Crop & Fill
                    offscreenCtx.drawImage(sourceVideo, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
                }

                // Apply Editorial Watermark (e.g. "GROUND ZERO") onto frame
                if (watermarkOpts.enabled) {
                    drawWatermarkOnCanvas(offscreenCtx, targetW, targetH, watermarkOpts);
                }

                // Encode canvas frame to WebP blob
                const frameBlob = await new Promise((res) => {
                    offscreenCanvas.toBlob(res, 'image/webp', quality);
                });

                if (!frameBlob) {
                    throw new Error(`Failed to encode frame ${i + 1} to WebP.`);
                }

                // Add to WebPMuxer
                await muxer.addFrameFromBlob(frameBlob, frameDurationMs);

                // Update Progress UI
                const currentFrameNum = i + 1;
                const pct = Math.round((currentFrameNum / totalFrames) * 100);
                progressBarFill.style.width = `${pct}%`;
                progressPercent.textContent = `${pct}%`;
                progressStatus.textContent = `Encoding frame ${currentFrameNum} of ${totalFrames} (${targetTime.toFixed(2)}s)`;

                const elapsedSec = (performance.now() - startTimeEpoch) / 1000;
                const fpsSpeed = (currentFrameNum / elapsedSec).toFixed(1);
                const etaSec = ((totalFrames - currentFrameNum) / (currentFrameNum / elapsedSec)).toFixed(1);
                progressSpeed.textContent = `${fpsSpeed} FPS • ETA: ${etaSec}s`;

                // Yield to browser UI thread
                await new Promise(r => setTimeout(r, 0));
            }

            // Build Animated WebP binary
            progressStatus.textContent = 'Muxing WebP RIFF container...';
            const finalWebpBlob = muxer.buildBlob();

            // Set Results & Trigger Auto-Save
            await handleConversionSuccess(finalWebpBlob, {
                width: targetW,
                height: targetH,
                frames: totalFrames,
                fps: fps,
                duration: duration
            });

        } catch (err) {
            if (!cancelRequested) {
                showToast(`Conversion failed: ${err.message}`, 'error');
            } else {
                showToast('Conversion cancelled.', 'info');
            }
        } finally {
            isConverting = false;
            progressOverlay.classList.remove('active');
        }
    });

    btnCancelConvert.addEventListener('click', () => {
        cancelRequested = true;
    });

    /**
     * Bulletproof video seeker ensuring frame decoding readiness
     */
    function seekVideoToTime(video, targetTime) {
        return new Promise((resolve) => {
            const clamped = Math.max(0, Math.min(video.duration || 10000, targetTime));
            
            // If already at target time, ensure frame is rendered and resolve immediately
            if (Math.abs(video.currentTime - clamped) < 0.003) {
                if ('requestVideoFrameCallback' in video) {
                    video.requestVideoFrameCallback(() => resolve());
                } else {
                    requestAnimationFrame(() => resolve());
                }
                return;
            }

            let resolved = false;
            const finish = () => {
                if (resolved) return;
                resolved = true;
                video.removeEventListener('seeked', onSeeked);
                video.removeEventListener('error', onError);
                resolve();
            };

            const onSeeked = () => {
                if ('requestVideoFrameCallback' in video) {
                    video.requestVideoFrameCallback(() => finish());
                } else {
                    requestAnimationFrame(() => finish());
                }
            };

            const onError = () => finish();

            video.addEventListener('seeked', onSeeked, { once: true });
            video.addEventListener('error', onError, { once: true });

            setTimeout(finish, 400); // safety fallback

            video.currentTime = clamped;
        });
    }

    /**
     * Stamp editorial watermark ("GROUND ZERO") on canvas frame
     */
    function drawWatermarkOnCanvas(ctx, canvasW, canvasH, options) {
        if (!options || !options.enabled) return;
        const text = (options.text || 'GROUND ZERO').trim();
        if (!text) return;

        const style = options.style || 'badge'; // 'badge', 'pill', 'shadow'
        const position = options.position || 'bottom-right';
        const opacity = Math.max(0.1, Math.min(1, (options.opacity || 85) / 100));

        ctx.save();
        ctx.globalAlpha = opacity;

        // Scale font size proportionally to canvas dimensions (base 22px on 720px)
        const scale = canvasW / 720;
        const fontSize = Math.max(12, Math.round(22 * scale));
        ctx.font = `800 ${fontSize}px "Outfit", "Plus Jakarta Sans", "Inter", -apple-system, sans-serif`;
        ctx.textBaseline = 'middle';

        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;

        const dotSize = Math.max(5, Math.round(8 * scale));
        const padX = Math.round(14 * scale);
        const padY = Math.round(8 * scale);
        const dotMargin = (style === 'badge' || style === 'pill') ? Math.round(8 * scale) : 0;
        const totalContentWidth = (style === 'badge' || style === 'pill') ? (dotSize + dotMargin + textWidth) : textWidth;
        const boxWidth = totalContentWidth + (padX * 2);
        const boxHeight = fontSize + (padY * 2);

        const margin = Math.round(22 * scale);
        let boxX, boxY;

        switch (position) {
            case 'bottom-left':
                boxX = margin;
                boxY = canvasH - boxHeight - margin;
                break;
            case 'top-right':
                boxX = canvasW - boxWidth - margin;
                boxY = margin;
                break;
            case 'top-left':
                boxX = margin;
                boxY = margin;
                break;
            case 'center':
                boxX = (canvasW - boxWidth) / 2;
                boxY = (canvasH - boxHeight) / 2;
                break;
            case 'bottom-right':
            default:
                boxX = canvasW - boxWidth - margin;
                boxY = canvasH - boxHeight - margin;
                break;
        }

        const drawRoundedRect = (x, y, w, h, radius) => {
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(x, y, w, h, radius);
            } else {
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + w - radius, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
                ctx.lineTo(x + w, y + h - radius);
                ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
                ctx.lineTo(x + radius, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
            }
        };

        if (style === 'badge') {
            // Newsroom Live Badge (Black glass background with red live dot)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.lineWidth = Math.max(1, 1.5 * scale);
            
            const r = Math.round(5 * scale);
            drawRoundedRect(boxX, boxY, boxWidth, boxHeight, r);
            ctx.fill();
            ctx.stroke();

            // Red live broadcast dot
            const dotCenterX = boxX + padX + (dotSize / 2);
            const dotCenterY = boxY + (boxHeight / 2);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(dotCenterX, dotCenterY, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // Watermark text
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 4 * scale;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(text, boxX + padX + dotSize + dotMargin, boxY + (boxHeight / 2));

        } else if (style === 'pill') {
            // High-tech editorial pill with cyan border
            ctx.fillStyle = 'rgba(14, 20, 36, 0.88)';
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.lineWidth = Math.max(1, 1.5 * scale);

            const r = boxHeight / 2;
            drawRoundedRect(boxX, boxY, boxWidth, boxHeight, r);
            ctx.fill();
            ctx.stroke();

            // Cyan dot
            const dotCenterX = boxX + padX + (dotSize / 2);
            const dotCenterY = boxY + (boxHeight / 2);
            ctx.fillStyle = '#06b6d4';
            ctx.beginPath();
            ctx.arc(dotCenterX, dotCenterY, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // Text
            ctx.fillStyle = '#f8fafc';
            ctx.fillText(text, boxX + padX + dotSize + dotMargin, boxY + (boxHeight / 2));

        } else {
            // Shadowed embossed text (No bounding box)
            ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
            ctx.shadowBlur = 8 * scale;
            ctx.shadowOffsetX = 2 * scale;
            ctx.shadowOffsetY = 2 * scale;
            ctx.fillStyle = '#ffffff';
            ctx.fillText(text, boxX + padX, boxY + (boxHeight / 2));
        }

        ctx.restore();
    }

    // =========================================================================
    // Results & Editorial Comparison
    // =========================================================================
    async function handleConversionSuccess(webpBlob, meta) {
        currentWebpBlob = webpBlob;
        if (currentWebpBlobUrl) {
            URL.revokeObjectURL(currentWebpBlobUrl);
        }
        currentWebpBlobUrl = URL.createObjectURL(webpBlob);

        // Display results
        comparisonWebp.src = currentWebpBlobUrl;
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        // Update comparison video loop slice
        const sTime = Math.max(0, parseFloat(trimStart.value) || 0);
        const eTime = parseFloat(trimEnd.value) || sourceVideo.duration;
        comparisonVideo.removeAttribute('loop');
        comparisonVideo.currentTime = sTime;
        comparisonVideo.ontimeupdate = () => {
            if (comparisonVideo.currentTime >= eTime || comparisonVideo.currentTime < sTime) {
                comparisonVideo.currentTime = sTime;
            }
        };
        comparisonVideo.play().catch(() => {});

        // File size metrics
        const webpBytes = webpBlob.size;
        const webpMb = (webpBytes / (1024 * 1024)).toFixed(2);
        webpResultSize.textContent = `${webpMb} MB`;

        const origBytes = currentVideoFile ? currentVideoFile.size : webpBytes * 4;
        const origMb = (origBytes / (1024 * 1024)).toFixed(2);
        origClipSize.textContent = `${origMb} MB`;

        const savingsPct = Math.max(0, Math.round(((origBytes - webpBytes) / origBytes) * 100));
        metricSavings.textContent = `-${savingsPct}%`;
        metricRes.textContent = `${meta.width} × ${meta.height}`;
        metricFrames.textContent = `${meta.frames} @ ${meta.fps} FPS`;
        metricDuration.textContent = `${meta.duration.toFixed(2)} sec`;

        showToast(`WebP conversion finished! Size: ${webpMb} MB`, 'success');

        // Automatically save to files/ directory
        const filename = getWebpFilename();
        showToast('Auto-saving WebP to files/...', 'info');

        const saveResult = await saveWebpToFiles(webpBlob, filename);
        if (saveResult.success) {
            if (autoSavedPath) autoSavedPath.textContent = saveResult.path;
            if (modalSavedPath) modalSavedPath.textContent = saveResult.path;
            if (btnOpenSavedFile) {
                if (saveResult.url) {
                    btnOpenSavedFile.href = saveResult.url;
                    btnOpenSavedFile.style.display = 'inline-block';
                } else {
                    btnOpenSavedFile.style.display = 'none';
                }
            }
            showToast(`Auto-saved to ${saveResult.path}`, 'success');
        } else {
            if (autoSavedPath) autoSavedPath.textContent = `Failed auto-saving to files/`;
            showToast('Auto-save to files/ failed. Use manual download button.', 'error');
        }

        // Ask for new video: check user auto-prompt preference
        const shouldPrompt = chkAutoPromptNew ? chkAutoPromptNew.checked : true;
        if (shouldPrompt && newVideoModal) {
            setTimeout(() => {
                newVideoModal.classList.add('active');
            }, 600);
        }
    }

    async function saveWebpToFiles(webpBlob, filename) {
        // 1. Android Native Capacitor environment
        const nativeDownload = window.Capacitor?.Plugins?.WebpDownload;
        if (window.Capacitor?.isNativePlatform?.() && nativeDownload) {
            try {
                const base64 = await blobToBase64(webpBlob);
                await nativeDownload.saveWebp({ base64, filename });
                return {
                    success: true,
                    path: `Downloads/PressWebP/${filename}`,
                    url: null
                };
            } catch (err) {
                console.warn('Native Capacitor save failed, fallback to HTTP:', err);
            }
        }

        // 2. HTTP POST to save.php (Supported by XAMPP Apache, PHP CLI server, and server.ps1)
        try {
            const base64 = await blobToBase64(webpBlob);
            const response = await fetch('save.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: filename,
                    data: base64
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.success) {
                    return {
                        success: true,
                        path: data.path || `files/${data.filename}`,
                        url: data.url || `files/${encodeURIComponent(data.filename)}`,
                        filename: data.filename
                    };
                }
            }
        } catch (err) {
            console.warn('Backend save.php not reachable or offline file protocol:', err);
        }

        // 3. Browser fallback for direct file:// launch without any server running
        try {
            await downloadWithBrowser(filename);
            return {
                success: true,
                path: `Downloads/${filename}`,
                url: currentWebpBlobUrl
            };
        } catch (err) {
            console.error('Offline download fallback failed:', err);
        }

        return {
            success: false,
            path: `files/${filename}`,
            url: null
        };
    }

    function resetForNewVideo(openPicker = true) {
        // Pause and stop videos
        sourceVideo.pause();
        comparisonVideo.pause();
        btnPlayPause.textContent = '▶ Play';

        if (currentVideoBlobUrl) {
            URL.revokeObjectURL(currentVideoBlobUrl);
            currentVideoBlobUrl = null;
        }
        currentVideoFile = null;

        sourceVideo.removeAttribute('src');
        sourceVideo.load();
        comparisonVideo.removeAttribute('src');
        comparisonVideo.load();

        // Close any open modals
        if (newVideoModal) newVideoModal.classList.remove('active');
        if (inspectorModal) inspectorModal.classList.remove('active');

        // Reset stage visibility
        resultsSection.classList.add('hidden');
        studioSection.classList.add('hidden');
        dropzone.classList.remove('hidden');

        // Reset form values & scrubbers
        videoFileInput.value = '';
        videoFileName.textContent = 'headline_video.mp4';
        timecodeDisplay.textContent = '00:00 / 00:00';
        videoScrub.value = 0;

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (openPicker) {
            // Give brief delay for smooth UI transition before opening file dialog
            setTimeout(() => {
                videoFileInput.click();
            }, 300);
        }
    }

    function getWebpFilename() {
        const sourceName = currentVideoFile ? currentVideoFile.name.replace(/\.[^/.]+$/, '') : 'news_clip';
        // Keep the filename valid for Android's Downloads provider and desktop filesystems.
        return `${sourceName.replace(/[\\/:*?"<>|]/g, '_').trim() || 'news_clip'}_1x1.webp`;
    }

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Could not prepare the WebP for saving.'));
            reader.onload = () => resolve(String(reader.result).split(',')[1]);
            reader.readAsDataURL(blob);
        });
    }

    async function downloadWithBrowser(filename) {
        const a = document.createElement('a');
        a.href = currentWebpBlobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Download WebP Action. Android WebView does not reliably implement <a download>,
    // so native APKs use the MediaStore-backed WebpDownload Capacitor plugin.
    btnDownloadWebp.addEventListener('click', async () => {
        if (!currentWebpBlob) return;

        const filename = getWebpFilename();
        const nativeDownload = window.Capacitor?.Plugins?.WebpDownload;
        btnDownloadWebp.disabled = true;

        try {
            if (window.Capacitor?.isNativePlatform?.() && nativeDownload) {
                const base64 = await blobToBase64(currentWebpBlob);
                await nativeDownload.saveWebp({ base64, filename });
                showToast(`Saved to Downloads/PressWebP: ${filename}`, 'success');
            } else {
                await downloadWithBrowser(filename);
                showToast(`Downloaded: ${filename}`, 'success');
            }
        } catch (err) {
            console.error('WebP download failed:', err);
            showToast('Could not save the WebP. Please try again.', 'error');
        } finally {
            btnDownloadWebp.disabled = false;
        }
    });

    // Copy to Clipboard
    btnCopyClipboard.addEventListener('click', async () => {
        if (!currentWebpBlob) return;
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/webp': currentWebpBlob
                })
            ]);
            showToast('WebP image copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for browsers with restricted clipboard image/webp permissions
            showToast('Direct image clipboard copy not supported in this browser. Please use Download.', 'info');
        }
    });

    // Inspect Result RIFF Chunks
    btnInspectResult.addEventListener('click', () => {
        if (!currentWebpBlob) return;
        inspectWebpFile(currentWebpBlob, 'converted_1x1.webp');
    });

    // =========================================================================
    // Convert Another Video & Prompt Handlers
    // =========================================================================
    if (btnNewVideo) {
        btnNewVideo.addEventListener('click', () => {
            resetForNewVideo(true);
        });
    }

    if (btnPromptSelectNew) {
        btnPromptSelectNew.addEventListener('click', () => {
            if (newVideoModal) newVideoModal.classList.remove('active');
            resetForNewVideo(true);
        });
    }

    if (btnPromptStayReview) {
        btnPromptStayReview.addEventListener('click', () => {
            if (newVideoModal) newVideoModal.classList.remove('active');
        });
    }

    if (btnCloseNewVideoModal) {
        btnCloseNewVideoModal.addEventListener('click', () => {
            if (newVideoModal) newVideoModal.classList.remove('active');
        });
    }

    if (newVideoModal) {
        newVideoModal.addEventListener('click', (e) => {
            if (e.target === newVideoModal) {
                newVideoModal.classList.remove('active');
            }
        });
    }

    // Persist auto-prompt preference
    if (chkAutoPromptNew) {
        const savedAutoPromptPref = localStorage.getItem('presswebp_auto_prompt_new');
        if (savedAutoPromptPref !== null) {
            chkAutoPromptNew.checked = savedAutoPromptPref === 'true';
        }
        chkAutoPromptNew.addEventListener('change', () => {
            localStorage.setItem('presswebp_auto_prompt_new', chkAutoPromptNew.checked);
        });
    }

    // =========================================================================
    // Theme Engine (Editorial Studio Light & Cyber Dark)
    // =========================================================================
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    const themeLabelText = document.getElementById('themeLabelText');
    const metaThemeColor = document.getElementById('metaThemeColor');

    function applyTheme(theme, persist = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) {
            localStorage.setItem('presswebp_theme', theme);
        }
        if (themeLabelText) {
            themeLabelText.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
        }
        if (btnThemeToggle) {
            btnThemeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
            btnThemeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
        }
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'light' ? '#f1f4fa' : '#070a12');
        }
    }

    const savedTheme = localStorage.getItem('presswebp_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        applyTheme(savedTheme);
    } else {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight ? 'light' : 'dark', false);
    }

    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            applyTheme(next);
            showToast(`Switched to ${next === 'light' ? 'Editorial Studio Light' : 'Cyber Editorial Dark'} theme`, 'info');
        });
    }

    // Listen to OS theme changes if user hasn't set explicit preference
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            if (!localStorage.getItem('presswebp_theme')) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }

});

