/**
 * PressWebP - Independent Dev & Preview Server
 * Zero dependencies required. Runs natively on Windows, macOS, and Linux using Node.js.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const START_PORT = parseInt(process.env.PORT || '8080', 10);
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.mov': 'video/quicktime',
    '.ico': 'image/x-icon'
};

function openBrowser(url) {
    const platform = os.platform();
    if (platform === 'win32') {
        exec(`start "" "${url}"`);
    } else if (platform === 'darwin') {
        exec(`open "${url}"`);
    } else {
        exec(`xdg-open "${url}"`);
    }
}

function handleRequest(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Range'
        });
        res.end();
        return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
    }

    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') {
        reqPath = '/index.html';
    }

    const safePath = path.normalize(path.join(ROOT_DIR, reqPath));
    if (!safePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const fileSize = stats.size;
        const range = req.headers.range;

        const baseHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache',
            'Content-Type': contentType
        };

        if (range && range.startsWith('bytes=')) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize || end >= fileSize || start > end) {
                res.writeHead(416, {
                    ...baseHeaders,
                    'Content-Range': `bytes */${fileSize}`
                });
                res.end();
                return;
            }

            const chunkSize = (end - start) + 1;
            res.writeHead(206, {
                ...baseHeaders,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Content-Length': chunkSize
            });

            if (req.method === 'HEAD') {
                res.end();
                return;
            }

            const stream = fs.createReadStream(safePath, { start, end });
            stream.pipe(res);
        } else {
            res.writeHead(200, {
                ...baseHeaders,
                'Content-Length': fileSize
            });

            if (req.method === 'HEAD') {
                res.end();
                return;
            }

            const stream = fs.createReadStream(safePath);
            stream.pipe(res);
        }
    });
}

function startServer(port) {
    const server = http.createServer(handleRequest);

    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE' && port < START_PORT + 20) {
            startServer(port + 1);
        } else {
            console.error('Failed to start server:', err.message);
            process.exit(1);
        }
    });

    server.listen(port, '127.0.0.1', () => {
        const url = `http://localhost:${port}/`;
        console.log('\n\x1b[36m==================================================================\x1b[0m');
        console.log('\x1b[32m  PRESSWEBP — INDEPENDENT WEB & MOBILE DEV SERVER\x1b[0m');
        console.log('\x1b[36m==================================================================\x1b[0m');
        console.log(`  \x1b[33m* Status:\x1b[0m      Running 100% locally and independently`);
        console.log(`  \x1b[37m* Root Folder:\x1b[0m ${ROOT_DIR}`);
        console.log(`  \x1b[36m* URL:\x1b[0m         \x1b[1m${url}\x1b[0m`);
        console.log(`  \x1b[90m* Press Ctrl+C to stop the server.\x1b[0m`);
        console.log('\x1b[36m==================================================================\x1b[0m\n');

        openBrowser(url);
    });
}

startServer(START_PORT);
