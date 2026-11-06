// Data layer — Firebase Realtime Database + Firebase Authentication
// Layout: /meta, /settings, /users/{uid}, /pools/{id}, /water/{id}, /feeding/{id},
//         /stockLogs/{id}, /orders/{id}, /tasks/{id}, /notifications/{id}, /activity/{id}
const COLLECTIONS = ['users', 'pools', 'water', 'feeding', 'stockLogs', 'orders', 'tasks', 'notifications', 'activity'];
const STAFF = ['boss', 'worker'];
const EMAIL_DOMAIN = '@fishfarm.app';

const uid = (p = '') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const daysAgo = (n, h = 9) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, 0, 0, 0); return d.toISOString(); };
const todayStr = () => new Date().toISOString().slice(0, 10);
// Shared demo login: admin / 1234 on any portal tab. Each role needs its own Firebase account,
// and Firebase requires 6+ character passwords, so it maps to internal credentials.
const SHARED_USER = 'admin', SHARED_PASSWORD = '1234', SHARED_AUTH_PASSWORD = 'fishfarm-admin-1234', SHARED_ROLES = ['boss', 'worker', 'buyer'];
const isSharedAccount = username => SHARED_ROLES.some(r => username === SHARED_USER + '.' + r);
const emailOf = username => String(username).trim().toLowerCase().replace(/[^a-z0-9._-]/g, '') + EMAIL_DOMAIN;

const DEFAULT_SETTINGS = { businessName: 'XXX Fish Farm', location: '', bossPhone: '', callmebotKey: '', telegramToken: '', telegramChatId: '', lowStock: 200, planNotes: '',
  regNo: '', address: '', email: '', officePhone: '',
  phMin: 6.5, phMax: 8.5, tempMin: 24, tempMax: 32, doMin: 5, nh3Max: 0.5, fcrGood: 1.5, fcrFair: 2 };
const NUMERIC_SETTINGS = ['lowStock', 'phMin', 'phMax', 'tempMin', 'tempMax', 'doMin', 'nh3Max', 'fcrGood', 'fcrFair'];
const emptyData = () => ({ ...Object.fromEntries(COLLECTIONS.map(k => [k, []])), settings: { ...DEFAULT_SETTINGS } });

// The farm's 21 cages as recorded on 27/10/2026: [cage no, fish count, average size in grams]
const PLAN_RECORD_DATE = '2026-10-27';
const PLAN_CAGE_DATA = [[1, 1300, 25], [2, 1300, 25], [3, 1300, 25], [4, 0, 0], [5, 0, 0], [6, 0, 0], [7, 0, 0], [8, 0, 0], [9, 0, 0], [10, 1300, 210], [11, 1300, 200],
  [12, 1300, 190], [13, 1300, 150], [14, 313, 250], [15, 1139, 180], [16, 1300, 200], [17, 1300, 180], [18, 1300, 25], [19, 1300, 25], [20, 600, 25], [21, 1300, 25]];
const planCages = () => PLAN_CAGE_DATA.map(([no, count, g]) => ({
  id: 'cage' + String(no).padStart(2, '0'), cageNo: no, name: 'Sangkar ' + no, species: '-', count, capacity: 1500, price: 0, unit: 'fish', avgWeight: g / 1000,
  status: count ? 'active' : 'empty', forSale: false, stockedDate: '', harvestDate: '', notes: '', ageMin: '', ageMax: '', ageUnit: 'month', stockCount: 0, stockWeight: 0, recordDate: PLAN_RECORD_DATE,
}));

