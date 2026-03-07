import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/siwe/session";
import type { SessionResponse } from "@/types/auth";

export async function GET(request: NextRequest) {
  const session = readSession(request);

  if (!session) {
    return NextResponse.json<SessionResponse>({ authenticated: false }, { headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json<SessionResponse>(
    {
      authenticated: true,
      session,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
