/* Mapa Estratégico (Kaplan & Norton): perspectivas, objetivos e relações de causa e efeito */
(function () {
  'use strict';
  const { el, uid, toast } = UI;
  const NS = 'http://www.w3.org/2000/svg';
  const S = UI.store('pmtool:mapa');
  const PERSP = [
    { id: 'fin', name: 'Financeira', c: '#059669', pre: 'F' },
    { id: 'cli', name: 'Clientes', c: '#2563eb', pre: 'C' },
    { id: 'pro', name: 'Processos Internos', c: '#d97706', pre: 'P' },
    { id: 'apr', name: 'Aprendizado e Crescimento', c: '#7c3aed', pre: 'A' }
  ];
  const PIDS = new Set(PERSP.map(p => p.id));
  const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
  const blank = () => ({ project: '', missao: '', visao: '', names: {}, objs: [], links: [] });

  function norm(d) {
    if (!d || typeof d !== 'object') return null;
    const b = blank();
    b.project = str(d.project, 200); b.missao = str(d.missao, 600); b.visao = str(d.visao, 600);
    if (d.names && typeof d.names === 'object') for (const p of PERSP) if (typeof d.names[p.id] === 'string') b.names[p.id] = d.names[p.id].slice(0, 60);
    const seen = new Set();
    b.objs = (Array.isArray(d.objs) ? d.objs : []).filter(o => o && PIDS.has(o.p) && typeof o.t === 'string' && o.t.trim()).slice(0, 120).map(o => {
      let id = typeof o.id === 'string' && /^[\w-]{1,20}$/.test(o.id) && !seen.has(o.id) ? o.id : uid();
      seen.add(id);
      return { id, p: o.p, t: o.t.slice(0, 300) };
    });
    b.links = (Array.isArray(d.links) ? d.links : []).filter(l => Array.isArray(l) && seen.has(l[0]) && seen.has(l[1]) && l[0] !== l[1]).map(l => [l[0], l[1]]);
    return b;
  }
  let st = norm(S.load()) || blank();
  const pname = p => st.names[p.id] || p.name;
  let saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { if (S.save(st)) bar.flashSaved(); }, 250); }

  const EX = {
    project: 'Metalúrgica Exemplo S.A.',
    missao: 'Fornecer componentes metálicos de precisão com qualidade, segurança e preço competitivo.',
    visao: 'Ser referência em eficiência operacional no setor metalmecânico do Sul do Brasil até 2028.',
    objs: [
      { id: 'f1', p: 'fin', t: 'Aumentar a rentabilidade' }, { id: 'f2', p: 'fin', t: 'Reduzir o custo unitário' }, { id: 'f3', p: 'fin', t: 'Crescer a receita com novos clientes' },
      { id: 'c1', p: 'cli', t: 'Entregar no prazo e completo (OTIF)' }, { id: 'c2', p: 'cli', t: 'Elevar a satisfação dos clientes' }, { id: 'c3', p: 'cli', t: 'Conquistar clientes do setor automotivo' },
      { id: 'p1', p: 'pro', t: 'Aumentar a eficiência dos equipamentos (OEE)' }, { id: 'p2', p: 'pro', t: 'Reduzir refugo e retrabalho' }, { id: 'p3', p: 'pro', t: 'Desenvolver fornecedores estratégicos' },
      { id: 'a1', p: 'apr', t: 'Capacitar a equipe em Lean Seis Sigma' }, { id: 'a2', p: 'apr', t: 'Implantar o sistema MES' }, { id: 'a3', p: 'apr', t: 'Fortalecer a cultura de segurança' }
    ],
    links: [['a1', 'p1'], ['a1', 'p2'], ['a2', 'p1'], ['a3', 'p1'], ['p1', 'c1'], ['p2', 'c2'], ['p3', 'c1'], ['p2', 'f2'], ['c1', 'c3'], ['c2', 'c3'], ['c3', 'f3'], ['f2', 'f1'], ['f3', 'f1']]
  };

  const bar = UI.topbar({
    title: 'Mapa Estratégico', subtitle: 'Kaplan & Norton · objetivos ligados por causa e efeito', project: st.project,
    onProject: v => { st.project = v; save(); },
    actions: [
      { label: 'Exemplo', icon: '✨', title: 'Carregar um exemplo preenchido', onClick: () => {
        if (st.objs.length && !confirm('Substituir o mapa atual pelo exemplo?')) return;
        st = norm(EX); syncFields(); render(); save(); toast('Exemplo carregado. Edite à vontade.');
      } },
      { label: 'Abrir no BSC', icon: '📊', title: 'Levar os objetivos para o Balanced Scorecard', onClick: () => { S.save(st); location.href = 'bsc.html#importar'; } },
      { label: 'Exportar', icon: '⬇', title: 'Baixar arquivo .json', onClick: () => UI.download(UI.slug(st.project) + '-mapa-estrategico.json', JSON.stringify({ tool: 'mapa', ...st }, null, 2)) },
      { label: 'Importar', icon: '⬆', title: 'Abrir um arquivo .json', onClick: () => UI.pickFile(d => {
        const n = norm(d); if (!n) return toast('Arquivo inválido');
        st = n; syncFields(); render(); save(); toast('Mapa importado');
      }) },
      { label: 'Limpar', icon: '🗑', title: 'Apagar objetivos e ligações', onClick: () => {
        if (st.objs.length && !confirm('Apagar todos os objetivos e ligações?')) return;
        st.objs = []; st.links = []; render(); save();
      } },
      { label: 'Imprimir / PDF', icon: '🖨', primary: true, onClick: () => window.print() }
    ]
  });

  // ---------- Missão e visão ----------
  function field(label, key, ph) {
    const ed = el('div', { class: 'ed', contenteditable: 'true', 'data-ph': ph, role: 'textbox', 'aria-label': label });
    ed.addEventListener('input', () => { st[key] = ed.innerText.trim(); save(); schedule(); });
    return { box: el('div', { class: 'mvbox' }, el('label', {}, label), ed), ed, key };
  }
  const fields = [field('Missão', 'missao', 'Por que a organização existe?'), field('Visão', 'visao', 'Aonde quer chegar e até quando?')];
  function syncFields() { fields.forEach(f => { f.ed.textContent = st[f.key]; }); bar.setProject(st.project); }
  const map = el('section', { class: 'map', 'aria-label': 'Mapa estratégico' });
  document.body.append(el('section', { class: 'mv' }, fields.map(f => f.box)), map,
    el('p', { class: 'tip' }, 'Dicas: “+ Objetivo” cria um objetivo · 🔗 liga um objetivo (causa) a outro (efeito) · clique numa seta para removê-la · clique no nome da perspectiva para renomeá-la · leve tudo para o BSC com “Abrir no BSC”.'));
  const status = el('div', { class: 'statusbar', role: 'status' }, 'Agora clique no objetivo que é o EFEITO · Esc cancela');
  document.body.append(status);

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'arrows');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs><g class="lines"></g>';
  const lanes = {};

  function render() {
    map.textContent = '';
    map.append(svg);
    for (const p of PERSP) {
      const label = el('div', { class: 'lane-label', contenteditable: 'true', spellcheck: 'false', role: 'textbox', 'aria-label': 'Nome da perspectiva' });
      label.textContent = pname(p);
      label.addEventListener('input', () => { st.names[p.id] = label.innerText.trim().slice(0, 60); save(); });
      label.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); label.blur(); } });
      const add = el('button', { class: 'lane-add', onclick: () => addObj(p.id) }, '+ Objetivo');
      const body = el('div', { class: 'lane-body' });
      st.objs.filter(o => o.p === p.id).forEach((o, i) => body.append(objEl(o, p, i)));
      body.append(add);
      lanes[p.id] = { body, add, p };
      map.append(el('div', { class: 'lane', style: '--c:' + p.c }, label, body));
    }
    schedule();
  }

  function objEl(o, p, i) {
    const txt = el('div', { class: 'txt', contenteditable: 'true', role: 'textbox', 'aria-label': 'Objetivo estratégico' });
    txt.textContent = o.t;
    txt.addEventListener('input', () => { o.t = txt.innerText.trim(); save(); schedule(); });
    txt.addEventListener('keydown', e => { if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'Escape') { e.preventDefault(); txt.blur(); } });
    txt.addEventListener('blur', () => { if (!o.t) removeObj(o.id, true); });
    const card = el('div', { class: 'obj', 'data-id': o.id }, el('span', { class: 'code' }, p.pre + (i + 1)), txt);
    card.append(el('div', { class: 'tools' },
      el('button', { title: 'Ligar a outro objetivo (causa → efeito)', 'aria-label': 'Criar ligação de causa e efeito', onclick: e => { e.stopPropagation(); startLink(o.id, card); } }, '🔗'),
      el('button', { title: 'Excluir objetivo', 'aria-label': 'Excluir objetivo', onclick: () => removeObj(o.id) }, '×')));
    card.addEventListener('mousedown', e => { if (linkFrom && !e.target.closest('.tools')) { e.preventDefault(); finishLink(o.id); } });
    return card;
  }
  function renumber(pid) {
    const L = lanes[pid]; if (!L) return;
    L.body.querySelectorAll('.obj .code').forEach((c, i) => { c.textContent = L.p.pre + (i + 1); });
  }
  function addObj(pid) {
    cancelLink();
    const o = { id: uid(), p: pid, t: '' };
    st.objs.push(o);
    const L = lanes[pid];
    const card = objEl(o, L.p, st.objs.filter(x => x.p === pid).length - 1);
    L.body.insertBefore(card, L.add);
    card.querySelector('.txt').focus();
    schedule();
  }
  function removeObj(id, silent) {
    const o = st.objs.find(x => x.id === id); if (!o) return;
    st.objs = st.objs.filter(x => x !== o);
    const nl = st.links.length;
    st.links = st.links.filter(l => l[0] !== id && l[1] !== id);
    const card = map.querySelector(`.obj[data-id="${id}"]`);
    if (card) card.remove();
    renumber(o.p); schedule(); save();
    if (!silent) toast(nl !== st.links.length ? 'Objetivo e ligações removidos' : 'Objetivo removido');
  }

  // ---------- Ligações ----------
  let linkFrom = null;
  function startLink(id, card) {
    cancelLink(); linkFrom = id; card.classList.add('src'); document.body.classList.add('linking');
  }
  function cancelLink() {
    linkFrom = null; document.body.classList.remove('linking');
    map.querySelectorAll('.obj.src').forEach(c => c.classList.remove('src'));
  }
  function finishLink(to) {
    const from = linkFrom; cancelLink();
    if (from === to) return;
    if (st.links.some(l => l[0] === from && l[1] === to)) return toast('Essa ligação já existe');
    st.links.push([from, to]); save(); draw(); toast('Ligação de causa e efeito criada');
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cancelLink(); });
  document.addEventListener('mousedown', e => { if (linkFrom && !e.target.closest('.obj')) cancelLink(); });

  let raf;
  function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
  function rel(e, mb) { const r = e.getBoundingClientRect(); return { x: r.left - mb.left, y: r.top - mb.top, w: r.width, h: r.height }; }
  function pathD(a, b) {
    const ax = a.x + a.w / 2, bx = b.x + b.w / 2;
    if (b.y + b.h <= a.y) { const y1 = a.y, y2 = b.y + b.h, d = (y1 - y2) / 2; return `M${ax},${y1} C${ax},${y1 - d} ${bx},${y2 + d} ${bx},${y2}`; }
    if (b.y >= a.y + a.h) { const y1 = a.y + a.h, y2 = b.y, d = (y2 - y1) / 2; return `M${ax},${y1} C${ax},${y1 + d} ${bx},${y2 - d} ${bx},${y2}`; }
    const right = b.x > a.x, x1 = right ? a.x + a.w : a.x, x2 = right ? b.x : b.x + b.w, y1 = a.y + a.h / 2, y2 = b.y + b.h / 2, d = (x2 - x1) / 2;
    return `M${x1},${y1} C${x1 + d},${y1} ${x2 - d},${y2} ${x2},${y2}`;
  }
  function mk(tag, attrs) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function draw() {
    const g = svg.querySelector('.lines');
    g.textContent = '';
    const mb = map.getBoundingClientRect();
    for (const [a, b] of st.links) {
      const A = map.querySelector(`.obj[data-id="${a}"]`), B = map.querySelector(`.obj[data-id="${b}"]`);
      if (!A || !B) continue;
      const d = pathD(rel(A, mb), rel(B, mb));
      const grp = mk('g', { class: 'lk' });
      const hit = mk('path', { d, class: 'hit' });
      const t = mk('title', {}); t.textContent = 'Clique para remover esta ligação'; hit.append(t);
      hit.addEventListener('click', () => {
        if (!confirm('Remover esta ligação de causa e efeito?')) return;
        st.links = st.links.filter(l => !(l[0] === a && l[1] === b)); save(); draw();
      });
      grp.append(mk('path', { d, class: 'ln', 'marker-end': 'url(#ah)' }), hit);
      g.append(grp);
    }
  }
  new ResizeObserver(schedule).observe(map);
  window.addEventListener('resize', schedule);
  window.addEventListener('beforeprint', draw);
  window.addEventListener('afterprint', draw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);

  syncFields();
  render();
})();
