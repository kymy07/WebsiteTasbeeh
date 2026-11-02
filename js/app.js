// ===== Tasbeeh Fish Farm — main app =====
const D = () => Store.data;
const state = {
  view: null, loginRole: 'boss', registerMode: false, sidebarOpen: false, notifOpen: false,
  cart: JSON.parse(localStorage.getItem('tasbeeh_cart') || '{}'),
  q: '', poolStatus: 'all', orderTab: 'pending', taskTab: 'pending', stockType: 'all', poolFilter: 'all', reportPeriod: 'month',
};

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rm = n => 'RM' + Number(n || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtN = n => Number(n || 0).toLocaleString('en-MY');
const locale = () => LANG === 'ms' ? 'ms-MY' : 'en-MY';
const fmtDate = d => d ? new Date(d).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
const fmtDT = d => d ? new Date(d).toLocaleString(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';
const me = () => Store.session && Store.user(Store.session.id);
const role = () => me()?.role;
const isBoss = () => role() === 'boss';
const nowLocal = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
const saveCart = () => localStorage.setItem('tasbeeh_cart', JSON.stringify(state.cart));

const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  pools: '<path d="M2 12c3-5 10-6 15 0-5 6-12 5-15 0z"/><path d="M17 12l4-3.5v7z"/><circle cx="7" cy="11" r=".6"/>',
  stock: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  water: '<path d="M12 2.7l5.7 5.6a8 8 0 1 1-11.4 0z"/>',
  feeding: '<path d="M3 11h18"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M9 4c0 2 2 2 2 4M14 4c0 2 2 2 2 4"/>',
  tasks: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  orders: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  reports: '<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  settings: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  shop: '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v1a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v8h14v-8"/>',
  myOrders: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>',
  print: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
};
const icon = (n, size = 20) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24">${ICONS[n] || ''}</svg>`;

function toast(msg, type = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + type; el.textContent = msg;
  $('#toast-root').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ---------- domain helpers ----------
const lastWater = poolId => D().water.filter(w => w.poolId === poolId).sort((a, b) => b.date.localeCompare(a.date))[0];
function wqIssues(w) {
  if (!w) return [];
  const bad = [];
  if (w.ph < 6.5 || w.ph > 8.5) bad.push('ph');
  if (w.temp < 24 || w.temp > 32) bad.push('temp');
  if (w.oxygen < 5) bad.push('oxygen');
  if (w.ammonia > 0.5) bad.push('ammonia');
  return bad;
}
const availableQty = p => p.unit === 'kg' ? Math.floor(p.count * (p.avgWeight || 0)) : p.count;
const fishFromQty = (p, qty) => p.unit === 'kg' ? Math.ceil(qty / (p.avgWeight || 1)) : Math.ceil(qty);
const unitLabel = u => u === 'kg' ? 'kg' : t('ekor');
const isSale = o => ['confirmed', 'ready', 'completed'].includes(o.status);
const statusBadge = s => `<span class="badge ${{ pending: 'gold', confirmed: 'blue', ready: 'amber', completed: '', cancelled: 'red' }[s]}">${t('st_' + s)}</span>`;
const poolStatusBadge = s => `<span class="badge ${{ active: '', maintenance: 'amber', empty: 'gray' }[s]}">${t(s)}</span>`;
const userName = id => Store.user(id)?.name || '-';
const poolName = id => Store.pool(id)?.name || '-';
const poolOptions = (sel, filter = () => true) => D().pools.filter(filter).map(p => `<option value="${p.id}" ${p.id === sel ? 'selected' : ''}>${esc(p.name)} — ${esc(p.species)} (${fmtN(p.count)})</option>`).join('');

function downloadFile(name, content, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function toCsv(rows) {
  return '﻿' + rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
}

function barChart(items, gold) {
  const max = Math.max(1, ...items.map(i => i.value));
  if (!items.length) return `<div class="empty">-</div>`;
  return `<div class="bars">${items.map(i => `
    <div class="bar" title="${esc(i.label)}: ${esc(i.display ?? i.value)}">
      <div class="v">${esc(i.display ?? fmtN(i.value))}</div>
      <div class="col ${gold ? 'gold' : ''}" style="height:${Math.max(2, (i.value / max) * 100) * 0.78}%"></div>
      <div class="l">${esc(i.label)}</div>
    </div>`).join('')}</div>`;
}

// ---------- modal ----------
let modalSubmit = null;
function openModal({ title, body, submitLabel = t('save'), onSubmit, wide, hideFoot }) {
  modalSubmit = onSubmit;
  $('#modal-root').innerHTML = `
    <div class="modal-back" data-act="closeModalBack">
      <form class="modal ${wide ? 'wide' : ''}" id="modal-form" autocomplete="off">
        <div class="modal-head"><h3>${title}</h3><button type="button" class="icon-btn" data-act="closeModal">${icon('x')}</button></div>
        <div class="modal-body">${body}</div>
        ${hideFoot ? '' : `<div class="modal-foot">
          <button type="button" class="btn secondary" data-act="closeModal">${t('cancel')}</button>
          ${onSubmit ? `<button type="submit" class="btn">${submitLabel}</button>` : ''}
        </div>`}
      </form>
    </div>`;
  const first = $('#modal-form .input'); if (first) first.focus();
}
function closeModal() { $('#modal-root').innerHTML = ''; modalSubmit = null; }

// ---------- navigation ----------
function navFor(r) {
  if (r === 'boss') return [
    { label: t('operations'), items: ['dashboard', 'pools', 'stock', 'water', 'feeding', 'tasks'] },
    { label: t('sales'), items: ['orders', 'reports'] },
    { label: t('manage'), items: ['users', 'settings'] },
  ];
  if (r === 'worker') return [
    { label: t('operations'), items: ['dashboard', 'pools', 'stock', 'water', 'feeding', 'tasks'] },
    { label: t('sales'), items: ['orders'] },
  ];
  return [{ label: t('shop'), items: ['shop', 'myOrders'] }];
}
const defaultView = r => r === 'buyer' ? 'shop' : 'dashboard';
function navBadge(v) {
  if (v === 'orders') { const n = D().orders.filter(o => o.status === 'pending').length; return n ? `<span class="badge gold">${n}</span>` : ''; }
  if (v === 'tasks') { const n = D().tasks.filter(x => !x.done && (isBoss() || x.assignee === me().id)).length; return n ? `<span class="badge">${n}</span>` : ''; }
  if (v === 'myOrders') { const n = D().orders.filter(o => o.buyerId === me().id && !['completed', 'cancelled'].includes(o.status)).length; return n ? `<span class="badge">${n}</span>` : ''; }
  return '';
}
const myNotifs = () => D().notifications.filter(n => (n.to === 'boss' && isBoss()) || n.to === me().id);

// ---------- render ----------
function render() {
  const active = document.activeElement;
  const focusId = active && active.id, selStart = active && active.selectionStart;
  document.documentElement.lang = LANG;
  const u = me();
  if (!u) { $('#app').innerHTML = renderLogin(); }
  else {
    const allowed = navFor(u.role).flatMap(g => g.items);
    if (!allowed.includes(state.view)) state.view = defaultView(u.role);
    $('#app').innerHTML = renderShell(u);
  }
  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); try { el.setSelectionRange(selStart, selStart); } catch (e) {} } }
}

function langSwitch() {
  return `<div class="lang-switch"><button class="${LANG === 'ms' ? 'active' : ''}" data-act="lang" data-v="ms">BM</button><button class="${LANG === 'en' ? 'active' : ''}" data-act="lang" data-v="en">EN</button></div>`;
}

function renderLogin() {
  const roles = [['boss', '👔'], ['worker', '🧑‍🌾'], ['buyer', '🛒']];
  const reg = state.registerMode && state.loginRole === 'buyer';
  const bubbles = Array.from({ length: 12 }, (_, i) => { const s = 10 + (i * 7) % 40; return `<span style="width:${s}px;height:${s}px;left:${(i * 37) % 100}%;bottom:-${s}px;animation-delay:${i * 0.9}s;animation-duration:${9 + i % 5}s"></span>`; }).join('');
  return `
  <div class="login-wrap">
    <section class="login-hero">
      <div class="bubbles">${bubbles}</div>
      <div style="position:relative">
        <img src="assets/logo.png" alt="Tasbeeh">
        <h1>${t('heroTitle')}</h1>
        <p>${t('heroText')}</p>
        <div class="hero-feats">
          <span>🐟 ${t('pools')}</span><span>💧 ${t('water')}</span><span>🍚 ${t('feeding')}</span>
          <span>✅ ${t('tasks')}</span><span>🛒 ${t('shop')}</span><span>📲 WhatsApp</span><span>📊 ${t('reports')}</span>
        </div>
      </div>
      <p style="position:relative;font-size:13px;margin:24px 0 0">© ${new Date().getFullYear()} Tasbeeh Restaurant & Cafe</p>
    </section>
    <section class="login-panel">
      <div class="login-card">
        <div class="flex between"><span class="badge">${t('tagline')}</span>${langSwitch()}</div>
        <h2 style="margin-top:22px">${reg ? t('register') : t('welcome')} 👋</h2>
        <p class="muted" style="margin:4px 0 0">${t('loginSub')}</p>
        <div class="role-tabs">
          ${roles.map(([r, e]) => `<button class="role-tab ${state.loginRole === r ? 'active' : ''}" data-act="loginRole" data-v="${r}"><span class="emoji">${e}</span>${t(r)}</button>`).join('')}
        </div>
        <form id="${reg ? 'register-form' : 'login-form'}">
          ${reg ? `
            <div class="field"><label>${t('fullName')}</label><input class="input" name="name" required></div>
            <div class="field"><label>${t('phone')}</label><input class="input" name="phone" placeholder="60123456789" required></div>` : ''}
          <div class="field"><label>${t('username')}</label><input class="input" name="username" required autocomplete="username"></div>
          <div class="field"><label>${t('password')}</label><input class="input" type="password" name="password" required autocomplete="current-password"></div>
          <button class="btn block" type="submit" style="padding:13px">${reg ? t('register') : t('login') + ' — ' + t(state.loginRole)}</button>
        </form>
        ${state.loginRole === 'buyer' ? `<p class="muted" style="text-align:center;font-size:14px">${reg ? t('haveAccount') : t('noAccount')} <a href="#" data-act="toggleRegister">${reg ? t('login') : t('register')}</a></p>` : ''}
        <div class="demo-box"><b>${t('demo')}:</b><br>
          👔 boss / boss123 &nbsp;·&nbsp; 🧑‍🌾 pekerja / pekerja123 &nbsp;·&nbsp; 🛒 pembeli / pembeli123
        </div>
      </div>
    </section>
  </div>`;
}

