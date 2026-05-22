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

// icons-list.json: categorized icon map for the Content Editor picker
const iconNames = fs.readdirSync(iconsSrc)
    .filter(f => f.endsWith('.svg'))
    .map(f => f.replace('.svg', ''))
    .sort();

const CATEGORIES = [
    { label: 'Arrows & Navigation', test: n => /^(arrow|chevron|caret|skip|box-arrow|nav|back|forward|fast|rewind|skip)/.test(n) },
    { label: 'Files & Documents',   test: n => /^(file|filetype|folder|clipboard|journal|bookmark|book|newspaper|receipt|stickies|postcard|postage|card|patch|badge)/.test(n) },
    { label: 'People & Social',     test: n => /^(person|people|incognito|gender|emoji|award)/.test(n) },
    { label: 'Communication',       test: n => /^(chat|envelope|send|telephone|bell|megaphone|rss|broadcast|wifi|signal|reception|at)/.test(n) },
    { label: 'Media & Audio',       test: n => /^(play|pause|stop|record|music|headphones|soundwave|mic|camera|film|image|images|collection|easel|projector|vinyl|cassette|boombox|speaker|volume|camera2|display)/.test(n) },
    { label: 'Weather & Nature',    test: n => /^(cloud|sun|moon|snow|wind|thermometer|umbrella|rainbow|tornado|humidity|water|fire|lightning|tsunami|volcano|tree|flower|leaf|grass|bug|virus|brightness)/.test(n) },
    { label: 'Buildings & Places',  test: n => /^(house|building|sign|geo|map|compass|crosshair|pin|flag|globe|bank|hospital|shop|store|door|window|gate|fence|bridge|airplane|train|bus|bicycle|car|ev|fuel|ticket|balloon)/.test(n) },
    { label: 'Commerce & Finance',  test: n => /^(bag|cart|basket|credit|cash|coin|currency|piggy|tag|tags|upc|qr|bar-chart|pie|graph|receipt|cup|activity|alipay|amazon)/.test(n) },
    { label: 'Technology',          test: n => /^(phone|laptop|pc|tablet|watch|mouse|keyboard|printer|usb|bluetooth|cpu|memory|hdd|ssd|gpu|ethernet|optical|modem|tv|robot|code|terminal|git|stack|layers|diagram|database|server|bezier|braces|brackets|tools|wrench|screwdriver|device|browser|node|plugin|alexa|amd|app|alphabet|menu|hourglass|calculator|cast|controller|dpad|joystick|floppy|sim|vr|disc)/.test(n) },
    { label: 'Shapes & UI',         test: n => /^(circle|square|triangle|diamond|hexagon|octagon|heptagon|pentagon|star|heart|suit|grid|list|layout|columns|rows|table|dash|plus|x-|check|slash|dot|three|box|border|bounding|aspect|distribute|align|justify|text|type|paragraph|blockquote|indent|link|paperclip|scissors|eyedropper|eraser|pencil|pen|brush|paint|palette|cursor|hand|zoom|search|filter|sort|funnel|toggle|ui|input|form|button|label|calendar|calendar2|calendar3|calendar4|dice|lightbulb|hourglass2|battery|c-|h-|p-|crop|copy|fullscreen|cone|bullseye|bricks|body-text)/.test(n) },
    { label: 'Security & System',   test: n => /^(lock|unlock|key|shield|safe|eye|question|exclamation|info|ban|gear|trash|archive|inbox|upload|download|recycle|power|escape|capslock|backspace|command|windows|apple|android|123|0-|1-|2-|3-|4-|5-|6-|7-|8-|9-|asterisk|cc)/.test(n) },
    { label: 'Brands & Logos',      test: n => /^(bootstrap|behance|bing|discord|google|facebook|twitter|instagram|linkedin|youtube|github|gitlab|slack|spotify|netflix|whatsapp|paypal|visa|mastercard|stripe|amazon2|apple2|windows2|android2|chrome|firefox|safari|opera|brave|tiktok|reddit|pinterest|snapchat|twitch|vimeo|wordpress|drupal|joomla|react|angular|vue|svelte|nodejs|python|java|php|ruby|swift|kotlin|rust|go|r-|unity|unreal|blender|figma|sketch|adobe|photoshop|illustrator|premiere)/.test(n) },
    { label: 'Misc',                test: () => true },
];

function categorize(names) {
    const result = {};
    const used = new Set();
    for (const cat of CATEGORIES) {
        const matched = names.filter(n => !used.has(n) && cat.test(n));
        matched.forEach(n => used.add(n));
        if (matched.length) result[cat.label] = matched;
    }
    const other = names.filter(n => !used.has(n));
    if (other.length) result['Other'] = other;
    return result;
}

const categorized = categorize(iconNames);
const jsAppsDir = path.join(res, 'javascript', 'apps');
fs.mkdirSync(jsAppsDir, { recursive: true });
const iconsListPath = path.join(jsAppsDir, 'icons-list.json');
fs.writeFileSync(iconsListPath, JSON.stringify(categorized));
const catCount = Object.keys(categorized).length;
console.log(`[copy-bootstrap-icons] ${iconNames.length} icons in ${catCount} categories -> ${iconsListPath}`);
