const { useState, useEffect, useRef, useMemo } = React;
const IntroTunnel = window.IntroTunnel;
const PropertyAI = window.PropertyAI;
const BookingModal = window.BookingModal;
const CategoryPage = window.CategoryPage;

/* ───────────────────── Echo Stack ───────────────────── */
function Echo({ children, size = "clamp(72px, 11vw, 220px)", className = "", echoColors, mainColor = "var(--ink)", weight }) {
  const cols = echoColors || ["var(--echo-4)", "var(--echo-3)", "var(--echo-2)", "var(--echo-1)"];
  const layers = [
    { t: "0", l: "0", c: cols[0] },
    { t: "-0.04em", l: "-0.04em", c: cols[1] },
    { t: "-0.08em", l: "-0.08em", c: cols[2] },
    { t: "-0.12em", l: "-0.12em", c: cols[3] },
  ];
  return (
    <span
      className={"clash " + className}
      style={{ position: "relative", display: "inline-block", fontSize: size, lineHeight: 0.9, fontWeight: weight }}
    >
      {layers.map((l, i) => (
        <span key={i} aria-hidden style={{ position: "absolute", top: l.t, left: l.l, color: l.c, pointerEvents: "none", whiteSpace: "nowrap", fontWeight: weight }}>
          {children}
        </span>
      ))}
      <span style={{ position: "relative", color: mainColor, whiteSpace: "nowrap", fontWeight: weight }}>{children}</span>
    </span>
  );
}

/* ───────────────────── Nav ───────────────────── */
function Nav({ onContact }) {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const f = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    ["Folio", "#folio"],
    ["Portfolio", "#portfolio"],
    ["About", "#about"],
  ];

  const handleMobileLink = (href) => {
    setMobileOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }, 300);
  };

  // Whole site is dark now — nav stays light text in both states
  const onDark = true;
  const navInk = "#f4ede3";
  const navMute = "rgba(244,237,227,0.65)";
  const navInk2 = "#f4ede3";
  const navHair = "rgba(244,237,227,0.25)";
  const navStroke = "#f4ede3";

  return (
    <>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 40, height: 80,
          background: solid || mobileOpen ? "rgba(15,13,11,0.92)" : "rgba(15,13,11,0.0)",
          backdropFilter: solid ? "blur(12px)" : "none",
          WebkitBackdropFilter: solid ? "blur(12px)" : "none",
          borderBottom: solid ? "1px solid var(--line)" : "1px solid transparent",
          transition: "background 250ms ease, border-color 250ms ease",
        }}
      >
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#top" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 14, zIndex: 1 }}>
            <Crown dark={onDark} />
            <div style={{ lineHeight: 1.05 }}>
              <div className="clash" style={{ fontSize: 20, letterSpacing: "-0.03em", color: navInk, transition: "color 250ms ease" }}>
                Third Rock <span style={{ fontFamily: "Gambarino, Georgia, serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>Realty</span>
              </div>
              <div className="uc" style={{ fontSize: 10, color: navMute, letterSpacing: "0.16em", transition: "color 250ms ease" }}>Real Estate Agency · Mohali</div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} className="uc"
                style={{ fontSize: 13, color: navInk, transition: "color 120ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = onDark ? "rgba(255,255,255,0.65)" : "var(--mute-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = navInk)}
              >{label}</a>
            ))}
            <button onClick={onContact} className="uc"
              style={{ fontSize: 12, letterSpacing: "0.12em", padding: "12px 22px", borderRadius: 999, border: "1px solid " + navInk2, background: "transparent", color: navInk2, cursor: "pointer", transition: "background 200ms ease, color 200ms ease, border-color 250ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = navInk2; e.currentTarget.style.color = onDark ? "#111" : "var(--bg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = navInk2; }}
            >Schedule a Viewing</button>
          </nav>

          {/* Hamburger */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid " + navHair, background: "transparent", cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}
          >
            {mobileOpen
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke={navStroke} strokeWidth="1.5" strokeLinecap="round"/></svg>
              : <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M1 1h16M1 7h16M1 13h16" stroke={navStroke} strokeWidth="1.5" strokeLinecap="round"/></svg>
            }
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div className={"mobile-nav " + (mobileOpen ? "open" : "")}>
        <div style={{ flex: 1 }}>
          {navLinks.map(([label, href], i) => (
            <a
              key={label}
              href={href}
              onClick={(e) => { e.preventDefault(); handleMobileLink(href); }}
              className="clash"
              style={{
                display: "block", fontSize: "clamp(40px,11vw,64px)", letterSpacing: "-0.04em",
                color: "var(--ink)", padding: "12px 0",
                borderBottom: i < navLinks.length - 1 ? "1px solid var(--line)" : "none",
                lineHeight: 1.1,
              }}
            >{label}</a>
          ))}
        </div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
          <button
            onClick={() => { setMobileOpen(false); setTimeout(onContact, 300); }}
            className="uc"
            style={{ fontSize: 13, letterSpacing: "0.12em", padding: "18px 28px", borderRadius: 999, border: "none", background: "var(--ink-2)", color: "var(--bg)", cursor: "pointer", textAlign: "center" }}
          >Schedule a Viewing →</button>
          <a href="tel:+91XXXXXXXXXX" className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--mute)", textAlign: "center" }}>
            +91 XXXXX XXXXX
          </a>
        </div>
      </div>
    </>
  );
}

function Crown({ dark = true }) {
  // Whole site is dark; the SVG strokes/text stay cream regardless
  const stroke = "#f4ede3";
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="19" stroke={stroke} strokeWidth="1" />
      <circle cx="20" cy="20" r="12" fill="#1a6fd4" />
      <text x="20" y="24" textAnchor="middle" fontFamily="Clash Display, sans-serif" fontWeight="700" fontSize="9" fill="#ffffff" letterSpacing="-0.02em">TR</text>
    </svg>
  );
}

