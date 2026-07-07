/* Optional dashboard control: reset saved local training progress. */
(function () {
  'use strict';

  const labels = {
    en: {
      button: 'Reset progress',
      confirm: 'Reset all saved module visits, quiz scores and pinned modules for this browser?',
      done: 'Training progress has been reset.'
    },
    ar: {
      button: 'إعادة ضبط التقدم',
      confirm: 'هل تريد حذف زيارات الوحدات ودرجات الاختبارات والوحدات المثبّتة من هذا المتصفح؟',
      done: 'تمت إعادة ضبط تقدم التدريب.'
    }
  };

  function lang() { return document.documentElement.lang === 'ar' ? 'ar' : 'en'; }
  function text(key) { return labels[lang()][key]; }

  function injectStyle() {
    if (document.getElementById('progressResetStyle')) return;
    const style = document.createElement('style');
    style.id = 'progressResetStyle';
    style.textContent = `
      .resetbtn{display:inline-flex;align-items:center;justify-content:center;margin-top:8px;font-family:var(--mono,monospace);font-size:12px;min-height:40px;padding:8px 14px;border-radius:10px;border:1px solid rgba(255,81,99,.45);background:rgba(255,81,99,.08);color:#ffd7db;transition:.16s}
      .resetbtn:hover{border-color:var(--red,#ff5163);background:rgba(255,81,99,.14);color:#fff}
    `;
    document.head.appendChild(style);
  }

  function toast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.className = 'ok show';
    setTimeout(() => el.classList.remove('show'), 1800);
  }

  function resetProgress() {
    if (!confirm(text('confirm'))) return;
    ['aq_pins', 'aq_seen', 'aq_quiz'].forEach(key => {
      try { localStorage.removeItem(key); } catch (e) { /* storage may be unavailable */ }
    });
    toast(text('done'));
    setTimeout(() => location.reload(), 650);
  }

  function ensureButton() {
    const hint = document.getElementById('certHint');
    if (!hint) return;
    let btn = document.getElementById('resetProgressBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'resetProgressBtn';
      btn.type = 'button';
      btn.className = 'resetbtn';
      btn.addEventListener('click', resetProgress);
      hint.insertAdjacentElement('afterend', btn);
    }
    btn.textContent = text('button');
  }

  function boot() {
    injectStyle();
    ensureButton();
    const langToggle = document.getElementById('langTog');
    if (langToggle) langToggle.addEventListener('click', () => setTimeout(ensureButton, 0));
    document.querySelectorAll('[data-view="dash"]').forEach(btn => {
      btn.addEventListener('click', () => setTimeout(ensureButton, 0));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
