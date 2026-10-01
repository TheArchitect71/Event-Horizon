# Event Horizon — People Workspace

Event Horizon and Epsilon Reticuli B are consolidated here into one Angular application. The original browsing demo and profile form now share real routes, one persistent data store, and complete people CRUD. Profiles support any role or organization; 50 historical astronaut records provide the initial sample directory.

## Features

- Overview with live directory totals and profile links.
- Search by name, role, organization, or expertise; combine status and organization filters.
- Sort by name or role; switch between cards and a table. Directory controls persist in URL query parameters.
- Routed profile details, create and edit forms with required-field validation, and explicit delete confirmation.
- Browser-local persistence across reloads, JSON export, loading/error/empty states, and missing-record pages.
- Responsive navigation, keyboard focus indicators, labeled fields, and accessible status messages.

Sample astronaut profiles retain spaceflight, mission, and education details. Sample statuses come from the historical source and are not a current NASA roster.

## Preview

![Combined people directory on desktop](docs/screenshots/desktop.png)

<details>
<summary>Mobile directory</summary>

![Combined people directory on mobile](docs/screenshots/mobile.png)

</details>

Screenshots show the built combined application with the original sample directory. Desktop (1280×900) and mobile (390×844) browser checks covered search, table view, URL state with browser back, form validation, create/edit/confirmed delete, reload persistence, missing records, and mobile navigation. The built files were supplied directly to an isolated test browser; no development server was started.

## Run locally

Use the Node version in `.nvmrc` and npm. In the Codex bottom terminal:

```sh
cd "/Users/thearchitect/Documents/Projects/Web Development/Event-Horizon"
npm ci
npm start -- --port 4202
```

Open http://127.0.0.1:4202. Keep the process in the foreground and stop with **Ctrl+C**. Any available port may be used.

## Persistence

Changes are saved under `event-horizon.people.v1` in localStorage for the current browser origin. Different ports have separate storage. There is no backend, authentication, or cross-device sync. The app commits changes only when browser storage succeeds and preserves malformed stored data rather than silently replacing it. JSON export is available on the About page; importing is outside the current scope.

Clearing this site’s storage removes local changes and restores the initial samples on the next load. An intentionally empty saved directory stays empty after reload.

## Consolidation

This repository is the combined application and the future development target. Epsilon’s historical repository is preserved as an archived repository, with a README pointer here. The combined application is published in Event Horizon; the two Git histories remain separate. Unrelated nested animal menus and unused placeholder components were removed from this application.

## Verify

```sh
npm run build
npm run typecheck
npm test -- --browsers=ChromeHeadless
```

Set `CHROME_BIN` if Chrome/Chromium is not installed at the default location. Tests cover persistent CRUD, corrupted or unavailable storage, retry, validation, URL state, routing, missing profiles, and delete confirmation.

Production hosting must route unknown paths back to `index.html` for direct profile URLs. Local `ng serve` handles this automatically.