function renderShell(u) {
  const notifs = myNotifs();
  const unread = notifs.filter(n => !n.read).length;
  const viewTitle = t(state.view);
  return `
  <div class="shell">
    <aside class="sidebar ${state.sidebarOpen ? 'open' : ''}">
      <div class="brand"><img src="assets/logo.png" alt=""><div><div class="name">Tasbeeh</div><div class="sub">FISH FARM</div></div></div>
      ${navFor(u.role).map(g => `
        <div class="nav-label">${g.label}</div>
        ${g.items.map(v => `<button class="nav-item ${state.view === v ? 'active' : ''}" data-act="nav" data-v="${v}">${icon(v)}<span>${t(v)}</span>${navBadge(v)}</button>`).join('')}
      `).join('')}
      <div class="sidebar-foot">
        <div class="user-chip">
          <div class="avatar">${esc(u.name[0])}</div>
          <div style="min-width:0"><div class="who">${esc(u.name)}</div><div class="role">${t(u.role)}</div></div>
        </div>
        <button class="nav-item" data-act="logout">${icon('logout')}<span>${t('logout')}</span></button>
      </div>
    </aside>
    <div class="overlay ${state.sidebarOpen ? 'show' : ''}" data-act="closeSidebar"></div>
    <main class="main">
      <header class="topbar">
        <button class="icon-btn menu-btn" data-act="openSidebar">${icon('menu')}</button>
        <div><h1>${viewTitle}</h1><div class="sub">${new Date().toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
        <div class="spacer"></div>
        ${langSwitch()}
        <div style="position:relative">
          <button class="icon-btn" data-act="toggleNotif">${icon('bell')}${unread ? '<span class="dot"></span>' : ''}</button>
          ${state.notifOpen ? `<div class="notif-panel">
            <div class="head">${t('notifications')} ${unread ? `<a href="#" data-act="readAll" style="font-size:12.5px">${t('markRead')}</a>` : ''}</div>
            ${notifs.length ? notifs.slice(0, 30).map(n => `<div class="notif ${n.read ? '' : 'unread'}"><div><b>${esc(n.title)}</b></div><div>${esc(n.body)}</div><div class="s">${fmtDT(n.date)}</div></div>`).join('') : `<div class="empty">${t('noNotif')}</div>`}
          </div>` : ''}
        </div>
      </header>
      <section class="content">${VIEWS[state.view]()}</section>
    </main>
  </div>
  ${u.role === 'buyer' && cartCount() ? `<button class="btn gold cart-fab" data-act="checkout">${icon('cart')} ${t('cart')} · ${cartCount()} · ${rm(cartTotal())}</button>` : ''}`;
}

// ---------- views ----------
const VIEWS = {};

VIEWS.dashboard = () => {
  const d = D();
  const active = d.pools.filter(p => p.status === 'active');
  const totalFish = d.pools.reduce((s, p) => s + p.count, 0);
  const pending = d.orders.filter(o => o.status === 'pending').length;
  const ym = new Date().toISOString().slice(0, 7);
  const monthRev = d.orders.filter(o => isSale(o) && o.date.slice(0, 7) === ym).reduce((s, o) => s + o.total, 0);
  const myTasks = d.tasks.filter(x => !x.done && (isBoss() || x.assignee === me().id));

  // alerts
  const alerts = [];
  active.forEach(p => {
    const w = lastWater(p.id); const bad = wqIssues(w);
    if (bad.length) alerts.push({ type: 'red', text: `${p.name}: ${t('lowWater')} (${bad.map(b => t(b)).join(', ')})` });
    if (p.count / p.capacity >= 0.9) alerts.push({ type: 'amber', text: `${p.name}: ${t('nearCapacity')} (${Math.round(p.count / p.capacity * 100)}%)` });
    if (p.count < d.settings.lowStock) alerts.push({ type: 'gold', text: `${p.name}: ${t('lowStock')} (${fmtN(p.count)} ${t('ekor')})` });
  });

  // sales 7 days
  const days = Array.from({ length: 7 }, (_, i) => { const x = new Date(); x.setDate(x.getDate() - (6 - i)); return x; });
  const sales7 = days.map(day => {
    const key = day.toISOString().slice(0, 10);
    const v = d.orders.filter(o => isSale(o) && o.date.slice(0, 10) === key).reduce((s, o) => s + o.total, 0);
    return { label: day.toLocaleDateString(locale(), { weekday: 'short' }), value: v, display: v ? 'RM' + Math.round(v) : '0' };
  });

  return `
    <div class="stats">
      <div class="card stat"><div class="ic green">${icon('pools', 22)}</div><div class="label">${t('totalPools')}</div><div class="value">${d.pools.length}</div><div class="trend">${active.length} ${t('activePools')}</div></div>
      <div class="card stat"><div class="ic blue">${icon('water', 22)}</div><div class="label">${t('totalFish')}</div><div class="value">${fmtN(totalFish)}</div><div class="trend">${t('ekor')}</div></div>
      <div class="card stat"><div class="ic gold">${icon('orders', 22)}</div><div class="label">${t('pendingOrders')}</div><div class="value">${pending}</div><div class="trend"><a href="#" data-act="nav" data-v="orders">${t('viewAll')} →</a></div></div>
      ${isBoss()
        ? `<div class="card stat"><div class="ic green">${icon('money', 22)}</div><div class="label">${t('revenue')}</div><div class="value">${rm(monthRev)}</div><div class="trend">${new Date().toLocaleDateString(locale(), { month: 'long', year: 'numeric' })}</div></div>`
        : `<div class="card stat"><div class="ic red">${icon('tasks', 22)}</div><div class="label">${t('myTasksToday')}</div><div class="value">${myTasks.length}</div><div class="trend">${t('pending')}</div></div>`}
    </div>
    <div class="row">
      <div class="card"><div class="card-head"><h3>${t('fishPerPool')}</h3><a href="#" data-act="nav" data-v="pools">${t('viewAll')} →</a></div>
        ${barChart(d.pools.map(p => ({ label: p.name, value: p.count })))}</div>
      <div class="card"><div class="card-head"><h3>⚠️ ${t('alerts')}</h3><span class="badge ${alerts.length ? 'red' : ''}">${alerts.length}</span></div>
        ${alerts.length ? `<div class="list">${alerts.map(a => `<div class="list-item"><span class="badge ${a.type}">${icon('alert', 14)}</span><div class="grow t" style="font-weight:500">${esc(a.text)}</div></div>`).join('')}</div>` : `<div class="alert ok">${t('noAlerts')}</div>`}
      </div>
    </div>
    <div class="row">
      ${isBoss() ? `<div class="card"><div class="card-head"><h3>${t('sales7')}</h3></div>${barChart(sales7, true)}</div>` : `<div class="card"><div class="card-head"><h3>${t('myTasksToday')}</h3><a href="#" data-act="nav" data-v="tasks">${t('viewAll')} →</a></div>${taskList(myTasks.slice(0, 6))}</div>`}
      <div class="card"><div class="card-head"><h3>${t('recentActivity')}</h3></div>
        <div class="list">${d.activity.slice(0, 7).map(a => `<div class="list-item"><div class="grow"><div class="t" style="font-weight:500">${esc(a.text)}</div><div class="s">${fmtDT(a.date)}</div></div></div>`).join('') || `<div class="empty">-</div>`}</div>
      </div>
    </div>
    ${isBoss() ? `<div class="card"><div class="card-head"><h3>${t('tasks')} — ${t('pending')}</h3><button class="btn sm" data-act="addTask">${icon('plus', 16)} ${t('addTask')}</button></div>${taskList(myTasks.slice(0, 6))}</div>` : ''}
  `;
};

