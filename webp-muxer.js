/**
 * WebPMuxer - High-Performance Pure JavaScript Animated WebP Muxer & Inspector
 * 
 * Compliant with Google WebP Container Specification:
 * - RIFF WebP Header
 * - VP8X Extended WebP Header (Animation & Alpha flags, Canvas dimensions)
 * - ANIM Chunk (Background Color & Loop Count)
 * - ANMF Chunks (Frame offsets, dimensions, duration ms, disposal/blend flags, and VP8/VP8L/ALPH bitstreams)
 * 
 * Works 100% client-side in the browser with zero external dependencies.
 */

class WebPMuxer {
    constructor(options = {}) {
        this.width = Math.round(options.width || 720);
        this.height = Math.round(options.height || 720);
        this.loopCount = options.loopCount !== undefined ? Math.round(options.loopCount) : 0; // 0 = infinite
        this.backgroundColor = options.backgroundColor || 0x00000000; // BGRA
        this.frames = [];
    }

    /**
     * Add a frame from a WebP Blob (e.g., from canvas.toBlob(..., 'image/webp', quality))
     * @param {Blob} blob - Single-frame WebP Blob
     * @param {number} durationMs - Frame duration in milliseconds
     */
    async addFrameFromBlob(blob, durationMs) {
        const arrayBuffer = await blob.arrayBuffer();
        this.addFrameFromBuffer(arrayBuffer, durationMs);
    }

    /**
     * Add a frame from a single-frame WebP ArrayBuffer or Uint8Array
     * @param {ArrayBuffer|Uint8Array} buffer 
     * @param {number} durationMs 
     */
    addFrameFromBuffer(buffer, durationMs) {
        const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        const parsed = WebPMuxer.extractFrameBitstream(u8);
        
        this.frames.push({
            bitstream: parsed.bitstream,
            hasAlpha: parsed.hasAlpha,
            duration: Math.max(10, Math.round(durationMs)),
            width: parsed.width || this.width,
            height: parsed.height || this.height
        });
    }

    /**
     * Parse a single-frame WebP and extract the pure image bitstream chunks (VP8, VP8L, ALPH)
     * @param {Uint8Array} u8 
     * @returns {{bitstream: Uint8Array, hasAlpha: boolean, width?: number, height?: number}}
     */
    static extractFrameBitstream(u8) {
        const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
        
        // Validate RIFF header
        const riffMagic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
        const webpMagic = String.fromCharCode(u8[8], u8[9], u8[10], u8[11]);
        
        if (riffMagic !== 'RIFF' || webpMagic !== 'WEBP') {
            throw new Error('Invalid WebP image: missing RIFF/WEBP header');
        }

        let offset = 12;
        const relevantChunks = [];
        let hasAlpha = false;
        let detectedWidth = 0;
        let detectedHeight = 0;

        while (offset + 8 <= u8.length) {
            const tag = String.fromCharCode(u8[offset], u8[offset + 1], u8[offset + 2], u8[offset + 3]);
            const size = view.getUint32(offset + 4, true);
            const chunkTotalWithHeader = 8 + size;
            const paddedSize = chunkTotalWithHeader + (size % 2);

            if (tag === 'VP8X') {
                const flags = u8[offset + 8];
                hasAlpha = (flags & 0x10) !== 0;
                detectedWidth = (u8[offset + 12] | (u8[offset + 13] << 8) | (u8[offset + 14] << 16)) + 1;
                detectedHeight = (u8[offset + 15] | (u8[offset + 16] << 8) | (u8[offset + 17] << 16)) + 1;
            } else if (tag === 'VP8 ' || tag === 'VP8L' || tag === 'ALPH') {
                if (tag === 'ALPH' || tag === 'VP8L') {
                    hasAlpha = true;
                }
                // Copy tag + size + payload + padding
                const sliceEnd = Math.min(offset + paddedSize, u8.length);
                relevantChunks.push(u8.slice(offset, sliceEnd));
            }

            offset += paddedSize;
        }

        if (relevantChunks.length === 0) {
            throw new Error('No valid VP8/VP8L image data found in WebP frame');
        }

        // Concatenate relevant subchunks
        const totalLen = relevantChunks.reduce((acc, c) => acc + c.length, 0);
        const bitstream = new Uint8Array(totalLen);
        let cursor = 0;
        for (const chunk of relevantChunks) {
            bitstream.set(chunk, cursor);
            cursor += chunk.length;
        }

        return {
            bitstream,
            hasAlpha,
            width: detectedWidth,
            height: detectedHeight
        };
    }

