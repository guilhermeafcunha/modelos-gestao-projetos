/* Motor genérico de canvas com notas adesivas.
   Cada página define window.CANVAS = { id, title, subtitle, areas, cols?, rows?, blocks:[{id,t,i,h,c,n?,style?,label?}], example? } */
(function () {
  'use strict';
  const C = window.CANVAS, { el, uid, toast } = UI;
  const S = UI.store('pmtool:' + C.id);
  const COLORS = ['#fde68a', '#fbcfe8', '#bfdbfe', '#bbf7d0', '#ddd6fe', '#fed7aa'];
  const blocks = C.blocks.filter(b => !b.label);
  const defColor = {};
  blocks.forEach((b, i) => { defColor[b.id] = b.n || COLORS[i % COLORS.length]; });
  const okColor = c => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c);

  function normalize(d) {
    if (!d || typeof d !== 'object') return null;
    const src = d.notes && typeof d.notes === 'object' ? d.notes : {};
    const out = { project: typeof d.project === 'string' ? d.project.slice(0, 200) : '', notes: {} };
    for (const b of blocks) {
      const arr = Array.isArray(src[b.id]) ? src[b.id] : [];
      out.notes[b.id] = arr.map(n => (typeof n === 'string' ? { t: n } : n))
        .filter(n => n && typeof n.t === 'string' && n.t.trim()).slice(0, 200)
        .map(n => ({ id: uid(), t: n.t.slice(0, 2000), c: okColor(n.c) ? n.c : defColor[b.id] }));
    }
    return out;
  }
  let state = normalize(S.load()) || normalize({});
  const hasNotes = () => blocks.some(b => state.notes[b.id].length);
  let saveT;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { if (S.save(state)) bar.flashSaved(); }, 250); }
  const fileBase = () => UI.slug(state.project) + '-' + C.id;

  const bar = UI.topbar({
    title: C.title, subtitle: C.subtitle, project: state.project,
    onProject: v => { state.project = v; save(); },
    actions: [
      C.example && { label: 'Exemplo', icon: '✨', title: 'Carregar um exemplo preenchido', onClick: loadExample },
      { label: 'Markdown', icon: '📝', title: 'Baixar como Markdown (.md)', onClick: exportMd },
      { label: 'Exportar', icon: '⬇', title: 'Baixar arquivo .json para editar depois', onClick: () => UI.download(fileBase() + '.json', JSON.stringify({ tool: C.id, project: state.project, notes: mapNotes(n => ({ t: n.t, c: n.c })) }, null, 2)) },
      { label: 'Importar', icon: '⬆', title: 'Abrir um arquivo .json exportado', onClick: () => UI.pickFile(d => {
        const n = normalize(d); if (!n) return toast('Arquivo inválido');
        state = n; bar.setProject(state.project); renderAll(); save(); toast('Canvas importado');
      }) },
      { label: 'Limpar', icon: '🗑', title: 'Apagar todas as notas', onClick: () => {
        if (hasNotes() && !confirm('Apagar todas as notas deste canvas?')) return;
        state = normalize({ project: state.project }); renderAll(); save();
      } },
      { label: 'Imprimir / PDF', icon: '🖨', primary: true, title: 'Imprimir ou salvar como PDF', onClick: () => window.print() }
    ]
  });
  function mapNotes(f) { const o = {}; for (const b of blocks) o[b.id] = state.notes[b.id].map(f); return o; }

  // ---------- Quadro ----------
  const board = el('main', { class: 'board', id: 'board' });
  const nCols = C.areas[0].trim().split(/\s+/).length;
  board.style.gridTemplateAreas = C.areas.map(r => `"${r}"`).join(' ');
  board.style.gridTemplateColumns = C.cols || `repeat(${nCols}, minmax(0, 1fr))`;
  board.style.gridTemplateRows = C.rows || `repeat(${C.areas.length}, minmax(150px, 1fr))`;
  document.body.append(board,
    el('p', { class: 'tip' }, 'Dicas: clique em + para criar uma nota · arraste pelo ⠿ para mover entre blocos · ● muda a cor · Ctrl+Enter cria a próxima nota · tudo é salvo automaticamente neste navegador.'));

  const refs = {};
  for (const b of C.blocks) {
    if (b.label) {
      board.append(el('div', { class: 'glabel' + (b.cls ? ' ' + b.cls : ''), style: `grid-area:${b.id};--c:${b.c || 'var(--muted)'}` }, b.t));
      continue;
    }
    const notes = el('div', { class: 'notes', 'data-id': b.id });
    const cnt = el('span', { class: 'cnt' });
    board.append(el('section', { class: 'block', style: `grid-area:${b.id};--c:${b.c};${b.style || ''}`, 'aria-label': b.t },
      el('div', { class: 'bh' },
        el('span', { class: 'ico', 'aria-hidden': 'true' }, b.i || '•'),
        el('h2', {}, b.t), cnt,
        el('button', { class: 'add', title: 'Adicionar nota', 'aria-label': 'Adicionar nota em ' + b.t, onclick: () => addNote(b.id) }, '+')),
      notes));
    refs[b.id] = { notes, cnt, b };
    wireDrop(notes, b.id);
  }

  function updCount(bid) { const n = state.notes[bid].length; refs[bid].cnt.textContent = n; refs[bid].cnt.hidden = !n; }
  function renderNotes(bid) {
    const { notes, b } = refs[bid];
    notes.textContent = '';
    updCount(bid);
    const arr = state.notes[bid];
    if (!arr.length) { notes.append(el('div', { class: 'empty', onclick: () => addNote(bid) }, b.h || 'Clique em + para adicionar')); return; }
    for (const n of arr) notes.append(noteEl(n));
  }
  function renderAll() { blocks.forEach(b => renderNotes(b.id)); }
  const findBlock = id => { for (const b of blocks) if (state.notes[b.id].some(n => n.id === id)) return b.id; return null; };

  function noteEl(n) {
    const d = el('div', { class: 'note', 'data-id': n.id, style: '--note:' + n.c });
    const txt = el('div', { class: 'txt', contenteditable: 'true', spellcheck: 'true', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Texto da nota' });
    txt.textContent = n.t;
    txt.addEventListener('input', () => { n.t = txt.innerText.replace(/\n$/, ''); save(); });
    txt.addEventListener('keydown', e => {
      if (e.key === 'Escape') txt.blur();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); const bid = findBlock(n.id); txt.blur(); if (bid) addNote(bid); }
    });
    txt.addEventListener('blur', () => { if (!n.t.trim()) removeNote(n.id, true); });
    const grip = el('span', { class: 'grip', title: 'Arrastar para outro bloco' }, '⠿');
    grip.addEventListener('pointerdown', () => { d.draggable = true; });
    d.addEventListener('dragstart', e => {
      dragId = n.id; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', n.id);
      requestAnimationFrame(() => d.classList.add('dragging'));
    });
    d.addEventListener('dragend', endDrag);
    const dot = el('button', { class: 'dot', title: 'Mudar cor', 'aria-label': 'Mudar cor da nota', onclick: () => {
      n.c = COLORS[(COLORS.indexOf(n.c) + 1) % COLORS.length]; d.style.setProperty('--note', n.c); save();
    } });
    const del = el('button', { title: 'Excluir nota', 'aria-label': 'Excluir nota', onclick: () => removeNote(n.id) }, '×');
    d.append(txt, el('div', { class: 'tools' }, grip, dot, del));
    return d;
  }

  function addNote(bid) {
    const n = { id: uid(), t: '', c: defColor[bid] };
    const arr = state.notes[bid];
    arr.push(n);
    if (arr.length === 1) refs[bid].notes.textContent = '';
    const d = noteEl(n);
    refs[bid].notes.append(d);
    updCount(bid);
    d.querySelector('.txt').focus();
  }
  function removeNote(id, silent) {
    const bid = findBlock(id); if (!bid) return;
    const arr = state.notes[bid];
    arr.splice(arr.findIndex(n => n.id === id), 1);
    const node = refs[bid].notes.querySelector(`.note[data-id="${id}"]`);
    if (node) node.remove();
    if (!arr.length) renderNotes(bid); else updCount(bid);
    save();
    if (!silent) toast('Nota excluída');
  }

  // ---------- Arrastar e soltar ----------
  let dragId = null;
  function endDrag() {
    dragId = null;
    document.querySelectorAll('.note[draggable="true"]').forEach(x => { x.draggable = false; x.classList.remove('dragging'); });
    document.querySelectorAll('.notes.over').forEach(x => x.classList.remove('over'));
  }
  document.addEventListener('pointerup', () => { if (!dragId) document.querySelectorAll('.note[draggable="true"]').forEach(x => { x.draggable = false; }); });
  function wireDrop(z, bid) {
    z.addEventListener('dragover', e => { if (!dragId) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; z.classList.add('over'); });
    z.addEventListener('dragleave', e => { if (!z.contains(e.relatedTarget)) z.classList.remove('over'); });
    z.addEventListener('drop', e => {
      if (!dragId) return;
      e.preventDefault();
      const id = dragId, tgt = e.target.closest('.note');
      endDrag();
      moveNote(id, bid, tgt && tgt.dataset.id !== id ? tgt.dataset.id : null);
    });
  }
  function moveNote(id, to, beforeId) {
    const from = findBlock(id); if (!from) return;
    const a = state.notes[from];
    const n = a.splice(a.findIndex(x => x.id === id), 1)[0];
    const b = state.notes[to];
    const i = beforeId ? b.findIndex(x => x.id === beforeId) : -1;
    if (i < 0) b.push(n); else b.splice(i, 0, n);
    renderNotes(from); if (from !== to) renderNotes(to);
    save();
  }

  // ---------- Exportações ----------
  function exportMd() {
    let s = `# ${C.title}${state.project ? ' — ' + state.project : ''}\n\n_Gerado em ${new Date().toLocaleDateString('pt-BR')}_\n`;
    for (const b of blocks) {
      s += `\n## ${b.t}\n\n`;
      const a = state.notes[b.id];
      s += a.length ? a.map(n => '- ' + n.t.replace(/\s*\n\s*/g, ' ')).join('\n') + '\n' : '_(vazio)_\n';
    }
    UI.download(fileBase() + '.md', s, 'text/markdown');
  }
  function loadExample() {
    if (hasNotes() && !confirm('Substituir o conteúdo atual pelo exemplo?')) return;
    state = normalize(C.example); bar.setProject(state.project); renderAll(); save();
    toast('Exemplo carregado. Edite à vontade.');
  }

  renderAll();
})();
