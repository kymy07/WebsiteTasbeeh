# XXX Fish Farm 🐟

Fish pond record & sales system, bilingual (BM / EN).

## Run locally
```
python -m http.server 5500
```
Then open http://localhost:5500. The first time, you create the **Boss** account (optionally with sample data).
The Boss adds workers under **Pengguna / Users**, and buyers register themselves.

While `js/firebase-config.js` has no `apiKey`, the app runs in **local mode** (data stays in this browser).

## Connect Firebase
1. **Project settings → General → Your apps → Web (`</>`)**: register an app, then copy `apiKey` and `appId` into `js/firebase-config.js`.
2. **Authentication → Get started → Sign-in method → Email/Password → Enable**.
3. **Realtime Database → Rules**: paste the contents of `database.rules.json`, then click **Publish**.
4. Reload the site and create the Boss account. Data now syncs in realtime across all devices.

Login uses a username (stored in Firebase Auth as `username@fishfarm.app`).

## Features
1. Dashboard: total ponds, fish, new orders, monthly sales, charts
2. Pond management: fish count, capacity %, species, price, harvest date
3. Stock records: stock in / out / mortality / transfer between ponds
4. Water quality log (pH, temp, DO, ammonia) with automatic out-of-range alerts
5. Feeding log and a daily checklist of ponds not yet fed
6. Worker tasks: boss assigns, worker ticks them off
7. Online fish shop with cart for buyers (pickup or delivery)
8. Order workflow: New → Confirmed (stock auto-deducted) → Ready → Completed
9. **Automatic notifications**: WhatsApp (CallMeBot), Telegram bot, in-app bell, plus a WhatsApp button for the buyer
10. Reports: sales by species, mortality rate, feed used, CSV export, print
11. User management (boss, workers, buyers), JSON backup / restore
12. Cage layout in a T shape: configurable size, drag-free rearranging, status colours
13. Fish age range (auto-calculated current age) and FCR (Feed Conversion Ratio) per cage
14. Settings: company info and branding (logo, theme colour), water-quality ranges, FCR targets; a profile page with change password for every user

## Notifications setup
Log in as Boss → **Tetapan / Settings**:
- **WhatsApp (CallMeBot, free)**: save +34 644 51 95 23, send `I allow callmebot to send me messages`, then paste the API key you get back.
- **Telegram**: create a bot with @BotFather and fill in the token and chat id.
