// AM People — App Logic
// Migrated from am-people-complete.html


/* ═══════════════════════════════════
   CURSOR
   ═══════════════════════════════════ */
var cur = document.getElementById('cursor');
var ring = document.getElementById('cursorRing');
var mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;
document.addEventListener('mousemove', function(e) {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx+'px'; cur.style.top = my+'px';
});
(function loop() {
  rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(loop);
})();
function setCursorHover(on) {
  cur.style.width = on?'10px':'6px'; cur.style.height = on?'10px':'6px';
  ring.style.width = on?'48px':'32px'; ring.style.height = on?'48px':'32px';
  ring.style.borderColor = on?'rgba(184,149,90,0.7)':'rgba(184,149,90,0.4)';
}
document.addEventListener('mouseover', function(e) {
  if (e.target.matches('button,input,select,textarea,a,[onclick]')) setCursorHover(true);
});
document.addEventListener('mouseout', function(e) {
  if (e.target.matches('button,input,select,textarea,a,[onclick]')) setCursorHover(false);
});

/* ═══════════════════════════════════
   LANDING PAGE NAV
   ═══════════════════════════════════ */
function showLandingView(view) {
  var overlay = document.getElementById('landLoginOverlay');
  if (view === 'membership') {
    // Open login overlay, show member number input
    overlay.classList.add('open');
    showLoginView('member');
    setTimeout(function(){ 
      var inp = document.getElementById('memberInput');
      if(inp) inp.focus();
    }, 400);
  } else if (view === 'apply') {
    overlay.classList.add('open');
    showLoginView('apply');
  } else {
    // Other nav links — just close overlay for now
    overlay.classList.remove('open');
  }
}
function closeLandingOverlay() {
  document.getElementById('landLoginOverlay').classList.remove('open');
  showLoginView('member');
}
// Click outside login panel to close
document.getElementById('landLoginOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeLandingOverlay();
});

/* ═══════════════════════════════════
   SCREEN ROUTING (defined once below, after events JS)
   ═══════════════════════════════════ */

/* ═══════════════════════════════════
   LOGIN — MEMBER NUMBER
   ═══════════════════════════════════ */
/* ═══════════════════════════════════
   LOGIN — MEMBER NUMBER
   ═══════════════════════════════════ */
var memberInput = document.getElementById('memberInput');
memberInput.addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g,'').slice(0,5);
  document.getElementById('memberErr').textContent = '';
  this.style.borderBottomColor = '';
  // Update wrapper border on error clear
  var wrap = this.closest('.member-input-wrap');
  if (wrap) wrap.style.borderBottomColor = '';
});
memberInput.addEventListener('keydown', function(e) {
  if (e.key==='Enter') goToPin();
});
function goToPin() {
  var num = memberInput.value.trim();
  if (num.length < 4) {
    document.getElementById('memberErr').textContent = 'Please enter a valid member number';
    var wrap = memberInput.closest('.member-input-wrap');
    if (wrap) wrap.style.borderBottomColor = 'rgba(220,100,80,0.7)';
    return;
  }
  var fullVal = 'AM-' + num;
  document.getElementById('pinSub').innerHTML = 'Verifying identity for <strong style="color:var(--cream);font-weight:300">'+fullVal.toUpperCase()+'</strong>';
  showLoginView('pin');
  pinReset();
}

/* ═══════════════════════════════════
   LOGIN — PIN
   ═══════════════════════════════════ */
var pinVal = '';
var PIN_CORRECT = '0001';
function pinPress(d) {
  if (pinVal.length>=4) return;
  pinVal += d; updateDots();
  if (pinVal.length===4) setTimeout(checkPin, 200);
}
function pinDelete() {
  pinVal = pinVal.slice(0,-1); updateDots();
  document.getElementById('pinErr').textContent = '';
}
function updateDots() {
  for (var i=0;i<4;i++) {
    var dot = document.getElementById('d'+i);
    dot.classList.remove('error');
    dot.classList.toggle('filled', i<pinVal.length);
  }
}
function checkPin() {
  if (pinVal===PIN_CORRECT) {
    showLoginView('success');
  } else {
    for (var i=0;i<4;i++) document.getElementById('d'+i).classList.add('error');
    document.getElementById('pinErr').textContent = 'Incorrect PIN — try again';
    setTimeout(function() { pinReset(); document.getElementById('pinErr').textContent=''; }, 900);
  }
}
function pinReset() { pinVal=''; updateDots(); }
function goBack() { showLoginView('member'); pinReset(); document.getElementById('pinErr').textContent=''; }

