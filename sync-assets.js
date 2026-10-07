const fs = require('fs');
const path = require('path');

const wwwDir = path.join(__dirname, 'www');
if (!fs.existsSync(wwwDir)) {
    fs.mkdirSync(wwwDir, { recursive: true });
}

const filesToCopy = [
    'index.html',
    'style.css',
    'app.js',
    'webp-muxer.js',
    'favicon.svg',
    'icon-192.png',
    'icon-512.png',
    'manifest.webmanifest',
    'sw.js',
    '1002622311_1x1_6sec.webp',
    'sample_news_photo.jpg'
];

// Clean up obsolete server files or directories in www/ if present
const obsoleteItems = ['save.php', 'files'];
obsoleteItems.forEach(item => {
    const p = path.join(wwwDir, item);
    if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
        console.log(`Cleaned up obsolete www/${item}`);
    }
});

filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(wwwDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${file} -> www/${file}`);
    } else {
        console.warn(`Warning: source file ${file} not found.`);
    }
});

console.log('All web assets synchronized to www/ successfully.');
