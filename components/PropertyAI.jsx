/* ───────────────────── Property AI ─────────────────────
   Floating AI concierge powered by Groq (Llama 3.3 70B).
   ⚠ Key currently lives in client JS — move to a backend
   proxy before production (Vercel/Cloudflare function).
*/

const GROQ_KEY = ""; // Add your Groq API key here
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are Property AI, the digital concierge for Third Rock Realty — a trusted real estate agency in the Mohali tri-city (Mohali, Chandigarh, Zirakpur, Kharar, New Chandigarh).

Firm facts:
- Firm: Third Rock Realty
- Office: SCO 1, 2nd Floor, Sector 79, Sahibzada Ajit Singh Nagar, Punjab 140308
- Phone: +91 XXXXX XXXXX
- GMADA empanelled, RERA registered (PB-RERA)
- Practice: Residential, Commercial, Land/Plots, Investment Advisory, NRI Services, Title & Due Diligence
- Tagline: Real Estate Agency · Mohali

Tone: warm, concise (under 90 words), confident, never pushy. Speak like a discreet desk officer, not a salesman.

Rules:
- Don't quote specific prices — recommend scheduling a viewing or speaking with the desk for live numbers.
- For booking interest, offer to open the "Schedule a Viewing" panel or share the phone number.
- For property questions, give one short useful paragraph and one suggested next step.
- If asked off-topic things (weather, recipes, code), gently redirect to property.
- Never invent property inventory — say "I'll have the desk send our live mandate list" instead.`;

function PropertyAI({ onSchedule }) {
  const [open, setOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(true);
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "Hello — Property AI here. Ask me about a sector, a property type, or what's currently with the desk. I can also open a viewing slot for you." }
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Auto-scroll on new messages
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  React.useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 320);
    }
  }, [open]);

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || sending) return;
    setInput("");
    const next = [...messages, { role: "user", content: userText }];
    setMessages(next);
    setSending(true);

    // Intent: schedule
    if (/schedul|book|viewing|appointment|visit/i.test(userText) && onSchedule) {
      setTimeout(() => {
        setMessages((m) => [...m, { role: "assistant", content: "Opening the viewing panel — pick a date and time and I'll send the desk a note." }]);
        setSending(false);
        setTimeout(() => onSchedule(), 600);
      }, 500);
      return;
    }

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + GROQ_KEY,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.6,
          max_tokens: 220,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const reply = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "Sorry — I lost that. Could you say it again?";
      setMessages((m) => [...m, { role: "assistant", content: reply.trim() }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "I can't reach my brain right now. Please call the desk on +91 XXXXX XXXXX — they'll be happy to help." }]);
    } finally {
      setSending(false);
    }
  };

  const quick = [
    "What's on offer in Sector 79?",
    "Plot vs builder floor for investment?",
    "Book a viewing this week",
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Property AI" : "Open Property AI"}
        className="ai-fab"
      >
        <span className="ai-fab-glow" />
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l1.6 4.2L18 8l-4.4 1.8L12 14l-1.6-4.2L6 8l4.4-1.8L12 2z"/>
            <path d="M19 14l.9 2.3L22 17l-2.1.7L19 20l-.9-2.3L16 17l2.1-.7L19 14z"/>
          </svg>
        )}
        {unread && !open && <span className="ai-fab-dot" />}
      </button>

      {/* Panel */}
      <div className={"ai-panel " + (open ? "open" : "")} role="dialog" aria-label="Property AI">
        <header className="ai-head">
          <div className="ai-id">
            <span className="ai-orb">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a0a0a"><path d="M12 2l1.6 4.2L18 8l-4.4 1.8L12 14l-1.6-4.2L6 8l4.4-1.8L12 2z"/></svg>
            </span>
            <div>
              <div className="ai-name">Property AI</div>
              <div className="ai-status"><span className="ai-pulse"/>Live · replies instantly</div>
            </div>
          </div>
          <button className="ai-close" aria-label="Close" onClick={() => setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </header>

        <div className="ai-scroll" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={"ai-msg ai-" + m.role}>{m.content}</div>
          ))}
          {sending && <div className="ai-msg ai-assistant ai-typing"><span/><span/><span/></div>}
        </div>

        {messages.length <= 2 && (
          <div className="ai-quick">
            {quick.map((q) => (
              <button key={q} onClick={() => send(q)} className="ai-chip">{q}</button>
            ))}
          </div>
        )}

        <form className="ai-input-row" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Property AI…"
            className="ai-input"
            disabled={sending}
          />
          <button type="submit" className="ai-send" aria-label="Send" disabled={sending || !input.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12l18-9-7 18-3-8-8-1z" fill="currentColor"/></svg>
          </button>
        </form>

        <div className="ai-foot">Powered by Llama 3.3 · Answers are AI-generated</div>
      </div>
    </>
  );
}

window.PropertyAI = PropertyAI;