/* ═══════════════════════════════════
   LOGIN — SUCCESS → APP
   ═══════════════════════════════════ */
function enterApp() {
  var btn = document.querySelector('#view-success .enter-btn');
  btn.textContent = 'Loading your world…';
  setTimeout(function() {
    showScreen('screen-app');
  }, 800);
}

/* ═══════════════════════════════════
   LOGIN VIEW SWITCHER
   ═══════════════════════════════════ */
function showLoginView(name) {
  document.querySelectorAll('.login-wrap .view').forEach(function(v) { v.classList.remove('active'); });
  var el = document.getElementById('view-'+name);
  if (el) el.classList.add('active');
  if (name==='apply') { applyStep=0; syncApplySteps(0); }
}

/* ═══════════════════════════════════
   APPLY FORM
   ═══════════════════════════════════ */
var applyStep = 0;
function syncApplySteps(step) {
  document.querySelectorAll('.apply-step').forEach(function(s,i) {
    s.classList.toggle('active', i===step);
  });
  for (var i=0;i<3;i++) {
    var pip = document.getElementById('pip'+i);
    if (pip) pip.className = 'step-pip'+(i<step?' done':i===step?' active':'');
  }
}
function applyNext(step) {
  if (step===1) {
    var fname=document.getElementById('a-fname').value.trim();
    var email=document.getElementById('a-email').value.trim();
    var city=document.getElementById('a-city').value;
    if (!fname||!email||!city) { highlightEmpty(['a-fname','a-email','a-city']); return; }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) { document.getElementById('a-email').style.borderBottomColor='rgba(220,100,80,0.7)'; return; }
  }
  if (step===2) {
    var prof=document.getElementById('a-profession').value.trim();
    if (!prof) { highlightEmpty(['a-profession']); return; }
  }
  applyStep=step; syncApplySteps(step);
}
function highlightEmpty(ids) {
  ids.forEach(function(id) {
    var el=document.getElementById(id);
    if (el && !el.value.trim()) {
      el.style.borderBottomColor='rgba(220,100,80,0.7)';
      el.addEventListener('input',function(){ el.style.borderBottomColor=''; },{once:true});
    }
  });
}
function submitApplication() {
  var why=document.getElementById('a-why').value.trim();
  var tier=document.getElementById('a-tier').value;
  if (!why||!tier) { document.getElementById('applyErr').textContent='Please complete all fields'; highlightEmpty(['a-why','a-tier']); return; }
  var ref='AM-APP-'+Math.floor(1000+Math.random()*9000);
  document.getElementById('applyRefNum').textContent='REF — '+ref;
  showLoginView('applied');
}

/* ═══════════════════════════════════
   APP — PAGE NAV
   ═══════════════════════════════════ */
