import type { RefObject } from "react";

import { ANALYSIS_MIN_STORY_LENGTH } from "../lib/analysis";
import { roomNames, SAMPLE_STORY } from "../lib/room-data";
import type { Analysis, RoomSubject } from "../lib/types";

type StoryToolSectionProps = {
  story: string;
  loading: boolean;
  analysis: Analysis | null;
  selectedRoom: RoomSubject;
  currentRoom: { prompt: string; pinHome: string };
  consentSharedReflection: boolean;
  roomInput: string;
  resultsRef: RefObject<HTMLDivElement | null>;
  onStoryChange: (value: string) => void;
  onAnalyze: () => Promise<void>;
  onUseSample: (sample: string) => void;
  onSelectRoom: (room: RoomSubject) => void;
  onConsentChange: (value: boolean) => void;
  onRoomInputChange: (value: string) => void;
  onEnterRoom: () => Promise<void>;
};

export function StoryToolSection({
  story,
  loading,
  analysis,
  selectedRoom,
  currentRoom,
  consentSharedReflection,
  roomInput,
  resultsRef,
  onStoryChange,
  onAnalyze,
  onUseSample,
  onSelectRoom,
  onConsentChange,
  onRoomInputChange,
  onEnterRoom,
}: StoryToolSectionProps) {
  return (
    <section id="app" className="section app">
      <div className="split">
        <div>
          <div className="kicker">Live AI Tool</div>
          <h2>Try the EverAfter reflection flow.</h2>
          <p className="lead">
            Write a private story, reveal the pattern, share one reflection, then enter an
            AI-moderated online room. This MVP does not permanently store private stories or room
            chats, and when a real AI provider is enabled the submitted content may be processed for
            the current session.
          </p>
        </div>

        <div className="panel">
          <textarea
            className="textarea"
            placeholder="Tell EverAfter a story you keep returning to…"
            value={story}
            onChange={(event) => onStoryChange(event.target.value)}
          />
          <div className="hero-actions">
            <button className="btn gold" onClick={onAnalyze} disabled={loading || story.trim().length < ANALYSIS_MIN_STORY_LENGTH}>
              {loading ? "Reading your story…" : "Reveal the pattern"}
            </button>
            <button className="btn secondary" onClick={() => onUseSample(SAMPLE_STORY)}>
              Use sample
            </button>
          </div>
          {story.trim().length > 0 && story.trim().length < ANALYSIS_MIN_STORY_LENGTH && (
            <p className="loader">Write at least a few sentences so EverAfter has a story to reflect.</p>
          )}
        </div>
      </div>

      {loading && <p className="loader">EverAfter is mapping the story through the four pillars…</p>}

      {analysis && (
        <div ref={resultsRef} className="tool" style={{ marginTop: 34 }}>
          <div className="results">
            <div className="result-card">
              <h3>1. Pattern highlighted</h3>
              <p>{analysis.summary}</p>
            </div>
            <div className="result-card">
              <h3>2. Where it is leading now</h3>
              <div className="pill-list">
                {analysis.blockers.map((blocker) => (
                  <span className="pill" key={blocker}>
                    {blocker}
                  </span>
                ))}
              </div>
              {analysis.trajectory && (
                <ul>
                  {analysis.trajectory.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="result-card">
              <h3>3. Choose online room subject</h3>
              <div className="room-tabs">
                {roomNames.map((room) => (
                  <button
                    key={room}
                    className={room === selectedRoom ? "room-tab active" : "room-tab"}
                    onClick={() => onSelectRoom(room)}
                  >
                    {room}
                  </button>
                ))}
              </div>
              <p>
                Selected room: <b>{selectedRoom}</b>. The private story is not shown to the room.
              </p>
            </div>
            <div className="result-card">
              <h3>Current data note</h3>
              <p>
                Vercel Analytics tracks page views and custom flow events. This prototype does not
                yet save private stories to a database. Your shared room reflection is used in the
                current session to open the room and talk with the AI moderator, while the full
                story stays out of the room itself.
              </p>
            </div>
          </div>

          <div className="room entry-room">
            <div className="room-status">Step 4 · share reflection to enter</div>
            <h3>{selectedRoom} Room</h3>
            <p>{currentRoom.prompt}</p>
            <div className="result-card pin-home-card">
              <h3>Pin Home target</h3>
              <p>{currentRoom.pinHome}</p>
            </div>
            <label className="consent">
              <input
                type="checkbox"
                checked={consentSharedReflection}
                onChange={(event) => onConsentChange(event.target.checked)}
              />
              I understand my full story stays out of the room. Only this reflection is shared into
              the room experience for the current session.
            </label>
            <input
              placeholder="Add a reflection to enter the online room…"
              value={roomInput}
              onChange={(event) => onRoomInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void onEnterRoom();
                }
              }}
            />
            <div className="hero-actions">
              <button
                className="btn gold"
                onClick={onEnterRoom}
                disabled={!roomInput.trim() || !consentSharedReflection}
              >
                Enter the online room
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
