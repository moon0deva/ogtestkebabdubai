'use strict';

const Security = {
  sanitise(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#x27;').replace(/\//g,'&#x2F;').trim();
  },
  isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); },
  inRange(s, min, max) { return s.length >= min && s.length <= max; },
  generateToken() {
    if (window.crypto?.getRandomValues) {
      const a = new Uint8Array(24); window.crypto.getRandomValues(a);
      return Array.from(a, b => b.toString(16).padStart(2,'0')).join('');
    }
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  },
  checkRateLimit(key, max = 3, ms = 600000) {
    try {
      const raw = sessionStorage.getItem(key), now = Date.now();
      const r = raw ? JSON.parse(raw) : { count: 0, start: now };
      if (now - r.start > ms) { r.count = 0; r.start = now; }
      if (r.count >= max) return { allowed: false, resetIn: ms - (now - r.start) };
      r.count++; sessionStorage.setItem(key, JSON.stringify(r));
      return { allowed: true };
    } catch { return { allowed: true }; }
  },
  constantTimeEqual(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    let d = 0;
    for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return d === 0;
  }
};

const FormToken = {
  _t: null,
  init() {
    this._t = Security.generateToken();
    const el = document.getElementById('_csrf_token');
    if (el) el.value = this._t;
  },
  validate(v) { return Security.constantTimeEqual(this._t, v); }
};

