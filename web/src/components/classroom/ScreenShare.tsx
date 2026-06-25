"use client";

import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function ScreenShare() {
  return (
    <TrackToggle
      source={Track.Source.ScreenShare}
      className="lk-button bg-surface-variant text-on-surface-variant font-semibold px-4 py-2 rounded-lg hover:bg-outline/20 transition-colors"
    >
      Share Screen
    </TrackToggle>
  );
}
