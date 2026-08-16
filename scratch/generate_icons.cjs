const fs = require('fs');
const path = require('path');

// We can create a high-res SVG and write PNG or SVG icons
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bg)" />
  <circle cx="256" cy="256" r="160" stroke="#06b6d4" stroke-width="8" stroke-dasharray="16 16" opacity="0.3" />
  <circle cx="256" cy="256" r="110" fill="#1e293b" stroke="#334155" stroke-width="4" />
  <path d="M256 120 L370 360 L256 310 L142 360 Z" fill="url(#glow)" />
  <circle cx="256" cy="256" r="28" fill="#ffffff" />
</svg>`;

const publicDir = path.resolve('c:/house/keokeodam-location/public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), svgContent);
console.log('Apple touch SVG icon created');
