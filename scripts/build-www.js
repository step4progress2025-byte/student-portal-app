// Copies the portal (single HTML file) into www/ so Capacitor can bundle it.
// Usage: PORTAL_FILE=../path/to/student-portal-index.html node scripts/build-www.js
const fs = require('fs'), path = require('path');
const src = process.env.PORTAL_FILE || path.join(__dirname, '..', 'portal', 'index.html');
if (!fs.existsSync(src)) { console.error('Portal file not found: ' + src); process.exit(1); }
fs.mkdirSync(path.join(__dirname, '..', 'www'), { recursive: true });
fs.copyFileSync(src, path.join(__dirname, '..', 'www', 'index.html'));
console.log('Copied ' + src + ' -> www/index.html (' + Math.round(fs.statSync(src).size / 1024) + ' KB)');

// Premium mock assets (listening audio + writing chart) sit next to index.html in the web repo; bundle them too.
const dir = path.dirname(src);
fs.readdirSync(dir).filter(f => /^ielts_mock\d+_.*\.(mp3|png)$/.test(f)).forEach(f => {
  fs.copyFileSync(path.join(dir, f), path.join(__dirname, '..', 'www', f));
  console.log('Copied asset ' + f);
});
