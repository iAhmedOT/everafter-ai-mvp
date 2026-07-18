"use client";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

type Analysis = {
  summary: string;
  pillars: { innovate: string; investigate: string; choose: string; pinHome: string };
  blockers: string[];
  trajectory?: string[];
  themes: string[];
  room: { title: string; prompt: string; voices: string[] };
  pinHome: string;
  safetyNote?: string;
};

type RoomSubject = "Family wounds" | "Belonging" | "Permission to choose";
type ChatMessage = { role: "user" | "ai" | "community"; text: string };

const sample = `I keep feeling like my family story decides who I am allowed to become. I want freedom, but I also feel guilty for wanting a life that looks different from what people expected of me.`;

const roomSubjects: Record<RoomSubject, { prompt: string; seed: string[]; pinHome: string }> = {
  "Family wounds": {
    prompt: "What did this pattern protect, and what boundary would let the past stop authoring the future?",
    seed: [
      "Community member: I chose this room because I know what it feels like when old family pain becomes the whole language for identity.",
      "Community member: I want to name what happened without letting it become the ending of my story.",
    ],
    pinHome: "I can honor the truth of what shaped me without surrendering the authorship of what comes next.",
  },
  "Belonging": {
    prompt: "Where did belonging become self-abandonment, and what would belonging without hiding look like?",
    seed: [
      "Community member: I am here because I keep confusing being accepted with disappearing parts of myself.",
      "Community member: I want to belong somewhere without performing a smaller version of who I am.",
    ],
    pinHome: "I do not have to abandon myself to be worthy of connection.",
  },
  "Permission to choose": {
    prompt: "What expectation is asking for release, and what choice would restore agency today?",
    seed: [
      "Community member: I joined because guilt keeps making my choices feel like betrayal.",
      "Community member: I want to practice choosing a future without asking the old story for permission first.",
    ],
    pinHome: "Choosing my life is not a rejection of love; it is a return to authorship.",
  },
};

const roomNames = Object.keys(roomSubjects) as RoomSubject[];

function pickRoom(analysis: Analysis | null): RoomSubject {
  const text = `${analysis?.room.title || ""} ${(analysis?.themes || []).join(" ")}`.toLowerCase();
  if (text.includes("belong")) return "Belonging";
  if (text.includes("guilt") || text.includes("permission") || text.includes("expect")) return "Permission to choose";
  return "Family wounds";
}

