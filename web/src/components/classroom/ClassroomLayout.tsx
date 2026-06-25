"use client";

import {
  useConnectionState,
  useRoomContext,
  DisconnectButton,
  useParticipants,
  useTracks,
  VideoTrack,
  TrackToggle,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { useState, useEffect } from "react";
import AudioVideoControls from "./AudioVideoControls";
import ScreenShare from "./ScreenShare";
import ChatBox from "./ChatBox";
import VideoPiP from "./VideoPiP";
import ParticipantsPanel from "./ParticipantsPanel";
import {
  Hand,
  MessageSquare,
  Users,
  MonitorPlay,
  PenLine,
  LogOut,
  Clock,
  X,
} from "lucide-react";

export default function ClassroomLayout({ isHost }: { isHost: boolean }) {
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const participants = useParticipants();
  const screenShareTracks = useTracks([Track.Source.ScreenShare]);
  
  const [activePanel, setActivePanel] = useState<"whiteboard" | "screenshare">("whiteboard");
  const [openSidebar, setOpenSidebar] = useState<"chat" | "participants" | null>(null);
  const [handRaised, setHandRaised] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const isConnected = connectionState === ConnectionState.Connected;

  // Auto-switch to Screen Share when someone starts sharing
  useEffect(() => {
    if (screenShareTracks.length > 0 && activePanel !== "screenshare") {
      setActivePanel("screenshare");
    }
  }, [screenShareTracks.length, activePanel]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsedTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const toggleSidebar = (panel: "chat" | "participants") => {
    setOpenSidebar((prev) => (prev === panel ? null : panel));
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#fbf9f8] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ── TOP BAR (Solid, Pinned) ─────── */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-[#e4e2e1] flex items-center justify-between px-4 md:px-6 z-20">
        {/* Left: session info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-[#2e2877] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-[#180d62] font-bold text-[15px] leading-tight">{room.name || "Kanvise Live Class"}</h1>
            <p className="text-[#787582] text-[11px] font-medium uppercase tracking-wider flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
              {isConnected ? "Live" : "Connecting"} · {room.metadata || "Mathematics · SS3"}
            </p>
          </div>
        </div>

        {/* Centre: Canvas Tabs */}
        <div className="hidden md:flex items-center bg-[#f5f3f2] p-1 rounded-lg border border-[#e4e2e1]">
          <button
            onClick={() => setActivePanel("whiteboard")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all
              ${activePanel === "whiteboard" ? "bg-white text-[#180d62] shadow-sm" : "text-[#787582] hover:text-[#180d62]"}`}
          >
            <PenLine size={14} />
            Whiteboard
          </button>
          <button
            onClick={() => setActivePanel("screenshare")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all
              ${activePanel === "screenshare" ? "bg-white text-[#180d62] shadow-sm" : "text-[#787582] hover:text-[#180d62]"}`}
          >
            <MonitorPlay size={14} />
            Screen Share
            {screenShareTracks.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-green-500 ml-1 animate-pulse" />
            )}
          </button>
        </div>

        {/* Right: timer + role + leave */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <span className={`hidden lg:inline text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded
            ${isHost ? "bg-[#994704] text-white" : "bg-[#2e2877]/10 text-[#2e2877]"}`}>
            {isHost ? "Tutor" : "Student"}
          </span>

          <div className="hidden sm:flex items-center gap-1.5 text-[#787582] text-[13px] border-l border-[#e4e2e1] pl-4">
            <Clock size={14} />
            <span className="font-semibold">{formatTime(elapsedTime)}</span>
          </div>
          
          <DisconnectButton
            className="flex items-center gap-1.5 bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/20 text-[#ba1a1a] px-4 py-2 rounded-lg text-[13px] font-bold transition-all ml-2"
          >
            <LogOut size={15} />
            <span className="hidden md:inline">Leave</span>
          </DisconnectButton>
        </div>
      </header>

      {/* ── MAIN BODY ─────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-[#f5f3f2] relative">
          <div className="flex-1 relative bg-black">
            <VideoPiP />
            
            {activePanel === "whiteboard" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#f5f3f2]">
                <div className="w-16 h-16 rounded-2xl bg-[#2e2877]/8 flex items-center justify-center">
                  <PenLine size={28} className="text-[#180d62]/40" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-semibold text-[#180d62]/50">Whiteboard is loading...</p>
                  <p className="text-[13px] text-[#787582] mt-1">tldraw collaborative whiteboard will appear here</p>
                </div>
              </div>
            )}
            {activePanel === "screenshare" && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {screenShareTracks.length > 0 ? (
                  <VideoTrack 
                    trackRef={screenShareTracks[0]} 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <MonitorPlay size={28} className="text-white/40" />
                    </div>
                    <div className="text-center">
                      <p className="text-[15px] font-semibold text-white/50">No screen being shared</p>
                      <p className="text-[13px] text-white/30 mt-1">
                        {isHost ? "Use the Share Screen button below to begin" : "Waiting for host to share screen"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── SIDEBAR PANEL (Pushes content, always mounted to preserve state) ────── */}
        <div className={`flex-shrink-0 flex flex-col bg-white z-20 transition-all duration-300 overflow-hidden
          ${openSidebar ? "w-[320px] border-l border-[#e4e2e1]" : "w-0 border-none"}`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e2e1] bg-[#fbf9f8] min-w-[320px]">
            <div className="flex gap-1 bg-[#f5f3f2] p-1 rounded-lg border border-[#e4e2e1]">
              <button
                onClick={() => setOpenSidebar("chat")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-semibold transition-all
                  ${openSidebar === "chat" ? "bg-white text-[#180d62] shadow-sm" : "text-[#787582] hover:text-[#180d62]"}`}
              >
                <MessageSquare size={13} />
                Chat
              </button>
              <button
                onClick={() => setOpenSidebar("participants")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-semibold transition-all
                  ${openSidebar === "participants" ? "bg-white text-[#180d62] shadow-sm" : "text-[#787582] hover:text-[#180d62]"}`}
              >
                <Users size={13} />
                People ({participants.length})
              </button>
            </div>
            <button
              onClick={() => setOpenSidebar(null)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#787582] hover:bg-[#f5f3f2] hover:text-[#180d62] transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-hidden relative min-w-[320px]">
            <div className={`absolute inset-0 transition-opacity duration-200 ${openSidebar === "chat" ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"}`}>
              <ChatBox />
            </div>
            
            <div className={`absolute inset-0 transition-opacity duration-200 ${openSidebar === "participants" ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"}`}>
              <ParticipantsPanel isHost={isHost} />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM TOOLBAR (Solid, Pinned) ─────────── */}
      <footer className="flex-shrink-0 h-[80px] bg-white border-t border-[#e4e2e1] flex items-center justify-between px-4 md:px-6 shadow-[0_-4px_20px_rgba(24,13,98,0.03)] z-20">
        {/* Left: Participant count */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5 text-[#787582] text-[13px] font-medium bg-[#f5f3f2] px-3 py-2 rounded-lg border border-[#e4e2e1]">
            <Users size={15} />
            <span className="hidden sm:inline">{participants.length} Participants</span>
            <span className="sm:hidden">{participants.length}</span>
          </div>
        </div>

        {/* Centre: Media Controls */}
        <div className="flex items-center gap-3">
          <AudioVideoControls />
          
          {isHost && (
            <TrackToggle
              source={Track.Source.ScreenShare}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all border
                ${screenShareTracks.length > 0
                  ? "bg-[#994704] text-white border-[#994704] shadow-md"
                  : "bg-[#f5f3f2] hover:bg-[#e4e2e1] text-[#180d62] border-[#e4e2e1]"
                }`}
            >
              <MonitorPlay size={16} />
              <span className="hidden md:inline">{screenShareTracks.length > 0 ? "Stop Share" : "Share Screen"}</span>
            </TrackToggle>
          )}

          {!isHost && (
            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all border
                ${handRaised
                  ? "bg-[#994704] text-white border-[#994704] shadow-md"
                  : "bg-[#f5f3f2] hover:bg-[#e4e2e1] text-[#180d62] border-[#e4e2e1]"
                }`}
            >
              <Hand size={16} />
              <span className="hidden md:inline">{handRaised ? "Lower Hand" : "Raise Hand"}</span>
            </button>
          )}
        </div>

        {/* Right: Sidebar Toggles */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => toggleSidebar("chat")}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all border
              ${openSidebar === "chat"
                ? "bg-[#180d62] text-white border-[#180d62]"
                : "bg-white hover:bg-[#f5f3f2] text-[#787582] hover:text-[#180d62] border-[#e4e2e1]"
              }`}
          >
            <MessageSquare size={16} />
            <span className="hidden sm:inline">Chat</span>
          </button>
          <button
            onClick={() => toggleSidebar("participants")}
            className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all border
              ${openSidebar === "participants"
                ? "bg-[#180d62] text-white border-[#180d62]"
                : "bg-white hover:bg-[#f5f3f2] text-[#787582] hover:text-[#180d62] border-[#e4e2e1]"
              }`}
          >
            <Users size={16} />
            <span className="hidden sm:inline">People</span>
            {participants.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#994704] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {participants.length}
              </span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ── SUB-COMPONENTS ─────────────────────────────────────────── */

function ParticipantRow({ name, isHost }: { name: string; isHost: boolean }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f3f2] transition-colors group">
      <div className="w-8 h-8 rounded-full bg-[#2e2877] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
        {initials}
      </div>
      <span className="text-[13px] font-medium text-[#1b1c1c] flex-1 truncate">{name}</span>
      {isHost && (
        <div className="hidden group-hover:flex items-center gap-1">
          <button
            title="Mute"
            className="w-7 h-7 rounded-lg text-[#787582] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 flex items-center justify-center transition-all text-[11px] font-bold"
          >
            M
          </button>
          <button
            title="Remove"
            className="w-7 h-7 rounded-lg text-[#787582] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 flex items-center justify-center transition-all"
          >
            <LogOut size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