VIEWS.pools = () => {
  const q = state.q.toLowerCase();
  const list = D().pools.filter(p => (state.poolStatus === 'all' || p.status === state.poolStatus) && (!q || (p.name + p.species).toLowerCase().includes(q)));
  return `
    <div class="toolbar">
      <input class="input" id="search" data-filter="q" placeholder="${t('search')}" value="${esc(state.q)}">
      <div class="tabs">${['all', 'active', 'maintenance', 'empty'].map(s => `<button class="${state.poolStatus === s ? 'active' : ''}" data-act="set" data-k="poolStatus" data-v="${s}">${t(s)}</button>`).join('')}</div>
      <div class="spacer"></div>
      ${isBoss() ? `<button class="btn" data-act="addPool">${icon('plus', 18)} ${t('addPool')}</button>` : ''}
    </div>
    ${list.length ? `<div class="pools">${list.map(poolCard).join('')}</div>` : `<div class="card empty"><div class="big">🐟</div>-</div>`}`;
};

function poolCard(p) {
  const pct = p.capacity ? Math.min(100, Math.round(p.count / p.capacity * 100)) : 0;
  const w = lastWater(p.id), bad = wqIssues(w);
  const nFish = p.status === 'active' ? Math.min(4, Math.max(1, Math.ceil(pct / 25))) : 0;
  return `
  <div class="pool">
    <div class="pool-water st-${p.status}">
      <div class="wave"></div>
      ${Array.from({ length: nFish }, (_, i) => `<span class="fish" style="top:${38 + i * 16}px;left:${10 + i * 22}px;animation-delay:${i * 1.7}s">${p.emoji || '🐟'}</span>`).join('')}
      <span class="tag">${poolStatusBadge(p.status)}</span>
      <span class="count">${fmtN(p.count)} ${t('ekor')}</span>
    </div>
    <div class="pool-body">
      <div class="flex between"><h4>${esc(p.name)}</h4>${p.forSale && p.status === 'active' ? `<span class="badge gold">${rm(p.price)}/${unitLabel(p.unit)}</span>` : ''}</div>
      <div class="pool-meta"><span>${esc(p.species)}</span><span>${pct}% ${t('full')}</span></div>
      <div class="progress ${pct >= 90 ? 'warn' : ''}"><div style="width:${pct}%"></div></div>
      <div class="pool-meta"><span>${t('capacity')}: ${fmtN(p.capacity)}</span>${p.harvestDate ? `<span>🗓 ${fmtDate(p.harvestDate)}</span>` : ''}</div>
      ${w ? `<div class="wq">
        <div class="${bad.includes('ph') ? 'bad' : ''}"><b>${w.ph}</b><span>pH</span></div>
        <div class="${bad.includes('temp') ? 'bad' : ''}"><b>${w.temp}°</b><span>°C</span></div>
        <div class="${bad.includes('oxygen') ? 'bad' : ''}"><b>${w.oxygen}</b><span>DO</span></div>
      </div><div class="hint">${t('lastWater')}: ${fmtDT(w.date)}</div>` : `<div class="hint">${t('lastWater')}: ${t('notRecorded')}</div>`}
      ${p.notes ? `<div class="hint">📝 ${esc(p.notes)}</div>` : ''}
      <div class="pool-actions">
        <button class="btn sm secondary" data-act="addStock" data-pool="${p.id}">${icon('stock', 15)} ${t('stock').split(' ')[0]}</button>
        <button class="btn sm secondary" data-act="addWater" data-pool="${p.id}">${icon('water', 15)}</button>
        <button class="btn sm secondary" data-act="addFeeding" data-pool="${p.id}">${icon('feeding', 15)}</button>
        ${isBoss() ? `<button class="btn sm secondary" data-act="editPool" data-id="${p.id}">${icon('edit', 15)}</button>
        <button class="btn sm danger" data-act="delPool" data-id="${p.id}">${icon('trash', 15)}</button>` : ''}
      </div>
    </div>
  </div>`;
}

VIEWS.stock = () => {
  const typeLbl = { in: t('stockIn'), out: t('stockOut'), mortality: t('mortality'), transfer: t('transfer'), sale: t('sale') };
  const typeCls = { in: '', out: 'blue', mortality: 'red', transfer: 'amber', sale: 'gold' };
  const list = D().stockLogs.filter(s => (state.stockType === 'all' || s.type === state.stockType) && (state.poolFilter === 'all' || s.poolId === state.poolFilter || s.toPoolId === state.poolFilter)).sort((a, b) => b.date.localeCompare(a.date));
  return `
    <div class="toolbar">
      <select class="input" data-change="poolFilter"><option value="all">${t('all')} ${t('pools').toLowerCase()}</option>${poolOptions(state.poolFilter)}</select>
      <div class="tabs">${['all', 'in', 'out', 'mortality', 'transfer', 'sale'].map(s => `<button class="${state.stockType === s ? 'active' : ''}" data-act="set" data-k="stockType" data-v="${s}">${s === 'all' ? t('all') : typeLbl[s]}</button>`).join('')}</div>
      <div class="spacer"></div>
      <button class="btn" data-act="addStock">${icon('plus', 18)} ${t('recordStock')}</button>
    </div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>${t('date')}</th><th>${t('pool')}</th><th>${t('type')}</th><th class="right">${t('quantity')}</th><th>${t('reason')}</th><th>${t('by')}</th>${isBoss() ? '<th></th>' : ''}</tr></thead>
      <tbody>${list.map(s => `<tr>
        <td>${fmtDT(s.date)}</td>
        <td><b>${esc(poolName(s.poolId))}</b>${s.toPoolId ? ` → ${esc(poolName(s.toPoolId))}` : ''}</td>
        <td><span class="badge ${typeCls[s.type]}">${typeLbl[s.type]}</span></td>
        <td class="right"><b>${s.type === 'in' ? '+' : '−'}${fmtN(s.qty)}</b></td>
        <td class="muted">${esc(s.note) || '-'}</td>
        <td>${esc(userName(s.by))}</td>
        ${isBoss() ? `<td><button class="btn sm danger" data-act="delStock" data-id="${s.id}" title="${t('delete')}">${icon('trash', 14)}</button></td>` : ''}
      </tr>`).join('') || `<tr><td colspan="7" class="empty"><div class="big">📦</div>-</td></tr>`}</tbody>
    </table></div></div>`;
};

VIEWS.water = () => {
  const list = D().water.filter(w => state.poolFilter === 'all' || w.poolId === state.poolFilter).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 150);
  const cell = (w, k, v) => `<td class="right" style="${wqIssues(w).includes(k) ? 'color:var(--red-500);font-weight:800' : ''}">${v}</td>`;
  return `
    <div class="alert info">${icon('water', 18)} ${t('safeRange')}</div>
    <div class="toolbar">
      <select class="input" data-change="poolFilter"><option value="all">${t('all')} ${t('pools').toLowerCase()}</option>${poolOptions(state.poolFilter)}</select>
      <div class="spacer"></div>
      <button class="btn" data-act="addWater">${icon('plus', 18)} ${t('recordWater')}</button>
    </div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>${t('date')}</th><th>${t('pool')}</th><th class="right">pH</th><th class="right">${t('temp')}</th><th class="right">${t('oxygen')}</th><th class="right">${t('ammonia')}</th><th>${t('status')}</th><th>${t('by')}</th></tr></thead>
      <tbody>${list.map(w => { const bad = wqIssues(w); return `<tr>
        <td>${fmtDT(w.date)}</td><td><b>${esc(poolName(w.poolId))}</b></td>
        ${cell(w, 'ph', w.ph)}${cell(w, 'temp', w.temp)}${cell(w, 'oxygen', w.oxygen)}${cell(w, 'ammonia', w.ammonia ?? '-')}
        <td>${bad.length ? `<span class="badge red">${t('outOfRange')}</span>` : `<span class="badge">OK</span>`}</td>
        <td>${esc(userName(w.by))}</td></tr>`; }).join('') || `<tr><td colspan="8" class="empty"><div class="big">💧</div>-</td></tr>`}</tbody>
    </table></div></div>`;
};

VIEWS.feeding = () => {
  const today = todayStr();
  const todays = D().feeding.filter(f => f.date.slice(0, 10) === today);
  const totalToday = todays.reduce((s, f) => s + Number(f.kg), 0);
  const list = D().feeding.filter(f => state.poolFilter === 'all' || f.poolId === state.poolFilter).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 150);
  const fedIds = new Set(todays.map(f => f.poolId));
  const notFed = D().pools.filter(p => p.status === 'active' && !fedIds.has(p.id));
  return `
    <div class="stats">
      <div class="card stat"><div class="ic gold">${icon('feeding', 22)}</div><div class="label">${t('feedToday')}</div><div class="value">${totalToday.toFixed(1)} kg</div><div class="trend">${t('feedSchedule')}</div></div>
      <div class="card stat" style="grid-column: span 3"><div class="label">${t('pending')} — ${t('today')}</div>
        <div class="flex" style="margin-top:10px">${notFed.length ? notFed.map(p => `<button class="btn sm secondary" data-act="addFeeding" data-pool="${p.id}">${icon('plus', 14)} ${esc(p.name)}</button>`).join('') : `<span class="badge">✓ ${t('done')}</span>`}</div>
      </div>
    </div>
    <div class="toolbar">
      <select class="input" data-change="poolFilter"><option value="all">${t('all')} ${t('pools').toLowerCase()}</option>${poolOptions(state.poolFilter)}</select>
      <div class="spacer"></div>
      <button class="btn" data-act="addFeeding">${icon('plus', 18)} ${t('recordFeeding')}</button>
    </div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>${t('date')}</th><th>${t('pool')}</th><th>${t('feedType')}</th><th class="right">${t('amountKg')}</th><th>${t('by')}</th></tr></thead>
      <tbody>${list.map(f => `<tr><td>${fmtDT(f.date)}</td><td><b>${esc(poolName(f.poolId))}</b></td><td>${esc(f.feedType)}</td><td class="right"><b>${f.kg}</b></td><td>${esc(userName(f.by))}</td></tr>`).join('') || `<tr><td colspan="5" class="empty"><div class="big">🍚</div>-</td></tr>`}</tbody>
    </table></div></div>`;
};