// Sample operational data (no user accounts — those live in Firebase Auth)
function seedData(bossId) {
  const pools = [
    { id: 'p1', ageMin: 3, ageMax: 4, ageUnit: 'week', stockCount: 2000, stockWeight: 0.01, name: 'Kolam A1', species: 'Tilapia Merah', emoji: '🐟', count: 1850, capacity: 2500, price: 14, unit: 'kg', avgWeight: 0.5, status: 'active', forSale: true, stockedDate: daysAgo(120).slice(0, 10), harvestDate: daysAgo(-20).slice(0, 10), notes: '' },
    { id: 'p2', ageMin: 2, ageMax: 3, ageUnit: 'week', stockCount: 3500, stockWeight: 0.005, name: 'Kolam A2', species: 'Keli', emoji: '🐠', count: 3200, capacity: 3500, price: 9, unit: 'kg', avgWeight: 0.35, status: 'active', forSale: true, stockedDate: daysAgo(90).slice(0, 10), harvestDate: daysAgo(-10).slice(0, 10), notes: '' },
    { id: 'p3', ageMin: 1, ageMax: 2, ageUnit: 'month', stockCount: 700, stockWeight: 0.02, name: 'Kolam B1', species: 'Patin', emoji: '🐡', count: 640, capacity: 1200, price: 16, unit: 'kg', avgWeight: 1.4, status: 'active', forSale: true, stockedDate: daysAgo(200).slice(0, 10), harvestDate: daysAgo(-5).slice(0, 10), notes: '' },
    { id: 'p4', ageMin: 30, ageMax: 45, ageUnit: 'day', stockCount: 3000, stockWeight: 0.002, name: 'Kolam B2', species: 'Udang Galah', emoji: '🦐', count: 2600, capacity: 4000, price: 55, unit: 'kg', avgWeight: 0.06, status: 'active', forSale: true, stockedDate: daysAgo(100).slice(0, 10), harvestDate: daysAgo(-30).slice(0, 10), notes: '' },
    { id: 'p5', ageMin: 1, ageMax: 2, ageUnit: 'month', stockCount: 100, stockWeight: 0.01, name: 'Kolam C1', species: 'Lampam Jawa', emoji: '🐟', count: 90, capacity: 1500, price: 12, unit: 'kg', avgWeight: 0.3, status: 'active', forSale: true, stockedDate: daysAgo(150).slice(0, 10), harvestDate: '', notes: '' },
    { id: 'p6', ageMin: '', ageMax: '', ageUnit: 'month', stockCount: 0, stockWeight: 0, name: 'Kolam C2', species: '-', emoji: '🐟', count: 0, capacity: 2000, price: 0, unit: 'fish', avgWeight: 0, status: 'maintenance', forSale: false, stockedDate: '', harvestDate: '', notes: 'Cuci & keringkan kolam' },
  ];
  const water = [], feeding = [];
  pools.filter(p => p.status === 'active').forEach(p => {
    for (let d = 3; d >= 0; d--) water.push({ id: uid('w'), poolId: p.id, temp: +(27 + Math.random() * 3).toFixed(1), ph: +(6.9 + Math.random() * 0.9).toFixed(1), oxygen: +(5.2 + Math.random() * 2).toFixed(1), ammonia: +(0.1 + Math.random() * 0.2).toFixed(2), by: bossId, date: daysAgo(d, 8) });
    for (let d = 2; d >= 0; d--) feeding.push({ id: uid('f'), poolId: p.id, feedType: 'Pelet 3mm', kg: +(p.count / 400).toFixed(1), by: bossId, date: daysAgo(d, 8) });
  });
  water.push({ id: uid('w'), poolId: 'p2', temp: 31.5, ph: 6.2, oxygen: 4.1, ammonia: 0.7, by: bossId, date: new Date().toISOString() });

  const stockLogs = [
    { id: uid('s'), poolId: 'p1', type: 'in', qty: 2000, note: 'Benih baru', by: bossId, date: daysAgo(120) },
    { id: uid('s'), poolId: 'p1', type: 'mortality', qty: 30, note: 'Cuaca panas', by: bossId, date: daysAgo(6) },
    { id: uid('s'), poolId: 'p3', type: 'out', qty: 40, note: 'Jualan pasar', by: bossId, date: daysAgo(4) },
  ];
  // weekly feed history since stocking, sized for a realistic FCR (~1.3–1.8)
  pools.filter(p => p.status === 'active' && p.stockedDate).forEach(p => {
    const days = Math.floor((Date.now() - new Date(p.stockedDate)) / 864e5) - 4;
    const weeks = Math.max(1, Math.floor(days / 7));
    const gain = p.count * p.avgWeight - p.stockCount * p.stockWeight;
    const recent = feeding.filter(f => f.poolId === p.id).reduce((s, f) => s + f.kg, 0);
    const kg = Math.max(0, gain * (1.3 + Math.random() * 0.5) - recent) / weeks;
    for (let i = 0; i < weeks; i++) feeding.push({ id: uid('f') + i, poolId: p.id, feedType: 'Pelet (rekod mingguan)', kg: +kg.toFixed(1), by: bossId, date: daysAgo(4 + i * 7, 8) });
  });
  const mk = (n, poolId, qty, status, d) => {
    const p = pools.find(x => x.id === poolId), sub = +(qty * p.price).toFixed(2);
    return { id: 'o_demo' + n, no: 'TB-DEMO' + n, buyerId: 'demo_buyer', buyerName: 'Siti (demo)', buyerPhone: '60133333333',
      items: [{ poolId, name: p.species, qty, unit: p.unit, price: p.price, subtotal: sub }], total: sub,
      method: 'pickup', address: '', pickupDate: daysAgo(-1).slice(0, 10), note: '', status, date: daysAgo(d, 11), stockDeducted: status !== 'pending' };
  };
  const orders = [mk(1, 'p1', 20, 'completed', 6), mk(2, 'p3', 15, 'completed', 5), mk(3, 'p2', 30, 'completed', 3), mk(4, 'p4', 5, 'confirmed', 1), mk(5, 'p1', 12, 'pending', 0)];
  const tasks = [
    { id: uid('t'), title: 'Tukar air Kolam A2 (50%)', poolId: 'p2', assignee: bossId, due: todayStr(), priority: 'high', done: false, createdAt: daysAgo(0) },
    { id: uid('t'), title: 'Bersihkan penapis Kolam B1', poolId: 'p3', assignee: bossId, due: todayStr(), priority: 'normal', done: false, createdAt: daysAgo(0) },
  ];
  return { pools: pools.concat(planCages()), water, feeding, stockLogs, orders, tasks, activity: [{ id: uid('a'), text: 'Data demo dimuatkan', date: new Date().toISOString() }] };
}

