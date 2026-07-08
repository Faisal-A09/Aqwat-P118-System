/* AQ.search — lightweight placeholder for compatibility with the submitted shell. */
window.AQ = window.AQ || {};
AQ.search = AQ.search || {
  rebuild: function () {},
  query: function () { return []; },
  highlight: function (text) { return String(text || ''); }
};
