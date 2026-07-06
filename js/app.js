/* AQ app — main controller.
   Depends (load order): store.js, i18n.js, registry.js, quiz-data.js, quiz.js, cert.js */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const t = k => AQ.t(k);

  /* ---------------- state ---------------- */
  let USER = AQ.store.json('aq_user', null);
  let FILTER = 'all';
  let QUERY = '';
  let PINS = AQ.store.json('aq_pins', []);
  let SEEN = AQ.store.json('aq_seen', []);
  let VIEW = 'home';
  let curModuleId = null;

  /* ---------------- helpers ---------------- */
  function escapeHTML(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function allowedDepts() { return USER && AQ.ROLES[USER.role] ? AQ.ROLES[USER.role].depts : []; }
  function canOpen(m) { return allowedDepts().includes(m.dept); }
  function accessible() { return AQ.MODULES.filter(canOpen); }
  function moduleById(id) { return AQ.MODULES.find(m => m.id === id); }
  function isComplete(m) { return SEEN.includes(m.id) && AQ.quiz.passed(m.id); }

  let toastT = null;
  function toast(msg, cls) {
    const el = $('#toast');
    el.textContent = msg; el.className = (cls || '') + ' show';
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------------- entry gate (role-based access) ---------------- */
  let gateRole = null;
  function openGate() {
    gateRole = USER ? USER.role : null;
    $('#gateName').value = USER ? USER.name : '';
    $$('.role').forEach(r => {
      const sel = r.dataset.role === gateRole;
      r.classList.toggle('sel', sel);
      r.setAttribute('aria-checked', sel);
    });
    gateCheck();
    $('#gate').classList.add('open');
    setTimeout(() => $('#gateName').focus(), 80);
  }
  function gateCheck() { $('#gateEnter').disabled = !($('#gateName').value.trim() && gateRole); }
  $('#gateName').addEventListener('input', gateCheck);
  $$('.role').forEach(r => r.addEventListener('click', () => {
    gateRole = r.dataset.role;
    $$('.role').forEach(x => {
      const sel = x === r;
      x.classList.toggle('sel', sel);
      x.setAttribute('aria-checked', sel);
    });
    gateCheck();
  }));
  $('#gateEnter').addEventListener('click', () => {
    USER = { name: $('#gateName').value.trim(), role: gateRole };
    AQ.store.set('aq_user', JSON.stringify(USER));
    $('#gate').classList.remove('open');
    const depts = allowedDepts();
    FILTER = depts.length === 1 ? depts[0] : 'all';
    syncFilterBtns();
    applyLang();
  });
  $('#userChip').addEventListener('click', openGate);

  /* ---------------- language / RTL ---------------- */
  function applyLang() {
    const rtl = AQ.lang === 'ar';
    document.documentElement.lang = rtl ? 'ar' : 'en';
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.title = rtl ? 'أقوات — منصة تدريب' : 'Aqwat — Training Platform';
    $$('#langTog button').forEach(b => {
      const on = b.dataset.lang === AQ.lang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
    /* static ids */
    $('#brandSub').textContent = t('brandSub');
    $('#gateTitle').textContent = t('gateTitle'); $('#gateSub').textContent = t('gateSub');
    $('#gateNameL').textContent = t('gateNameL'); $('#gateName').placeholder = t('gateNamePh');
    $('#rFcmN').textContent = t('rFcmN'); $('#rFcmD').textContent = t('rFcmD');
    $('#rFoeN').textContent = t('rFoeN'); $('#rFoeD').textContent = t('rFoeD');
    $('#rSupN').textContent = t('rSupN'); $('#rSupC').textContent = t('rSupC'); $('#rSupD').textContent = t('rSupD');
    $('#gateEnter').textContent = t('gateEnter'); $('#gateHint').textContent = t('gateHint');
    $('#heroKick').textContent = t('heroKick');
    $('#heroTitle').innerHTML = USER
      ? t('heroWelcome') + '<span class="hl">' + escapeHTML(USER.name) + '</span>'
      : t('heroGeneric') + '<span class="hl">' + t('heroGenericHl') + '</span>';
    $('#heroLede').textContent = t('heroLede');
    $('#searchBox').placeholder = t('searchPh');
    $('#progL').textContent = t('progL');
    $('#clkPhaseL').textContent = t('phaseLabel');
    $('#vbackArrow').textContent = rtl ? '→' : '←';
    $('#footer').textContent = t('footer');
    $('#userChip').title = t('switchTip');
    /* dashboard */
    $('#dashKick').textContent = t('dashKick');
    $('#dashTitle').textContent = t('dashTitle');
    $('#dashLede').textContent = t('dashLede');
    $('#ringL').textContent = t('ringL');
    $('#dsModulesL').textContent = t('dsModulesL');
    $('#dsQuizL').textContent = t('dsQuizL');
    $('#dsAvgL').textContent = t('dsAvgL');
    $('#certBtnL').textContent = t('certBtn');
    $('#dashListL').textContent = t('dashListL');
    /* generic data-t */
    $$('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
    AQ.store.set('aq_lang', AQ.lang);
    updateUserChip(); renderGrid(); renderDash(); updateOps(); updateProgress();
  }
  $('#langTog').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    AQ.lang = b.dataset.lang; applyLang();
  });

  /* ---------------- user chip ---------------- */
  function updateUserChip() {
    if (!USER) { $('#uAv').textContent = '?'; $('#uName').textContent = '—'; $('#uRole').textContent = '—'; return; }
    const R = AQ.ROLES[USER.role];
    $('#userChip').style.setProperty('--role', R.color);
    $('#uAv').textContent = USER.name.trim().charAt(0).toUpperCase() || '?';
    $('#uName').textContent = USER.name;
    $('#uRole').textContent = R[AQ.lang] || R.en;
  }

  /* ---------------- ops clock ---------------- */
  function currentPhase() {
    const d = new Date(); const day = d.getDay(); const m = d.getHours() * 60 + d.getMinutes();
    if (day === 5 && m >= 120 && m < 660) return 'weekly';
    if (m >= 420 && m < 960) return 'first';
    if (m >= 960 || m < 60) return 'second';
    if (m >= 60 && m < 300) return 'pm';
    return 'prep';
  }
  function updateOps() {
    const d = new Date();
    $('#clkTop').textContent = d.toTimeString().slice(0, 8);
    const ph = currentPhase(), label = AQ.I18N[AQ.lang].phases[ph];
    const b = $('#clkPhase'); b.textContent = label; b.classList.toggle('live', ph === 'weekly');
    const live = $('#opsLive'), txt = $('#opsLiveText');
    if (ph === 'weekly') { live.classList.add('wk'); txt.innerHTML = '<b>' + t('liveWeekly') + '</b>'; }
    else { live.classList.remove('wk'); txt.innerHTML = t('liveNormal') + ' <b>' + label + '</b>'; }
  }
  setInterval(updateOps, 1000);

  /* ---------------- progress ---------------- */
  function updateProgress() {
    const avail = accessible();
    const done = avail.filter(isComplete).length;
    const pct = avail.length ? Math.round(done / avail.length * 100) : 0;
    $('#progV').textContent = done + ' / ' + avail.length;
    $('#progFill').style.width = pct + '%';
    $('#progBar').setAttribute('aria-valuenow', pct);
  }

  /* ---------------- views ---------------- */
  function setView(v) {
    VIEW = v;
    $('#view-home').hidden = v !== 'home';
    $('#view-dash').hidden = v !== 'dash';
    $$('.navbtn').forEach(b => b.classList.toggle('on', b.dataset.view === v));
    if (v === 'dash') renderDash();
  }
  $$('.navbtn').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

  /* ---------------- filters / search / pins ---------------- */
  function syncFilterBtns() { $$('.fbtn').forEach(b => b.classList.toggle('on', b.dataset.f === FILTER)); }
  $$('.fbtn').forEach(b => b.addEventListener('click', () => { FILTER = b.dataset.f; syncFilterBtns(); renderGrid(); }));
  $('#searchBox').addEventListener('input', e => { QUERY = e.target.value.trim().toLowerCase(); renderGrid(); });
  function togglePin(id, ev) {
    ev.stopPropagation();
    const i = PINS.indexOf(id);
    if (i >= 0) PINS.splice(i, 1); else { if (PINS.length >= 4) PINS.shift(); PINS.push(id); }
    AQ.store.set('aq_pins', JSON.stringify(PINS)); renderGrid();
  }

  /* ---------------- home grid ---------------- */
  function cardHTML(m) {
    const L = m[AQ.lang] || m.en;
    const pinned = PINS.includes(m.id);
    const seen = SEEN.includes(m.id);
    const qBest = AQ.quiz.best(m.id);
    const complete = isComplete(m);
    const ok = canOpen(m);
    return `<div class="scard ${ok ? '' : 'locked'}" style="--accent:${m.color}" data-id="${m.id}"
      role="button" tabindex="0" aria-label="${L.name.replace(/&amp;/g, '&')}${ok ? '' : ' (' + t('lockedB') + ')'}">
      ${ok ? `<button class="star ${pinned ? 'on' : ''}" data-star="${m.id}" aria-label="pin" aria-pressed="${pinned}">${pinned ? '★' : '☆'}</button>` : ''}
      <div class="top">
        <div class="ico" aria-hidden="true">${AQ.ICONS[m.id] || ''}</div>
        <div style="min-width:0">
          <div class="dept">${m.abbr} · ${m.dept.toUpperCase()}</div>
          <h3>${L.name}</h3>
        </div>
      </div>
      <p>${L.desc}</p>
      <div class="foot">
        ${complete ? `<span class="badge-done">✓ ${t('done')}</span>` : (seen && ok ? `<span class="badge-done" style="color:var(--amber);border-color:rgba(255,176,46,.4)">${t('visitedB')}</span>` : '')}
        ${qBest !== null && ok ? `<span class="badge-quiz">${t('quizB')} ${qBest}%</span>` : ''}
        ${ok ? '' : `<span class="badge-lock"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg> ${t('lockedB')}</span>`}
        <span class="go">${ok ? t('open') : ''} <span aria-hidden="true">${ok ? (AQ.lang === 'ar' ? '←' : '→') : ''}</span></span>
      </div>
    </div>`;
  }
  function renderGrid() {
    const grid = $('#grid');
    const list = AQ.MODULES.filter(m => {
      if (FILTER !== 'all' && m.dept !== FILTER) return false;
      if (!QUERY) return true;
      const L = m[AQ.lang] || m.en;
      return (L.name + ' ' + m.abbr + ' ' + L.desc).toLowerCase().includes(QUERY);
    });
    grid.innerHTML = list.length ? list.map(cardHTML).join('') : `<div class="empty">${t('empty')}</div>`;
    /* pins */
    const pins = PINS.filter(id => { const m = moduleById(id); return m && canOpen(m); });
    $('#pinWrap').hidden = !pins.length;
    $('#pinRow').innerHTML = pins.map(id => {
      const m = moduleById(id);
      return `<button class="pinchip" data-id="${m.id}"><span class="d" style="background:${m.color}" aria-hidden="true"></span>${(m[AQ.lang] || m.en).name}</button>`;
    }).join('');
    /* wire */
    grid.querySelectorAll('.scard').forEach(c => {
      c.addEventListener('click', () => openModule(c.dataset.id));
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModule(c.dataset.id); } });
    });
    grid.querySelectorAll('.star').forEach(b => b.addEventListener('click', e => togglePin(b.dataset.star, e)));
    $('#pinRow').querySelectorAll('.pinchip').forEach(c => c.addEventListener('click', () => openModule(c.dataset.id)));
  }

  /* ---------------- module viewer (lazy iframe) ---------------- */
  function openModule(id) {
    const m = moduleById(id); if (!m) return;
    if (!canOpen(m)) { toast(t('lockedMsg'), 'err'); return; }
    curModuleId = id;
    const L = m[AQ.lang] || m.en;
    const frame = $('#vframe'), load = $('#vload');
    $('#vtitle').innerHTML = `${L.name} <span class="vd">${m.abbr}</span>`;
    load.style.opacity = '1'; load.style.display = '';
    $('#viewer').classList.add('open');
    /* lazy load: iframe src only set on demand */
    if (frame.dataset.cur !== id) {
      frame.src = m.file;
      frame.dataset.cur = id;
    } else { load.style.opacity = '0'; setTimeout(() => load.style.display = 'none', 300); }
    frame.onload = () => { load.style.opacity = '0'; setTimeout(() => { load.style.display = 'none'; }, 350); };
    setTimeout(() => { load.style.opacity = '0'; setTimeout(() => load.style.display = 'none', 350); }, 5000);
    if (!SEEN.includes(id)) { SEEN.push(id); AQ.store.set('aq_seen', JSON.stringify(SEEN)); updateProgress(); }
    $('#vback').focus();
  }
  $('#vback').addEventListener('click', () => {
    $('#viewer').classList.remove('open');
    const f = $('#vframe');
    f.removeAttribute('srcdoc'); f.src = 'about:blank'; delete f.dataset.cur;
    renderGrid(); renderDash(); updateProgress();
  });
  $('#vquiz').addEventListener('click', () => {
    if (!curModuleId) return;
    const m = moduleById(curModuleId);
    AQ.quiz.open(m.id, (m[AQ.lang] || m.en).name.replace(/&amp;/g, '&'));
  });

  /* quiz callbacks */
  AQ.onQuizFinished = function () { updateProgress(); };
  AQ.onQuizClosed = function () { renderGrid(); renderDash(); updateProgress(); };

  /* ---------------- dashboard ---------------- */
  function renderDash() {
    if (!USER) return;
    const avail = accessible();
    const opened = avail.filter(m => SEEN.includes(m.id)).length;
    const passedN = avail.filter(m => AQ.quiz.passed(m.id)).length;
    const completed = avail.filter(isComplete).length;
    const pct = avail.length ? Math.round(completed / avail.length * 100) : 0;
    const scored = avail.map(m => AQ.quiz.best(m.id)).filter(v => v !== null);
    const avg = scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : null;

    /* ring: r=52 → C=326.7 */
    $('#ringFg').style.strokeDashoffset = String(326.7 * (1 - pct / 100));
    $('#ringPct').textContent = pct + '%';
    $('#dsModules').textContent = opened + '/' + avail.length;
    $('#dsQuiz').textContent = passedN + '/' + avail.length;
    $('#dsAvg').textContent = avg === null ? '—' : avg + '%';

    const ready = avail.length > 0 && completed === avail.length;
    $('#certBtn').disabled = !ready;
    $('#certHint').textContent = ready ? t('certHintReady') : t('certHintLocked');

    /* module rows */
    $('#dashList').innerHTML = avail.map(m => {
      const L = m[AQ.lang] || m.en;
      const seen = SEEN.includes(m.id);
      const b = AQ.quiz.best(m.id);
      const st = isComplete(m) ? ['c', t('stDone')] : seen ? ['v', t('stVisited')] : ['', t('stNot')];
      return `<div class="drow" style="--accent:${m.color}">
        <div class="ico" aria-hidden="true">${AQ.ICONS[m.id] || ''}</div>
        <div class="dinfo"><h4>${L.name}</h4><span class="dst ${st[0]}">${st[1]}</span></div>
        <div class="dscore">${b === null ? '—' : `${t('best')}: <b>${b}%</b>`}</div>
        <button class="dbtn" data-open="${m.id}">${t('dOpen')}</button>
        <button class="dbtn q" data-quiz="${m.id}">${t('dQuiz')}</button>
      </div>`;
    }).join('');
    $$('#dashList [data-open]').forEach(b => b.addEventListener('click', () => openModule(b.dataset.open)));
    $$('#dashList [data-quiz]').forEach(b => b.addEventListener('click', () => {
      const m = moduleById(b.dataset.quiz);
      AQ.quiz.open(m.id, (m[AQ.lang] || m.en).name.replace(/&amp;/g, '&'));
    }));
  }
  $('#certBtn').addEventListener('click', async () => {
    const avail = accessible();
    const scored = avail.map(m => AQ.quiz.best(m.id)).filter(v => v !== null);
    const avg = scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : 0;
    const R = AQ.ROLES[USER.role];
    const d = new Date();
    const dateStr = AQ.lang === 'ar' ? d.toLocaleDateString('ar-SA') : d.toLocaleDateString('en-GB');
    const kind = await AQ.cert.download({
      name: USER.name, roleLabel: R[AQ.lang] || R.en,
      count: avail.length, avg, dateStr
    });
    toast(kind === 'pdf' ? t('certDone') : t('certPng'), kind === 'pdf' ? 'ok' : '');
  });

  /* ---------------- boot ---------------- */
  applyLang();
  updateOps();
  if (!USER) { openGate(); }
  else {
    const depts = allowedDepts();
    FILTER = depts.length === 1 ? depts[0] : 'all';
    syncFilterBtns(); renderGrid(); renderDash(); updateProgress();
  }
})();
