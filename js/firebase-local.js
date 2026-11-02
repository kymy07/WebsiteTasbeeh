// Local stand-in for the Firebase compat SDK (auth + realtime database), backed by localStorage.
// Used automatically while js/firebase-config.js has no apiKey, so the app runs offline with the same code path.
const FirebaseLocal = (() => {
  const DB_KEY = 'fishfarm_local_db', AUTH_KEY = 'fishfarm_local_accounts', USER_KEY = 'fishfarm_local_user';
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const clone = v => v == null ? null : JSON.parse(JSON.stringify(v));
  const parts = p => String(p || '').split('/').filter(Boolean);

  let tree = read(DB_KEY, {});
  const listeners = new Set();

  function getAt(path) { let n = tree; for (const k of parts(path)) { if (n == null || typeof n !== 'object') return null; n = n[k]; } return n ?? null; }
  function setAt(path, val) {
    const ks = parts(path);
    if (!ks.length) { tree = val == null ? {} : clone(val); return; }
    let n = tree;
    ks.slice(0, -1).forEach(k => { if (n[k] == null || typeof n[k] !== 'object') n[k] = {}; n = n[k]; });
    const last = ks[ks.length - 1];
    if (val == null) delete n[last]; else n[last] = clone(val);
  }
  function commit() { write(DB_KEY, tree); notify(); }
  function notify() { listeners.forEach(l => l.fire()); }
  window.addEventListener('storage', e => { if (e.key === DB_KEY) { tree = read(DB_KEY, {}); notify(); } });

  const snap = v => ({ val: () => clone(v), exists: () => v != null });

  function makeRef(path, query) {
    const value = () => {
      const v = getAt(path);
      if (!query || v == null) return v;
      const out = {};
      Object.entries(v).forEach(([k, r]) => { if (r && r[query.child] === query.equalTo) out[k] = r; });
      return Object.keys(out).length ? out : null;
    };
    const own = [];
    return {
      orderByChild: child => ({ equalTo: eq => makeRef(path, { child, equalTo: eq }) }),
      on(evt, cb) {
        const l = { last: undefined, fire() { const v = value(), j = JSON.stringify(v); if (j !== l.last) { l.last = j; cb(snap(v)); } } };
        listeners.add(l); own.push(l); setTimeout(() => l.fire(), 0);
        return cb;
      },
      off() { own.forEach(l => listeners.delete(l)); own.length = 0; },
      once() { return Promise.resolve(snap(value())); },
      set(v) { setAt(path, v); commit(); return Promise.resolve(); },
      update(obj) { Object.entries(obj).forEach(([k, v]) => setAt(parts(path).concat(parts(k)).join('/'), v)); commit(); return Promise.resolve(); },
    };
  }

  function makeAuth(persist) {
    let current = persist ? read(USER_KEY, null) : null;
    const subs = [];
    const emit = () => subs.forEach(cb => cb(current));
    const setUser = u => { current = u; if (persist) write(USER_KEY, u); setTimeout(emit, 0); return { user: u }; };
    const err = code => Promise.reject({ code, message: code });
    return {
      onAuthStateChanged(cb) { subs.push(cb); setTimeout(() => cb(current), 0); return () => subs.splice(subs.indexOf(cb), 1); },
      setPersistence(p) { if (p === 'NONE') persist = false; return Promise.resolve(); },
      signInWithEmailAndPassword(email, password) {
        const acc = read(AUTH_KEY, {})[email];
        if (!acc || acc.password !== password) return err('auth/invalid-credential');
        return Promise.resolve(setUser({ uid: acc.uid, email }));
      },
      createUserWithEmailAndPassword(email, password) {
        const accs = read(AUTH_KEY, {});
        if (accs[email]) return err('auth/email-already-in-use');
        if (String(password).length < 6) return err('auth/weak-password');
        accs[email] = { uid: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8), password };
        write(AUTH_KEY, accs);
        return Promise.resolve(setUser({ uid: accs[email].uid, email }));
      },
      signOut() { setUser(null); return Promise.resolve(); },
      changePassword(email, current, next) {
        const accs = read(AUTH_KEY, {});
        if (!accs[email] || accs[email].password !== current) return err('auth/invalid-credential');
        if (String(next).length < 6) return err('auth/weak-password');
        accs[email].password = next; write(AUTH_KEY, accs);
        return Promise.resolve();
      },
    };
  }

  const apps = [];
  function initializeApp(config, name = '[DEFAULT]') {
    const app = { name, _auth: makeAuth(name === '[DEFAULT]'), auth() { return this._auth; }, database() { return { ref: p => makeRef(p) }; } };
    apps.push(app);
    return app;
  }
  const def = () => apps.find(a => a.name === '[DEFAULT]');
  const auth = () => def().auth();
  auth.Auth = { Persistence: { NONE: 'NONE', LOCAL: 'LOCAL' } };
  return { initializeApp, apps, auth, database: () => def().database(), local: true };
})();
