# Event Horizon

Angular22 astronaut grid and nested services menu, preserving the existing user HTML/CSS and 50 bundled astronaut records.

## Run

```sh
nvm use
npm ci
npm start
```

The foreground server listens at http://127.0.0.1:4200. Stop with Ctrl+C. No remote fonts or services are required after dependency installation.

## Validation and compatibility

`npm run build`, `npm run typecheck`, `npm test -- --browsers=ChromeHeadless`, and `npm audit`. Set CHROME_BIN if Chrome is installed outside /Applications.

Angular/core/CLI/build22.2.0, Material/CDK22.2.1, RxJS7.8.2, Zone0.16.3, Node26.10.0. TypeScript6.0.3 held by Angular>=6<6.1. Jasmine6.3/types6 held because Jasmine7 read-only globals fail with zone-testing0.16.3. [Official Angular compatibility](https://angular.dev/reference/versions).

Clean install, build, types, audit0 and five actual Chromium tests passed. Production Playwright desktop1280x800/mobile390x844 verified50cards, fields, drawer, nestedmenus, disabledVelociraptor item, reload, nohorizontaloverflow/errors/nonlocalrequests. Browserplugin unavailable; existingPlaywright/Chromium used. Source/screenshot/harness evidence saved outside repo in mission backup/Codex evidence directories. Bundle697KB, below1MBwarning after removingunusedMaterialmodules.

Search/filter controls and animal menu actions were not implemented beyond menu navigation in the original UI; this migration retains that feature scope. Legacy TSLint/Protractor configuration files remain learning references; obsolete dependencies/targets were replaced by current builder/testing commands.
