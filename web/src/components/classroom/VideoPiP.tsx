"use client";

import { useParticipants, useTracks, VideoTrack, useSpeakingParticipants } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function VideoPiP() {
  const participants = useParticipants();
  const cameraTracks = useTracks([Track.Source.Camera]);
  const activeSpeakers = useSpeakingParticipants();

  // Find the tutor based on the metadata we inject in the token route
  const tutor = participants.find((p) => {
    try {
      const meta = JSON.parse(p.metadata || "{}");
      return meta.isHost === true;
    } catch (e) {
      return false;
    }
  });

  // Find the active student (not the tutor, has camera enabled, and is actively speaking)
  // We sort by speaking volume implicitly since useActiveSpeakers orders by activity
  const activeStudent = activeSpeakers.find(
    (p) => p.identity !== tutor?.identity && p.isCameraEnabled
  );

  const tutorTrack = cameraTracks.find((t) => t.participant.identity === tutor?.identity);
  const studentTrack = cameraTracks.find((t) => t.participant.identity === activeStudent?.identity);

  // If neither has video on, don't render the PiP container at all
  if (!tutorTrack && !studentTrack) return null;

  return (
    <div className="absolute top-4 right-4 z-10 flex items-start gap-3 pointer-events-none">
      {/* Secondary PiP: Active Student (Only appears when they are speaking with video on) */}
      {studentTrack && activeStudent && (
        <div className="w-32 h-24 rounded-lg overflow-hidden border-2 border-[#994704] shadow-lg shadow-black/20 bg-[#1b1c1c] relative pointer-events-auto transition-all animate-in fade-in slide-in-from-right-4">
          <VideoTrack trackRef={studentTrack} className="w-full h-full object-cover" />
          <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="truncate max-w-[80px]">{activeStudent.name || activeStudent.identity}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Primary PiP: Permanent Pinned Tutor */}
      {tutorTrack && tutor && (
        <div className="w-48 h-36 rounded-xl overflow-hidden border-2 border-[#180d62] shadow-xl shadow-black/20 bg-[#1b1c1c] relative pointer-events-auto">
          <VideoTrack trackRef={tutorTrack} className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded-md font-semibold flex items-center gap-1.5">
            <span>Tutor</span>
            {tutor.isSpeaking && (
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