const i18n = {
  current: 'pl',
  strings: {
    pl: {
      navMenu:'Menu', navLocations:'Lokalizacje', navReviews:'Opinie', navContact:'Kontakt',
      navCta:'Zamów teraz', langSwitch:'EN',
      heroEyebrow:'Autentyczny smak Bliskiego Wschodu',
      heroEst:'Warszawa · Est. Since Day One',
      heroDesc:'Trzy lokalizacje w sercu Warszawy. Mięso z rożna przygotowywane codziennie ze świeżych składników. Domowe sosy, tradycyjne receptury, smak, który zostaje w pamięci.',
      heroCta1:'Zamów przez Uber Eats', heroCta2:'Zobacz menu',
      heroStat1:'Ocena Google', heroStat2:'Opinii', heroStat3:'Centrum',
      heroVisualSub:'Warszawa · od 14 zł',
      heroBadge1:'🥩 Świeże mięso daily', heroBadge2:'✓ Uber Eats · Cała Warszawa',
      scroll:'Przewiń',
      menuEyebrow:'Co serwujemy', menuTitle:'Nasze', menuTitleAccent:'Menu',
      menuDesc:'Mięso z rożna, przygotowywane ze świeżych składników każdego ranka. Tradycja i smak w każdym kęsie.',
      menuCta:'Zamów online',
      col1Title:'Kebab w Picie', col1Badge:'Klasyk',
      col2Title:'Dania na Talerzu', col2Badge:'Zestawy',
      col3Title:'Sosy & Dodatki', col3Badge:'Domowe',
      info1:'Płatność gotówką', info2:'Na miejscu i na wynos',
      info3:'Dostawa przez Uber Eats', info4:'Przyjazne zwierzętom', info5:'Opcje wegetariańskie',
      item1n:'Kurczak', item1d:'Mięso z rożna, świeże warzywa, wybrany sos',
      item2n:'Wołowina', item2d:'Soczysta wołowina, sałata, pomidor, cebula',
      item3n:'Kebab Ostry', item3d:'Kurczak lub wołowina, ostry sos chili, jalapeño',
      item4n:'Mix Dubai', item4d:'Kurczak + wołowina, dwa sosy, podwójny smak',
      item5n:'Falafel (wegetariański)', item5d:'Kotlety z ciecierzycy, tahini, świeże warzywa',
      item6n:'Kurczak Curry', item6d:'Ryż basmati, sos curry, świeże zioła',
      item7n:'Cielęcina z Pieczarkami', item7d:'Delikatna cielęcina, pieczarki, ryż lub makaron',
      item8n:'Zestaw Dubai', item8d:'Kebab + ryż + napój + sos do wyboru',
      item9n:'Shawarma na Talerzu', item9d:'Shawarma z ryżem, sałatka, hummus',
      item10n:'Zestaw Rodzinny', item10d:'4× kebab w picie + 4× napój',
      about1t:'Świeże mięso każdego dnia', about1d:'Nie używamy mrożonego mięsa. Każdego ranka nowe dostawy prosto od dostawców — smak i jakość, które czuć w każdym kęsie.',
      about2t:'Tradycyjne receptury', about2d:'Sosy robione ręcznie każdego dnia. Przyprawy sprowadzane z Bliskiego Wschodu. Autentyczny smak bez kompromisów.',
      about3t:'Najlepiej oceniany', about3d:'4.1★ z ponad 2500 opinii na Google Maps. Polecany przez stałych bywalców, pracowników biur i turystów z całego świata.',
      locEyebrow:'Znajdź nas', locTitle:'Trzy', locAccent:'Lokalizacje',
      locDesc:'Trzy punkty w Warszawie — Mokotów, Śródmieście i centrum. Jeden z nich otwarty całą dobę.',
      loc1Name:'Mokotów', loc1Sub:'Rakowiecka 43A', loc1Label:'Lokal flagowy',
      loc2Name:'Śródmieście', loc2Sub:'Lwowska 1', loc2Label:'Pole Mokotowskie',
      loc3Name:'Centrum', loc3Sub:'Al. Jerozolimskie', loc3Label:'Aleje Jerozolimskie',
      badge24h:'Otwarte 24H', badgeAlways:'Całą dobę',
      hours1:'Poniedziałek – Niedziela: 9:00 – 21:00', hours3:'Otwarte 24 godziny / 7 dni',
      loc1Reviews:'1 168+ opinii Google', loc2Reviews:'590+ opinii Google', loc3Reviews:'721+ opinii Google',
      loc3Extra:'Najlepsza opcja po zmroku',
      navigate:'Nawiguj', uberEats:'Uber Eats',
      seeMenuLink:'Zobacz cennik tej lokalizacji →',
            menuPlaceholderTitle:'Cennik wkrótce',
      menuPlaceholderText:'Menu dla lokalu Rakowiecka 43A zostanie dodane wkrótce. Zapraszamy do odwiedzin!',
      menuSize:'Rozmiar', menuThin:'Na cienkim', menuThick:'Na grubym',
      menuSerNote1:'Dodatkowy ser +1 zł', menuSerNote2:'Dodatkowy ser +2 zł',
      menuDania:'Dania na Talerzu', menuWynos:'Na wynos +1 zł',
      revEyebrow:'Co mówią goście', revTitle:'Opinie', revSub:'naszych gości',
      revCount:'2 500+ opinii · Google Maps · 3 lokalizacje',
      revTagline:'"Najlepszy kebab w całej Europie."',
      revCta:'Napisz opinię na Google',
      orderEyebrow:'Zamów teraz', orderTitle:'Głodny?', orderAccent:'Mamy rozwiązanie.',
      orderDesc:'Dostawa do domu przez Uber Eats lub odbiór osobisty w jednej z naszych trzech lokalizacji. Jeden lokal otwarty całą dobę — zawsze mamy dla ciebie kebab.',
      orderCta:'Zamów przez Uber Eats',
      opt1t:'Dostawa do domu', opt1d:'Uber Eats · Cała Warszawa',
      opt2t:'Odbiór osobisty', opt2d:'3 lokalizacje · Rakowiecka / Lwowska / Centrum',
      opt3t:'Zamówienie telefoniczne', opt3d:'+48 22 630 66 55 · Lokal Rakowiecka',
      orderNote:'Płatność gotówką · Odbiór bez karty',
      contEyebrow:'Skontaktuj się z nami', contTitle:'Kontakt',
      contPhone:'Telefon', contPhoneSub:'Lokal Rakowiecka 43A',
      contAddr:'Adresy', contHours:'Godziny otwarcia',
      contFormTitle:'Wyślij wiadomość',
      labelFirst:'Imię', labelLast:'Nazwisko', labelEmail:'Adres email',
      labelSubject:'Temat', labelMsg:'Wiadomość',
      phFirst:'Jan', phLast:'Kowalski', phEmail:'jan@przykład.pl',
      phSubject:'Pytanie o zamówienie, catering...', phMsg:'Twoja wiadomość...',
      submitBtn:'Wyślij wiadomość', errSending:'Wysyłanie…',
      formOk:'✓ Wiadomość wysłana — odpiszemy wkrótce.',
      errSecurity:'Błąd bezpieczeństwa. Odśwież stronę i spróbuj ponownie.',
      errRate:'Zbyt wiele prób. Poczekaj {n} min.',
      errName:'Podaj imię (max 100 znaków).', errEmail:'Podaj poprawny adres email.',
      errMsg:'Wiadomość: 10–2000 znaków.', errBad:'Niedozwolona treść w formularzu.',
      hoursRak:'Rakowiecka 43A', hoursLwow:'Lwowska 1', hoursCent:'Centrum',
      hoursTime:'09:00 – 21:00', hoursAlways:'24 / 7',
      footNav:'Nawigacja', footLoc:'Lokalizacje', footOrder:'Zamów online',
      footTagline:'Autentyczny kebab z Bliskiego Wschodu w sercu Warszawy. Świeże mięso, domowe sosy, trzy lokalizacje — jedna czynna całą dobę.',
      footDelivery:'Dostawa · Warszawa',
      footCopy:'© 2025 Kebab Dubai Warszawa. Wszelkie prawa zastrzeżone.',
      footSub:'Smaki Bliskiego Wschodu · Warszawa, Polska',
    },
    en: {
      navMenu:'Menu', navLocations:'Locations', navReviews:'Reviews', navContact:'Contact',
      navCta:'Order now', langSwitch:'PL',
      heroEyebrow:'Authentic Middle Eastern flavours',
      heroEst:'Warsaw · Est. Since Day One',
      heroDesc:'Three locations in the heart of Warsaw. Spit-roasted meat prepared daily from fresh ingredients. House-made sauces, traditional recipes, a taste that stays with you.',
      heroCta1:'Order on Uber Eats', heroCta2:'See the menu',
      heroStat1:'Google rating', heroStat2:'Reviews', heroStat3:'City centre',
      heroVisualSub:'Warsaw · from 14 zł',
      heroBadge1:'🥩 Fresh meat daily', heroBadge2:'✓ Uber Eats · All Warsaw',
      scroll:'Scroll',
      menuEyebrow:'What we serve', menuTitle:'Our', menuTitleAccent:'Menu',
      menuDesc:'Spit-roasted meat prepared from fresh ingredients every morning. Tradition and flavour in every bite.',
      menuCta:'Order online',
      col1Title:'Kebab in Pita', col1Badge:'Classic',
      col2Title:'Plate Dishes', col2Badge:'Sets',
      col3Title:'Sauces & Extras', col3Badge:'House-made',
      info1:'Cash payment', info2:'Dine in & takeaway',
      info3:'Delivery via Uber Eats', info4:'Pet friendly', info5:'Vegetarian options',
      item1n:'Chicken', item1d:'Spit-roasted meat, fresh vegetables, chosen sauce',
      item2n:'Beef', item2d:'Juicy beef, lettuce, tomato, onion',
      item3n:'Spicy Kebab', item3d:'Chicken or beef, hot chili sauce, jalapeño',
      item4n:'Dubai Mix', item4d:'Chicken + beef, two sauces, double the flavour',
      item5n:'Falafel (vegetarian)', item5d:'Chickpea patties, tahini, fresh vegetables',
      item6n:'Chicken Curry', item6d:'Basmati rice, curry sauce, fresh herbs',
      item7n:'Veal & Mushrooms', item7d:'Tender veal, mushrooms, rice or pasta',
      item8n:'Dubai Set', item8d:'Kebab + rice + drink + sauce of choice',
      item9n:'Shawarma Plate', item9d:'Shawarma with rice, salad, hummus',
      item10n:'Family Set', item10d:'4× kebab in pita + 4× drink',
      about1t:'Fresh meat every day', about1d:'We never use frozen meat. Fresh deliveries every morning — taste and quality you can feel in every bite.',
      about2t:'Traditional recipes', about2d:'Sauces made by hand every day. Spices sourced from the Middle East. Authentic flavour without compromise.',
      about3t:'Highest rated', about3d:'4.1★ from over 2500 Google Maps reviews. Recommended by regulars, office workers, and tourists from around the world.',
      locEyebrow:'Find us', locTitle:'Three', locAccent:'Locations',
      locDesc:'Three spots in Warsaw — Mokotów, Śródmieście, and the city centre. One open around the clock.',
      loc1Name:'Mokotów', loc1Sub:'Rakowiecka 43A', loc1Label:'Flagship location',
      loc2Name:'Śródmieście', loc2Sub:'Lwowska 1', loc2Label:'Pole Mokotowskie',
      loc3Name:'City Centre', loc3Sub:'Al. Jerozolimskie', loc3Label:'Aleje Jerozolimskie',
      badge24h:'Open 24H', badgeAlways:'Around the clock',
      hours1:'Monday – Sunday: 9:00 AM – 9:00 PM', hours3:'Open 24 hours / 7 days a week',
      loc1Reviews:'1,168+ Google reviews', loc2Reviews:'590+ Google reviews', loc3Reviews:'721+ Google reviews',
      loc3Extra:'Best option after midnight',
      navigate:'Navigate', uberEats:'Uber Eats',
      seeMenuLink:'View this location\'s price list →',
            menuPlaceholderTitle:'Price list coming soon',
      menuPlaceholderText:'The menu for Rakowiecka 43A will be added shortly. Come visit us!',
      menuSize:'Size', menuThin:'Thin bread', menuThick:'Thick bread',
      menuSerNote1:'Extra cheese +1 zł', menuSerNote2:'Extra cheese +2 zł',
      menuDania:'Plate Dishes', menuWynos:'Takeaway +1 zł',
      revEyebrow:'What guests say', revTitle:'Reviews', revSub:'from our guests',
      revCount:'2,500+ reviews · Google Maps · 3 locations',
      revTagline:'"Best kebab in all of Europe."',
      revCta:'Leave a Google review',
      orderEyebrow:'Order now', orderTitle:'Hungry?', orderAccent:'We have a solution.',
      orderDesc:'Home delivery via Uber Eats or pick up in person at one of our three locations. One spot open around the clock — we always have a kebab ready for you.',
      orderCta:'Order on Uber Eats',
      opt1t:'Home delivery', opt1d:'Uber Eats · All Warsaw',
      opt2t:'Pick up in person', opt2d:'3 locations · Rakowiecka / Lwowska / Centre',
      opt3t:'Phone order', opt3d:'+48 22 630 66 55 · Rakowiecka branch',
      orderNote:'Cash payment · Card not accepted for in-store pickup',
      contEyebrow:'Get in touch', contTitle:'Contact',
      contPhone:'Phone', contPhoneSub:'Rakowiecka 43A branch',
      contAddr:'Addresses', contHours:'Opening hours',
      contFormTitle:'Send a message',
      labelFirst:'First name', labelLast:'Last name', labelEmail:'Email address',
      labelSubject:'Subject', labelMsg:'Message',
      phFirst:'John', phLast:'Smith', phEmail:'john@example.com',
      phSubject:'Question about ordering, catering...', phMsg:'Your message...',
      submitBtn:'Send message', errSending:'Sending…',
      formOk:'✓ Message sent — we will get back to you shortly.',
      errSecurity:'Security error. Please refresh the page and try again.',
      errRate:'Too many attempts. Please wait {n} min.',
      errName:'Please enter your name (max 100 characters).', errEmail:'Please enter a valid email address.',
      errMsg:'Message must be 10–2000 characters.', errBad:'Disallowed content detected.',
      hoursRak:'Rakowiecka 43A', hoursLwow:'Lwowska 1', hoursCent:'City Centre',
      hoursTime:'9:00 AM – 9:00 PM', hoursAlways:'24 / 7',
      footNav:'Navigation', footLoc:'Locations', footOrder:'Order online',
      footTagline:'Authentic Middle Eastern kebab in the heart of Warsaw. Fresh meat, house-made sauces, three locations — one open around the clock.',
      footDelivery:'Delivery · Warsaw',
      footCopy:'© 2025 Kebab Dubai Warsaw. All rights reserved.',
      footSub:'Middle Eastern flavours · Warsaw, Poland',
    }
  },

  t(key) { return this.strings[this.current][key] ?? this.strings.pl[key] ?? key; },

  apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n, attr = el.dataset.i18nAttr;
      attr ? el.setAttribute(attr, this.t(key)) : (el.textContent = this.t(key));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPh);
    });
    document.documentElement.lang = this.current;
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = this.t('langSwitch');
  },

  toggle() {
    this.current = this.current === 'pl' ? 'en' : 'pl';
    try { localStorage.setItem('kd_lang', this.current); } catch {}
    this.apply();
  },

  init() {
    try { const s = localStorage.getItem('kd_lang'); if (s === 'en' || s === 'pl') this.current = s; } catch {}
    document.getElementById('lang-toggle')?.addEventListener('click', () => this.toggle());
    this.apply();
  }
};