/* ───────────────────── Hero ───────────────────── */
function Hero({ active }) {
  const bgRef = useRef(null);
  const videoRef = useRef(null);
  const [showCue, setShowCue] = useState(false);

  // Parallax drift
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${y * 0.16}px, 0) scale(${1 + Math.min(y, 600) * 0.0001})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Pick the right cut for the viewport (mobile gets the portrait version)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const pick = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const next = isMobile ? "assets/hero-bg-mobile.mp4" : "assets/hero-bg.mp4";
      const current = v.currentSrc.split("/").slice(-1)[0];
      if (!current.endsWith(next.split("/").slice(-1)[0])) {
        v.src = next;
        v.load();
      }
    };
    pick();
    const mq = window.matchMedia("(max-width: 768px)");
    mq.addEventListener ? mq.addEventListener("change", pick) : mq.addListener(pick);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", pick) : mq.removeListener(pick); };
  }, []);

  // Start video from frame 0 the moment the intro completes — car arrival syncs with reveal
  useEffect(() => {
    if (!active || !videoRef.current) return;
    const v = videoRef.current;
    try { v.currentTime = 0; } catch (e) {}
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
    const t = setTimeout(() => setShowCue(true), 2200);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section id="top" className={active ? "hero-on" : ""} style={{ position: "relative", height: "100vh", marginTop: -80, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Full-viewport cinematic video */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 0, background: "#08090c", willChange: "transform", transform: "translate3d(0,0,0)" }}
      >
        <video
          ref={videoRef}
          muted loop playsInline preload="auto"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 100%", display: "block", background: "#08090c" }}
        >
          {/* Portrait-first source picked on phones; desktop falls back to wide cut */}
          <source src="assets/hero-bg-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="assets/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Cinematic overlay — vignette + soft gradient */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(120% 80% at 50% 60%, rgba(8,9,12,0.08) 0%, rgba(8,9,12,0.42) 60%, rgba(8,9,12,0.78) 100%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(8,9,12,0.55) 0%, rgba(8,9,12,0.0) 22%, rgba(8,9,12,0.0) 72%, rgba(8,9,12,0.55) 100%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 108, paddingBottom: 28, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

        {/* Top row — descriptor + stats */}
        <div className="hero-top hero-fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 340 }}>
            <div className="uc" style={{ fontSize: 10, color: "rgba(255,255,255,0.78)", letterSpacing: "0.22em", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 28, height: 1, background: "#1a6fd4", display: "inline-block" }} />
              Real Estate Agency · Mohali
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.86)", lineHeight: 1.55, maxWidth: 300 }}>
              A discreet desk for residential, commercial and land mandates. GMADA empanelled · RERA registered.
            </p>
          </div>
          <div className="hero-stats" style={{ display: "flex", gap: 44, alignItems: "flex-start", flexWrap: "wrap" }}>
            <HeroStat n="₹1,400Cr" label="Transactions closed" />
            <HeroStat n="23+" label="Years in practice" />
            <HeroStat n="100+" label="Deals closed" />
          </div>
        </div>

        {/* Centre — headline, animated word-by-word on intro completion */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, textShadow: "0 2px 80px rgba(0,0,0,0.55)", marginTop: -10 }}>
          <div className="clash hero-headline-1" style={{ fontSize: "clamp(60px, 13.5vw, 270px)", letterSpacing: "-0.05em", lineHeight: 0.92, color: "#ffffff", fontWeight: 500 }}>
            <span className="hero-word w-1">PROPERTY</span>
          </div>
          <div className="clash hero-headline-2" style={{ fontSize: "clamp(60px, 13.5vw, 270px)", letterSpacing: "-0.05em", lineHeight: 0.92, color: "#ffffff", fontWeight: 500, display: "flex", alignItems: "baseline", gap: "0.18em" }}>
            <span className="hero-word w-2" style={{ fontFamily: "Gambarino, Georgia, serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.04em", fontSize: "0.92em", color: "#1a6fd4" }}>as</span>
            <span className="hero-word w-3">CAPITAL.</span>
          </div>
          <div className="hero-word hero-tagline" style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "Gambarino, Georgia, serif", fontStyle: "italic", fontSize: 18, color: "rgba(244,237,227,0.82)", letterSpacing: "-0.005em" }}>
            <span style={{ width: 36, height: 1, background: "#1a6fd4", display: "inline-block" }} />
            Expert property guidance · Trusted since inception.
          </div>
        </div>

        {/* Bottom — refined CTA frame + address + scroll cue */}
        <div className="hero-bottom hero-fade-late" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 22, gap: 20, flexWrap: "wrap" }}>
          <div>
            <div className="uc" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.22em", marginBottom: 8 }}>The Office</div>
            <div className="clash" style={{ fontSize: 16, letterSpacing: "-0.02em", color: "#ffffff", fontWeight: 500 }}>
              SCO 1, 2nd Floor · Sector 79, SAS Nagar
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <a href="#portfolio" className="hero-cta">
              View The Portfolio
              <span className="arrow">→</span>
            </a>
            <a href="tel:+91XXXXXXXXXX" className="uc" style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(255,255,255,0.72)" }}>
              +91 XXXXX XXXXX
            </a>
          </div>
        </div>

        {/* Scroll cue — bottom centre */}
        <div aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: 86, transform: "translateX(-50%)", opacity: showCue ? 1 : 0, transition: "opacity 700ms ease", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, pointerEvents: "none" }}>
          <span className="uc" style={{ fontSize: 9, letterSpacing: "0.32em", color: "rgba(255,255,255,0.55)" }}>Scroll</span>
          <span style={{ width: 1, height: 28, background: "linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0))", display: "inline-block" }} />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ n, label }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div className="clash mono-num hero-stat-num" style={{ fontSize: "clamp(28px,4.4vw,40px)", letterSpacing: "-0.04em", color: "#ffffff", fontWeight: 500 }}>{n}</div>
      <div className="uc" style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.18em", marginTop: 8 }}>{label}</div>
    </div>
  );
}

