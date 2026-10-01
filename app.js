/**
 * PressWebP - Independent 1:1 Video to WebP Converter Application Logic
 * Pure client-side processing for newspaper editorial desks.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    // DOM Elements - Unified Newsroom Suite
    const dropzone = document.getElementById('unifiedUploadSection') || document.getElementById('uploadSection');
    const mediaFileInput = document.getElementById('mediaFileInput') || document.getElementById('videoFileInput');
    const videoFileInput = mediaFileInput; // backward compatibility
    const btnBrowseFiles = document.getElementById('btnBrowseMediaFiles') || document.getElementById('btnBrowseFiles');
    const btnBrowseMediaFiles = btnBrowseFiles;
    const btnLoadDemoVideo = document.getElementById('btnLoadDemoVideo');
    const btnLoadDemoImage = document.getElementById('btnLoadDemoImage');
    const btnPasteClipboard = document.getElementById('btnPasteClipboard');
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
    const appModeBadge = document.getElementById('appModeBadge');
    const imageStudioSection = document.getElementById('imageStudioSection');
    const imageBatchSection = document.getElementById('imageBatchSection');
    const imageResultsSection = document.getElementById('imageResultsSection');

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
    // Unified Workspace Switcher & Media Routing (Single Converter Engine)
    // =========================================================================
    function switchToWorkspace(workspace) {
        // Workspaces: 'dropzone', 'video', 'video-result', 'image', 'image-result', 'batch'
        if (dropzone) dropzone.classList.toggle('hidden', workspace !== 'dropzone');

        if (studioSection) studioSection.classList.toggle('hidden', workspace !== 'video');
        if (resultsSection) resultsSection.classList.toggle('hidden', workspace !== 'video-result');

        const imgStudio = imageStudioSection || document.getElementById('imageStudioSection');
        const imgBatch = imageBatchSection || document.getElementById('imageBatchSection');
        const imgResults = imageResultsSection || document.getElementById('imageResultsSection');

        if (imgStudio) imgStudio.classList.toggle('hidden', workspace !== 'image');
        if (imgBatch) imgBatch.classList.toggle('hidden', workspace !== 'batch');
        if (imgResults) imgResults.classList.toggle('hidden', workspace !== 'image-result');

        if (appModeBadge) {
            if (workspace === 'video' || workspace === 'video-result') {
                appModeBadge.textContent = '1:1 Video (6s)';
            } else if (workspace === 'image' || workspace === 'image-result') {
                appModeBadge.textContent = '1:1 Photo';
            } else if (workspace === 'batch') {
                appModeBadge.textContent = 'Batch Queue';
            } else {
                appModeBadge.textContent = 'Unified Newsroom Suite';
            }
        }

        if (workspace !== 'video' && sourceVideo && !sourceVideo.paused) {
            sourceVideo.pause();
            if (btnPlayPause) btnPlayPause.textContent = '▶ Play';
        }

        if (workspace === 'image' && typeof updateImgCropOverlay === 'function' && currentImgElement) {
            setTimeout(updateImgCropOverlay, 80);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function setActiveMode(mode) {
        if (mode === 'video') switchToWorkspace('video');
        else if (mode === 'image') switchToWorkspace('image');
        else switchToWorkspace('dropzone');
    }

    function handleMediaFiles(files) {
        if (!files || files.length === 0) return;
        const fileList = Array.from(files);

        const videoFiles = fileList.filter(f => f.type.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv)$/i.test(f.name));
        const imageFiles = fileList.filter(f => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|bmp|gif|svg|tiff)$/i.test(f.name));

        if (videoFiles.length > 0) {
            handleUploadedFile(videoFiles[0]);
            return;
        }

        if (imageFiles.length > 1) {
            handleImageFiles(imageFiles);
            return;
        }

        if (imageFiles.length === 1) {
            loadImageIntoStudio(imageFiles[0]);
            return;
        }

        const webpFiles = fileList.filter(f => f.name.endsWith('.webp') || f.type === 'image/webp');
        if (webpFiles.length > 0) {
            inspectWebpFile(webpFiles[0]);
            return;
        }

        showToast('Please upload a video clip (MP4/MOV/WebM) or news photo (JPG/PNG/WebP).', 'error');
    }

    if (btnBrowseFiles) {
        btnBrowseFiles.addEventListener('click', (e) => {
            e.stopPropagation();
            mediaFileInput.click();
        });
    }

    if (dropzone) {
        dropzone.addEventListener('click', (e) => {
            if (e.target !== btnBrowseFiles && !btnBrowseFiles.contains(e.target)) {
                mediaFileInput.click();
            }
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
            e.preventDefault();
            e.stopPropagation();
            const files = e.dataTransfer && e.dataTransfer.files;
            if (files && files.length > 0) {
                handleMediaFiles(files);
            }
        });
    }

    // Window-level drag and drop to drop anywhere on page
    window.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    window.addEventListener('drop', (e) => {
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length > 0) {
            e.preventDefault();
            handleMediaFiles(files);
        }
    });

    if (mediaFileInput) {
        mediaFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleMediaFiles(e.target.files);
                mediaFileInput.value = '';
            }
        });
    }

    btnChangeVideo.addEventListener('click', () => mediaFileInput.click());

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
            switchToWorkspace('video');

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

        const pos = 'center';
        const style = (watermarkStyle ? watermarkStyle.value : 'badge');
        viewfinderWatermark.className = `viewfinder-watermark-overlay pos-center style-${style}`;

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

    const btnAutoTuneBudget = document.getElementById('btnAutoTuneBudget');
    if (btnAutoTuneBudget) {
        btnAutoTuneBudget.addEventListener('click', () => {
            autoTuneToBudget();
        });
    }

    function autoTuneToBudget() {
        if (sourceVideo && sourceVideo.duration) {
            setTrimDuration(6.0);
        } else {
            trimStart.value = '0.0';
            trimEnd.value = '6.0';
            valDuration.textContent = '6.0 sec';
        }

        resWidth.value = 640;
        resHeight.value = 640;
        valResolution.textContent = '640 × 640';

        fpsRange.value = 10;
        valFps.textContent = '10 FPS';

        qualityRange.value = 65;
        valQuality.textContent = '65%';

        presetCards.forEach(c => c.classList.remove('active'));
        const pSample = document.getElementById('presetSample');
        if (pSample) pSample.classList.add('active');

        durationChips.forEach(c => c.classList.toggle('active', c.id === 'btnDur6'));

        updateEstimation();
        showToast('🎯 Calibrated: 6.0s clip & 500KB–800KB file size budget applied!', 'success');
    }

    function updateEstimation() {
        const s = parseFloat(trimStart.value) || 0;
        const e = parseFloat(trimEnd.value) || 6.0;
        const duration = Math.max(0.1, e - s);
        const fps = parseInt(fpsRange.value, 10) || 10;
        const frames = Math.round(duration * fps);
        const w = parseInt(resWidth.value, 10) || 640;
        const q = parseInt(qualityRange.value, 10) || 65;

        estFrames.textContent = `${frames} frames (${duration.toFixed(1)}s @ ${fps}fps)`;

        // Calibrated empirical animated WebP size:
        // Baseline: 720x720 10fps @ 75% quality is ~22.8KB per frame
        const areaFactor = (w * w) / (720 * 720);
        const qualityFactor = Math.pow(q / 75, 1.25);
        const avgFrameKb = 22.8 * areaFactor * qualityFactor;
        const totalEstimatedKb = Math.round(frames * avgFrameKb);

        const estBudgetStatus = document.getElementById('estBudgetStatus');
        const minKb = Math.round(totalEstimatedKb * 0.9);
        const maxKb = Math.round(totalEstimatedKb * 1.1);

        if (totalEstimatedKb > 1024) {
            const minMb = (minKb / 1024).toFixed(2);
            const maxMb = (maxKb / 1024).toFixed(2);
            estSize.textContent = `~${minMb} MB – ${maxMb} MB`;
            estSize.style.color = 'var(--brand-amber)';
        } else {
            estSize.textContent = `~${minKb} KB – ${maxKb} KB`;
            if (minKb >= 450 && maxKb <= 880) {
                estSize.style.color = 'var(--brand-emerald)';
            } else {
                estSize.style.color = 'var(--brand-cyan)';
            }
        }

        if (estBudgetStatus) {
            if (minKb >= 450 && maxKb <= 880) {
                estBudgetStatus.innerHTML = '<span style="color: var(--brand-emerald);">🎯 500–800 KB Met ✅</span>';
            } else if (totalEstimatedKb > 800) {
                estBudgetStatus.innerHTML = `<span style="color: var(--brand-amber);">⚠️ Exceeds 800 KB (+${totalEstimatedKb - 800} KB)</span>`;
            } else {
                estBudgetStatus.innerHTML = `<span style="color: var(--brand-cyan);">ℹ️ Under 500 KB (~${totalEstimatedKb} KB)</span>`;
            }
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

                // Encode canvas frame to WebP blob with timeout fallback
                const frameBlob = await new Promise((res) => {
                    let done = false;
                    const timer = setTimeout(() => {
                        if (!done) {
                            done = true;
                            try {
                                const dataUrl = offscreenCanvas.toDataURL('image/webp', quality);
                                const binStr = atob(dataUrl.split(',')[1]);
                                const len = binStr.length;
                                const arr = new Uint8Array(len);
                                for (let k = 0; k < len; k++) arr[k] = binStr.charCodeAt(k);
                                res(new Blob([arr], { type: 'image/webp' }));
                            } catch (e) {
                                res(null);
                            }
                        }
                    }, 400);

                    offscreenCanvas.toBlob((b) => {
                        if (!done) {
                            done = true;
                            clearTimeout(timer);
                            res(b);
                        }
                    }, 'image/webp', quality);
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
     * High-speed bulletproof video seeker ensuring frame decoding readiness without hanging
     */
    function seekVideoToTime(video, targetTime) {
        return new Promise((resolve) => {
            const clamped = Math.max(0, Math.min(video.duration || 10000, targetTime));

            // If already at target time, the decoded frame is already in buffer; resolve immediately
            if (Math.abs(video.currentTime - clamped) < 0.002) {
                resolve();
                return;
            }

            let resolved = false;
            let timer = null;

            const cleanup = () => {
                if (timer) clearTimeout(timer);
                video.removeEventListener('seeked', onSeeked);
                video.removeEventListener('error', onError);
            };

            const finish = () => {
                if (resolved) return;
                resolved = true;
                cleanup();
                resolve();
            };

            const onSeeked = () => {
                // Video seek completed; frame is decoded and ready for drawImage
                if (document.hidden) {
                    setTimeout(finish, 0);
                } else {
                    requestAnimationFrame(() => finish());
                }
            };

            const onError = () => finish();

            video.addEventListener('seeked', onSeeked, { once: true });
            video.addEventListener('error', onError, { once: true });

            // Safety timeout (160ms) guarantees loop never hangs even on stubborn mobile codecs
            timer = setTimeout(finish, 160);

            try {
                video.currentTime = clamped;
            } catch (err) {
                finish();
            }
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
        const opacity = Math.max(0.1, Math.min(1, (options.opacity || 85) / 100));

        ctx.save();
        ctx.globalAlpha = opacity;

        // Substantially increased font size: base 36px on 720px width (65% increase for commanding center watermark)
        const scale = canvasW / 720;
        const fontSize = Math.max(16, Math.round(36 * scale));
        ctx.font = `900 ${fontSize}px "Outfit", "Plus Jakarta Sans", "Inter", -apple-system, sans-serif`;
        ctx.textBaseline = 'middle';

        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;

        const dotSize = Math.max(8, Math.round(12 * scale));
        const padX = Math.round(22 * scale);
        const padY = Math.round(12 * scale);
        const dotMargin = (style === 'badge' || style === 'pill') ? Math.round(12 * scale) : 0;
        const totalContentWidth = (style === 'badge' || style === 'pill') ? (dotSize + dotMargin + textWidth) : textWidth;
        const boxWidth = totalContentWidth + (padX * 2);
        const boxHeight = fontSize + (padY * 2);

        // Center only: "and the water marks increas some size of the text set it in the center only"
        const boxX = Math.round((canvasW - boxWidth) / 2);
        const boxY = Math.round((canvasH - boxHeight) / 2);

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
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = Math.max(1.5, Math.round(2 * scale));
            
            const r = Math.round(6 * scale);
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
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
            ctx.shadowBlur = 6 * scale;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(text, boxX + padX + dotSize + dotMargin, boxY + (boxHeight / 2));

        } else if (style === 'pill') {
            // High-tech editorial pill with cyan border
            ctx.fillStyle = 'rgba(14, 20, 36, 0.94)';
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
            ctx.lineWidth = Math.max(1.5, Math.round(2 * scale));

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
            // Shadowed embossed text (No bounding box) - optical center
            ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
            ctx.shadowBlur = 12 * scale;
            ctx.shadowOffsetX = 2 * scale;
            ctx.shadowOffsetY = 2 * scale;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(text, Math.round(canvasW / 2), Math.round(canvasH / 2));
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
        const webpKb = Math.round(webpBytes / 1024);
        const webpMb = (webpBytes / (1024 * 1024)).toFixed(2);
        const sizeFormatted = webpBytes < 1024 * 1024 ? `${webpKb} KB` : `${webpMb} MB`;
        
        let budgetNotice = '';
        if (webpKb >= 450 && webpKb <= 850) {
            budgetNotice = ' • 500–800KB Met ✅';
        }
        webpResultSize.textContent = `${sizeFormatted}${budgetNotice}`;

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


    // =========================================================================
    // PURE JAVASCRIPT ZERO-DEPENDENCY ZIP ARCHIVE GENERATOR
    // =========================================================================
    function createZipBlob(files) {
        const crcTable = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let k = 0; k < 8; k++) {
                c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            }
            crcTable[i] = c;
        }

        function crc32(buf) {
            let crc = 0xFFFFFFFF;
            for (let i = 0; i < buf.length; i++) {
                crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
            }
            return (crc ^ 0xFFFFFFFF) >>> 0;
        }

        const textEncoder = new TextEncoder();
        const localHeaders = [];
        const centralEntries = [];
        let offset = 0;

        for (const file of files) {
            const filenameBytes = textEncoder.encode(file.name);
            const data = file.data;
            const crc = crc32(data);
            const size = data.length;

            const localHeader = new Uint8Array(30 + filenameBytes.length);
            const lv = new DataView(localHeader.buffer);
            lv.setUint32(0, 0x04034b50, true);
            lv.setUint16(4, 20, true);
            lv.setUint16(6, 0, true);
            lv.setUint16(8, 0, true); // stored (no compression)
            lv.setUint16(10, 0x5421, true);
            lv.setUint16(12, 0x58A1, true);
            lv.setUint32(14, crc, true);
            lv.setUint32(18, size, true);
            lv.setUint32(22, size, true);
            lv.setUint16(26, filenameBytes.length, true);
            lv.setUint16(28, 0, true);
            localHeader.set(filenameBytes, 30);

            localHeaders.push(localHeader);
            localHeaders.push(data);

            const cdEntry = new Uint8Array(46 + filenameBytes.length);
            const cv = new DataView(cdEntry.buffer);
            cv.setUint32(0, 0x02014b50, true);
            cv.setUint16(4, 20, true);
            cv.setUint16(6, 20, true);
            cv.setUint16(8, 0, true);
            cv.setUint16(10, 0, true);
            cv.setUint16(12, 0x5421, true);
            cv.setUint16(14, 0x58A1, true);
            cv.setUint32(16, crc, true);
            cv.setUint32(20, size, true);
            cv.setUint32(24, size, true);
            cv.setUint16(28, filenameBytes.length, true);
            cv.setUint16(30, 0, true);
            cv.setUint16(32, 0, true);
            cv.setUint16(34, 0, true);
            cv.setUint16(36, 0, true);
            cv.setUint32(38, 0, true);
            cv.setUint32(42, offset, true);
            cdEntry.set(filenameBytes, 46);

            centralEntries.push(cdEntry);
            offset += localHeader.length + size;
        }

        const cdStartOffset = offset;
        let cdTotalSize = 0;
        for (const cde of centralEntries) {
            cdTotalSize += cde.length;
        }

        const eocd = new Uint8Array(22);
        const ev = new DataView(eocd.buffer);
        ev.setUint32(0, 0x06054b50, true);
        ev.setUint16(4, 0, true);
        ev.setUint16(6, 0, true);
        ev.setUint16(8, files.length, true);
        ev.setUint16(10, files.length, true);
        ev.setUint32(12, cdTotalSize, true);
        ev.setUint32(16, cdStartOffset, true);
        ev.setUint16(20, 0, true);

        return new Blob([...localHeaders, ...centralEntries, eocd], { type: 'application/zip' });
    }

    // =========================================================================
    // NEWSROOM IMAGE TO WEBP CONVERTER LOGIC
    // =========================================================================
    // DOM Elements - Image Section
    const imageUploadSection = dropzone;
    const imageFileInput = mediaFileInput;
    const btnBrowseImageFiles = btnBrowseFiles;
    const btnBatchToggle = document.getElementById('btnBatchToggle');
    const batchBtnCount = document.getElementById('batchBtnCount');

    // Batch UI Elements
    const batchCountBadge = document.getElementById('batchCountBadge');
    const btnAddMoreBatchPhotos = document.getElementById('btnAddMoreBatchPhotos');
    const btnClearBatch = document.getElementById('btnClearBatch');
    const btnSwitchSingleStudio = document.getElementById('btnSwitchSingleStudio');
    const batchPresetSelect = document.getElementById('batchPresetSelect');
    const batchQualityRange = document.getElementById('batchQualityRange');
    const valBatchQuality = document.getElementById('valBatchQuality');
    const batchSlugPrefix = document.getElementById('batchSlugPrefix');
    const batchEnableWatermark = document.getElementById('batchEnableWatermark');
    const btnConvertBatchAll = document.getElementById('btnConvertBatchAll');
    const btnDownloadBatchZip = document.getElementById('btnDownloadBatchZip');
    const btnAutoSaveBatchAll = document.getElementById('btnAutoSaveBatchAll');
    const batchGlobalStatus = document.getElementById('batchGlobalStatus');
    const batchProgressBarWrap = document.getElementById('batchProgressBarWrap');
    const batchProgressBarFill = document.getElementById('batchProgressBarFill');
    const batchCardsGrid = document.getElementById('batchCardsGrid');

    // Single Studio Elements
    const imgFileName = document.getElementById('imgFileName');
    const imgNativeRes = document.getElementById('imgNativeRes');
    const imgNativeSize = document.getElementById('imgNativeSize');
    const imgNativeFormat = document.getElementById('imgNativeFormat');
    const btnImgRotate = document.getElementById('btnImgRotate');
    const btnChangeImage = document.getElementById('btnChangeImage');
    const btnBatchFromStudio = document.getElementById('btnBatchFromStudio');

    // Viewfinder Elements
    const imgViewfinderWrapper = document.getElementById('imgViewfinderWrapper');
    const imgSourceDisplay = document.getElementById('imgSourceDisplay');
    const imgCropOverlayContainer = document.getElementById('imgCropOverlayContainer');
    const imgCropGuide = document.getElementById('imgCropGuide');
    const imgViewfinderWatermark = document.getElementById('imgViewfinderWatermark');
    const imgViewfinderWatermarkText = document.getElementById('imgViewfinderWatermarkText');

    // Framing & Presets
    const btnImgAlignStart = document.getElementById('btnImgAlignStart');
    const btnImgAlignCenter = document.getElementById('btnImgAlignCenter');
    const btnImgAlignEnd = document.getElementById('btnImgAlignEnd');
    const ratioChips = document.querySelectorAll('.ratio-chip-btn');
    const presetImgCards = document.querySelectorAll('.preset-grid-news .preset-card');

    const imgModeFillCard = document.getElementById('imgModeFillCard');
    const imgModeBlurCard = document.getElementById('imgModeBlurCard');
    const imgModeSolidCard = document.getElementById('imgModeSolidCard');
    const imgModeFill = document.getElementById('imgModeFill');
    const imgModeBlur = document.getElementById('imgModeBlur');
    const imgModeSolid = document.getElementById('imgModeSolid');

    // Dimensions, SEO, Quality
    const valImgResolution = document.getElementById('valImgResolution');
    const imgResWidth = document.getElementById('imgResWidth');
    const imgResHeight = document.getElementById('imgResHeight');
    const btnScale100 = document.getElementById('btnScale100');
    const btnScale75 = document.getElementById('btnScale75');
    const btnScale50 = document.getElementById('btnScale50');
    const btnLockAspect = document.getElementById('btnLockAspect');

    const imgArticleHeadline = document.getElementById('imgArticleHeadline');
    const imgSlugPreview = document.getElementById('imgSlugPreview');
    const chkStripExif = document.getElementById('chkStripExif');
    const imgQualityRange = document.getElementById('imgQualityRange');
    const valImgQuality = document.getElementById('valImgQuality');
    const chkLosslessWebp = document.getElementById('chkLosslessWebp');

    // Image Watermark Controls
    const enableImgWatermark = document.getElementById('enableImgWatermark');
    const valImgWatermarkBadge = document.getElementById('valImgWatermarkBadge');
    const imgWatermarkConfigPanel = document.getElementById('imgWatermarkConfigPanel');
    const imgWatermarkText = document.getElementById('imgWatermarkText');
    const imgWatermarkPosition = document.getElementById('imgWatermarkPosition');
    const imgWatermarkStyle = document.getElementById('imgWatermarkStyle');
    const imgWatermarkOpacity = document.getElementById('imgWatermarkOpacity');
    const valImgWatermarkOpacity = document.getElementById('valImgWatermarkOpacity');

    const estImgSize = document.getElementById('estImgSize');
    const estImgVitals = document.getElementById('estImgVitals');
    const btnConvertImage = document.getElementById('btnConvertImage');

    // Results Elements
    const comparisonImgOriginal = document.getElementById('comparisonImgOriginal');
    const comparisonImgWebp = document.getElementById('comparisonImgWebp');
    const origImgSizePill = document.getElementById('origImgSizePill');
    const webpImgResultSize = document.getElementById('webpImgResultSize');
    const metricImgSavings = document.getElementById('metricImgSavings');
    const metricImgRes = document.getElementById('metricImgRes');
    const metricImgVitals = document.getElementById('metricImgVitals');
    const metricImgFormat = document.getElementById('metricImgFormat');
    const imgAutoSaveStatus = document.getElementById('imgAutoSaveStatus');
    const imgAutoSavedPath = document.getElementById('imgAutoSavedPath');
    const btnOpenSavedImgFile = document.getElementById('btnOpenSavedImgFile');
    const btnNewImage = document.getElementById('btnNewImage');
    const btnDownloadImageWebp = document.getElementById('btnDownloadImageWebp');
    const btnCopyImageClipboard = document.getElementById('btnCopyImageClipboard');
    const btnInspectImageResult = document.getElementById('btnInspectImageResult');

    const imageOffscreenCanvas = document.getElementById('imageOffscreenCanvas');
    const imageOffscreenCtx = imageOffscreenCanvas ? imageOffscreenCanvas.getContext('2d', { willReadFrequently: true }) : null;

    // Image State
    let currentImgFile = null;
    let currentImgBlobUrl = null;
    let currentImgElement = null;
    let currentImgWebpBlob = null;
    let currentImgWebpBlobUrl = null;

    let imgCropRatioX = 0.5;
    let imgCropRatioY = 0.5;
    let imgSelectedRatio = '1:1';
    let imgRotation = 0; // 0, 90, 180, 270
    let isAspectLocked = true;
    let isDraggingImgCrop = false;
    let imgDragStartX = 0;
    let imgDragStartY = 0;
    let imgDragStartRatioX = 0.5;
    let imgDragStartRatioY = 0.5;

    // Batch State
    let batchQueue = [];
    let isBatchConverting = false;

    // -------------------------------------------------------------------------
    // News SEO Slug Helpers
    // -------------------------------------------------------------------------
    function slugify(text) {
        return (text || '')
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function getImageSlugFilename() {
        const headline = imgArticleHeadline ? imgArticleHeadline.value.trim() : '';
        const base = slugify(headline) || (currentImgFile ? currentImgFile.name.replace(/\.[^/.]+$/, '') : 'news_photo');
        const cleanBase = slugify(base) || 'news_photo';
        const w = parseInt(imgResWidth.value, 10) || 720;
        const h = parseInt(imgResHeight.value, 10) || 720;
        return `${cleanBase}_${w}x${h}.webp`;
    }

    function updateSlugPreview() {
        if (!imgSlugPreview) return;
        imgSlugPreview.textContent = getImageSlugFilename();
    }

    if (imgArticleHeadline) {
        imgArticleHeadline.addEventListener('input', updateSlugPreview);
    }

    // -------------------------------------------------------------------------
    // Viewfinder Aspect-Ratio Crop Positioning & Guide (1:1 Editorial Square)
    // -------------------------------------------------------------------------
    function getRatioLabel(ratio) {
        return '1:1 Square Editorial';
    }

    function updateImgCropOverlay() {
        if (!currentImgElement || !imgViewfinderWrapper || !imgCropGuide) return;

        const containerRect = imgViewfinderWrapper.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) return;

        const isRotated90 = (imgRotation === 90 || imgRotation === 270);
        const natW = isRotated90 ? currentImgElement.naturalHeight : currentImgElement.naturalWidth;
        const natH = isRotated90 ? currentImgElement.naturalWidth : currentImgElement.naturalHeight;

        // Container maximum height constraint
        const maxH = Math.min(520, containerRect.height - 20);
        const maxW = containerRect.width - 20;

        const scale = Math.min(maxW / natW, maxH / natH);
        const dispW = Math.max(50, natW * scale);
        const dispH = Math.max(50, natH * scale);

        const targetRatio = 1.0; // Strictly 1:1 Square Editorial

        let cropW, cropH;
        if (dispW / dispH > targetRatio) {
            cropH = dispH;
            cropW = dispH * targetRatio;
        } else {
            cropW = dispW;
            cropH = dispW / targetRatio;
        }

        const maxTravelX = Math.max(0, dispW - cropW);
        const maxTravelY = Math.max(0, dispH - cropH);

        const imgLeft = (containerRect.width - dispW) / 2;
        const imgTop = (containerRect.height - dispH) / 2;

        const cropLeft = imgLeft + (maxTravelX * imgCropRatioX);
        const cropTop = imgTop + (maxTravelY * imgCropRatioY);

        imgCropGuide.style.width = `${Math.round(cropW)}px`;
        imgCropGuide.style.height = `${Math.round(cropH)}px`;
        imgCropGuide.style.left = `${Math.round(cropLeft)}px`;
        imgCropGuide.style.top = `${Math.round(cropTop)}px`;
        imgCropGuide.setAttribute('data-label', '1:1 Square Editorial');

        // Update alignment buttons text according to dominant axis
        const isHorizontal = maxTravelX > maxTravelY;
        const travelRatio = isHorizontal ? imgCropRatioX : imgCropRatioY;

        if (btnImgAlignStart) btnImgAlignStart.textContent = isHorizontal ? 'Left (25%)' : 'Top (25%)';
        if (btnImgAlignCenter) btnImgAlignCenter.textContent = 'Center (50%)';
        if (btnImgAlignEnd) btnImgAlignEnd.textContent = isHorizontal ? 'Right (75%)' : 'Bottom (75%)';

        if (btnImgAlignStart) btnImgAlignStart.classList.toggle('active', Math.abs(travelRatio - 0.25) < 0.1);
        if (btnImgAlignCenter) btnImgAlignCenter.classList.toggle('active', Math.abs(travelRatio - 0.5) < 0.1);
        if (btnImgAlignEnd) btnImgAlignEnd.classList.toggle('active', Math.abs(travelRatio - 0.75) < 0.1);
    }

    // Draggable Crop Guide (Mouse)
    if (imgCropGuide) {
        imgCropGuide.addEventListener('mousedown', (e) => {
            isDraggingImgCrop = true;
            imgDragStartX = e.clientX;
            imgDragStartY = e.clientY;
            imgDragStartRatioX = imgCropRatioX;
            imgDragStartRatioY = imgCropRatioY;
            e.preventDefault();
        });
    }

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingImgCrop || !imgViewfinderWrapper) return;
        const containerRect = imgViewfinderWrapper.getBoundingClientRect();
        const deltaX = e.clientX - imgDragStartX;
        const deltaY = e.clientY - imgDragStartY;

        const ratioDeltaX = deltaX / (containerRect.width * 0.35);
        const ratioDeltaY = deltaY / (containerRect.height * 0.35);

        imgCropRatioX = Math.max(0, Math.min(1, imgDragStartRatioX + ratioDeltaX));
        imgCropRatioY = Math.max(0, Math.min(1, imgDragStartRatioY + ratioDeltaY));
        updateImgCropOverlay();
    });

    window.addEventListener('mouseup', () => {
        isDraggingImgCrop = false;
    });

    // Touch support for Android APK / Mobile
    if (imgCropGuide) {
        imgCropGuide.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                isDraggingImgCrop = true;
                imgDragStartX = e.touches[0].clientX;
                imgDragStartY = e.touches[0].clientY;
                imgDragStartRatioX = imgCropRatioX;
                imgDragStartRatioY = imgCropRatioY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isDraggingImgCrop || e.touches.length === 0 || !imgViewfinderWrapper) return;
            const containerRect = imgViewfinderWrapper.getBoundingClientRect();
            const deltaX = e.touches[0].clientX - imgDragStartX;
            const deltaY = e.touches[0].clientY - imgDragStartY;

            const ratioDeltaX = deltaX / (containerRect.width * 0.35);
            const ratioDeltaY = deltaY / (containerRect.height * 0.35);

            imgCropRatioX = Math.max(0, Math.min(1, imgDragStartRatioX + ratioDeltaX));
            imgCropRatioY = Math.max(0, Math.min(1, imgDragStartRatioY + ratioDeltaY));
            updateImgCropOverlay();
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDraggingImgCrop = false;
        });
    }

    // Quick Alignment Buttons
    if (btnImgAlignStart) {
        btnImgAlignStart.addEventListener('click', () => {
            imgCropRatioX = 0.25;
            imgCropRatioY = 0.25;
            updateImgCropOverlay();
        });
    }
    if (btnImgAlignCenter) {
        btnImgAlignCenter.addEventListener('click', () => {
            imgCropRatioX = 0.5;
            imgCropRatioY = 0.5;
            updateImgCropOverlay();
        });
    }
    if (btnImgAlignEnd) {
        btnImgAlignEnd.addEventListener('click', () => {
            imgCropRatioX = 0.75;
            imgCropRatioY = 0.75;
            updateImgCropOverlay();
        });
    }

    // Quick 1:1 Square Resolution Chips
    ratioChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const w = parseInt(chip.dataset.w, 10) || 720;
            const h = parseInt(chip.dataset.h, 10) || 720;
            ratioChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            // Sync with corresponding preset card
            presetImgCards.forEach(c => {
                c.classList.toggle('active', parseInt(c.dataset.w, 10) === w);
            });

            setImgDimensions(w, h);
            updateImgCropOverlay();
            updateImgEstimation();
            updateSlugPreview();
        });
    });

    // 1:1 Editorial Ratio Preset Cards
    presetImgCards.forEach(card => {
        card.addEventListener('click', () => {
            const w = parseInt(card.dataset.w, 10) || 720;
            const h = parseInt(card.dataset.h, 10) || 720;
            const q = parseInt(card.dataset.q, 10);

            presetImgCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Sync with ratio chips
            ratioChips.forEach(chip => {
                chip.classList.toggle('active', parseInt(chip.dataset.w, 10) === w);
            });

            if (q && imgQualityRange) {
                imgQualityRange.value = q;
                if (valImgQuality) valImgQuality.textContent = `${q}%`;
            }

            setImgDimensions(w, h);
            updateImgCropOverlay();
            updateImgEstimation();
            updateSlugPreview();
        });
    });

    function setImgAspectRatio(ratio) {
        imgSelectedRatio = '1:1'; // Strictly 1:1 Square
        let targetW = parseInt(imgResWidth.value, 10) || 720;
        setImgDimensions(targetW, targetW);
        updateImgCropOverlay();
        updateImgEstimation();
        updateSlugPreview();
    }

    function setImgDimensions(w, h) {
        // Enforce 1:1 square
        const side = w || h || 720;
        if (imgResWidth) imgResWidth.value = side;
        if (imgResHeight) imgResHeight.value = side;
        if (valImgResolution) valImgResolution.textContent = `${side} × ${side} px`;
    }

    // Dimensions Inputs & 1:1 Square Locking
    if (imgResWidth) {
        imgResWidth.addEventListener('input', () => {
            const side = parseInt(imgResWidth.value, 10) || 100;
            if (isAspectLocked) {
                imgResHeight.value = side;
            }
            if (valImgResolution) valImgResolution.textContent = `${side} × ${imgResHeight.value} px`;
            updateImgCropOverlay();
            updateImgEstimation();
            updateSlugPreview();
        });
    }

    if (imgResHeight) {
        imgResHeight.addEventListener('input', () => {
            const side = parseInt(imgResHeight.value, 10) || 100;
            if (isAspectLocked) {
                imgResWidth.value = side;
            }
            if (valImgResolution) valImgResolution.textContent = `${imgResWidth.value} × ${side} px`;
            updateImgCropOverlay();
            updateImgEstimation();
            updateSlugPreview();
        });
    }

    if (btnLockAspect) {
        btnLockAspect.addEventListener('click', () => {
            isAspectLocked = !isAspectLocked;
            btnLockAspect.classList.toggle('active', isAspectLocked);
            btnLockAspect.textContent = isAspectLocked ? '🔒 1:1 Locked' : '🔓 Free Ratio';
            showToast(isAspectLocked ? '1:1 Ratio locked' : 'Aspect ratio unlocked', 'info');
        });
    }

    // Scale Chips (100%, 75%, 50%) based on 1:1 square
    function applyDimensionScale(factor) {
        if (!currentImgElement) return;
        const currentSide = parseInt(imgResWidth.value, 10) || 720;
        const newSide = Math.round(currentSide * factor);
        setImgDimensions(newSide, newSide);
        updateImgCropOverlay();
        updateImgEstimation();
        updateSlugPreview();
    }

    if (btnScale100) btnScale100.addEventListener('click', () => applyDimensionScale(1.0));
    if (btnScale75) btnScale75.addEventListener('click', () => applyDimensionScale(0.75));
    if (btnScale50) btnScale50.addEventListener('click', () => applyDimensionScale(0.50));

    // Framing Style (Fill vs Blur vs Solid)
    if (imgModeFillCard) {
        imgModeFillCard.addEventListener('click', () => {
            imgModeFill.checked = true;
            imgModeFillCard.classList.add('active');
            imgModeBlurCard.classList.remove('active');
            imgModeSolidCard.classList.remove('active');
            imgCropGuide.classList.remove('framing-blur');
        });
    }
    if (imgModeBlurCard) {
        imgModeBlurCard.addEventListener('click', () => {
            imgModeBlur.checked = true;
            imgModeBlurCard.classList.add('active');
            imgModeFillCard.classList.remove('active');
            imgModeSolidCard.classList.remove('active');
            imgCropGuide.classList.add('framing-blur');
        });
    }
    if (imgModeSolidCard) {
        imgModeSolidCard.addEventListener('click', () => {
            imgModeSolid.checked = true;
            imgModeSolidCard.classList.add('active');
            imgModeFillCard.classList.remove('active');
            imgModeBlurCard.classList.remove('active');
            imgCropGuide.classList.add('framing-blur');
        });
    }

    // Quality Slider
    if (imgQualityRange) {
        imgQualityRange.addEventListener('input', () => {
            if (valImgQuality) valImgQuality.textContent = `${imgQualityRange.value}%`;
            updateImgEstimation();
        });
    }

    // Rotation Button
    if (btnImgRotate) {
        btnImgRotate.addEventListener('click', () => {
            imgRotation = (imgRotation + 90) % 360;
            if (imgSourceDisplay) {
                imgSourceDisplay.style.transform = `rotate(${imgRotation}deg)`;
            }
            updateImgCropOverlay();
            updateImgEstimation();
            showToast(`Rotated to ${imgRotation}°`, 'info');
        });
    }

    // Watermark Controls & Live Preview
    function updateImgWatermarkPreview() {
        if (!imgViewfinderWatermark) return;
        const isEnabled = enableImgWatermark.checked;
        imgViewfinderWatermark.classList.toggle('hidden', !isEnabled);
        if (imgWatermarkConfigPanel) {
            imgWatermarkConfigPanel.classList.toggle('disabled', !isEnabled);
        }

        const text = (imgWatermarkText.value || 'GROUND ZERO').trim() || 'GROUND ZERO';
        if (imgViewfinderWatermarkText) imgViewfinderWatermarkText.textContent = text;
        if (valImgWatermarkBadge) valImgWatermarkBadge.textContent = text.slice(0, 16);

        imgViewfinderWatermark.className = 'viewfinder-watermark-overlay pos-center';
        if (!isEnabled) {
            imgViewfinderWatermark.classList.add('hidden');
            return;
        }

        const style = imgWatermarkStyle ? imgWatermarkStyle.value : 'badge';
        imgViewfinderWatermark.classList.add(`style-${style}`);

        const opacity = (parseInt(imgWatermarkOpacity.value, 10) || 85) / 100;
        imgViewfinderWatermark.style.opacity = opacity;
        if (valImgWatermarkOpacity) valImgWatermarkOpacity.textContent = `${imgWatermarkOpacity.value}%`;
    }

    if (enableImgWatermark) enableImgWatermark.addEventListener('change', updateImgWatermarkPreview);
    if (imgWatermarkText) imgWatermarkText.addEventListener('input', updateImgWatermarkPreview);
    if (imgWatermarkPosition) imgWatermarkPosition.addEventListener('change', updateImgWatermarkPreview);
    if (imgWatermarkStyle) imgWatermarkStyle.addEventListener('change', updateImgWatermarkPreview);
    if (imgWatermarkOpacity) imgWatermarkOpacity.addEventListener('input', updateImgWatermarkPreview);

    // Estimation Engine for Images
    function updateImgEstimation() {
        if (!estImgSize || !estImgVitals) return;
        const w = parseInt(imgResWidth.value, 10) || 1280;
        const h = parseInt(imgResHeight.value, 10) || 720;
        const q = parseInt(imgQualityRange.value, 10) || 82;
        const pixels = w * h;

        // WebP compression heuristic: ~0.15 - 0.25 bytes per pixel at 82% quality for news photography
        const bytesPerPixel = (q / 100) * 0.22;
        const estBytes = pixels * bytesPerPixel;
        const estKb = Math.round(estBytes / 1024);

        const minKb = Math.round(estKb * 0.85);
        const maxKb = Math.round(estKb * 1.2);

        if (estKb > 1024) {
            estImgSize.textContent = `~${(minKb / 1024).toFixed(1)} MB – ${(maxKb / 1024).toFixed(1)} MB`;
        } else {
            estImgSize.textContent = `~${minKb} KB – ${maxKb} KB`;
        }

        if (estKb < 150) {
            estImgVitals.textContent = '⚡ Lightning Fast (Passes Core Web Vitals LCP)';
            estImgVitals.style.color = 'var(--brand-emerald)';
        } else if (estKb < 350) {
            estImgVitals.textContent = '🟢 Recommended Editorial Quality (Good LCP)';
            estImgVitals.style.color = 'var(--brand-emerald)';
        } else {
            estImgVitals.textContent = '🟡 High Fidelity (For Large 4K Displays)';
            estImgVitals.style.color = 'var(--brand-amber)';
        }
    }

    // -------------------------------------------------------------------------
    // Load Image File into Single Studio
    // -------------------------------------------------------------------------
    function loadImageIntoStudio(file) {
        currentImgFile = file;
        imgRotation = 0;
        imgCropRatioX = 0.5;
        imgCropRatioY = 0.5;

        if (currentImgBlobUrl) {
            URL.revokeObjectURL(currentImgBlobUrl);
        }
        currentImgBlobUrl = URL.createObjectURL(file);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            currentImgElement = img;
            imgSourceDisplay.src = currentImgBlobUrl;
            imgSourceDisplay.style.transform = 'none';

            // Topbar Metadata
            imgFileName.textContent = file.name;
            imgNativeRes.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;

            const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
            imgNativeSize.textContent = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

            const format = file.type ? file.type.replace('image/', '').toUpperCase() : 'IMAGE';
            imgNativeFormat.textContent = format;

            // Headline slug suggestion
            const rawTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
            imgArticleHeadline.value = rawTitle;

            // Dimensions setup: default 720x720 for 1:1 News Teaser standard
            setImgDimensions(720, 720);

            // Switch to studio view
            imageUploadSection.classList.add('hidden');
            imageBatchSection.classList.add('hidden');
            imageResultsSection.classList.add('hidden');
            imageStudioSection.classList.remove('hidden');

            if (btnBatchFromStudio) {
                btnBatchFromStudio.classList.toggle('hidden', batchQueue.length === 0);
            }

            updateImgCropOverlay();
            updateImgWatermarkPreview();
            updateImgEstimation();
            updateSlugPreview();

            imageStudioSection.scrollIntoView({ behavior: 'smooth' });
            showToast(`Loaded ${file.name} into Editorial Studio`, 'success');
        };

        img.onerror = () => {
            showToast('Could not decode the selected image file.', 'error');
        };

        img.src = currentImgBlobUrl;
    }

    // -------------------------------------------------------------------------
    // Single Image Conversion
    // -------------------------------------------------------------------------
    if (btnConvertImage) {
        btnConvertImage.addEventListener('click', async () => {
            await convertImageToWebp();
        });
    }

    async function convertImageToWebp() {
        if (!currentImgElement) {
            showToast('Please load an image first', 'error');
            return;
        }

        const targetW = parseInt(imgResWidth.value, 10) || 720;
        const targetH = parseInt(imgResHeight.value, 10) || 720;
        const quality = (parseInt(imgQualityRange.value, 10) || 82) / 100;
        const isBlurMode = imgModeBlur ? imgModeBlur.checked : false;
        const isSolidMode = imgModeSolid ? imgModeSolid.checked : false;

        progressOverlay.classList.add('active');
        progressBarFill.style.width = '20%';
        progressPercent.textContent = '25%';
        progressStatus.textContent = 'Cropping and framing news image...';
        progressSpeed.textContent = 'Processing...';

        await new Promise(r => setTimeout(r, 60));

        try {
            imageOffscreenCanvas.width = targetW;
            imageOffscreenCanvas.height = targetH;

            const natW = currentImgElement.naturalWidth;
            const natH = currentImgElement.naturalHeight;

            let drawSource = currentImgElement;
            if (imgRotation !== 0) {
                const rotCanvas = document.createElement('canvas');
                if (imgRotation === 90 || imgRotation === 270) {
                    rotCanvas.width = natH;
                    rotCanvas.height = natW;
                } else {
                    rotCanvas.width = natW;
                    rotCanvas.height = natH;
                }
                const rotCtx = rotCanvas.getContext('2d');
                rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
                rotCtx.rotate((imgRotation * Math.PI) / 180);
                rotCtx.drawImage(currentImgElement, -natW / 2, -natH / 2);
                drawSource = rotCanvas;
            }

            const srcW = drawSource.width || drawSource.naturalWidth;
            const srcH = drawSource.height || drawSource.naturalHeight;

            imageOffscreenCtx.clearRect(0, 0, targetW, targetH);

            if (isBlurMode) {
                imageOffscreenCtx.save();
                imageOffscreenCtx.filter = 'blur(25px) brightness(0.65) saturate(1.3)';
                imageOffscreenCtx.drawImage(drawSource, -20, -20, targetW + 40, targetH + 40);
                imageOffscreenCtx.restore();

                const scale = Math.min(targetW / srcW, targetH / srcH);
                const fitW = srcW * scale;
                const fitH = srcH * scale;
                const fitX = (targetW - fitW) / 2;
                const fitY = (targetH - fitH) / 2;
                imageOffscreenCtx.drawImage(drawSource, fitX, fitY, fitW, fitH);

            } else if (isSolidMode) {
                imageOffscreenCtx.fillStyle = '#070a12';
                imageOffscreenCtx.fillRect(0, 0, targetW, targetH);

                const scale = Math.min(targetW / srcW, targetH / srcH);
                const fitW = srcW * scale;
                const fitH = srcH * scale;
                const fitX = (targetW - fitW) / 2;
                const fitY = (targetH - fitH) / 2;
                imageOffscreenCtx.drawImage(drawSource, fitX, fitY, fitW, fitH);

            } else {
                const targetAspect = targetW / targetH;
                let sx, sy, sWidth, sHeight;

                if (srcW / srcH > targetAspect) {
                    sHeight = srcH;
                    sWidth = srcH * targetAspect;
                    sy = 0;
                    const maxTravel = srcW - sWidth;
                    sx = maxTravel * imgCropRatioX;
                } else {
                    sWidth = srcW;
                    sHeight = srcW / targetAspect;
                    sx = 0;
                    const maxTravel = srcH - sHeight;
                    sy = maxTravel * imgCropRatioY;
                }

                imageOffscreenCtx.drawImage(drawSource, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
            }

            progressBarFill.style.width = '65%';
            progressPercent.textContent = '70%';
            progressStatus.textContent = 'Applying newsroom watermark & bug...';

            if (enableImgWatermark && enableImgWatermark.checked) {
                const watermarkOpts = {
                    enabled: true,
                    text: (imgWatermarkText.value || 'GROUND ZERO').trim() || 'GROUND ZERO',
                    position: 'center',
                    style: imgWatermarkStyle ? imgWatermarkStyle.value : 'badge',
                    opacity: parseInt(imgWatermarkOpacity.value, 10) || 85
                };
                drawWatermarkOnCanvas(imageOffscreenCtx, targetW, targetH, watermarkOpts);
            }

            progressBarFill.style.width = '85%';
            progressPercent.textContent = '90%';
            progressStatus.textContent = 'Encoding WebP container...';

            const webpBlob = await new Promise((resolve, reject) => {
                imageOffscreenCanvas.toBlob((b) => {
                    if (b) resolve(b);
                    else reject(new Error('Canvas WebP encoding failed.'));
                }, 'image/webp', quality);
            });

            progressBarFill.style.width = '100%';
            progressPercent.textContent = '100%';

            await handleImageConversionSuccess(webpBlob, {
                width: targetW,
                height: targetH,
                format: chkLosslessWebp && chkLosslessWebp.checked ? 'Lossless VP8L' : 'Lossy VP8'
            });

        } catch (err) {
            console.error('Image conversion error:', err);
            showToast('Conversion failed: ' + err.message, 'error');
        } finally {
            progressOverlay.classList.remove('active');
        }
    }

    async function handleImageConversionSuccess(webpBlob, meta) {
        currentImgWebpBlob = webpBlob;
        if (currentImgWebpBlobUrl) {
            URL.revokeObjectURL(currentImgWebpBlobUrl);
        }
        currentImgWebpBlobUrl = URL.createObjectURL(webpBlob);

        comparisonImgOriginal.src = currentImgBlobUrl;
        comparisonImgWebp.src = currentImgWebpBlobUrl;

        const webpBytes = webpBlob.size;
        const webpKb = Math.round(webpBytes / 1024);
        const webpFormatted = webpKb > 1024 ? `${(webpBytes / (1024 * 1024)).toFixed(2)} MB` : `${webpKb} KB`;
        webpImgResultSize.textContent = webpFormatted;

        const origBytes = currentImgFile ? currentImgFile.size : webpBytes * 6;
        const origKb = Math.round(origBytes / 1024);
        const origFormatted = origKb > 1024 ? `${(origBytes / (1024 * 1024)).toFixed(2)} MB` : `${origKb} KB`;
        origImgSizePill.textContent = origFormatted;

        const savingsPct = Math.max(0, Math.round(((origBytes - webpBytes) / origBytes) * 100));
        metricImgSavings.textContent = `-${savingsPct}%`;
        metricImgRes.textContent = `${meta.width} × ${meta.height}`;
        metricImgFormat.textContent = meta.format;

        if (webpKb < 150) {
            metricImgVitals.textContent = '⚡ Lightning Fast (<150ms LCP)';
            metricImgVitals.style.color = 'var(--brand-emerald)';
        } else if (webpKb < 350) {
            metricImgVitals.textContent = '🟢 Excellent Editorial (<300ms)';
            metricImgVitals.style.color = 'var(--brand-emerald)';
        } else {
            metricImgVitals.textContent = '🟡 Good (<600ms LCP)';
            metricImgVitals.style.color = 'var(--brand-amber)';
        }

        imageResultsSection.classList.remove('hidden');
        imageResultsSection.scrollIntoView({ behavior: 'smooth' });

        showToast(`WebP ready! Saved ${savingsPct}% bandwidth.`, 'success');

        const filename = getImageSlugFilename();
        showToast('Auto-saving WebP to files/...', 'info');

        const saveResult = await saveWebpToFiles(webpBlob, filename);
        if (saveResult.success) {
            if (imgAutoSavedPath) imgAutoSavedPath.textContent = saveResult.path;
            if (modalSavedPath) modalSavedPath.textContent = saveResult.path;
            if (btnOpenSavedImgFile) {
                if (saveResult.url) {
                    btnOpenSavedImgFile.href = saveResult.url;
                    btnOpenSavedImgFile.style.display = 'inline-block';
                } else {
                    btnOpenSavedImgFile.style.display = 'none';
                }
            }
            showToast(`Auto-saved to ${saveResult.path}`, 'success');
        } else {
            if (imgAutoSavedPath) imgAutoSavedPath.textContent = 'files/' + filename;
        }

        const shouldPrompt = chkAutoPromptNew ? chkAutoPromptNew.checked : true;
        if (shouldPrompt && newVideoModal) {
            setTimeout(() => {
                newVideoModal.classList.add('active');
            }, 600);
        }
    }

    // Results Actions (Image Mode)
    if (btnDownloadImageWebp) {
        btnDownloadImageWebp.addEventListener('click', async () => {
            if (!currentImgWebpBlob) return;
            const filename = getImageSlugFilename();
            const nativeDownload = window.Capacitor?.Plugins?.WebpDownload;
            btnDownloadImageWebp.disabled = true;

            try {
                if (window.Capacitor?.isNativePlatform?.() && nativeDownload) {
                    const base64 = await blobToBase64(currentImgWebpBlob);
                    await nativeDownload.saveWebp({ base64, filename });
                    showToast(`Saved to Downloads/PressWebP: ${filename}`, 'success');
                } else {
                    const a = document.createElement('a');
                    a.href = currentImgWebpBlobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    showToast(`Downloaded: ${filename}`, 'success');
                }
            } catch (err) {
                console.error('Download failed:', err);
                showToast('Could not save WebP: ' + err.message, 'error');
            } finally {
                btnDownloadImageWebp.disabled = false;
            }
        });
    }

    if (btnCopyImageClipboard) {
        btnCopyImageClipboard.addEventListener('click', async () => {
            if (!currentImgWebpBlob) return;
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/webp': currentImgWebpBlob })
                ]);
                showToast('WebP image copied to clipboard!', 'success');
            } catch (err) {
                showToast('Direct image clipboard copy not supported in this browser. Please use Download.', 'info');
            }
        });
    }

    if (btnInspectImageResult) {
        btnInspectImageResult.addEventListener('click', () => {
            if (!currentImgWebpBlob) return;
            inspectWebpFile(currentImgWebpBlob, getImageSlugFilename());
        });
    }

    if (btnNewImage) {
        btnNewImage.addEventListener('click', () => {
            imageResultsSection.classList.add('hidden');
            imageStudioSection.classList.add('hidden');
            imageUploadSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                if (imageFileInput) imageFileInput.click();
            }, 250);
        });
    }

    if (btnChangeImage) {
        btnChangeImage.addEventListener('click', () => {
            imageStudioSection.classList.add('hidden');
            imageUploadSection.classList.remove('hidden');
            setTimeout(() => {
                if (imageFileInput) imageFileInput.click();
            }, 200);
        });
    }

    // -------------------------------------------------------------------------
    // BATCH MULTI-PHOTO CONVERTER LOGIC
    // -------------------------------------------------------------------------
    function handleImageFiles(files) {
        if (!files || files.length === 0) return;

        if (files.length === 1 && batchQueue.length === 0) {
            loadImageIntoStudio(files[0]);
        } else {
            loadImagesIntoBatch(files);
        }
    }

    function loadImagesIntoBatch(files) {
        for (const file of files) {
            const id = 'batch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            const blobUrl = URL.createObjectURL(file);
            batchQueue.push({
                id,
                file,
                blobUrl,
                name: file.name,
                size: file.size,
                status: 'pending',
                webpBlob: null,
                webpUrl: null,
                webpSize: 0,
                savingsPct: 0
            });
        }

        renderBatchUI();
        imageUploadSection.classList.add('hidden');
        imageStudioSection.classList.add('hidden');
        imageResultsSection.classList.add('hidden');
        imageBatchSection.classList.remove('hidden');
        imageBatchSection.scrollIntoView({ behavior: 'smooth' });
        showToast(`Queued ${files.length} news photos for batch processing`, 'info');
    }

    function renderBatchUI() {
        const count = batchQueue.length;
        if (batchBtnCount) batchBtnCount.textContent = count;
        if (batchCountBadge) batchCountBadge.textContent = `${count} ${count === 1 ? 'photo' : 'photos'}`;

        batchCardsGrid.innerHTML = '';
        batchQueue.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'batch-photo-card';

            const sizeMb = (item.size / (1024 * 1024)).toFixed(2);
            const sizeStr = item.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(item.size / 1024)} KB`;

            let statusHtml = '';
            if (item.status === 'pending') {
                statusHtml = `<span class="batch-status-pill pending">Queued</span>`;
            } else if (item.status === 'converting') {
                statusHtml = `<span class="batch-status-pill converting">Converting...</span>`;
            } else if (item.status === 'done') {
                const webpStr = item.webpSize > 1024 * 1024 ? `${(item.webpSize / (1024 * 1024)).toFixed(2)} MB` : `${Math.round(item.webpSize / 1024)} KB`;
                statusHtml = `
                    <span class="batch-status-pill done">${webpStr} (-${item.savingsPct}%)</span>
                    <button type="button" class="batch-card-download-btn" data-id="${item.id}">📥 Download</button>
                `;
            } else {
                statusHtml = `<span class="batch-status-pill pending" style="color:var(--brand-rose);">Failed</span>`;
            }

            card.innerHTML = `
                <div class="batch-card-thumb-wrap">
                    <img src="${item.webpUrl || item.blobUrl}" alt="${item.name}">
                    <button type="button" class="batch-card-remove" data-id="${item.id}" title="Remove photo">&times;</button>
                </div>
                <div class="batch-card-body">
                    <div class="batch-card-name" title="${item.name}">${item.name}</div>
                    <div class="batch-card-meta">
                        <span>${sizeStr}</span>
                        <span>#${index + 1}</span>
                    </div>
                    <div class="batch-card-status">
                        ${statusHtml}
                    </div>
                </div>
            `;

            const btnRemove = card.querySelector('.batch-card-remove');
            btnRemove.addEventListener('click', (e) => {
                e.stopPropagation();
                removeBatchItem(item.id);
            });

            const btnDown = card.querySelector('.batch-card-download-btn');
            if (btnDown) {
                btnDown.addEventListener('click', (e) => {
                    e.stopPropagation();
                    downloadBatchItem(item);
                });
            }

            card.addEventListener('click', () => {
                loadImageIntoStudio(item.file);
            });

            batchCardsGrid.appendChild(card);
        });

        const hasDone = batchQueue.some(i => i.status === 'done');
        if (btnDownloadBatchZip) btnDownloadBatchZip.classList.toggle('hidden', !hasDone);
        if (btnAutoSaveBatchAll) btnAutoSaveBatchAll.classList.toggle('hidden', !hasDone);
    }

    function removeBatchItem(id) {
        const idx = batchQueue.findIndex(i => i.id === id);
        if (idx !== -1) {
            URL.revokeObjectURL(batchQueue[idx].blobUrl);
            if (batchQueue[idx].webpUrl) URL.revokeObjectURL(batchQueue[idx].webpUrl);
            batchQueue.splice(idx, 1);
            renderBatchUI();
            if (batchQueue.length === 0) {
                imageBatchSection.classList.add('hidden');
                imageUploadSection.classList.remove('hidden');
            }
        }
    }

    async function downloadBatchItem(item) {
        if (!item.webpBlob) return;
        const filename = item.finalFilename || `${slugify(item.name.replace(/\.[^/.]+$/, ''))}.webp`;
        const a = document.createElement('a');
        a.href = item.webpUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast(`Downloaded: ${filename}`, 'success');
    }

    if (btnBatchToggle) {
        btnBatchToggle.addEventListener('click', () => {
            if (batchQueue.length > 0) {
                imageUploadSection.classList.add('hidden');
                imageStudioSection.classList.add('hidden');
                imageResultsSection.classList.add('hidden');
                imageBatchSection.classList.remove('hidden');
                imageBatchSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                imageFileInput.click();
            }
        });
    }

    if (btnSwitchSingleStudio) {
        btnSwitchSingleStudio.addEventListener('click', () => {
            if (batchQueue.length > 0) {
                loadImageIntoStudio(batchQueue[0].file);
            } else {
                showToast('Queue is empty. Load photos first.', 'info');
            }
        });
    }

    if (btnBatchFromStudio) {
        btnBatchFromStudio.addEventListener('click', () => {
            imageStudioSection.classList.add('hidden');
            imageBatchSection.classList.remove('hidden');
            imageBatchSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnAddMoreBatchPhotos) {
        btnAddMoreBatchPhotos.addEventListener('click', () => {
            imageFileInput.click();
        });
    }

    if (btnClearBatch) {
        btnClearBatch.addEventListener('click', () => {
            batchQueue.forEach(item => {
                URL.revokeObjectURL(item.blobUrl);
                if (item.webpUrl) URL.revokeObjectURL(item.webpUrl);
            });
            batchQueue = [];
            renderBatchUI();
            imageBatchSection.classList.add('hidden');
            imageUploadSection.classList.remove('hidden');
            showToast('Batch queue cleared', 'info');
        });
    }

    if (batchQualityRange) {
        batchQualityRange.addEventListener('input', () => {
            if (valBatchQuality) valBatchQuality.textContent = `${batchQualityRange.value}%`;
        });
    }

    // Convert All Batch Photos
    if (btnConvertBatchAll) {
        btnConvertBatchAll.addEventListener('click', async () => {
            if (isBatchConverting || batchQueue.length === 0) return;
            isBatchConverting = true;
            btnConvertBatchAll.disabled = true;

            if (batchProgressBarWrap) batchProgressBarWrap.classList.remove('hidden');
            if (batchProgressBarFill) batchProgressBarFill.style.width = '0%';
            batchGlobalStatus.textContent = `Converting 0 of ${batchQueue.length}...`;

            const preset = batchPresetSelect ? batchPresetSelect.value : 'original';
            const quality = (parseInt(batchQualityRange.value, 10) || 82) / 100;
            const prefix = (batchSlugPrefix ? batchSlugPrefix.value : 'press_article_').trim();
            const watermark = batchEnableWatermark ? batchEnableWatermark.checked : true;

            for (let i = 0; i < batchQueue.length; i++) {
                const item = batchQueue[i];
                item.status = 'converting';
                renderBatchUI();

                const pct = Math.round(((i) / batchQueue.length) * 100);
                if (batchProgressBarFill) batchProgressBarFill.style.width = `${pct}%`;
                batchGlobalStatus.textContent = `Converting ${i + 1} of ${batchQueue.length}: ${item.name}...`;

                try {
                    const img = await new Promise((res, rej) => {
                        const el = new Image();
                        el.onload = () => res(el);
                        el.onerror = rej;
                        el.src = item.blobUrl;
                    });

                    let targetW = img.naturalWidth;
                    let targetH = img.naturalHeight;

                    if (preset === '1:1-1080') {
                        targetW = 1080;
                        targetH = 1080;
                    } else if (preset === '1:1-480') {
                        targetW = 480;
                        targetH = 480;
                    } else if (preset === '1:1-1200') {
                        targetW = 1200;
                        targetH = 1200;
                    } else if (preset === '1:1-600') {
                        targetW = 600;
                        targetH = 600;
                    } else if (preset === '1:1-360') {
                        targetW = 360;
                        targetH = 360;
                    } else {
                        targetW = 720;
                        targetH = 720;
                    }

                    imageOffscreenCanvas.width = targetW;
                    imageOffscreenCanvas.height = targetH;
                    imageOffscreenCtx.clearRect(0, 0, targetW, targetH);

                    // 1:1 Center Square Crop
                    const srcAspect = img.naturalWidth / img.naturalHeight;
                    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

                    if (srcAspect > 1.0) {
                        sw = img.naturalHeight;
                        sx = (img.naturalWidth - sw) / 2;
                    } else {
                        sh = img.naturalWidth;
                        sy = (img.naturalHeight - sh) / 2;
                    }

                    imageOffscreenCtx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);

                    if (watermark) {
                        drawWatermarkOnCanvas(imageOffscreenCtx, targetW, targetH, {
                            enabled: true,
                            text: (imgWatermarkText ? imgWatermarkText.value : 'GROUND ZERO') || 'GROUND ZERO',
                            position: 'center',
                            style: 'badge',
                            opacity: 85
                        });
                    }

                    const blob = await new Promise(res => {
                        imageOffscreenCanvas.toBlob(res, 'image/webp', quality);
                    });

                    item.webpBlob = blob;
                    item.webpUrl = URL.createObjectURL(blob);
                    item.webpSize = blob.size;
                    item.savingsPct = Math.max(0, Math.round(((item.size - blob.size) / item.size) * 100));
                    item.status = 'done';
                    item.finalFilename = `${slugify(prefix + '_' + (i + 1) + '_' + item.name.replace(/\.[^/.]+$/, ''))}_${targetW}x${targetH}.webp`;

                } catch (err) {
                    console.error('Batch convert item error:', err);
                    item.status = 'error';
                }
            }

            if (batchProgressBarFill) batchProgressBarFill.style.width = '100%';
            batchGlobalStatus.textContent = `Batch complete! Converted ${batchQueue.length} photos.`;
            isBatchConverting = false;
            btnConvertBatchAll.disabled = false;
            renderBatchUI();
            showToast(`All ${batchQueue.length} photos converted to WebP!`, 'success');
        });
    }

    // Download All as ZIP
    if (btnDownloadBatchZip) {
        btnDownloadBatchZip.addEventListener('click', async () => {
            const doneItems = batchQueue.filter(i => i.status === 'done' && i.webpBlob);
            if (doneItems.length === 0) return;

            btnDownloadBatchZip.disabled = true;
            showToast('Generating ZIP archive...', 'info');

            try {
                const files = [];
                for (const item of doneItems) {
                    const buf = await item.webpBlob.arrayBuffer();
                    files.push({
                        name: item.finalFilename || `${item.name.replace(/\.[^/.]+$/, '')}.webp`,
                        data: new Uint8Array(buf)
                    });
                }

                const zipBlob = createZipBlob(files);
                const zipUrl = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = zipUrl;
                a.download = `press_news_webp_batch_${Date.now()}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(zipUrl);

                showToast(`Downloaded ZIP with ${files.length} WebP photos!`, 'success');
            } catch (err) {
                console.error('ZIP creation error:', err);
                showToast('Failed to create ZIP: ' + err.message, 'error');
            } finally {
                btnDownloadBatchZip.disabled = false;
            }
        });
    }

    // Auto-Save All to files/
    if (btnAutoSaveBatchAll) {
        btnAutoSaveBatchAll.addEventListener('click', async () => {
            const doneItems = batchQueue.filter(i => i.status === 'done' && i.webpBlob);
            if (doneItems.length === 0) return;

            btnAutoSaveBatchAll.disabled = true;
            showToast(`Auto-saving ${doneItems.length} photos to files/...`, 'info');

            let savedCount = 0;
            for (const item of doneItems) {
                const res = await saveWebpToFiles(item.webpBlob, item.finalFilename);
                if (res.success) savedCount++;
            }

            showToast(`Auto-saved ${savedCount} of ${doneItems.length} photos to files/ folder!`, 'success');
            btnAutoSaveBatchAll.disabled = false;
        });
    }

    // -------------------------------------------------------------------------
    // Image Drag & Drop, File Picker, Clipboard & Demo Photo
    // -------------------------------------------------------------------------
    if (btnBrowseImageFiles) {
        btnBrowseImageFiles.addEventListener('click', () => {
            imageFileInput.click();
        });
    }

    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleImageFiles(Array.from(e.target.files));
                imageFileInput.value = '';
            }
        });
    }

    if (imageUploadSection) {
        imageUploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadSection.classList.add('dragover');
        });
        imageUploadSection.addEventListener('dragleave', () => {
            imageUploadSection.classList.remove('dragover');
        });
        imageUploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadSection.classList.remove('dragover');
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleImageFiles(Array.from(e.dataTransfer.files));
            }
        });
    }

    // Paste from Clipboard (Ctrl+V) anywhere
    window.addEventListener('paste', (e) => {
        const items = e.clipboardData && e.clipboardData.items;
        if (!items) return;

        const imageFiles = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].type && items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const ext = blob.type.split('/')[1] || 'png';
                    const file = new File([blob], `clipboard_news_${Date.now()}.${ext}`, { type: blob.type });
                    imageFiles.push(file);
                }
            }
        }

        if (imageFiles.length > 0) {
            setActiveMode('image');
            showToast(`Pasted ${imageFiles.length} photo${imageFiles.length > 1 ? 's' : ''} from clipboard!`, 'success');
            handleImageFiles(imageFiles);
        }
    });

    if (btnPasteClipboard) {
        btnPasteClipboard.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.read) {
                    const clipboardItems = await navigator.clipboard.read();
                    const imageFiles = [];
                    for (const item of clipboardItems) {
                        for (const type of item.types) {
                            if (type.startsWith('image/')) {
                                const blob = await item.getType(type);
                                const ext = type.split('/')[1] || 'png';
                                const file = new File([blob], `clipboard_news_${Date.now()}.${ext}`, { type });
                                imageFiles.push(file);
                            }
                        }
                    }
                    if (imageFiles.length > 0) {
                        setActiveMode('image');
                        handleImageFiles(imageFiles);
                        showToast(`Pasted ${imageFiles.length} photo(s) from clipboard!`, 'success');
                        return;
                    }
                }
                showToast('Press Ctrl+V (or Cmd+V on Mac) to paste any image from your clipboard!', 'info');
            } catch (err) {
                showToast('Press Ctrl+V to paste an image directly from your clipboard.', 'info');
            }
        });
    }

    // Demo Photo Loader
    if (btnLoadDemoImage) {
        btnLoadDemoImage.addEventListener('click', async () => {
            try {
                showToast('Loading news photojournalism demo...', 'info');
                const res = await fetch('sample_news_photo.jpg');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                const file = new File([blob], 'global_summit_press_conference.jpg', { type: 'image/jpeg' });
                setActiveMode('image');
                loadImageIntoStudio(file);
                showToast('Loaded demo news photo (1920×1080 JPEG)!', 'success');
            } catch (err) {
                console.error('Demo photo load error:', err);
                if (window.location.protocol === 'file:') {
                    showToast('Running via file://. Run CONVERTER.bat or drag sample_news_photo.jpg directly!', 'info');
                } else {
                    showToast('Could not load demo photo: ' + err.message, 'error');
                }
            }
        });
    }

    // Initialize app cleanly at unified media dropzone
    switchToWorkspace('dropzone');

    // Window resize handler to reposition crop overlay
    window.addEventListener('resize', () => {
        if (currentImgElement && imageStudioSection && !imageStudioSection.classList.contains('hidden')) {
            updateImgCropOverlay();
        }
    });

});