function taskList(tasks) {
  if (!tasks.length) return `<div class="empty"><div class="big">✅</div></div>`;
  const pr = { high: 'red', normal: 'blue', low: 'gray' };
  return `<div class="list">${tasks.map(x => `
    <div class="list-item">
      <button class="check ${x.done ? 'on' : ''}" data-act="toggleTask" data-id="${x.id}">${x.done ? icon('check', 14) : ''}</button>
      <div class="grow"><div class="t ${x.done ? 'done-text' : ''}">${esc(x.title)}</div>
        <div class="s">${x.poolId ? esc(poolName(x.poolId)) + ' · ' : ''}${esc(userName(x.assignee))} · ${fmtDate(x.due)}</div></div>
      <span class="badge ${pr[x.priority]}">${t(x.priority)}</span>
      ${isBoss() ? `<button class="btn sm danger" data-act="delTask" data-id="${x.id}">${icon('trash', 14)}</button>` : ''}
    </div>`).join('')}</div>`;
}

VIEWS.tasks = () => {
  const mine = D().tasks.filter(x => isBoss() || x.assignee === me().id);
  const list = mine.filter(x => state.taskTab === 'done' ? x.done : !x.done).sort((a, b) => (a.due || '').localeCompare(b.due || ''));
  return `
    <div class="toolbar">
      <div class="tabs">
        <button class="${state.taskTab === 'pending' ? 'active' : ''}" data-act="set" data-k="taskTab" data-v="pending">${t('pending')} (${mine.filter(x => !x.done).length})</button>
        <button class="${state.taskTab === 'done' ? 'active' : ''}" data-act="set" data-k="taskTab" data-v="done">${t('done')} (${mine.filter(x => x.done).length})</button>
      </div>
      <div class="spacer"></div>
      ${isBoss() ? `<button class="btn" data-act="addTask">${icon('plus', 18)} ${t('addTask')}</button>` : ''}
    </div>
    <div class="card">${taskList(list)}</div>`;
};

VIEWS.orders = () => {
  const tabs = ['pending', 'confirmed', 'ready', 'completed', 'cancelled'];
  const list = D().orders.filter(o => o.status === state.orderTab).sort((a, b) => b.date.localeCompare(a.date));
  const next = { pending: [['confirm', 'confirmed', '']], confirmed: [['markReady', 'ready', '']], ready: [['complete', 'completed', '']] };
  return `
    <div class="toolbar">
      <div class="tabs">${tabs.map(s => `<button class="${state.orderTab === s ? 'active' : ''}" data-act="set" data-k="orderTab" data-v="${s}">${t('st_' + s)} (${D().orders.filter(o => o.status === s).length})</button>`).join('')}</div>
    </div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>${t('orderNo')}</th><th>${t('date')}</th><th>${t('customer')}</th><th>${t('items')}</th><th class="right">${t('total')}</th><th>${t('method')}</th><th>${t('action')}</th></tr></thead>
      <tbody>${list.map(o => `<tr>
        <td><a href="#" data-act="viewOrder" data-id="${o.id}"><b>${o.no}</b></a></td>
        <td>${fmtDT(o.date)}</td>
        <td><b>${esc(o.buyerName)}</b><div class="hint">${esc(o.buyerPhone)}</div></td>
        <td>${o.items.map(i => `${esc(i.name)} × ${i.qty} ${unitLabel(i.unit)}`).join('<br>')}</td>
        <td class="right"><b>${rm(o.total)}</b></td>
        <td>${o.method === 'delivery' ? '🚚 ' + t('delivery') : '🏪 ' + t('pickup')}<div class="hint">${fmtDate(o.pickupDate)}</div></td>
        <td><div class="flex" style="flex-wrap:nowrap">
          ${(next[o.status] || []).filter(() => isBoss() || o.status !== 'pending').map(([lbl, st]) => `<button class="btn sm" data-act="orderStatus" data-id="${o.id}" data-v="${st}">${t(lbl)}</button>`).join('')}
          <a class="btn sm wa" target="_blank" rel="noopener" href="${Notify.waLink(o.buyerPhone, Notify.statusMessage(o))}" title="${t('notifyBuyer')}">${icon('phone', 14)}</a>
          ${isBoss() && !['completed', 'cancelled'].includes(o.status) ? `<button class="btn sm danger" data-act="orderStatus" data-id="${o.id}" data-v="cancelled">${t('cancelOrder')}</button>` : ''}
        </div></td>
      </tr>`).join('') || `<tr><td colspan="7" class="empty"><div class="big">🧾</div>${t('noOrders')}</td></tr>`}</tbody>
    </table></div></div>`;
};

// ----- buyer -----
const cartCount = () => Object.keys(state.cart).filter(id => Store.pool(id)).length;
const cartTotal = () => Object.entries(state.cart).reduce((s, [id, q]) => { const p = Store.pool(id); return s + (p ? p.price * q : 0); }, 0);

VIEWS.shop = () => {
  const list = D().pools.filter(p => p.forSale && p.status === 'active');
  const q = state.q.toLowerCase();
  const shown = list.filter(p => !q || p.species.toLowerCase().includes(q));
  return `
    <div class="shop-hero"><h2>${t('shopTitle')} 🎣</h2><p>${t('shopText')}</p><div class="deco">🐟</div></div>
    <div class="toolbar"><input class="input" id="search" data-filter="q" placeholder="${t('search')}" value="${esc(state.q)}"></div>
    <div class="products">${shown.map(p => {
      const avail = availableQty(p); const inCart = state.cart[p.id];
      return `<div class="product">
        <div class="pic">${p.emoji || '🐟'}</div>
        <div class="body">
          <div class="flex between"><h4>${esc(p.species)}</h4>${avail > 0 ? `<span class="badge">${t('available')}</span>` : `<span class="badge red">${t('soldOut')}</span>`}</div>
          <div class="hint">${esc(p.name)} · ${t('available')}: ${fmtN(avail)} ${unitLabel(p.unit)}</div>
          <div class="price">${rm(p.price)} <small>/ ${unitLabel(p.unit)}</small></div>
          ${avail > 0 ? `<div class="flex" style="margin-top:auto">
            <div class="qty"><button data-act="qty" data-id="${p.id}" data-d="-1">−</button><input id="q_${p.id}" type="number" min="1" max="${avail}" value="${inCart || 1}"><button data-act="qty" data-id="${p.id}" data-d="1">+</button></div>
            <button class="btn sm" style="flex:1;padding:9px" data-act="addCart" data-id="${p.id}">${icon('cart', 15)} ${inCart ? '✓' : t('addToCart')}</button>
          </div>` : ''}
        </div></div>`;
    }).join('') || `<div class="card empty"><div class="big">🎣</div>-</div>`}</div>`;
};

VIEWS.myOrders = () => {
  const list = D().orders.filter(o => o.buyerId === me().id).sort((a, b) => b.date.localeCompare(a.date));
  const flow = ['pending', 'confirmed', 'ready', 'completed'];
  if (!list.length) return `<div class="card empty"><div class="big">🧾</div>${t('noOrders')}<div class="mt"><button class="btn" data-act="nav" data-v="shop">${icon('shop', 18)} ${t('shop')}</button></div></div>`;
  return list.map(o => {
    const idx = flow.indexOf(o.status);
    return `<div class="card order-card">
      <div class="card-head"><div><h3>${o.no}</h3><div class="hint">${fmtDT(o.date)}</div></div>${statusBadge(o.status)}</div>
      ${o.status === 'cancelled' ? '' : `<div class="steps">${flow.map((s, i) => `${i ? '<span class="step-line"></span>' : ''}<span class="step ${i <= idx ? 'on' : ''}"><span class="c">${i <= idx ? '✓' : i + 1}</span>${t('st_' + s)}</span>`).join('')}</div>`}
      <div class="list">${o.items.map(i => `<div class="list-item"><div class="grow"><div class="t">${esc(i.name)}</div><div class="s">${i.qty} ${unitLabel(i.unit)} × ${rm(i.price)}</div></div><b>${rm(i.subtotal)}</b></div>`).join('')}</div>
      <div class="flex between mt"><span class="muted">${o.method === 'delivery' ? '🚚 ' + t('delivery') : '🏪 ' + t('pickup')} · ${fmtDate(o.pickupDate)}</span><span style="font-size:20px;font-weight:800">${rm(o.total)}</span></div>
      ${o.status === 'pending' ? `<div class="mt"><button class="btn sm danger" data-act="buyerCancel" data-id="${o.id}">${t('cancelOrder')}</button></div>` : ''}
    </div>`;
  }).join('');
};

