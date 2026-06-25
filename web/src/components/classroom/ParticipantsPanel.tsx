"use client";

import { useParticipants, useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { Hand, Users, UserMinus, MicOff } from "lucide-react";
import { useState } from "react";
import { Participant } from "livekit-client";

export default function ParticipantsPanel({ isHost }: { isHost: boolean }) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const roomContext = useRoomContext();

  // For this MVP, we simulate hand raising locally, but in a real app 
  // you would use LiveKit's participant metadata or data channels for this.
  const [handRaised, setHandRaised] = useState(false);

  const handleHostAction = async (action: "mute" | "kick", identity: string, trackSid?: string) => {
    try {
      const room = roomContext.name;
      const res = await fetch("/api/livekit/host", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, room, identity, trackSid }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(`Failed to ${action} participant:`, error);
        alert(`Failed to ${action} participant: ${error.error}`);
      }
    } catch (e) {
      console.error(`Error performing ${action}:`, e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        {/* Placeholder for Hand Raising */}
        {handRaised && (
          <div className="p-4 border-b border-[#e4e2e1] bg-[#994704]/5">
            <p className="text-[11px] font-bold text-[#994704] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Hand size={11} /> Raised Hands
            </p>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#994704]/20 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#994704] flex items-center justify-center text-white text-[12px] font-bold">
                Y
              </div>
              <span className="text-[13px] font-semibold text-[#180d62] flex-1">You</span>
              <Hand size={14} className="text-[#994704]" />
            </div>
          </div>
        )}

        <div className="p-4">
          <p className="text-[11px] font-bold text-[#787582] uppercase tracking-wider mb-3">
            In this class ({participants.length})
          </p>

          {participants.length === 0 ? (
            <div className="text-center py-10">
              <Users size={32} className="mx-auto text-[#c8c5d2] mb-2" />
              <p className="text-[13px] text-[#787582]">Waiting for participants...</p>
            </div>
          ) : (
            <div className="space-y-1">
              {participants.map((p) => {
                let isParticipantHost = false;
                try {
                  isParticipantHost = JSON.parse(p.metadata || "{}").isHost;
                } catch (e) {
                  // ignore
                }

                return (
                  <ParticipantRow
                    key={p.identity}
                    participant={p}
                    isHost={isHost}
                    isParticipantHost={isParticipantHost}
                    isMe={p.identity === localParticipant?.identity}
                    onAction={handleHostAction}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ParticipantRow({
  participant,
  isHost,
  isParticipantHost,
  isMe,
  onAction,
}: {
  participant: Participant;
  isHost: boolean;
  isParticipantHost: boolean;
  isMe: boolean;
  onAction: (action: "mute" | "kick", identity: string, trackSid?: string) => void;
}) {
  const name = participant.name || participant.identity;
  const initials = name.slice(0, 2).toUpperCase();

  // Find the audio track to mute if needed
  const audioTrack = participant.getTrackPublications().find(t => t.kind === "audio");

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f5f3f2] transition-colors group">
      <div className="w-8 h-8 rounded-full bg-[#2e2877] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 relative">
        {initials}
        {participant.isSpeaking && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-[#1b1c1c] truncate">{name} {isMe && "(You)"}</span>
          {isParticipantHost && (
            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#2e2877]/10 text-[#2e2877] px-1.5 py-0.5 rounded">
              Tutor
            </span>
          )}
        </div>
      </div>

      {isHost && !isMe && !isParticipantHost && (
        <div className="hidden group-hover:flex items-center gap-1">
          {audioTrack && !audioTrack.isMuted && (
            <button
              onClick={() => onAction("mute", participant.identity, audioTrack.trackSid)}
              title="Mute Microhpone"
              className="w-7 h-7 rounded-lg text-[#787582] hover:text-[#994704] hover:bg-[#994704]/10 flex items-center justify-center transition-all"
            >
              <MicOff size={13} />
            </button>
          )}
          <button
            onClick={() => onAction("kick", participant.identity)}
            title="Remove from Class"
            className="w-7 h-7 rounded-lg text-[#787582] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 flex items-center justify-center transition-all"
          >
            <UserMinus size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
