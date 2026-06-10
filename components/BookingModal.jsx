/* ───────────────────── BookingModal ─────────────────────
   Three-pane "Schedule a Viewing" experience — calendar,
   time/interest, live summary. Submits to a (mock) endpoint;
   replace BOOKING_WEBHOOK to wire to email/Notion/Google Sheets.
*/

const BOOKING_WEBHOOK = ""; // optional: paste a Formspree/Make URL

const TIME_SLOTS = [
  { label: "10:00 AM", busy: false },
  { label: "11:30 AM", busy: false },
  { label: "01:00 PM", busy: false },
  { label: "02:30 PM", busy: true },
  { label: "04:00 PM", busy: false },
  { label: "05:30 PM", busy: false },
];

const INTERESTS = [
  "Residential", "Commercial", "Plot / Land",
  "Investment Advisory", "NRI Services", "Off-market",
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function startOfMonth(y, m) { return new Date(y, m, 1); }
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function sameDay(a, b) { return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function fmtLong(d) { return d ? `${DOW[d.getDay()].slice(0,3)} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` : "—"; }

function BookingModal({ open, onClose }) {
  const today = React.useMemo(() => { const t = new Date(); t.setHours(0,0,0,0); return t; }, []);
  const [cursor, setCursor] = React.useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = React.useState(null);
  const [time, setTime] = React.useState(null);
  const [interest, setInterest] = React.useState(["Residential"]);
  const [form, setForm] = React.useState({ name: "", phone: "+91 ", email: "", notes: "" });
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  React.useEffect(() => { if (open) { setSent(false); setError(""); } }, [open]);

  if (!open && !sent) {
    // continue rendering during close transition only when there's something to fade
  }

  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const firstDow = startOfMonth(y, m).getDay();
  const dim = daysInMonth(y, m);
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(new Date(y, m, d));

  const isPast = (d) => d < today;
  const isSunday = (d) => d.getDay() === 0;
  // Deterministic "full" days: ~12% busy, based on date
  const isFull = (d) => !isPast(d) && !isSunday(d) && ((d.getDate() * 7 + d.getMonth() * 13) % 8 === 0);

  const canPrev = !(y === today.getFullYear() && m === today.getMonth());
  const goPrev = () => canPrev && setCursor(new Date(y, m - 1, 1));
  const goNext = () => setCursor(new Date(y, m + 1, 1));

  const toggleInterest = (it) => setInterest((arr) => arr.includes(it) ? arr.filter(x => x !== it) : [...arr, it]);

  const canSubmit = date && time && form.name.trim() && form.phone.trim().length >= 8 && !sending;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true); setError("");
    const payload = {
      date: fmtLong(date),
      time, interest, ...form,
      submittedAt: new Date().toISOString(),
    };
    try {
      if (BOOKING_WEBHOOK) {
        await fetch(BOOKING_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      setSent(true);
    } catch (err) {
      setError("Could not reach the desk. Please call +91 XXXXX XXXXX.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className={"bm-scrim " + (open ? "open" : "")} onClick={onClose} />
      <div className={"bm-shell " + (open ? "open" : "")} role="dialog" aria-label="Schedule a viewing">
        <header className="bm-head">
          <div>
            <div className="bm-eyebrow"><span className="bm-rule"/>Third Rock Realty · Reservation Desk</div>
            <div className="bm-title">Schedule a Viewing</div>
          </div>
          <div className="bm-head-actions">
            <div className="bm-pill"><span className="bm-pulse"/> Desk open · 09:00 – 19:00</div>
            <button className="bm-close" aria-label="Close" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
        </header>

        {sent ? (
          <div className="bm-success">
            <div className="bm-check">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="bm-eyebrow"><span className="bm-rule"/>Confirmed</div>
            <h2 className="bm-success-title">Your slot is held.</h2>
            <p className="bm-success-body">
              We've reserved <strong>{time}</strong> on <strong>{fmtLong(date)}</strong>. The desk will revert within four working hours with directions and the property memo.
            </p>
            <div className="bm-success-ref">Reference · TRR-{Math.floor(Math.random()*9000+1000)}-{(date && date.getDate()) || "00"}</div>
            <button className="bm-cta" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="bm-grid" onSubmit={submit}>
            {/* ─── Column 1: Date ─── */}
            <section className="bm-col">
              <div className="bm-step-watermark">01</div>
              <div className="bm-eyebrow"><span className="bm-rule"/>Step One</div>
              <h2 className="bm-h">Select a date</h2>

              <div className="bm-cal-head">
                <div className="bm-cal-month">{MONTHS[m]} {y}</div>
                <div className="bm-cal-nav">
                  <button type="button" onClick={goPrev} disabled={!canPrev} aria-label="Previous month">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button type="button" onClick={goNext} aria-label="Next month">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>

              <div className="bm-cal-dow">
                {DOW.map((d) => <div key={d}>{d.slice(0,3)}</div>)}
              </div>
              <div className="bm-cal-grid">
                {cells.map((d, i) => {
                  if (!d) return <div key={i} className="bm-cell empty" />;
                  const past = isPast(d);
                  const sun = isSunday(d);
                  const full = isFull(d);
                  const disabled = past || sun || full;
                  const isSel = sameDay(d, date);
                  const isToday = sameDay(d, today);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      onClick={() => setDate(d)}
                      className={"bm-cell " + (disabled ? "off " : "") + (isSel ? "sel " : "") + (isToday ? "today " : "")}
                    >
                      {d.getDate()}
                      {full && !isSel && <span className="bm-cell-dot full"/>}
                      {isToday && !isSel && <span className="bm-cell-dot today"/>}
                    </button>
                  );
                })}
              </div>
              <div className="bm-legend">
                <span><span className="lg-dot sel"/> Selected</span>
                <span><span className="lg-dot ok"/> Available</span>
                <span><span className="lg-dot full"/> Full</span>
                <span><span className="lg-dot off"/> Closed</span>
              </div>
            </section>

            {/* ─── Column 2: Time + Interest + Details ─── */}
            <section className="bm-col bm-col-mid">
              <div className="bm-step-watermark">02</div>
              <div className="bm-eyebrow"><span className="bm-rule"/>Step Two</div>
              <h2 className="bm-h">Pick a time</h2>

              <div className="bm-time-grid">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    disabled={t.busy || !date}
                    onClick={() => setTime(t.label)}
                    className={"bm-time " + (time === t.label ? "sel " : "") + (t.busy ? "busy " : "")}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="bm-eyebrow bm-eyebrow-mt"><span className="bm-rule"/>Interest</div>
              <div className="bm-tags">
                {INTERESTS.map((it) => (
                  <button
                    key={it}
                    type="button"
                    onClick={() => toggleInterest(it)}
                    className={"bm-tag " + (interest.includes(it) ? "sel " : "")}
                  >{it}</button>
                ))}
              </div>

              <div className="bm-eyebrow bm-eyebrow-mt"><span className="bm-rule"/>Your details</div>
              <div className="bm-fields">
                <Field label="Full name" v={form.name} onChange={(v) => setForm({...form, name: v})} placeholder="As it appears on your registration" />
                <Field label="Phone" v={form.phone} onChange={(v) => setForm({...form, phone: v})} type="tel" />
                <Field label="Email (optional)" v={form.email} onChange={(v) => setForm({...form, email: v})} type="email" />
                <Field label="Notes" textarea v={form.notes} onChange={(v) => setForm({...form, notes: v})} placeholder="Anything we should know — budget, holding period, comparables seen…" />
              </div>
            </section>

            {/* ─── Column 3: Summary ─── */}
            <aside className="bm-col bm-col-summary">
              <div className="bm-step-watermark">03</div>
              <div className="bm-eyebrow"><span className="bm-rule"/>Reservation summary</div>
              <h2 className="bm-h">Your visit</h2>

              <Row k="Date"     v={fmtLong(date)} />
              <Row k="Time"     v={time || "—"} />
              <Row k="Interest" v={interest.length ? interest.join(", ") : "—"} />
              <Row k="Office"   v="SCO 1, 2nd Floor · Sector 79 · SAS Nagar" />
              <Row k="Duration" v="~45 minutes" />
              <Row k="Fee"      v={<span className="bm-comp">Complimentary</span>} />

              <p className="bm-note">
                A viewing is held by appointment. The desk confirms within four working hours with directions and the property memo.
              </p>

              {error && <div className="bm-error">{error}</div>}

              <button type="submit" disabled={!canSubmit} className="bm-cta">
                {sending ? "Holding your slot…" : "Confirm Reservation →"}
              </button>
              <a href="tel:+91XXXXXXXXXX" className="bm-call">Or call the desk · +91 XXXXX XXXXX</a>
            </aside>
          </form>
        )}
      </div>
    </>
  );
}

function Field({ label, v, onChange, type = "text", textarea, placeholder }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="bm-field">
      <span className="bm-field-label">{label}</span>
      <Tag
        type={type}
        rows={textarea ? 3 : undefined}
        value={v}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bm-input"
      />
    </label>
  );
}

function Row({ k, v }) {
  return (
    <div className="bm-row">
      <div className="bm-row-k">{k}</div>
      <div className="bm-row-v">{v}</div>
    </div>
  );
}

window.BookingModal = BookingModal;