    /**
     * Build the final Animated WebP as a Uint8Array
     * @returns {Uint8Array}
     */
    build() {
        if (this.frames.length === 0) {
            throw new Error('Cannot build Animated WebP: no frames added');
        }

        const chunks = [];
        const hasAlpha = this.frames.some(f => f.hasAlpha);
        const wMinus1 = this.width - 1;
        const hMinus1 = this.height - 1;

        // 1. VP8X Chunk (10 bytes payload)
        const vp8xPayload = new Uint8Array(10);
        let vp8xFlags = 0x02; // Animation flag (bit 1)
        if (hasAlpha) vp8xFlags |= 0x10; // Alpha flag (bit 4)
        vp8xPayload[0] = vp8xFlags;
        vp8xPayload[1] = 0; // reserved
        vp8xPayload[2] = 0;
        vp8xPayload[3] = 0;
        // Width - 1 (24-bit LE)
        vp8xPayload[4] = wMinus1 & 0xff;
        vp8xPayload[5] = (wMinus1 >> 8) & 0xff;
        vp8xPayload[6] = (wMinus1 >> 16) & 0xff;
        // Height - 1 (24-bit LE)
        vp8xPayload[7] = hMinus1 & 0xff;
        vp8xPayload[8] = (hMinus1 >> 8) & 0xff;
        vp8xPayload[9] = (hMinus1 >> 16) & 0xff;

        chunks.push(WebPMuxer.createChunk('VP8X', vp8xPayload));

        // 2. ANIM Chunk (6 bytes payload)
        const animPayload = new Uint8Array(6);
        const animView = new DataView(animPayload.buffer);
        animView.setUint32(0, this.backgroundColor, true); // BG Color (BGRA)
        animView.setUint16(4, this.loopCount, true); // Loop count (0 = infinite)

        chunks.push(WebPMuxer.createChunk('ANIM', animPayload));

        // 3. ANMF Chunks for each frame
        for (const frame of this.frames) {
            const framePayload = new Uint8Array(16 + frame.bitstream.length);
            const view = new DataView(framePayload.buffer);

            // Frame X offset / 2 (24-bit LE)
            framePayload[0] = 0;
            framePayload[1] = 0;
            framePayload[2] = 0;

            // Frame Y offset / 2 (24-bit LE)
            framePayload[3] = 0;
            framePayload[4] = 0;
            framePayload[5] = 0;

            // Frame Width - 1 (24-bit LE)
            framePayload[6] = wMinus1 & 0xff;
            framePayload[7] = (wMinus1 >> 8) & 0xff;
            framePayload[8] = (wMinus1 >> 16) & 0xff;

            // Frame Height - 1 (24-bit LE)
            framePayload[9] = hMinus1 & 0xff;
            framePayload[10] = (hMinus1 >> 8) & 0xff;
            framePayload[11] = (hMinus1 >> 16) & 0xff;

            // Frame Duration (24-bit LE)
            const dur = Math.round(frame.duration);
            framePayload[12] = dur & 0xff;
            framePayload[13] = (dur >> 8) & 0xff;
            framePayload[14] = (dur >> 16) & 0xff;

            // Flags: bit 1 = 1 (do not blend), bit 2 = 0 (do not dispose)
            framePayload[15] = 0x02;

            // Copy frame bitstream into ANMF
            framePayload.set(frame.bitstream, 16);

            chunks.push(WebPMuxer.createChunk('ANMF', framePayload));
        }

        // Calculate total RIFF size
        let totalPayloadSize = 4; // 'WEBP'
        for (const chunk of chunks) {
            totalPayloadSize += chunk.length;
        }

        // Create RIFF Header (12 bytes)
        const riffHeader = new Uint8Array(12);
        riffHeader[0] = 0x52; // 'R'
        riffHeader[1] = 0x49; // 'I'
        riffHeader[2] = 0x46; // 'F'
        riffHeader[3] = 0x46; // 'F'
        const riffView = new DataView(riffHeader.buffer);
        riffView.setUint32(4, totalPayloadSize, true); // Size after RIFF tag and size fields
        riffHeader[8]  = 0x57; // 'W'
        riffHeader[9]  = 0x45; // 'E'
        riffHeader[10] = 0x42; // 'B'
        riffHeader[11] = 0x50; // 'P'

        // Concatenate RIFF header and all chunks
        const totalSize = 12 + chunks.reduce((acc, c) => acc + c.length, 0);
        const result = new Uint8Array(totalSize);
        result.set(riffHeader, 0);

        let cur = 12;
        for (const chunk of chunks) {
            result.set(chunk, cur);
            cur += chunk.length;
        }

        return result;
    }

    /**
     * Build the final Animated WebP as a downloadable Blob
     * @returns {Blob}
     */
    buildBlob() {
        const u8 = this.build();
        return new Blob([u8], { type: 'image/webp' });
    }

