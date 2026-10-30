// Copies the portal (single HTML file) into www/ so Capacitor can bundle it.
// Usage: PORTAL_FILE=../path/to/student-portal-index.html node scripts/build-www.js
const fs = require('fs'), path = require('path');
const src = process.env.PORTAL_FILE || path.join(__dirname, '..', 'portal', 'index.html');
if (!fs.existsSync(src)) { console.error('Portal file not found: ' + src); process.exit(1); }
fs.mkdirSync(path.join(__dirname, '..', 'www'), { recursive: true });
fs.copyFileSync(src, path.join(__dirname, '..', 'www', 'index.html'));
console.log('Copied ' + src + ' -> www/index.html (' + Math.round(fs.statSync(src).size / 1024) + ' KB)');
