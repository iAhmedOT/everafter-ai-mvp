import type { RefObject } from "react";

import type { ChatMessage, RoomSubject } from "../lib/types";

type OnlineRoomSectionProps = {
  selectedRoom: RoomSubject;
  pinHome: string;
  roomMessages: ChatMessage[];
  moderating: boolean;
  roomInput: string;
  roomRef: RefObject<HTMLDivElement | null>;
  chatEndRef: RefObject<HTMLDivElement | null>;
  onRoomInputChange: (value: string) => void;
  onSendMessage: () => Promise<void>;
};

export function OnlineRoomSection({
  selectedRoom,
  pinHome,
  roomMessages,
  moderating,
  roomInput,
  roomRef,
  chatEndRef,
  onRoomInputChange,
  onSendMessage,
}: OnlineRoomSectionProps) {
  return (
    <section id="online-room" ref={roomRef} className="section online-room">
      <div className="online-room-header">
        <div>
          <div className="kicker">Online Reflection Room</div>
          <h2>{selectedRoom}</h2>
          <p className="lead">
            You are now on the shared room page. Even if you are the only human here, the AI
            moderator can keep reflecting with you and guide you toward the fourth stage: Pin Home.
          </p>
        </div>
        <div className="room-meta">
          <span>AI moderator online</span>
          <span>{selectedRoom}</span>
          <span>Pin Home stage</span>
        </div>
      </div>

      <div className="room online-room-panel">
        <div className="room-status">Online room page · AI moderated</div>
        <div className="chat">
          {roomMessages.map((message, index) => (
            <div className={`bubble ${message.role}`} key={`${message.role}-${index}-${message.text.slice(0, 16)}`}>
              {message.text}
            </div>
          ))}
          {moderating && <div className="bubble ai">AI moderator is reflecting…</div>}
          <div ref={chatEndRef} />
        </div>
        <input
          placeholder="Keep chatting with the AI moderator toward Pin Home…"
          value={roomInput}
          onChange={(event) => onRoomInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void onSendMessage();
            }
          }}
        />
        <div className="hero-actions">
          <button className="btn gold" onClick={onSendMessage} disabled={!roomInput.trim() || moderating}>
            Send to AI moderator
          </button>
        </div>
        <div className="result-card pin-home-card">
          <h3>Pin Home target</h3>
          <p>{pinHome}</p>
        </div>
      </div>
    </section>
  );
}
