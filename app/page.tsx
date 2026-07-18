"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

import {
  DataSection,
  FinalCtaSection,
  HeroSection,
  MethodSection,
  ProductSection,
  RecognitionSection,
  ReflectionRoomsSection,
  SiteFooter,
  SiteHeader,
} from "../components/marketing-sections";
import { OnlineRoomSection } from "../components/online-room";
import { StoryToolSection } from "../components/story-tool";
import { pickRoom, roomSubjects, startRoomMessages } from "../lib/room-data";
import type { Analysis, ChatMessage, RoomSubject } from "../lib/types";

export default function Home() {
  const [story, setStory] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomSubject>("Family wounds");
  const [enteredRoom, setEnteredRoom] = useState(false);
  const [consentSharedReflection, setConsentSharedReflection] = useState(false);
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [roomInput, setRoomInput] = useState("");
  const [moderating, setModerating] = useState(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const roomRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    track("site_visited", { page: "everafter_home" });
  }, []);

  useEffect(() => {
    if (analysis && !enteredRoom) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [analysis, enteredRoom]);

  useEffect(() => {
    if (enteredRoom) {
      roomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [enteredRoom]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [roomMessages]);

  async function analyze() {
    setLoading(true);
    setAnalysis(null);
    setEnteredRoom(false);
    setRoomMessages([]);

    track("pattern_reveal_started", {
      story_length_bucket:
        story.length < 250 ? "short" : story.length < 1000 ? "medium" : "long",
    });

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story }),
    });
    const data = await res.json();
    const room = pickRoom(data);

    setAnalysis(data);
    setSelectedRoom(room);
    setLoading(false);

    track("pattern_revealed", {
      room_subject: room,
      themes: (data.themes || []).slice(0, 3).join(","),
    });
  }

  async function askModerator(message: string, history: ChatMessage[]) {
    setModerating(true);

    const res = await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: selectedRoom, message, history }),
    });
    const data = await res.json();

    setRoomMessages((messages) => [
      ...messages,
      {
        role: "ai",
        text:
          data.reply ||
          "AI moderator: Let’s return to the shared pattern and name one Pin Home realization.",
      },
    ]);
    setModerating(false);
    track("ai_moderator_replied", { room_subject: selectedRoom });
  }

  async function enterOnlineRoom() {
    if (!roomInput.trim() || !analysis || !consentSharedReflection) {
      return;
    }

    const firstReflection = roomInput.trim();
    const baseMessages = startRoomMessages(selectedRoom, firstReflection);

    setRoomMessages(baseMessages);
    setRoomInput("");
    setEnteredRoom(true);
    window.history.replaceState(null, "", "#online-room");
    track("online_room_entered", {
      room_subject: selectedRoom,
      shared_reflection: "yes",
    });

    await askModerator(firstReflection, baseMessages);
  }

  async function sendChatMessage() {
    if (!roomInput.trim() || !enteredRoom) {
      return;
    }

    const text = roomInput.trim();
    const nextMessages = [...roomMessages, { role: "user" as const, text: `You shared: ${text}` }];

    setRoomMessages(nextMessages);
    setRoomInput("");
    track("room_message_sent", { room_subject: selectedRoom });

    await askModerator(text, nextMessages);
  }

  function handleStoryChange(value: string) {
    setStory(value);
    if (value.length === 1) {
      track("story_started");
    }
  }

  function handleUseSample(sample: string) {
    setStory(sample);
    track("sample_used");
  }

  function handleSelectRoom(room: RoomSubject) {
    setSelectedRoom(room);
    track("room_subject_selected", { room_subject: room });
  }

  const currentRoom = roomSubjects[selectedRoom];

  return (
    <main className="page">
      <SiteHeader />
      <HeroSection onStartStoryClick={() => track("start_story_clicked")} />
      <ProductSection />
      <MethodSection />
      <ReflectionRoomsSection />
      <StoryToolSection
        story={story}
        loading={loading}
        analysis={analysis}
        selectedRoom={selectedRoom}
        currentRoom={currentRoom}
        consentSharedReflection={consentSharedReflection}
        roomInput={roomInput}
        resultsRef={resultsRef}
        onStoryChange={handleStoryChange}
        onAnalyze={analyze}
        onUseSample={handleUseSample}
        onSelectRoom={handleSelectRoom}
        onConsentChange={setConsentSharedReflection}
        onRoomInputChange={setRoomInput}
        onEnterRoom={enterOnlineRoom}
      />
      {analysis && enteredRoom && (
        <OnlineRoomSection
          selectedRoom={selectedRoom}
          pinHome={currentRoom.pinHome}
          roomMessages={roomMessages}
          moderating={moderating}
          roomInput={roomInput}
          roomRef={roomRef}
          chatEndRef={chatEndRef}
          onRoomInputChange={setRoomInput}
          onSendMessage={sendChatMessage}
        />
      )}
      <DataSection />
      <RecognitionSection />
      <FinalCtaSection />
      <SiteFooter />
    </main>
  );
}
