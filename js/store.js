/* AQ.store — safe localStorage wrapper with app-scoped keys and in-memory fallback */
window.AQ = window.AQ || {};

/*
  GitHub Pages serves all repositories for the same user under one origin
  (for example: username.github.io/repo-a and username.github.io/repo-b).
  localStorage and CacheStorage are origin-wide, so unscoped keys can collide
  between Aqwat deployments. Keep this app isolated under its own namespace.
*/
AQ.APP_ID = 'aqwat-p118-system';
AQ.KEY_PREFIX = 'aq:' + AQ.APP_ID + ':';

AQ.store = (function () {
  let mem = {};
  const scoped = k => AQ.KEY_PREFIX + k;
  const legacy = k => k;

  function safeJSON(v, fb) {
    try { return JSON.parse(v) ?? fb; } catch (e) { return fb; }
  }

  try {
    const testKey = scoped('__test__');
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return {
      get: k => localStorage.getItem(scoped(k)) ?? localStorage.getItem(legacy(k)),
      set: (k, v) => localStorage.setItem(scoped(k), v),
      del: k => { localStorage.removeItem(scoped(k)); localStorage.removeItem(legacy(k)); },
      json: (k, fb) => safeJSON(localStorage.getItem(scoped(k)) ?? localStorage.getItem(legacy(k)), fb)
    };
  } catch (e) {
    return {
      get: k => mem[scoped(k)] ?? mem[legacy(k)] ?? null,
      set: (k, v) => { mem[scoped(k)] = String(v); },
      del: k => { delete mem[scoped(k)]; delete mem[legacy(k)]; },
      json: (k, fb) => safeJSON(mem[scoped(k)] ?? mem[legacy(k)], fb)
    };
  }
})();
