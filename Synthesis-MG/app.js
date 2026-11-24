/* MG Uzbekistan — движок тритмента.
   Один контент-файл (content_<lang>.json) → длинная страница со скроллом.
   Заголовок слайда виден сразу, текст появляется шагами при скролле (или стрелками).
   Состояние уходит в окно контроля (control.html) через BroadcastChannel. */
(async function () {
  const LANG = window.LANG || 'ru', BASE = window.BASE || '../';
  const Q = new URLSearchParams(location.search);
  const DRAFT = Q.has('draft');           // ?draft — показывать плейсхолдеры и экстраслайды
  if (DRAFT) document.body.classList.add('draft');
  const A = p => BASE + 'assets/' + p;
  let resp = await fetch(BASE + 'content_' + LANG + '.json', { cache: 'no-store' });
  if (!resp.ok) resp = await fetch(BASE + 'content_ru.json', { cache: 'no-store' });   // /en появится после утверждения /ru
  const data = await resp.json();
  const root = document.getElementById('app');
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const LOGO = ["M347.79 109.74 C347.49 105.66 345.87 101.79 343.21 98.7 C336.24 90.63 320.57 72.96 298.75 51.17 C276.9 29.36 259.23 13.74 251.14 6.76 C248.05 4.1 244.17 2.48 240.09 2.18 C229.73 1.39 206.94 0.0 175.0 0.0 C143.06 0.0 120.27 1.39 109.91 2.18 C105.83 2.48 101.95 4.1 98.86 6.76 C90.77 13.72 73.1 29.36 51.25 51.17 C28.64 73.75 13.48 90.86 6.74 98.7 C4.08 101.79 2.51 105.64 2.18 109.68 C1.39 120.01 0.0 142.79 0.0 174.73 C0.0 206.67 1.42 229.09 2.21 239.74 C2.51 243.82 4.11 247.69 6.77 250.78 C13.54 258.65 28.67 275.73 51.25 298.28 C73.1 320.1 90.77 335.71 98.86 342.7 C101.95 345.35 105.83 346.21 109.91 346.54 C120.27 347.33 143.06 348.72 175.0 348.72 C206.94 348.72 229.73 347.33 240.09 346.54 C244.17 346.24 248.05 345.38 251.14 342.7 C259.23 335.74 276.92 320.1 298.75 298.28 C321.33 275.73 336.46 258.65 343.23 250.78 C345.89 247.66 347.49 243.82 347.79 239.74 C348.58 229.09 350.0 205.58 350.0 174.73 C350.0 143.88 348.61 120.09 347.82 109.74 L347.79 109.74 M334.03 235.06 C333.78 238.5 332.41 241.77 330.15 244.4 C324.07 251.49 310.03 267.38 288.89 288.49 C267.75 309.59 251.96 323.44 244.68 329.69 C242.04 331.94 238.77 333.28 235.33 333.56 C226.0 334.29 204.83 335.61 174.92 335.61 C145.01 335.61 123.85 334.29 114.52 333.56 C111.07 333.28 107.8 331.94 105.17 329.69 C97.89 323.44 81.42 308.91 60.96 288.49 C39.82 267.38 25.78 251.49 19.72 244.4 C17.46 241.77 16.12 238.5 15.84 235.06 C15.13 225.49 13.76 203.6 13.76 174.73 C13.76 145.85 15.11 123.63 15.82 114.37 C16.1 110.95 17.44 107.71 19.67 105.1 C25.73 98.04 39.8 82.12 60.96 60.97 C81.42 40.54 97.89 26.02 105.17 19.77 C107.8 17.51 111.07 16.17 114.52 15.89 C123.85 15.16 145.01 13.84 174.92 13.84 C204.83 13.84 226.0 15.16 235.3 15.89 C238.75 16.17 242.02 17.51 244.66 19.77 C251.93 26.02 268.41 40.54 288.86 60.97 C309.29 81.37 323.87 97.84 330.13 105.1 C332.38 107.74 333.73 111.0 334.01 114.44 C334.74 123.76 336.06 144.91 336.06 174.75 C336.06 204.59 334.69 225.54 333.98 235.09 L334.03 235.09 L334.03 235.06 Z", "M314.61 141.78 C314.36 130.08 313.42 119.88 313.12 117.63 C312.61 116.7 311.34 115.28 310.56 114.42 C300.52 103.08 290.43 92.12 276.69 78.48 C249.98 51.93 235.63 39.35 232.11 36.9 C229.47 36.6 224.6 36.22 211.42 35.63 C200.93 35.18 187.62 34.87 186.51 34.92 C186.46 37.25 186.28 212.49 186.43 312.12 C186.43 313.95 186.51 314.53 186.51 314.53 C186.51 314.53 217.3 314.81 232.21 312.73 C242.4 304.2 261.74 285.96 275.83 271.88 C290.89 256.67 303.82 242.86 307.11 238.98 C308.48 237.36 311.57 234.05 313.17 231.8 C313.4 229.87 313.55 228.25 313.78 224.68 C314.87 207.07 315.1 175.51 315.1 174.47 C313.73 174.4 267.62 174.45 266.61 174.47 C266.58 175.26 266.68 198.67 266.68 198.79 C267.24 198.82 289.32 198.79 290.13 198.79 C290.13 199.2 289.52 218.74 289.01 222.0 C287.26 224.43 284.45 226.99 281.33 230.51 C277.94 234.3 273.07 239.44 263.06 249.69 C250.54 262.52 231.04 280.72 222.32 288.41 C222.42 287.25 222.12 63.22 222.22 60.97 C224.5 62.86 229.98 67.88 231.5 69.29 C242.09 79.21 253.17 89.39 262.17 98.8 C275.33 112.54 288.51 126.84 289.09 127.83 C289.27 128.87 289.82 140.81 289.8 141.8 C290.71 141.9 313.68 141.75 314.59 141.8 Z", "M127.65 313.29 C127.55 269.63 127.57 217.27 127.57 137.09 C127.78 132.03 127.57 104.19 127.57 104.19 C127.57 104.19 127.19 105.51 126.81 105.89 C121.29 120.14 114.93 135.09 108.87 150.91 C101.14 171.08 93.79 192.01 87.96 207.42 L87.42 206.97 L71.0 177.94 L59.47 157.8 C59.47 157.8 59.47 182.12 59.52 184.44 C59.67 206.61 60.45 224.38 61.37 243.56 C61.44 246.02 62.46 259.79 62.46 259.79 C62.38 259.79 54.47 251.59 50.21 247.11 C42.63 239.11 40.07 236.0 36.7 231.75 C35.26 217.17 34.57 200.95 34.83 170.04 C35.08 140.0 36.4 120.47 36.58 118.01 C36.68 117.63 36.37 117.71 37.46 116.44 C39.72 113.81 50.42 101.69 53.1 99.21 C54.37 98.04 54.62 97.94 54.62 97.94 C54.62 97.94 56.07 99.99 56.88 101.18 C61.57 108.01 69.86 122.64 77.64 135.9 C82.33 143.88 82.89 144.61 82.89 144.61 C82.89 144.61 89.15 125.96 104.28 88.48 C115.86 59.8 127.17 36.72 127.47 35.96 C128.31 35.86 136.95 35.56 145.98 35.15 C155.23 34.72 162.61 34.85 163.54 34.9 C163.59 36.6 163.67 37.61 163.67 37.61 L163.67 311.31 C163.67 312.5 163.72 313.14 163.67 314.43 C163.01 314.45 161.49 314.43 160.27 314.43 C146.38 314.38 131.22 313.54 127.52 313.34 Z"];
  const logoSvg = () => '<svg class="lg" viewBox="0 0 350 348.72" fill="currentColor" aria-label="MG">' + LOGO.map(d => '<path d="' + d + '"/>').join('') + '</svg>';
  const SECTIONS = [];   // {el, steps:[{noteId,text}], title, apply(step)}

  function section(kind, title, noteId) {
    const el = h('section', 's s-' + kind), pin = h('div', 'pin'), inn = h('div', 'in');
    pin.appendChild(h('div', 'lab', '<span>MG Uzbekistan</span><span>' + esc(title) + '</span>' + logoSvg()));
    pin.appendChild(inn); el.appendChild(pin); root.appendChild(el);
    const sec = { el, pin, inn, kind, title, noteId, steps: [], media: null };
    sec.step = (node, text, nid) => { sec.steps.push({ node, text: text || '', noteId: nid || noteId }); node.dataset.step = sec.steps.length; return node; };
    sec.apply = n => sec.steps.forEach((s, i) => s.node.classList.toggle('on', i < n));
    SECTIONS.push(sec); return sec;
  }
  const ph = t => h('div', 'ph', 'Плейсхолдер · ' + esc(t));

  // ---------- рендер по типам
  const R = {
    cover(s) { const c = section('cover', "Director’s treatment", s.id); c.inn.append(h('div', 'lock', '<h1>Director’s</h1><span class="script">treatment</span>'));
      c.pin.append(h('div', 'by', 'Damir Mubinov'));
      if (s.cover_video) { c.el.classList.add('hasvid'); const v = h('video', 'covv'); v.src = A('video/' + s.cover_video + '.mp4'); v.poster = A('video/' + s.cover_video + '_poster.jpg'); v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        c.pin.prepend(v, h('div', 'covscrim')); c.media = v; v.play().catch(() => { }); }
      if (s.cover_img) { const i = h('img', 'cov'); i.src = A(s.cover_img); c.inn.append(i); } },
    chapter(s) { const c = section('chapter', s.title, s.id); c.inn.append(h('h1', '', esc(s.title)), h('p', 'sub', esc(s.sub))); },
    thanks(s) { const c = section('thanks', s.title, s.id); const [a, b] = s.title.split('! '); c.inn.append(h('div', 'lock', '<h1>' + esc(a) + '!</h1><span class="script">' + esc(b || '') + '</span>')); c.inn.append(c.step(h('p', 'said', esc(s.text)), s.text)); },
    statement(s) { const c = section('statement', s.title, s.id); c.inn.append(h('h2', '', esc(s.title))); c.inn.append(c.step(h('p', 'big', esc(s.text)), s.text)); },
    text(s) { const c = section('text', s.title, s.id); if (s.extra) c.inn.append(h('p', 'tagx', 'Экстра · из режзаметок'));
      c.inn.append(h('h2', '', esc(s.title))); const row = h('div', 'row'), col = h('div', 'col'); row.append(col);
      s.body.forEach(p => col.append(c.step(h('p', '', esc(p)), p)));
      if (s.phs) { const side = h('div', 'side draftonly'); s.phs.forEach(p => side.append(ph(p))); row.append(side); }
      if (s.pics) { const side = h('div', 'side pics'); s.pics.forEach(([k, m, part]) => side.append(c.step(h('div', 'pic3', `<img src="${A(k + '.jpg')}" alt=""><div><p class="kicker">${esc(part)}</p><h2>${esc(m)}</h2></div>`), m))); row.append(side); }
      if (s.pic) { const side = h('div', 'side'); const im = h('img', 'pic1'); im.onload = () => { if (im.naturalHeight > im.naturalWidth) im.classList.add('tall'); }; im.src = A(s.pic[0] + '.jpg'); im.alt = s.pic[1]; side.append(s.pic_static ? im : c.step(im, s.pic[1])); row.append(side); if (s.pic_left) row.classList.add('picleft'); }
      c.inn.append(row); },
    idea_world(s) { const c = section('idea', s.title, s.id); c.inn.append(h('h2', '', esc(s.title)), h('p', 'lead', esc(s.lead)));
      const w = h('div', 'world'); w.append(c.step(h('p', 'pill', esc(s.bubble)), s.bubble)); const i = h('img'); i.src = A('car/zs_red.png'); i.alt = 'MG ZS'; w.append(i); c.inn.append(w); },
    idea_callouts(s) { const c = section('idea', s.title, s.id); c.inn.append(h('h2', '', esc(s.title)), h('p', 'lead', esc(s.lead)));
      const wrap = h('div', 'stagewrap'), st = h('div', 'stage'); wrap.append(st); c.inn.append(wrap);
      // TODO turntable: когда появится assets/video/turntable.mp4 — вписать в content "turntable" и крутить его по скроллу
      let car; if (s.turntable) { car = h('video', 'car'); car.src = A(s.turntable); car.muted = true; car.playsInline = true; car.preload = 'auto'; c.scrub = car; } else { car = h('img', 'car'); car.src = A('car/zs_red.png'); }
      st.append(car);
      const P = { logo: [532, 333], trunk: [1204, 306], hood: [672, 284] }, POS = { logo: [0, 300, 350], trunk: [1296, 150, 368], hood: [120, s.turntable ? -14 : 10, 420] };
      const FROM = { logo: [364, 60], trunk: [-12, 60], hood: [430, 110] };
      s.callouts.forEach(([who, av, q, part]) => { const g = h('div'); const [lx, ly, w] = POS[part], [px, py] = P[part], [fx, fy] = FROM[part];
        g.innerHTML = (s.turntable ? '' : `<svg><line x1="${lx + fx}" y1="${ly + fy}" x2="${px}" y2="${py}" stroke="#FD2F33" stroke-width="3"/><polygon transform="translate(${px - 9},${py - 9}) scale(1.8)" points="2.93,0 7.07,0 10,2.93 10,7.07 7.07,10 2.93,10 0,7.07 0,2.93" fill="#FD2F33"/></svg>`) + `
          <div class="callout" style="left:${lx}px;top:${ly}px;width:${w}px"><img src="${A('av/' + av + '.jpg')}" alt=""><div><p class="who">${esc(who)}</p><p class="q">${esc(q)}</p></div></div>`;
        st.append(c.step(g, who + ': ' + q)); });
      const fit = () => { const k = Math.min(1, (wrap.clientWidth) / 1664, (innerHeight * .56) / 560); st.style.transform = `scale(${k})`; wrap.style.height = 560 * k + 'px'; };
      addEventListener('resize', fit); requestAnimationFrame(fit); },
    value_table(s) { const c = section('value', s.title, s.id); c.inn.append(h('h2', '', esc(s.title)), h('p', 'vlead', esc(s.lead))); const vt = h('div', 'vt');
      if (s.heads) vt.append(h('div', 'vr vhd', `<p class="who">${esc(s.heads[0])}</p><p class="who">${esc(s.heads[1])}</p><p class="who">${esc(s.heads[2])}</p>`));
      s.table.forEach(([who, av, q, ben]) => { const r = h('div', 'vr', `<img src="${A('av/' + av + '.jpg')}" alt=""><p class="who">${esc(who)}</p><p>${esc(q)}</p>`); r.append(c.step(h('p', 'ben', esc(ben)), who + ' → ' + ben)); vt.append(r); });
      c.inn.append(vt); },
    culture(s) { const c = section('culture', s.title, s.id); c.inn.append(h('h2', '', esc(s.title))); const row = h('div', 'row'), col = h('div', 'col'), side = h('div', 'side'); row.append(col, side);
      s.body.forEach(p => col.append(c.step(h('p', '', esc(p)), p)));
      const f = h('div', 'faces' + (s.face_imgs ? '' : ' draftonly')); s.faces.forEach((l, i) => { const d = h('div', 'face'); if (s.face_imgs) { const im = h('img'); im.src = A(s.face_imgs[i]); im.alt = l; d.append(im); } else d.append(ph('лицо дедушки')); d.append(h('p', 'lab', esc(l))); f.append(s.face_imgs ? c.step(d, l) : d); });
      if (s.face_imgs) side.append(f); else side.append(c.step(f, s.faces.join(' → '))); c.inn.append(row); },
    mnemonic(s) { const c = section('mnemonic', s.title, s.id); c.inn.append(h('h2', '', esc(s.title))); const row = h('div', 'row'), col = h('div', 'col'); row.append(col); c.inn.append(row);
      s.body.forEach(p => col.append(c.step(h('p', '', esc(p)), p)));
      const arc = h('div', 'arc'); c.audio = [];
      if (s.arc.length === 4) arc.classList.add('arc4');
      s.arc.forEach(([lab, file, word, wave], k) => { const b = h('button', 'mg k' + (k + 1), `<div class="w">${esc(word || 'MG')}</div>${wave ? `<svg class="wave" viewBox="0 0 194 90">${wave}</svg>` : ''}<p class="lab">${esc(lab)}</p>`); const au = new Audio(A(`audio/${LANG}/${file}.mp3`)); au.preload = 'auto';
        const play = () => { c.audio.forEach(x => { x.pause(); x.currentTime = 0; }); au.play().catch(() => { }); b.classList.add('playing'); au.onended = () => b.classList.remove('playing'); };
        b.onclick = play; c.audio.push(au); (c.plays = c.plays || []).push(play); arc.append(c.step(b, (word || 'MG') + ' — ' + lab)); });
      c.inn.append(arc); },
    video(s) { if (!s.video && !DRAFT) return; const c = section('video', s.title, s.id); c.inn.append(h('h2', '', esc(s.title)));
      if (s.video) { const v = h('video', 'vid'); v.src = A('video/' + s.video + '.mp4'); v.poster = A('video/' + s.poster + '.jpg'); v.controls = true; v.playsInline = true; v.preload = 'metadata'; c.inn.append(v); c.media = v; if (s.youtube) c.inn.append(h('p', 'yt', `<a href="${s.youtube}" target="_blank" rel="noopener">${LANG === 'ru' ? 'Смотреть на YouTube' : 'Watch on YouTube'}</a>`)); }
      else c.inn.append(ph(s.ph)); },
    lines_table(s) { const c = section('text', s.title, s.id); c.inn.append(h('p', 'tagx', 'Экстра · из режзаметок'), h('h2', '', esc(s.title)));
      c.inn.append(h('table', 'lt', '<tr><th>Кадр</th><th>В брифе</th><th>Предлагаю</th></tr>' + s.rows.map(r => '<tr>' + r.map(x => `<td>${esc(x)}</td>`).join('') + '</tr>').join(''))); },
    list(s) { const c = section('text', s.title, s.id); c.inn.append(h('p', 'tagx', 'Экстра · из режзаметок'), h('h2', '', esc(s.title))); const d = h('div', 'items'); s.items.forEach(i => d.append(h('p', '', esc(i)))); c.inn.append(d); },
  };

  // ---------- сториборд: одно закреплённое окно на ситуацию, шаги: картинка → текст
  function storyboard(frames, sitTitle) {
    const c = section('sb', sitTitle, frames[0].id);
    const bar = h('div', 'sbbar'), k = h('p', 'kicker', esc(sitTitle)), cnt = h('p', 'cnt'); k.style.margin = 0; bar.append(k, cnt);
    const win = h('div', 'win'), imgs = h('div', 'imgs'), txts = h('div', 'txts'), prog = h('div', 'prog', '<i></i>'); win.append(imgs, txts);
    c.inn.remove(); c.pin.append(bar, win, prog);
    const real = frames.filter(f => f.kind === 'frame'); const seq = [];
    frames.forEach(f => {
      if (f.kind === 'frame') { const im = h('img'); im.loading = 'lazy'; im.src = A('sb/' + f.img + '.jpg'); im.alt = f.title; imgs.append(im);
        const t = h('div', 't', `<div class="pframe"><span>${esc(sitTitle.split(' · ')[1] || '')}</span><span>${esc(f.title)}</span></div><p class="cap">${esc(f.cap)}</p>` + f.lines.map(([en, ru]) => `<div class="ln"><p class="ru">${LANG === 'ru' ? '«' + esc(ru) + '»' : '“' + esc(en) + '”'}</p>${LANG === 'ru' ? `<p class="en">${esc(en)}</p>` : ''}</div>`).join('')); txts.append(t);
        seq.push({ f, im, t, txt: false, text: (LANG === 'ru' ? 'Кадр ' : 'Shot ') + f.title }); seq.push({ f, im, t, txt: true, text: f.cap + (f.lines.length ? ' ' + f.lines.map(l => LANG === 'ru' ? '«' + l[1] + '»' : '“' + l[0] + '”').join(' ') : '') }); }
      else if (f.kind === 'hovli') { const p = h('div', 'pop', `<p class="kicker">${esc(f.kicker)}</p><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p><div class="ims">${f.imgs.map(i => `<img src="${A('loc/' + (i === 'hovli_a' ? '15_zs_court_street_A' : '16_hs_court_reverse_A') + '.jpg')}" alt="">`).join('')}</div>`); c.pin.append(p);
        const prev = seq[seq.length - 1]; seq.push({ ...prev, pop: p, f, text: f.title + ': ' + f.text, keep: prev.f }); }
    });
    c.steps = seq.map(q => ({ node: document.createElement('i'), text: q.text, noteId: q.f.id }));
    c.apply = n => { const q = seq[Math.max(0, n - 1)]; const first = n === 0;
      imgs.querySelectorAll('img').forEach(i => i.classList.toggle('on', i === q.im));
      txts.querySelectorAll('.t').forEach(t => { t.classList.toggle('cur', t === q.t); t.classList.toggle('txt', t === q.t && q.txt && !first); });
      c.pin.querySelectorAll('.pop').forEach(p => p.classList.toggle('on', p === q.pop && !first));
      const fr = q.keep || q.f; cnt.textContent = fr.title + ' · ' + (real.indexOf(fr) + 1) + ' / ' + real.length; prog.firstChild.style.width = (n / seq.length * 100) + '%'; };
    c.fast = true;
  }

  // ---------- сборка
  let group = null, sit = '';
  const flush = () => { if (group && group.length) storyboard(group, sit); group = null; };
  for (const s of data.slides) {
    if (s.extra && !DRAFT) continue;
    if (s.kind === 'frame' || s.kind === 'hovli') { if (s.group && s.group !== sit) { flush(); sit = s.group; } (group = group || []).push(s); continue; }
    flush(); if (s.kind === 'chapter' && s.id.startsWith('sit-')) sit = s.title + ' · ' + s.sub;
    (R[s.kind] || R.text)(s);
  }
  flush();

  // ---------- продуктовая рамка брендбука: контур с фасками
  function mgFrame(el) { const cells = [...el.querySelectorAll('span')]; const hh = el.offsetHeight; if (!hh) return; const c = hh * .28, n = hh * .22; let x = 0; const joins = [];
    cells.forEach((s, i) => { x += s.offsetWidth; if (i < cells.length - 1) joins.push(x); }); const W = x, sw = Math.max(1.5, hh * .035), p = [[c, 0]];
    joins.forEach(j => p.push([j - n, 0], [j, n], [j + n, 0])); p.push([W - c, 0], [W, c], [W, hh - c], [W - c, hh]);
    joins.slice().reverse().forEach(j => p.push([j + n, hh], [j, hh - n], [j - n, hh])); p.push([c, hh], [0, hh - c], [0, c]);
    const old = el.querySelector('svg'); if (old) old.remove(); const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', `${-sw} ${-sw} ${W + 2 * sw} ${hh + 2 * sw}`); s.style.cssText = `position:absolute;left:${-sw}px;top:${-sw}px;width:${W + 2 * sw}px;height:${hh + 2 * sw}px;pointer-events:none`;
    s.innerHTML = `<polygon points="${p.map(q => q.join(',')).join(' ')}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`; el.appendChild(s); }
  const frames = () => document.querySelectorAll('.pframe').forEach(mgFrame);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(frames); addEventListener('load', frames); addEventListener('resize', frames);

  // ---------- высоты и шаги
  const VH = () => innerHeight;
  function layout() { SECTIONS.forEach(s => { const per = s.fast ? .42 : .6; s.span = s.steps.length * per * VH(); s.el.style.height = (VH() + s.span) + 'px'; }); }
  layout(); addEventListener('resize', layout);
  const byId = Object.fromEntries(data.slides.map(s => [s.id, s]));
  const ch = 'BroadcastChannel' in window ? new BroadcastChannel('mg-treatment') : null;
  let last = '';
  function state() {
    const y = scrollY + 1; let idx = 0;
    SECTIONS.forEach((s, i) => { if (s.el.offsetTop <= y + VH() * .5) idx = i; });
    SECTIONS.forEach((s, i) => { const top = s.el.offsetTop, n = s.steps.length; let st = 0;
      if (n) { const p = (scrollY - top) / Math.max(1, s.span); st = Math.max(0, Math.min(n, Math.floor(p * n + .5))); if (scrollY < top - VH() * .35) st = 0; }
      if (s.cur !== st) { s.cur = st; s.apply(st); }
      if (s.scrub && s.scrub.duration) s.scrub.currentTime = Math.max(0, Math.min(1, (scrollY - top) / Math.max(1, s.span))) * (s.scrub.duration - .05); });
    const s = SECTIONS[idx], st = s.cur || 0, nid = st ? s.steps[st - 1].noteId : s.noteId, src = byId[nid] || {};
    const nx = s.steps[st] ? { kind: 'step', text: s.steps[st].text } : (SECTIONS[idx + 1] ? { kind: 'slide', text: SECTIONS[idx + 1].title } : { kind: 'end', text: '' });
    const msg = { t: 'state', lang: LANG, id: nid || s.noteId || '', idx, total: SECTIONS.length, step: st, steps: s.steps.length, title: (byId[nid] && s.kind === 'sb') ? s.title + ' · ' + src.title : s.title,
      now: st ? s.steps[st - 1].text : '', next: nx, say: src.say_b || [], notes: src.notes_b || [], todo: src.todo_b || [], hasVideo: !!s.media, hasAudio: !!s.plays, nextTitle: SECTIONS[idx + 1] ? SECTIONS[idx + 1].title : '' };
    const key = JSON.stringify([idx, st]); if (key !== last) { last = key; if (ch) ch.postMessage(msg); try { localStorage.setItem('mg-treatment-state', JSON.stringify(msg)); } catch (e) { } history.replaceState(null, '', '#' + idx + '.' + st); }
    return { idx, st, s };
  }
  let raf = 0; addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; state(); }); }, { passive: true });

  // ---------- стрелки: шаг вперёд / назад
  function stops() { const a = []; SECTIONS.forEach(s => { const n = s.steps.length; for (let k = 0; k <= n; k++) a.push(Math.round(s.el.offsetTop + (n ? k / n * s.span : 0))); }); return a; }
  function go(dir) { const a = stops(), y = scrollY; let t = dir > 0 ? a.find(v => v > y + 4) : [...a].reverse().find(v => v < y - 4); if (t == null) return; scrollTo({ top: t, behavior: 'smooth' }); }
  addEventListener('keydown', e => { if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); } if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); } });

  // ---------- команды из окна контроля
  const onCmd = m => { if (!m || m.t !== 'cmd') return; const { s } = state();
    if (m.c === 'next') go(1); if (m.c === 'prev') go(-1);
    if (m.c === 'video' && s.media) s.media.paused ? s.media.play() : s.media.pause();
    if (m.c === 'audio' && s.plays && s.plays[m.i]) s.plays[m.i]();
    if (m.c === 'hello') { last = ''; state(); } };
  if (ch) ch.onmessage = e => onCmd(e.data);
  addEventListener('storage', e => { if (e.key === 'mg-treatment-cmd' && e.newValue) onCmd(JSON.parse(e.newValue)); });

  // ---------- старт
  if (window.CONTROL_URL) { const nav = h('div', 'nav draftonly', `<a href="${window.CONTROL_URL}" target="mgcontrol">окно контроля</a>`); document.body.append(nav); }
  const m = location.hash.match(/^#(\d+)\.(\d+)$/);
  if (m && SECTIONS[+m[1]]) { const s = SECTIONS[+m[1]], n = s.steps.length; scrollTo(0, s.el.offsetTop + (n ? +m[2] / n * s.span : 0)); }
  state();
})();
