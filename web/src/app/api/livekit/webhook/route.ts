import { WebhookReceiver } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY || "",
  process.env.LIVEKIT_API_SECRET || ""
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const event = await receiver.receive(body, authHeader);
    
    // Auto-track attendance
    if (event.event === "participant_joined") {
      console.log(`[ATTENDANCE] User joined: ${event.participant?.identity} in room ${event.room?.name}`);
      // TODO: Save to database or call attendance service
    } else if (event.event === "participant_left") {
      console.log(`[ATTENDANCE] User left: ${event.participant?.identity} from room ${event.room?.name}`);
      // TODO: Save to database or call attendance service
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error validating webhook event", error);
    return new NextResponse("Error", { status: 500 });
  }
}
