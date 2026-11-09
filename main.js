/*  PROFESSIONAL SKILLS / PRESENTATION LAYER */

/* ---------- Site data, visual identities and reusable DOM helpers ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const fmt = number => String(number).padStart(2, '0');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const chapterLink = id => `session.html?id=${id}`;
const ACCENTS = ['#CE7149','#517D81','#8E72C5','#BC8B3C','#487D9B','#809B6E','#B66D84','#6A78BD','#BB7351','#6C9F91','#9370B8'];
const COVER_OVERRIDES = {1:'s1-2.jpg',2:'s2-2.jpg',9:'s9-4.jpg',10:'s10-2.jpg',11:'s11-2.jpg'};
const displayCover = s => COVER_OVERRIDES[s.id] || s.cover;
const CHAPTER_LABELS = ['Communication','Career readiness','Time management','Meetings','Research','Self-awareness','Leadership','Interviews','Etiquette','Emotional intelligence','Negotiation'];
const CHAPTER_SUBTITLES = [
  'The small details of professional communication',
  'Building a professional identity with purpose',
  'When the clock becomes part of the challenge',
  'Everything that happens beyond the meeting table',
  'From curiosity to careful investigation',
  'Learning to see myself from another angle',
  'Making space for someone else to lead',
  'Confidence begins before the interview',
  'Professionalism beyond first impressions',
  'The difference between reacting and responding',
  'Finding common ground through exchange'
];
const SKILL_LABELS = {comm:'Communication',team:'Teamwork',self:'Self-development',career:'Career readiness',time:'Time management',research:'Research',conflict:'Conflict resolution'};

/* ---------- Line icons: hand-drawn-style SVG paths, never emoji glyphs ---------- */
const ICONS = {
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>', arrowleft:'<path d="M19 12H5m6-6-6 6 6 6"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
  book:'<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zm0 0v14"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 15a8.5 8.5 0 0 1-11-11A9 9 0 1 0 20 15z"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>', close:'<path d="M5 5l14 14M19 5 5 19"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  spark:'<path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  chevron:'<path d="m7 10 5 5 5-5"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  handshake:'<path d="m3 8 4-3 5 2 5-2 4 3-2 9-4 3-3-2-2 1-3-3-3-2zM9 10l4 3 3-3M7 15l3 3"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 17 5-5 4 4 3-3 6 6"/>',
  pen:'<path d="m4 20 4-1 11-11-3-3L5 16l-1 4zM14 7l3 3"/>',
  puzzle:'<path d="M4 4h6c-1 3 1 4 2 4s3-1 2-4h6v6c-3-1-4 1-4 2s1 3 4 2v6h-6c1-3-1-4-2-4s-3 1-2 4H4v-6c3 1 4-1 4-2s-1-3-4-2z"/>',
  chat:'<path d="M4 5h16v12H9l-5 4V5z"/>',
  external:'<path d="M14 4h6v6M20 4l-9 9M19 14v6H4V5h6"/>'
};
function icon(name, size = 20){return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.spark}</svg>`;}

/* ---------- Theme switcher and a compact, accessible mobile menu ---------- */
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('ps-theme') || 'light'; } catch (_) {}
document.documentElement.dataset.theme = savedTheme;
function changeTheme(){
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('ps-theme', next); } catch (_) {}
  const button = $('#theme-toggle');
  if(button){button.innerHTML = `${icon(next === 'dark' ? 'sun' : 'moon')}<span class="sr-only">Switch to ${next === 'dark' ? 'light' : 'dark'} mode</span>`;}
}
function header(active = 'home'){
  const pages = [['index.html#journey','Explore sessions'],['index.html#highlights','Highlights'],['index.html#about','About']];
  return `<header class="site-header"><div class="header-inner">
    <a class="signature" href="index.html" aria-label="Portfolio homepage"><span class="signature-mark">ab<span class="signature-dot">.</span></span><span class="signature-name">A.M.T.B. Abeykoon<small>Professional Skills Portfolio</small></span></a>
    <nav class="desktop-nav" aria-label="Primary navigation">${pages.map(([href,label])=>`<a href="${href}" ${active === label?'aria-current="page"':''}>${label}</a>`).join('')}</nav>
    <div class="header-actions"><button class="icon-button" id="theme-toggle" type="button" aria-label="Toggle light and dark mode">${icon(savedTheme === 'dark' ? 'sun' : 'moon')}</button><button class="icon-button mobile-only" id="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Toggle navigation">${icon('menu')}</button></div>
  </div><nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden>${pages.map(([href,label])=>`<a href="${href}">${label}</a>`).join('')}</nav></header>`;
}
function footer(){return `<footer class="site-footer"><div class="footer-inner"><div><strong>Learning, documented.</strong><p>A reflective record of the Professional Skills module · Year 2, Semester 2</p></div><a href="index.html">Back to the beginning ${icon('arrow',17)}</a><small>© 2026 A.M.T.B. Abeykoon</small></div></footer>`;}
function chrome(pageMarkup, active){
  $('#root').innerHTML = `${header(active)}<main id="main-content">${pageMarkup}</main>${footer()}<div id="lightbox" class="lightbox" hidden role="dialog" aria-modal="true" aria-label="Image preview"><button type="button" class="lightbox-close" aria-label="Close image preview">${icon('close')}</button><img src="" alt="Enlarged session evidence"></div>`;
  $('#theme-toggle').addEventListener('click', changeTheme);
  $('#menu-toggle').addEventListener('click', () => {const nav=$('#mobile-nav'),open=nav.hidden;nav.hidden=!open;$('#menu-toggle').setAttribute('aria-expanded',String(open));});
}

/* ---------- Source-faithful text rendering from the unchanged data.js ---------- */
function photoUrls(section){return (section||[]).filter(item=>item.img).flatMap(item=>item.img);}
function allPhotos(s){return [...new Set([s.cover, ...photoUrls(s.overview),...s.blocks.flatMap(b=>photoUrls(b.items)),...s.activities.flatMap(a=>photoUrls(a.items)),...photoUrls(s.reflection)].filter(Boolean))];}
function renderList(entries){
  return `<ul class="source-list">${entries.map(pair => `<li>${pair[0]?`<strong>${esc(pair[0])}</strong>`:''}${esc(pair[1])}</li>`).join('')}</ul>`;
}
function renderItems(items){
  return (items||[]).map(item => item.p ? `<p>${esc(item.p)}</p>` : item.h ? `<h4 class="minor-heading">${esc(item.h)}</h4>` : item.ul ? renderList(item.ul) : item.img ? gallery(item.img) : '').join('');
}
function gallery(urls){return `<div class="photo-grid photo-count-${Math.min(urls.length,3)}">${urls.map((src,i)=>`<button class="photo-tile" type="button" data-zoom="${esc(src)}" aria-label="Enlarge evidence photograph ${i+1}"><img loading="lazy" src="${esc(src)}" alt="Photograph from this Professional Skills session"></button>`).join('')}</div>`;}
function dataCard(block,i){return `<article class="concept-card"><div class="concept-label"><span>${fmt(i+1)}</span><h3>${esc(block.title || 'Understanding negotiation')}</h3></div><div class="source-body">${renderItems(block.items)}</div></article>`;}
function sectionHeading(kicker,title,summary=''){return `<div class="section-intro"><div class="section-kicker">${esc(kicker)}</div><h2>${esc(title)}</h2>${summary ? `<p>${esc(summary)}</p>` : ''}</div>`;}

/* ---------- Homepage: editorial introduction and photo-backed chapter directory ---------- */
function home(){
  document.title='Professional Skills | A.M.T.B. Abeykoon';
  const filters = ['all',...Object.keys(SKILL_LABELS)];
  const cards = SESSIONS.map((s,i)=>`<a class="chapter-card" data-tags="${esc(s.tags.join(' '))}" href="${chapterLink(s.id)}" style="--accent:${ACCENTS[i]}">
    <div class="chapter-media">${displayCover(s)?`<img loading="lazy" src="${esc(displayCover(s))}" alt="Photograph of ${esc(s.short)} session">`:`<div class="chapter-abstract"><span>${fmt(s.id)}</span><i></i></div>`}<span class="chapter-number">CH. ${fmt(s.id)}</span></div>
    <div class="chapter-info"><span class="chapter-type">${esc(CHAPTER_LABELS[i])}</span><h3>${esc(s.title)}</h3><div class="chapter-foot"><time>${esc(s.date)}</time><span>${icon('arrow',19)}</span></div></div></a>`).join('');
  chrome(`<section class="home-hero wrap"><div class="hero-copy"><div class="overline"><span class="overline-rule"></span>Year 2 / Semester 2 <span class="overline-divider">·</span> Professional Skills</div>
    <h1>Beyond the <em>classroom.</em><br>Into the <span class="hero-outline">workplace.</span></h1>
    <p class="hero-summary">A personal record of the conversations, challenges and small discoveries that shaped my understanding of professional life.</p>
    <div class="hero-actions"><a class="button button-dark" href="#journey">Explore the journey ${icon('arrow',18)}</a><a class="text-link" href="#about">The story behind it ${icon('arrow',16)}</a></div>
    <div class="hero-byline"><span class="byline-mark">AB</span><span><strong>A.M.T.B. Abeykoon</strong><small>Higher Diploma in Information Technology</small></span></div>
   </div><div class="hero-art" aria-label="Photographs from the semester"><div class="art-backdrop"></div><div class="art-photo art-a"><img src="s3-1.jpg" alt="Paper Day group evidence"></div><div class="art-photo art-b"><img src="s11-2.jpg" alt="Negotiation Skills activity"></div><div class="art-note"><span>ELEVEN CHAPTERS</span><strong>One growing perspective.</strong></div><div class="art-mark">11<span>/</span>11</div></div></section>
   <section class="fact-bar wrap" aria-label="Portfolio overview"><div><strong>11</strong><span>Learning sessions</span></div><div><strong>07</strong><span>Skill themes</span></div><div><strong>2026</strong><span>Year of learning</span></div><div class="fact-quote">A collection of lessons, questions and progress rather than just notes.</div></section>
   <section id="journey" class="journey-section wrap">${sectionHeading('01 / THE JOURNEY','Every session left something behind.','Explore the sessions, find a skill that interests you, and open any chapter to read the complete notes and reflections.')}
      <div class="filter-row" role="group" aria-label="Filter chapters by skill">${filters.map(k=>`<button class="filter-chip ${k==='all'?'active':''}" type="button" data-filter="${k}" aria-pressed="${k==='all'}">${k==='all'?'All sessions':SKILL_LABELS[k]}</button>`).join('')}</div>
      <div class="chapter-grid" id="chapter-grid">${cards}</div>
   </section>
   <section id="highlights" class="highlight-section"><div class="wrap"><div class="highlight-head">${sectionHeading('02 / THE MOMENTS','What stayed with me.','Some of the most memorable learning came from moments when our plans changed.')}</div>
      <div class="highlight-grid"><a href="${chapterLink(3)}" class="highlight-card"><span>01 / PAPER DAY</span><h3>Finishing together, even after starting over.</h3><p>Our seven-member team overcame a setback and finished within the time limit.</p><span class="highlight-arrow">View the experience ${icon('arrow',17)}</span></a>
      <a href="${chapterLink(7)}" class="highlight-card"><span>02 / LEADERSHIP</span><h3>The better idea came from someone else.</h3><p>Four A4 sheets. Fifteen minutes. A reminder to give other ideas room.</p><span class="highlight-arrow">View the experience ${icon('arrow',17)}</span></a>
      <a href="${chapterLink(9)}" class="highlight-card"><span>03 / GROOMING</span><h3>The best costume was still five minutes late.</h3><p>A creative success that taught us an equally important lesson in planning.</p><span class="highlight-arrow">View the experience ${icon('arrow',17)}</span></a></div></div></section>
   <section id="about" class="about-section wrap"><div class="about-monogram">a<span>b</span><i>.</i></div><div><span class="section-kicker">03 / ABOUT THIS PORTFOLIO</span><h2>Learning is easier to see when you look back.</h2><p>This portfolio brings together my notes from the Professional Skills module, practical classroom activities and personal reflections. Each chapter is presented in its original learning sequence, with evidence wherever photographs were available.</p><a class="text-link" href="${chapterLink(1)}">Begin at chapter one ${icon('arrow',17)}</a></div></section>`, 'home');
  $$('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{
    const choice=btn.dataset.filter;
    $$('.filter-chip').forEach(b=>{const current=b===btn;b.classList.toggle('active',current);b.setAttribute('aria-pressed',String(current));});
    $$('.chapter-card').forEach(c=>c.hidden = choice!=='all' && !c.dataset.tags.split(' ').includes(choice));
  }));
}

/* ---------- Shared interactive diagram: one clear explanation at a time ---------- */
function choiceDiagram(label,choices,initial=0,variant='steps'){
  const buttons=choices.map((x,i)=>`<button class="choice-button ${i===initial?'selected':''}" type="button" data-choice="${i}" aria-pressed="${i===initial}"><span>${fmt(i+1)}</span>${esc(x[0])}</button>`).join('');
  return `<div class="learning-diagram diagram-${variant}" data-choice-diagram data-values="${esc(JSON.stringify(choices))}"><div class="diagram-label">${esc(label)}</div><div class="choice-options">${buttons}</div><div class="choice-panel" aria-live="polite"><small>SELECTED INSIGHT</small><h4>${esc(choices[initial][0])}</h4><p>${esc(choices[initial][1])}</p></div><small class="diagram-note"></small></div>`;
}
function conceptPoint(block){return block?.items?.flatMap(item=>item.ul || []).filter(v=>v[0]) || [];}

/* ---------- Chapter-specific diagrams: each illustration matches its subject ---------- */
function diagramFor(s){
 const point = (i) => conceptPoint(s.blocks[i]);
 switch(s.id){
 case 1: return `<div class="illustration-block"><div class="phone-diagram"><div class="phone-top">${icon('chat',21)}<span>THE PROFESSIONAL CALL</span><i></i></div><div class="phone-bubble left">A customer raises a concern.</div><div class="phone-bubble right">Listen first. Respond respectfully.</div><div class="phone-bubble left">The situation becomes difficult.</div><div class="phone-bubble right">Maintain composure and work towards a solution.</div><div class="phone-bottom">TONE <span>·</span> PATIENCE <span>·</span> CLARITY</div></div><div class="diagram-aside"><span class="diagram-label">TELEPHONE ETIQUETTE</span><h3>Composure is part of the conversation.</h3><p>The role-play showed how communication changes when a customer is upset.</p><span class="illustrative-tag"></span></div></div>`;
 case 2: return `<div class="cv-layout"><div class="cv-sheet"><div class="cv-top"><div class="cv-avatar"></div><div><strong>PROFESSIONAL CV</strong><span>Structure overview</span></div></div><div class="cv-line long"></div><div class="cv-section"><b>01</b><span>Contact & profile</span></div><div class="cv-line"></div><div class="cv-section"><b>02</b><span>Education & experience</span></div><div class="cv-line long"></div><div class="cv-section"><b>03</b><span>Skills & achievements</span></div><div class="cv-line"></div></div><div class="cv-annotation"><span class="diagram-label">CV / COVER LETTER</span><h3>Show your experience. Explain your fit.</h3><p>The CV provides a structured record of qualifications and achievements; the cover letter relates them to a particular opportunity.</p><div class="cv-compare"><span>CV <strong>Evidence</strong></span><span>Cover letter <strong>Context</strong></span></div></div></div>`;
 case 3: return `<div class="paper-timeline"><div class="paper-metrics"><div><b>45</b><span>minutes</span></div><div><b>07</b><span>team members</span></div><div><b>1st</b><span>place</span></div></div>${choiceDiagram('HOW THE CHALLENGE UNFOLDED',[
 ['The first plan','We began with an idea that became difficult to construct using our limited newspapers and glue.'],
 ['A warning overlooked','One teammate had already raised concerns about the materials. We had not listened carefully enough.'],
 ['A different approach','With less time available, we reconsidered our plan and redistributed responsibilities.'],
 ['The outcome','Our group completed the craft within the allotted time and received the highest marks.']])}</div>`;
 case 4: return `<div class="meeting-visual"><div class="meeting-minutes"><span class="file-label">MEETING NOTES / EXAMPLE</span><strong>Actions & follow-up</strong><div class="record-header"><span>ISSUE</span><span>RESPONSIBLE</span><span>STATUS</span></div><div class="record-row"><span>Room setup</span><span>Organizer</span><i>Prepare</i></div><div class="record-row"><span>Points raised</span><span>Minute-taker</span><i>Record</i></div><div class="record-row"><span>Next actions</span><span>Owners</span><i>Follow up</i></div><small>Illustrative record, not a class-produced document</small></div><div class="meeting-aside">${choiceDiagram('THREE STAGES OF A MEETING',[
 ['Before','Define objectives, share the agenda, choose the venue and check seating, equipment and refreshments.'],
 ['During','Listen respectfully, communicate clearly and record important discussions, decisions and responsibilities.'],
 ['After','Follow up on commitments and preserve a reliable written record for future reference.']])}</div></div>`;
 case 5: return `<div class="research-process">${choiceDiagram('THE RESEARCH PROCESS',[
 ['Identify','Recognize a relevant problem or question worth investigating.'],
 ['Review','Examine existing literature to understand prior findings and possible gaps.'],
 ['Investigate','Choose suitable methods and conduct the investigation.'],
 ['Interpret','Analyse the evidence and discuss what the results mean.'],
 ['Present','Communicate findings, limitations, conclusions and references clearly.']])}<div class="research-endnote">QUESTION <span>→</span> EVIDENCE <span>→</span> CONTRIBUTION</div></div>`;
 case 6: return `<div class="johari-wrap"><div class="johari-axes"><span>KNOWN TO SELF</span><span>NOT KNOWN TO SELF</span></div><div class="johari-main"><div class="johari-side"><span>KNOWN TO OTHERS</span><span>NOT KNOWN TO OTHERS</span></div><div class="johari-grid">${[
 ['Open Area','Qualities known to both ourselves and others.'],['Blind Area','Qualities others recognize in us that we may not notice ourselves.'],['Hidden Area','Qualities or personal information we know but have not shared.'],['Unknown Area','Potential not yet recognized by ourselves or by others.']
 ].map(([n,d],i)=>`<button type="button" class="johari-cell" data-johari="${i}"><small>0${i+1}</small><strong>${n}</strong><span>${d}</span></button>`).join('')}</div></div><p class="johari-caption">The model compares self-perception with others' perceptions.</p></div>`;
 case 7: return `<div class="tower-visual"><div class="tower-stats"><span>04 A4 SHEETS</span><span>15 MINUTES</span><span>TALLEST STRUCTURE</span></div><div class="tower-frame"><div class="tower tower-low"><i></i><i></i></div><span class="tower-arrow">${icon('arrow',23)}</span><div class="tower tower-high"><i></i><i></i><i></i><i></i></div></div><div class="tower-labels"><span>My first approach</span><span>Another member's idea</span></div><p class="diagram-note">Conceptual comparison of the initial and improved ideas; not a scale model of the actual structures.</p></div>`;
 case 8: return `<div class="interview-visual"><div class="interview-illustration"><div class="interview-desk"><span></span><span></span></div><div class="interview-nameplates"><span>INTERVIEWER</span><span>CANDIDATE</span></div></div>${choiceDiagram('THE INTERVIEW JOURNEY',[
 ['Before','Research the organization, review the CV, prepare documents and plan to arrive on time.'],
 ['During','Listen carefully, answer clearly, maintain appropriate body language and show a willingness to learn.'],
 ['After','Reflect on performance and maintain professional follow-up communication.']])}</div>`;
 case 9: return `<div class="grooming-visual"><div class="grooming-metrics"><div><span>TIME LIMIT</span><strong>45 min</strong></div><div><span>OVER TIME</span><strong>+5 min</strong></div><div><span>RESULT</span><strong>Best costume</strong></div></div><div class="grooming-conclusion"><div class="grooming-check">${icon('check',28)}</div><div><h3>An attractive result is not the whole result.</h3><p>The evaluation reminded us to consider deadlines and the allocated budget as carefully as the design itself.</p></div></div></div>`;
 case 10: return `<div class="emotion-visual"><div class="emotion-scale"><span>TRIGGER</span><span class="emotion-line"></span><span>THOUGHTFUL RESPONSE</span></div>${choiceDiagram('THE POWER OF A PAUSE',[
 ['Notice','Acknowledge the emotion and what may have triggered it.'],
 ['Pause','Take a moment before responding immediately.'],
 ['Consider','Think about the situation from the other person’s perspective.'],
 ['Respond','Express concerns respectfully and constructively.']])}<a class="session-crosslink" href="${chapterLink(6)}">This builds on the Johari Window in Session 06 ${icon('arrow',16)}</a></div>`;
 case 11: return `<div class="negotiation-visual"><div class="negotiation-left"><span class="diagram-label">THE PAPER EXCHANGE</span><h3>One message. Four missing pieces.</h3><p>Exchange pieces with other teams to bring the fragments together.</p><button class="trade-button" type="button" data-trade>Make a mutually helpful exchange ${icon('arrow',17)}</button><small class="diagram-note">Simplified interactive illustration of the activity.</small></div><div class="puzzle" data-puzzle><div class="puzzle-grid">${[0,1,2,3].map(i=>`<div class="puzzle-piece" data-piece="${i}"><span>0${i+1}</span></div>`).join('')}</div><div class="puzzle-quote" hidden>“Never make a decision when you are angry, hungry, in a hurry.”</div><span class="puzzle-progress" aria-live="polite">0 / 4 fragments exchanged</span></div></div>`;
 default:return '';
 }
}