// ----- reports -----
VIEWS.reports = () => {
  const d = D();
  const since = { month: new Date(new Date().getFullYear(), new Date().getMonth(), 1), last30: new Date(Date.now() - 30 * 864e5), all: new Date(0) }[state.reportPeriod];
  const inP = x => new Date(x.date) >= since;
  const orders = d.orders.filter(o => isSale(o) && inP(o));
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const mort = d.stockLogs.filter(s => s.type === 'mortality' && inP(s)).reduce((s, x) => s + x.qty, 0);
  const totalFish = d.pools.reduce((s, p) => s + p.count, 0);
  const feed = d.feeding.filter(inP).reduce((s, f) => s + Number(f.kg), 0);
  const bySp = {};
  orders.forEach(o => o.items.forEach(i => { bySp[i.name] = (bySp[i.name] || 0) + i.subtotal; }));
  const spItems = Object.entries(bySp).map(([k, v]) => ({ label: k, value: v, display: 'RM' + Math.round(v) }));
  return `
    <div class="toolbar">
      <div class="tabs">${[['month', 'thisMonth'], ['last30', 'last30'], ['all', 'allTime']].map(([k, l]) => `<button class="${state.reportPeriod === k ? 'active' : ''}" data-act="set" data-k="reportPeriod" data-v="${k}">${t(l)}</button>`).join('')}</div>
      <div class="spacer"></div>
      <button class="btn secondary" data-act="export" data-v="pools">${icon('download', 16)} ${t('pools')}</button>
      <button class="btn secondary" data-act="export" data-v="orders">${icon('download', 16)} ${t('orders')}</button>
      <button class="btn secondary" data-act="export" data-v="stock">${icon('download', 16)} ${t('stock')}</button>
      <button class="btn" data-act="print">${icon('print', 16)} ${t('printReport')}</button>
    </div>
    <div class="stats">
      <div class="card stat"><div class="ic green">${icon('money', 22)}</div><div class="label">${t('sales')}</div><div class="value">${rm(revenue)}</div><div class="trend">${orders.length} ${t('orders').toLowerCase()}</div></div>
      <div class="card stat"><div class="ic red">${icon('alert', 22)}</div><div class="label">${t('totalMortality')}</div><div class="value">${fmtN(mort)}</div><div class="trend">${t('mortalityRate')}: ${totalFish ? (mort / (totalFish + mort) * 100).toFixed(2) : 0}%</div></div>
      <div class="card stat"><div class="ic gold">${icon('feeding', 22)}</div><div class="label">${t('feedUsed')}</div><div class="value">${feed.toFixed(1)} kg</div></div>
      <div class="card stat"><div class="ic blue">${icon('pools', 22)}</div><div class="label">${t('totalFish')}</div><div class="value">${fmtN(totalFish)}</div></div>
    </div>
    <div class="row even">
      <div class="card"><div class="card-head"><h3>${t('bySpecies')}</h3></div>${barChart(spItems, true)}</div>
      <div class="card"><div class="card-head"><h3>${t('fishPerPool')}</h3></div>${barChart(d.pools.map(p => ({ label: p.name, value: p.count })))}</div>
    </div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>${t('pool')}</th><th>${t('species')}</th><th class="right">${t('fishCount')}</th><th class="right">${t('capacity')}</th><th class="right">${t('mortality')}</th><th class="right">${t('feedUsed')}</th><th>${t('status')}</th></tr></thead>
      <tbody>${d.pools.map(p => `<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.species)}</td><td class="right">${fmtN(p.count)}</td><td class="right">${fmtN(p.capacity)}</td>
        <td class="right">${fmtN(d.stockLogs.filter(s => s.poolId === p.id && s.type === 'mortality' && inP(s)).reduce((s, x) => s + x.qty, 0))}</td>
        <td class="right">${d.feeding.filter(f => f.poolId === p.id && inP(f)).reduce((s, f) => s + Number(f.kg), 0).toFixed(1)} kg</td>
        <td>${poolStatusBadge(p.status)}</td></tr>`).join('')}</tbody>
    </table></div></div>`;
};

// ----- users -----
VIEWS.users = () => `
  <div class="toolbar"><div class="spacer"></div><button class="btn" data-act="addUser">${icon('plus', 18)} ${t('addUser')}</button></div>
  <div class="card"><div class="table-wrap"><table>
    <thead><tr><th>${t('fullName')}</th><th>${t('username')}</th><th>${t('role')}</th><th>${t('phone')}</th><th></th></tr></thead>
    <tbody>${D().users.map(u => `<tr>
      <td><div class="flex"><div class="avatar" style="width:32px;height:32px;font-size:13px">${esc(u.name[0])}</div><b>${esc(u.name)}</b></div></td>
      <td>${esc(u.username)}</td>
      <td><span class="badge ${{ boss: 'gold', worker: 'blue', buyer: '' }[u.role]}">${t(u.role)}</span></td>
      <td>${esc(u.phone)}</td>
      <td><div class="flex" style="flex-wrap:nowrap"><button class="btn sm secondary" data-act="editUser" data-id="${u.id}">${icon('edit', 14)}</button><button class="btn sm danger" data-act="delUser" data-id="${u.id}">${icon('trash', 14)}</button></div></td>
    </tr>`).join('')}</tbody>
  </table></div></div>`;

// ----- settings -----
VIEWS.settings = () => {
  const s = D().settings;
  return `
  <div class="row even">
    <form class="card" id="settings-form">
      <div class="card-head"><h3>📲 ${t('notifSettings')}</h3></div>
      <p class="muted" style="margin-top:0">${t('notifText')}</p>
      <div class="field"><label>${t('bossPhone')}</label><input class="input" name="bossPhone" value="${esc(s.bossPhone)}"></div>
      <div class="field"><label>${t('callmebotKey')}</label><input class="input" name="callmebotKey" value="${esc(s.callmebotKey)}" placeholder="123456"></div>
      <div class="grid-2">
        <div class="field"><label>${t('telegramToken')}</label><input class="input" name="telegramToken" value="${esc(s.telegramToken)}" placeholder="123:ABC..."></div>
        <div class="field"><label>${t('telegramChat')}</label><input class="input" name="telegramChatId" value="${esc(s.telegramChatId)}"></div>
      </div>
      <div class="card-head" style="margin-top:6px"><h3>🏢 ${t('businessInfo')}</h3></div>
      <div class="field"><label>${t('businessName')}</label><input class="input" name="businessName" value="${esc(s.businessName)}"></div>
      <div class="grid-2">
        <div class="field"><label>${t('location')}</label><input class="input" name="location" value="${esc(s.location)}"></div>
        <div class="field"><label>${t('lowStockLevel')}</label><input class="input" type="number" name="lowStock" value="${s.lowStock}"></div>
      </div>
      <div class="flex"><button class="btn" type="submit">${icon('check', 16)} ${t('save')}</button><button class="btn secondary" type="button" data-act="testNotif">${icon('bell', 16)} ${t('testNotif')}</button></div>
    </form>
    <div>
      <div class="card">
        <div class="card-head"><h3>💡 ${t('howTo')}</h3></div>
        <p style="margin-top:0"><b>WhatsApp (CallMeBot — percuma/free)</b></p>
        <ol style="margin:0 0 12px;padding-left:20px;font-size:14px">
          <li>Simpan nombor <b>+34 644 51 95 23</b> dalam telefon.</li>
          <li>Hantar WhatsApp: <code>I allow callmebot to send me messages</code></li>
          <li>Anda akan terima API key — masukkan di sini.</li>
        </ol>
        <p><b>Telegram</b></p>
        <ol style="margin:0;padding-left:20px;font-size:14px">
          <li>Cari <b>@BotFather</b> → <code>/newbot</code> → salin token.</li>
          <li>Hantar mesej ke bot anda, kemudian buka <code>api.telegram.org/bot&lt;TOKEN&gt;/getUpdates</code> untuk dapatkan chat id.</li>
        </ol>
        <div class="alert info mt" style="margin-bottom:0">${icon('phone', 18)} <span>${LANG === 'ms' ? 'Tanpa API key pun, setiap tempahan masih masuk ke loceng notifikasi Boss, dan pembeli boleh tekan butang WhatsApp untuk hantar terus kepada anda.' : 'Even without an API key, each order still appears in the Boss notification bell, and buyers can tap the WhatsApp button to message you directly.'}</span></div>
      </div>
      <div class="card mt">
        <div class="card-head"><h3>💾 ${t('dataMgmt')}</h3></div>
        <div class="flex">
          <button class="btn secondary" data-act="backup">${icon('download', 16)} ${t('backup')}</button>
          <label class="btn secondary">${icon('upload', 16)} ${t('restore')}<input type="file" accept=".json" id="restore-file" hidden></label>
          <button class="btn danger" data-act="resetDemo">${icon('refresh', 16)} ${t('resetDemo')}</button>
        </div>
      </div>
    </div>
  </div>`;
};