function initCursor() {
  const cursor = document.querySelector('.cursor'), ring = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none'; ring.style.display = 'none';
    document.body.style.cursor = 'auto'; return;
  }
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  }, { passive: true });
  (function loop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
  });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; ring.style.opacity = '1'; });
}

function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
}

function initMobileMenu() {
  const btn = document.getElementById('menu-toggle'), menu = document.getElementById('mobile-nav');
  if (!btn || !menu) return;
  const open = () => {
    btn.classList.add('open'); menu.classList.add('open');
    menu.setAttribute('aria-hidden','false'); btn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden'; menu.querySelector('a')?.focus();
  };
  const close = () => {
    btn.classList.remove('open'); menu.classList.remove('open');
    menu.setAttribute('aria-hidden','true'); btn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

function initReveal() {
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-scale');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!/^#[a-zA-Z][\w-]*$/.test(href)) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initNavActive() {
  const ids = ['hero','menu','locations','reviews','contact'], links = {};
  ids.forEach(id => { links[id] = document.querySelector(`.nav-links a[href="#${id}"]`); });
  window.addEventListener('scroll', () => {
    const pos = window.scrollY + 120;
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !links[id]) return;
      links[id].style.color = (pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) ? 'var(--cream)' : '';
    });
  }, { passive: true });
}

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const num = document.querySelector('.hero-number');
  if (!num) return;
  window.addEventListener('scroll', () => {
    num.style.transform = `translateY(calc(-55% + ${window.scrollY * 0.25}px))`;
  }, { passive: true });
}

