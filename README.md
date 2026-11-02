# XXX Fish Farm — Fish Farm Management System

🌐 **Live:** https://fishfarmxdemo.netlify.app

A login-gated web portal for running a **fish farm (ponds / floating cages)** end to end:
**stocking → water quality → feeding → growth & FCR → sales orders → reports**. It has
three portals in one app (**Boss**, **Pekerja / Worker** and **Pembeli / Buyer**), and is
fully bilingual (**Bahasa Melayu / English**). Business data and login live in **Firebase**
(Realtime Database + Authentication). Buyers see only their own orders, workers run daily
operations, and the Boss sees and manages everything.

> **The whole app is a static site: plain HTML/CSS/JS with no build step and no server code.**
> It is hosted on Netlify; the only backend is Firebase, called directly from the browser.

---

## Features

- 🔐 **Login-gated, 3 roles**: Boss (admin), Pekerja (worker) and Pembeli (buyer), on Firebase Authentication. Database security rules enforce what each role can read and write.
- 🐟 **Pond / cage management**: fish count, capacity %, species, price, stocking and harvest dates, and a **T-shaped cage layout** (configurable size, rearrange by click, status colours).
- 📈 **Growth & FCR**: stocking age range with an auto-calculated **current age**, weight sampling, biomass, and **FCR (Feed Conversion Ratio)** per cage with good/fair/high targets.
- 💧 **Water quality**: pH, temperature, DO and ammonia logs, with alerts when a reading is outside the safe ranges set in Settings.
- 🍚 **Feeding & tasks**: feeding log, a "not fed today" checklist, and tasks the Boss assigns and workers tick off.
- 📦 **Stock records**: stock in / out / mortality / transfer between cages, plus automatic deduction when an order is confirmed.
- 🛒 **Buyer shop & orders**: cart, pickup or delivery, and order tracking (New → Confirmed → Ready → Completed).
- 📲 **Notifications**: a new order alerts the Boss via an in-app bell and browser notification, **WhatsApp (CallMeBot)** and **Telegram**, plus a one-tap WhatsApp button.
- 📊 **Reports**: KPIs, a switchable sales breakdown (group × measure × bar/donut/table), mortality rate, average FCR, CSV export and print.
- ⚙️ **Settings & branding**: company info (SSM no., address), logo upload, theme colour, water/FCR thresholds, and a profile page with change password for every user.

---

## Tech stack

| Layer | Technology |
|---|---|
| **Frontend** | Static HTML, vanilla JavaScript (no framework, no build step), hand-written CSS, inline SVG icons and charts |
| **Fonts** | Inter (Google Fonts) |
| **Database** | Firebase Realtime Database (region `asia-southeast1`, Singapore) |
| **Auth** | Firebase Authentication (email/password; usernames map to `username@fishfarm.app`) |
| **SDK** | Firebase JS SDK 10.12 (compat build, loaded from gstatic CDN) |
| **Notifications** | CallMeBot WhatsApp API, Telegram Bot API, browser Notification API |
| **Hosting** | Netlify (static) |

---

## Architecture

```
Browser (index.html + js/*.js)
   │
   ├─ Firebase Auth ───────────── login / sign-up / change password
   │
   ├─ Firebase Realtime DB ────── live listeners (realtime sync across devices)
   │     /meta        public branding (name, logo, theme colour)
   │     /settings    company info, thresholds, notification keys
   │     /users       profiles + role  (boss | worker | buyer)
   │     /pools  /water  /feeding  /stockLogs  /tasks
   │     /orders  /notifications  /activity
   │
   └─ CallMeBot / Telegram ────── new-order notifications to the Boss's phone
```

- **Role-based access** is enforced server-side by `database.rules.json`, not only in the UI:
  buyers can read only their own orders (indexed query on `buyerId`) and can only create
  `pending` orders or cancel their own; workers manage operations; only the Boss can change
  settings, users and branding.
- The data layer (`js/store.js`) keeps an in-memory copy, diffs local changes and writes
  them back as **one multi-path update**, so every view stays a simple render of the data.
- **Local mode:** if `js/firebase-config.js` has no `apiKey`, the app swaps in
  `js/firebase-local.js`, a stand-in with the same API that stores data in the browser.
  The code path is the same, so the app can be demoed and tested offline.

---

## Project structure