const Store = {
  data: emptyData(),
  snap: {},              // last-synced JSON per record, used to diff local changes
  uid: null,
  meta: null,            // public /meta (null until loaded)
  ready: false,          // auth state resolved and initial data loaded
  configured: typeof FIREBASE_CONFIG !== 'undefined' && !/PASTE_/.test(FIREBASE_CONFIG.apiKey) && typeof firebase !== 'undefined',
  refs: [],
  pending: null,         // profile to create right after sign-up
  expectRole: null,      // role chosen on the login screen
  onChange: () => {},
  onNewOrders: () => {},
  onError: () => {},

  init() {
    // Real Firebase when configured, otherwise the localStorage stand-in (js/firebase-local.js)
    this.fb = this.configured ? firebase : FirebaseLocal;
    this.fb.initializeApp(FIREBASE_CONFIG);
    const firebase_ = this.fb;
    this.db = firebase_.database();
    this.auth = firebase_.auth();
    this.db.ref('meta').on('value', s => { this.meta = s.val() || {}; this.changed(); }, e => this.onError(e));
    this.auth.onAuthStateChanged(u => this.handleAuth(u).catch(e => { this.onError(e); this.ready = true; this.changed(); }));
  },

  changed() { clearTimeout(this._t); this._t = setTimeout(() => this.onChange(), 30); },

  detach() { this.refs.forEach(r => r.off()); this.refs = []; },

  async handleAuth(u) {
    this.detach();
    this.data = emptyData(); this.snap = {};
    this.uid = u ? u.uid : null;
    if (!u) { this.ready = true; this.changed(); return; }
    this.ready = false; this.changed();

    let prof = (await this.db.ref('users/' + u.uid).once('value')).val();
    if (!prof && this.pending) {
      prof = { ...this.pending.profile, id: u.uid };
      const up = { ['users/' + u.uid]: prof };
      if (this.pending.setup) { up['meta/initialized'] = true; up['meta/name'] = this.pending.businessName || DEFAULT_SETTINGS.businessName; }
      await this.db.ref().update(up);
    }
    const setup = this.pending && this.pending.setup, seed = setup && this.pending.seed, bizName = setup && this.pending.businessName;
    this.pending = null;
    if (!prof || (this.expectRole && prof.role !== this.expectRole)) {
      this.expectRole = null;
      this.onError({ code: 'role-mismatch' });
      return this.auth.signOut();
    }
    this.expectRole = null;

    const staff = STAFF.includes(prof.role), db = this.db;
    const sources = { pools: db.ref('pools'), settings: db.ref('settings') };
    if (staff) ['users', 'water', 'feeding', 'stockLogs', 'orders', 'tasks', 'notifications', 'activity'].forEach(k => sources[k] = db.ref(k));
    else {
      sources.users = db.ref('users/' + u.uid);
      sources.orders = db.ref('orders').orderByChild('buyerId').equalTo(u.uid);
      sources.notifications = db.ref('notifications').orderByChild('to').equalTo(u.uid);
    }
    const waiting = new Set(Object.keys(sources));
    await new Promise(resolve => {
      Object.entries(sources).forEach(([k, ref]) => {
        ref.on('value', s => {
          let v = s.val();
          if (k === 'users' && !staff) v = v ? { [u.uid]: v } : {};
          this.apply(k, v, !waiting.has(k) && staff);
          waiting.delete(k);
          if (!waiting.size) resolve();
        }, e => { console.warn(k, e); waiting.delete(k); if (!waiting.size) resolve(); });
        this.refs.push(ref);
      });
    });
    if (setup) {
      this.data.settings.bossPhone = prof.phone || '';
      if (bizName) this.data.settings.businessName = bizName;
      if (seed) Object.assign(this.data, seedData(this.uid));
      await this.save();
    }
    this.ready = true; this.changed();
  },

  apply(key, val, detectNew) {
    if (key === 'settings') {
      this.data.settings = { ...DEFAULT_SETTINGS, ...(val || {}) };
      this.snap.settings = JSON.stringify(this.data.settings);
    } else {
      const prev = this.snap[key] || {};
      const arr = Object.entries(val || {}).map(([id, r]) => ({ ...r, id: r.id || id }));
      if (key === 'activity' || key === 'notifications') arr.sort((a, b) => b.date.localeCompare(a.date));
      this.data[key] = arr;
      this.snap[key] = Object.fromEntries(arr.map(r => [r.id, JSON.stringify(r)]));
      if (key === 'orders' && detectNew) {
        const fresh = arr.filter(o => !prev[o.id] && o.status === 'pending');
        if (fresh.length) this.onNewOrders(fresh);
      }
    }
    if (this.ready) this.changed();
  },

  // Push every locally changed / deleted record to Firebase in one multi-path update
  save() {
    if (!this.db || !this.uid) return Promise.resolve();
    const up = {};
    COLLECTIONS.forEach(k => {
      const prev = this.snap[k] || {}, cur = {};
      (this.data[k] || []).forEach(r => {
        const j = JSON.stringify(r); cur[r.id] = j;
        if (prev[r.id] !== j) up[k + '/' + r.id] = JSON.parse(j);
      });
      Object.keys(prev).forEach(id => { if (!(id in cur)) up[k + '/' + id] = null; });
      this.snap[k] = cur;
    });
    const sj = JSON.stringify(this.data.settings);
    if (sj !== this.snap.settings) { up.settings = JSON.parse(sj); this.snap.settings = sj; }
    if (!Object.keys(up).length) return Promise.resolve();
    return this.db.ref().update(up).catch(e => { console.error(e); this.onError(e); });
  },

  reseed() {
    Object.assign(this.data, seedData(this.uid), { notifications: [] });
    return this.save();
  },

  login(username, password, role) {
    this.expectRole = role;
    if (String(username).trim().toLowerCase() === SHARED_USER && password === SHARED_PASSWORD) {
      return this.auth.signInWithEmailAndPassword(emailOf(SHARED_USER + '.' + role), SHARED_AUTH_PASSWORD);
    }
    return this.auth.signInWithEmailAndPassword(emailOf(username), password);
  },
  logout() { return this.auth.signOut(); },

  // Self sign-up (buyer) or first-time Boss setup
  register(profile, password, setup = false, seed = false, businessName = '') {
    this.pending = { profile: { ...profile, username: profile.username.trim().toLowerCase() }, setup, seed, businessName };
    return this.auth.createUserWithEmailAndPassword(emailOf(profile.username), password)
      .catch(e => { this.pending = null; throw e; });
  },

  // Secondary app instance, so the Boss can create accounts without being signed out
  async secondaryApp() {
    const fb = this.fb;
    const sec = fb.apps.find(a => a.name === 'secondary') || fb.initializeApp(FIREBASE_CONFIG, 'secondary');
    await sec.auth().setPersistence(fb.auth.Auth.Persistence.NONE);
    return sec;
  },

  async createAccount(profile, password) {
    const sec = await this.secondaryApp();
    const cred = await sec.auth().createUserWithEmailAndPassword(emailOf(profile.username), password);
    await sec.auth().signOut();
    const u = { ...profile, username: profile.username.trim().toLowerCase(), id: cred.user.uid };
    this.data.users.push(u);
    await this.save();
    return u;
  },

  sharedAccountsReady() { return SHARED_ROLES.every(r => this.data.users.some(u => u.username === SHARED_USER + '.' + r)); },

  // Boss only: creates (or re-links) the internal accounts behind admin / 1234
  async enableSharedAccounts() {
    const sec = await this.secondaryApp();
    for (const role of SHARED_ROLES) {
      const username = SHARED_USER + '.' + role;
      if (this.data.users.some(u => u.username === username)) continue;
      const email = emailOf(username);
      const cred = await sec.auth().createUserWithEmailAndPassword(email, SHARED_AUTH_PASSWORD).catch(e => {
        if (e.code === 'auth/email-already-in-use') return sec.auth().signInWithEmailAndPassword(email, SHARED_AUTH_PASSWORD);
        throw e;
      });
      await sec.auth().signOut();
      this.data.users.push({ id: cred.user.uid, name: 'Admin', username, phone: '', role });
    }
    return this.save();
  },

  // Public business name (readable before login, so it lives in /meta)
  bizName() { return (this.meta && this.meta.name) || this.data.settings.businessName || DEFAULT_SETTINGS.businessName; },

  // Public branding (name, logo, theme colour) lives in /meta so the login page can show it
  setMeta(key, val) { return this.db.ref('meta/' + key).set(val).catch(e => this.onError(e)); },

  async changePassword(current, next) {
    const email = emailOf(this.user(this.uid).username);
    if (this.fb.local) return this.auth.changePassword(email, current, next);
    const u = this.auth.currentUser;
    await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email, current));
    return u.updatePassword(next);
  },

  user(id) { return this.data.users.find(u => u.id === id); },
  pool(id) { return this.data.pools.find(p => p.id === id); },
  log(text) { this.data.activity.unshift({ id: uid('a'), text, date: new Date().toISOString() }); this.data.activity = this.data.activity.slice(0, 200); },
};
