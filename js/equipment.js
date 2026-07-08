/* Compatibility patch for advanced menus on GitHub Pages.
   Loads before app.js, then patches navigation after app.js finishes. */
window.AQ = window.AQ || {};

(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const tr = (k, fb) => (window.AQ && AQ.t && AQ.t(k)) || fb || k;
  const html = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function modules() { return (window.AQ && AQ.MODULES) || []; }
  function roleDepts() {
    try {
      const u = AQ.store && AQ.store.json ? AQ.store.json('aq_user', null) : JSON.parse(localStorage.getItem('aq_user'));
      return u && AQ.ROLES && AQ.ROLES[u.role] ? AQ.ROLES[u.role].depts : ['fcm', 'foe'];
    } catch (e) { return ['fcm', 'foe']; }
  }
  function accessible() { const d = roleDepts(); return modules().filter(m => d.includes(m.dept)); }
  function best(id) { return AQ.quiz && AQ.quiz.best ? AQ.quiz.best(id) : null; }

  function showView(v) {
    $$('main > section[id^="view-"]').forEach(sec => { sec.hidden = sec.id !== 'view-' + v; });
    $$('.navbtn').forEach(b => b.classList.toggle('on', b.dataset.view === v));
    if (v === 'insights') renderInsights();
    if (v === 'maint') renderMaint();
  }

  function renderInsights() {
    $('#insightsKick') && ($('#insightsKick').textContent = tr('insightsKick', 'Analytics'));
    $('#insightsTitle') && ($('#insightsTitle').textContent = tr('insightsTitle', 'Learning Insights'));
    $('#insightsLede') && ($('#insightsLede').textContent = tr('insightsLede', 'Strengths, weak areas and activity from local quiz progress.'));
    $('#weakTitle') && ($('#weakTitle').textContent = tr('weakTitle', 'Areas to improve'));
    $('#recTitle') && ($('#recTitle').textContent = tr('recTitle', 'Recommended next'));
    $('#weeklyTitle') && ($('#weeklyTitle').textContent = tr('weeklyTitle', 'This week'));
    $('#heatTitle') && ($('#heatTitle').textContent = tr('heatTitle', 'Activity heatmap'));
    $('#eqKick') && ($('#eqKick').textContent = tr('eqKick', 'Operations · sample data'));
    $('#eqTitle') && ($('#eqTitle').textContent = tr('eqTitle', 'Equipment KPI Dashboard'));
    $('#eqLede') && ($('#eqLede').textContent = tr('eqLede', 'Illustrative training values. Not live telemetry.'));

    const mods = accessible();
    const scored = mods.map(m => ({ m, s: best(m.id) })).filter(x => x.s !== null);
    const weak = scored.filter(x => x.s < 70).sort((a, b) => a.s - b.s).slice(0, 4);
    const notStarted = mods.filter(m => best(m.id) === null).slice(0, 4);

    if ($('#weakList')) $('#weakList').innerHTML = weak.length ? weak.map(x => {
      const L = x.m[AQ.lang] || x.m.en;
      return `<div class="irec"><b>${html(L.name)}</b><span>${x.s}%</span></div>`;
    }).join('') : `<p class="pempty">${tr('weakNone', 'No weak areas yet — complete quizzes to see analysis.')}</p>`;

    if ($('#recList')) $('#recList').innerHTML = notStarted.length ? notStarted.map(m => {
      const L = m[AQ.lang] || m.en;
      return `<button class="pinchip" data-open="${m.id}"><span class="d" style="background:${m.color}"></span>${html(L.name)}</button>`;
    }).join('') : `<p class="pempty">${tr('recNone', 'You are progressing across all modules.')}</p>`;
    $$('#recList [data-open]').forEach(b => b.addEventListener('click', () => document.querySelector(`.scard[data-id="${b.dataset.open}"]`)?.click()));

    if ($('#weeklyChart')) $('#weeklyChart').innerHTML = Array.from({ length: 7 }, (_, i) => `<span style="height:${20 + i * 7}%"></span>`).join('');
    if ($('#heatmap')) $('#heatmap').innerHTML = Array.from({ length: 70 }, (_, i) => `<span class="${i % 9 === 0 ? 'hot' : i % 5 === 0 ? 'warm' : ''}"></span>`).join('');
    renderEquipment();
  }

  function tasks() { return AQ.store && AQ.store.json ? AQ.store.json('aq_maint', []) : []; }
  function saveTasks(x) { if (AQ.store) AQ.store.set('aq_maint', JSON.stringify(x)); }
  function renderMaint() {
    $('#maintKick') && ($('#maintKick').textContent = tr('maintKick', 'Operations'));
    $('#maintTitle') && ($('#maintTitle').textContent = tr('maintTitle', 'Maintenance Board'));
    $('#maintLede') && ($('#maintLede').textContent = tr('maintLede', 'Track local maintenance notes and tasks.'));
    $('#maintInput') && ($('#maintInput').placeholder = tr('maintPh', 'Describe the task…'));
    $('#maintAddBtn') && ($('#maintAddBtn').textContent = tr('maintAdd', 'Add task'));
    if ($('#maintModule')) $('#maintModule').innerHTML = `<option value="">${tr('maintModule', 'System')}</option>` + accessible().map(m => `<option value="${m.id}">${html((m[AQ.lang] || m.en).name)}</option>`).join('');
    if ($('#maintPrio')) {
      $('#maintPrio').options[0].textContent = tr('prioLow', 'Low');
      $('#maintPrio').options[1].textContent = tr('prioMed', 'Medium');
      $('#maintPrio').options[2].textContent = tr('prioHigh', 'High');
    }
    const list = tasks();
    if ($('#maintCounts')) $('#maintCounts').innerHTML = `<span class="mc">${tr('maintOpenN', 'Open')} <b>${list.filter(x => x.status !== 'done').length}</b></span><span class="mc">${tr('maintDoneN', 'Done')} <b>${list.filter(x => x.status === 'done').length}</b></span>`;
    if ($('#maintList')) $('#maintList').innerHTML = list.length ? list.map(x => `<div class="maintrow ${x.status === 'done' ? 'done' : ''}"><span class="mt-prio ${x.priority || 'med'}"></span><span class="mt-title">${html(x.title)}</span><button class="mt-btn" data-toggle="${x.id}">${x.status === 'done' ? tr('maintReopen', 'Reopen') : tr('maintDone', 'Done')}</button><button class="mt-btn del" data-del="${x.id}">${tr('maintDelete', 'Delete')}</button></div>`).join('') : `<p class="pempty">${tr('maintEmpty', 'No tasks yet.')}</p>`;
    $$('#maintList [data-toggle]').forEach(b => b.addEventListener('click', () => { const l = tasks(); const x = l.find(t => t.id === b.dataset.toggle); if (x) x.status = x.status === 'done' ? 'open' : 'done'; saveTasks(l); renderMaint(); }));
    $$('#maintList [data-del]').forEach(b => b.addEventListener('click', () => { saveTasks(tasks().filter(t => t.id !== b.dataset.del)); renderMaint(); }));
  }

  function renderEquipment() {
    const units = [
      ['Generators', 'ELE', 98], ['ATS Transfer', 'ELE', 95], ['RO Plant', 'AWS', 92], ['Fire Pumps', 'AWS', 99],
      ['MR4 Compressors', 'MR4', 74], ['Condensers', 'MR4', 88], ['Hatchback HVAC', 'HB', 90], ['Poultry Line', 'POU', 82]
    ];
    if ($('#eqSummary')) $('#eqSummary').innerHTML = `<span>${tr('eqAvg', 'Fleet average')} <b>${Math.round(units.reduce((a, x) => a + x[2], 0) / units.length)}%</b></span><span>${tr('eqSample', 'Sample data · not live')}</span>`;
    if ($('#eqGrid')) $('#eqGrid').innerHTML = units.map(u => `<div class="eqcard"><h4>${u[0]}</h4><span>${u[1]}</span><b>${u[2]}%</b><div class="eq-track"><i style="width:${u[2]}%"></i></div></div>`).join('');
  }

  function installStyles() {
    if ($('#aq-menu-fix-style')) return;
    const css = `.panel,.eqcard{border:1px solid var(--line);border-radius:var(--r-lg);background:linear-gradient(160deg,var(--surface),var(--surface-2));padding:var(--sp-4);margin-bottom:var(--sp-4)}.insightgrid,.eqgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--sp-4)}.panel-h{font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--brand);margin-bottom:var(--sp-3)}.irec{display:flex;justify-content:space-between;gap:var(--sp-3);padding:var(--sp-3);border:1px solid var(--line-2);border-radius:var(--r-md);margin-bottom:var(--sp-2);background:var(--surface)}.weeklychart{height:110px;display:flex;align-items:end;gap:8px}.weeklychart span{flex:1;border-radius:8px 8px 0 0;background:linear-gradient(180deg,var(--brand),var(--green));min-height:12px}.heatmap{display:grid;grid-template-columns:repeat(10,1fr);gap:5px}.heatmap span{height:16px;border-radius:4px;background:var(--surface);border:1px solid var(--line)}.heatmap span.warm{background:rgba(92,199,194,.35)}.heatmap span.hot{background:rgba(91,201,138,.55)}.maintadd{display:flex;gap:var(--sp-3);flex-wrap:wrap;margin-bottom:var(--sp-4)}.maintadd input,.maintadd select{background:var(--surface);border:1px solid var(--line-2);border-radius:var(--r-sm);color:var(--text);min-height:40px;padding:var(--sp-2) var(--sp-3)}.maintadd input{flex:1;min-width:220px}.maintcounts{display:flex;gap:var(--sp-3);margin-bottom:var(--sp-3)}.mc,.pempty{color:var(--text-dim);font-family:var(--font-mono);font-size:var(--fs-xs)}.maintrow{display:flex;align-items:center;gap:var(--sp-3);padding:var(--sp-3);border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface);margin-bottom:var(--sp-2)}.maintrow.done{opacity:.65}.mt-title{flex:1}.mt-prio{width:8px;height:8px;border-radius:50%;background:var(--amber)}.mt-prio.high{background:var(--red)}.mt-prio.low{background:var(--green)}.mt-btn{border:1px solid var(--line-2);border-radius:var(--r-sm);padding:6px 10px;background:var(--surface-2);font-family:var(--font-mono);font-size:11px}.mt-btn.del{color:var(--red)}.eqcard h4{font-family:var(--font-disp);font-size:var(--fs-md)}.eqcard b{display:block;font-size:24px;margin-top:8px}.eq-track{height:6px;background:#0a121c;border:1px solid var(--line-2);border-radius:999px;overflow:hidden}.eq-track i{display:block;height:100%;background:linear-gradient(90deg,var(--brand),var(--green))}`;
    const st = document.createElement('style'); st.id = 'aq-menu-fix-style'; st.textContent = css; document.head.appendChild(st);
  }

  window.addEventListener('DOMContentLoaded', () => {
    installStyles();
    $$('.navbtn').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
    $('#maintAddBtn') && $('#maintAddBtn').addEventListener('click', () => {
      const input = $('#maintInput');
      if (!input || !input.value.trim()) return;
      const list = tasks();
      list.unshift({ id: Date.now().toString(36), title: input.value.trim(), priority: ($('#maintPrio') || {}).value || 'med', status: 'open' });
      saveTasks(list); input.value = ''; renderMaint();
    });
    $('#maintInput') && $('#maintInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('#maintAddBtn')?.click(); });
    $('#langTog') && $('#langTog').addEventListener('click', () => setTimeout(() => {
      const cur = $('.navbtn.on')?.dataset.view;
      if (cur === 'insights') renderInsights();
      if (cur === 'maint') renderMaint();
    }, 50));
  });
})();
