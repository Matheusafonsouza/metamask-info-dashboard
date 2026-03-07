import { NextResponse } from "next/server";
import { issueNonce } from "@/lib/siwe/nonce-store";

export async function GET() {
  const nonce = issueNonce();

  return NextResponse.json(
    { nonce },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
