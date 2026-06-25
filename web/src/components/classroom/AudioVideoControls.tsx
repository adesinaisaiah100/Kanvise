"use client";

import { useLocalParticipant } from "@livekit/components-react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

export default function AudioVideoControls() {
  const { localParticipant } = useLocalParticipant();
  const isMicEnabled = localParticipant?.isMicrophoneEnabled;
  const isCamEnabled = localParticipant?.isCameraEnabled;

  const toggleMic = async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!isMicEnabled);
    }
  };

  const toggleCam = async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(!isCamEnabled);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleMic}
        className={`flex items-center justify-center w-11 h-11 rounded-full transition-all border ${
          isMicEnabled
            ? "bg-[#180d62] text-white border-[#180d62] shadow-md hover:bg-[#180d62]/90"
            : "bg-[#ba1a1a]/10 text-[#ba1a1a] border-[#ba1a1a]/20 hover:bg-[#ba1a1a]/20"
        }`}
      >
        {isMicEnabled ? <Mic size={18} /> : <MicOff size={18} />}
      </button>

      <button
        onClick={toggleCam}
        className={`flex items-center justify-center w-11 h-11 rounded-full transition-all border ${
          isCamEnabled
            ? "bg-[#180d62] text-white border-[#180d62] shadow-md hover:bg-[#180d62]/90"
            : "bg-[#ba1a1a]/10 text-[#ba1a1a] border-[#ba1a1a]/20 hover:bg-[#ba1a1a]/20"
        }`}
      >
        {isCamEnabled ? <Video size={18} /> : <VideoOff size={18} />}
      </button>
    </div>
  );
}