// ---------- forms ----------
function poolForm(p = {}) {
  const sel = (v, x) => v === x ? 'selected' : '';
  return `
    <div class="grid-2">
      <div class="field"><label>${t('poolName')}</label><input class="input" name="name" value="${esc(p.name)}" required></div>
      <div class="field"><label>${t('species')}</label><input class="input" name="species" value="${esc(p.species)}" list="species-list" required>
        <datalist id="species-list">${['Tilapia Merah', 'Tilapia Hitam', 'Keli', 'Patin', 'Udang Galah', 'Lampam Jawa', 'Haruan', 'Baung', 'Kelah', 'Siakap', 'Jelawat'].map(s => `<option value="${s}">`).join('')}</datalist></div>
      <div class="field"><label>${t('fishCount')}</label><input class="input" type="number" min="0" name="count" value="${p.count ?? 0}" required></div>
      <div class="field"><label>${t('capacity')}</label><input class="input" type="number" min="1" name="capacity" value="${p.capacity ?? 1000}" required></div>
      <div class="field"><label>${t('pricePerFish')}</label><input class="input" type="number" step="0.01" min="0" name="price" value="${p.price ?? 0}"></div>
      <div class="field"><label>${t('unit')}</label><select class="input" name="unit"><option value="kg" ${sel(p.unit, 'kg')}>${t('perKg')}</option><option value="fish" ${sel(p.unit, 'fish')}>${t('perFish')}</option></select></div>
      <div class="field"><label>${t('avgWeight')}</label><input class="input" type="number" step="0.01" min="0" name="avgWeight" value="${p.avgWeight ?? 0.5}"></div>
      <div class="field"><label>Emoji</label><select class="input" name="emoji">${['🐟', '🐠', '🐡', '🦐', '🦀', '🐍'].map(e => `<option ${sel(p.emoji, e)}>${e}</option>`).join('')}</select></div>
      <div class="field"><label>${t('status')}</label><select class="input" name="status">${['active', 'maintenance', 'empty'].map(s => `<option value="${s}" ${sel(p.status, s)}>${t(s)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('forSale')}</label><select class="input" name="forSale"><option value="1" ${p.forSale !== false ? 'selected' : ''}>${t('yes')}</option><option value="0" ${p.forSale === false ? 'selected' : ''}>${t('no')}</option></select></div>
      <div class="field"><label>${t('stockedDate')}</label><input class="input" type="date" name="stockedDate" value="${esc(p.stockedDate)}"></div>
      <div class="field"><label>${t('harvestDate')}</label><input class="input" type="date" name="harvestDate" value="${esc(p.harvestDate)}"></div>
    </div>
    <div class="field"><label>${t('notes')}</label><textarea class="input" name="notes">${esc(p.notes)}</textarea></div>`;
}

function savePool(f, existing) {
  const p = existing || { id: uid('p') };
  Object.assign(p, {
    name: f.name.trim(), species: f.species.trim(), count: +f.count, capacity: +f.capacity, price: +f.price, unit: f.unit,
    avgWeight: +f.avgWeight, emoji: f.emoji, status: f.status, forSale: f.forSale === '1', stockedDate: f.stockedDate, harvestDate: f.harvestDate, notes: f.notes,
  });
  if (!existing) D().pools.push(p);
  Store.log(`${me().name} ${existing ? 'mengemaskini' : 'menambah'} ${p.name}`);
  Store.save(); toast(t('saved'));
}

function openStockForm(poolId) {
  openModal({
    title: t('recordStock'),
    body: `
      <div class="field"><label>${t('pool')}</label><select class="input" name="poolId" required>${poolOptions(poolId)}</select></div>
      <div class="grid-2">
        <div class="field"><label>${t('type')}</label><select class="input" name="type" id="stock-type">
          <option value="in">${t('stockIn')}</option><option value="out">${t('stockOut')}</option><option value="mortality">${t('mortality')}</option><option value="transfer">${t('transfer')}</option></select></div>
        <div class="field"><label>${t('quantity')} (${t('ekor')})</label><input class="input" type="number" min="1" name="qty" required></div>
      </div>
      <div class="field" id="to-pool" style="display:none"><label>${t('toPool')}</label><select class="input" name="toPoolId">${poolOptions('')}</select></div>
      <div class="field"><label>${t('reason')}</label><input class="input" name="note"></div>`,
    onSubmit: f => {
      const p = Store.pool(f.poolId), qty = +f.qty;
      if (!p || qty <= 0) return false;
      if (f.type === 'in' && p.count + qty > p.capacity) { toast(t('overCapacity'), 'err'); return false; }
      if (f.type !== 'in' && p.count < qty) { toast(t('notEnough'), 'err'); return false; }
      if (f.type === 'transfer') {
        const to = Store.pool(f.toPoolId);
        if (!to || to.id === p.id) return false;
        if (to.count + qty > to.capacity) { toast(t('overCapacity'), 'err'); return false; }
        to.count += qty;
      }
      p.count += f.type === 'in' ? qty : -qty;
      D().stockLogs.push({ id: uid('s'), poolId: p.id, toPoolId: f.type === 'transfer' ? f.toPoolId : undefined, type: f.type, qty, note: f.note, by: me().id, date: new Date().toISOString() });
      const lbl = { in: t('stockIn'), out: t('stockOut'), mortality: t('mortality'), transfer: t('transfer') }[f.type];
      Store.log(`${me().name}: ${lbl} ${qty} ${t('ekor')} — ${p.name}`);
      if (f.type === 'mortality' && !isBoss()) Notify.inApp('boss', `${t('mortality')}: ${p.name}`, `${qty} ${t('ekor')} · ${me().name}${f.note ? ' · ' + f.note : ''}`);
      Store.save(); toast(t('saved')); render();
    },
  });
}

function openWaterForm(poolId) {
  openModal({
    title: t('recordWater'),
    body: `
      <div class="alert info">${t('safeRange')}</div>
      <div class="field"><label>${t('pool')}</label><select class="input" name="poolId">${poolOptions(poolId, p => p.status !== 'empty')}</select></div>
      <div class="grid-2">
        <div class="field"><label>pH</label><input class="input" type="number" step="0.1" name="ph" required></div>
        <div class="field"><label>${t('temp')}</label><input class="input" type="number" step="0.1" name="temp" required></div>
        <div class="field"><label>${t('oxygen')}</label><input class="input" type="number" step="0.1" name="oxygen" required></div>
        <div class="field"><label>${t('ammonia')}</label><input class="input" type="number" step="0.01" name="ammonia" value="0"></div>
      </div>
      <div class="field"><label>${t('date')}</label><input class="input" type="datetime-local" name="date" value="${nowLocal()}"></div>`,
    onSubmit: f => {
      const w = { id: uid('w'), poolId: f.poolId, ph: +f.ph, temp: +f.temp, oxygen: +f.oxygen, ammonia: +f.ammonia, by: me().id, date: new Date(f.date).toISOString() };
      D().water.push(w);
      Store.log(`${me().name} merekod kualiti air ${poolName(f.poolId)}`);
      const bad = wqIssues(w);
      if (bad.length) { Notify.inApp('boss', `⚠️ ${t('lowWater')}: ${poolName(f.poolId)}`, bad.map(b => `${t(b)}: ${w[b]}`).join(' · ')); toast(`${t('outOfRange')}: ${bad.map(t).join(', ')}`, 'warn'); }
      else toast(t('saved'));
      Store.save(); render();
    },
  });
}

function openFeedingForm(poolId) {
  const last = D().feeding[D().feeding.length - 1];
  openModal({
    title: t('recordFeeding'),
    body: `
      <div class="field"><label>${t('pool')}</label><select class="input" name="poolId">${poolOptions(poolId, p => p.status === 'active')}</select></div>
      <div class="grid-2">
        <div class="field"><label>${t('feedType')}</label><input class="input" name="feedType" value="${esc(last?.feedType || 'Pelet 3mm')}" list="feed-list" required>
          <datalist id="feed-list"><option value="Pelet 2mm"><option value="Pelet 3mm"><option value="Pelet 4mm"><option value="Dedak"><option value="Sayur"></datalist></div>
        <div class="field"><label>${t('amountKg')}</label><input class="input" type="number" step="0.1" min="0.1" name="kg" required></div>
      </div>
      <div class="field"><label>${t('time')}</label><input class="input" type="datetime-local" name="date" value="${nowLocal()}"></div>`,
    onSubmit: f => {
      D().feeding.push({ id: uid('f'), poolId: f.poolId, feedType: f.feedType, kg: +f.kg, by: me().id, date: new Date(f.date).toISOString() });
      Store.log(`${me().name} memberi makan ${poolName(f.poolId)} (${f.kg} kg)`);
      Store.save(); toast(t('saved')); render();
    },
  });
}

function userForm(u = {}) {
  return `
    <div class="field"><label>${t('fullName')}</label><input class="input" name="name" value="${esc(u.name)}" required></div>
    <div class="grid-2">
      <div class="field"><label>${t('username')}</label><input class="input" name="username" value="${esc(u.username)}" required></div>
      <div class="field"><label>${t('password')}</label><input class="input" name="password" value="${esc(u.password)}" required></div>
      <div class="field"><label>${t('role')}</label><select class="input" name="role">${['boss', 'worker', 'buyer'].map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${t(r)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('phone')}</label><input class="input" name="phone" value="${esc(u.phone)}"></div>
    </div>`;
}

// ---------- orders logic ----------
function setOrderStatus(o, status) {
  if (status === 'confirmed' && !o.stockDeducted) {
    for (const i of o.items) {
      const p = Store.pool(i.poolId);
      if (!p || p.count < fishFromQty(p, i.qty)) { toast(`${t('notEnough')}: ${i.name}`, 'err'); return; }
    }
    o.items.forEach(i => {
      const p = Store.pool(i.poolId), n = fishFromQty(p, i.qty);
      p.count -= n;
      D().stockLogs.push({ id: uid('s'), poolId: p.id, type: 'sale', qty: n, note: o.no, by: me().id, date: new Date().toISOString() });
    });
    o.stockDeducted = true;
  }
  if (status === 'cancelled' && o.stockDeducted) {
    o.items.forEach(i => {
      const p = Store.pool(i.poolId); if (!p) return;
      const n = fishFromQty(p, i.qty); p.count += n;
      D().stockLogs.push({ id: uid('s'), poolId: p.id, type: 'in', qty: n, note: `Batal ${o.no}`, by: me().id, date: new Date().toISOString() });
    });
    o.stockDeducted = false;
  }
  o.status = status;
  Notify.inApp(o.buyerId, `${o.no}: ${t('st_' + status)}`, `${rm(o.total)}`);
  Store.log(`${me().name}: ${o.no} → ${t('st_' + status)}`);
  Store.save(); toast(`${o.no} → ${t('st_' + status)}`); render();
}

function openCheckout() {
  const items = Object.entries(state.cart).map(([id, q]) => ({ p: Store.pool(id), q })).filter(x => x.p);
  if (!items.length) return toast(t('cartEmpty'), 'warn');
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  openModal({
    title: `${icon('cart')} ${t('cart')}`, wide: true, submitLabel: `${t('placeOrder')} · ${rm(cartTotal())}`,
    body: `
      <div class="list" style="margin-bottom:14px">${items.map(({ p, q }) => `
        <div class="list-item"><span style="font-size:28px">${p.emoji}</span>
          <div class="grow"><div class="t">${esc(p.species)}</div><div class="s">${q} ${unitLabel(p.unit)} × ${rm(p.price)}</div></div>
          <b>${rm(p.price * q)}</b>
          <button type="button" class="btn sm danger" data-act="removeCart" data-id="${p.id}">${icon('trash', 14)}</button></div>`).join('')}
        <div class="list-item"><div class="grow t">${t('total')}</div><b style="font-size:20px;color:var(--green-800)">${rm(cartTotal())}</b></div>
      </div>
      <div class="grid-2">
        <div class="field"><label>${t('method')}</label><select class="input" name="method" id="co-method"><option value="pickup">🏪 ${t('pickup')}</option><option value="delivery">🚚 ${t('delivery')}</option></select></div>
        <div class="field"><label>${t('pickupDate')}</label><input class="input" type="date" name="pickupDate" value="${tomorrow}" min="${todayStr()}" required></div>
      </div>
      <div class="field" id="co-address" style="display:none"><label>${t('address')}</label><textarea class="input" name="address"></textarea></div>
      <div class="field"><label>${t('phone')}</label><input class="input" name="phone" value="${esc(me().phone)}" required></div>
      <div class="field"><label>${t('notes')}</label><input class="input" name="note" placeholder="${LANG === 'ms' ? 'cth: siang & bersihkan' : 'e.g. clean & cut'}"></div>`,
    onSubmit: f => {
      if (f.method === 'delivery' && !f.address.trim()) { toast(t('address') + '?', 'err'); return false; }
      for (const { p, q } of items) if (q > availableQty(p)) { toast(`${t('notEnough')}: ${p.species}`, 'err'); return false; }
      const n = D().orders.length + 1;
      const o = {
        id: uid('o'), no: 'TB' + (1000 + n + Math.floor(Math.random() * 9)), buyerId: me().id, buyerName: me().name, buyerPhone: f.phone,
        items: items.map(({ p, q }) => ({ poolId: p.id, name: p.species, qty: q, unit: p.unit, price: p.price, subtotal: +(p.price * q).toFixed(2) })),
        total: +cartTotal().toFixed(2), method: f.method, address: f.address || '', pickupDate: f.pickupDate, note: f.note, status: 'pending', date: new Date().toISOString(),
      };
      D().orders.push(o);
      Store.log(`${me().name} membuat tempahan ${o.no}`);
      Store.save();
      state.cart = {}; saveCart();
      Notify.newOrder(o).then(sent => { if (sent.length) toast(`${t('sentAuto')}: ${sent.join(' + ')}`); });
      setTimeout(() => showOrderSuccess(o), 50);
      render();
    },
  });
}

function showOrderSuccess(o) {
  const boss = D().settings.bossPhone;
  openModal({
    title: '🎉 ' + o.no, hideFoot: true,
    body: `
      <div style="text-align:center">
        <div style="font-size:60px">✅</div>
        <h3>${t('orderPlaced')}</h3>
        <p class="muted">${rm(o.total)} · ${o.method === 'delivery' ? t('delivery') : t('pickup')} · ${fmtDate(o.pickupDate)}</p>
        <a class="btn wa block" target="_blank" rel="noopener" href="${Notify.waLink(boss, Notify.orderMessage(o))}">${icon('phone', 18)} ${t('openWa')}</a>
        <button type="button" class="btn secondary block" style="margin-top:10px" data-act="goMyOrders">${t('myOrders')}</button>
      </div>`,
  });
}

// ---------- actions ----------
const ACTIONS = {
  lang: el => { setLang(el.dataset.v); render(); },
  loginRole: el => { state.loginRole = el.dataset.v; if (el.dataset.v !== 'buyer') state.registerMode = false; render(); },
  toggleRegister: () => { state.registerMode = !state.registerMode; render(); },
  logout: () => { Store.session = null; state.view = null; state.notifOpen = false; render(); },
  nav: el => { state.view = el.dataset.v; state.sidebarOpen = false; state.notifOpen = false; state.q = ''; state.poolFilter = 'all'; render(); window.scrollTo(0, 0); },
  openSidebar: () => { state.sidebarOpen = true; render(); },
  closeSidebar: () => { state.sidebarOpen = false; render(); },
  toggleNotif: () => { state.notifOpen = !state.notifOpen; render(); },
  readAll: () => { myNotifs().forEach(n => n.read = true); Store.save(); render(); },
  set: el => { state[el.dataset.k] = el.dataset.v; render(); },
  closeModal: () => closeModal(),
  closeModalBack: (el, e) => { if (e.target === el) closeModal(); },

  addPool: () => openModal({ title: t('addPool'), wide: true, body: poolForm(), onSubmit: f => { savePool(f); render(); } }),
  editPool: el => { const p = Store.pool(el.dataset.id); openModal({ title: t('editPool'), wide: true, body: poolForm(p), onSubmit: f => { savePool(f, p); render(); } }); },
  delPool: el => {
    if (!confirm(t('confirmDelete'))) return;
    const p = Store.pool(el.dataset.id);
    D().pools = D().pools.filter(x => x.id !== el.dataset.id);
    Store.log(`${me().name} memadam ${p.name}`); Store.save(); toast(t('deleted')); render();
  },
  addStock: el => openStockForm(el.dataset.pool),
  delStock: el => {
    if (!confirm(t('confirmDelete'))) return;
    D().stockLogs = D().stockLogs.filter(s => s.id !== el.dataset.id); Store.save(); toast(t('deleted')); render();
  },
  addWater: el => openWaterForm(el.dataset.pool),
  addFeeding: el => openFeedingForm(el.dataset.pool),

  addTask: () => openModal({
    title: t('addTask'),
    body: `
      <div class="field"><label>${t('taskTitle')}</label><input class="input" name="title" required></div>
      <div class="grid-2">
        <div class="field"><label>${t('assignTo')}</label><select class="input" name="assignee">${D().users.filter(u => u.role !== 'buyer').map(u => `<option value="${u.id}">${esc(u.name)}</option>`).join('')}</select></div>
        <div class="field"><label>${t('pool')}</label><select class="input" name="poolId"><option value="">-</option>${poolOptions('')}</select></div>
        <div class="field"><label>${t('dueDate')}</label><input class="input" type="date" name="due" value="${todayStr()}"></div>
        <div class="field"><label>${t('priority')}</label><select class="input" name="priority"><option value="normal">${t('normal')}</option><option value="high">${t('high')}</option><option value="low">${t('low')}</option></select></div>
      </div>`,
    onSubmit: f => {
      D().tasks.push({ id: uid('t'), ...f, done: false, createdAt: new Date().toISOString() });
      Notify.inApp(f.assignee, `📋 ${t('tasks')}: ${f.title}`, `${t('dueDate')}: ${fmtDate(f.due)}`);
      Store.log(`${me().name} menugaskan "${f.title}" kepada ${userName(f.assignee)}`);
      Store.save(); toast(t('saved')); render();
    },
  }),
  toggleTask: el => {
    const x = D().tasks.find(k => k.id === el.dataset.id); x.done = !x.done;
    if (x.done) { Store.log(`${me().name} selesai: ${x.title}`); if (!isBoss()) Notify.inApp('boss', `✅ ${x.title}`, me().name); }
    Store.save(); render();
  },
  delTask: el => { D().tasks = D().tasks.filter(k => k.id !== el.dataset.id); Store.save(); render(); },

  orderStatus: el => {
    const o = D().orders.find(x => x.id === el.dataset.id);
    if (el.dataset.v === 'cancelled' && !confirm(t('cancelOrder') + ' ' + o.no + '?')) return;
    setOrderStatus(o, el.dataset.v);
  },
  viewOrder: el => {
    const o = D().orders.find(x => x.id === el.dataset.id);
    openModal({
      title: `${o.no} ${statusBadge(o.status)}`,
      body: `
        <div class="list">
          <div class="list-item"><div class="grow"><div class="s">${t('customer')}</div><div class="t">${esc(o.buyerName)} · ${esc(o.buyerPhone)}</div></div></div>
          <div class="list-item"><div class="grow"><div class="s">${t('method')}</div><div class="t">${o.method === 'delivery' ? t('delivery') + ': ' + esc(o.address) : t('pickup')} · ${fmtDate(o.pickupDate)}</div></div></div>
          ${o.note ? `<div class="list-item"><div class="grow"><div class="s">${t('notes')}</div><div class="t">${esc(o.note)}</div></div></div>` : ''}
          ${o.items.map(i => `<div class="list-item"><div class="grow"><div class="t">${esc(i.name)}</div><div class="s">${i.qty} ${unitLabel(i.unit)} × ${rm(i.price)}</div></div><b>${rm(i.subtotal)}</b></div>`).join('')}
          <div class="list-item"><div class="grow t">${t('total')}</div><b style="font-size:20px">${rm(o.total)}</b></div>
        </div>
        <a class="btn wa block mt" target="_blank" rel="noopener" href="${Notify.waLink(o.buyerPhone, Notify.statusMessage(o))}">${icon('phone', 18)} ${t('notifyBuyer')}</a>`,
    });
  },

  qty: el => {
    const inp = document.getElementById('q_' + el.dataset.id);
    inp.value = Math.min(+inp.max, Math.max(1, (+inp.value || 1) + +el.dataset.d));
  },
  addCart: el => {
    const p = Store.pool(el.dataset.id), inp = document.getElementById('q_' + p.id);
    const q = Math.min(availableQty(p), Math.max(1, +inp.value || 1));
    state.cart[p.id] = q; saveCart(); toast(`${t('added')}: ${p.species} × ${q}`); render();
  },
  removeCart: el => { delete state.cart[el.dataset.id]; saveCart(); closeModal(); render(); if (cartCount()) openCheckout(); },
  checkout: () => openCheckout(),
  goMyOrders: () => { closeModal(); state.view = 'myOrders'; render(); },
  buyerCancel: el => {
    const o = D().orders.find(x => x.id === el.dataset.id);
    if (!confirm(t('cancelOrder') + ' ' + o.no + '?')) return;
    o.status = 'cancelled'; Notify.inApp('boss', `❌ ${o.no} ${t('st_cancelled')}`, o.buyerName);
    Store.log(`${me().name} membatalkan ${o.no}`); Store.save(); render();
  },

  addUser: () => openModal({
    title: t('addUser'), body: userForm({ role: 'worker' }),
    onSubmit: f => {
      if (D().users.some(u => u.username === f.username)) { toast(t('usernameTaken'), 'err'); return false; }
      D().users.push({ id: uid('u'), ...f }); Store.save(); toast(t('saved')); render();
    },
  }),
  editUser: el => {
    const u = Store.user(el.dataset.id);
    openModal({ title: t('edit'), body: userForm(u), onSubmit: f => {
      if (D().users.some(x => x.username === f.username && x.id !== u.id)) { toast(t('usernameTaken'), 'err'); return false; }
      Object.assign(u, f); Store.save(); toast(t('saved')); render();
    } });
  },
  delUser: el => {
    if (el.dataset.id === me().id) return toast(t('cantDeleteSelf'), 'err');
    if (!confirm(t('confirmDelete'))) return;
    D().users = D().users.filter(u => u.id !== el.dataset.id); Store.save(); toast(t('deleted')); render();
  },

  testNotif: async () => {
    const msg = `🔔 Ujian notifikasi dari ${D().settings.businessName} — ${new Date().toLocaleString()}`;
    Notify.inApp('boss', t('testNotif'), msg);
    const sent = await Notify.sendExternal(msg);
    if (sent.length) toast(`${t('notifSentTo')}: ${sent.join(' + ')}`);
    else { toast('API key / token ?', 'warn'); window.open(Notify.waLink(D().settings.bossPhone, msg), '_blank'); }
    render();
  },
  backup: () => downloadFile(`tasbeeh-backup-${todayStr()}.json`, JSON.stringify(D(), null, 2), 'application/json'),
  resetDemo: () => { if (confirm(t('resetConfirm'))) { const sid = Store.session; Store.reset(); if (!Store.user(sid?.id)) Store.session = null; render(); toast(t('saved')); } },
  print: () => window.print(),
  export: el => {
    const d = D(), k = el.dataset.v;
    if (k === 'pools') downloadFile(`kolam-${todayStr()}.csv`, toCsv([[t('pool'), t('species'), t('fishCount'), t('capacity'), t('pricePerFish'), t('unit'), t('status')], ...d.pools.map(p => [p.name, p.species, p.count, p.capacity, p.price, p.unit, p.status])]));
    if (k === 'orders') downloadFile(`tempahan-${todayStr()}.csv`, toCsv([[t('orderNo'), t('date'), t('customer'), t('phone'), t('items'), t('total'), t('method'), t('status')], ...d.orders.map(o => [o.no, o.date.slice(0, 10), o.buyerName, o.buyerPhone, o.items.map(i => `${i.name} x${i.qty}`).join('; '), o.total, o.method, o.status])]));
    if (k === 'stock') downloadFile(`stok-${todayStr()}.csv`, toCsv([[t('date'), t('pool'), t('type'), t('quantity'), t('reason'), t('by')], ...d.stockLogs.map(s => [s.date.slice(0, 10), poolName(s.poolId), s.type, s.qty, s.note, userName(s.by)])]));
  },
};

// ---------- events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) {
    if (state.notifOpen && !e.target.closest('.notif-panel')) { state.notifOpen = false; render(); }
    return;
  }
  const fn = ACTIONS[el.dataset.act];
  if (!fn) return;
  if (el.tagName === 'A' && !el.target) e.preventDefault();
  if (el.dataset.act !== 'closeModalBack') e.stopPropagation();
  fn(el, e);
});

document.addEventListener('input', e => {
  const k = e.target.dataset.filter;
  if (k) { state[k] = e.target.value; render(); }
});

document.addEventListener('change', e => {
  const k = e.target.dataset.change;
  if (k) { state[k] = e.target.value; render(); }
  if (e.target.id === 'stock-type') $('#to-pool').style.display = e.target.value === 'transfer' ? '' : 'none';
  if (e.target.id === 'co-method') $('#co-address').style.display = e.target.value === 'delivery' ? '' : 'none';
  if (e.target.id === 'restore-file' && e.target.files[0]) {
    const r = new FileReader();
    r.onload = () => {
      try { const data = JSON.parse(r.result); if (!data.users || !data.pools) throw 0; Store.data = data; Store.save(); toast(t('saved')); render(); }
      catch (err) { toast('Invalid file', 'err'); }
    };
    r.readAsText(e.target.files[0]);
  }
});

document.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const f = Object.fromEntries(new FormData(form));
  if (form.id === 'modal-form') {
    if (modalSubmit && modalSubmit(f, form) !== false) { if ($('#modal-form') === form) closeModal(); }
    return;
  }
  if (form.id === 'login-form') {
    const u = D().users.find(x => x.username === f.username.trim() && x.password === f.password && x.role === state.loginRole);
    if (!u) return toast(t('invalidLogin'), 'err');
    Store.session = { id: u.id }; state.view = defaultView(u.role); render();
    toast(`${t('welcome')}, ${u.name}!`);
  }
  if (form.id === 'register-form') {
    if (D().users.some(x => x.username === f.username.trim())) return toast(t('usernameTaken'), 'err');
    const u = { id: uid('u'), name: f.name.trim(), username: f.username.trim(), password: f.password, phone: f.phone.trim(), role: 'buyer' };
    D().users.push(u); Store.log(`Pembeli baru mendaftar: ${u.name}`); Store.save();
    Store.session = { id: u.id }; state.registerMode = false; render(); toast(t('registered'));
  }
  if (form.id === 'settings-form') {
    Object.assign(D().settings, { ...f, lowStock: +f.lowStock || 0 });
    Store.save(); toast(t('saved')); render();
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// keep data in sync across tabs (e.g. buyer orders in one tab, boss sees it in another)
window.addEventListener('storage', e => {
  if (e.key === DB_KEY) {
    const before = Store.data.orders.length;
    Store.load();
    if (isBoss() && Store.data.orders.length > before) toast('🔔 ' + t('newOrderNotif'));
    if (!$('#modal-form')) render();
  }
});

setLang(LANG);
render();