function Stat({ n, label, numColor = "var(--ink)", labelColor = "var(--mute)" }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div className="clash mono-num" style={{ fontSize: "clamp(24px,4vw,32px)", letterSpacing: "-0.04em", color: numColor }}>{n}</div>
      <div className="uc" style={{ fontSize: 10, color: labelColor, letterSpacing: "0.16em", marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* ───────────────────── Reveal Wrapper ───────────────────── */
function Reveal({ children, delay = 0, as = "div", className = "", ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }),
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={"reveal-up " + (delay ? "d-" + delay + " " : "") + (seen ? "in " : "") + className} {...rest}>
      {children}
    </Tag>
  );
}

/* ───────────────────── Custom Cursor ───────────────────── */
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    document.addEventListener("mousemove", onMove);
    let raf;
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onOver = (e) => {
      const t = e.target;
      const hot = t.closest && t.closest("a, button, [role=button], .bm-cell, .bm-time, .bm-tag, .folio-plate, .pcard, .j-card, .ai-chip, .press-item");
      const text = t.matches && (t.matches("input, textarea") || (t.closest && t.closest("input, textarea")));
      document.documentElement.classList.toggle("rs-cursor-hot", !!hot && !text);
      document.documentElement.classList.toggle("rs-cursor-text", !!text);
    };
    document.addEventListener("mouseover", onOver);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div className="rs-cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="rs-cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

/* ───────────────────── Field Notes (live ticker) ───────────────────── */
function FieldNotes() {
  const notes = [
    { tag: "Mandate", text: "3 BR kothi · Sector 79 · Mohali" },
    { tag: "Closed",  text: "Plot 500 sq yd · Sector 88 · last week" },
    { tag: "Added",   text: "SCO · Sector 67 · commercial" },
    { tag: "Viewing", text: "Today · 4:00 PM · with the desk" },
    { tag: "Memo",    text: "Builder floor · Aerocity expansion" },
    { tag: "Press",   text: "Tribune Real Estate Conclave · 2025" },
    { tag: "Counsel", text: "NRI mandate · Toronto buyer · Sector 82" },
  ];
  const doubled = [...notes, ...notes];
  return (
    <section className="field-notes" aria-label="Field notes from the desk">
      <div className="fn-track">
        {doubled.map((n, i) => (
          <span key={i} className="fn-item">
            <span className="fn-tag">{n.tag}</span>
            <span className="fn-text">{n.text}</span>
            <span className="fn-dot" />
          </span>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────── Manifesto (was Philosophy) ───────────────────── */
function Manifesto() {
  const pillars = [
    { n: "i",   k: "Counsel", h: "Before catalogue", b: "Balance sheet, holding period, exit and tax shape — modelled before a single site is shown." },
    { n: "ii",  k: "Title",   h: "In plain English", b: "Mutation, jamabandi, fard, encumbrance — laid out in a one-page memo per asset." },
    { n: "iii", k: "Quiet",   h: "Placement",        b: "Roughly two-thirds of inventory never reaches a public portal. Mandates are matched discreetly." },
    { n: "iv",  k: "Hold",    h: "And the exit",      b: "Every introduction includes our view on the resale market two and five years out." },
  ];
  return (
    <section id="practice" className="manifesto">
      <div className="container">
        <div className="manifesto-eyebrow">Manifesto · Note from the desk</div>
        <blockquote className="manifesto-pull">
          We do not sell <em>square feet</em>. We place <em>capital</em> where the city is going — quietly, between long-standing buyers and sellers, on titles that arrive at the closing table already clean.
        </blockquote>
        <div className="manifesto-credit">
          <span className="manifesto-sig">— Third Rock Realty</span>
          <span className="manifesto-role">Real Estate Agency · Mohali</span>
        </div>
        <div className="manifesto-grid">
          {pillars.map((p) => (
            <article key={p.n} className="pillar">
              <div className="pillar-num">{p.n}</div>
              <div className="pillar-cat">{p.k}</div>
              <h3 className="pillar-head">{p.h}</h3>
              <p className="pillar-body">{p.b}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Folio (4 category entry tiles) ───────────────────── */
function Folio({ properties, onCategory }) {
  // Map each tile to a category, with a representative hero photo + count
  const heroFor = (matchFn) => {
    const p = properties.find(matchFn);
    return p ? p.hero : "";
  };
  const countOf = (matchFn) => properties.filter(matchFn).length;

  const cats = [
    {
      id: "Residential",
      label: "Residential",
      caption: "Kothis · builder floors · villas",
      desc: "Independent kothis, builder floors and villas across the tri-city.",
      hero: heroFor((p) => p.type === "Residential" && p.subType === "Kothi") || heroFor((p) => p.type === "Residential"),
      count: countOf((p) => p.type === "Residential" && !/apartment|penthouse|flat/i.test(p.subType || "")),
    },
    {
      id: "Commercial",
      label: "Commercial",
      caption: "SCOs · showrooms · offices",
      desc: "Owner-side mandates and tenant fit-out advisory in commercial corridors.",
      hero: heroFor((p) => p.type === "Commercial"),
      count: countOf((p) => p.type === "Commercial"),
    },
    {
      id: "Apartments",
      label: "Apartments",
      caption: "Apartments · penthouses",
      desc: "Premium apartments and penthouses in the highest-demand pockets.",
      hero: heroFor((p) => p.type === "Residential" && /apartment|penthouse|flat/i.test(p.subType || "")),
      count: countOf((p) => p.type === "Residential" && /apartment|penthouse|flat/i.test(p.subType || "")),
    },
    {
      id: "Plots",
      label: "Plots & Land",
      caption: "GMADA · JLPL · PUDA",
      desc: "Allotted plots in regulated colonies — residential and industrial.",
      hero: heroFor((p) => p.type === "Plot"),
      count: countOf((p) => p.type === "Plot"),
    },
  ];

  return (
    <section id="folio" className="folio">
      <div className="container">
        <header className="folio-head">
          <div className="folio-eyebrow">Folio № 01 · The four desks</div>
          <h2 className="folio-title">Walk into the <em>desk</em>.</h2>
          <p className="folio-sub">
            Four lines of practice — tap a plate to walk through the live mandates currently with the desk, filterable by city.
          </p>
        </header>
        <div className="folio-grid">
          {cats.map((c, i) => (
            <button key={c.id} className={"folio-plate plate-" + (i+1)} onClick={() => window.open("?category=" + c.id, "_blank", "noopener")}>
              <div className="folio-frame" style={{ backgroundImage: `url(${c.hero})` }} />
              <div className="folio-rule" />
              <div className="folio-row">
                <span className="folio-num">№ {String(i+1).padStart(2,'0')} / 04</span>
                <span className="folio-code">{c.caption}</span>
              </div>
              <h3 className="folio-h">{c.label}</h3>
              <div className="folio-meta">
                <span>{c.desc}</span>
                <span className="folio-price">{c.count} live</span>
              </div>
              <span className="folio-cta">View the {c.label.toLowerCase().split(" ")[0]} desk <span>→</span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Portfolio ───────────────────── */
function Portfolio({ properties, onOpen }) {
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [showAll, setShowAll] = useState(false);
  const types = ["All", "Residential", "Commercial", "Plot"];

  const view = useMemo(() => {
    let v = properties.slice();
    if (type !== "All") v = v.filter((p) => p.type === type);
    v.sort((a, b) => {
      const an = parsePrice(a.price), bn = parsePrice(b.price);
      if (sort === "Price ↑") return an - bn;
      if (sort === "Price ↓") return bn - an;
      return new Date(b.listingDate) - new Date(a.listingDate);
    });
    return v;
  }, [properties, type, sort]);

  // Reset showAll whenever the filter/sort changes
  useEffect(() => { setShowAll(false); }, [type, sort]);
  const visible = showAll ? view : view.slice(0, 8);
  const hidden = view.length - visible.length;

  return (
    <section id="portfolio" style={{ paddingTop: 60, paddingBottom: 100, background: "var(--bg)" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <div className="uc" style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.18em", marginBottom: 16 }}>
              ◇ Index № 02 — Live Mandates · {view.length} of {properties.length}
            </div>
            <h2 className="clash" style={{ fontSize: "clamp(48px, 9vw, 148px)", letterSpacing: "-0.06em", margin: 0, lineHeight: 0.9, fontWeight: 700 }}>
              The <span className="serif-it" style={{ fontWeight: 400 }}>Portfolio</span>
            </h2>
          </div>
          <div style={{ flex: "0 1 360px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55, paddingTop: 20 }}>
            Each entry is title-clean, dues-paid and personally inspected by the desk. Click a row for the full memo, photographs and a viewing slot.
          </div>
        </div>

        <div className="filter-rail" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--ink-2)", borderBottom: "1px solid var(--line)", padding: "16px 0", gap: 12, flexWrap: "wrap", marginBottom: 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {types.map((t) => (
              <button key={t} onClick={() => setType(t)} className="uc"
                style={{ fontSize: 11, letterSpacing: "0.14em", padding: "9px 16px", borderRadius: 999, border: "1px solid " + (type === t ? "var(--ink-2)" : "var(--line)"), background: type === t ? "var(--ink-2)" : "transparent", color: type === t ? "var(--bg)" : "var(--ink-2)", cursor: "pointer", transition: "all 200ms ease" }}
              >{t}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="uc" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--mute)" }}>Sort</span>
            <div style={{ display: "flex", gap: 0, border: "1px solid var(--line)", borderRadius: 999, overflow: "hidden" }}>
              {["Newest", "Price ↑", "Price ↓"].map((s) => (
                <button key={s} onClick={() => setSort(s)} className="uc"
                  style={{ fontSize: 11, letterSpacing: "0.14em", padding: "9px 14px", border: "none", background: sort === s ? "var(--ink-2)" : "transparent", color: sort === s ? "var(--bg)" : "var(--ink-2)", cursor: "pointer", whiteSpace: "nowrap" }}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {visible.map((p, i) => <ListingRow key={p.id} p={p} idx={i + 1} onOpen={() => window.open("?property=" + p.id, "_blank", "noopener")} />)}
        </ul>

        {hidden > 0 && (
          <div style={{ marginTop: 36, display: "flex", justifyContent: "center" }}>
            <button onClick={() => setShowAll(true)} className="uc"
              style={{ fontSize: 12, letterSpacing: "0.18em", padding: "16px 32px", borderRadius: 999, border: "1px solid var(--accent)", background: "transparent", color: "var(--ink)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 12, transition: "background 250ms ease, transform 250ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(26,111,212,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              View {hidden} more {hidden === 1 ? "mandate" : "mandates"} <span style={{ fontSize: 14 }}>↓</span>
            </button>
          </div>
        )}
        {showAll && view.length > 8 && (
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
            <button onClick={() => { setShowAll(false); document.getElementById("portfolio").scrollIntoView({ behavior: "smooth", block: "start" }); }} className="uc"
              style={{ fontSize: 11, letterSpacing: "0.18em", padding: "12px 24px", borderRadius: 999, border: "1px solid var(--line)", background: "transparent", color: "var(--mute)", cursor: "pointer" }}
            >
              Collapse list ↑
            </button>
          </div>
        )}

        <div style={{ marginTop: 56, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div className="uc" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--mute)" }}>
            ⓘ Off-market inventory available on request — call the desk.
          </div>
          <a href="#contact" className="uc"
            style={{ fontSize: 12, letterSpacing: "0.14em", padding: "14px 24px", borderRadius: 999, background: "var(--ink-2)", color: "var(--bg)", display: "inline-flex", alignItems: "center", gap: 10 }}
          >Request Off-market List <span style={{ fontSize: 16 }}>→</span></a>
        </div>
      </div>
    </section>
  );
}

function parsePrice(s) {
  const m = s.match(/([\d.]+)/);
  const n = m ? parseFloat(m[1]) : 0;
  if (/cr/i.test(s)) return n * 100;
  return n;
}

function ListingRow({ p, idx, onOpen }) {
  const [hover, setHover] = useState(false);
  const [wide, setWide] = useState(typeof window !== "undefined" ? window.innerWidth >= 1100 : true);
  useEffect(() => {
    const f = () => setWide(window.innerWidth >= 1100);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  return (
    <li
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="listing-row"
      style={{
        display: "grid",
        gridTemplateColumns: wide
          ? "48px 96px minmax(0,1fr) 160px auto 48px"
          : "40px 72px minmax(0,1fr) auto 40px",
        gap: wide ? 20 : 14,
        alignItems: "center",
        padding: "22px 8px",
        borderBottom: "1px solid var(--line)",
        cursor: "pointer",
        background: hover ? "var(--ink-2)" : "transparent",
        color: hover ? "var(--bg)" : "var(--ink-2)",
        transition: "background 350ms cubic-bezier(0.77,0,0.175,1), color 350ms cubic-bezier(0.77,0,0.175,1)",
      }}
    >
      <div className="clash mono-num" style={{ fontSize: 13, opacity: 0.7 }}>{String(idx).padStart(2, "0")}</div>
      <div
        className="listing-thumb"
        style={{ width: wide ? 96 : 72, height: wide ? 64 : 52, borderRadius: 4, overflow: "hidden", backgroundImage: `url(${p.hero})`, backgroundSize: "cover", backgroundPosition: "center", filter: hover ? "grayscale(0)" : "grayscale(0.8)", transition: "filter 500ms ease, transform 500ms ease", transform: hover ? "scale(1.03)" : "scale(1)", flexShrink: 0 }}
      />
      <div style={{ minWidth: 0 }}>
        <div className="clash" style={{ fontSize: wide ? 21 : 17, letterSpacing: "-0.03em", lineHeight: 1.1, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.title}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 5, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span>{p.locality}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>{p.builtUp !== "—" ? p.builtUp : p.plotSize}</span>
          {p.bedrooms != null && <><span style={{ opacity: 0.5 }}>·</span><span>{p.bedrooms} BR</span></>}
          <span style={{ opacity: 0.5 }}>·</span>
          <span className="uc" style={{ letterSpacing: "0.12em", fontSize: 10 }}>{p.status.split(" — ")[0]}</span>
        </div>
      </div>
      {wide && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {p.tags.slice(0, 2).map((t) => (
            <span key={t} className="uc" style={{ fontSize: 9, letterSpacing: "0.14em", padding: "5px 9px", border: "1px solid " + (hover ? "rgba(242,242,242,0.4)" : "var(--line)"), borderRadius: 999, whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      )}
      <div className="clash mono-num" style={{ fontSize: wide ? 22 : 16, letterSpacing: "-0.03em", textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>{p.price}</div>
      <div style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid " + (hover ? "rgba(242,242,242,0.5)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginLeft: "auto", transition: "all 250ms ease", transform: hover ? "rotate(-45deg)" : "rotate(0deg)", flexShrink: 0 }}>→</div>
    </li>
  );
}

/* ───────────────────── Property Detail Sheet ───────────────────── */
function DetailSheet({ p, onClose }) {
  const open = !!p;
  const deepLinked = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("property"), []);
  const handleClose = () => {
    if (deepLinked) { window.location.href = window.location.pathname; return; }
    onClose && onClose();
  };
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const lastRef = useRef(p);
  if (p) lastRef.current = p;
  const data = lastRef.current;

  return (
    <>
      {!deepLinked && <div className={"scrim " + (open ? "open" : "")} onClick={handleClose} />}
      <aside className={"sheet " + (open ? "open" : "") + (deepLinked ? " sheet-full" : "")} aria-hidden={!open}>
        {data && <DetailContent p={data} onClose={handleClose} deepLinked={deepLinked} />}
      </aside>
    </>
  );
}

function DetailContent({ p, onClose, deepLinked }) {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <div className="sheet-sticky" style={{ position: "sticky", top: 0, background: "rgba(15,13,11,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 2, gap: 16 }}>
        {deepLinked ? (
          <button onClick={onClose} aria-label="Back to home"
            style={{ background: "transparent", border: "1px solid rgba(244,237,227,0.18)", color: "var(--ink)", display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 16px 9px 14px", borderRadius: 999, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to home
          </button>
        ) : null}
        <div className="uc" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--mute)", flex: deepLinked ? "1 1 auto" : "0 0 auto", textAlign: deepLinked ? "center" : "left" }}>Memo · {p.code}</div>
        <button onClick={onClose} aria-label="Close"
          style={{ width: 38, height: 38, borderRadius: 999, border: "1px solid var(--ink-2)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}
        ><span style={{ fontSize: 16, lineHeight: 1 }}>✕</span></button>
      </div>

      <div className="sheet-body" style={{ padding: "40px 32px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", minWidth: 0 }}>
            <div className="uc" style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 12 }}>{p.type} · {p.subType}</div>
            <h2 className="clash sheet-title" style={{ fontSize: "clamp(36px, 6vw, 64px)", letterSpacing: "-0.045em", margin: 0, lineHeight: 0.95, fontWeight: 700 }}>{p.title}</h2>
            <div style={{ marginTop: 14, fontSize: 15, color: "var(--ink-2)" }}>{p.locality}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 6 }}>Asking Price</div>
            <div className="clash mono-num sheet-price" style={{ fontSize: 40, letterSpacing: "-0.04em", fontWeight: 700 }}>{p.price}</div>
            <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{p.pricePerSqft}</div>
          </div>
        </div>

        <ImageReveal src={p.hero} alt={p.title} />

        <div className="spec-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "1px solid var(--line)", borderRadius: 6, marginTop: 24, overflow: "hidden", background: "var(--paper)" }}>
          <Spec label="Built-up" v={p.builtUp} />
          <Spec label="Plot" v={p.plotSize} />
          <Spec label="Facing" v={p.facing} />
          <Spec label="Floor / Age" v={`${p.floor} · ${p.age}`} />
        </div>

        <div className="tab-bar" style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--line)", marginTop: 44, marginBottom: 28 }}>
          {["Overview", "Specifications", "Title & Compliance", "Viewing"].map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className="uc"
              style={{ fontSize: 11, letterSpacing: "0.16em", padding: "14px 0", border: "none", background: "transparent", color: tab === i ? "var(--ink)" : "var(--mute)", borderBottom: "2px solid " + (tab === i ? "var(--ink)" : "transparent"), cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
            >{t}</button>
          ))}
        </div>

        {tab === 0 && <Overview p={p} />}
        {tab === 1 && <Specifications p={p} />}
        {tab === 2 && <Compliance p={p} />}
        {tab === 3 && <Viewing p={p} />}
      </div>
    </div>
  );
}

function ImageReveal({ src, alt }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 60);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ marginTop: 28, aspectRatio: "16/10", overflow: "hidden", borderRadius: 6, background: "#1a1714", position: "relative" }}>
      <img src={src} alt={alt} className={"reveal " + (vis ? "in" : "")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

function Spec({ label, v }) {
  return (
    <div style={{ padding: "18px 20px", borderRight: "1px solid var(--line)" }}>
      <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 8 }}>{label}</div>
      <div className="clash" style={{ fontSize: "clamp(14px,2vw,18px)", letterSpacing: "-0.02em", fontWeight: 600 }}>{v}</div>
    </div>
  );
}

function Overview({ p }) {
  return (
    <div>
      <p className="clash" style={{ fontSize: "clamp(20px,3vw,26px)", letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0, fontWeight: 500 }}>{p.summary}</p>
      <p style={{ marginTop: 20, color: "var(--ink-2)", lineHeight: 1.65, fontSize: 15 }}>{p.detail}</p>
      <h4 className="clash" style={{ fontSize: 18, letterSpacing: "-0.02em", marginTop: 36, marginBottom: 14 }}>Amenities</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {p.amenities.map((a) => (
          <span key={a} className="uc" style={{ fontSize: 10, letterSpacing: "0.14em", padding: "9px 14px", border: "1px solid var(--line)", borderRadius: 999, background: "var(--paper)" }}>{a}</span>
        ))}
      </div>
      {p.gallery && p.gallery.length > 0 && (
        <>
          <h4 className="clash" style={{ fontSize: 18, letterSpacing: "-0.02em", marginTop: 36, marginBottom: 14 }}>Gallery</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 10 }}>
            {p.gallery.map((g, i) => (
              <div key={i} style={{ aspectRatio: "4/3", backgroundImage: `url(${g})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 4, filter: "grayscale(0.4)" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Specifications({ p }) {
  const rows = [
    ["Property Code", p.code], ["Type", p.subType], ["Locality", p.locality],
    ["Plot Size", p.plotSize], ["Built-up Area", p.builtUp],
    ["Bedrooms", p.bedrooms ?? "—"], ["Bathrooms", p.bathrooms ?? "—"],
    ["Facing", p.facing], ["Parking", p.parking], ["Furnishing", p.furnishing],
    ["Floor", p.floor], ["Age", p.age], ["Status", p.status], ["Listed", p.listingDate],
  ];
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {rows.map(([k, v]) => (
        <div key={k} className="spec-row" style={{ display: "grid", gridTemplateColumns: "200px 1fr", padding: "14px 4px", borderBottom: "1px solid var(--line)", gap: 12 }}>
          <div className="uc" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--mute)" }}>{k}</div>
          <div style={{ fontSize: 15, color: "var(--ink-2)" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function Compliance({ p }) {
  return (
    <div>
      <div className="compliance-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ComplianceCard h="RERA Registration" v={p.rera} note="Punjab Real Estate Regulatory Authority" />
        <ComplianceCard h="Approval" v="GMADA Sanctioned" note="Greater Mohali Area Development Authority" />
        <ComplianceCard h="Title" v="Clear, single owner" note="Fard, jamabandi and mutation verified by the desk" />
        <ComplianceCard h="Dues" v="All cleared" note="Property tax · Electricity · Water · Maintenance" />
      </div>
      <div style={{ marginTop: 24, padding: 24, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 6 }}>
        <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 8 }}>Desk Note</div>
        <p style={{ margin: 0, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}>
          A complete title memo (12 pages) and a physical inspection report are released to a buyer on confirmation of intent. Token cheques are held in escrow with our retained law firm at Chandigarh District Court.
        </p>
      </div>
    </div>
  );
}

function ComplianceCard({ h, v, note }) {
  return (
    <div style={{ border: "1px solid var(--line)", padding: "20px 20px", borderRadius: 6, background: "var(--paper)" }}>
      <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 10 }}>{h}</div>
      <div className="clash" style={{ fontSize: "clamp(16px,2.5vw,22px)", letterSpacing: "-0.02em", fontWeight: 600 }}>{v}</div>
      <div style={{ marginTop: 8, fontSize: 13, color: "var(--mute)" }}>{note}</div>
    </div>
  );
}

function Viewing({ p }) {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6, marginTop: 0 }}>
        Viewings of <strong>{p.code}</strong> at <strong>{p.locality}</strong> are arranged by appointment. Please leave a contact and a time window; the desk responds within four working hours.
      </p>
      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="viewing-form"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}
        >
          <Field label="Name" name="name" />
          <Field label="Phone" name="phone" type="tel" defaultValue="+91 " />
          <Field label="Email" name="email" type="email" wide />
          <Field label="Preferred date & time" name="when" placeholder="e.g. Sat, 4–6 PM" wide />
          <Field label="Note" name="note" textarea wide placeholder="Anything we should know — funding, holding period, comparables you have seen…" />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 16, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button type="submit" className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", padding: "16px 28px", borderRadius: 999, background: "var(--ink-2)", color: "var(--bg)", border: "none", cursor: "pointer" }}>
              Request Viewing →
            </button>
            <a href="tel:+91XXXXXXXXXX" className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--mute)" }}>
              or call +91 XXXXX XXXXX
            </a>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: 24, padding: 32, border: "1px solid var(--ink-2)", borderRadius: 6, background: "var(--paper)" }}>
          <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 10 }}>Received</div>
          <div className="clash" style={{ fontSize: "clamp(22px,4vw,28px)", letterSpacing: "-0.03em", fontWeight: 600 }}>Thank you. The desk will revert shortly.</div>
          <div style={{ marginTop: 12, color: "var(--mute)", fontSize: 14 }}>Reference: VR-{p.code}-{Math.floor(Math.random() * 9000 + 1000)}</div>
        </div>
      )}
    </div>
  );
}

function Field({ label, name, type = "text", textarea, wide, ...rest }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <label style={{ gridColumn: wide ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)" }}>{label}</span>
      <Comp name={name} type={type} rows={textarea ? 3 : undefined} {...rest}
        style={{ background: "transparent", border: "none", borderBottom: "1px solid var(--ink-2)", padding: "10px 0", fontFamily: "inherit", fontSize: 15, color: "var(--ink)", outline: "none", resize: "vertical" }}
      />
    </label>
  );
}

/* ───────────────────── Practice + Process (was Services) ───────────────────── */
function Practice() {
  const items = [
    { n: "i",   k: "Residential",  h: "Kothis, floors, apartments", b: "Independent kothis, apartments and builder floors across Mohali, Chandigarh, Zirakpur and Kharar — end-to-end from search to registry." },
    { n: "ii",  k: "Commercial",   h: "SCOs, showrooms, offices",   b: "We represent owners on the sell-side and corporates on tenant fit-out advisory. Asset-light leases to outright purchase." },
    { n: "iii", k: "Land & Plots", h: "GMADA, JLPL, PUDA",          b: "Allotment paperwork, dues clearance, conveyance and mutation handled in-house with a panel of advocates." },
    { n: "iv",  k: "Investment",   h: "Holding-period counsel",     b: "Holding-period modelling, micro-market reports, rental yield projections and tax-efficient structuring for HNI and NRI buyers." },
    { n: "v",   k: "NRI",          h: "Tenancy & filings",          b: "Rental management, statutory filings, society liaison, and a quarterly photographic property report." },
    { n: "vi",  k: "Title",        h: "Due diligence",              b: "Pre-purchase memos, encumbrance review and litigation searches with a panel of Chandigarh advocates." },
  ];
  const steps = [
    { n: "01", c: "Brief",      h: "Sit-down with the desk", d: "Balance sheet, intent, horizon." },
    { n: "02", c: "Memo",       h: "One-page asset note",     d: "Per shortlisted property." },
    { n: "03", c: "Inspection", h: "Physical + paper",        d: "Site visit and title review." },
    { n: "04", c: "Offer",      h: "Negotiation tabled",      d: "Through our network." },
    { n: "05", c: "Registry",   h: "Closing day",             d: "Sub-registrar coordination." },
    { n: "06", c: "Hand-off",   h: "Possession + filings",    d: "And the exit memo." },
  ];
  const openBook = () => window.RS_openBooking && window.RS_openBooking();
  return (
    <section id="practice" className="practice">
      <div className="container">
        <div className="practice-head">
          <div className="folio-eyebrow">Practice · Six lines of counsel</div>
          <h2 className="practice-h">Lines of <em>counsel</em>.</h2>
          <p className="practice-sub">Six practice areas, one desk. Every mandate is handled personally by our senior team of property consultants.</p>
        </div>
        <div className="practice-grid">
          {items.map((it) => (
            <article key={it.n} className="pcard">
              <div className="pcard-num">{it.n}</div>
              <div className="pcard-cat">{it.k}</div>
              <h3 className="pcard-h">{it.h}</h3>
              <p className="pcard-b">{it.b}</p>
              <button className="pcard-cta" onClick={openBook}>Engage the desk <span>→</span></button>
            </article>
          ))}
        </div>

        <div className="process">
          <div className="process-eyebrow">Process · From brief to possession</div>
          <ol className="process-line">
            {steps.map((s) => (
              <li key={s.n} className="process-step">
                <div className="process-num">{s.n}</div>
                <div className="process-cat">{s.c}</div>
                <div className="process-h">{s.h}</div>
                <p className="process-d">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Principal (was About) ───────────────────── */
function Principal() {
  const openBook = () => window.RS_openBooking && window.RS_openBooking();
  return (
    <section id="about" className="principal">
      <div className="container">
        <div className="principal-grid">
          <div>
            <div className="principal-frame">
              <img src="assets/sachdeva-about.jpg" alt="Third Rock Realty office interior" />
            </div>
            <div className="principal-credits">
              <div className="principal-credit">
                <div className="principal-credit-k">Empanelment</div>
                <div className="principal-credit-v">GMADA · JLPL · PUDA</div>
              </div>
              <div className="principal-credit">
                <div className="principal-credit-k">Regulatory</div>
                <div className="principal-credit-v">PB-RERA Registered</div>
              </div>
              <div className="principal-credit">
                <div className="principal-credit-k">Coverage</div>
                <div className="principal-credit-v">Mohali · Chandigarh · Zirakpur · Kharar · New Chandigarh</div>
              </div>
              <div className="principal-credit">
                <div className="principal-credit-k">Practice</div>
                <div className="principal-credit-v">Residential · Commercial · Land</div>
              </div>
            </div>
          </div>
          <div className="principal-right">
            <div className="manifesto-eyebrow" style={{ marginBottom: 0 }}>Our Expertise · Mohali Tri-City</div>
            <h2 className="principal-name">Third Rock <em>Realty</em></h2>
            <p className="principal-bio">
              Dedicated to placing quality property in the Mohali tri-city. We specialize in residential, commercial and land mandates — known for thorough consultancy and transparent guidance from discovery to closing.
            </p>
            <div className="principal-quote">
              "A good real estate team does not sell square feet. It places capital where the city is going — and guides you every step of the way."
              <div className="principal-quote-sig">— Our commitment to clients</div>
            </div>
            <button onClick={openBook} className="principal-cta">
              Speak with our team <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Press (animated marquee) ───────────────────── */
function Press() {
  const items = [
    { n: "The Tribune",       d: "Real Estate Conclave · 2025" },
    { n: "Hindustan Times",   d: "Mohali Property Report · 2024" },
    { n: "Property Quotient", d: "Cover Feature · 2024" },
    { n: "Realty Plus",       d: "Featured Desk · 2023" },
    { n: "Times of India",    d: "Tri-City Outlook · 2023" },
    { n: "The Indian Express", d: "Property Watch · 2022" },
    { n: "Financial Express",  d: "NRI Investment · 2022" },
  ];
  const doubled = [...items, ...items];
  return (
    <section className="press">
      <div className="container">
        <div className="press-eyebrow">
          <span className="press-dot" />
          <span>As featured in · Conclaves · Cover features</span>
          <span className="press-dot" />
        </div>
      </div>
      <div className="press-marquee">
        <div className="press-track">
          {doubled.map((p, i) => (
            <span key={i} className="press-cell">
              <span className="press-cell-name">{p.n}</span>
              <span className="press-cell-bullet">◆</span>
              <span className="press-cell-date">{p.d}</span>
              <span className="press-cell-sep" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Reviews (replaces Journal) ───────────────────── */
function Reviews() {
  const all = [
    { name: "Aman Khurana",    initial: "A", stars: 5, time: "2 months ago", text: "Third Rock Realty closed our SCO purchase end-to-end. From paperwork to registry, every detail was handled with extraordinary discretion. The most professional agency in the region." },
    { name: "Priya Malhotra",   initial: "P", stars: 5, time: "3 weeks ago", text: "The title memo was a revelation — we understood everything about the property before we signed. Rare to find this level of care in Indian real estate." },
    { name: "Rohit Sandhu",     initial: "R", stars: 5, time: "1 month ago", text: "The team found us a kothi in Sector 91 that wasn't on any portal. Their relationships and market knowledge are clearly exceptional." },
    { name: "Neha Bedi",        initial: "N", stars: 5, time: "5 days ago",  text: "From the UK we trusted them blind for our NRI investment. The quarterly photographic reports and rental management have been faultless." },
    { name: "Karan Gupta",      initial: "K", stars: 5, time: "2 weeks ago", text: "Walked in for one plot, walked out understanding the entire Mohali market. Honest, patient, no hard sell — only counsel." },
    { name: "Sunita Puri",      initial: "S", stars: 5, time: "1 month ago", text: "Three transactions with Third Rock Realty now. Their word is genuinely their bond. Wouldn't dream of going elsewhere." },
    { name: "Vikram Ahuja",     initial: "V", stars: 5, time: "6 weeks ago", text: "The investment memo for our Sector 67 SCO was the kind of due diligence I'd expect from a top-tier law firm. Beautifully laid out." },
    { name: "Ananya Rana",      initial: "A", stars: 5, time: "3 months ago", text: "The quietest, classiest property desk in the tri-city. They place capital, they don't sell square feet." },
    { name: "Manjit Bhullar",   initial: "M", stars: 5, time: "4 months ago", text: "GMADA plot paperwork can be a nightmare. The desk handled mutation, dues and conveyance without me having to step into an office once." },
    { name: "Rachna Chopra",    initial: "R", stars: 5, time: "7 weeks ago", text: "We were first-time buyers, hopelessly out of our depth. The team walked us through a fard, a sanction and a registry without making us feel small." },
    { name: "Tarun Bhasin",     initial: "T", stars: 5, time: "2 months ago", text: "A discreet desk that actually means it — our purchase never reached a public portal. Off-market mandate matched within four working hours." },
    { name: "Simran Kaur",      initial: "S", stars: 5, time: "5 weeks ago",  text: "The level of polish is unusual for the industry. Memos arrive ahead of the asking price; titles arrive at the closing table already clean." },
  ];
  const half = Math.ceil(all.length / 2);
  const row1 = all.slice(0, half);
  const row2 = all.slice(half);
  return (
    <section id="reviews" className="reviews">
      <div className="container">
        <header className="reviews-head">
          <div className="reviews-eyebrow">
            <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M43.6 20.5H42V20.4H24v7.1h11.3c-1.5 4.2-5.5 7.1-11.3 7.1-6.8 0-12.3-5.5-12.3-12.3S17.2 10 24 10c3.1 0 5.9 1.2 8 3.1l5-5C33.6 4.6 29 2.5 24 2.5 12.2 2.5 2.5 12.2 2.5 24S12.2 45.5 24 45.5c11.8 0 21.5-9.7 21.5-21.5 0-1.2-.1-2.3-.4-3.5z"/>
              <path fill="#34A853" d="M4.7 13.3l5.9 4.3C12.4 14 17.8 10 24 10c3.1 0 5.9 1.2 8 3.1l5-5C33.6 4.6 29 2.5 24 2.5 16.4 2.5 9.9 6.8 4.7 13.3z"/>
              <path fill="#FBBC05" d="M24 45.5c5 0 9.6-1.7 13.2-4.9l-6.1-5c-2 1.5-4.5 2.4-7.1 2.4-5.7 0-10.4-3.7-12.1-8.9l-6 4.6C9 41.5 16 45.5 24 45.5z"/>
              <path fill="#EA4335" d="M43.6 20.5H42V20.4H24v7.1h11.3c-.7 2-2 3.8-3.7 5l6.1 5c-.4.4 6.7-4.9 6.7-14.5 0-1.2-.1-2.3-.4-3.5z"/>
            </svg>
            <span>Google · 5.0 / 5 · 42 reviews</span>
          </div>
          <h2 className="reviews-title">What the <em>desk</em> hears.</h2>
          <p className="reviews-sub">Verified clients across Mohali, Chandigarh, Zirakpur and beyond. Quiet, considered, no fanfare.</p>
        </header>
      </div>
      <div className="reviews-row reviews-row-l">
        <div className="reviews-track">
          {[...row1, ...row1].map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
      <div className="reviews-row reviews-row-r">
        <div className="reviews-track">
          {[...row2, ...row2].map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
    </section>
  );
}
function ReviewCard({ r }) {
  return (
    <article className="rv-card">
      <div className="rv-quote">"</div>
      <p className="rv-text">{r.text}</p>
      <div className="rv-foot">
        <div className="rv-avatar">{r.initial}</div>
        <div className="rv-id">
          <div className="rv-name">{r.name}</div>
          <div className="rv-time">{r.time} · Mohali</div>
        </div>
        <div className="rv-stars" aria-label={r.stars + " stars"}>
          {Array.from({ length: r.stars }).map((_, i) => (
            <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#1a6fd4"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1z"/></svg>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ───────────────────── Journal (legacy — unused) ───────────────────── */
function Journal() {
  const notes = [
    { tag: "Note · Field", date: "06 / 26", title: "Sector 79 — the quiet inflection point.", snip: "Three closed mandates in eight weeks suggest the floor has moved. Where the next ₹1.4 Cr buys you, and where we would not." },
    { tag: "Note · Title", date: "05 / 26", title: "Reading a fard before the broker does.", snip: "A working memo on jamabandi for first-time buyers in Punjab — and the three lines we always check first." },
    { tag: "Note · Hold",  date: "04 / 26", title: "Plot or builder floor — the long view.", snip: "An honest five-year frame for HNI buyers weighing land against vertical inventory in the tri-city micro-markets." },
  ];
  return (
    <section className="journal">
      <div className="container">
        <div className="journal-head">
          <div>
            <div className="folio-eyebrow">Journal · From the desk</div>
            <h2 className="journal-title">Notes from the <em>desk</em>.</h2>
          </div>
          <p className="journal-sub">Working memos and field observations from the Mohali tri-city. Quarterly, occasionally more often. Plain language, no listings.</p>
        </div>
        <div className="journal-grid">
          {notes.map((n, i) => (
            <article key={i} className="j-card">
              <div className="j-meta">
                <span className="j-tag">{n.tag}</span>
                <span>{n.date}</span>
              </div>
              <h3 className="j-h">{n.title}</h3>
              <p className="j-snip">{n.snip}</p>
              <div className="j-cta">Read the memo <span>→</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── About (legacy — unused) ───────────────────── */
function About() {
  return (
    <section id="about" style={{ paddingTop: 100, paddingBottom: 60 }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "flex-start" }}>
        <div className="about-photo-col" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 360, width: "100%", justifySelf: "start" }}>
          <div className="gs-wrap" style={{ aspectRatio: "4/5", borderRadius: 999, overflow: "hidden", position: "relative", background: "#1a1714", width: "100%" }}>
            <div className="gs" style={{ position: "absolute", inset: 0, backgroundImage: "url(assets/sachdeva-about.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
          </div>

          <div style={{ border: "1px solid var(--line)", borderRadius: 6, padding: "20px 22px", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div>
              <div className="clash" style={{ fontSize: 19, letterSpacing: "-0.02em", fontWeight: 600, lineHeight: 1.1 }}>Third Rock Realty</div>
              <div className="uc" style={{ fontSize: 10, color: "var(--mute)", letterSpacing: "0.16em", marginTop: 6 }}>Real Estate Agency · Mohali</div>
            </div>
            <svg width="74" height="40" viewBox="0 0 120 60" fill="none" aria-hidden="true">
              <path d="M6 42 C 18 18, 28 18, 32 36 C 36 50, 42 18, 50 30 C 56 38, 60 22, 66 32 C 72 42, 78 26, 84 34 C 90 42, 98 30, 110 26" stroke="#f4ede3" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M58 46 L 102 46" stroke="#f4ede3" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Third+Rock+Realty+SCO+1+Sector+79+SAS+Nagar"
            target="_blank" rel="noopener noreferrer"
            onClick={(e) => { e.preventDefault(); window.open("https://www.google.com/maps/search/?api=1&query=Third+Rock+Realty+SCO+1+Sector+79+SAS+Nagar", "_blank", "noopener,noreferrer"); }}
            className="gs-wrap"
            style={{ position: "relative", display: "block", aspectRatio: "16/10", borderRadius: 6, overflow: "hidden", background: "#1e1e1e" }}
          >
            <div className="gs" style={{ position: "absolute", inset: 0, backgroundImage: "url(assets/sachdeva-about.jpg)", backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(0.2)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)" }} />
            <div style={{ position: "absolute", left: 16, right: 16, bottom: 14, color: "#f6f6f6", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
              <div>
                <div className="uc" style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.8 }}>The Office</div>
                <div className="clash" style={{ fontSize: 15, letterSpacing: "-0.02em", marginTop: 4, fontWeight: 600 }}>SCO 1, 2nd Floor · Sector 79 · SAS Nagar</div>
              </div>
              <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", border: "1px solid rgba(246,246,246,0.5)", padding: "6px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>Get directions →</div>
            </div>
          </a>
        </div>

        <div>
          <div className="uc" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--mute)", marginBottom: 24 }}>◇ About Us</div>
          <p className="clash" style={{ fontSize: "clamp(24px, 3.6vw, 48px)", letterSpacing: "-0.035em", lineHeight: 1.15, margin: 0, fontWeight: 500 }}>
            Third Rock Realty is a <span className="serif-it">GMADA</span> empanelled and <span className="serif-it">RERA</span> registered firm specializing in residential, commercial and land mandates across the Mohali tri-city. Operating from SCO 1, 2nd Floor in Sector 79.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, marginTop: 36, borderTop: "1px solid var(--line)", paddingTop: 28 }}>
            <Credit k="Practice" v="Residential · Commercial · Land" />
            <Credit k="Coverage" v="Mohali · Chandigarh · Zirakpur · Kharar · New Chandigarh" />
            <Credit k="Empanelment" v="GMADA · JLPL · PUDA" />
            <Credit k="Regulatory" v="PB-RERA Registered" />
          </div>
          <div style={{ marginTop: 36, borderTop: "1px solid var(--line)", paddingTop: 24, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div className="uc" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--mute)" }}>As featured at</div>
            <div className="clash" style={{ fontSize: 16, letterSpacing: "-0.02em", fontWeight: 600 }}>The Tribune Real Estate Conclave</div>
            <div style={{ fontSize: 13, color: "var(--mute)" }}>2025</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Credit({ k, v }) {
  return (
    <div>
      <div className="uc" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mute)", marginBottom: 8 }}>{k}</div>
      <div style={{ fontSize: 15, color: "var(--ink-2)" }}>{v}</div>
    </div>
  );
}

/* ───────────────────── Desk Banner (was ContactBanner) ───────────────────── */
function DeskBanner() {
  const openBook = () => window.RS_openBooking && window.RS_openBooking();
  return (
    <section id="contact" className="desk">
      <div className="container">
        <div className="desk-grid">
          <h2 className="desk-title">Let us <em>begin.</em></h2>
          <div className="desk-card">
            <div className="desk-eyebrow">Speak to the desk</div>
            <div className="desk-row">
              <div className="desk-row-k">Direct line</div>
              <div className="desk-row-v"><a href="tel:+91XXXXXXXXXX">+91 XXXXX XXXXX</a></div>
            </div>
            <div className="desk-row">
              <div className="desk-row-k">By message</div>
              <div className="desk-row-v"><a href="mailto:info@thirdrockrealty.in">info@thirdrockrealty.in</a></div>
            </div>
            <div className="desk-row">
              <div className="desk-row-k">In person</div>
              <div className="desk-row-v">SCO 1, 2nd Floor<br/>Sector 79 · SAS Nagar · Punjab · 140308</div>
            </div>
            <button onClick={openBook} className="desk-button">
              Schedule a viewing →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Footer Masthead (was Footer) ───────────────────── */
function FooterMast() {
  return (
    <footer className="foot">
      <div className="container">
        <h2 className="foot-mast">Third Rock <em>Realty</em></h2>
        <div className="foot-cols">
          <div>
            <div className="foot-h">The Desk</div>
            <ul className="foot-list">
              <li><a href="tel:+91XXXXXXXXXX">+91 XXXXX XXXXX</a></li>
              <li><a href="mailto:info@thirdrockrealty.in">info@thirdrockrealty.in</a></li>
              <li><span>SCO 1, 2nd Floor</span></li>
              <li><span>Sector 79 · SAS Nagar · 140308</span></li>
            </ul>
          </div>
          <div>
            <div className="foot-h">Practice</div>
            <ul className="foot-list">
              <li><a href="#practice">Residential</a></li>
              <li><a href="#practice">Commercial</a></li>
              <li><a href="#practice">Land & Plots</a></li>
              <li><a href="#practice">Investment Advisory</a></li>
              <li><a href="#practice">NRI Services</a></li>
              <li><a href="#practice">Title & Due Diligence</a></li>
            </ul>
          </div>
          <div>
            <div className="foot-h">Navigate</div>
            <ul className="foot-list">
              <li><a href="#top">Hero</a></li>
              <li><a href="#folio">Folio</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#practice">Practice</a></li>
              <li><a href="#about">The Principal</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="foot-h">Elsewhere</div>
            <ul className="foot-list">
              <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              <li><a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer">WhatsApp · Direct line</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-mark">
            <Crown />
            <span>© 2026 Third Rock Realty · All rights reserved</span>
          </div>
          <div>PB-RERA · GMADA · JLPL Empanelled</div>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────── Legacy ContactBanner (unused) ───────────────────── */
function ContactBanner() {
  return (
    <section id="contact" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ borderTop: "1px solid var(--ink-2)", paddingTop: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap" }}>
          <div>
            <div className="uc" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--mute)", marginBottom: 24 }}>◇ Speak to the desk</div>
            <h2 className="clash" style={{ fontSize: "clamp(48px, 9vw, 152px)", letterSpacing: "-0.06em", margin: 0, lineHeight: 0.9, fontWeight: 700 }}>
              <Echo size="clamp(48px, 9vw, 152px)">Let's talk.</Echo>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
            <a href="tel:+91XXXXXXXXXX" className="clash" style={{ fontSize: "clamp(22px,3.5vw,28px)", letterSpacing: "-0.02em", fontWeight: 600 }}>+91 XXXXX XXXXX</a>
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, color: "var(--mute)" }}>WhatsApp · +91 XXXXX XXXXX</a>
            <a href="mailto:info@thirdrockrealty.in" className="uc" style={{ fontSize: 11, letterSpacing: "0.16em", marginTop: 8, borderBottom: "1px solid var(--ink)", paddingBottom: 4 }}>
              info@thirdrockrealty.in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── Footer ───────────────────── */
function Footer() {
  return (
    <footer style={{ background: "var(--dark)", color: "rgba(246,246,246,0.6)", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 40 }}>
      <div className="container" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 56 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Crown dark />
              <div className="clash" style={{ color: "#f6f6f6", fontSize: 20, letterSpacing: "-0.03em" }}>Third Rock Realty</div>
            </div>
            <p style={{ marginTop: 20, fontSize: 14, lineHeight: 1.65, maxWidth: 300 }}>
              Real estate agency & property experts in the Mohali tri-city. GMADA/RERA accredited. SCO 1, 2nd Floor, Sector 79, SAS Nagar, Punjab 140308.
            </p>
          </div>
          <FooterCol head="Navigate" links={[["Portfolio", "#portfolio"], ["Practice", "#practice"], ["Services", "#insights"], ["About", "#about"]]} />
          <FooterCol head="Practice" links={[["Residential", "#"], ["Commercial", "#"], ["Land & Plots", "#"], ["NRI Services", "#"]]} />
          <FooterCol head="Contact" links={[
            [<span><IconPhone/> +91 XXXXX XXXXX</span>, "tel:+91XXXXXXXXXX"],
            [<span><IconMail/> info@thirdrockrealty.in</span>, "mailto:info@thirdrockrealty.in"],
            [<span><IconPin/> SCO 1, Sector 79, SAS Nagar</span>, "#"],
            [<span><IconInsta/> @thirdrockrealty</span>, "#"],
            [<span><IconYouTube/> @thirdrockrealty</span>, "#"],
          ]} />
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div className="uc" style={{ fontSize: 10, letterSpacing: "0.18em" }}>© 2026 Third Rock Realty — All rights reserved</div>
          <div className="uc" style={{ fontSize: 10, letterSpacing: "0.18em" }}>PB-RERA · GMADA · JLPL Empanelled</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ head, links }) {
  return (
    <div>
      <div className="uc" style={{ fontSize: 10, letterSpacing: "0.18em", color: "#f6f6f6", marginBottom: 18 }}>{head}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map(([label, href], i) => (
          <li key={i}>
            <a href={href} style={{ fontSize: 14, color: "rgba(246,246,246,0.6)", display: "inline-flex", alignItems: "center", gap: 10, transition: "color 200ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f6f6f6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(246,246,246,0.6)")}
            >{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconPhone() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: "-2px", marginRight: 8 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" /></svg> }
function IconMail() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: "-2px", marginRight: 8 }}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg> }
function IconPin() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: "-2px", marginRight: 8 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg> }
function IconInsta() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: "-2px", marginRight: 8 }}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg> }
function IconYouTube() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ verticalAlign: "-2px", marginRight: 8 }}><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" /></svg> }

/* ───────────────────── Instagram Float ───────────────────── */
function InstagramFab() {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      target="_blank" rel="noopener noreferrer"
      aria-label="Follow on Instagram"
      className="ig-fab"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "fixed", right: 24, bottom: 92, zIndex: 55, display: "inline-flex", alignItems: "center", gap: 12, padding: hover ? "14px 22px 14px 14px" : 14, height: 56, borderRadius: 999, background: "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)", color: "#ffffff", boxShadow: "0 12px 32px rgba(17,17,17,0.22), 0 2px 6px rgba(17,17,17,0.12)", transition: "padding 300ms cubic-bezier(0.77,0,0.175,1), transform 300ms cubic-bezier(0.77,0,0.175,1)", transform: hover ? "translateY(-2px)" : "translateY(0)", whiteSpace: "nowrap", overflow: "hidden" }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" stroke="#ffffff" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.4" stroke="#ffffff" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="#ffffff" />
      </svg>
      <span className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", fontWeight: 700, maxWidth: hover ? 200 : 0, opacity: hover ? 1 : 0, transition: "max-width 300ms cubic-bezier(0.77,0,0.175,1), opacity 200ms ease" }}>
        Follow on Instagram
      </span>
    </a>
  );
}

/* ───────────────────── WhatsApp Float ───────────────────── */
function WhatsAppFab() {
  const [hover, setHover] = useState(false);
  const phone = "91XXXXXXXXXX";
  const text = encodeURIComponent("Hello Third Rock Realty — I would like to enquire about a property listing.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank" rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="wa-fab"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "fixed", right: 24, bottom: 24, zIndex: 55, display: "inline-flex", alignItems: "center", gap: 12, padding: hover ? "14px 22px 14px 14px" : 14, height: 56, borderRadius: 999, background: "#25D366", color: "#ffffff", boxShadow: "0 12px 32px rgba(17,17,17,0.22), 0 2px 6px rgba(17,17,17,0.12)", transition: "padding 300ms cubic-bezier(0.77,0,0.175,1), transform 300ms cubic-bezier(0.77,0,0.175,1)", transform: hover ? "translateY(-2px)" : "translateY(0)", whiteSpace: "nowrap", overflow: "hidden" }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path fill="#ffffff" d="M16.04 4C9.42 4 4.04 9.38 4.04 16c0 2.11.55 4.18 1.6 6L4 28l6.16-1.6A11.94 11.94 0 0 0 16.04 28C22.66 28 28.04 22.62 28.04 16S22.66 4 16.04 4Zm0 21.6c-1.78 0-3.52-.48-5.04-1.4l-.36-.22-3.66.96.98-3.56-.24-.38a9.6 9.6 0 1 1 8.32 4.6Zm5.5-7.18c-.3-.16-1.78-.88-2.06-.98-.28-.1-.48-.16-.68.16s-.78.98-.96 1.18c-.18.2-.36.22-.66.08-.3-.16-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.06c-.18-.3 0-.46.14-.62.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.2.05-.38-.02-.54-.08-.16-.68-1.64-.94-2.24-.24-.58-.5-.5-.68-.5l-.58-.02c-.2 0-.54.08-.82.38s-1.08 1.06-1.08 2.58c0 1.52 1.1 3 1.26 3.2.16.2 2.18 3.32 5.3 4.66.74.32 1.32.5 1.78.66.74.24 1.42.2 1.96.12.6-.08 1.78-.72 2.04-1.42.26-.7.26-1.3.18-1.42-.08-.12-.28-.2-.58-.34Z" />
      </svg>
      <span className="uc" style={{ fontSize: 12, letterSpacing: "0.14em", fontWeight: 700, maxWidth: hover ? 200 : 0, opacity: hover ? 1 : 0, transition: "max-width 300ms cubic-bezier(0.77,0,0.175,1), opacity 200ms ease" }}>
        Chat on WhatsApp
      </span>
    </a>
  );
}

/* ───────────────────── App ───────────────────── */
function App() {
  // Read URL params synchronously on the very first render so a deep-link
  // never flashes the tunnel or the home page behind the takeover
  const initial = useMemo(() => {
    if (typeof window === "undefined") return { intro: false, active: null, category: null };
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("property");
    const cat = params.get("category");
    const propsArr = window.RS_PROPERTIES || window.JP_PROPERTIES || [];
    const p = pid ? propsArr.find((x) => x.id === pid || x.code === pid) : null;
    return { intro: !!(p || cat), active: p || null, category: cat || null };
  }, []);
  const [active, setActive] = useState(initial.active);
  const [introPlayed, setIntroPlayed] = useState(initial.intro);
  const [booking, setBooking] = useState(false);
  const [category, setCategory] = useState(initial.category);
  const props = window.RS_PROPERTIES || window.JP_PROPERTIES || [];

  // Global helpers
  useEffect(() => {
    window.RS_openBooking = () => setBooking(true);
    window.RS_openCategory = (id) => setCategory(id);
    return () => { delete window.RS_openBooking; delete window.RS_openCategory; };
  }, []);

  // Deep-link initial state is set above via useMemo so no flash. Nothing to do here.

  return (
    <>
      {!introPlayed && IntroTunnel && <IntroTunnel onDone={() => { setIntroPlayed(true); window.scrollTo(0, 0); }} />}
      <Cursor />
      <Nav onContact={() => setBooking(true)} />
      <Hero active={introPlayed} />
      <FieldNotes />
      <Reveal as="div"><Folio properties={props} onCategory={setCategory} /></Reveal>
      <Reveal as="div"><Portfolio properties={props} onOpen={setActive} /></Reveal>
      <Reveal as="div"><Principal /></Reveal>
      <Press />
      <Reveal as="div"><Reviews /></Reveal>
      <Reveal as="div"><DeskBanner /></Reveal>
      <FooterMast />
      <DetailSheet p={active} onClose={() => setActive(null)} />
      {BookingModal && <BookingModal open={booking} onClose={() => setBooking(false)} />}
      {CategoryPage && <CategoryPage category={category} onClose={() => setCategory(null)} onOpen={(p) => setActive(p)} />}
      {PropertyAI && <PropertyAI onSchedule={() => setBooking(true)} />}
      <InstagramFab />
      <WhatsAppFab />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