function initCountUp() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '', dec = parseInt(el.dataset.decimals || '0', 10);
      if (reduced) { el.textContent = target.toFixed(dec) + suffix; obs.unobserve(el); return; }
      const dur = 1600, start = performance.now();
      const tick = now => {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = (target * (1 - Math.pow(1 - t, 4))).toFixed(dec) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

function initExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = new Set((a.getAttribute('rel') || '').split(' ').filter(Boolean));
    rel.add('noopener'); rel.add('noreferrer');
    a.setAttribute('rel', [...rel].join(' '));
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  FormToken.init();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('form-success');
    const errorEl   = document.getElementById('form-error');
    if (successEl) successEl.style.display = 'none';
    if (errorEl)   errorEl.style.display   = 'none';

    const hp = form.querySelector('[name="_hp_email"]');
    if (hp && hp.value !== '') { showSuccess(successEl, submitBtn); return; }

    if (!FormToken.validate(form.querySelector('[name="_csrf_token"]')?.value)) {
      showError(errorEl, i18n.t('errSecurity')); return;
    }

    const rate = Security.checkRateLimit('kd_form_rl', 3, 600000);
    if (!rate.allowed) {
      showError(errorEl, i18n.t('errRate').replace('{n}', Math.ceil(rate.resetIn / 60000))); return;
    }

    const fname   = (form.querySelector('#fname')?.value   || '').trim();
    const email   = (form.querySelector('#email')?.value   || '').trim();
    const message = (form.querySelector('#message')?.value || '').trim();
    const errors  = [];

    if (!Security.inRange(fname,   1, 100))   errors.push(i18n.t('errName'));
    if (!Security.isValidEmail(email))         errors.push(i18n.t('errEmail'));
    if (!Security.inRange(message, 10, 2000))  errors.push(i18n.t('errMsg'));
    if (/<script|javascript:|data:|vbscript:|onload=|onerror=/i.test(fname + email + message))
      errors.push(i18n.t('errBad'));

    if (errors.length) { showError(errorEl, errors.join(' ')); return; }

    if (submitBtn) { submitBtn.textContent = i18n.t('errSending'); submitBtn.disabled = true; }
    setTimeout(() => { form.reset(); FormToken.init(); showSuccess(successEl, submitBtn); }, 900);
  });
}

