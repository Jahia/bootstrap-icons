# Bootstrap Icons — Cypress Test Suite

End-to-end tests for the [bootstrap-icons](https://github.com/Jahia/bootstrap-icons) Jahia module.
Tests run against a live Jahia 8.2+ instance and verify that all four icon rendering modes
(embedded SVG, sprite, external image, icon font) produce correct HTML, and that the
implementation is WCAG 2.1 AA compliant.

---

## Table of contents

- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Starting Jahia with Docker](#starting-jahia-with-docker)
- [Environment variables](#environment-variables)
- [Running the tests](#running-the-tests)
- [Generating reports](#generating-reports)
- [Project structure](#project-structure)
- [Test coverage](#test-coverage)

---

## Requirements

| Tool | Minimum version | Notes |
|------|----------------|-------|
| Node.js | **18.x** | 20.x recommended |
| Yarn | 1.22.x | Classic (v1) |
| Docker | 20.x | Required to run Jahia locally |
| Jahia | **8.2.0.0** EE | Must be reachable at `JAHIA_URL` |

A valid Jahia EE license is required to start the Docker container.

---

## Quick start

### 1 — Build the module JAR

```bash
cd ..
mvn clean package
cd tests
```

This produces `../target/bootstrap-icons-*.jar`.

### 2 — Set the Jahia license

Export your license XML file as a base64 string:

```bash
export JAHIA_LICENSE=$(base64 -i ~/jahia/license-Unlimited-8.2.0-JAHIACOM-DEV-CYPRESS.xml)
```

> On Linux, use `base64 -w 0` instead of `base64 -i`.

### 3 — Configure your environment

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

```bash
JAHIA_IMAGE=jahia/jahia-ee:8.2.3
JAHIA_LICENSE=<paste the base64 string from step 2>
SUPER_USER_PASSWORD=root1234
JAHIA_URL=http://localhost:8080
```

### 4 — Start Jahia

```bash
docker compose up -d
```

Wait for Jahia to be fully started (~2 min). Watch the logs:

```bash
docker logs -f jahia | grep "Server startup"
```

### 5 — Install dependencies

```bash
yarn install --ignore-engines
```

### 6 — Run the tests

```bash
yarn e2e:ci        # headless (CI mode)
yarn e2e:debug     # Cypress interactive UI
```

The `01-setup.cy.ts` spec automatically:
- deploys the `empty-templates` module
- deploys the `bootstrap-icons` module — from `../target/*.jar` if built, otherwise from Jahia Nexus (no build required)
- creates the `bootstrapiconstest` site
- creates two test pages with icon nodes (one informative, one decorative)
- publishes everything

No manual Jahia setup is required beyond starting the container. Building the module first (`mvn clean package`) is recommended for testing local changes, but not required.

---

## Starting Jahia with Docker

### Start

```bash
docker compose up -d
```

### Stop (keep data)

```bash
docker compose stop
```

### Stop and destroy all data

```bash
docker compose down -v
```

### View logs

```bash
docker logs -f jahia
```

### Check Jahia is ready

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/cms/login
# Should return 200
```

---

## Environment variables

Set these in `.env` (copied from `.env.example`). All variables have defaults except `JAHIA_LICENSE`.

| Variable | Default | Description |
|----------|---------|-------------|
| `JAHIA_IMAGE` | `jahia/jahia-ee:8.2.3` | Docker image for Jahia (public, no auth needed) |
| `JAHIA_LICENSE` | _(empty)_ | Base64-encoded Jahia EE license. **Required.** |
| `SUPER_USER_PASSWORD` | `root1234` | Password for the Jahia `root` superuser |
| `JAHIA_URL` | `http://localhost:8080` | Base URL used by Cypress to reach Jahia |
| `JAHIA_HOST` | `jahia` | Hostname used inside Docker network |

### Exporting the license

```bash
# macOS
export JAHIA_LICENSE=$(base64 -i ~/jahia/license-Unlimited-8.2.0-JAHIACOM-DEV-CYPRESS.xml)

# Linux
export JAHIA_LICENSE=$(base64 -w 0 ~/jahia/license-Unlimited-8.2.0-JAHIACOM-DEV-CYPRESS.xml)
```

Then paste the value into `.env`:

```bash
JAHIA_LICENSE=PHByb2R1Y3QgbmFtZT0i...
```

---

## Running the tests

### Full suite (headless)

```bash
yarn e2e:ci
```

### Interactive Cypress UI

```bash
yarn e2e:debug
```

### Single spec

```bash
yarn e2e:ci --spec "cypress/e2e/02-icon-render.cy.ts"
```

> **Important:** Specs are numbered to enforce run order. `01-setup.cy.ts` must complete before any other spec runs — it creates the test site and content. `99-teardown.cy.ts` deletes the test site. Always run the full suite unless the site already exists.

### Re-running after a failed setup

If `01-setup.cy.ts` fails mid-way, the site may be in a partial state. The setup spec calls `deleteTestSite()` before creating it, so re-running is safe:

```bash
yarn e2e:ci --spec "cypress/e2e/01-setup.cy.ts"
```

---

## Generating reports

After `yarn e2e:ci`, reports land in `results/reports/`. Merge and render:

```bash
yarn report:merge   # merge per-spec JSON files → results/reports/report.json
yarn report:html    # render results/reports/report.html
```

Screenshots: `results/screenshots/`
Videos: `results/videos/`

---

## Project structure

```
tests/
├── docker-compose.yml                   # Jahia container for local development
├── .env.example                         # Environment variable template
├── provisioning-manifest-build.yml      # CI provisioning (local Maven repo)
├── provisioning-manifest-snapshot.yml   # CI provisioning (Nexus snapshot)
├── cypress.config.ts
├── reporter-config.json
├── package.json
├── cypress/
│   ├── e2e/
│   │   ├── 01-setup.cy.ts               # Deploy, create site + pages, publish
│   │   ├── 02-icon-render.cy.ts         # HTML output for each rendering mode
│   │   ├── 03-accessibility.cy.ts       # WCAG 2.1 AA — aria attributes
│   │   └── 99-teardown.cy.ts            # Delete test site
│   ├── fixtures/
│   │   ├── graphql/
│   │   │   └── jcr/mutation/
│   │   │       └── addNode.graphql      # Generic JCR node creation
│   │   ├── groovy/bootstrap-icons/
│   │   │   └── flushHtmlCache.groovy    # Flush Jahia HTML render cache
│   │   └── modules/
│   │       └── empty-templates-1.0.0.jar
│   ├── plugins/
│   │   └── index.js
│   └── support/
│       ├── bootstrap-icons.ts           # Shared helpers
│       └── e2e.js                       # Global Cypress setup
└── results/                             # Generated (gitignored)
    ├── videos/
    ├── screenshots/
    └── reports/
```

---

## Test coverage

### 01 — Setup

- bootstrap-icons OSGi bundle is deployed and in `STARTED` state
- `page-informative` returns HTTP 200 in live mode
- `page-decorative` returns HTTP 200 in live mode

### 02 — Icon render

Tests that each usage mode produces the expected HTML output.

| Usage | What is checked |
|-------|----------------|
| **Embedded SVG** | `<svg>` present, class `bi-arrow-left`, `viewBox="0 0 16 16"`, `fill="currentColor"` |
| **Sprite** | `<svg class="bi">`, `<use>` references `bootstrap-icons.svg#arrow-left` |
| **External image** | `<img>` with `src` containing `arrow-left.svg` |
| **Icon font** | `<i class="bi-arrow-left">`, `bootstrap-icons.css` injected in page |

### 03 — Accessibility (WCAG 2.1 AA)

Two pages: `page-informative` (decorative=false) and `page-decorative` (decorative=true).

**Informative icons (SC 1.1.1 Non-text Content, SC 4.1.2 Name Role Value):**

| Usage | Expected attributes |
|-------|-------------------|
| Embedded SVG | `role="img"`, `aria-label="Arrow left"`, no `aria-hidden` |
| Sprite SVG | `role="img"`, `aria-label="Arrow left"` |
| External image | `alt="Arrow left"` (non-empty, human-readable) |
| Icon font | `role="img"`, `aria-label="Arrow left"` |

**Decorative icons (SC 1.1.1 Non-text Content):**

| Usage | Expected attributes |
|-------|-------------------|
| Embedded SVG | `aria-hidden="true"`, `focusable="false"`, no `role` |
| Sprite SVG | `aria-hidden="true"`, `focusable="false"` |
| External image | `alt=""` (empty string) |
| Icon font | `aria-hidden="true"`, `focusable="false"`, no `role` |

The accessible label is auto-generated from the icon slug: `arrow-left` → `Arrow left`.

### 99 — Teardown

Deletes the `bootstrapiconstest` site.