```
Website_Booking_Fish/
├── index.html              App shell: loads fonts, Firebase SDK and js/*
├── database.rules.json     Firebase Realtime Database security rules (paste into console)
├── README.md
├── assets/
│   └── logo.svg            Default neutral logo (replaceable in Settings)
├── css/
│   └── style.css           Corporate theme (brand tokens, layout, components, print)
└── js/
    ├── firebase-config.js  Firebase web config (project ids + apiKey/appId)
    ├── firebase-local.js   Offline stand-in for Firebase (local mode)
    ├── i18n.js             BM / EN dictionary
    ├── store.js            Data layer: auth, realtime listeners, diff-save, seed data
    ├── notify.js           WhatsApp / Telegram / in-app notifications
    └── app.js              Views, forms, charts, actions (single-page app)
```

---

## Prerequisites

- Any modern browser.
- To serve locally: **Python 3** (or any static file server).
- To use the shared online database: access to the Firebase project
  **`websitebookingfishtasbeeh`** in the Firebase Console.

---

## Setup

```bash
git clone https://github.com/kymy07/WebsiteTasbeeh.git
cd WebsiteTasbeeh
```

### Connect Firebase (one time)

1. **Project settings → General → Your apps → Web (`</>`)**: register a web app, then copy
   `apiKey` and `appId` into `js/firebase-config.js`.
2. **Authentication → Sign-in method → Email/Password → Enable**.
3. **Realtime Database → Rules**: paste the contents of `database.rules.json`, then click **Publish**.

The Firebase web `apiKey` is a public identifier, not a secret; access is controlled by
the security rules. Until it is filled in, the app runs in **local mode**.

---

## Run locally

```bash
python -m http.server 5500
# open http://localhost:5500
```

No install or build step is needed. Edit a file and refresh the browser.

### First login

1. On first open (empty database), the app shows **Set Up Boss Account**: enter the business
   name, your name, username, phone and password. Optionally load **sample data**.
2. The Boss adds workers under **Pengguna / Users** (sets their initial password).
3. Buyers **register themselves** on the login page (Pembeli tab → Daftar).

Each login is checked against the selected portal: a Boss account cannot sign in through
the Pekerja tab, and so on.

---

## Configuration

**`js/firebase-config.js`**: Firebase web config.

| Key | Purpose |
|---|---|
| `apiKey`, `appId` | From the Firebase Console web app. Leave as `PASTE_…` to run in local mode |
| `authDomain`, `databaseURL`, `projectId`, `storageBucket` | Already set for `websitebookingfishtasbeeh` (Singapore RTDB) |

**In-app (Boss → Tetapan / Settings)**: stored in the database, no redeploy needed.

| Tab | Settings |
|---|---|
| **Umum / General** | Business name, SSM no., address, email, office phone, logo, theme colour |
| **Notifikasi** | Boss WhatsApp no., CallMeBot API key, Telegram bot token + chat id |
| **Operasi** | Water-quality safe ranges, FCR targets, T-layout size, low-stock level |
| **Data** | JSON backup / restore, reset sample data |

**WhatsApp (CallMeBot, free):** save +34 644 51 95 23, send
`I allow callmebot to send me messages`, and paste the API key you receive.
**Telegram:** create a bot with @BotFather; the chat id comes from `api.telegram.org/bot<TOKEN>/getUpdates`.

---

## Deployment

Live at **https://fishfarmxdemo.netlify.app**, hosted on **Netlify** as a static site.

| Netlify setting | Value |
|---|---|
| Build command | *(none)* |
| Publish directory | `/` (repo root) |

If the Netlify site is linked to this repo, every push to `main` redeploys it. Otherwise,
drag the project folder into the Netlify dashboard to deploy a new version.

> The current live demo runs in **local mode** until `apiKey` / `appId` are added to
> `js/firebase-config.js`. Each visitor's data then stays in their own browser. After
> connecting Firebase, all devices share one realtime database.

---

## Security notes

- Access control lives in **`database.rules.json`**: always publish it after changing roles
  or data paths. With the default locked rules (`false / false`), the app cannot read or write.
- Passwords are handled by Firebase Authentication and never stored in the database.
  Usernames cannot be changed after creation; deleting a user removes their profile (and
  therefore all access), but the Auth account itself remains in the Firebase Console.
- **Notification keys are readable by every signed-in user** (including buyers), because
  notifications are sent from the buyer's browser. The worst case is someone spamming your
  WhatsApp or Telegram bot. To hide them, move sending into a Firebase Cloud Function
  (requires the Blaze plan).
- Rotate the CallMeBot key or Telegram bot token from their providers if they leak.
