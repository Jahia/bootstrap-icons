'use strict';

const fs   = require('fs');
const path = require('path');

const root   = __dirname;
const pkg    = path.join(root, 'node_modules', 'bootstrap-icons');
const res    = path.join(root, 'src', 'main', 'resources');

function copyDir(src, dst) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dst, entry.name);
        if (entry.isDirectory()) {
            copyDir(s, d);
        } else {
            fs.copyFileSync(s, d);
        }
    }
}

// individual SVGs: node_modules/bootstrap-icons/icons/ -> src/main/resources/img/
const imgDst = path.join(res, 'img');
fs.mkdirSync(imgDst, { recursive: true });
const iconsSrc = path.join(pkg, 'icons');
let count = 0;
for (const f of fs.readdirSync(iconsSrc)) {
    if (f.endsWith('.svg')) {
        fs.copyFileSync(path.join(iconsSrc, f), path.join(imgDst, f));
        count++;
    }
}
console.log(`[copy-bootstrap-icons] ${count} SVGs -> ${imgDst}`);

// sprite: node_modules/bootstrap-icons/bootstrap-icons.svg -> src/main/resources/icons/bootstrap-icons.svg
const iconsDst = path.join(res, 'icons');
fs.mkdirSync(iconsDst, { recursive: true });
fs.copyFileSync(path.join(pkg, 'bootstrap-icons.svg'), path.join(iconsDst, 'bootstrap-icons.svg'));
console.log(`[copy-bootstrap-icons] sprite -> ${path.join(iconsDst, 'bootstrap-icons.svg')}`);

// CSS + fonts: node_modules/bootstrap-icons/font/ -> src/main/resources/css/
copyDir(path.join(pkg, 'font'), path.join(res, 'css'));
console.log(`[copy-bootstrap-icons] CSS + fonts -> ${path.join(res, 'css')}`);
