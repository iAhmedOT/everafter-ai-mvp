import { roomNames, roomSubjects } from "../lib/room-data";

export function SiteHeader() {
  return (
    <nav className="nav">
      <div className="brand">
        EverAfter AI
        <small>Story intelligence for emotional transformation</small>
      </div>
      <div className="navlinks">
        <a href="#product">Product</a>
        <a href="#rooms">Rooms</a>
        <a href="#data">Data</a>
        <a href="#app">Try AI</a>
        <a className="btn secondary" href="#app">
          Start
        </a>
      </div>
    </nav>
  );
}

type HeroSectionProps = {
  onStartStoryClick?: () => void;
};

export function HeroSection({ onStartStoryClick }: HeroSectionProps) {
  return (
    <>
      <section className="hero website-hero">
        <div>
          <div className="kicker">A story intelligence platform</div>
          <h1>Turn the story that shaped you into the realization that frees you.</h1>
          <p className="lead">
            EverAfter AI helps people privately process a personal story, discover the pattern
            underneath it, and enter an AI-moderated Reflection Room designed to move them toward
            Pin Home — a clear, usable fourth-stage realization.
          </p>
          <div className="hero-actions">
            <a className="btn gold" href="#app" onClick={onStartStoryClick}>
              Try the AI Tool
            </a>
            <a className="btn secondary" href="#product">
              Explore the website
            </a>
          </div>
          <div className="sigils">
            <span>Private story analysis</span>
            <span>AI-moderated rooms</span>
            <span>Community reflection</span>
            <span>Pin Home</span>
          </div>
        </div>
        <div className="oracle-card product-card">
          <div className="circle">
            <div>
              <strong>EverAfter</strong>
              <p>Dream → Story → Pattern → Home</p>
            </div>
          </div>
          <div className="float f1">Private input. Shared reflection.</div>
          <div className="float f2">AI moderator always online.</div>
        </div>
      </section>
      <div className="ticker">
        <div>
          {" "}
          ✦ DREAMS • STORIES • PATTERNS • REFLECTION ROOMS • PIN HOME • HAPPILY EVER AFTER FOR ALL ✦
          DREAMS • STORIES • PATTERNS • REFLECTION ROOMS • PIN HOME ✦
        </div>
      </div>
    </>
  );
}

export function ProductSection() {
  return (
    <section id="product" className="section split">
      <div>
        <div className="kicker">The Website</div>
        <h2>A home for the product, the story, and the live AI demo.</h2>
      </div>
      <div>
        <p className="lead">
          This website now presents EverAfter AI as more than a demo: a public-facing product with
          a clear promise, method, room system, data philosophy, and interactive AI experience.
        </p>
        <div className="cards">
          <div className="card">
            <h3>For seekers</h3>
            <p>
              People bring a stuck story and leave with a pattern, a room subject, and one grounded
              realization.
            </p>
          </div>
          <div className="card">
            <h3>For community</h3>
            <p>Rooms let people reflect around shared themes without exposing private details.</p>
          </div>
          <div className="card">
            <h3>For partners</h3>
            <p>
              The platform can grow into workshops, cohorts, and data-informed emotional
              intelligence products.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MethodSection() {
  return (
    <section id="method" className="section">
      <div className="kicker">The Method</div>
      <h2>The four-stage arc from stuck story to Pin Home.</h2>
      <div className="steps">
        <div className="step">
          <b>01 Dream</b>
          The private story is written in the user’s own words.
        </div>
        <div className="step">
          <b>02 Pattern</b>
          The AI reveals the emotional pattern and where it is leading.
        </div>
        <div className="step">
          <b>03 Room</b>
          The user chooses or receives a Reflection Room subject.
        </div>
        <div className="step">
          <b>04 Pin Home</b>
          The AI moderator guides the user toward one portable realization.
        </div>
      </div>
    </section>
  );
}

export function ReflectionRoomsSection() {
  return (
    <section id="rooms" className="section split">
      <div>
        <div className="kicker">Reflection Rooms</div>
        <h2>Three room subjects are ready now.</h2>
        <p className="lead">
          Each room includes seeded community reflections and an AI moderator so even one user can
          start the journey.
        </p>
      </div>
      <div className="cards">
        {roomNames.map((room) => (
          <div className="card" key={room}>
            <h3>{room}</h3>
            <p>{roomSubjects[room].prompt}</p>
            <p>
              <b>Pin Home:</b> {roomSubjects[room].pinHome}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DataSection() {
  return (
    <section id="data" className="section split">
      <div>
        <div className="kicker">Safety + Data</div>
        <h2>Built around consent before collection.</h2>
      </div>
      <div className="cards">
        <div className="card">
          <h3>Analytics</h3>
          <p>Vercel Analytics records visits and flow events so we can understand the funnel.</p>
        </div>
        <div className="card">
          <h3>Privacy</h3>
          <p>Private stories are analyzed in-session and are not shown inside rooms.</p>
        </div>
        <div className="card">
          <h3>Next layer</h3>
          <p>
            Supabase or Vercel Postgres can add saved reflections, realtime rooms, admin review,
            and consent records.
          </p>
        </div>
      </div>
    </section>
  );
}

export function RecognitionSection() {
  return (
    <section className="section iw-badge-section" aria-label="Influential Women recognition">
      <a
        className="iw-badge-link"
        href="https://influentialwomen.com/shareable/badge/20043149"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://cdn.bmapinc.com/configurations/config_68454009b3957.png"
          alt="Influential Women Badge - Samah Damanhoori"
        />
        <span>Featured by Influential Women</span>
      </a>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="section final-cta">
      <div className="kicker">EverAfter AI</div>
      <h2>Redefine your happily ever after.</h2>
      <p className="lead">
        A story intelligence platform by Blendbound / Madina Papel for reflection, authorship, and
        emotionally intelligent community.
      </p>
      <div className="hero-actions">
        <a className="btn gold" href="#app">
          Try the AI Tool
        </a>
        <a className="btn secondary" href="https://www.blendbound.co" target="_blank" rel="noopener noreferrer">
          Visit Blendbound
        </a>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div>
        <b>EverAfter AI</b>
        <br />
        Story Intelligence Platform
      </div>
      <div>Private story → shared pattern → Pin Home.</div>
    </footer>
  );
}
