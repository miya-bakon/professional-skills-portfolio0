/* =====================================================================
   main.js: builds the sidebar, the home page and the session pages using
   the text and photos stored in data.js
   ===================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const pad = n => String(n).padStart(2, '0');

/* ---------- 1. Light and dark theme (remembers your choice) ---------- */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  document.documentElement.dataset.bsTheme = t;      // keeps Bootstrap's own parts in step
  try { localStorage.setItem('theme', t); } catch (e) {}
  const btn = $('#theme');
  if (btn) btn.textContent = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}
let saved; try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

/* ---------- 2. Page frame: top bar (phones), sidebar and the content area ---------- */
function shell(content, currentId) {
  const links = SESSIONS.map(s =>
    `<a class="slink ${s.id === currentId ? 'on' : ''}" href="session.html?id=${s.id}"><span>${pad(s.id)}</span>${s.short}</a>`).join('');
  $('#root').innerHTML = `
    <header class="topbar d-lg-none">
      <button class="menu" data-bs-toggle="offcanvas" data-bs-target="#side" aria-label="Open menu">&#9776;</button>
      <b>Professional Skills</b>
    </header>
    <div class="shell">
      <aside class="offcanvas-lg offcanvas-start side" id="side" tabindex="-1">
        <div class="side-in">
          <button class="close d-lg-none" data-bs-dismiss="offcanvas" data-bs-target="#side" aria-label="Close menu">&times;</button>
          <a class="brand" href="index.html"><b>A.M.T.B. Abeykoon</b><small>SA25610228<br>Professional Skills, Year 2 Semester 2</small></a>
          <nav><a class="slink ${currentId ? '' : 'on'}" href="index.html">Home</a>${links}</nav>
          <button class="theme" id="theme"></button>
        </div>
      </aside>
      <main class="content">${content}</main>
    </div>
    <div id="bar"></div>`;
  $('#theme').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  setTheme(document.documentElement.dataset.theme);
}

/* ---------- 3. Building blocks used on the session pages ---------- */
let curId = 1;      // the session being shown, used for photo captions

// A row of photos. Clicking one opens it big (see the lightbox below)
const gallery = imgs => `<div class="gal g${Math.min(imgs.length, 3)}">` +
  imgs.map(src => `<figure><img src="${src}" loading="lazy" alt="Photo from session ${curId}"></figure>`).join('') + '</div>';

// A numbered list of steps, for bullet points that have no short heading of their own
const steps = ul => `<ul class="steps">${ul.map(b => `<li>${b[0] ? `<b>${b[0]}</b>` : ''}${b[1]}</li>`).join('')}</ul>`;

// Each diagram keeps its list here so a click can look up the text
const DG = [];

// HUB diagram: the points sit around a centre. Click one to read it
function hub(list) {
  const g = DG.push(list) - 1, n = list.length;
  let lines = '', nodes = '';
  list.forEach((b, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    const x = Math.round(350 + 235 * Math.cos(a)), y = Math.round(190 + 140 * Math.sin(a));
    const label = b[0].length > 26 ? b[0].slice(0, 25) + '…' : b[0];
    lines += `<line x1="350" y1="190" x2="${x}" y2="${y}"/>`;
    nodes += `<g class="nd" data-i="${i}" tabindex="0" role="button"><rect x="${x - 105}" y="${y - 18}" width="210" height="36" rx="18"/>
              <text x="${x}" y="${y + 5}" text-anchor="middle">${label}</text></g>`;
  });
  return `<div class="dg" data-g="${g}"><svg class="hub" viewBox="0 0 700 380">${lines}
    <circle class="core" cx="350" cy="190" r="42"/><text class="core-t" x="350" y="194" text-anchor="middle">${n}</text>
    <text class="core-s" x="350" y="211" text-anchor="middle">points</text>${nodes}</svg><div class="panel"></div></div>`;
}

// FLOW diagram: points that happen in order, shown as numbered steps joined by arrows
function flow(list) {
  const g = DG.push(list) - 1;
  return `<div class="dg" data-g="${g}"><ol class="flow">${list.map((b, i) =>
    `<li><button class="fnode" data-i="${i}"><em>${i + 1}</em>${b[0]}</button></li>`).join('')}</ol><div class="panel"></div></div>`;
}

// Bullet points with three or more headings become a diagram, everything else becomes a step list
function bullets(ul, asFlow) {
  if (ul.length >= 3 && ul.every(b => b[0])) return asFlow ? flow(ul) : hub(ul);
  return steps(ul);
}

