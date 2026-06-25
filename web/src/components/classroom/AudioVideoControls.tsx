"use client";

import { TrackToggle, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function AudioVideoControls() {
  return (
    <div className="flex items-center gap-4">
      {/* 
        We use LiveKit's built in TrackToggle component which handles all the device 
        permissions and state management under the hood. We customize the CSS for our theme.
      */}
      <TrackToggle
        source={Track.Source.Microphone}
        className="lk-button"
      />

      <TrackToggle
        source={Track.Source.Camera}
        className="lk-button"
      />
    </div>
  );
}
