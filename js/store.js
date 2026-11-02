// Simple localStorage database
const DB_KEY = 'tasbeeh_db_v1';

const uid = (p = '') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const daysAgo = (n, h = 9) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(h, 0, 0, 0); return d.toISOString(); };
const todayStr = () => new Date().toISOString().slice(0, 10);

function seed() {
  const users = [
    { id: 'u_boss', name: 'Encik Tasbeeh', username: 'boss', password: 'boss123', role: 'boss', phone: '60123456789' },
    { id: 'u_w1', name: 'Ali Pekerja', username: 'pekerja', password: 'pekerja123', role: 'worker', phone: '60111111111' },
    { id: 'u_w2', name: 'Rahim', username: 'rahim', password: 'rahim123', role: 'worker', phone: '60122222222' },
    { id: 'u_b1', name: 'Siti Pembeli', username: 'pembeli', password: 'pembeli123', role: 'buyer', phone: '60133333333' },
  ];
  const pools = [
    { id: 'p1', name: 'Kolam A1', species: 'Tilapia Merah', emoji: '🐟', count: 1850, capacity: 2500, price: 14, unit: 'kg', avgWeight: 0.5, status: 'active', forSale: true, stockedDate: daysAgo(120).slice(0,10), harvestDate: daysAgo(-20).slice(0,10), notes: '' },
    { id: 'p2', name: 'Kolam A2', species: 'Keli', emoji: '🐠', count: 3200, capacity: 3500, price: 9, unit: 'kg', avgWeight: 0.35, status: 'active', forSale: true, stockedDate: daysAgo(90).slice(0,10), harvestDate: daysAgo(-10).slice(0,10), notes: '' },
    { id: 'p3', name: 'Kolam B1', species: 'Patin', emoji: '🐡', count: 640, capacity: 1200, price: 16, unit: 'kg', avgWeight: 1.4, status: 'active', forSale: true, stockedDate: daysAgo(200).slice(0,10), harvestDate: daysAgo(-5).slice(0,10), notes: '' },
    { id: 'p4', name: 'Kolam B2', species: 'Udang Galah', emoji: '🦐', count: 2600, capacity: 4000, price: 55, unit: 'kg', avgWeight: 0.06, status: 'active', forSale: true, stockedDate: daysAgo(100).slice(0,10), harvestDate: daysAgo(-30).slice(0,10), notes: '' },
    { id: 'p5', name: 'Kolam C1', species: 'Lampam Jawa', emoji: '🐟', count: 90, capacity: 1500, price: 12, unit: 'kg', avgWeight: 0.3, status: 'active', forSale: true, stockedDate: daysAgo(150).slice(0,10), harvestDate: '', notes: '' },
    { id: 'p6', name: 'Kolam C2', species: '-', emoji: '🐟', count: 0, capacity: 2000, price: 0, unit: 'fish', avgWeight: 0, status: 'maintenance', forSale: false, stockedDate: '', harvestDate: '', notes: 'Cuci & keringkan kolam' },
  ];
  const water = [];
  pools.filter(p => p.status === 'active').forEach((p, i) => {
    for (let d = 3; d >= 0; d--) water.push({ id: uid('w'), poolId: p.id, temp: +(27 + Math.random() * 3).toFixed(1), ph: +(6.9 + Math.random() * 0.9).toFixed(1), oxygen: +(5.2 + Math.random() * 2).toFixed(1), ammonia: +(0.1 + Math.random() * 0.2).toFixed(2), by: 'u_w1', date: daysAgo(d, 8) });
  });
  water.push({ id: uid('w'), poolId: 'p2', temp: 31.5, ph: 6.2, oxygen: 4.1, ammonia: 0.7, by: 'u_w1', date: new Date().toISOString() });

  const feeding = [];
  pools.filter(p => p.status === 'active').forEach(p => {
    for (let d = 2; d >= 0; d--) { feeding.push({ id: uid('f'), poolId: p.id, feedType: 'Pelet 3mm', kg: +(p.count / 400).toFixed(1), by: 'u_w1', date: daysAgo(d, 8) }); }
  });

  const stockLogs = [
    { id: uid('s'), poolId: 'p1', type: 'in', qty: 2000, note: 'Benih baru', by: 'u_boss', date: daysAgo(120) },
    { id: uid('s'), poolId: 'p1', type: 'mortality', qty: 30, note: 'Cuaca panas', by: 'u_w1', date: daysAgo(6) },
    { id: uid('s'), poolId: 'p2', type: 'mortality', qty: 12, note: '', by: 'u_w1', date: daysAgo(2) },
    { id: uid('s'), poolId: 'p3', type: 'out', qty: 40, note: 'Jualan pasar', by: 'u_boss', date: daysAgo(4) },
  ];

  const mk = (n, buyer, poolId, qty, status, d) => {
    const p = pools.find(x => x.id === poolId);
    const sub = +(qty * p.price).toFixed(2);
    return { id: 'o' + n, no: 'TB' + String(1000 + n), buyerId: buyer.id, buyerName: buyer.name, buyerPhone: buyer.phone,
      items: [{ poolId, name: p.species, qty, unit: p.unit, price: p.price, subtotal: sub }], total: sub,
      method: 'pickup', address: '', pickupDate: daysAgo(-1).slice(0,10), note: '', status, date: daysAgo(d, 11) };
  };
  const b = users[3];
  const orders = [
    mk(1, b, 'p1', 20, 'completed', 6), mk(2, b, 'p3', 15, 'completed', 5), mk(3, b, 'p2', 30, 'completed', 3),
    mk(4, b, 'p4', 5, 'confirmed', 1), mk(5, b, 'p1', 12, 'pending', 0),
  ];
  // stock-out logs for orders that already deducted stock
  orders.filter(o => ['completed', 'confirmed'].includes(o.status)).forEach(o => o.stockDeducted = true);

  const tasks = [
    { id: uid('t'), title: 'Tukar air Kolam A2 (50%)', poolId: 'p2', assignee: 'u_w1', due: todayStr(), priority: 'high', done: false, createdAt: daysAgo(0) },
    { id: uid('t'), title: 'Bersihkan penapis Kolam B1', poolId: 'p3', assignee: 'u_w1', due: todayStr(), priority: 'normal', done: false, createdAt: daysAgo(0) },
    { id: uid('t'), title: 'Sediakan tempahan TB1004', poolId: 'p4', assignee: 'u_w2', due: todayStr(), priority: 'normal', done: false, createdAt: daysAgo(0) },
    { id: uid('t'), title: 'Kapur Kolam C2', poolId: 'p6', assignee: 'u_w2', due: daysAgo(1).slice(0,10), priority: 'low', done: true, createdAt: daysAgo(2) },
  ];

  return {
    users, pools, water, feeding, stockLogs, orders, tasks,
    notifications: [
      { id: uid('n'), to: 'boss', title: 'Tempahan baru TB1005', body: 'Siti Pembeli · Tilapia Merah x12', date: daysAgo(0, 11), read: false },
    ],
    activity: [
      { id: uid('a'), text: 'Siti Pembeli membuat tempahan TB1005', date: daysAgo(0, 11) },
      { id: uid('a'), text: 'Ali Pekerja merekod kualiti air Kolam A2', date: daysAgo(0, 8) },
      { id: uid('a'), text: 'Ali Pekerja merekod 12 kematian di Kolam A2', date: daysAgo(2, 10) },
    ],
    settings: { businessName: 'Tasbeeh Restaurant & Cafe — Fish Farm', location: '', bossPhone: '60123456789', callmebotKey: '', telegramToken: '', telegramChatId: '', lowStock: 200 },
  };
}

const Store = {
  data: null,
  load() {
    try { this.data = JSON.parse(localStorage.getItem(DB_KEY)); } catch (e) { this.data = null; }
    if (!this.data) { this.data = seed(); this.save(); }
    return this.data;
  },
  save() { localStorage.setItem(DB_KEY, JSON.stringify(this.data)); },
  reset() { this.data = seed(); this.save(); },
  get session() { try { return JSON.parse(localStorage.getItem('tasbeeh_session')); } catch (e) { return null; } },
  set session(v) { v ? localStorage.setItem('tasbeeh_session', JSON.stringify(v)) : localStorage.removeItem('tasbeeh_session'); },
  user(id) { return this.data.users.find(u => u.id === id); },
  pool(id) { return this.data.pools.find(p => p.id === id); },
  log(text) { this.data.activity.unshift({ id: uid('a'), text, date: new Date().toISOString() }); this.data.activity = this.data.activity.slice(0, 200); },
};
Store.load();
