/* AQ.quiz — per-module quiz engine.
   State: AQ.store 'aq_quiz' = { moduleId: bestScorePct } */
window.AQ = window.AQ || {};

AQ.quiz = (function () {
  const wrap = () => document.getElementById('quizWrap');
  let cur = null; // {id, qs, i, correct, done}

  function scores() { return AQ.store.json('aq_quiz', {}); }
  function saveScore(id, pct) {
    const s = scores();
    if (!(id in s) || pct > s[id]) { s[id] = pct; AQ.store.set('aq_quiz', JSON.stringify(s)); }
  }
  function best(id) { const s = scores(); return (id in s) ? s[id] : null; }
  function passed(id) { const b = best(id); return b !== null && b >= AQ.PASS_MARK; }

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  function open(id, title) {
    const qs = AQ.QUIZZES[id];
    if (!qs) return;
    cur = { id, title, qs, i: 0, correct: 0, done: false };
    render();
    wrap().hidden = false;
  }
  function close() { wrap().hidden = true; wrap().innerHTML = ''; cur = null; if (AQ.onQuizClosed) AQ.onQuizClosed(); }

  function render() {
    const t = AQ.t, L = AQ.lang, w = wrap();
    if (cur.done) { renderResult(); return; }
    const q = cur.qs[cur.i][L] || cur.qs[cur.i].en;
    const n = cur.i + 1, total = cur.qs.length;
    w.innerHTML = `
      <div class="quizbox">
        <div class="qhead">
          <h3>${esc(cur.title)} · ${t('quizTitle')}</h3>
          <span class="qn">${n} ${t('qOf')} ${total}</span>
          <button class="qclose" aria-label="${t('qClose')}">✕</button>
        </div>
        <div class="qprog"><i style="width:${(cur.i / total) * 100}%"></i></div>
        <p class="qq">${esc(q.q)}</p>
        <div class="qopts">
          ${q.o.map((o, i) => `<button class="qopt" data-i="${i}">${esc(o)}</button>`).join('')}
        </div>
        <button class="qnext" disabled>${n === total ? t('qFinish') : t('qNext')}</button>
      </div>`;
    w.querySelector('.qclose').onclick = close;
    const nextBtn = w.querySelector('.qnext');
    let answered = false;
    w.querySelectorAll('.qopt').forEach(btn => btn.onclick = () => {
      if (answered) return;
      answered = true;
      const pick = +btn.dataset.i, c = cur.qs[cur.i].c;
      if (pick === c) { btn.classList.add('correct'); cur.correct++; }
      else { btn.classList.add('wrong'); w.querySelector(`.qopt[data-i="${c}"]`).classList.add('correct'); }
      w.querySelectorAll('.qopt').forEach(b => b.disabled = true);
      nextBtn.disabled = false;
      nextBtn.focus();
    });
    nextBtn.onclick = () => {
      cur.i++;
      if (cur.i >= cur.qs.length) { cur.done = true; finish(); }
      render();
    };
  }

  function finish() {
    const pct = Math.round((cur.correct / cur.qs.length) * 100);
    cur.pct = pct;
    saveScore(cur.id, pct);
    if (AQ.onQuizFinished) AQ.onQuizFinished(cur.id, pct);
  }

  function renderResult() {
    const t = AQ.t, w = wrap();
    const pass = cur.pct >= AQ.PASS_MARK;
    w.innerHTML = `
      <div class="quizbox">
        <div class="qhead">
          <h3>${esc(cur.title)} · ${t('quizTitle')}</h3>
          <button class="qclose" aria-label="${t('qClose')}">✕</button>
        </div>
        <div class="qresult">
          <div class="rp ${pass ? 'pass' : 'fail'}">${cur.pct}%</div>
          <h4>${pass ? t('qPass') : t('qFail')}</h4>
          <p>${pass ? t('qPassMsg') : t('qFailMsg').replace('{p}', AQ.PASS_MARK)}</p>
          ${pass
            ? `<button class="qnext" data-act="close">${t('qClose')}</button>`
            : `<button class="qnext" data-act="retry">${t('qRetry')}</button>`}
        </div>
      </div>`;
    w.querySelector('.qclose').onclick = close;
    w.querySelector('.qnext').onclick = e => {
      if (e.currentTarget.dataset.act === 'retry') { open(cur.id, cur.title); }
      else close();
    };
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && cur) close();
  });

  return { open, close, best, passed, scores };
})();
