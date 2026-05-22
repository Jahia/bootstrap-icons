# Contributing

## Updating the Bootstrap Icons library version

When a new version of `bootstrap-icons` is released, three things must be updated:

1. **`package.json`** — bump the version
2. **Run the asset pipeline** — regenerates all copied assets and `icons-list.json`
3. **Commit the version bump** (assets are gitignored and rebuilt on every Maven build)

### Step-by-step

```bash
# 1. Update the version in package.json
npm install bootstrap-icons@latest

# 2. Regenerate assets + icons-list.json
node copy-bootstrap-icons.js

# 3. Verify the icon count and categories
node -e "
const d = require('./src/main/resources/javascript/apps/icons-list.json');
const total = Object.values(d).reduce((s,a)=>s+a.length,0);
console.log('Total icons:', total);
Object.entries(d).forEach(([k,v]) => console.log(' ', k+':', v.length));
"

# 4. Check for icons in the Other / Misc category that could be better categorised
node -e "
const d = require('./src/main/resources/javascript/apps/icons-list.json');
console.log('Misc icons:', d['Misc']?.length);
console.log(d['Misc']?.slice(0, 30).join(', '));
"

# 5. Commit
git add package.json package-lock.json
git commit -m "Bump bootstrap-icons to vX.Y.Z"
```

### Updating categories

If new icons land in `Misc` that belong elsewhere, update the `CATEGORIES` array in `copy-bootstrap-icons.js`, then re-run `node copy-bootstrap-icons.js` and verify.

### Claude prompt for category maintenance

If the `Misc` category grows significantly after a version bump, paste the following prompt into Claude Code:

---

```
The bootstrap-icons npm package was just updated to vX.Y.Z.
Run: node -e "const d=require('./src/main/resources/javascript/apps/icons-list.json'); console.log(d['Misc'].join(', '))"
to list all icons currently in the Misc category.

Then update the CATEGORIES array in copy-bootstrap-icons.js to assign as many of those icons
as possible to an existing named category (Arrows & Navigation, Files & Documents,
People & Social, Communication, Media & Audio, Weather & Nature, Buildings & Places,
Commerce & Finance, Technology, Shapes & UI, Security & System, Brands & Logos).
Add new categories only if a clear group of 10+ new icons warrants one.

After editing, run: node copy-bootstrap-icons.js
Then verify with: node -e "const d=require('./src/main/resources/javascript/apps/icons-list.json'); Object.entries(d).forEach(([k,v])=>console.log(k+':',v.length))"
Misc should be under 100. Commit with: git add copy-bootstrap-icons.js && git commit -m 'Update icon categories for bootstrap-icons vX.Y.Z'
```

---

### What `icons-list.json` is

`src/main/resources/javascript/apps/icons-list.json` is a **generated file** — do not edit it directly.
It is produced by `copy-bootstrap-icons.js` (run via `npm postinstall`) and is gitignored.
On every `mvn clean package` the `frontend-maven-plugin` runs `npm install` which triggers the script.