function appNav(name, btn) {
  document.querySelectorAll('.app-page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('page-'+name).classList.add('active');
  btn.classList.add('active');
}

/* ═══════════════════════════════════
   APP — CARD FLIP
   ═══════════════════════════════════ */
var flipped = false;
document.getElementById('cardScene').addEventListener('click', function() {
  flipped = !flipped;
  document.getElementById('cardFlipper').style.transform = flipped ? 'rotateY(180deg)' : '';
  document.getElementById('flipHint').textContent = flipped ? '↻ Tap to flip back' : '↻ Tap card to reveal QR code';
});

/* ═══════════════════════════════════
   APP — QR CODE
   ═══════════════════════════════════ */
function drawQR() {
  var canvas = document.getElementById('qrCanvas');
  if (!canvas || canvas.dataset.drawn) return;
  canvas.dataset.drawn = '1';
  var ctx = canvas.getContext('2d');
  var size=108, mod=19, cell=size/mod;
  ctx.fillStyle='#f0ead8'; ctx.fillRect(0,0,size,size);
  var seed=100;
  function rnd(){ seed=(seed*1664525+1013904223)&0x7fffffff; return seed/0x7fffffff; }
  function finder(ox,oy){
    ctx.fillStyle='#111'; ctx.fillRect(ox*cell,oy*cell,7*cell,7*cell);
    ctx.fillStyle='#f0ead8'; ctx.fillRect((ox+1)*cell,(oy+1)*cell,5*cell,5*cell);
    ctx.fillStyle='#111'; ctx.fillRect((ox+2)*cell,(oy+2)*cell,3*cell,3*cell);
  }
  finder(0,0); finder(mod-7,0); finder(0,mod-7);
  var m=0.8;
  for(var r=0;r<mod;r++) for(var c=0;c<mod;c++){
    if((r<8&&c<8)||(r<8&&c>=mod-8)||(r>=mod-8&&c<8)) continue;
    if(rnd()>0.48){ ctx.fillStyle='#111'; ctx.beginPath(); ctx.roundRect(c*cell+m,r*cell+m,cell-m*2,cell-m*2,1); ctx.fill(); }
  }
}


/* ═══════════════════════════════════
   EVENTS DATA & RENDERING
   ═══════════════════════════════════ */

// Current member tier: 'core' | 'select' | 'elite' | 'founding'
var MEMBER_TIER = 'founding';

// Apply tier theme to entire UI
function applyTierTheme(tier) {
  document.body.setAttribute('data-tier', tier || 'core');
}
// Apply immediately
applyTierTheme(MEMBER_TIER);
var TIER_ORDER = ['core','select','elite','founding'];

// EVENTS imported from data file

// TIER_LABELS imported
var STATUS_LABELS = { open:'Open', invite:'Invite only', booked:'Booked' };

function canAccess(eventTier) {
  return TIER_ORDER.indexOf(MEMBER_TIER) >= TIER_ORDER.indexOf(eventTier);
}

function buildEventsList() {
  var list = document.getElementById('eventsList');
  if (!list) return;
  list.innerHTML = '';
  EVENTS.forEach(function(ev) {
    var accessible = canAccess(ev.tier);
    var row = document.createElement('div');
    row.className = 'event-row';
    row.style.opacity = accessible ? '1' : '0.55';
    row.onclick = function() { openEventDetail(ev.id); };
    row.innerHTML =
      '<div class="ev-date"><div class="ev-day">'+ev.day+'</div><div class="ev-mon">'+ev.month+'</div></div>'+
      '<div class="ev-body">'+
        '<div class="ev-name">'+ev.name+(ev.tier==='founding'?'<span class="founding-star">✦</span>':'')+'</div>'+
        '<div class="ev-meta">'+ev.time+' · '+ev.location+' · '+ev.venue+'</div>'+
        '<div style="display:flex;gap:6px;margin-top:8px">'+
          '<span class="tier-badge tier-'+ev.tier+'">'+TIER_LABELS[ev.tier]+'</span>'+
          (!accessible ? '<span class="tier-badge" style="color:var(--muted);border-color:rgba(237,229,208,0.1)">🔒 Locked</span>' : '')+
        '</div>'+
      '</div>'+
      '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">'+
        '<div class="ev-tag'+(ev.status==='booked'?' booked':'')+'">'+STATUS_LABELS[ev.status]+'</div>'+
        '<span style="font-size:18px;opacity:0.5">'+ev.emoji+'</span>'+
      '</div>';
    list.appendChild(row);
  });
}

function openEventDetail(id) {
  var ev = EVENTS.find(function(e){ return e.id===id; });
  if (!ev) return;
  var accessible = canAccess(ev.tier);
  var page = document.getElementById('page-event-detail');

  // Build tier rows
  var tierRows = ['core','select','elite','founding'].map(function(t) {
    var hasAccess = TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(ev.tier)
                  ? false  // tier needed
                  : true;
    var needed = TIER_ORDER.indexOf(t) >= TIER_ORDER.indexOf(ev.tier);
    return '<div class="tier-access-row">'+
      '<div class="tier-access-left">'+
        '<span class="tier-badge tier-'+t+'" style="font-size:7px">'+TIER_LABELS[t]+'</span>'+
        '<span class="tier-access-name" style="font-size:14px">'+TIER_LABELS[t].replace(' ✦','')+'</span>'+
      '</div>'+
      (needed
        ? '<span class="tier-unlocked-icon">✓</span>'
        : '<span class="tier-locked-icon">✕</span>')+
    '</div>';
  }).join('');

  var memberTierLabel = TIER_LABELS[MEMBER_TIER];
  var rsvpClass = accessible ? 'accessible' : 'locked';
  var rsvpText = ev.status==='booked' ? 'You\u2019re booked \u2713' : accessible ? 'RSVP to this event' : 'Not available on your tier';

  page.innerHTML =
    '<button class="ev-detail-back" onclick="backToEvents()">← All Events</button>'+

    '<div class="ev-detail-hero">'+
      '<div class="ev-detail-hero-bg" style="background:linear-gradient(135deg,#0d0d0b,#1a1408)">'+
        '<div class="ev-hero-overlay"></div>'+
        '<div class="ev-hero-emoji">'+ev.emoji+'</div>'+
        '<div class="ev-detail-date-badge">'+
          '<div class="ev-detail-day">'+ev.day+'</div>'+
          '<div class="ev-detail-month">'+ev.month+' 2025</div>'+
        '</div>'+
        '<div class="ev-detail-title-wrap">'+
          '<div class="ev-detail-title">'+ev.name+'</div>'+
          '<div class="ev-detail-loc">'+ev.location+' · '+ev.venue+'</div>'+
        '</div>'+
      '</div>'+
    '</div>'+

    '<div class="ev-detail-body">'+

      '<div class="member-tier-row">'+
        '<span class="tier-badge tier-'+MEMBER_TIER+'">Your tier</span>'+
        '<span class="member-tier-name tier-'+MEMBER_TIER+'">'+memberTierLabel+'</span>'+
      '</div>'+

      '<p class="ev-detail-desc">'+ev.desc+'</p>'+

      '<div class="ev-detail-meta-grid">'+
        '<div class="ev-meta-cell"><div class="ev-meta-label">Time</div><div class="ev-meta-val">'+ev.time+'</div></div>'+
        '<div class="ev-meta-cell"><div class="ev-meta-label">Location</div><div class="ev-meta-val">'+ev.location+'</div></div>'+
        '<div class="ev-meta-cell"><div class="ev-meta-label">Capacity</div><div class="ev-meta-val">'+ev.capacity+'</div></div>'+
        '<div class="ev-meta-cell"><div class="ev-meta-label">Dress code</div><div class="ev-meta-val">'+ev.dress+'</div></div>'+
      '</div>'+

      '<div class="tier-access-section">'+
        '<span class="tier-access-label">Tier Access</span>'+
        '<div class="tier-access-list">'+tierRows+'</div>'+
      '</div>'+

      '<button class="rsvp-btn '+rsvpClass+'">'+rsvpText+'</button>'+
      (accessible && ev.status!=='booked'
        ? '<p class="rsvp-hint">Booking confirms your place — cancellations 48hrs prior</p>'
        : !accessible
        ? '<p class="rsvp-hint">Upgrade to '+TIER_LABELS[ev.tier]+' tier to access this event</p>'
        : '')+
    '</div>';

  // Switch to detail page
  document.querySelectorAll('.app-page').forEach(function(p){ p.classList.remove('active'); });
  page.classList.add('active');
}

function backToEvents() {
  document.querySelectorAll('.app-page').forEach(function(p){ p.classList.remove('active'); });
  document.getElementById('page-events').classList.add('active');
  // Reset nav highlight
  document.querySelectorAll('.nav-btn').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.nav-btn')[1].classList.add('active');
}

// Single definitive showScreen
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
  var el = document.getElementById(id);
  el.classList.add('active');
  if (id==='screen-app') {
    document.body.style.overflow='hidden';
    var ov = document.getElementById('landLoginOverlay');
    if (ov) ov.classList.remove('open');
    drawQR();
    initPWA();
    buildEventsList();
  } else {
    document.body.style.overflow='hidden';
  }
}

