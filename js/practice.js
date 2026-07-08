/* AQ.practice — lightweight compatibility module. */
window.AQ = window.AQ || {};
AQ.practice = AQ.practice || {
  steps: function (m) { const meta = m && m.meta; return meta ? (AQ.lang === 'ar' ? meta.objAr : meta.objEn) || [] : []; },
  state: function () { return { done: [] }; },
  progress: function () { return 0; },
  toggle: function () {}
};
