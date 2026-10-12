/* Utilitários compartilhados: tema, armazenamento, barra superior, arquivos */
(function () {
  'use strict';
  const root = document.documentElement;
  try { const t = localStorage.getItem('pmtool-theme'); if (t === 'dark' || t === 'light') root.dataset.theme = t; } catch (e) {}

  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) { if (k == null || k === false) continue; e.append(k.nodeType ? k : document.createTextNode(k)); }
    return e;
  }
  function store(key) {
    return {
      load() { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } },
      save(v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { return false; } }
    };
  }
  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type: (type || 'application/json') + ';charset=utf-8' }));
    const a = el('a', { href: url, download: name });
    document.body.append(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
  }
  function pickFile(cb) {
    const i = el('input', { type: 'file', accept: '.json,application/json' });
    i.addEventListener('change', () => {
      const f = i.files[0]; if (!f) return;
      f.text().then(t => { let d; try { d = JSON.parse(t); } catch (e) { toast('Arquivo inválido'); return; } cb(d); });
    });
    i.click();
  }
  let toastT;
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = el('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
  }
  const slug = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'canvas';
  const uid = () => Math.random().toString(36).slice(2, 10);

  function toggleTheme() {
    const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.dataset.theme = cur === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('pmtool-theme', root.dataset.theme); } catch (e) {}
    window.dispatchEvent(new Event('resize'));
  }

  function topbar(o) {
    const phProject = el('span', {}, o.project || '');
    const input = el('input', { class: 'project', placeholder: 'Nome do projeto, produto ou empresa', 'aria-label': 'Nome do projeto', maxlength: '200' });
    input.value = o.project || '';
    input.addEventListener('input', () => { phProject.textContent = input.value; o.onProject(input.value); });
    const saved = el('span', { class: 'saved', 'aria-live': 'polite' }, '✓ Salvo no navegador');
    const actions = el('div', { class: 'actions' },
      o.actions.filter(Boolean).map(a => el('button', { class: 'btn' + (a.primary ? ' primary' : ''), title: a.title || a.label, onclick: a.onClick },
        el('span', { class: 'ic', 'aria-hidden': 'true' }, a.icon), el('span', { class: 'lb' }, a.label))),
      el('button', { class: 'btn', title: 'Alternar tema claro/escuro', 'aria-label': 'Alternar tema claro/escuro', onclick: toggleTheme },
        el('span', { class: 'ic', 'aria-hidden': 'true' }, '◐')));
    const header = el('header', { class: 'topbar' },
      el('a', { class: 'back', href: './' }, '← Ferramentas'),
      el('div', { class: 'ttl' }, el('h1', {}, o.title), el('p', {}, o.subtitle || '')),
      input, saved, actions);
    const ph = el('div', { class: 'print-head' }, el('strong', {}, o.title), phProject, el('span', {}, new Date().toLocaleDateString('pt-BR')));
    document.body.prepend(header, ph);
    return {
      setProject(v) { input.value = v; phProject.textContent = v; },
      flashSaved() { saved.classList.add('on'); clearTimeout(saved._t); saved._t = setTimeout(() => saved.classList.remove('on'), 1400); }
    };
  }

  window.UI = { el, store, download, pickFile, toast, slug, uid, topbar };
})();