/* ═══════════════════════════════════
   SIGN OUT
   ═══════════════════════════════════ */
function signOut() {
  memberInput.value = '';
  pinReset();
  document.getElementById('view-success').querySelector('.enter-btn').textContent = 'Enter AM People →';
  showScreen('screen-landing');
  showLoginView('member');
  setTimeout(function(){ memberInput.focus(); }, 600);
}

/* ═══════════════════════════════════
   TOAST
   ═══════════════════════════════════ */
function showToast(msg) {
  var t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); },3000);
}

/* ═══════════════════════════════════
   PWA
   ═══════════════════════════════════ */
var deferredPrompt=null;
function initPWA(){
  var isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  var isStandalone=window.navigator.standalone;
  if(isIOS&&!isStandalone){
    setTimeout(function(){
      document.getElementById('pwaBanner').classList.remove('hidden');
      document.getElementById('pwaSub').textContent='Tap Share → Add to Home Screen';
      document.getElementById('pwaInstallBtn').textContent='How?';
      document.getElementById('pwaInstallBtn').onclick=function(){ showToast('Tap the Share icon, then "Add to Home Screen"'); };
    },2500);
  }
}
window.addEventListener('beforeinstallprompt',function(e){
  e.preventDefault(); deferredPrompt=e;
  document.getElementById('pwaBanner').classList.remove('hidden');
});
function installPWA(){
  if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt.userChoice.then(function(r){ if(r.outcome==='accepted') showToast('✦ AM People added to home screen'); deferredPrompt=null; document.getElementById('pwaBanner').classList.add('hidden'); }); }
}
var manifest={name:"AM People",short_name:"AM People",description:"Your exclusive members club",start_url:"/",display:"standalone",background_color:"#060604",theme_color:"#060604",icons:[{src:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' fill='%23060604'/%3E%3Ctext x='96' y='125' text-anchor='middle' font-size='64' fill='%23b8955a' font-family='Georgia,serif'%3EAM%3C/text%3E%3C/svg%3E",sizes:"192x192",type:"image/svg+xml"}]};
var blob=new Blob([JSON.stringify(manifest)],{type:'application/json'});
document.getElementById('pwaManifest').href=URL.createObjectURL(blob);

/* ═══════════════════════════════════
   NEWSLETTER POPUP
   ═══════════════════════════════════ */
var API_BASE = ''; // Set to your Railway URL e.g. 'https://am-people-api.railway.app'

function showNewsletter() {
  openNewsletter();
}

async function submitNewsletter() {
  var email    = document.getElementById('nlEmailInput').value.trim();
  var firstName = document.getElementById('nlFirst') ? document.getElementById('nlFirst').value.trim() : '';
  var errEl    = document.getElementById('nlErrMsg');
  var btn      = document.getElementById('nlSubmitButton');

  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    if (errEl) errEl.textContent = 'Please enter a valid email address';
    return;
  }

  if (btn) { btn.textContent = 'Joining…'; btn.style.opacity = '0.6'; }
  if (errEl) errEl.textContent = '';

  try {
    if (API_BASE) {
      const res = await fetch(API_BASE + '/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName })
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Signup failed');
      }
    }
    // Show success state in nlOverlay
    var form    = document.getElementById('nlForm');
    var success = document.getElementById('nlSuccess');
    if (form)    form.style.display    = 'none';
    if (success) success.style.display = 'block';
    try { localStorage.setItem('nl_subscribed', '1'); } catch(e) {}
  } catch (err) {
    if (errEl) errEl.textContent = err.message || 'Something went wrong. Please try again.';
    if (btn)   { btn.textContent = 'Join the list'; btn.style.opacity = '1'; }
  }
}

// Auto-show popup after 8 seconds on landing page (once per session)
setTimeout(function() {
  try {
    if (localStorage.getItem('nl_subscribed')) return;
    var dismissed = localStorage.getItem('nl_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;
  } catch(e) {}
  var landing = document.getElementById('screen-landing');
  if (landing && landing.classList.contains('active')) {
    openNewsletter();
  }
}, 8000);

setTimeout(function(){ memberInput.focus(); }, 800);

/* ── Tier preview switcher ── */
// TIER_DISPLAY imported

function previewTier(tier) {
  MEMBER_TIER = tier;
  var d = TIER_DISPLAY[tier];

  // Theme
  applyTierTheme(tier);

  // Card page title
  var pt = document.querySelector('#page-card .page-title');
  if (pt) pt.innerHTML = d.title + '<br><em style="font-style:italic;color:var(--muted)">' + d.subtitle + '</em>';

  // Card tier badge text
  var ct = document.querySelector('.card-tier');
  if (ct) ct.textContent = d.badge;

  // Back of card
  var backId = document.querySelector('.card-back-id');
  if (backId) backId.textContent = 'AM-00001 · ' + d.title + ' · Valid 2024–2026';

  // Perks eyebrow
  var pe = document.querySelector('#page-perks .eyebrow');
  if (pe) pe.textContent = d.perks.charAt(0).toUpperCase() + d.perks.slice(1);

  // Profile tier
  var prof = document.querySelector('.profile-tier');
  if (prof) prof.textContent = d.prof;

  // Rebuild events with new tier access
  buildEventsList();

  // Update switcher buttons
  document.querySelectorAll('.ts-btn').forEach(function(btn) {
    btn.classList.remove('ts-active');
  });
  var active = document.getElementById('ts' + tier.charAt(0).toUpperCase() + tier.slice(1));
  if (active) active.classList.add('ts-active');
}



/* ═══════════════════════════════════
   NEWSLETTER POPUP
   ═══════════════════════════════════ */
// API_BASE set above — update to your Railway URL

function openNewsletter() {
  // Only show on the landing page, never inside the member app
  var landing = document.getElementById('screen-landing');
  if (!landing || !landing.classList.contains('active')) return;
  var overlay = document.getElementById('nlOverlay');
  if (overlay) overlay.classList.add('visible');
}
function closeNewsletter() {
  document.getElementById('nlOverlay').classList.remove('visible');
  // Remember dismissal for 7 days
  try { localStorage.setItem('nl_dismissed', Date.now()); } catch(e) {}
}

// Close on overlay click
document.getElementById('nlOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeNewsletter();
});