/* ---------- Session detail page: source text, unique diagrams and evidence ---------- */
function session(){
  const requested = Number(new URLSearchParams(location.search).get('id'));
  const s = SESSIONS.find(entry=>entry.id===requested) || SESSIONS[0];
  const index=SESSIONS.indexOf(s), prev=SESSIONS[index-1],next=SESSIONS[index+1];
  document.title=`${s.title} | Professional Skills`;
  const heroPhoto=displayCover(s)?`<div class="session-hero-photo"><img src="${esc(displayCover(s))}" alt="Evidence photograph from ${esc(s.title)}"><div class="hero-photo-label">SESSION EVIDENCE · ${fmt(s.id)}</div></div>`:`<div class="session-hero-photo no-photo"><div class="abstract-ornament">${fmt(s.id)}</div><div class="hero-photo-label">LEARNING CHAPTER · ${fmt(s.id)}</div></div>`;
  const body=`<div class="session-page" style="--chapter:${ACCENTS[index]}">
   <div class="wrap"><div class="session-crumb"><a href="index.html">Portfolio</a><span>/</span><a href="index.html#journey">All sessions</a><span>/</span><strong>Chapter ${fmt(s.id)}</strong></div>
   <section class="session-hero"><div class="session-hero-copy"><div class="overline"><span class="overline-rule"></span> SESSION ${fmt(s.id)} / ${fmt(SESSIONS.length)}</div><span class="session-label">${esc(CHAPTER_LABELS[index])}</span><h1>${esc(s.title)}</h1><p class="session-deck">${esc(CHAPTER_SUBTITLES[index])}</p><div class="session-meta"><span>${icon('calendar',17)} ${esc(s.date)}</span><span>${icon('user',17)} ${esc(s.lecturer)}</span>${s.evaluated_by?`<span>${icon('check',17)} Evaluated by ${esc(s.evaluated_by)}</span>`:''}</div></div>${heroPhoto}</section>
   <div class="chapter-progress"><span>CHAPTER ${fmt(s.id)}</span><div class="progress-track"><div style="width:${Math.round(s.id/SESSIONS.length*100)}%"></div></div><span>${fmt(SESSIONS.length)} CHAPTERS</span></div>
   <nav class="session-tabs" aria-label="Jump to a part of this session"><a href="#overview">Overview</a><a href="#concepts">Concepts</a><a href="#explore">Visual insight</a>${s.activities.length?'<a href="#activities">Activities</a>':''}<a href="#reflection">Reflection</a></nav>
   <section id="overview" class="source-section overview-section">${sectionHeading('01 / THE SESSION','What this session was about.')}<div class="intro-grid"><div class="intro-ornament"><span>THE CONTEXT</span><strong>${fmt(s.id)}</strong><span>${esc(CHAPTER_LABELS[index])}</span></div><div class="body-copy">${renderItems(s.overview)}</div></div></section>
   <section id="concepts" class="source-section concepts-section">${sectionHeading('02 / KEY CONCEPTS','Ideas worth keeping.')}<div class="concept-layout">${s.blocks.map(dataCard).join('')}</div></section>
   <section id="explore" class="source-section exploration-section">${sectionHeading('03 / EXPLORE THE IDEA','The lesson, made visual.','To help connect the ideas to their practical meaning.')}<div class="custom-visual">${diagramFor(s)}</div></section>
   ${s.activities.length?`<section id="activities" class="source-section activity-section">${sectionHeading('04 / PRACTICAL EXPERIENCE','Where it came to life.')}<div class="activity-layout">${s.activities.map((a,i)=>`<article class="activity-card"><div class="activity-label">ACTIVITY ${fmt(i+1)}</div><h3>${esc(a.title)}</h3><div class="body-copy">${renderItems(a.items)}</div></article>`).join('')}</div></section>`:''}
   <section id="reflection" class="source-section reflection-section">${sectionHeading(s.activities.length?'05 / REFLECTION':'04 / REFLECTION','What I took away.')}<div class="reflection-layout"><aside><span>PERSONAL REFLECTION</span><div class="reflection-symbol">“</div><blockquote>${esc(s.quote)}</blockquote><div class="reflection-by">— A.M.T.B. Abeykoon</div></aside><div class="reflection-text body-copy">${renderItems(s.reflection)}</div></div></section>
   <nav class="chapter-pager" aria-label="Previous and next chapters">${prev?`<a href="${chapterLink(prev.id)}" class="pager-prev">${icon('arrowleft',20)}<span><small>PREVIOUS CHAPTER</small><strong>${esc(prev.short)}</strong></span></a>`:`<a href="index.html" class="pager-prev">${icon('arrowleft',20)}<span><small>RETURN TO</small><strong>Overview</strong></span></a>`}${next?`<a href="${chapterLink(next.id)}" class="pager-next"><span><small>NEXT CHAPTER</small><strong>${esc(next.short)}</strong></span>${icon('arrow',20)}</a>`:`<a href="index.html#journey" class="pager-next"><span><small>END OF JOURNEY</small><strong>All sessions</strong></span>${icon('arrow',20)}</a>`}</nav>
  </div></div>`;
  chrome(body,'session');
  initDiagrams();
}

