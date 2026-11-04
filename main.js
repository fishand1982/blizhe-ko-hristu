import { categories, situations, readingPlan } from './data.js';

const STORAGE_KEY = 'closer-to-christ:v1';
const LIMIT = 12000;
const icons = {
  cross:'<path d="M12 2v20M5 8h14"/>',
  book:'<path d="M12 7a7 7 0 0 0-9-2v14a7 7 0 0 1 9 2 7 7 0 0 1 9-2V5a7 7 0 0 0-9 2Zm0 0v14"/>',
  sprout:'<path d="M12 22v-8m0 3C5 17 3 12 3 7c6 0 9 4 9 10Zm0-5c0-5 3-8 9-8 0 6-3 9-9 9"/>',
  leaf:'<path d="M20 4C8 4 3 10 3 17a4 4 0 0 0 4 4C14 21 20 16 20 4ZM4 20c3-5 7-8 12-11"/>',
  heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  circleCheck:'<circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/>',
  left:'<path d="m15 18-6-6 6-6"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 18v3h16v-3"/>',
  upload:'<path d="M12 17V5m-5 5 5-5 5 5M4 18v3h16v-3"/>',
  trash:'<path d="M4 7h16M10 11v7m4-7v7M6 7l1 14h10l1-14M9 7V4h6v3"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
  wind:'<path d="M3 8h12a3 3 0 1 0-3-3M2 12h18a3 3 0 1 1-3 3M5 16h6a3 3 0 1 1-3 3"/>',
  cloud:'<path d="M20 17a4 4 0 0 0-.5-7.97A7 7 0 0 0 6 11a3 3 0 0 0 0 6z"/>',
  sunrise:'<path d="M12 2v2m-7 1 2 2m10-2-2 2M2 16h20M3 21h18M7 16a5 5 0 0 1 10 0"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  moon:'<path d="M20 14A8 8 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z"/>',
  flower:'<path d="M12 12c-5-2-7-7-4-9 3-2 5 1 4 9Zm0 0c5-2 7-7 4-9-3-2-5 1-4 9Zm0 0c-7 0-9 4-6 7 3 3 6 0 6-7Zm0 0c7 0 9 4 6 7-3 3-6 0-6-7Zm0 0v10"/>',
  home:'<path d="m3 11 9-8 9 8v10H3V11Zm6 10v-8h6v8"/>',
  message:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>',
  briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V4h8v3M2 12h20"/>',
  compass:'<circle cx="12" cy="12" r="10"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  drop:'<path d="M12 22c5 0 8-3 8-8 0-4-5-9-8-12-3 3-8 8-8 12 0 5 3 8 8 8Z"/>',
  seed:'<path d="M12 22v-8M4 11c0-5 4-8 9-8 0 6-4 9-9 9Zm8 3c1-6 5-9 9-8 0 5-3 8-9 8"/>',
  question:'<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.6 2.6 0 1 1 5 1c-.8 1-2.5 1.3-2.5 3v1M12 18h.01"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  external:'<path d="M14 3h7v7m0-7-11 11M19 13v7H4V5h7"/>',
};
const icon = (name, size = 20, extra = '') => `<svg ${extra} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.leaf}</svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const unique = arr => Array.from(new Set(arr));

function readStored() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return normalize(saved);
  } catch { return normalize({}); }
}
function normalize(saved) {
  const allowed = new Set(situations.map(s => s.id));
  const notes = {};
  if (saved && typeof saved.notes === 'object' && saved.notes && !Array.isArray(saved.notes)) {
    Object.entries(saved.notes).forEach(([key, value]) => {
      const day = Number(key);
      if (Number.isInteger(day) && day >= 1 && day <= 30 && typeof value === 'string') notes[day] = value.slice(0, LIMIT);
    });
  }
  return {
    favorites: unique(Array.isArray(saved?.favorites) ? saved.favorites.filter(v => typeof v === 'string' && allowed.has(v)) : []),
    completed: unique(Array.isArray(saved?.completed) ? saved.completed.filter(v => Number.isInteger(v) && v >= 1 && v <= 30) : []),
    notes,
    personalPrayer: typeof saved?.personalPrayer === 'string' ? saved.personalPrayer.slice(0, LIMIT) : '',
  };
}
let saved = readStored();
let ui = {view:'prayers', category:'all', query:'', selected:'anxiety', day: 1};
const app = document.querySelector('#app');

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }
  catch { toast('Не удалось сохранить запись. Экспортируйте дневник вручную.'); }
}
let toastTimer = 0;
function toast(message) {
  let node = document.querySelector('.toast');
  if (!node) { node = document.createElement('div'); node.className = 'toast'; node.setAttribute('role', 'status'); document.body.appendChild(node); }
  node.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.remove(), 2600);
}
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else throw new Error('clipboard unavailable');
    toast('Скопировано');
  } catch {
    const el = document.createElement('textarea'); el.value = text; el.style.position='fixed'; el.style.left='-9999px'; document.body.appendChild(el); el.select();
    try { if (!document.execCommand('copy')) throw new Error(); toast('Скопировано'); }
    catch { toast('Копирование недоступно в этом браузере'); }
    el.remove();
  }
}
function downloadFile(filename, text, mime) {
  const url = URL.createObjectURL(new Blob([text], {type:mime}));
  const link = document.createElement('a'); link.href=url; link.download=filename; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
function dailyExport() {
  return ['Мой молитвенный дневник · Ближе ко Христу', '',
    ...readingPlan.filter(d => saved.notes[d.day]?.trim()).flatMap(d => [`День ${d.day}. ${d.title}`, `Писание: ${d.reference}`, saved.notes[d.day], '']),
    'Личная молитва:', saved.personalPrayer || '(нет записи)', '',
    'Записи сохранены на устройстве пользователя.'].join('\n');
}
function heroIllustration() {
  return `<svg viewBox="0 0 520 280" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Светлые холмы, восходящее солнце и небольшой крест">
  <defs><linearGradient id="sky" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#f0f3e8"/><stop offset="1" stop-color="#dce8db"/></linearGradient></defs>
  <rect width="520" height="280" fill="url(#sky)"/>
  <circle cx="340" cy="103" r="74" fill="#f2e8c5" opacity=".88"/>
  <circle cx="340" cy="103" r="99" fill="none" stroke="#e9dfbf" opacity=".65"/>
  <path d="M-20 238Q114 129 245 183T540 149V300H-20" fill="#bfd4be"/>
  <path d="M-30 268Q170 190 318 221T540 187V300H-30" fill="#8caf9a" opacity=".7"/>
  <path d="M-30 306Q170 242 322 262T560 234V310Z" fill="#729b80" opacity=".65"/>
  <path d="M365 136v78M341 165h48" stroke="#4d7a5a" stroke-width="5" stroke-linecap="round"/>
  <g fill="none" stroke="#8aaf86" stroke-width="2" stroke-linecap="round" opacity=".7">
  <path d="M457 275q-5-62 26-112"/><path d="M467 241q-27-9-29-28q28 0 29 28Z" fill="#a0bea0"/><path d="M476 216q19-23 37-20q-6 22-37 20Z" fill="#a0bea0"/><path d="M480 193q-24-8-25-28q22 2 25 28Z" fill="#a0bea0"/>
  <path d="M60 292q-12-40 5-78"/><path d="M63 260q-26-9-27-26q24 2 27 26Z" fill="#b0c6a6"/><path d="M63 240q14-21 33-19q-3 19-33 19Z" fill="#b0c6a6"/>
  </g>
  </svg>`;
}
function brand() {return `<a href="#prayer=anxiety" class="brand" data-action="home" aria-label="Главная — Ближе ко Христу"><span class="brand-symbol">${icon('cross',22)}</span><span><strong class="brand-title">Ближе ко Христу</strong><span class="brand-sub">Евангельский молитвослов</span></span></a>`;}
const sections = [
  {id:'prayers', name:'Жизненные ситуации', short:'Молитвы', icon:'heart'},
  {id:'plan', name:'30 дней с Евангелием', short:'30 дней', icon:'book'},
  {id:'journal', name:'Молитвенный дневник', short:'Дневник', icon:'sprout'},
];
function sidebar() {
  return `<aside class="sidebar"><nav class="nav-panel" aria-label="Разделы молитвослова">
  ${sections.map(s=>`<button type="button" class="nav-button ${ui.view===s.id?'active':''}" data-nav="${s.id}" ${ui.view===s.id?'aria-current="page"':''}><span class="nav-icon">${icon(s.icon,19)}</span><span class="nav-label">${s.name}</span>${icon('right',14)}</button>`).join('')}
  </nav><div class="sidebar-note">${icon('leaf',20)}<p>Здесь нет платных молитв и обещаний лёгкой жизни. Только Писание, искреннее обращение к Богу и шаги веры.</p></div></aside>`;
}
function mobileNav() {
  return `<nav class="mobile-nav" aria-label="Нижняя навигация">${sections.map(s=>`<button type="button" data-nav="${s.id}" class="${ui.view===s.id?'active':''}" ${ui.view===s.id?'aria-current="page"':''}>${icon(s.icon,20)}<span>${s.short}</span></button>`).join('')}</nav>`;
}
function featureCards() {
  const completed=saved.completed.length;
  return `<section class="feature-grid" aria-label="Основные разделы">
    <button type="button" class="feature-card feature-card--situations" data-nav="prayers">
      <span class="feature-icon">${icon('sprout',26)}</span>
      <span class="feature-copy"><strong>Жизненные ситуации</strong><small>Молитвы и отрывки из Писания<br/>для важных моментов жизни.</small></span>
      <span class="feature-arrow" aria-hidden="true">${icon('right',18)}</span>
      <span class="feature-landscape feature-landscape--leaves" aria-hidden="true"></span>
    </button>
    <button type="button" class="feature-card feature-card--plan" data-nav="plan">
      <span class="feature-icon feature-icon--calendar"><b>30</b></span>
      <span class="feature-copy"><span class="feature-heading-line"><strong>30 дней с Евангелием</strong><em>Путь</em></span><small>Короткий ежедневный план<br/>чтения и размышления.</small></span>
      <span class="feature-arrow" aria-hidden="true">${icon('right',18)}</span>
      <span class="feature-progress-mini" aria-label="Пройдено ${completed} из 30 дней"><i style="width:${Math.round(completed/30*100)}%"></i></span>
      <span class="feature-landscape feature-landscape--path" aria-hidden="true"></span>
    </button>
    <button type="button" class="feature-card feature-card--journal" data-nav="journal">
      <span class="feature-icon">${icon('message',25)}</span>
      <span class="feature-copy"><strong>Молитвенный дневник</strong><small>Записывайте молитвы, просьбы<br/>и ответы Бога.</small></span>
      <span class="feature-arrow" aria-hidden="true">${icon('right',18)}</span>
      <span class="feature-landscape feature-landscape--book" aria-hidden="true"></span>
    </button>
    <button type="button" class="feature-card feature-card--favorites" data-favorites-home>
      <span class="feature-icon">${icon('bookmark',25)}</span>
      <span class="feature-copy"><strong>Избранное</strong><small>Ваши любимые молитвы,<br/>отрывки и планы.</small></span>
      <span class="feature-arrow" aria-hidden="true">${icon('right',18)}</span>
      <span class="feature-landscape feature-landscape--branch" aria-hidden="true"></span>
    </button>
  </section>`;
}
function prayerCard(s) {
  const favorite=saved.favorites.includes(s.id);
  return `<section class="panel detail" id="detail" aria-labelledby="detail-title">
  <div class="detail-head"><div><div class="detail-kicker">${icon('sprout',16)} Молитва на каждый день</div><h2 id="detail-title">${esc(s.title)}</h2><p class="section-desc">${esc(s.subtitle)}</p></div>
  <button type="button" class="ghost-icon ${favorite?'active':''}" data-fav="${esc(s.id)}" aria-label="${favorite?'Убрать из избранного':'Добавить в избранное'}" aria-pressed="${favorite}">${icon('bookmark',19)}</button></div>
  <div class="scripture"><div class="label-line">${icon('book',16)} Основание в Писании</div><div class="scripture-ref">${esc(s.references)}</div><p>${esc(s.reflection)}</p></div>
  <h3 class="content-title">Молитва</h3><p class="prayer-text">${esc(s.prayer)}</p>
  <div class="action-box"><div class="label-line">${icon('sprout',17)} Шаг веры на сегодня</div><p>${esc(s.action)}</p></div>
  <div class="detail-actions"><button type="button" class="btn primary" data-copy-prayer="${esc(s.id)}">${icon('copy',16)} Копировать молитву</button><button type="button" class="btn" data-share-prayer="${esc(s.id)}">${icon('external',16)} Поделиться ссылкой</button></div>
  </section>`;
}
function prayersView() {
  const q=ui.query.trim().toLocaleLowerCase('ru');
  const list = situations.filter(s => (ui.category==='all' || (ui.category==='favorites'?saved.favorites.includes(s.id):s.category===ui.category)) && (!q || `${s.title} ${s.subtitle} ${s.references} ${s.reflection}`.toLocaleLowerCase('ru').includes(q)));
  const active=list.find(s=>s.id===ui.selected)||list[0];
  return `<section class="panel" aria-labelledby="situations-heading">
  <div class="section-top"><div><h2 class="section-title" id="situations-heading">Молитва для твоего дня</h2><p class="section-desc">Найди близкую ситуацию и обратись к Богу.</p></div><span class="count">${list.length} из ${situations.length}</span></div>
  <label class="search-box" for="search-prayers">${icon('search',18)}<input id="search-prayers" type="search" data-search placeholder="Поиск: тревога, семья, работа…" value="${esc(ui.query)}" autocomplete="off" aria-label="Поиск молитв"/></label>
  <div class="chips" role="group" aria-label="Категории молитв">${categories.map(c=>`<button type="button" class="chip ${ui.category===c.id?'active':''}" data-category="${c.id}" aria-pressed="${ui.category===c.id}">${esc(c.label)}</button>`).join('')}</div>
  ${list.length?`<div class="situation-list">${list.map(s=>`<button type="button" class="situation-item ${active?.id===s.id?'active':''}" data-prayer="${s.id}" aria-pressed="${active?.id===s.id}"><span class="situation-symbol">${icon(s.icon,17)}</span><span><strong>${esc(s.title)}</strong><span class="small">${esc(s.subtitle)}</span></span></button>`).join('')}</div>`:`<div class="empty">Молитвы не найдены. Попробуй другое слово или категорию.<br/><button class="btn inline" style="margin-top:14px" type="button" data-reset-filter>Сбросить фильтры</button></div>`}
  </section>${active?prayerCard(active):''}`;
}
function planView() {
  const d=readingPlan[ui.day-1];
  const done=saved.completed.includes(ui.day);
  return `<section class="panel" aria-labelledby="plan-heading">
  <div class="progress-top"><div><div class="eyebrow">Духовный путь</div><h2 class="section-title" id="plan-heading" style="margin-top:8px">30 дней с Евангелием</h2><p class="section-desc">Писание → размышление → молитва → действие.</p></div><span class="progress-count">${saved.completed.length} / 30</span></div>
  <div class="progress-track" role="progressbar" aria-label="Пройдено дней" aria-valuemin="0" aria-valuemax="30" aria-valuenow="${saved.completed.length}"><div class="progress-fill" style="width:${(saved.completed.length/30*100).toFixed(2)}%"></div></div>
  <p class="progress-caption">Выбирай любой день. Отмечай пройденные и возвращайся к записям.</p>
  <div class="day-grid" role="group" aria-label="Выбор дня">${readingPlan.map(r=>`<button type="button" class="day-chip ${saved.completed.includes(r.day)?'done':''} ${ui.day===r.day?'active':''}" data-day="${r.day}" aria-label="День ${r.day}: ${esc(r.title)}${saved.completed.includes(r.day)?', пройден':''}" aria-pressed="${ui.day===r.day}">${saved.completed.includes(r.day) && ui.day!==r.day?icon('check',15):r.day}</button>`).join('')}</div>
  </section>
  <article class="panel plan-reader" aria-labelledby="daily-heading"><div class="detail-kicker">${icon('sunrise',16)} День ${d.day} из 30 ${done?'· Пройден':''}</div><h2 id="daily-heading">${esc(d.title)}</h2>
  <div class="scripture"><div class="label-line">${icon('book',16)} Прочитай в Библии</div><div class="scripture-ref">${esc(d.reference)}</div><p>${esc(d.reflection)}</p></div>
  <h3 class="content-title">Помолись</h3><p class="prayer-text">${esc(d.prayer)}</p>
  <div class="action-box"><div class="label-line">${icon('sprout',17)} Примени в жизни</div><p>${esc(d.action)}</p></div>
  <hr class="soft-rule"/>
  <div class="reading-area"><label for="day-note">Мои размышления и ответы на молитву</label><textarea id="day-note" data-note="${d.day}" maxlength="${LIMIT}" placeholder="Что я понял из этого отрывка? Что хочу изменить?">${esc(saved.notes[d.day]||'')}</textarea></div>
  <div class="reader-footer"><button type="button" class="btn ${done?'warm':'primary'}" data-complete="${d.day}">${icon(done?'check':'circleCheck',17)} ${done?'Отмечено как пройденное':'Отметить день пройденным'}</button><div class="reader-arrows"><button type="button" class="btn" ${d.day===1?'disabled':''} data-day="${d.day-1}" aria-label="Предыдущий день">${icon('left',17)} Назад</button><button type="button" class="btn" ${d.day===30?'disabled':''} data-day="${d.day+1}" aria-label="Следующий день">Вперёд ${icon('right',17)}</button></div></div>
  </article>`;
}
function journalView() {
  const notes=readingPlan.filter(d=>saved.notes[d.day]?.trim());
  return `<section class="panel journal-area" aria-labelledby="journal-heading"><div class="journal-intro"><span class="flower-badge">${icon('sprout',25)}</span><div><h2 class="section-title" id="journal-heading">Молитвенный дневник</h2><p class="section-desc">Здесь есть место для твоих слов, благодарности и вопросов Богу.</p></div></div>
  <label for="personal-prayer">Моя личная молитва</label><textarea id="personal-prayer" data-personal maxlength="${LIMIT}" placeholder="Небесный Отец, сегодня я хочу рассказать Тебе…">${esc(saved.personalPrayer)}</textarea>
  <div class="journal-tools"><button type="button" class="btn primary" data-copy-journal>${icon('copy',16)} Копировать дневник</button><button type="button" class="btn" data-export-txt>${icon('download',16)} Скачать .txt</button></div>
  <hr class="soft-rule"/>
  <div class="section-top"><div><h3 class="content-title" style="margin:0">Размышления по дням</h3><p class="section-desc">Нажми на запись, чтобы открыть её.</p></div><span class="count">${notes.length} записей</span></div>
  ${notes.length?notes.map(d=>`<button type="button" class="note-card" data-day="${d.day}"><strong>День ${d.day} · ${esc(d.title)}</strong><small>${esc(saved.notes[d.day].slice(0,200))}</small></button>`).join(''):`<div class="empty">Пока нет записей. Начни с первого дня чтения.<br/><button type="button" class="btn inline" style="margin-top:12px" data-day="1">Открыть первый день</button></div>`}
  <hr class="soft-rule"/>
  <h3 class="content-title" style="font-size:20px">Мои данные</h3><p class="section-desc">Создай резервную копию, чтобы перенести записи на другое устройство. Восстановление заменяет текущие записи.</p>
  <div class="journal-tools"><button type="button" class="btn" data-backup>${icon('download',16)} Резервная копия JSON</button><button type="button" class="btn" data-import-trigger>${icon('upload',16)} Восстановить</button><input type="file" hidden accept="application/json,.json" id="import-file"/><button type="button" class="btn danger" data-clear>${icon('trash',16)} Удалить мои записи</button></div>
  <div class="privacy-note">${icon('lock',15)} <strong>Приватность:</strong> молитвы, заметки, избранное и прогресс хранятся только в этом браузере (localStorage). Аккаунтов, рекламы, аналитики и отправки данных на сервер нет. При очистке браузера записи могут исчезнуть — делай резервные копии.</div>
  </section>`;
}
function layout() {
  return `<div class="site-shell"><header class="site-header">${brand()}<div class="header-small">${icon('leaf',17)} Без регистрации. Без рекламы. Бесплатно.</div></header>
  <div class="page"><section class="hero"><div class="hero-content"><div class="eyebrow">Писание · Молитва · Жизнь</div><h1>Мир начинается<br/>с доверия Богу.</h1><p>Тихое место для молитвы, чтения Евангелия и маленьких шагов веры в обычной жизни.</p><div class="hero-actions"><button type="button" class="hero-cta" data-nav="plan">${icon('book',19)}<span>Начать читать Евангелие</span>${icon('right',18)}</button></div></div><div class="hero-art">${heroIllustration()}</div></section>
  ${featureCards()}
  <div class="quote-line">«Господь мой и Бог мой!» · Иоанна 20:28</div>
  <div class="workspace">${sidebar()}<main id="main" class="main-view" tabindex="-1">${ui.view==='prayers'?prayersView():ui.view==='plan'?planView():journalView()}</main></div>
  <footer class="footer">${icon('cross',19,'class="footer-cross"')}<span class="footer-scripture">Господу — вся слава.</span><br/>Авторские молитвы по мотивам Священного Писания. Читай библейские отрывки в полном контексте.<br/>Бесплатный проект с открытым исходным кодом · <button type="button" class="help-link" data-about>О молитвослове и его ограничениях</button></footer></div>${mobileNav()}</div>`;
}
function render() {app.innerHTML=layout();}
function route(url) {
  const value=(url || window.location.hash).replace(/^#/, '');
  if (value==='plan') ui.view='plan';
  else if (value==='journal') ui.view='journal';
  else if (value.startsWith('day=')) {
    const day=Number(value.slice(4));
    if (Number.isInteger(day) && day>=1 && day<=30) {ui.day=day;ui.view='plan';}
  } else if (value.startsWith('prayer=')) {
    const selected=value.slice(7);
    if (situations.some(s=>s.id===selected)) ui.selected=selected;
    ui.view='prayers';
    if (ui.category==='favorites' && !saved.favorites.includes(ui.selected)) ui.category='all';
    if (ui.query) ui.query='';
  } else ui.view='prayers';
  render();
}
function navigate(fragment, scroll='top') {
  history.pushState(null,'', '#' + fragment);
  route('#'+fragment);
  if (scroll==='detail') document.querySelector('#detail')?.scrollIntoView({block:'start',behavior:'smooth'});
  else window.scrollTo({top:0,behavior:'smooth'});
}
app.addEventListener('click', async e => {
  const target=e.target.closest('button, a[data-action]');
  if (!target || target.disabled) return;
  const d=target.dataset;
  if (d.action==='home') {e.preventDefault(); navigate('prayer=anxiety');return;}
  if (d.favoritesHome!==undefined) {ui.category='favorites';ui.view='prayers';navigate('prayer='+ui.selected);return;}
  if (d.nav) {if(d.nav==='prayers') ui.category='all';navigate(d.nav==='prayers'?'prayer='+ui.selected:d.nav);return;}
  if (d.category) {ui.category=d.category;render();return;}
  if (d.prayer) {ui.selected=d.prayer;navigate('prayer='+ui.selected, 'detail');return;}
  if (d.resetFilter!==undefined) {ui.category='all';ui.query='';render();return;}
  if (d.fav) {saved.favorites=saved.favorites.includes(d.fav)?saved.favorites.filter(x=>x!==d.fav):[...saved.favorites,d.fav];save();render();toast(saved.favorites.includes(d.fav)?'Добавлено в избранное':'Убрано из избранного');return;}
  if (d.copyPrayer) {const s=situations.find(x=>x.id===d.copyPrayer);if(s) await copyText(`${s.title}\nПисание: ${s.references}\n\n${s.prayer}\n\nШаг веры: ${s.action}`);return;}
  if (d.sharePrayer) {await copyText(`${window.location.origin}${window.location.pathname}#prayer=${d.sharePrayer}`);return;}
  if (d.day) {const day=Number(d.day);if(day>=1&&day<=30) {ui.day=day;navigate('day='+day);}return;}
  if (d.complete) {const day=Number(d.complete);saved.completed=saved.completed.includes(day)?saved.completed.filter(x=>x!==day):[...saved.completed,day];save();render();toast(saved.completed.includes(day)?'День отмечен как пройденный':'Отметка снята');return;}
  if (d.copyJournal!==undefined) {await copyText(dailyExport());return;}
  if (d.exportTxt!==undefined) {downloadFile('molitvenny-dnevnik.txt',dailyExport(),'text/plain;charset=utf-8');toast('Дневник скачан');return;}
  if (d.backup!==undefined) {downloadFile('blizhe-ko-hristu-backup.json',JSON.stringify({app:'closer-to-christ',version:1,exportedAt:new Date().toISOString(),data:saved},null,2),'application/json;charset=utf-8');toast('Резервная копия скачана');return;}
  if (d.importTrigger!==undefined) {document.getElementById('import-file')?.click();return;}
  if (d.clear!==undefined) {if (confirm('Удалить все личные молитвы, заметки, избранное и отметки за 30 дней на этом устройстве? Это нельзя отменить без резервной копии.')) {saved=normalize({});save();render();toast('Локальные записи удалены');}return;}
  if (d.about!==undefined) {alert('Ближе ко Христу — независимый бесплатный евангельский молитвослов. Молитвы — авторские тексты, а не цитаты или гарантия исполнения просьб. Ссылки указывают на Библию: читай отрывки целиком. Приложение не заменяет врачей, психологическую или юридическую помощь, а при угрозе насилия приоритетом остаётся безопасность. Данные хранятся локально в браузере.');return;}
});
app.addEventListener('input', e => {
  const d=e.target.dataset;
  if (d.search!==undefined) {
    const position=e.target.selectionStart;
    ui.query=e.target.value;
    render();
    const input=document.querySelector('#search-prayers');
    input?.focus({preventScroll:true});
    try {input?.setSelectionRange(position, position);}catch{}
  }
  if (d.note!==undefined) {saved.notes[Number(d.note)]=e.target.value.slice(0,LIMIT);save();}
  if (d.personal!==undefined) {saved.personalPrayer=e.target.value.slice(0,LIMIT);save();}
});
app.addEventListener('change', async e => {
  if (e.target.id!=='import-file') return;
  const file=e.target.files?.[0];if(!file) return;
  if(file.size>1024*1024){toast('Файл больше 1 МБ. Импорт отменён.');return;}
  try {
    const incoming=JSON.parse(await file.text());
    if(incoming?.app!=='closer-to-christ'||incoming?.version!==1||!incoming.data||typeof incoming.data!=='object') throw new Error('format');
    if(!confirm('Восстановление заменит твой текущий дневник и прогресс данными из файла. Продолжить?'))return;
    saved=normalize(incoming.data);save();render();toast('Дневник восстановлен');
  } catch {toast('Не удалось прочитать резервную копию этого приложения');}
});
window.addEventListener('popstate',()=>route());
window.addEventListener('hashchange',()=>route());
route();
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')) {
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{}));
}
