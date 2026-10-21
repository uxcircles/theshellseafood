/* The Shell — concept redesign. No dependencies, no tracking. */
(function () {
  document.documentElement.classList.replace('no-js', 'js');

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    });
  }

  /* ---------- Open now (London time) ----------
     Hours: every day 12:00–23:00. Change OPEN / CLOSE if they move. */
  var OPEN = 12 * 60, CLOSE = 23 * 60;
  function londonNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    return { day: get('weekday'), mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
  }
  function renderStatus() {
    var now = londonNow(), text, cls;
    if (now.mins >= OPEN && now.mins < CLOSE - 30) { text = 'Open now · until 11pm'; cls = 'is-open'; }
    else if (now.mins >= CLOSE - 30 && now.mins < CLOSE) { text = 'Closing soon · 11pm'; cls = 'is-soon'; }
    else if (now.mins < OPEN && now.mins >= OPEN - 60) { text = 'Opens soon · 12 noon'; cls = 'is-soon'; }
    else if (now.mins < OPEN) { text = 'Closed · opens 12 noon today'; cls = ''; }
    else { text = 'Closed · opens 12 noon tomorrow'; cls = ''; }
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.textContent = text;
      el.classList.remove('is-open', 'is-soon');
      if (cls) el.classList.add(cls);
    });
    document.querySelectorAll('[data-day]').forEach(function (row) {
      row.classList.toggle('today', row.getAttribute('data-day') === now.day);
    });
  }
  if (window.Intl && Intl.DateTimeFormat.prototype.formatToParts) { renderStatus(); setInterval(renderStatus, 60000); }

  /* ---------- Menu: search + category highlight ---------- */
  var search = document.getElementById('menu-search');
  var sections = Array.prototype.slice.call(document.querySelectorAll('.menu-section'));
  if (search && sections.length) {
    var empty = document.getElementById('menu-empty');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      sections.forEach(function (sec) {
        var any = false;
        sec.querySelectorAll('.menu-item').forEach(function (item) {
          var hit = !q || item.textContent.toLowerCase().indexOf(q) > -1;
          item.hidden = !hit;
          if (hit) { any = true; shown++; }
        });
        sec.hidden = !any;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }
  var cats = document.querySelectorAll('.menu-cats a');
  if (cats.length && 'IntersectionObserver' in window) {
    var byId = {};
    cats.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cats.forEach(function (a) { a.classList.remove('active'); });
        var link = byId[e.target.id];
        if (link) {
          link.classList.add('active');
          var bar = link.parentNode;
          bar.scrollTo({ left: link.offsetLeft - bar.clientWidth / 2 + link.clientWidth / 2, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-30% 0px -65% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Private dining enquiry → email ----------
     No backend: the form opens the guest's email app with everything filled in. */
  var form = document.getElementById('enquiry-form');
  if (form) {
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var lines = [
        'Name: ' + d.get('name'),
        'Phone: ' + (d.get('phone') || '-'),
        'Email: ' + d.get('email'),
        'Date: ' + d.get('date'),
        'Time: ' + (d.get('time') || '-'),
        'Guests: ' + d.get('guests'),
        'Occasion: ' + d.get('occasion'),
        '',
        d.get('message') || ''
      ];
      var subject = 'Group / private dining enquiry – ' + d.get('guests') + ' guests on ' + d.get('date');
      window.location.href = 'mailto:support@theshellseafood.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      var status = document.getElementById('form-status');
      if (status) status.textContent = 'Your email app should open with the enquiry ready to send. If it doesn’t, email support@theshellseafood.com or call 020 8075 7500.';
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
