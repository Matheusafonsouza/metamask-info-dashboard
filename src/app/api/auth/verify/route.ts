import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import { SIWE_ALLOWED_CHAIN_IDS, getExpectedDomain, getExpectedUri } from "@/lib/siwe/config";
import { consumeNonce } from "@/lib/siwe/nonce-store";
import { createSession, setSessionCookie } from "@/lib/siwe/session";

type VerifyBody = {
  message?: string;
  signature?: string;
};

export async function POST(request: NextRequest) {
  let payload: VerifyBody;

  try {
    payload = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!payload.message || !payload.signature) {
    return NextResponse.json({ error: "Message and signature are required." }, { status: 400 });
  }

  try {
    const siweMessage = new SiweMessage(payload.message);
    const expectedDomain = getExpectedDomain(request);
    const expectedUri = getExpectedUri(request);

    if (siweMessage.domain !== expectedDomain) {
      return NextResponse.json({ error: "SIWE domain mismatch." }, { status: 400 });
    }

    if (siweMessage.uri !== expectedUri) {
      return NextResponse.json({ error: "SIWE URI mismatch." }, { status: 400 });
    }

    if (!SIWE_ALLOWED_CHAIN_IDS.includes(siweMessage.chainId as (typeof SIWE_ALLOWED_CHAIN_IDS)[number])) {
      return NextResponse.json({ error: "Unsupported chain for SIWE." }, { status: 400 });
    }

    if (!consumeNonce(siweMessage.nonce)) {
      return NextResponse.json({ error: "Nonce is invalid or expired." }, { status: 400 });
    }

    const verificationResult = await siweMessage.verify({
      signature: payload.signature,
      domain: expectedDomain,
      nonce: siweMessage.nonce,
      time: new Date().toISOString(),
    });

    if (!verificationResult.success) {
      return NextResponse.json({ error: "Signature verification failed." }, { status: 401 });
    }

    const sessionToken = createSession(verificationResult.data.address, verificationResult.data.chainId);

    const response = NextResponse.json({
      authenticated: true,
      session: {
        address: verificationResult.data.address,
        chainId: verificationResult.data.chainId,
      },
    });

    setSessionCookie(response, sessionToken);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify SIWE signature.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
