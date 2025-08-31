import React, { useEffect, useRef, useState } from "react";
import robotImg from "../../assets/bee2.jpeg"; // <- your round robot/mascot image

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "👋 Hey! I’m Colony Bot." },
    { role: "bot", content: "Ask me about honey prices, delivery, or workshops." },
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing, open]);

  // fake reply (wire to your real /api/chat later)
  const send = (text) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", content: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "bot", content: `You asked: “${t}”. I’ll fetch that info 🍯` },
      ]);
      setTyping(false);
    }, 900);
  };

  const Quick = ({ children }) => (
   <button
  onClick={() => send(String(children))}
  className="px-2 py-0.5 rounded-full text-xs leading-tight
             bg-amber-400 text-black shadow-neon hover:brightness-95
             border border-amber-300/40"
>
  {children}
</button>
  );

  const Bubble = ({ role, children }) => {
    const isUser = role === "user";
    return (
      <div
        className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                     ${isUser
                       ? "ml-auto text-black bg-amber-400 shadow-neon border border-amber-200/50"
                       : "mr-auto text-amber-100 bg-black/70 border border-amber-500/20 shadow-inset-neon"}`}
      >
        {children}
      </div>
    );
  };

  return (
    <>
      {/* Floating neon robot */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full overflow-hidden
                     bg-black ring-4 ring-amber-400/70 shadow-neon animate-pulse-glow
                     hover:scale-110 transition-transform"
          aria-label="Open chat"
        >
          <img src={robotImg} alt="Chatbot" className="w-full h-full object-cover" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] rounded-[22px] overflow-hidden
                     border border-amber-500/30 bg-gradient-to-b from-black/90 via-[#0b0b0b]/95 to-black/90
                     backdrop-blur-xl shadow-2xl shadow-amber-500/20 neon-border"
        >
          {/* Header with glow */}
          <div className="relative px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-amber-400 to-amber-500">
            <div className="h-9 w-9 rounded-full ring-2 ring-black/15 overflow-hidden">
              <img src={robotImg} alt="Bot" className="w-full h-full object-cover" />
            </div>
            <div className="text-black">
              <div className="font-extrabold tracking-wide">Colony Bot</div>
              <div className="text-xs opacity-80">Your honey assistant</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-black/80 hover:text-black bg-black/10 hover:bg-black/15
                         rounded-full px-2 py-1 text-sm"
              aria-label="Close chat"
            >
              ✖
            </button>
            <div className="absolute inset-0 pointer-events-none header-aura" />
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="h-80 overflow-y-auto px-3 py-4 space-y-2
                       bg-[radial-gradient(1200px_350px_at_110%_-10%,rgba(251,176,26,0.15),transparent_60%)]
                       scrollbar-thin scrollbar-thumb-amber-500/40 scrollbar-track-transparent"
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role}>
                {m.content}
              </Bubble>
            ))}

            {typing && (
              <div className="mr-auto bg-black/70 border border-amber-500/20 rounded-2xl px-3 py-2 w-fit">
                <span className="typing-dot" />
                <span className="typing-dot delay-150" />
                <span className="typing-dot delay-300" />
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex flex-wrap gap-2 border-t border-amber-500/20 bg-black/70">
            <Quick>Price of Wildflower Honey</Quick>
            <Quick>Delivery options</Quick>
            <Quick>Show top sellers</Quick>
          </div>

          {/* Input row */}
          <div className="p-3 border-t border-amber-500/20 bg-black/80">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Type your message…"
                className="flex-1 rounded-2xl px-3 py-2 text-amber-50 placeholder-amber-300/50
                           bg-black/70 border border-amber-500/30 focus:outline-none
                           focus:ring-2 focus:ring-amber-400/60 shadow-inset-neon"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="rounded-2xl px-4 py-2 font-semibold text-black
                           bg-amber-400 hover:bg-amber-300 active:brightness-95
                           disabled:opacity-40 shadow-neon"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