    /**
     * Helper to create a chunk with 4-byte Tag, 4-byte Size (LE), and padded payload
     * @param {string} tag 4-character chunk tag
     * @param {Uint8Array} payload 
     * @returns {Uint8Array}
     */
    static createChunk(tag, payload) {
        const pad = payload.length % 2 !== 0 ? 1 : 0;
        const totalChunkSize = 8 + payload.length + pad;
        const chunk = new Uint8Array(totalChunkSize);

        // Tag
        chunk[0] = tag.charCodeAt(0);
        chunk[1] = tag.charCodeAt(1);
        chunk[2] = tag.charCodeAt(2);
        chunk[3] = tag.charCodeAt(3);

        // Size (LE) - stores unpadded payload length
        const view = new DataView(chunk.buffer);
        view.setUint32(4, payload.length, true);

        // Payload
        chunk.set(payload, 8);

        // Padding byte is 0 by default in Uint8Array
        return chunk;
    }

    /**
     * Parse and inspect any WebP file (animated or static)
     * Returns detailed metadata for editorial inspection
     * @param {ArrayBuffer|Uint8Array} buffer 
     */
    static inspect(buffer) {
        const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);

        if (u8.length < 12) {
            throw new Error('File too small to be a valid WebP');
        }

        const riffMagic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
        const webpMagic = String.fromCharCode(u8[8], u8[9], u8[10], u8[11]);
        const fileSize = view.getUint32(4, true) + 8;

        if (riffMagic !== 'RIFF' || webpMagic !== 'WEBP') {
            throw new Error('Not a valid WebP file');
        }

        let offset = 12;
        const chunks = [];
        let isAnimated = false;
        let hasAlpha = false;
        let canvasWidth = 0;
        let canvasHeight = 0;
        let loopCount = 0;
        let frameCount = 0;
        const frameDurations = [];

        while (offset + 8 <= u8.length) {
            const tag = String.fromCharCode(u8[offset], u8[offset + 1], u8[offset + 2], u8[offset + 3]);
            const size = view.getUint32(offset + 4, true);

            chunks.push({ tag, size, offset });

            if (tag === 'VP8X') {
                const flags = u8[offset + 8];
                isAnimated = (flags & 0x02) !== 0;
                hasAlpha = (flags & 0x10) !== 0;
                canvasWidth = (u8[offset + 12] | (u8[offset + 13] << 8) | (u8[offset + 14] << 16)) + 1;
                canvasHeight = (u8[offset + 15] | (u8[offset + 16] << 8) | (u8[offset + 17] << 16)) + 1;
            } else if (tag === 'ANIM') {
                loopCount = view.getUint16(offset + 12, true);
            } else if (tag === 'ANMF') {
                frameCount++;
                const dur = u8[offset + 20] | (u8[offset + 21] << 8) | (u8[offset + 22] << 16);
                frameDurations.push(dur);
                if (!canvasWidth) {
                    canvasWidth = (u8[offset + 14] | (u8[offset + 15] << 8) | (u8[offset + 16] << 16)) + 1;
                    canvasHeight = (u8[offset + 17] | (u8[offset + 18] << 8) | (u8[offset + 19] << 16)) + 1;
                }
            } else if (tag === 'VP8 ' && !canvasWidth) {
                // Keyframe dimensions in VP8 bitstream
                if (u8[offset + 8] === 0x9d && u8[offset + 9] === 0x01 && u8[offset + 10] === 0x2a) {
                    canvasWidth = view.getUint16(offset + 11, true) & 0x3fff;
                    canvasHeight = view.getUint16(offset + 13, true) & 0x3fff;
                }
            }

            const paddedSize = 8 + size + (size % 2);
            offset += paddedSize;
        }

        const totalDurationMs = frameDurations.reduce((a, b) => a + b, 0);
        const avgFps = frameCount > 0 && totalDurationMs > 0 ? (frameCount / (totalDurationMs / 1000)).toFixed(1) : '0';

        return {
            fileSize: u8.length,
            isAnimated: isAnimated || frameCount > 1,
            canvasWidth,
            canvasHeight,
            aspectRatio: canvasWidth && canvasHeight ? (canvasWidth / canvasHeight).toFixed(2) : '1.00',
            isSquare: canvasWidth === canvasHeight,
            loopCount: loopCount === 0 ? 'Infinite (0)' : loopCount,
            frameCount: frameCount || 1,
            totalDurationMs,
            totalDurationSec: (totalDurationMs / 1000).toFixed(2),
            avgFps: parseFloat(avgFps),
            frameDurations,
            hasAlpha,
            chunksSummary: chunks.map(c => `${c.tag} (${(c.size / 1024).toFixed(1)} KB)`).join(', ')
        };
    }
}

// Support CommonJS export for testing in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebPMuxer;
}
