# NiteLight

NiteLight is a React Native companion app for Nite Light CIC. It helps people
find nearby food, clothing, hygiene essentials, community facilities and
practical support from charities and local organisations across the Tees Valley.

## Windows setup

This project includes a Windows PowerShell checker for the Android dev environment.

From the repo root, you can run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\check-dev-env.ps1
```

It checks Git, VS Code, Node.js, npm, JDK 17, Android Studio, Android SDK paths, `adb`, and the emulator command. If something is missing or the wrong version, it asks before installing/fixing tools with `winget`.

Once Node/npm is installed, these npm helpers also work:

```sh
npm run doctor
npm run doctor:fix
```

`npm run doctor` only checks. `npm run doctor:fix` attempts installs with `winget`.


## Local setup

This project uses **npm** for package management and scripts.

From a fresh clone:

```sh
npm install
npm run setup:env
npm run android
```

`npm run setup:env` creates the local files that are intentionally ignored by Git:

- `.env`
- `android/app/google-services.json`

The source copies for these app-public config files live in `config/public/`. Do not put backend secrets, service-account JSON, Stripe secret keys, database passwords, or signing keys in that folder.

