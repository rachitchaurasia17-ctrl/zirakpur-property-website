/* ───────────────────── CategoryPage ─────────────────────
   Full-screen takeover. Lists all properties in a category,
   filterable by city. Click a card → opens DetailSheet.
*/

const CATEGORY_DEFS = {
  Residential: {
    title: "Residential",
    sub:   "Kothis, builder floors & villas",
    desc:  "Independent kothis, builder floors and villas across the Mohali tri-city. Walk-in ready, title-clean, personally inspected by the desk.",
    match: (p) => p.type === "Residential" && !/apartment|penthouse|flat/i.test(p.subType || ""),
  },
  Apartments: {
    title: "Apartments",
    sub:   "Apartments & penthouses",
    desc:  "Premium apartments and penthouses in the highest-demand pockets of Mohali and Chandigarh — across new and resale stock.",
    match: (p) => p.type === "Residential" && /apartment|penthouse|flat/i.test(p.subType || ""),
  },
  Commercial: {
    title: "Commercial",
    sub:   "SCOs, showrooms & offices",
    desc:  "SCOs, showrooms, office space and built-to-suit. Owner-side sell mandates and tenant fit-out advisory.",
    match: (p) => p.type === "Commercial",
  },
  Plots: {
    title: "Plots & Land",
    sub:   "GMADA · JLPL · PUDA",
    desc:  "Allotted plots in GMADA, JLPL and PUDA colonies — residential and industrial. Allotment, dues and conveyance handled in-house.",
    match: (p) => p.type === "Plot",
  },
};

const CITY_LIST = ["All", "Mohali", "Chandigarh", "Zirakpur", "Kharar", "New Chandigarh"];

function CategoryPage({ category, onClose, onOpen }) {
  const open = !!category;
  const [city, setCity] = React.useState("All");
  // Whether this page was opened by deep-link (?category=...) — back button should navigate, not close overlay
  const deepLinked = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("category") != null;
  }, []);
  const handleClose = () => {
    if (deepLinked) { window.location.href = window.location.pathname; return; }
    onClose && onClose();
  };

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  React.useEffect(() => { if (open) { setCity("All"); window.scrollTo(0, 0); } }, [open, category]);

  // Continue rendering data from the last category during the close transition
  const lastRef = React.useRef(category);
  if (category) lastRef.current = category;
  const def = lastRef.current && CATEGORY_DEFS[lastRef.current];

  const all = (window.RS_PROPERTIES || []).filter((p) => def ? def.match(p) : false);
  const visible = all.filter((p) => city === "All" || (p.locality && p.locality.toLowerCase().includes(city.toLowerCase())));

  return (
    <>
      <div className={"cp-scrim " + (open ? "open" : "")} onClick={handleClose} />
      <div className={"cp-shell " + (open ? "open" : "")} role="dialog" aria-label={def ? def.title + " listings" : ""}>
        {def && (
          <>
            <div className="cp-bar">
              <button className="cp-back" onClick={handleClose} aria-label="Back to home">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Back to home</span>
              </button>
              <div className="cp-bar-mid">{def.title} · {all.length} mandate{all.length === 1 ? "" : "s"}</div>
              <button className="cp-close" aria-label="Close" onClick={handleClose}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>

            <header className="cp-hero">
              <div className="cp-hero-rule" />
              <div className="cp-eyebrow">
                <span className="cp-rule"/>
                {def.sub}
              </div>
              <h1 className="cp-title">
                The {def.title.toLowerCase().split(" ")[0]} <em>desk.</em>
              </h1>
              <p className="cp-desc">{def.desc}</p>
            </header>

            <div className="cp-filter-wrap">
              <div className="cp-filter-label">Filter · City</div>
              <div className="cp-cities">
                {CITY_LIST.map((c) => {
                  const count = c === "All" ? all.length : all.filter((p) => p.locality && p.locality.toLowerCase().includes(c.toLowerCase())).length;
                  const active = city === c;
                  const disabled = count === 0 && c !== "All";
                  return (
                    <button
                      key={c}
                      disabled={disabled}
                      onClick={() => setCity(c)}
                      className={"cp-city " + (active ? "active " : "") + (disabled ? "off " : "")}
                    >
                      {c}
                      <span className="cp-city-n">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {visible.length > 0 ? (
              <div className="cp-grid">
                {visible.map((p) => (
                  <button key={p.id} className="cp-card" onClick={() => window.open("?property=" + p.id, "_blank", "noopener")}>
                    <div className="cp-card-frame" style={{ backgroundImage: `url(${p.hero})` }} />
                    <div className="cp-card-body">
                      <div className="cp-card-meta">
                        <span className="cp-card-code">{p.code}</span>
                        <span className="cp-card-sub">{p.subType}</span>
                      </div>
                      <h3 className="cp-card-title">{p.title}</h3>
                      <div className="cp-card-loc">{p.locality}</div>
                      <div className="cp-card-stats">
                        {p.bedrooms != null && <span><strong>{p.bedrooms}</strong> BR</span>}
                        {p.builtUp && p.builtUp !== "—" && <span><strong>{p.builtUp.split(" ")[0]}</strong> Sq.Ft.</span>}
                        {p.plotSize && p.plotSize !== "—" && <span><strong>{p.plotSize.split(" ")[0]}</strong> Sq.Yd.</span>}
                        <span><strong>{p.facing || "—"}</strong></span>
                      </div>
                      <div className="cp-card-foot">
                        <span className="cp-card-price">{p.price}</span>
                        <span className="cp-card-cta">Open memo <span>→</span></span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="cp-empty">
                <div className="cp-empty-mark">◇</div>
                <div className="cp-empty-eyebrow">Off-market only</div>
                <h3 className="cp-empty-title">No open {def.title.toLowerCase()} mandates in {city} at present.</h3>
                <p className="cp-empty-body">
                  Roughly two-thirds of our inventory never reaches a public portal. Speak to the desk and we'll match a private mandate within forty-eight hours.
                </p>
                <div className="cp-empty-row">
                  <a href="tel:+918968017508" className="cp-empty-cta">Call the desk · +91 89680 17508</a>
                  <button className="cp-empty-cta-2" onClick={() => setCity("All")}>Show all {def.title.toLowerCase()}</button>
                </div>
              </div>
            )}

            <footer className="cp-foot">
              <div className="cp-foot-eyebrow">◇ Off-market list available on request</div>
              <button onClick={() => { onClose(); setTimeout(() => window.RS_openBooking && window.RS_openBooking(), 350); }} className="cp-foot-cta">
                Schedule a viewing →
              </button>
            </footer>
          </>
        )}
      </div>
    </>
  );
}

window.CategoryPage = CategoryPage;
