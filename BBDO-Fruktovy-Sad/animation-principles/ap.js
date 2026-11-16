(function(){
  var D = window.AP, BY = {}, SEC = {};
  D.items.forEach(function(it){ BY[it.id] = it; });
  D.sections.forEach(function(s){ SEC[s.id] = s; });
  var $ = function(s, r){ return (r||document).querySelector(s); };
  var KEY = 'ap12-sel';
  var V = function(id){ var it = BY[id]; return it.v || ('v/' + id + '.mp4'); };
  var PO = function(id){ var it = BY[id]; return it.p || ('p/' + id + '.jpg'); };
  var G = function(id){ return 'g/' + id + '.gif'; };
  var TAG = function(it){ if (!it.tag && !it.tagText) return ''; var c = it.tag || 'vari'; var t = it.tagText || (it.tag === 'bad' ? 'Плохо' : 'Хорошо'); return '<span class="tag ' + c + '">' + t + '</span>'; };
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };

  /* ---------- selection store ---------- */
  var mem = [];
  function load(){ try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); mem = v.filter(function(id){ return BY[id]; }); } catch(e){} return mem.slice(); }
  function save(a){ mem = a.slice(); try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch(e){} document.dispatchEvent(new Event('apsel')); }
  function has(id){ return mem.indexOf(id) >= 0; }
  function toggle(id){ var a = mem.slice(), i = a.indexOf(id); if (i >= 0) a.splice(i, 1); else a.push(id); save(a); }
  load();

  function toast(msg){
    var t = $('.toast'); if (!t){ t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove('show'); }, 1600);
  }

  /* ---------- thumbnails that play when visible ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){
      var th = e.target, v = th.querySelector('video');
      if (e.isIntersecting){
        if (!v){ v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline',''); v.setAttribute('muted',''); v.preload = 'auto'; v.src = V(th.dataset.id); th.appendChild(v); }
        var p = v.play(); if (p && p.catch) p.catch(function(){});
      } else if (v){ v.pause(); }
    });
  }, {threshold: .35}) : null;
  function thumb(id){
    var d = document.createElement('div');
    d.className = 'thumb'; d.dataset.id = id;
    d.style.backgroundImage = 'url(' + PO(id) + ')';
    if (io) io.observe(d);
    return d;
  }

  /* ---------- lightbox ---------- */
  var lb, lbList = [], lbI = 0, lbV, pushed = false;
  function buildLB(){
    lb = document.createElement('div'); lb.className = 'lb';
    lb.innerHTML = '<div class="lb-top"><div><div class="lb-count"></div><div class="lb-sec"></div></div><button class="lb-x" aria-label="Закрыть">×</button></div>' +
      '<div class="lb-stage"><button class="lb-nav lb-prev" aria-label="Назад">‹</button><video muted loop playsinline autoplay></video><button class="lb-nav lb-next" aria-label="Дальше">›</button></div>' +
      '<div class="lb-hint">свайп влево / вправо — следующий пример</div>' +
      '<div class="lb-info"><div><h3></h3><p></p></div><div class="lb-act"><button class="lb-pick"></button><a class="lb-gif" download>GIF ↓</a></div></div>';
    document.body.appendChild(lb);
    lbV = $('video', lb); lbV.muted = true; lbV.setAttribute('muted','');
    $('.lb-x', lb).onclick = closeLB;
    $('.lb-prev', lb).onclick = function(){ go(-1); };
    $('.lb-next', lb).onclick = function(){ go(1); };
    $('.lb-pick', lb).onclick = function(){ toggle(lbList[lbI]); paintPick(); };
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    });
    var sx = 0, sy = 0, st = 0;
    var stage = $('.lb-stage', lb);
    stage.addEventListener('touchstart', function(e){ var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, {passive: true});
    stage.addEventListener('touchend', function(e){
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) closeLB();
      else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && Date.now() - st < 300){ if (lbV.paused) lbV.play(); else lbV.pause(); }
    }, {passive: true});
    lbV.addEventListener('click', function(){ if (lbV.paused) lbV.play(); else lbV.pause(); });
    window.addEventListener('popstate', function(){ if (lb.classList.contains('open')){ pushed = false; closeLB(); } });
  }
  function paintPick(){
    var b = $('.lb-pick', lb), on = has(lbList[lbI]);
    b.classList.toggle('on', on); b.textContent = on ? '✓ В подборке' : '+ В подборку';
  }
  function show(){
    var it = BY[lbList[lbI]], s = SEC[it.s];
    $('.lb-count', lb).textContent = (lbI + 1) + ' / ' + lbList.length;
    $('.lb-sec', lb).textContent = (it.test ? 'Наш тест · ' : parseInt(it.s, 10) + '. ') + s.ru.replace('Наши стоп-моушн тесты', 'Фруктовый сад');
    $('h3', lb).innerHTML = TAG(it) + ' ' + esc(it.t);
    $('p', lb).textContent = it.d;
    $('.lb-gif', lb).href = G(it.id);
    lbV.poster = PO(it.id);
    lbV.src = V(it.id);
    var p = lbV.play(); if (p && p.catch) p.catch(function(){});
    paintPick();
    var n = BY[lbList[(lbI + 1) % lbList.length]];
    if (n){ var pre = new Image(); pre.src = PO(n.id); }
  }
  function go(d){ lbI = (lbI + d + lbList.length) % lbList.length; show(); }
  function openLB(list, i){
    if (!lb) buildLB();
    lbList = list; lbI = i;
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
    if (!pushed){ try { history.pushState({lb: 1}, ''); pushed = true; } catch(e){} }
    show();
  }
  function closeLB(){
    if (!lb || !lb.classList.contains('open')) return;
    lb.classList.remove('open'); document.body.style.overflow = '';
    lbV.pause(); lbV.removeAttribute('src'); lbV.load();
    if (pushed){ pushed = false; try { history.back(); } catch(e){} }
  }

  /* ---------- bar ---------- */
  function bar(){
    var b = $('.bar');
    if (!b){
      b = document.createElement('div'); b.className = 'bar';
      b.innerHTML = '<span></span><a href="podborka.html">Открыть подборку →</a><button type="button">Очистить</button>';
      document.body.appendChild(b);
      $('button', b).onclick = function(){ if (confirmClear()) save([]); };
    }
    var n = mem.length;
    $('span', b).textContent = 'В подборке: ' + n;
    b.classList.toggle('show', n > 0);
  }
  function confirmClear(){ return window.confirm('Очистить подборку?'); }

  /* ---------- index page ---------- */
  function initIndex(){
    var main = $('main'), nav = $('nav'), all = [];
    nav.innerHTML = D.sections.map(function(s){ return '<a href="#p' + s.id + '"><b>' + (s.id === '13' ? '★' : parseInt(s.id, 10)) + '</b>' + esc(s.id === '13' ? 'Наши тесты' : s.ru) + '</a>'; }).join('');
    D.sections.forEach(function(s){
      var sec = document.createElement('section'); sec.id = 'p' + s.id;
      sec.innerHTML = '<div class="ph"><span class="num' + (s.id === '13' ? ' star' : '') + '">' + (s.id === '13' ? '★' : parseInt(s.id, 10)) + '</span><div><h2>' + esc(s.ru) + '</h2><div class="en">' + esc(s.en) + '</div></div></div><p class="lead">' + esc(s.lead) + '</p>' +
        (s.id === '03' ? '<div class="rule"><b>×3</b> Текст на экране держим столько, чтобы его можно было прочитать трижды.</div>' : '') + '<div class="grid"></div>';
      var g = $('.grid', sec);
      D.items.filter(function(it){ return it.s === s.id || (it.also || []).indexOf(s.id) >= 0; }).forEach(function(it){
        var pos = all.length; all.push(it.id);
        var c = document.createElement('div'); c.className = 'card';
        var th = thumb(it.id);
        th.onclick = function(){ openLB(all, pos); };
        var pk = document.createElement('button'); pk.className = 'pick'; pk.dataset.id = it.id;
        pk.onclick = function(e){ e.stopPropagation(); toggle(it.id); };
        c.appendChild(th); c.appendChild(pk);
        var t = document.createElement('div'); t.className = 't';
        if (it.test && s.id !== '13') c.classList.add('mine');
        t.innerHTML = '<div><span class="tc">' + (it.test && s.id !== '13' ? 'Наш тест · ' : '') + esc(it.tc) + '</span>' + TAG(it) +
          '<h3>' + esc(it.t) + '</h3><p>' + esc(it.d) + '</p></div><a class="dl" href="' + G(it.id) + '" download>GIF ↓</a>';
        c.appendChild(t); g.appendChild(c);
      });
      main.appendChild(sec);
    });
    function paint(){
      document.querySelectorAll('.pick').forEach(function(b){
        var on = has(b.dataset.id); b.classList.toggle('on', on);
        b.innerHTML = on ? '<i>✓</i> В подборке' : '<i>+</i> В подборку';
      });
      bar();
    }
    document.addEventListener('apsel', paint); paint();
  }

  /* ---------- collection page ---------- */
  function initPick(){
    var q = new URLSearchParams(location.search).get('ids');
    if (q){
      var ids = q.split(',').filter(function(id){ return BY[id]; });
      if (ids.length && ids.join(',') !== mem.join(',')) save(ids);
    }
    var list = $('.list'), empty = $('.empty');
    function syncUrl(){
      var u = location.pathname + (mem.length ? '?ids=' + mem.join(',') : '');
      try { history.replaceState(history.state, '', u); } catch(e){}
    }
    function render(){
      list.innerHTML = '';
      empty.style.display = mem.length ? 'none' : '';
      $('.tools').style.display = mem.length ? '' : 'none';
      $('.count').textContent = mem.length;
      mem.forEach(function(id, i){
        var it = BY[id], s = SEC[it.s];
        var r = document.createElement('div'); r.className = 'row'; r.dataset.id = id;
        r.innerHTML = '<div class="h" title="Перетащить">⋮⋮</div><div class="n">' + (i + 1) + '</div>';
        var th = thumb(id); th.onclick = function(){ openLB(mem.slice(), mem.indexOf(id)); };
        r.appendChild(th);
        var tx = document.createElement('div'); tx.className = 'tx';
        tx.innerHTML = '<div class="sec">' + (it.test ? 'Наш тест' : parseInt(it.s, 10) + '. ' + esc(s.ru)) + TAG(it) + '</div><h3>' + esc(it.t) + '</h3><p>' + esc(it.d) + '</p>';
        r.appendChild(tx);
        var ctl = document.createElement('div'); ctl.className = 'ctl';
        ctl.innerHTML = '<button title="Выше">↑</button><button title="Ниже">↓</button><button title="Убрать">×</button>';
        var bs = ctl.querySelectorAll('button');
        bs[0].onclick = function(){ move(id, -1); };
        bs[1].onclick = function(){ move(id, 1); };
        bs[2].onclick = function(){ toggle(id); };
        r.appendChild(ctl);
        list.appendChild(r);
      });
      syncUrl();
    }
    function move(id, d){
      var a = mem.slice(), i = a.indexOf(id), j = i + d;
      if (j < 0 || j >= a.length) return;
      a.splice(i, 1); a.splice(j, 0, id); save(a);
    }
    document.addEventListener('apsel', render);
    render();
    if (window.Sortable){
      Sortable.create(list, {handle: '.h', animation: 160, ghostClass: 'ghost', chosenClass: 'chosen', delay: 0, touchStartThreshold: 3,
        onEnd: function(){ save(Array.prototype.map.call(list.children, function(r){ return r.dataset.id; })); }});
    }
    $('.play').onclick = function(){ if (mem.length) openLB(mem.slice(), 0); };
    $('.share').onclick = function(){
      var url = location.origin + location.pathname + '?ids=' + mem.join(',');
      if (navigator.share && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)){ navigator.share({title: 'Подборка: 12 принципов анимации', url: url}).catch(function(){}); return; }
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function(){ toast('Ссылка скопирована'); }, function(){ window.prompt('Ссылка на подборку:', url); });
    };
    $('.clear').onclick = function(){ if (confirmClear()) save([]); };
  }

  if (document.body.dataset.page === 'pick') initPick(); else initIndex();
})();