export default function Home() {
  const [story, setStory] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomSubject>("Family wounds");
  const [enteredRoom, setEnteredRoom] = useState(false);
  const [consentSharedReflection, setConsentSharedReflection] = useState(true);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [roomInput, setRoomInput] = useState("");
  const [moderating, setModerating] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const roomRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { track("site_visited", { page: "everafter_home" }); }, []);
  useEffect(() => { if (analysis && !enteredRoom) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [analysis, enteredRoom]);
  useEffect(() => { if (enteredRoom) roomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [enteredRoom]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [roomMessages]);

  async function analyze() {
    setLoading(true);
    setAnalysis(null);
    setEnteredRoom(false);
    setRoomMessages([]);
    track("pattern_reveal_started", { story_length_bucket: story.length < 250 ? "short" : story.length < 1000 ? "medium" : "long" });
    const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ story }) });
    const data = await res.json();
    const room = pickRoom(data);
    setAnalysis(data);
    setSelectedRoom(room);
    setLoading(false);
    track("pattern_revealed", { room_subject: room, themes: (data.themes || []).slice(0, 3).join(",") });
  }

  function startRoomMessages(room: RoomSubject, firstReflection: string) {
    const seed = roomSubjects[room].seed.map((text) => ({ role: "community" as const, text }));
    return [
      { role: "ai" as const, text: `AI moderator: Welcome to the ${room} room. Keep private story details private. Speak from your reflection, avoid advice or diagnosis, and help the room reach Pin Home.` },
      ...seed,
      { role: "user" as const, text: `You shared: ${firstReflection}` },
    ];
  }

  async function enterOnlineRoom() {
    if (!roomInput.trim() || !analysis || !consentSharedReflection) return;
    const firstReflection = roomInput.trim();
    const baseMessages = startRoomMessages(selectedRoom, firstReflection);
    setRoomMessages(baseMessages);
    setRoomInput("");
    setEnteredRoom(true);
    window.history.replaceState(null, "", "#online-room");
    track("online_room_entered", { room_subject: selectedRoom, shared_reflection: "yes" });
    await askModerator(firstReflection, baseMessages);
  }

  async function sendChatMessage() {
    if (!roomInput.trim() || !enteredRoom) return;
    const text = roomInput.trim();
    const next = [...roomMessages, { role: "user" as const, text: `You shared: ${text}` }];
    setRoomMessages(next);
    setRoomInput("");
    track("room_message_sent", { room_subject: selectedRoom });
    await askModerator(text, next);
  }

  async function askModerator(message: string, history: ChatMessage[]) {
    setModerating(true);
    const res = await fetch("/api/moderate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room: selectedRoom, message, history }) });
    const data = await res.json();
    setRoomMessages((m) => [...m, { role: "ai", text: data.reply || "AI moderator: Let’s return to the shared pattern and name one Pin Home realization." }]);
    setModerating(false);
    track("ai_moderator_replied", { room_subject: selectedRoom });
  }

  const currentRoom = roomSubjects[selectedRoom];

  return (
    <main className="page">
      <nav className="nav">
        <div className="brand">EverAfter AI<small>Story intelligence for emotional transformation</small></div>
        <div className="navlinks"><a href="#product">Product</a><a href="#rooms">Rooms</a><a href="#data">Data</a><a href="#app">Try AI</a><a className="btn secondary" href="#app">Start</a></div>
      </nav>

      <section className="hero website-hero">
        <div>
          <div className="kicker">A story intelligence platform</div>
          <h1>Turn the story that shaped you into the realization that frees you.</h1>
          <p className="lead">EverAfter AI helps people privately process a personal story, discover the pattern underneath it, and enter an AI-moderated Reflection Room designed to move them toward Pin Home — a clear, usable fourth-stage realization.</p>
          <div className="hero-actions"><a className="btn gold" href="#app" onClick={()=>track("start_story_clicked")}>Try the AI Tool</a><a className="btn secondary" href="#product">Explore the website</a></div>
          <div className="sigils"><span>Private story analysis</span><span>AI-moderated rooms</span><span>Community reflection</span><span>Pin Home</span></div>
        </div>
        <div className="oracle-card product-card">
          <div className="circle"><div><strong>EverAfter</strong><p>Dream → Story → Pattern → Home</p></div></div>
          <div className="float f1">Private input. Shared reflection.</div>
          <div className="float f2">AI moderator always online.</div>
        </div>
      </section>
      <div className="ticker"><div> ✦ DREAMS • STORIES • PATTERNS • REFLECTION ROOMS • PIN HOME • HAPPILY EVER AFTER FOR ALL ✦ DREAMS • STORIES • PATTERNS • REFLECTION ROOMS • PIN HOME ✦</div></div>

      <section id="product" className="section split">
        <div><div className="kicker">The Website</div><h2>A home for the product, the story, and the live AI demo.</h2></div>
        <div>
          <p className="lead">This website now presents EverAfter AI as more than a demo: a public-facing product with a clear promise, method, room system, data philosophy, and interactive AI experience.</p>
          <div className="cards"><div className="card"><h3>For seekers</h3><p>People bring a stuck story and leave with a pattern, a room subject, and one grounded realization.</p></div><div className="card"><h3>For community</h3><p>Rooms let people reflect around shared themes without exposing private details.</p></div><div className="card"><h3>For partners</h3><p>The platform can grow into workshops, cohorts, and data-informed emotional intelligence products.</p></div></div>
        </div>
      </section>

      <section id="method" className="section"><div className="kicker">The Method</div><h2>The four-stage arc from stuck story to Pin Home.</h2><div className="steps"><div className="step"><b>01 Dream</b>The private story is written in the user’s own words.</div><div className="step"><b>02 Pattern</b>The AI reveals the emotional pattern and where it is leading.</div><div className="step"><b>03 Room</b>The user chooses or receives a Reflection Room subject.</div><div className="step"><b>04 Pin Home</b>The AI moderator guides the user toward one portable realization.</div></div></section>

      <section id="rooms" className="section split">
        <div><div className="kicker">Reflection Rooms</div><h2>Three room subjects are ready now.</h2><p className="lead">Each room includes seeded community reflections and an AI moderator so even one user can start the journey.</p></div>
        <div className="cards">{roomNames.map((room)=><div className="card" key={room}><h3>{room}</h3><p>{roomSubjects[room].prompt}</p><p><b>Pin Home:</b> {roomSubjects[room].pinHome}</p></div>)}</div>
      </section>

      <section id="app" className="section app"><div className="split"><div><div className="kicker">Live AI Tool</div><h2>Try the EverAfter reflection flow.</h2><p className="lead">Write a private story, reveal the pattern, share one reflection, then enter an AI-moderated online room. The current version does not permanently save private stories or chat content.</p></div><div className="panel"><textarea className="textarea" placeholder="Tell EverAfter a story you keep returning to…" value={story} onChange={(e)=>{setStory(e.target.value); if(e.target.value.length === 1) track("story_started");}} /><div className="hero-actions"><button className="btn gold" onClick={analyze} disabled={loading || story.trim().length < 20}>{loading ? "Reading your story…" : "Reveal the pattern"}</button><button className="btn secondary" onClick={()=>{setStory(sample); track("sample_used");}}>Use sample</button></div>{story.trim().length>0 && story.trim().length<20 && <p className="loader">Write at least a few sentences so EverAfter has a story to reflect.</p>}</div></div>
        {loading && <p className="loader">EverAfter is mapping the story through the four pillars…</p>}
        {analysis && <div ref={resultsRef} className="tool" style={{ marginTop: 34 }}><div className="results"><div className="result-card"><h3>1. Pattern highlighted</h3><p>{analysis.summary}</p></div><div className="result-card"><h3>2. Where it is leading now</h3><div className="pill-list">{analysis.blockers.map((b)=><span className="pill" key={b}>{b}</span>)}</div>{analysis.trajectory && <ul>{analysis.trajectory.map((t)=><li key={t}>{t}</li>)}</ul>}</div><div className="result-card"><h3>3. Choose online room subject</h3><div className="room-tabs">{roomNames.map((room)=><button key={room} className={room === selectedRoom ? "room-tab active" : "room-tab"} onClick={()=>{setSelectedRoom(room); track("room_subject_selected", { room_subject: room });}}>{room}</button>)}</div><p>Selected room: <b>{selectedRoom}</b>. The private story is not shown to the room.</p></div><div className="result-card"><h3>Current data note</h3><p>Vercel Analytics tracks page views and custom flow events. This prototype does not yet save private stories to a database. Your shared room reflection is used in the current session to open the room and talk with the AI moderator.</p></div></div><div className="room entry-room"><div className="room-status">Step 4 · share reflection to enter</div><h3>{selectedRoom} Room</h3><p>{currentRoom.prompt}</p><div className="result-card pin-home-card"><h3>Pin Home target</h3><p>{currentRoom.pinHome}</p></div><label className="consent"><input type="checkbox" checked={consentSharedReflection} onChange={(e)=>setConsentSharedReflection(e.target.checked)} /> I understand my private story stays private; this reflection will be shared into the room experience.</label><input placeholder="Add a reflection to enter the online room…" value={roomInput} onChange={(e)=>setRoomInput(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter')enterOnlineRoom()}} /><div className="hero-actions"><button className="btn gold" onClick={enterOnlineRoom} disabled={!roomInput.trim() || !consentSharedReflection}>Share reflection & enter online room</button></div></div></div>}
      </section>

      {analysis && enteredRoom && <section id="online-room" ref={roomRef} className="section online-room"><div className="online-room-header"><div><div className="kicker">Online Reflection Room</div><h2>{selectedRoom}</h2><p className="lead">You are now on the shared room page. Even if you are the only human here, the AI moderator can keep reflecting with you and guide you toward the fourth stage: Pin Home.</p></div><div className="room-meta"><span>AI moderator online</span><span>{selectedRoom}</span><span>Pin Home stage</span></div></div><div className="room online-room-panel"><div className="room-status">Online room page · AI moderated</div><div className="chat">{roomMessages.map((m,i)=><div className={`bubble ${m.role}`} key={i}>{m.text}</div>)}{moderating && <div className="bubble ai">AI moderator is reflecting…</div>}<div ref={chatEndRef} /></div><input placeholder="Keep chatting with the AI moderator toward Pin Home…" value={roomInput} onChange={(e)=>setRoomInput(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter')sendChatMessage()}} /><div className="hero-actions"><button className="btn gold" onClick={sendChatMessage} disabled={!roomInput.trim() || moderating}>Send to AI moderator</button></div><div className="result-card pin-home-card"><h3>Pin Home target</h3><p>{currentRoom.pinHome}</p></div></div></section>}

      <section id="data" className="section split"><div><div className="kicker">Safety + Data</div><h2>Built around consent before collection.</h2></div><div className="cards"><div className="card"><h3>Analytics</h3><p>Vercel Analytics records visits and flow events so we can understand the funnel.</p></div><div className="card"><h3>Privacy</h3><p>Private stories are analyzed in-session and are not shown inside rooms.</p></div><div className="card"><h3>Next layer</h3><p>Supabase or Vercel Postgres can add saved reflections, realtime rooms, admin review, and consent records.</p></div></div></section>

      <section className="section iw-badge-section" aria-label="Influential Women recognition"><a className="iw-badge-link" href="https://influentialwomen.com/shareable/badge/20043149" target="_blank" rel="noopener noreferrer"><img src="https://cdn.bmapinc.com/configurations/config_68454009b3957.png" alt="Influential Women Badge - Samah Damanhoori" /><span>Featured by Influential Women</span></a></section>
      <section className="section final-cta"><div className="kicker">EverAfter AI</div><h2>Redefine your happily ever after.</h2><p className="lead">A story intelligence platform by Blendbound / Madina Papel for reflection, authorship, and emotionally intelligent community.</p><div className="hero-actions"><a className="btn gold" href="#app">Try the AI Tool</a><a className="btn secondary" href="https://www.blendbound.co" target="_blank" rel="noopener noreferrer">Visit Blendbound</a></div></section>
      <footer className="footer"><div><b>EverAfter AI</b><br/>Story Intelligence Platform</div><div>Private story → shared pattern → Pin Home.</div></footer>
    </main>
  );
}
