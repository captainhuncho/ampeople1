'use client'

import { useEffect, useRef, useState } from 'react'
import { MEMBER, TIER_LABELS, TIER_ORDER, TIER_DISPLAY, EVENTS, type TierKey } from '@/data/memberData'

// ─── Types ───────────────────────────────────────────────────
type Screen = 'landing' | 'app'
type LoginView = 'member' | 'pin' | 'apply' | 'applied'
type AppPage = 'card' | 'events' | 'perks' | 'profile'
type ApplyStep = 1 | 2 | 3

// ─── Main Component ──────────────────────────────────────────
export default function AMPeopleApp() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [loginView, setLoginView] = useState<LoginView>('member')
  const [appPage, setAppPage] = useState<AppPage>('card')
  const [isFlipped, setIsFlipped] = useState(false)
  const [memberTier, setMemberTier] = useState<TierKey>(MEMBER.tier)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [memberInput, setMemberInput] = useState('')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [applyStep, setApplyStep] = useState<ApplyStep>(1)
  const [applyRef, setApplyRef] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null)
  const [nlOpen, setNlOpen] = useState(false)
  const [nlEmail, setNlEmail] = useState('')
  const [nlFirst, setNlFirst] = useState('')
  const [nlSuccess, setNlSuccess] = useState(false)
  const [cardFlipped, setCardFlipped] = useState(false)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const memberInputRef = useRef<HTMLInputElement>(null)

  const tierData = TIER_DISPLAY[memberTier]

  // ── Apply tier theme to body ────────────────────────────────
  useEffect(() => {
    document.body.setAttribute('data-tier', memberTier)
  }, [memberTier])



  // ── QR code draw ────────────────────────────────────────────
  useEffect(() => {
    if (appPage !== 'card' || !cardFlipped) return
    const canvas = qrCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const size = 90
    canvas.width = size
    canvas.height = size
    const cell = size / 21
    ctx.fillStyle = memberTier === 'core' ? '#1c1c1c' : '#f8f8f4'
    ctx.fillRect(0, 0, size, size)
    // Simple QR pattern placeholder
    const pattern = [
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    ]
    const bg = memberTier === 'core' ? '#1c1c1c' : '#f8f8f4'
    const fg = memberTier === 'core' ? '#e8e8e6' : '#0a0a08'
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = fg
    pattern.forEach((row, r) => {
      row.forEach((v, c2) => {
        if (v) ctx.fillRect(c2 * cell, r * cell, cell, cell)
      })
    })
  }, [appPage, cardFlipped, memberTier])

  // ── Helpers ─────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const canAccess = (eventTier: string) => {
    return TIER_ORDER.indexOf(memberTier) >= TIER_ORDER.indexOf(eventTier as TierKey)
  }

  const handleLogin = () => {
    const num = memberInput.replace(/\D/g, '')
    if (num.length < 4) return
    setLoginView('pin')
  }

  const handlePin = (digit: string) => {
    if (pin.length >= 4) return
    const newPin = pin + digit
    setPin(newPin)
    if (newPin.length === 4) {
      if (newPin === '0001') {
        setTimeout(() => {
          setPin('')
          setScreen('app')
          setOverlayOpen(false)
        }, 400)
      } else {
        setTimeout(() => {
          setPinError('Incorrect PIN. Please try again.')
          setPin('')
        }, 400)
      }
    }
  }

  const handlePinDelete = () => setPin(p => p.slice(0, -1))

  const handleMemberInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 5)
    setMemberInput(digits)
  }

  const submitApplication = () => {
    const ref = 'AM-APP-' + String(Math.floor(1000 + Math.random() * 9000))
    setApplyRef(ref)
    setLoginView('applied')
  }

  const closeNewsletter = () => {
    setNlOpen(false)
    try { localStorage.setItem('nl_dismissed', String(Date.now())) } catch {}
  }

  const submitNewsletter = () => {
    if (!nlEmail || !/^[^@]+@[^@]+\.[^@]+$/.test(nlEmail)) return
    setNlSuccess(true)
    try { localStorage.setItem('nl_subscribed', '1') } catch {}
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Custom cursor */}
      <div className="cursor-dot" id="cursorDot" />
      <div className="cursor-ring" id="cursorRing" />

      {/* Toast */}
      {toast && <div className="toast visible">{toast}</div>}

      {/* ══ SCREEN 1: LANDING ══════════════════════════════ */}
      <div className={`screen${screen === 'landing' ? ' active' : ''}`} id="screen-landing">
        <div className="land-hero-img" />
        <div className="land-hero-bg" />

        {/* Centre wordmark */}
        <div className="land-centre">
          <div className="land-wordmark">
            AM <em>People</em>
          </div>
          <div className="land-tagline">A private culture for intentional people</div>
        </div>

        {/* Bottom nav */}
        <div className="land-bottom-nav">
          <div className="land-insta" title="@theampeople">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <div className="land-nav-links">
            <button className="land-nav-link">Press</button>
            <button className="land-nav-link primary" onClick={() => setOverlayOpen(true)}>Membership</button>
            <button className="land-nav-link">Events</button>
            <button className="land-nav-link">Careers</button>
            <button className="land-nav-link">Privacy</button>
          </div>
        </div>

        {/* Login overlay */}
        <div className={`land-login-overlay${overlayOpen ? ' open' : ''}`} id="landLoginOverlay"
          onClick={e => { if (e.target === e.currentTarget) { setOverlayOpen(false); setLoginView('member') } }}>
          <div className="land-login-panel">
            <button className="land-login-back" onClick={() => { setOverlayOpen(false); setLoginView('member') }}>← Back</button>
            <div className="login-wrap">

              {/* Member number view */}
              {loginView === 'member' && (
                <div className="view active">
                  <div className="form-eyebrow">Member Access</div>
                  <h2 className="login-title">Sign in to<br /><em>your membership</em></h2>
                  <div className="member-input-wrap">
                    <span className="member-prefix">AM-</span>
                    <input
                      ref={memberInputRef}
                      className="member-input"
                      id="memberInput"
                      type="text"
                      inputMode="numeric"
                      placeholder="00001"
                      maxLength={5}
                      value={memberInput}
                      onChange={e => handleMemberInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      autoComplete="off"
                    />
                  </div>
                  <button className="enter-btn" onClick={handleLogin}>Continue →</button>
                  <button className="apply-link-btn" onClick={() => setLoginView('apply')}>Apply for Membership →</button>
                </div>
              )}

              {/* PIN view */}
              {loginView === 'pin' && (
                <div className="view active">
                  <div className="form-eyebrow">Verification</div>
                  <h2 className="login-title">Enter your<br /><em>PIN</em></h2>
                  <div className="pin-sub">AM-{memberInput.padStart(5,'0')}</div>
                  <div className="pin-dots">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`pin-dot${i < pin.length ? ' filled' : ''}`} />
                    ))}
                  </div>
                  {pinError && <div className="pin-err">{pinError}</div>}
                  <div className="num-pad">
                    {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
                      <button key={i} className={`num-btn${d === '' ? ' empty' : ''}`}
                        onClick={() => d === '⌫' ? handlePinDelete() : d !== '' ? handlePin(d) : null}>
                        {d}
                      </button>
                    ))}
                  </div>
                  <button className="back-link" onClick={() => { setPin(''); setPinError(''); setLoginView('member') }}>← Change member number</button>
                </div>
              )}

              {/* Apply view */}
              {loginView === 'apply' && (
                <div className="view active">
                  <div className="form-eyebrow">New Membership</div>
                  <h2 className="login-title">Apply to<br /><em>AM People</em></h2>
                  <div className="apply-steps">
                    {[1,2,3].map(s => (
                      <div key={s} className={`apply-step${applyStep === s ? ' active' : applyStep > s ? ' done' : ''}`}>{s}</div>
                    ))}
                  </div>

                  {applyStep === 1 && (
                    <div>
                      <div className="apply-field"><label className="field-label">First Name</label><input className="field-input" id="a-first" type="text" autoComplete="off" /></div>
                      <div className="apply-field"><label className="field-label">Last Name</label><input className="field-input" id="a-last" type="text" autoComplete="off" /></div>
                      <div className="apply-field"><label className="field-label">Email Address</label><input className="field-input" id="a-email" type="email" autoComplete="off" /></div>
                      <div className="apply-nav">
                        <span />
                        <button className="apply-next" onClick={() => setApplyStep(2)}>Next →</button>
                      </div>
                    </div>
                  )}

                  {applyStep === 2 && (
                    <div>
                      <div className="apply-field"><label className="field-label">City of Residence</label>
                        <select className="field-input" id="a-city">
                          <option>Select city</option>
                          <option>Accra</option><option>Lagos</option><option>London</option>
                          <option>Nairobi</option><option>New York</option><option>Dubai</option><option>Other</option>
                        </select>
                      </div>
                      <div className="apply-field"><label className="field-label">Profession</label><input className="field-input" id="a-profession" type="text" autoComplete="off" /></div>
                      <div className="apply-field"><label className="field-label">Phone (optional)</label><input className="field-input" id="a-phone" type="tel" autoComplete="off" /></div>
                      <div className="apply-nav">
                        <button className="apply-prev" onClick={() => setApplyStep(1)}>←</button>
                        <button className="apply-next" onClick={() => setApplyStep(3)}>Next →</button>
                      </div>
                    </div>
                  )}

                  {applyStep === 3 && (
                    <div>
                      <div className="apply-field"><label className="field-label">Why do you want to join AM People?</label><textarea className="field-input" id="a-why" rows={3} style={{resize:'none'}} /></div>
                      <div className="apply-field">
                        <label className="field-label">Preferred membership tier</label>
                        <select className="field-input" id="a-tier">
                          <option value="">Select a tier</option>
                          <option value="core">Core</option>
                          <option value="select">Select</option>
                          <option value="elite">Elite</option>
                        </select>
                      </div>
                      <div className="apply-nav">
                        <button className="apply-prev" onClick={() => setApplyStep(2)}>←</button>
                        <button className="apply-next" onClick={submitApplication}>Submit Application</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Applied view */}
              {loginView === 'applied' && (
                <div className="view active" style={{textAlign:'center'}}>
                  <div className="apply-done-icon">✦</div>
                  <div className="success-title" style={{fontSize:'26px'}}>Application<br /><em>received.</em></div>
                  <p className="success-sub" style={{marginTop:'10px'}}>Our membership committee reviews every application personally. You'll hear from us within 5–7 days.</p>
                  <div className="apply-ref" id="applyRefNum">REF — {applyRef}</div>
                  <button className="enter-btn" style={{background:'transparent',border:'1px solid var(--border)',color:'var(--cream)'}} onClick={() => setLoginView('member')}>Back to sign in</button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ══ SCREEN 2: MEMBER APP ═══════════════════════════ */}
      <div className={`screen${screen === 'app' ? ' active' : ''}`} id="screen-app" style={{display: screen === 'app' ? 'flex' : 'none', flexDirection:'column', height:'100vh', overflow:'hidden'}}>

        {/* Top nav */}
        <nav className="app-top-nav">
          <div className="app-logo">AM <em>People</em></div>
          <div className="notif" />
        </nav>

        {/* Pages */}
        <div style={{flex:1, overflow:'auto'}}>

          {/* CARD PAGE */}
          {appPage === 'card' && (
            <div className="app-page active" id="page-card">
              <div className="eyebrow">Your membership</div>
              <h1 className="page-title">{tierData.title}<br /><em style={{fontStyle:'italic',color:'var(--muted)'}}>{tierData.subtitle}</em></h1>
              <div className="card-scene" id="cardScene" onClick={() => setCardFlipped(f => !f)}>
                <div className={`card-flipper${cardFlipped ? ' flipped' : ''}`}>
                  <div className="card-face card-front">
                    <div className="card-shimmer" />
                    <div className="card-glow" />
                    <div className="card-wm" />
                    <div className="card-wm-foot"><span>AM People · Official Member Card · {MEMBER.number}</span></div>
                    <div className="card-brand">AM <em>People</em></div>
                    <div className="card-tier">{tierData.badge}</div>
                    <div className="card-chip" />
                    <div className="card-bottom">
                      <div className="card-num">•••• •••• {MEMBER.number.slice(-4)}</div>
                      <div>
                        <div className="card-holder-name">{MEMBER.name}</div>
                        <div className="card-since">Member since {MEMBER.since}</div>
                      </div>
                    </div>
                  </div>
                  <div className="card-face card-back">
                    <div className="card-back-stripe" />
                    <div className="qr-wrap">
                      <canvas ref={qrCanvasRef} width={90} height={90} />
                      <div className="qr-lbl">Scan to verify</div>
                    </div>
                    <div className="card-back-info">
                      <div className="card-back-name">{MEMBER.name}</div>
                      <div className="card-back-id">{MEMBER.number} · {tierData.title} · Valid 2024–2026</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flip-hint">Tap card to flip</div>
              <div className="wallet-section">
                <button className="wallet-btn wallet-apple" onClick={() => showToast('Apple Wallet coming soon')}>
                  <span className="wallet-ico">🍎</span> Add to Apple Wallet
                </button>
                <button className="wallet-btn wallet-google" onClick={() => showToast('Google Wallet coming soon')}>
                  <span className="wallet-ico">G</span> Add to Google Wallet
                </button>
              </div>
            </div>
          )}

          {/* EVENTS PAGE */}
          {appPage === 'events' && !selectedEvent && (
            <div className="app-page active" id="page-events">
              <div className="eyebrow">March 2025</div>
              <h1 className="page-title">Events &<br /><em style={{fontStyle:'italic',color:'var(--muted)'}}>Gatherings</em></h1>
              <div className="events-list">
                {EVENTS.map(ev => {
                  const accessible = canAccess(ev.tier)
                  return (
                    <div key={ev.id} className={`event-card${!accessible ? ' locked' : ''}`} onClick={() => accessible && setSelectedEvent(ev)}>
                      <div className="event-date"><span className="event-day">{ev.day}</span><span className="event-month">{ev.month}</span></div>
                      <div className="event-info">
                        <div className="event-name">{ev.name}</div>
                        <div className="event-meta">{ev.time} · {ev.location} · {ev.venue}</div>
                        <span className={`tier-badge tier-${ev.tier}`}>{TIER_LABELS[ev.tier as TierKey]}</span>
                      </div>
                      {!accessible && <div className="event-lock">🔒</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* EVENT DETAIL */}
          {appPage === 'events' && selectedEvent && (
            <div className="app-page active" id="page-event-detail">
              <button className="event-detail-back" onClick={() => setSelectedEvent(null)}>← Events</button>
              <div className="event-detail-header">
                <div className="event-detail-date">{selectedEvent.day} {selectedEvent.month}</div>
                <h2 className="event-detail-name">{selectedEvent.name}</h2>
                <div className="event-detail-venue">{selectedEvent.venue} · {selectedEvent.location}</div>
              </div>
              <p className="event-detail-desc">{selectedEvent.desc}</p>
              <div className="event-detail-meta">
                <div className="edm-row"><span>Time</span><span>{selectedEvent.time}</span></div>
                <div className="edm-row"><span>Capacity</span><span>{selectedEvent.capacity}</span></div>
                <div className="edm-row"><span>Dress</span><span>{selectedEvent.dress}</span></div>
              </div>
              <button className="submit-btn" style={{width:'100%',marginTop:'24px'}} onClick={() => showToast('RSVP confirmed ✦')}>
                RSVP to this event
              </button>
            </div>
          )}

          {/* PERKS PAGE */}
          {appPage === 'perks' && (
            <div className="app-page active" id="page-perks">
              <div className="eyebrow">{tierData.perks}</div>
              <h1 className="page-title">Member<br /><em style={{fontStyle:'italic',color:'var(--muted)'}}>Benefits</em></h1>
              <div className="perks-grid">
                {[
                  {icon:'🍽️', title:'Curated Dining', desc:'Priority reservations at partner restaurants across all chapters'},
                  {icon:'✈️', title:'Travel Concierge', desc:'Dedicated travel planning for members and their guests'},
                  {icon:'🎭', title:'Cultural Access', desc:'Early access to gallery openings, performances, and private events'},
                  {icon:'🤝', title:'Member Network', desc:'Introductions to fellow members across cities, curated by the team'},
                  {icon:'🏨', title:'Partner Hotels', desc:'Preferred rates and upgrades at AM People partner properties'},
                  {icon:'📱', title:'Digital Membership', desc:'Digital card, event RSVP, and community access from anywhere'},
                ].map((p, i) => (
                  <div key={i} className="perk-card">
                    <div className="perk-icon">{p.icon}</div>
                    <div className="perk-title">{p.title}</div>
                    <div className="perk-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE PAGE */}
          {appPage === 'profile' && (
            <div className="app-page active" id="page-profile">
              <div className="profile-avatar">{MEMBER.name.split(' ').map(n => n[0]).join('')}</div>
              <div className="profile-name">{MEMBER.name}</div>
              <div className="profile-tier">{tierData.prof}</div>
              <div className="profile-handle">{MEMBER.handle} · #{MEMBER.number.slice(-5)}</div>
              <div className="profile-stats">
                <div className="stat-box"><div className="stat-num">12</div><div className="stat-lbl">Events Attended</div></div>
                <div className="stat-box"><div className="stat-num">3</div><div className="stat-lbl">Cities Visited</div></div>
                <div className="stat-box"><div className="stat-num">47</div><div className="stat-lbl">Connections</div></div>
              </div>
              <div className="profile-section-title">Account</div>
              <div className="profile-menu">
                {['Edit Profile','Notification Preferences','Manage Subscription','Contact Concierge','Sign Out'].map(item => (
                  <button key={item} className="profile-menu-item" onClick={() => item === 'Sign Out' ? setScreen('landing') : showToast('Coming soon')}>
                    <span>{item}</span><span>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Tier preview switcher (demo) */}
        <div id="tierSwitcher" style={{
          position:'fixed', bottom:'80px', left:'50%', transform:'translateX(-50%)',
          zIndex:999, display:'flex', alignItems:'center', gap:0,
          background:'rgba(10,10,8,0.82)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(255,255,255,0.1)', borderRadius:'40px',
          padding:'5px', boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
        }}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:'8px',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)',padding:'0 12px 0 8px',textTransform:'uppercase',whiteSpace:'nowrap'}}>Preview tier</div>
          {(['core','select','elite','founding'] as TierKey[]).map(t => (
            <button key={t} className={`ts-btn${memberTier === t ? ' ts-active' : ''}`} onClick={() => setMemberTier(t)}>
              {t === 'founding' ? 'Founding ✦' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Bottom nav */}
        <nav className="app-bottom-nav">
          {([['card','◈','Card'],['events','◷','Events'],['perks','✦','Perks'],['profile','◉','Profile']] as const).map(([page, ico, lbl]) => (
            <button key={page} className={`nav-btn${appPage === page ? ' active' : ''}`} onClick={() => { setAppPage(page as AppPage); setSelectedEvent(null) }}>
              <span className="nav-ico">{ico}</span>
              <span className="nav-lbl">{lbl}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ══ NEWSLETTER OVERLAY ═════════════════════════════ */}
      <div className={`nl-overlay${nlOpen ? ' visible' : ''}`} id="nlOverlay"
        onClick={e => { if (e.target === e.currentTarget) closeNewsletter() }}>
        <div className="nl-modal">
          <button className="nl-close" onClick={closeNewsletter}>✕</button>
          {!nlSuccess ? (
            <div id="nlForm">
              <div className="nl-eyebrow">The Inner Circle</div>
              <h2 className="nl-title">Stay in the<br /><em>loop.</em></h2>
              <p className="nl-sub">Events, new chapters, and moments worth knowing — before anyone else.</p>
              <div className="nl-fields">
                <input className="nl-input" id="nlFirst" type="text" placeholder="First name" value={nlFirst} onChange={e => setNlFirst(e.target.value)} autoComplete="off" />
                <input className="nl-input" id="nlEmailInput" type="email" placeholder="Email address" value={nlEmail} onChange={e => setNlEmail(e.target.value)} autoComplete="off" />
              </div>
              <div id="nlErrMsg" style={{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'rgba(220,100,80,0.85)',minHeight:'16px',marginBottom:'8px'}} />
              <button className="nl-submit" id="nlSubmitButton" onClick={submitNewsletter}>Subscribe</button>
              <p className="nl-disclaimer">No spam. Unsubscribe anytime.</p>
              <button className="nl-skip" onClick={closeNewsletter}>Not now</button>
            </div>
          ) : (
            <div id="nlSuccess" className="nl-success">
              <div className="nl-success-icon">✦</div>
              <h2 className="nl-title">You're on<br /><em>the list.</em></h2>
              <p className="nl-sub">Watch your inbox. The best things arrive quietly.</p>
              <button className="nl-submit" onClick={closeNewsletter} style={{marginTop:'28px'}}>Close</button>
            </div>
          )}
        </div>
      </div>

      {/* PWA install banner */}
      <div className="pwa-banner hidden" id="pwaBanner">
        <div className="pwa-text">Add AM People to your home screen</div>
        <button className="pwa-install-btn">Add</button>
        <button className="pwa-dismiss">✕</button>
      </div>
    </>
  )
}
