/* AQ.maint — local maintenance task store. */
window.AQ = window.AQ || {};
AQ.maint = AQ.maint || (function () {
  const key = 'aq_maint';
  const all = () => (AQ.store && AQ.store.json ? AQ.store.json(key, []) : []);
  const save = list => { if (AQ.store) AQ.store.set(key, JSON.stringify(list)); };
  return {
    all,
    counts: () => { const l = all(); return { open: l.filter(x => x.status !== 'done').length, done: l.filter(x => x.status === 'done').length }; },
    add: x => { const l = all(); l.unshift({ id: Date.now().toString(36), status: 'open', priority: 'med', ...x }); save(l); },
    update: (id, p) => { const l = all(); const x = l.find(t => t.id === id); if (x) Object.assign(x, p); save(l); },
    remove: id => save(all().filter(x => x.id !== id))
  };
})();