function showSuccess(el, btn) {
  if (el) { el.textContent = i18n.t('formOk'); el.style.display = 'block'; el.focus(); }
  if (btn) { btn.textContent = i18n.t('submitBtn'); btn.disabled = false; }
  setTimeout(() => { if (el) el.style.display = 'none'; }, 6000);
}

function showError(el, msg) {
  if (el) { el.textContent = msg; el.style.display = 'block'; el.focus(); }
}

function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const r = item.getBoundingClientRect();
      item.style.transform = `perspective(600px) rotateX(${-((e.clientY-r.top)/r.height-.5)*2}deg) rotateY(${((e.clientX-r.left)/r.width-.5)*4}deg)`;
    }, { passive: true });
    item.addEventListener('mouseleave', () => { item.style.transform = ''; });
  });
}

function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-loc-tab');
  const panels = document.querySelectorAll('.menu-loc-panel');

  function switchTab(loc) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.loc === loc));
    panels.forEach(p => p.classList.toggle('active', p.id === 'mlp-' + loc));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.loc));
  });

  // "See menu" links on location cards
  document.querySelectorAll('[data-see-menu]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const loc = link.dataset.seeMenu;
      switchTab(loc);
      setTimeout(() => {
        const menuSection = document.getElementById('menu');
        if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  });

  // Allow external callers: menuTabs.open('lwowska')
  window.menuTabs = { open: switchTab };
}


document.addEventListener('DOMContentLoaded', () => {
  [
    ['lang',         () => i18n.init()],
    ['cursor',       initCursor],
    ['nav',          initNav],
    ['mobile-menu',  initMobileMenu],
    ['reveal',       initReveal],
    ['back-top',     initBackTop],
    ['smooth-scroll',initSmoothScroll],
    ['nav-active',   initNavActive],
    ['parallax',     initParallax],
    ['count-up',     initCountUp],
    ['ext-links',    initExternalLinks],
    ['contact-form', initContactForm],
    ['tilt',         initTilt],
    ['menu-tabs',    initMenuTabs],
  ].forEach(([name, fn]) => { try { fn(); } catch (err) { console.error(`[Init] "${name}" failed:`, err); } });
});