/* ---------- Diagram interactions: choices, feedback quadrants and paper trading ---------- */
function initDiagrams(){
  $$('[data-choice-diagram]').forEach(block=>{
    const options=$$('[data-choice]',block),heading=$('.choice-panel h4',block),detail=$('.choice-panel p',block);
    const choices=JSON.parse(block.dataset.values || '[]');
    options.forEach((button,i)=>button.addEventListener('click',()=>{
      options.forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
      if(choices[i]){heading.textContent=choices[i][0];detail.textContent=choices[i][1];}
    }));
  });
  $$('.johari-cell').forEach(cell=>cell.addEventListener('click',()=>{$$('.johari-cell').forEach(c=>c.classList.toggle('selected',c===cell));}));
  const trade=$('[data-trade]');
  if(trade){let count=0;trade.addEventListener('click',()=>{
    if(count>=4){count=0;$$('[data-piece]').forEach(p=>p.classList.remove('arrived'));$('.puzzle-quote').hidden=true;trade.innerHTML=`Make a mutually helpful exchange ${icon('arrow',17)}`;}
    else{const piece=$(`[data-piece="${count}"]`);if(piece)piece.classList.add('arrived');count++;if(count===4){$('.puzzle-quote').hidden=false;trade.textContent='Restart the exchange';}}
    $('.puzzle-progress').textContent=`${count} / 4 fragments exchanged`;
  });}
}

/* ---------- Global lightbox, keyboard shortcuts and scroll reveal ---------- */
document.addEventListener('click',event=>{
 const photo=event.target.closest('[data-zoom]');
 if(photo){const lb=$('#lightbox');if(!lb)return;const img=$('img',lb);img.src=photo.dataset.zoom;img.alt='Enlarged evidence photograph';lb.hidden=false;$('.lightbox-close',lb).focus();}
 if(event.target.closest('.lightbox-close')||event.target.id==='lightbox'){$('#lightbox').hidden=true;}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){const lb=$('#lightbox');if(lb)lb.hidden=true;}});

/* ---------- Start page rendering after both scripts have loaded ---------- */
if(document.body.dataset.page==='session')session();else home();
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('appeared');observer.unobserve(entry.target);}});},{threshold:.08});
 $$('.chapter-card,.highlight-card,.source-section,.about-section').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
}