// Sessions whose key-concept blocks are processes, so they get a flow instead of a hub: { sessionId: [block numbers] }
const FLOW = { 5: [0, 1] };

// Turns a list of paragraphs, small headings, bullet lists and photos into HTML
const items = (list, asFlow) => list.map(it =>
  it.p ? `<p>${it.p}</p>` : it.h ? `<h4 class="sub">${it.h}</h4>` : it.img ? gallery(it.img) : bullets(it.ul, asFlow)).join('');

// Shows the text for one point of a diagram in its panel and highlights that point
function fill(box, i) {
  const [term, text] = DG[box.dataset.g][i];
  $('.panel', box).innerHTML = `<b>${term}</b><br>${text}`;
  $$('[data-i]', box).forEach(n => n.classList.toggle('on', +n.dataset.i === i));
}

/* ---------- 4. Home page ---------- */
function home() {
  const acts = SESSIONS.reduce((n, s) => n + s.activities.length, 0);
  const photos = SESSIONS.reduce((n, s) => n + [s.overview, s.reflection, ...s.blocks.map(b => b.items), ...s.activities.map(a => a.items)]
    .flat().filter(it => it.img).reduce((m, it) => m + it.img.length, 0), 0);
  const stat = (n, label) => `<div class="stat"><b data-n="${n}">0</b><span>${label}</span></div>`;
  const keys = Object.keys(TAGS);

  shell(`
    <section class="hero rv">
      <p class="eyebrow">Higher Diploma in IT, Year 2 Semester 2</p>
      <h1>Professional Skills Portfolio</h1>
      <p class="lede">Eleven sessions, from workplace etiquette to negotiation. Every page keeps my notes from the lecture, the activities we did and my own reflection.</p>
      <div class="stats">${stat(SESSIONS.length, 'Sessions')}${stat(acts, 'Activities')}${stat(photos, 'Photos')}${stat(keys.length, 'Skill areas')}</div>
    </section>

    <!-- SKILLS MATRIX: a dot means that session built that skill. Click a skill to filter the sessions below -->
    <section class="rv"><h2>Skills matrix</h2>
      <p class="muted" id="fnote">Click a skill to see which sessions built it.</p>
      <div class="mwrap"><table class="matrix"><thead><tr><th></th>${keys.map(k => `<th data-t="${k}"><button>${TAGS[k]}</button></th>`).join('')}</tr></thead>
        <tbody>${SESSIONS.map(s => `<tr data-tags="${s.tags}"><td><a href="session.html?id=${s.id}">${pad(s.id)}&nbsp; ${s.short}</a></td>
          ${keys.map(k => `<td data-t="${k}">${s.tags.includes(k) ? '<i></i>' : ''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    </section>

    <section class="rv"><h2>All sessions</h2>
      <div class="cards">${SESSIONS.map(s => `<a class="card-s" href="session.html?id=${s.id}" data-tags="${s.tags}">
        <div class="thumb ${s.cover ? '' : 'none'}" ${s.cover ? `style="background-image:url('${s.cover}')"` : ''}><span>${pad(s.id)}</span></div>
        <div class="cb"><h3>${s.title}</h3><p>${s.date}</p><small>${s.lecturer}</small></div></a>`).join('')}</div>
    </section>`);

  // Count the numbers up when the page opens
  $$('.stat b').forEach(el => {
    const end = +el.dataset.n; let n = 0;
    const tick = () => { n += Math.max(1, Math.round(end / 25)); el.textContent = Math.min(n, end); if (n < end) requestAnimationFrame(tick); };
    tick();
  });

  // Clicking a skill column highlights it and fades the sessions that don't have it
  let active = null;
  $('.matrix').onclick = e => {
    const th = e.target.closest('th[data-t]');
    if (!th) return;
    active = active === th.dataset.t ? null : th.dataset.t;
    $$('.matrix [data-t]').forEach(c => c.classList.toggle('hl', c.dataset.t === active));
    $$('[data-tags]').forEach(el => el.classList.toggle('dim', !!active && !el.dataset.tags.split(',').includes(active)));
    $('#fnote').textContent = active ? `Showing the sessions that built ${TAGS[active]}. Click it again to clear.` : 'Click a skill to see which sessions built it.';
  };
}

/* ---------- 5. Session page ---------- */
function session() {
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const s = SESSIONS.find(x => x.id === id) || SESSIONS[0];
  const prev = SESSIONS[s.id - 2], next = SESSIONS[s.id];
  curId = s.id;
  document.title = `${s.short} | Professional Skills Portfolio`;

  // The interview session has three stages, so show them as a small chain that jumps to each one
  const stages = s.id === 8 ? `<h4 class="sub">The three stages</h4><ol class="flow">${s.blocks.map((b, i) =>
    `<li><a class="fnode" href="#blk-${i}"><em>${i + 1}</em>${b.title}</a></li>`).join('')}</ol>` : '';

  // Only sections the session actually has will be shown
  const secs = [
    ['ov', 'Overview', 'Session Overview', s.overview.length && `<div class="prose">${items(s.overview)}</div>`],
    ['ki', 'Key concepts', 'Key Concepts and Learning Outcomes', s.blocks.length && stages + s.blocks.map((b, i) =>
      `<article class="blk rv" id="blk-${i}">${b.title ? `<h3>${b.title}</h3>` : ''}${items(b.items, (FLOW[s.id] || []).includes(i))}</article>`).join('')],
    ['ac', 'Activities', 'Practical Activities', s.activities.length && s.activities.map((a, i) =>
      `<article class="blk rv" id="act-${i}"><h3>${a.title}</h3>${items(a.items)}</article>`).join('')],
    ['rf', 'Reflection', 'My Personal Reflection', s.reflection.length && `<div class="prose">${items(s.reflection)}</div>`]
  ].filter(x => x[3]);

  shell(`
    <header class="shead rv">
      <p class="eyebrow">Session ${pad(s.id)}</p>
      <h1>${s.title}</h1>
      <dl class="meta"><div><dt>Date</dt><dd>${s.date}</dd></div><div><dt>Lecturer</dt><dd>${s.lecturer}</dd></div>
        ${s.evaluated_by ? `<div><dt>Evaluated by</dt><dd>${s.evaluated_by}</dd></div>` : ''}</dl>
      <blockquote class="pull"><small>From my reflection</small>“${s.quote}”</blockquote>
    </header>
    <nav class="subnav">${secs.map(x => `<a href="#sec-${x[0]}">${x[1]}</a>`).join('')}</nav>
    ${secs.map(x => `<section class="sec" id="sec-${x[0]}"><h2>${x[2]}</h2>${x[3]}</section>`).join('')}
    <nav class="pager">
      ${prev ? `<a href="session.html?id=${prev.id}"><small>Previous</small>${prev.short}</a>` : '<span></span>'}
      ${next ? `<a href="session.html?id=${next.id}"><small>Next</small>${next.short}</a>` : `<a href="index.html"><small>Finished</small>Back to home</a>`}
    </nav>`, s.id);

  // Fill every diagram with its first point so the panel is never empty
  $$('.dg').forEach(box => fill(box, 0));

  // Highlight the section you are reading in the little menu at the top
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('.subnav a').forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  }), { rootMargin: '-20% 0px -70% 0px' });
  $$('.sec').forEach(sec => spy.observe(sec));

  // Left and right arrow keys move between sessions
  document.onkeydown = e => {
    if (e.key === 'ArrowLeft' && prev) location.href = `session.html?id=${prev.id}`;
    if (e.key === 'ArrowRight' && next) location.href = `session.html?id=${next.id}`;
  };
}

/* ---------- 6. Things that work on every page ---------- */
document.addEventListener('click', e => {
  // Diagram points
  const pt = e.target.closest('.dg [data-i]');
  if (pt) fill(pt.closest('.dg'), +pt.dataset.i);
  // Photos open in a lightbox
  const img = e.target.closest('.gal img');
  if (img) { $('#lb img').src = img.src; $('#lb').hidden = false; }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $('#lb').hidden = true;
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.nd')) { e.preventDefault(); fill(e.target.closest('.dg'), +e.target.dataset.i); }
});

// Reading progress bar
addEventListener('scroll', () => {
  const h = document.documentElement, bar = $('#bar');
  if (bar) bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + '%';
});

/* ---------- Start ---------- */
document.body.insertAdjacentHTML('beforeend', '<div id="lb" hidden onclick="this.hidden = true"><img alt=""></div>');
document.body.dataset.page === 'home' ? home() : session();

// Fade things in as they scroll into view
const reveal = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); } }), { threshold: .08 });
$$('.rv').forEach(el => reveal.observe(el));
