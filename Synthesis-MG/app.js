/* MG Uzbekistan — движок тритмента.
   Один контент-файл (content_<lang>.json) → длинная страница со скроллом.
   По умолчанию практичный режим: текст слайда виден сразу, скролл листает разделы.
   ?pitch — режим защиты: текст появляется шагами (скролл или стрелки).
   Состояние уходит в окно контроля (control.html) через BroadcastChannel. */
(async function () {
  const LANG = window.LANG || 'ru', BASE = window.BASE || '../';
  const Q = new URLSearchParams(location.search);
  const DRAFT = Q.has('draft');           // ?draft — показывать плейсхолдеры и экстраслайды
  const PITCH = Q.has('pitch');           // ?pitch — пошаговое появление текста, как на защите
  if (DRAFT) document.body.classList.add('draft');
  // телефон: разделы идут обычным потоком, закреплены только сториборд и вращающаяся машина
  const MQ = matchMedia('(max-width:820px)'), MOB = MQ.matches, FLOW = MOB && !PITCH;
  const TOUCH = matchMedia('(pointer:coarse)').matches;
  if (MOB) document.body.classList.add('mob');
  if (MQ.addEventListener) MQ.addEventListener('change', () => location.reload());
  let AV = {};            // короткий хэш каждого файла: когда файл меняется, меняется и адрес, браузер не держит старую версию
  const A = p => BASE + 'assets/' + p + (AV[p] ? '?v=' + AV[p] : '');
  const T = LANG === 'ru'
    ? { yt: 'Смотреть на YouTube', play: 'Смотреть', scroll: 'Просто скролльте', hear: 'Нажмите на MG, чтобы услышать', shot: 'Кадр', extra: 'Доп-кадр' }
    : { yt: 'Watch on YouTube', play: 'Play', scroll: 'Just scroll', hear: 'Click MG to hear it', shot: 'Shot', extra: 'Extra frame' };
  let resp = await fetch(BASE + 'content_' + LANG + '.json', { cache: 'no-store' });
  if (!resp.ok) resp = await fetch(BASE + 'content_ru.json', { cache: 'no-store' });
  const data = await resp.json();
  AV = (data.meta && data.meta.av) || {};
  const DIM = (data.meta && data.meta.dim) || {}, TT = data.meta && data.meta.tt;
  // высота экрана без панелей браузера: на телефоне она не «дышит», когда панели прячутся при скролле
  const probe = document.createElement('div'); probe.className = 'vhp'; document.body.append(probe);
  const VH = () => probe.offsetHeight || innerHeight;
  const root = document.getElementById('app');
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const NS = 'http://www.w3.org/2000/svg';
  const LOGO = ["M347.79 109.74 C347.49 105.66 345.87 101.79 343.21 98.7 C336.24 90.63 320.57 72.96 298.75 51.17 C276.9 29.36 259.23 13.74 251.14 6.76 C248.05 4.1 244.17 2.48 240.09 2.18 C229.73 1.39 206.94 0.0 175.0 0.0 C143.06 0.0 120.27 1.39 109.91 2.18 C105.83 2.48 101.95 4.1 98.86 6.76 C90.77 13.72 73.1 29.36 51.25 51.17 C28.64 73.75 13.48 90.86 6.74 98.7 C4.08 101.79 2.51 105.64 2.18 109.68 C1.39 120.01 0.0 142.79 0.0 174.73 C0.0 206.67 1.42 229.09 2.21 239.74 C2.51 243.82 4.11 247.69 6.77 250.78 C13.54 258.65 28.67 275.73 51.25 298.28 C73.1 320.1 90.77 335.71 98.86 342.7 C101.95 345.35 105.83 346.21 109.91 346.54 C120.27 347.33 143.06 348.72 175.0 348.72 C206.94 348.72 229.73 347.33 240.09 346.54 C244.17 346.24 248.05 345.38 251.14 342.7 C259.23 335.74 276.92 320.1 298.75 298.28 C321.33 275.73 336.46 258.65 343.23 250.78 C345.89 247.66 347.49 243.82 347.79 239.74 C348.58 229.09 350.0 205.58 350.0 174.73 C350.0 143.88 348.61 120.09 347.82 109.74 L347.79 109.74 M334.03 235.06 C333.78 238.5 332.41 241.77 330.15 244.4 C324.07 251.49 310.03 267.38 288.89 288.49 C267.75 309.59 251.96 323.44 244.68 329.69 C242.04 331.94 238.77 333.28 235.33 333.56 C226.0 334.29 204.83 335.61 174.92 335.61 C145.01 335.61 123.85 334.29 114.52 333.56 C111.07 333.28 107.8 331.94 105.17 329.69 C97.89 323.44 81.42 308.91 60.96 288.49 C39.82 267.38 25.78 251.49 19.72 244.4 C17.46 241.77 16.12 238.5 15.84 235.06 C15.13 225.49 13.76 203.6 13.76 174.73 C13.76 145.85 15.11 123.63 15.82 114.37 C16.1 110.95 17.44 107.71 19.67 105.1 C25.73 98.04 39.8 82.12 60.96 60.97 C81.42 40.54 97.89 26.02 105.17 19.77 C107.8 17.51 111.07 16.17 114.52 15.89 C123.85 15.16 145.01 13.84 174.92 13.84 C204.83 13.84 226.0 15.16 235.3 15.89 C238.75 16.17 242.02 17.51 244.66 19.77 C251.93 26.02 268.41 40.54 288.86 60.97 C309.29 81.37 323.87 97.84 330.13 105.1 C332.38 107.74 333.73 111.0 334.01 114.44 C334.74 123.76 336.06 144.91 336.06 174.75 C336.06 204.59 334.69 225.54 333.98 235.09 L334.03 235.09 L334.03 235.06 Z", "M314.61 141.78 C314.36 130.08 313.42 119.88 313.12 117.63 C312.61 116.7 311.34 115.28 310.56 114.42 C300.52 103.08 290.43 92.12 276.69 78.48 C249.98 51.93 235.63 39.35 232.11 36.9 C229.47 36.6 224.6 36.22 211.42 35.63 C200.93 35.18 187.62 34.87 186.51 34.92 C186.46 37.25 186.28 212.49 186.43 312.12 C186.43 313.95 186.51 314.53 186.51 314.53 C186.51 314.53 217.3 314.81 232.21 312.73 C242.4 304.2 261.74 285.96 275.83 271.88 C290.89 256.67 303.82 242.86 307.11 238.98 C308.48 237.36 311.57 234.05 313.17 231.8 C313.4 229.87 313.55 228.25 313.78 224.68 C314.87 207.07 315.1 175.51 315.1 174.47 C313.73 174.4 267.62 174.45 266.61 174.47 C266.58 175.26 266.68 198.67 266.68 198.79 C267.24 198.82 289.32 198.79 290.13 198.79 C290.13 199.2 289.52 218.74 289.01 222.0 C287.26 224.43 284.45 226.99 281.33 230.51 C277.94 234.3 273.07 239.44 263.06 249.69 C250.54 262.52 231.04 280.72 222.32 288.41 C222.42 287.25 222.12 63.22 222.22 60.97 C224.5 62.86 229.98 67.88 231.5 69.29 C242.09 79.21 253.17 89.39 262.17 98.8 C275.33 112.54 288.51 126.84 289.09 127.83 C289.27 128.87 289.82 140.81 289.8 141.8 C290.71 141.9 313.68 141.75 314.59 141.8 Z", "M127.65 313.29 C127.55 269.63 127.57 217.27 127.57 137.09 C127.78 132.03 127.57 104.19 127.57 104.19 C127.57 104.19 127.19 105.51 126.81 105.89 C121.29 120.14 114.93 135.09 108.87 150.91 C101.14 171.08 93.79 192.01 87.96 207.42 L87.42 206.97 L71.0 177.94 L59.47 157.8 C59.47 157.8 59.47 182.12 59.52 184.44 C59.67 206.61 60.45 224.38 61.37 243.56 C61.44 246.02 62.46 259.79 62.46 259.79 C62.38 259.79 54.47 251.59 50.21 247.11 C42.63 239.11 40.07 236.0 36.7 231.75 C35.26 217.17 34.57 200.95 34.83 170.04 C35.08 140.0 36.4 120.47 36.58 118.01 C36.68 117.63 36.37 117.71 37.46 116.44 C39.72 113.81 50.42 101.69 53.1 99.21 C54.37 98.04 54.62 97.94 54.62 97.94 C54.62 97.94 56.07 99.99 56.88 101.18 C61.57 108.01 69.86 122.64 77.64 135.9 C82.33 143.88 82.89 144.61 82.89 144.61 C82.89 144.61 89.15 125.96 104.28 88.48 C115.86 59.8 127.17 36.72 127.47 35.96 C128.31 35.86 136.95 35.56 145.98 35.15 C155.23 34.72 162.61 34.85 163.54 34.9 C163.59 36.6 163.67 37.61 163.67 37.61 L163.67 311.31 C163.67 312.5 163.72 313.14 163.67 314.43 C163.01 314.45 161.49 314.43 160.27 314.43 C146.38 314.38 131.22 313.54 127.52 313.34 Z"];
  const logoSvg = () => '<svg class="lg" viewBox="0 0 350 348.72" fill="currentColor" aria-label="MG">' + LOGO.map(d => '<path d="' + d + '"/>').join('') + '</svg>';
  const SECTIONS = [];   // {el, steps:[{noteId,text}], title, apply(step)}
  let NAV = null;        // пункты оглавления: [подпись, id раздела]

  function section(kind, title, noteId) {
    const el = h('section', 's s-' + kind), pin = h('div', 'pin'), inn = h('div', 'in');
    pin.appendChild(inn); el.appendChild(pin); root.appendChild(el);
    const sec = { el, pin, inn, kind, title, noteId, steps: [], media: null };
    // keep=true — шаг остаётся и в практичном режиме (без него смысл теряется)
    sec.step = (node, text, nid, keep) => { if (!PITCH && !keep) return node; sec.steps.push({ node, text: text || '', noteId: nid || noteId }); node.dataset.step = sec.steps.length; return node; };
    sec.apply = n => sec.steps.forEach((s, i) => s.node.classList.toggle('on', i < n));
    SECTIONS.push(sec); return sec;
  }
  const ph = t => h('div', 'ph', 'Плейсхолдер · ' + esc(t));
  // вращение машины из кадров: первый кадр сразу, потом редкая сетка, потом остальные — машина видна с первой секунды и крутится без дыр
  function frameSeq(cv, f) {
    const ims = new Array(f.n), ctx = cv.getContext('2d'); cv.width = f.w; cv.height = f.h; let cur = null, want = 0;
    const src = i => BASE + 'assets/' + f.dir + '/' + String(i).padStart(3, '0') + '.jpg' + (f.v ? '?v=' + f.v : '');
    const draw = () => { for (let d = 0; d < f.n; d++) for (const i of [want - d, want + d]) { const im = ims[(i + f.n) % f.n]; if (im) { if (cur !== im) { cur = im; ctx.drawImage(im, 0, 0, f.w, f.h); } return; } } };
    const load = i => new Promise(r => { const im = new Image(); im.onload = () => { ims[i] = im; draw(); r(); }; im.onerror = r; im.src = src(i); });
    const order = [0]; for (const st of [8, 4, 2, 1]) for (let i = 0; i < f.n; i += st) if (!order.includes(i)) order.push(i);
    load(0).then(() => setTimeout(() => { let k = 1; const run = async () => { while (k < order.length) await load(order[k++]); }; for (let j = 0; j < 4; j++) run(); }, 600));
    return p => { want = Math.max(0, Math.min(f.n - 1, Math.round(p * (f.n - 1)))); draw(); };
  }
  const jump = id => { const s = SECTIONS.find(x => x.noteId === id); if (s) scrollTo({ top: s.el.offsetTop, behavior: 'smooth' }); };
  const lineHtml = ([en, ru]) => `<div class="ln"><p class="ru">${LANG === 'ru' ? '«' + esc(ru) + '»' : '“' + esc(en) + '”'}</p>${LANG === 'ru' ? `<p class="en">${esc(en)}</p>` : ''}</div>`;

  // ---------- рендер по типам
  const R = {
    cover(s) { const c = section('cover', "Director’s treatment", s.id);
      // название и автор — одним блоком в левом нижнем углу, от края страницы
      c.pin.append(h('div', 'covb', '<div class="lock"><h1>Director’s</h1><span class="script">treatment</span></div><p class="by">by Damir Mubinov</p>'));
      if (s.cred) c.pin.append(h('div', 'cred', s.cred.map(x => x[0] === 'img' ? `<img src="${A(x[1])}" alt="${esc(x[2])}">` : `<span>${esc(x[1])}</span>`).join('')));
      if (s.cover_video) { c.el.classList.add('hasvid'); const v = h('video', 'covv autov'); v.src = A('video/' + s.cover_video + '.mp4'); v.poster = A('video/' + s.cover_video + '_poster.jpg'); v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        c.pin.prepend(v, h('div', 'covscrim')); c.media = v; v.play().catch(() => { });
        // незаметная кнопка звука: по клику у обложки появляется звук
        const sb = h('button', 'snd', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path class="w" d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.4 7.4 0 0 1 0 10.4"/><path class="x" d="M16 9.5l5 5M21 9.5l-5 5"/></svg>'); sb.title = sb.ariaLabel = LANG === 'ru' ? 'Звук' : 'Sound';
        sb.onclick = () => { v.muted = !v.muted; if (!v.muted) v.play().catch(() => { }); sb.classList.toggle('on', !v.muted); }; c.pin.append(sb); }
      if (s.cover_img) { const i = h('img', 'cov'); i.src = A(s.cover_img); c.inn.append(i); } },
    chapter(s) { const c = section('chapter', s.title, s.id); c.inn.append(h('h1', '', esc(s.title)), h('p', 'sub', esc(s.sub))); },
    thanks(s) { const c = section('thanks', s.title, s.id); const [a, b] = s.title.split('! '); c.inn.append(h('div', 'lock', '<h1>' + esc(a) + '!</h1><span class="script">' + esc(b || '') + '</span>')); c.inn.append(c.step(h('p', 'said', esc(s.text)), s.text)); },
    statement(s) { const c = section('statement', s.title, s.id); c.inn.append(h('h2', '', esc(s.title))); c.inn.append(c.step(h('p', 'big', esc(s.text)), s.text)); },
    contents(s) { const c = section('toc', s.title, s.id); c.inn.append(h('h2', '', esc(s.title))); const g = h('div', 'toc'); g.style.gridTemplateRows = `repeat(${Math.ceil(s.items.length / 3)},auto)`;
      s.items.forEach(([lab, tid], i) => { const a = h('a', 'toci', `<span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(lab)}</span>`); a.href = '#'; a.onclick = e => { e.preventDefault(); jump(tid); }; g.append(a); });
      c.inn.append(g); NAV = s.items; },
    text(s) { const c = section('text', s.title, s.id); if (s.extra) c.inn.append(h('p', 'tagx', 'Экстра · из режзаметок'));
      c.inn.append(h('h2', '', esc(s.title))); const row = h('div', 'row'), col = h('div', 'col'); row.append(col);
      s.body.forEach(p => col.append(c.step(h('p', '', esc(p)), p)));
      if (s.phs) { const side = h('div', 'side draftonly'); s.phs.forEach(p => side.append(ph(p))); row.append(side); }
      if (s.pics) { const side = h('div', 'side pics'); s.pics.forEach(([k, m, part]) => side.append(c.step(h('div', 'pic3', `<img src="${A(k + '.jpg')}" alt=""><div><p class="kicker">${esc(part)}</p><h2>${esc(m)}</h2></div>`), m))); row.append(side); }
      if (s.gal) { const side = h('div', 'side gal g' + s.gal.length); s.gal.forEach(([src, cap, alt]) => side.append(c.step(h('figure', '', `<img src="${A(src)}" alt="${esc(alt)}"><figcaption>${esc(cap)}</figcaption>`), cap))); row.append(side); }
      if (s.loop) { const side = h('div', 'side loop'); const v = h('video', 'loopv autov'); v.src = A(s.loop[0]); v.poster = A(s.loop[1]); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.preload = 'metadata';
        side.append(v); if (s.piccap) side.append(h('p', 'figcap', esc(s.piccap))); row.append(side); }
      if (s.pic) { const side = h('div', 'side'); const im = h('img', 'pic1'); im.onload = () => { if (im.naturalHeight > im.naturalWidth) im.classList.add('tall'); }; im.src = A(s.pic[0] + '.jpg'); im.alt = s.pic[1]; side.append(s.pic_static ? im : c.step(im, s.pic[1])); if (s.piccap) side.append(h('p', 'figcap', esc(s.piccap))); row.append(side); if (s.pic_left) row.classList.add('picleft'); }
      c.inn.append(row); },
    idea_world(s) { const c = section('idea', s.title, s.id); c.inn.append(h('h2', '', esc(s.title)), h('p', 'lead', esc(s.lead)));
      const w = h('div', 'world'); w.append(c.step(h('p', 'pill', esc(s.bubble)), s.bubble)); const i = h('img'); i.src = A(s.car || 'car/zs_red.png'); i.alt = ''; w.append(i); c.inn.append(w); },
    // коллауты на вращающейся машине: линия следит за деталью, потом гаснет, реплика остаётся
    idea_callouts(s) { const c = section('idea', s.title, s.id); c.inn.append(h('h2', '', esc(s.title)), h('p', 'lead', esc(s.lead)));
      const wrap = h('div', 'stagewrap'), st = h('div', 'stage'); wrap.append(st); c.inn.append(wrap);
      const VX = 334, VW = 996, VH0 = 560, DUR = 30;
      // на телефоне и планшете видео без касания не грузится (а в режиме энергосбережения не грузится совсем) — там машина собрана из кадров
      let car; if (s.turntable && TT && (TOUCH || MOB)) { car = h('canvas', 'car'); c.scrubTo = frameSeq(car, TT); }
      else if (s.turntable) { car = h('video', 'car'); car.src = A(s.turntable); car.muted = true; car.playsInline = true; car.preload = 'auto'; car.setAttribute('playsinline', ''); c.scrub = car; } else { car = h('img', 'car'); car.src = A('car/zs_red.png'); }
      st.append(car);
      const list = MOB ? h('div', 'clist') : null; if (list) { st.classList.add('m'); st.append(list); }
      // t — секунда ролика, x/y — доли кадра; у эмблемы время считаем от −15 до 15 (она видна на стыке круга)
      const TR = { badge: { k: [[-5, .08, .53], [-2.5, .124, .555], [0, .26, .53], [2.5, .504, .52], [5, .74, .53], [7.5, .90, .56]], vis: [-4.5, 7], wrap: 1, stop: 2.5 },
        wheel: { k: [[5, .48, .73], [7.5, .644, .73], [10, .766, .72], [12.5, .816, .71], [15, .784, .67]], vis: [4.5, 13.5], stop: 9.5 },
        boot: { k: [[12.5, .15, .46], [15, .30, .46], [17.5, .53, .46], [20, .77, .455], [22.5, .89, .455]], vis: [12, 22.5], stop: 17.5 },
        cabin: { k: [[20, .45, .35], [22.5, .52, .35], [25, .58, .35], [27.5, .60, .34], [30, .58, .36]], vis: [19.5, 29], stop: 24.5 } };
      const at = (k, t) => { if (t <= k[0][0]) return k[0]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const a = k[i - 1], b = k[i], f = (t - a[0]) / (b[0] - a[0]); return [t, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; } return k[k.length - 1]; };
      const svg = document.createElementNS(NS, 'svg'); if (s.turntable) st.append(svg);
      const items = s.callouts.map(([who, av, q, part, pos]) => ({ who, av, q, tr: TR[part] || TR.badge, pos: pos || [0, 300, 350] })).sort((a, b) => a.tr.stop - b.tr.stop);
      items.forEach(it => { const [lx, ly, w] = it.pos;
        const g = h('div', 'callout', `<img src="${A('av/' + it.av + '.jpg')}" alt=""><div><p class="who">${esc(it.who)}</p><p class="q">${esc(it.q)}</p></div>`); if (!MOB) g.style.cssText = `left:${lx}px;top:${ly}px;width:${w}px`;
        (list || st).append(c.step(g, it.who + ': ' + it.q, null, true)); it.node = g;
        if (!s.turntable) return;
        it.ax = lx + w / 2 < 832 ? lx + w + 14 : lx - 14; it.ay = ly + 60;
        it.g = document.createElementNS(NS, 'g'); it.g.innerHTML = '<line stroke="#FD2F33" stroke-width="' + (MOB ? 1.5 : 3) + '"/><polygon points="2.93,0 7.07,0 10,2.93 10,7.07 7.07,10 2.93,10 0,7.07 0,2.93" fill="#FD2F33"/>'; it.g.style.opacity = 0; svg.append(it.g); });
      if (s.turntable) { c.fr = items.map(it => it.tr.stop / DUR); c.per = 1;
        c.track = p => { const t = p * DUR;
          // телефон: реплики стоят списком под машиной, свежая сверху; линия идёт только от неё
          const W = MOB ? st.clientWidth : 0, on = MOB ? items.filter(it => it.node.classList.contains('on')) : null, top = on && on[on.length - 1];
          items.forEach(it => { const tt = it.tr.wrap && t > 15 ? t - DUR : t, [, fx, fy] = at(it.tr.k, tt), x = MOB ? fx * W : VX + fx * VW, y = MOB ? fy * W * VH0 / VW : fy * VH0;
            const v = Math.max(0, Math.min(1, Math.min(tt - it.tr.vis[0], it.tr.vis[1] - tt) / .9));
            if (MOB && it !== top) { it.g.style.opacity = 0; return; }
            const ax = MOB ? it.node.offsetLeft + 22 : it.ax, ay = MOB ? it.node.offsetTop - 5 : it.ay;
            const ln = it.g.firstChild; ln.setAttribute('x1', ax); ln.setAttribute('y1', ay); ln.setAttribute('x2', x); ln.setAttribute('y2', y);
            it.g.lastChild.setAttribute('transform', MOB ? `translate(${x - 5},${y - 5})` : `translate(${x - 9},${y - 9}) scale(1.8)`); it.g.style.opacity = it.node.classList.contains('on') ? v : 0; }); }; }
      if (MOB) return;
      const fit = () => { const k = Math.min(1, (wrap.clientWidth) / 1664, (VH() * .56) / 560); st.style.transform = `scale(${k})`; wrap.style.height = 560 * k + 'px'; };
      addEventListener('resize', fit); requestAnimationFrame(fit); },
    value_table(s) { const c = section('value', s.title, s.id); c.inn.append(h('h2', '', esc(s.title)), h('p', 'vlead', esc(s.lead))); const vt = h('div', 'vt');
      if (s.heads) vt.append(h('div', 'vr vhd', `<p class="who">${esc(s.heads[0])}</p><p class="who">${esc(s.heads[1])}</p><p class="who">${esc(s.heads[2])}</p>`));
      s.table.forEach(([who, av, q, ben]) => { const r = h('div', 'vr', `<img src="${A('av/' + av + '.jpg')}" alt=""><p class="who">${esc(who)}</p><p>${esc(q)}</p>`); r.append(c.step(h('p', 'ben', esc(ben)), who + ' → ' + ben)); vt.append(r); });
      c.inn.append(vt);
      if (s.note) c.inn.append(h('p', 'vaside', esc(s.note))); },
    culture(s) { const c = section('culture', s.title, s.id); c.inn.append(h('h2', '', esc(s.title))); const row = h('div', 'row'), col = h('div', 'col'), side = h('div', 'side'); row.append(col, side);
      s.body.forEach(p => col.append(c.step(h('p', '', esc(p)), p)));
      const f = h('div', 'faces' + (s.face_imgs ? '' : ' draftonly')); s.faces.forEach((l, i) => { const d = h('div', 'face'); if (s.face_imgs) { const im = h('img'); im.src = A(s.face_imgs[i]); im.alt = l; d.append(im); } else d.append(ph('лицо дедушки')); d.append(h('p', 'lab', esc(l))); f.append(s.face_imgs ? c.step(d, l) : d); });
      if (s.face_imgs) side.append(f); else side.append(c.step(f, s.faces.join(' → '))); c.inn.append(row); },
    mnemonic(s) { const c = section('mnemonic', s.title, s.id); c.inn.append(h('h2', '', esc(s.title))); const row = h('div', 'row'), col = h('div', 'col'), side = h('div', 'side arcside'); row.append(col, side); c.inn.append(row);
      s.body.forEach(p => col.append(c.step(h('p', '', esc(p)), p)));
      const arc = h('div', 'arc'); c.audio = [];
      if (s.arc.length === 4) arc.classList.add('arc4');
      s.arc.forEach(([lab, file, word, wave], k) => { const b = h('button', 'mg k' + (k + 1), `<div class="w">${esc(word || 'MG')}</div>${wave ? `<svg class="wave" viewBox="0 0 194 90">${wave}</svg>` : ''}<p class="lab">${esc(lab)}</p>`); const au = new Audio(A(`audio/${LANG}/${file}.mp3`)); au.preload = 'auto'; b.title = T.hear;
        const play = () => { c.audio.forEach(x => { x.pause(); x.currentTime = 0; }); au.play().catch(() => { }); arc.querySelectorAll('.mg').forEach(x => x.classList.remove('playing')); b.classList.add('playing'); au.onended = () => b.classList.remove('playing'); };
        b.onclick = play; c.audio.push(au); (c.plays = c.plays || []).push(play); arc.append(c.step(b, (word || 'MG') + ' — ' + lab)); });
      side.append(arc, h('p', 'hint', '<i></i>' + esc(T.hear)));
      // один раз, когда блок появился на экране: слова по очереди «подпрыгивают», подсказка подсвечивается
      if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { side.classList.add('attn'); io.disconnect(); } }), { threshold: .7 }); io.observe(side); } },
    // плеер YouTube: обложка, по клику подгружается встроенный плеер
    video(s) { if (!s.youtube && !s.video && !DRAFT) return; const c = section('video', s.title, s.id); c.inn.append(h('h2', '', esc(s.title)));
      (s.body || []).forEach(p => c.inn.append(h('p', 'vnote', esc(p))));
      const id = (s.youtube || '').split('/').pop().split('?')[0];
      if (id) { const box = h('div', 'ytbox', `<img src="${A('video/' + s.poster + '.jpg')}" alt=""><button aria-label="${esc(T.play)}"><svg viewBox="0 0 100 100"><polygon points="29.3,0 70.7,0 100,29.3 100,70.7 70.7,100 29.3,100 0,70.7 0,29.3" fill="#FD2F33"/><polygon points="40,30 40,70 72,50" fill="#fff"/></svg></button>`);
        box.onclick = () => { box.classList.add('on'); box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="${esc(s.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; };
        c.inn.append(box, h('p', 'yt', `<a href="${s.youtube}" target="_blank" rel="noopener">${T.yt}</a>`)); }
      else if (s.video) { const v = h('video', 'vid'); v.src = A('video/' + s.video + '.mp4'); v.poster = A('video/' + s.poster + '.jpg'); v.controls = true; v.playsInline = true; v.preload = 'metadata'; c.inn.append(v); c.media = v; }
      else c.inn.append(ph(s.ph)); },
    // адаптации: обычная сетка кадров, без скролла внутри
    adgrid(s) { const c = section('adgrid', s.title, s.id); c.inn.append(h('h2', '', esc(s.sub))); const g = h('div', 'adg');
      s.cols.forEach(f => g.append(h('div', 'adc', `<img src="${A(f.img + '.jpg')}" alt=""><p class="where">${esc(f.where)}</p><h3>${esc(f.name)}</h3><p class="cap">${esc(f.cap)}</p>` + f.lines.map(lineHtml).join(''))));
      c.inn.append(g); },
    lines_table(s) { const c = section('text', s.title, s.id); c.inn.append(h('p', 'tagx', 'Экстра · из режзаметок'), h('h2', '', esc(s.title)));
      c.inn.append(h('table', 'lt', '<tr><th>Кадр</th><th>В брифе</th><th>Предлагаю</th></tr>' + s.rows.map(r => '<tr>' + r.map(x => `<td>${esc(x)}</td>`).join('') + '</tr>').join(''))); },
    list(s) { const c = section('text', s.title, s.id); c.inn.append(h('p', 'tagx', 'Экстра · из режзаметок'), h('h2', '', esc(s.title))); const d = h('div', 'items'); s.items.forEach(i => d.append(h('p', '', esc(i)))); c.inn.append(d); },
  };

  // ---------- сториборд: одно закреплённое окно на ситуацию, один шаг скролла — один кадр целиком
  function storyboard(frames, sitTitle) {
    const c = section('sb', sitTitle, frames[0].id);
    const bar = h('div', 'sbbar'), k = h('p', 'kicker', esc(sitTitle)), cnt = h('p', 'cnt'); k.style.margin = 0; bar.append(k, cnt);
    const win = h('div', 'win'), imgs = h('div', 'imgs'), txts = h('div', 'txts'), rail = h('div', 'rail', '<i></i>'), hint = h('p', 'sbhint', esc(T.scroll) + ' <b>↓</b>'); win.append(imgs, txts, rail);
    c.inn.remove(); c.pin.append(bar, win, hint);
    const real = frames.filter(f => f.kind === 'frame' && !f.xtra); const seq = []; const model = sitTitle.split(' · ')[1] || '';
    frames.forEach(f => {
      if (f.kind === 'frame') { const im = h('img'); im.loading = 'lazy'; im.src = A('sb/' + f.img + '.jpg'); im.alt = f.name || f.title; imgs.append(im);
        const t = h('div', 't', `<div class="th"><p class="kicker">${esc(f.model || model)}</p>${f.xtra ? `<p class="xk"><b>${esc(T.extra)}</b>${esc(f.xtra)}</p>` : ''}<h3>${esc(f.name || f.title)}</h3></div><p class="cap">${esc(f.cap)}</p>` + f.lines.map(lineHtml).join('')); txts.append(t);
        seq.push({ f, im, t, text: (f.name || f.title) + '. ' + f.cap + (f.lines.length ? ' ' + f.lines.map(l => LANG === 'ru' ? '«' + l[1] + '»' : '“' + l[0] + '”').join(' ') : '') }); }
      else if (f.kind === 'hovli' && seq.length) { const p = h('div', 'pop', `<p class="kicker">${esc(f.kicker)}</p><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p><div class="ims">${f.imgs.map(i => `<img src="${A('loc/' + (i === 'hovli_a' ? '15_zs_court_street_A' : '16_hs_court_reverse_A') + '.jpg')}" alt="">`).join('')}</div>`); c.pin.append(p);
        const prev = seq[seq.length - 1]; seq.push({ ...prev, pop: p, f, text: f.title + ': ' + f.text, keep: prev.f }); }
    });
    c.steps = seq.slice(1).map(q => ({ node: document.createElement('i'), text: q.text, noteId: q.f.id }));
    c.apply = n => { const q = seq[Math.min(seq.length - 1, Math.max(0, n))];
      imgs.querySelectorAll('img').forEach(i => i.classList.toggle('on', i === q.im));
      txts.querySelectorAll('.t').forEach(t => { t.classList.toggle('cur', t === q.t); t.classList.toggle('txt', t === q.t); });
      c.pin.querySelectorAll('.pop').forEach(p => p.classList.toggle('on', p === q.pop));
      const fr = q.keep || q.f, i = real.indexOf(fr); cnt.textContent = fr.xtra ? T.extra : (i + 1) + ' / ' + real.length; c.el.classList.toggle('xf', !!fr.xtra);
      const th = rail.querySelector('i'); th.style.height = (100 / seq.length) + '%'; th.style.top = (n / seq.length * 100) + '%'; hint.classList.toggle('off', n > 0); };
    rail.onclick = e => { const r = rail.getBoundingClientRect(), i = Math.min(seq.length - 1, Math.max(0, Math.floor((e.clientY - r.top) / r.height * seq.length))); scrollTo({ top: c.el.offsetTop + (c.steps.length ? i / c.steps.length * c.span : 0), behavior: 'smooth' }); };
    seq.forEach((q, i) => { if (q.f.xtra) { const u = document.createElement('u'); u.style.top = (i / seq.length * 100) + '%'; u.style.height = (100 / seq.length) + '%'; rail.prepend(u); } });
    c.fast = true; c.apply(0);
  }

  // ---------- сборка
  let group = null, sit = '';
  const flush = () => { if (group && group.length) storyboard(group, sit); group = null; };
  for (const s of data.slides) {
    if (s.extra && !DRAFT) continue;
    if (s.kind === 'frame' || s.kind === 'hovli') { if (s.group && s.group !== sit) { flush(); sit = s.group; } (group = group || []).push(s); continue; }
    flush(); if (s.kind === 'chapter' && s.id.startsWith('sit-')) sit = s.title + ' · ' + s.sub;
    const before = SECTIONS.length; (R[s.kind] || R.text)(s);
    // блок продолжается: тот же заголовок, что у предыдущего экрана, второй раз не пишем
    if (SECTIONS.length > before && before && SECTIONS[before].title === SECTIONS[before - 1].title && SECTIONS[before - 1].kind !== 'cover' && SECTIONS[before].kind !== 'adgrid') SECTIONS[before].el.classList.add('cont');
  }
  flush();

  // ---------- навигатор слева: те же пункты, что в оглавлении
  const navItems = []; let nav = null;
  if (NAV) { nav = h('nav', 'lnav'); NAV.forEach(([lab, tid]) => { const i = SECTIONS.findIndex(x => x.noteId === tid); if (i < 0) return;
      const a = h('a', '', `<i></i><span>${esc(lab)}</span>`); a.href = '#'; a.onclick = e => { e.preventDefault(); jump(tid); }; a._i = i; nav.append(a); navItems.push(a); });
    document.body.append(nav); }
  const DARK = ['cover', 'chapter', 'thanks', 'statement', 'sb', 'adgrid'];
  // одна шапка на всю страницу: раздел в ней меняется по ходу скролла
  const hdr = h('div', 'hdr', '<span>MG Uzbekistan</span><span class="ht"></span>' + logoSvg()); document.body.append(hdr);

  // ---------- видео без звука играет, только пока его видно
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) v.play().catch(() => { }); else v.pause(); }), { threshold: .2 });
    document.querySelectorAll('video.autov').forEach(v => io.observe(v)); }

  // ---------- высоты и шаги
  // пересчитываем, только когда реально изменились ширина или высота экрана без панелей; после пересчёта возвращаемся в то же место
  let LW = 0, LH = 0;
  function layout() { const w = innerWidth, vh = VH(); if (w === LW && vh === LH) return;
    let keep = null; if (LW) { const y = scrollY; let i = 0; SECTIONS.forEach((s, k) => { if (s.el.offsetTop <= y + 1) i = k; }); const s = SECTIONS[i]; keep = [s, (y - s.el.offsetTop) / Math.max(1, s.el.offsetHeight)]; }
    LW = w; LH = vh;
    SECTIONS.forEach(s => { const flow = FLOW && !s.steps.length, per = s.per || (s.fast ? .5 : .6); s.el.classList.toggle('flow', flow); s.span = s.steps.length * per * vh; s.el.style.height = flow ? '' : (vh + s.span) + 'px'; });
    if (keep) scrollTo(0, keep[0].el.offsetTop + keep[1] * keep[0].el.offsetHeight); }
  layout(); addEventListener('resize', layout);
  // место под картинку известно до загрузки: текст под ней не прыгает, пока она грузится
  document.querySelectorAll('img').forEach(im => { const p = (im.getAttribute('src') || '').split('assets/')[1], d = p && DIM[p.split('?')[0]]; if (d && getComputedStyle(im).aspectRatio === 'auto') im.style.aspectRatio = d[0] + ' / ' + d[1]; });
  const byId = Object.fromEntries(data.slides.map(s => [s.id, s]));
  const ch = 'BroadcastChannel' in window ? new BroadcastChannel('mg-treatment') : null;
  let last = '';
  function state() {
    const y = scrollY + 1; let idx = 0;
    SECTIONS.forEach((s, i) => { if (s.el.offsetTop <= y + VH() * .5) idx = i; });
    SECTIONS.forEach((s, i) => { const top = s.el.offsetTop, n = s.steps.length; let st = 0; const p = Math.max(0, Math.min(1, (scrollY - top) / Math.max(1, s.span)));
      if (n) { st = s.fr ? s.fr.filter(f => p >= f - .004).length : Math.max(0, Math.min(n, Math.floor(p * n + .5))); if (scrollY < top - VH() * .35) st = 0; }
      if (s.cur !== st) { s.cur = st; s.apply(st); }
      if (s.scrub && s.scrub.duration && Math.abs(scrollY - top) < s.span + VH()) s.scrub.currentTime = p * (s.scrub.duration - .05);
      if (s.scrubTo && Math.abs(scrollY - top) < s.span + VH()) s.scrubTo(p);
      if (s.track) s.track(p); });
    let ti = 0; SECTIONS.forEach((x, i) => { if (x.el.offsetTop <= scrollY + 60) ti = i; }); hdr.classList.toggle('dark', DARK.includes(SECTIONS[ti].kind));
    hdr.classList.toggle('xf', SECTIONS[ti].el.classList.contains('xf'));
    hdr.classList.toggle('solid', MOB && !['cover', 'chapter', 'thanks', 'statement'].includes(SECTIONS[ti].kind));
    const s = SECTIONS[idx], st = s.cur || 0, nid = st ? s.steps[st - 1].noteId : s.noteId, src = byId[nid] || {};
    const nx = s.steps[st] ? { kind: 'step', text: s.steps[st].text } : (SECTIONS[idx + 1] ? { kind: 'slide', text: SECTIONS[idx + 1].title } : { kind: 'end', text: '' });
    const msg = { t: 'state', lang: LANG, id: nid || s.noteId || '', idx, total: SECTIONS.length, step: st, steps: s.steps.length, title: (byId[nid] && s.kind === 'sb') ? s.title + ' · ' + (src.name || src.title) : s.title,
      now: st ? s.steps[st - 1].text : '', next: nx, say: src.say_b || [], notes: src.notes_b || [], todo: src.todo_b || [], hasVideo: !!s.media, hasAudio: !!s.plays, nextTitle: SECTIONS[idx + 1] ? SECTIONS[idx + 1].title : '' };
    const key = JSON.stringify([idx, st]); if (key !== last) { last = key; if (ch) ch.postMessage(msg); try { localStorage.setItem('mg-treatment-state', JSON.stringify(msg)); } catch (e) { } try { history.replaceState(null, '', '#' + idx + '.' + st); } catch (e) { }
      hdr.querySelector('.ht').textContent = s.kind === 'cover' ? '' : s.title.split(' · ')[0];
      if (nav) { let cur = null; navItems.forEach(a => { if (a._i <= idx) cur = a; }); navItems.forEach(a => a.classList.toggle('cur', a === cur)); nav.classList.toggle('dark', DARK.includes(s.kind)); nav.classList.toggle('hide', idx === 0); } }
    return { idx, st, s };
  }
  let raf = 0; addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; state(); }); }, { passive: true });

  // ---------- стрелки: шаг вперёд / назад
  function stops() { const a = []; SECTIONS.forEach(s => { const n = s.steps.length, top = s.el.offsetTop; a.push(top); if (s.fr) s.fr.forEach(f => a.push(Math.round(top + f * s.span))); else for (let k = 1; k <= n; k++) a.push(Math.round(top + k / n * s.span)); }); return a; }
  function go(dir) { const a = stops(), y = scrollY; let t = dir > 0 ? a.find(v => v > y + 4) : [...a].reverse().find(v => v < y - 4); if (t == null) return; scrollTo({ top: t, behavior: 'smooth' }); }
  addEventListener('keydown', e => { if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return; if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); } if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); } });

  // ---------- команды из окна контроля
  const onCmd = m => { if (!m || m.t !== 'cmd') return; const { s } = state();
    if (m.c === 'next') go(1); if (m.c === 'prev') go(-1);
    if (m.c === 'video' && s.media) s.media.paused ? s.media.play() : s.media.pause();
    if (m.c === 'audio' && s.plays && s.plays[m.i]) s.plays[m.i]();
    if (m.c === 'hello') { last = ''; state(); } };
  if (ch) ch.onmessage = e => onCmd(e.data);
  addEventListener('storage', e => { if (e.key === 'mg-treatment-cmd' && e.newValue) onCmd(JSON.parse(e.newValue)); });

  // ---------- старт
  if (window.CONTROL_URL) { const cn = h('div', 'nav draftonly', `<a href="${window.CONTROL_URL}" target="mgcontrol">окно контроля</a>`); document.body.append(cn); }
  const m = location.hash.match(/^#(\d+)\.(\d+)$/);
  if (m && SECTIONS[+m[1]]) { const s = SECTIONS[+m[1]], n = s.steps.length; scrollTo(0, s.el.offsetTop + (n ? (s.fr ? (s.fr[+m[2] - 1] || 0) : +m[2] / n) * s.span : 0)); }
  state();
})();
