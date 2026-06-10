/* ───────────────────── IntroTunnel ─────────────────────
   Full-screen cinematic 3D fly-through intro.

   Sequence:
     1. 'flying'  — camera flies through a box room tiled with
                    brand typography (no centre lockup yet).
     2. 'reveal'  — tunnel ends on a clean screen; the
                    THIRD ROCK REALTY lockup fades in
                    and holds.
     3. 'out'     — the whole thing dissolves (fade + scale +
                    blur) into the landing page.
     4. 'gone'    — unmounts and calls onDone().

   Customised for THIRD ROCK REALTY (blue room, brand phrase).
*/

/* ── CONSTANTS (tune per client) ── */
const DEPTH = 2600;            // room length in px
const DURATION = 1800;         // flight duration in ms (shortened so the lockup lands sooner)
const REVEAL_HOLD = 1200;      // brand hold before the page is revealed (ms)
const PHRASE = 'THIRD ROCK REALTY · '; // tiled on all 4 walls
const ROWS = 8;                // text rows per wall (denser = less whitespace)
const REPEAT = 8;              // phrase repeats per row

function introEaseInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function IntroWall({ variant }) {
  return (
    <div className={"face face-" + variant}>
      <div className="t-rows">
        {Array.from({ length: ROWS }).map((_, r) => (
          <div className="t-row" key={r}>{PHRASE.repeat(REPEAT)}</div>
        ))}
      </div>
    </div>
  );
}

function IntroTunnel({ onDone }) {
  const [phase, setPhase] = React.useState("flying"); // flying | reveal | out | gone
  const roomRef = React.useRef(null);
  const rafRef = React.useRef(0);
  const revealedRef = React.useRef(false);
  const doneRef = React.useRef(false);

  React.useEffect(() => {
    const start = performance.now();

    // 3 → 4 : dissolve into the page
    const teardown = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setPhase("out");                 // adds .intro-fade → CSS transition
      setTimeout(() => {
        setPhase("gone");              // returns null
        if (onDone) onDone();
      }, 950);
    };

    // 1 → 2 : land on the white brand screen, hold, then teardown
    const beginReveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      cancelAnimationFrame(rafRef.current);
      setPhase("reveal");
      setTimeout(teardown, REVEAL_HOLD);
    };

    const loop = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      const e = introEaseInOutCubic(t);
      // camera flies through: -DEPTH/2 → DEPTH/2 + 300
      const z = -DEPTH / 2 + e * (DEPTH + 300);
      const roll = t * 2.5;            // subtle rotateZ roll (deg)
      if (roomRef.current) {
        roomRef.current.style.transform =
          "translateZ(" + z + "px) rotateZ(" + roll + "deg)";
      }
      if (t >= 1) { beginReveal(); return; }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    // Safety fallback in case rAF is throttled in a background tab
    const safety = setTimeout(beginReveal, DURATION + 600);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(safety);
    };
  }, [onDone]);

  if (phase === "gone") return null;

  const flying = phase === "flying";

  return (
    <div className={"intro-tunnel intro-" + phase + (phase === "out" ? " intro-fade" : "")}>
      {/* The 3D room only exists during the flight */}
      {flying && (
        <div className="intro-stage">
          <div
            className="intro-room"
            ref={roomRef}
            style={{ ["--d"]: DEPTH + "px" }}
          >
            <IntroWall variant="bottom" />
            <IntroWall variant="top" />
            <IntroWall variant="left" />
            <IntroWall variant="right" />
          </div>
        </div>
      )}
      {flying && <div className="intro-core" />}
      {flying && <div className="intro-vignette" />}

      {/* Brand lockup — hidden during flight, revealed on the white screen */}
      <div className="intro-center">
        <div className="intro-logo"><span>THIRD ROCK</span><span>REALTY</span></div>
        <div className="intro-rule" />
        <div className="intro-sub">Real Estate Agency · Mohali</div>
      </div>
    </div>
  );
}

/* Expose for the in-browser Babel scripts (app.jsx reads window.IntroTunnel) */
window.IntroTunnel = IntroTunnel;
