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
    'save.php',
    '1002622311_1x1_6sec.webp',
    'sample_news_photo.jpg'
];

const wwwFilesDir = path.join(wwwDir, 'files');
if (!fs.existsSync(wwwFilesDir)) {
    fs.mkdirSync(wwwFilesDir, { recursive: true });
}

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
