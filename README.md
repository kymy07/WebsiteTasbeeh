# Tasbeeh Fish Farm 🐟

Fish pond record & sales system for **Tasbeeh Restaurant & Cafe**, bilingual (BM / EN).

## Run
Open `index.html` in a browser (no install needed), or host on GitHub Pages.

## Demo logins
| Role | Username | Password |
|---|---|---|
| Boss (admin) | `boss` | `boss123` |
| Pekerja | `pekerja` | `pekerja123` |
| Pembeli | `pembeli` | `pembeli123` |

Buyers can also register their own account.

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

## Notifications setup
Log in as Boss → **Tetapan / Settings**:
- **WhatsApp (CallMeBot, free)**: save +34 644 51 95 23, send `I allow callmebot to send me messages`, then paste the API key you get back.
- **Telegram**: create a bot with @BotFather and fill in the token and chat id.

## Note
Data is stored in the browser (localStorage), so each device has its own data. If the boss, workers and buyers need to share the same data across devices, connect a backend (e.g. Firebase / Supabase) next.
