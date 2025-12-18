import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '../icons_gallery');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const icons = {
    'prime.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h7a5 5 0 0 1 0 10H7V4z"/><path d="M10 4v17"/><path d="M7 14h7"/><path d="M7 4v17"/></svg>`,
    'solstice_summer.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><path d="M18 6l-2 2M6 18l2-2M6 6l2 2M18 18l-2-2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="9" stroke-dasharray="1 4" opacity="0.5"/></svg>`,
    'solstice_winter.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><path d="M20 12l-4-4M4 12l4 4M12 4l-4 4M12 20l4-4"/><circle cx="12" cy="12" r="3"/></svg>`,
    'equinox.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="8"/><path d="M12 12l5-5M12 12l-5 5"/></svg>`,
    'equinox_vernal.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="7"/><path d="M12 12c0-3 2.5-3 2.5-3"/><path d="M12 12c0-3-2.5-3-2.5-3"/></svg>`,
    'equinox_autumnal.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="7"/><path d="M12 12c0 2 2 2 3 4" opacity="0.8"/><path d="M12 12c3-4 6 0 6 0s-3 4-6 0z" transform="translate(-1, -4) scale(0.6)"/></svg>`,
    'meteor.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2.5l-2 6-6 2 6 2 2 6 2-6 6-2-6-2-2-6z"/><path d="M16 4l6-2M20 9l4-1"/></svg>`,
    'eclipse_solar.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="5" stroke-dasharray="3 3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
    'eclipse_solar_partial.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l2 2M2 12h3M5 19l2-2"/><mask id="moon-mask"><rect x="0" y="0" width="24" height="24" fill="white"/><circle cx="14" cy="14" r="6" fill="black"/></mask><circle cx="10" cy="10" r="7" mask="url(#moon-mask)"/><circle cx="14" cy="14" r="6"/></svg>`,
    'eclipse_lunar.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M8 17l8-10M6 15l12-6" opacity="0.5"/></svg>`,
    'eclipse_lunar_partial.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M14 5a7 7 0 0 0 0 14" opacity="0.5"/></svg>`,
    'sequence.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/><path d="M5 12 Q 8.5 2 12 12"/><path d="M12 12 Q 15.5 22 19 12"/></svg>`,
    'milestone.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
    'calendar.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    'share.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
    'season_winter.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M12 2v20"/><path d="M4.93 4.93l14.14 14.14"/><path d="M4.93 19.07L19.07 4.93"/><path d="M9 12l-2-2M15 12l2-2M12 9l2-2M12 15l2 2"/><circle cx="12" cy="12" r="2"/></svg>`,
    'season_spring.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5a4.5 4.5 0 0 1 4.5 4.5c0 2.485-2.015 4.5-4.5 4.5S7.5 9.485 7.5 7 9.515 2.5 12 2.5z"/><path d="M12 21.5v-10"/><path d="M12 16.5c-2.5 0-4.5-2-4.5-4.5"/></svg>`,
    'season_summer.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M4.93 4.93l14.14 14.14"/><path d="M16.95 16.95l2.12 2.12"/><path d="M4.93 19.07l2.12-2.12"/><path d="M16.95 7.05l2.12-2.12"/></svg>`,
    'season_autumn.svg': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19c-5 0-9-4-9-9s4-8 9-8 9 4 9 8-4 9-9 9z"/><path d="M12 22v-9"/></svg>`
};

let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Icon Gallery</title>
    <style>
        body { background: #0f172a; color: #fff; font-family: sans-serif; padding: 2rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 2rem; }
        .card { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); border-color: #38bdf8; }
        .icon-box { color: #38bdf8; }
        .label { font-size: 0.875rem; color: #94a3b8; text-align: center; font-weight: 500; }
        a { color: #38bdf8; text-decoration: none; margin-bottom: 2rem; display: block; }
    </style>
</head>
<body>
    <h1>Icon Gallery</h1>
    <a href="./">View Files</a>
    <div class="grid">
`;

for (const [filename, svg] of Object.entries(icons)) {
    // Write SVG file
    fs.writeFileSync(path.join(outDir, filename), svg.replace('currentColor', '#000000')); // Default to black for file viewing, but keep fill="none"

    // Allow color inheritance for HTML preview
    const previewSvg = svg;

    htmlContent += `
        <div class="card">
            <div class="icon-box">
                ${previewSvg}
            </div>
            <div class="label">${filename}</div>
        </div>
    `;
}

htmlContent += `
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'index.html'), htmlContent);

console.log(`Generated ${Object.keys(icons).length} icons in ${outDir}`);
