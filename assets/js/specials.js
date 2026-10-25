/* Specials from a Google Sheet.
   The restaurant edits the sheet; this replaces the specials lists with the sheet's rows.
   The HTML already holds a copy of the specials, so if the sheet can't be reached the page
   still shows them. The last good copy is also kept in localStorage for the next visit. */
(function () {
  var section = document.querySelector('[data-specials-sheet]');
  if (!section || !window.fetch) return;

  var SHEET = section.getAttribute('data-specials-sheet');
  var URL = 'https://docs.google.com/spreadsheets/d/' + SHEET + '/gviz/tq?tqx=out:csv';
  var CACHE = 'shell-specials-' + SHEET;
  var LANG = (document.documentElement.lang || 'en').slice(0, 2);
  var SOLD = { en: 'Sold out today', zh: '今日售完', fr: 'Épuisé aujourd’hui' }[LANG] || 'Sold out today';

  // Small CSV parser: handles quoted fields, commas and line breaks inside quotes.
  function parseCSV(text) {
    var rows = [], row = [], field = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') q = false;
        else field += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); rows.push(row); row = []; field = '';
      } else field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    var head = (rows.shift() || []).map(function (h) { return h.trim().toLowerCase(); });
    return rows.filter(function (r) { return r.join('').trim(); }).map(function (r) {
      var o = {}; head.forEach(function (h, k) { o[h] = (r[k] || '').trim(); }); return o;
    });
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function pick(row, key) { return row[key + '_' + LANG] || row[key + '_en'] || ''; }

  function render(items) {
    var groups = [], byName = {};
    items.forEach(function (row) {
      var g = pick(row, 'group');
      if (!pick(row, 'name') || !g) return;
      if (!byName[g]) { byName[g] = []; groups.push(g); }
      byName[g].push(row);
    });
    if (!groups.length) return false;

    var old = section.querySelectorAll('.special-group');
    var parent = old[0].parentNode;
    groups.forEach(function (g) {
      var wrap = el('div', 'special-group');
      wrap.appendChild(el('h3', null, g));
      var ul = el('ul', 'special-list');
      byName[g].forEach(function (row) {
        var li = el('li');
        var soldOut = /^(no|n|false|sold out|0)$/i.test(row.available || '');
        if (soldOut) li.className = 'is-sold-out';
        li.appendChild(el('strong', null, pick(row, 'name')));
        li.appendChild(el('span', null, soldOut ? SOLD : pick(row, 'desc')));
        var p = parseFloat((row.price || '').replace(/[^0-9.]/g, ''));
        li.appendChild(el('b', 'price', isNaN(p) ? row.price : '£' + p.toFixed(2)));
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
      parent.insertBefore(wrap, old[0]);
    });
    Array.prototype.forEach.call(old, function (n) { n.remove(); });
    return true;
  }

  try { var cached = localStorage.getItem(CACHE); if (cached) render(JSON.parse(cached)); } catch (e) {}

  fetch(URL, { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (text) {
      if (/^\s*</.test(text)) throw new Error('not csv'); // sheet not shared publicly
      var items = parseCSV(text);
      if (render(items)) { try { localStorage.setItem(CACHE, JSON.stringify(items)); } catch (e) {} }
    })
    .catch(function () { /* keep what's on the page */ });
})();
