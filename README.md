# Aqwat — Engineering Training Platform  |  أقوات — منصة التدريب الهندسية

Structured multi-file training application (dark calm theme · EN/AR · RTL).

## Structure  |  البنية
```
index.html          shell (gate, home, dashboard, viewer)
css/main.css        design system — calm identity, RTL, a11y, mobile
js/store.js         safe storage wrapper
js/i18n.js          EN/AR dictionaries
js/registry.js      module registry + role-access matrix
js/quiz-data.js     5 bilingual questions per module
js/quiz.js          quiz engine (pass mark 60%)
js/cert.js          PDF certificate (canvas → jsPDF, PNG fallback)
js/app.js           main controller
modules/*.html      5 standalone training modules (lazy-loaded in an iframe)
```

## Submitted file sync
- Header brand logo beside “Aqwat” removed in `index.html`.
- Accent color references in the shell use the calmer teal palette from the submitted file.
- The platform is still a static GitHub Pages application.

## Run  |  التشغيل
Any static server, e.g.:
```
python3 -m http.server 8000     # then open http://localhost:8000
```
Opening `index.html` directly from disk also works in most browsers.
