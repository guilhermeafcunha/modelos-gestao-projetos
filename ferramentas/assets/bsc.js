/* Balanced Scorecard: objetivos, indicadores, metas, farol e iniciativas por perspectiva */
(function () {
  'use strict';
  const { el, uid, toast } = UI;
  const NS = 'http://www.w3.org/2000/svg';
  const S = UI.store('pmtool:bsc');
  const PERSP = [
    { id: 'fin', name: 'Financeira', c: '#059669' },
    { id: 'cli', name: 'Clientes', c: '#2563eb' },
    { id: 'pro', name: 'Processos Internos', c: '#d97706' },
    { id: 'apr', name: 'Aprendizado e Crescimento', c: '#7c3aed' }
  ];
  const PIDS = new Set(PERSP.map(p => p.id));
  const FC = { g: '#16a34a', y: '#d97706', r: '#dc2626', n: '#94a3b8' };
  const str = (v, n) => (typeof v === 'string' || typeof v === 'number' ? String(v).slice(0, n) : '');
  const readMap = () => { const m = UI.store('pmtool:mapa').load(); return m && typeof m === 'object' ? m : null; };
  function pname(p) { const m = readMap(); const n = m && m.names && m.names[p.id]; return typeof n === 'string' && n.trim() ? n.slice(0, 60) : p.name; }

  function norm(d) {
    if (!d || typeof d !== 'object') return null;
    return {
      project: str(d.project, 200),
      rows: (Array.isArray(d.rows) ? d.rows : []).filter(r => r && PIDS.has(r.p)).slice(0, 300).map(r => ({
        id: uid(), p: r.p, obj: str(r.obj, 300), kpi: str(r.kpi, 300), dir: r.dir === 'down' ? 'down' : 'up',
        meta: str(r.meta, 40), atual: str(r.atual, 40), ini: str(r.ini, 400), resp: str(r.resp, 100), prazo: str(r.prazo, 40)
      }))
    };
  }
  let st = norm(S.load()) || { project: '', rows: [] };
  let saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { if (S.save(st)) bar.flashSaved(); }, 250); }

  const EX = {
    project: 'Metalúrgica Exemplo S.A.',
    rows: [
      { p: 'fin', obj: 'Aumentar a rentabilidade', kpi: 'Margem EBITDA (%)', dir: 'up', meta: '18', atual: '16,2', ini: 'Programa de excelência operacional', resp: 'Diretoria Financeira', prazo: '12/2027' },
      { p: 'fin', obj: 'Reduzir o custo unitário', kpi: 'Custo por peça (R$)', dir: 'down', meta: '42', atual: '45,10', ini: 'Projeto de redução de setup (SMED)', resp: 'Eng. de Processos', prazo: '06/2027' },
      { p: 'cli', obj: 'Entregar no prazo e completo (OTIF)', kpi: 'OTIF (%)', dir: 'up', meta: '95', atual: '91', ini: 'Implantar S&OP mensal', resp: 'PCP', prazo: '03/2027' },
      { p: 'cli', obj: 'Elevar a satisfação dos clientes', kpi: 'NPS', dir: 'up', meta: '60', atual: '64', ini: 'Pesquisa trimestral e plano de ação', resp: 'Comercial', prazo: 'Contínuo' },
      { p: 'pro', obj: 'Aumentar a eficiência dos equipamentos (OEE)', kpi: 'OEE (%)', dir: 'up', meta: '75', atual: '68', ini: 'TPM nas linhas 2 e 3', resp: 'Manutenção', prazo: '09/2027' },
      { p: 'pro', obj: 'Reduzir refugo e retrabalho', kpi: 'Índice de refugo (%)', dir: 'down', meta: '2', atual: '2,6', ini: 'Projetos DMAIC Green Belt', resp: 'Qualidade', prazo: '06/2027' },
      { p: 'apr', obj: 'Capacitar a equipe em Lean Seis Sigma', kpi: 'Horas de treinamento por pessoa', dir: 'up', meta: '24', atual: '20', ini: 'Academia Lean interna', resp: 'RH', prazo: '12/2027' },
      { p: 'apr', obj: 'Implantar o sistema MES', kpi: '% de linhas no MES', dir: 'up', meta: '80', atual: '40', ini: 'Projeto MES – fase 2', resp: 'TI Industrial', prazo: '12/2027' }
    ]
  };

  const bar = UI.topbar({
    title: 'Balanced Scorecard', subtitle: 'Objetivos · indicadores · metas · farol · iniciativas', project: st.project,
    onProject: v => { st.project = v; save(); },
    actions: [
      { label: 'Exemplo', icon: '✨', title: 'Carregar um exemplo preenchido', onClick: () => {
        if (st.rows.length && !confirm('Substituir o BSC atual pelo exemplo?')) return;
        st = norm(EX); bar.setProject(st.project); render(); save(); toast('Exemplo carregado. Edite à vontade.');
      } },
      { label: 'Importar do mapa', icon: '🗺', title: 'Trazer os objetivos do Mapa Estratégico salvo neste navegador', onClick: importMap },
      { label: 'Markdown', icon: '📝', title: 'Baixar tabela em Markdown (.md)', onClick: exportMd },
      { label: 'Exportar', icon: '⬇', title: 'Baixar arquivo .json', onClick: () => UI.download(UI.slug(st.project) + '-bsc.json', JSON.stringify({ tool: 'bsc', project: st.project, rows: st.rows.map(({ id, ...r }) => r) }, null, 2)) },
      { label: 'Importar', icon: '⬆', title: 'Abrir um arquivo .json', onClick: () => UI.pickFile(d => {
        const n = norm(d); if (!n) return toast('Arquivo inválido');
        st = n; bar.setProject(st.project); render(); save(); toast('BSC importado');
      }) },
      { label: 'Limpar', icon: '🗑', title: 'Apagar todos os indicadores', onClick: () => {
        if (st.rows.length && !confirm('Apagar todos os indicadores?')) return;
        st.rows = []; render(); save();
      } },
      { label: 'Imprimir / PDF', icon: '🖨', primary: true, onClick: () => window.print() }
    ]
  });

  // ---------- Cálculos ----------
  function num(v) {
    let s = String(v == null ? '' : v).trim().replace(/[\s%R$]/g, '');
    if (!s) return null;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    const x = Number(s);
    return Number.isFinite(x) ? x : null;
  }
  function ating(r) {
    const m = num(r.meta), a = num(r.atual);
    if (m == null || a == null) return null;
    let v;
    if (r.dir === 'down') { if (a <= 0) return 1.5; v = m / a; }
    else { if (m === 0) return null; v = a / m; }
    return Math.max(0, Math.min(v, 1.5));
  }
  const farol = v => { if (v == null) return 'n'; const p = Math.round(v * 100); return p >= 100 ? 'g' : p >= 85 ? 'y' : 'r'; };
  const pct = v => (v == null ? '—' : Math.round(v * 100) + '%');
  function avg(rows) {
    const vs = rows.map(ating).filter(v => v != null);
    return vs.length ? vs.reduce((s, v) => s + Math.min(v, 1), 0) / vs.length : null;
  }

  // ---------- Layout ----------
  const COLS = [
    { k: 'obj', h: 'Objetivo estratégico', ph: 'Ex.: Aumentar a eficiência', w: 230 },
    { k: 'kpi', h: 'Indicador (KPI)', ph: 'Ex.: OEE (%)', w: 180 },
    { k: 'dir', h: 'Polaridade', type: 'dir' },
    { k: 'meta', h: 'Meta', num: true, ph: '0' },
    { k: 'atual', h: 'Atual', num: true, ph: '0' },
    { k: '_at', h: 'Atingimento', calc: true },
    { k: 'ini', h: 'Iniciativa estratégica', ph: 'Projeto ou plano de ação', w: 230 },
    { k: 'resp', h: 'Responsável', ph: 'Nome / área', w: 150 },
    { k: 'prazo', h: 'Prazo', ph: 'mm/aaaa', w: 90 }
  ];
  const wrap = el('main', { class: 'wrap' });
  const sumEl = el('section', { class: 'summary', 'aria-label': 'Resumo do desempenho' });
  const legend = el('div', { class: 'legend' },
    el('span', {}, el('i', { class: 'farol g' }), 'Meta atingida (≥ 100%)'),
    el('span', {}, el('i', { class: 'farol y' }), 'Atenção (85–99%)'),
    el('span', {}, el('i', { class: 'farol r' }), 'Crítico (< 85%)'),
    el('span', {}, el('i', { class: 'farol' }), 'Sem dados'),
    el('span', {}, '↓ “Menor melhor” calcula meta ÷ atual'));
  document.body.append(wrap, el('p', { class: 'tip' }, 'Dicas: use “Importar do mapa” para trazer os objetivos do Mapa Estratégico · números aceitam vírgula (16,2) · o atingimento é limitado a 150% e a média por perspectiva a 100%.'));
  const refs = {};

  function ring(v, color) {
    const r = 25, c = 2 * Math.PI * r, f = v == null ? 0 : Math.min(v, 1);
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 62 62'); s.setAttribute('class', 'ring'); s.setAttribute('role', 'img');
    s.setAttribute('aria-label', 'Atingimento ' + pct(v));
    s.innerHTML = `<circle class="bg" cx="31" cy="31" r="${r}" fill="none" stroke-width="7"/>` +
      `<circle cx="31" cy="31" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(f * c).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 31 31)"/>` +
      `<text x="31" y="35.5" text-anchor="middle">${pct(v)}</text>`;
    return s;
  }
  function kcard(title, rows, c) {
    const v = avg(rows), f = farol(v);
    const cnt = { g: 0, y: 0, r: 0 };
    rows.forEach(r => { const k = farol(ating(r)); if (k in cnt) cnt[k]++; });
    return el('div', { class: 'kcard', style: '--c:' + c }, ring(v, FC[f]),
      el('div', {}, el('h3', {}, title), el('small', {}, rows.length + (rows.length === 1 ? ' indicador' : ' indicadores')),
        el('div', { class: 'dots' },
          el('span', { title: 'Meta atingida' }, '🟢 ' + cnt.g), el('span', { title: 'Atenção' }, '🟡 ' + cnt.y), el('span', { title: 'Crítico' }, '🔴 ' + cnt.r))));
  }
  function summary() {
    sumEl.textContent = '';
    sumEl.append(kcard('Desempenho geral', st.rows, 'var(--accent)'));
    for (const p of PERSP) sumEl.append(kcard(pname(p), st.rows.filter(r => r.p === p.id), p.c));
  }

  function calc(tr, r) {
    const v = ating(r), f = farol(v), td = tr.querySelector('.calc');
    td.textContent = '';
    td.append(el('span', { class: 'pill' }, el('span', { class: 'farol ' + f }), pct(v),
      el('span', { class: 'bar' }, el('i', { style: `width:${v == null ? 0 : Math.min(v, 1) * 100}%;background:${FC[f]}` }))));
  }
  function rowEl(r) {
    const tr = el('tr', { 'data-id': r.id });
    const upd = () => { calc(tr, r); summary(); save(); };
    for (const c of COLS) {
      if (c.calc) { tr.append(el('td', { class: 'calc' })); continue; }
      if (c.type === 'dir') {
        const s = el('select', { 'aria-label': 'Polaridade' }, el('option', { value: 'up' }, '↑ Maior melhor'), el('option', { value: 'down' }, '↓ Menor melhor'));
        s.value = r.dir;
        s.addEventListener('change', () => { r.dir = s.value; upd(); });
        tr.append(el('td', {}, s));
        continue;
      }
      const i = el('input', { placeholder: c.ph || '', class: c.num ? 'num' : null, 'aria-label': c.h, inputmode: c.num ? 'decimal' : null, style: c.w ? 'min-width:' + c.w + 'px' : null });
      i.value = r[c.k];
      i.addEventListener('input', () => { r[c.k] = i.value; upd(); });
      tr.append(el('td', {}, i));
    }
    tr.append(el('td', {}, el('button', { class: 'rm', title: 'Excluir indicador', 'aria-label': 'Excluir indicador', onclick: () => {
      st.rows = st.rows.filter(x => x !== r); tr.remove(); refreshEmpty(r.p); summary(); save();
    } }, '×')));
    calc(tr, r);
    return tr;
  }
  function refreshEmpty(pid) {
    const tb = refs[pid].tbody, has = st.rows.some(r => r.p === pid), e = tb.querySelector('.empty-row');
    if (!has && !e) tb.append(el('tr', { class: 'empty-row' }, el('td', { colspan: String(COLS.length + 1) }, 'Nenhum indicador ainda. Clique em “+ Indicador” ou use “Importar do mapa”.')));
    if (has && e) e.remove();
  }
  function addRow(pid, data, focus) {
    const r = { id: uid(), p: pid, obj: '', kpi: '', dir: 'up', meta: '', atual: '', ini: '', resp: '', prazo: '', ...data };
    st.rows.push(r);
    const tr = rowEl(r);
    refs[pid].tbody.append(tr);
    refreshEmpty(pid);
    if (focus) tr.querySelector('input').focus();
    summary(); save();
  }
  function render() {
    wrap.textContent = '';
    wrap.append(sumEl, legend);
    for (const p of PERSP) {
      const tbody = el('tbody');
      st.rows.filter(r => r.p === p.id).forEach(r => tbody.append(rowEl(r)));
      refs[p.id] = { tbody };
      wrap.append(el('section', { class: 'persp', style: '--c:' + p.c, 'aria-label': 'Perspectiva ' + pname(p) },
        el('div', { class: 'persp-h' }, el('span', { class: 'pdot' }), el('h2', {}, pname(p)),
          el('button', { class: 'btn noprint', onclick: () => addRow(p.id, {}, true) }, '+ Indicador')),
        el('div', { class: 'tbl-wrap' }, el('table', { class: 'bsc' },
          el('thead', {}, el('tr', {}, COLS.map(c => el('th', { scope: 'col' }, c.h)), el('th', { scope: 'col' }, el('span', { class: 'sr' }, '')))),
          tbody))));
      refreshEmpty(p.id);
    }
    summary();
  }

  function importMap() {
    const m = readMap();
    const objs = m && Array.isArray(m.objs) ? m.objs : [];
    if (!objs.length) return toast('Nenhum mapa salvo neste navegador. Crie um no Mapa Estratégico.');
    const have = new Set(st.rows.map(r => r.obj.trim().toLowerCase()));
    let n = 0;
    for (const o of objs) {
      if (!o || !PIDS.has(o.p) || typeof o.t !== 'string' || !o.t.trim()) continue;
      const t = o.t.trim().slice(0, 300);
      if (have.has(t.toLowerCase())) continue;
      have.add(t.toLowerCase());
      st.rows.push({ id: uid(), p: o.p, obj: t, kpi: '', dir: 'up', meta: '', atual: '', ini: '', resp: '', prazo: '' });
      n++;
    }
    if (!st.project && typeof m.project === 'string') { st.project = m.project.slice(0, 200); bar.setProject(st.project); }
    render(); save();
    toast(n ? `${n} objetivo(s) importado(s) do mapa. Agora defina os indicadores.` : 'Todos os objetivos do mapa já estão no BSC');
  }

  function exportMd() {
    const esc = s => String(s || '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');
    let s = `# Balanced Scorecard${st.project ? ' — ' + st.project : ''}\n\n_Gerado em ${new Date().toLocaleDateString('pt-BR')} · desempenho geral: ${pct(avg(st.rows))}_\n`;
    const ic = { g: '🟢', y: '🟡', r: '🔴', n: '⚪' };
    for (const p of PERSP) {
      const rows = st.rows.filter(r => r.p === p.id);
      s += `\n## ${pname(p)} — ${pct(avg(rows))}\n\n| Objetivo | Indicador | Polaridade | Meta | Atual | Atingimento | Iniciativa | Responsável | Prazo |\n|---|---|---|---|---|---|---|---|---|\n`;
      s += rows.length ? rows.map(r => { const v = ating(r); return `| ${esc(r.obj)} | ${esc(r.kpi)} | ${r.dir === 'down' ? '↓' : '↑'} | ${esc(r.meta)} | ${esc(r.atual)} | ${ic[farol(v)]} ${pct(v)} | ${esc(r.ini)} | ${esc(r.resp)} | ${esc(r.prazo)} |`; }).join('\n') + '\n' : '| _(vazio)_ | | | | | | | | |\n';
    }
    UI.download(UI.slug(st.project) + '-bsc.md', s, 'text/markdown');
  }

  render();
  if (location.hash === '#importar') { history.replaceState(null, '', location.pathname); importMap(); }
})();
