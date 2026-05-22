# Bootstrap Icons

> Jahia 8 module providing the [Bootstrap Icons](https://icons.getbootstrap.com/) library (2,050+ icons).
> Supports four rendering modes: embedded SVG, SVG sprite, external image, and icon font.
> Fully WCAG 2.1 AA compliant.

## Installation

Install from the Jahia Store — see the [tutorial](https://academy.jahia.com/training-kb/tutorials/administrators/installing-a-module).

---

## Usage

Add the **Icon** component from the Bootstrap Icons category. Three properties are available:

| Label | Property | Description | Default |
|---|---|---|---|
| **Icon** | `bootstrapIcon` | Pick an icon using the visual picker | — |
| **Usage** | `usage` | Rendering mode: `embedded`, `sprite`, `external-image`, `icon-font` | `embedded` |
| **Decorative** | `decorative` | `true` → `aria-hidden="true"` (decorative). `false` → `role="img" aria-label="…"` (informative) | `false` |

### Icon Picker

The `bootstrapIcon` field uses a custom Content Editor selector: a searchable visual picker with 2,050 icons organised into 13 categories (Arrows & Navigation, Files & Documents, People & Social, Communication, Media, Weather & Nature, Buildings & Places, Commerce & Finance, Technology, Shapes & UI, Security & System, Brands & Logos, Misc).

- Click a **category tab** to filter by category
- **Type** in the search box to search across all categories (resets to All automatically)
- Click an icon to select it; **✕ clear** to deselect

Icons are rendered from the SVG sprite (single HTTP request, browser-cached).

---

## Rendering modes

### Embedded SVG

Inlines the SVG directly into the page HTML. Inherits color via `fill="currentColor"`.

```html
<!-- informative -->
<svg class="bi bi-arrow-left" role="img" aria-label="Arrow left" viewBox="0 0 16 16" fill="currentColor">…</svg>

<!-- decorative -->
<svg class="bi bi-arrow-left" aria-hidden="true" focusable="false" viewBox="0 0 16 16" fill="currentColor">…</svg>
```

### SVG Sprite

References the bundled sprite file. One network request, fully cacheable.

```html
<svg class="bi" role="img" aria-label="Arrow left" fill="currentColor" style="width:50%;height:auto">
    <use xlink:href="/modules/bootstrap-icons/icons/bootstrap-icons.svg#arrow-left"/>
</svg>
```

### External image

Standard `<img>` tag pointing to the individual SVG file.

```html
<!-- informative -->
<img src="/modules/bootstrap-icons/img/arrow-left.svg" alt="Arrow left" style="width:50%;height:auto">

<!-- decorative -->
<img src="/modules/bootstrap-icons/img/arrow-left.svg" alt="" style="width:50%;height:auto">
```

### Icon font

Injects `bootstrap-icons.css` into the page `<head>` and renders an `<i>` tag.

```html
<link rel="stylesheet" href="/modules/bootstrap-icons/css/bootstrap-icons.css"/>
<i class="bi-arrow-left" aria-hidden="true" focusable="false"></i>
```

---

## Accessibility (WCAG 2.1 AA)

The **Decorative** property controls ARIA output for all four rendering modes:

| Mode | Informative (`decorative=false`) | Decorative (`decorative=true`) |
|---|---|---|
| Embedded SVG | `role="img" aria-label="Arrow left"` | `aria-hidden="true" focusable="false"` |
| Sprite | `role="img" aria-label="Arrow left"` | `aria-hidden="true" focusable="false"` |
| External image | `alt="Arrow left"` | `alt=""` |
| Icon font | `role="img" aria-label="Arrow left"` | `aria-hidden="true" focusable="false"` |

The accessible label is auto-generated from the icon slug: `arrow-left` → `Arrow left`.

---

## Using the icon font without the Icon component

To use `<i class="bi bi-file-earmark-pdf">` directly in a template, add a `Jahia-Depends` on `bootstrap-icons` in your `pom.xml` and include:

```html
<template:addResources type="css" resources="bootstrap-icons.css"/>
```

---

## Development

### Prerequisites

- Java 11+, Maven 3.6+
- Node.js 20.x (managed by `frontend-maven-plugin` — no local install required)

### Build

```bash
mvn clean package
```

The `frontend-maven-plugin` runs `npm install` during the `initialize` phase, which triggers the `postinstall` script (`copy-bootstrap-icons.js`). This copies SVGs, the sprite, CSS/fonts, and generates `icons-list.json` from `node_modules/bootstrap-icons`.

### Asset pipeline

`copy-bootstrap-icons.js` copies from `node_modules/bootstrap-icons` into `src/main/resources/`:

| Source | Destination | Used by |
|---|---|---|
| `icons/*.svg` | `img/` | External image mode |
| `bootstrap-icons.svg` | `icons/` | Sprite mode + icon picker |
| `font/` | `css/` | Icon font mode |
| _(generated)_ | `javascript/apps/icons-list.json` | Content Editor icon picker |

All generated assets are gitignored.

---

## Cypress tests

See [`tests/README.md`](tests/README.md) for full setup instructions.

```bash
cd tests
yarn install --ignore-engines
yarn e2e:ci
```

Tests cover: module deployment, all four rendering modes, and WCAG 2.1 AA accessibility for informative and decorative icons.
