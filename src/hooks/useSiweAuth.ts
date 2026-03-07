"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SiweMessage } from "siwe";
import { useSignMessage } from "wagmi";
import { SIWE_STATEMENT } from "@/lib/siwe/config";
import type { SessionResponse, SiweSession } from "@/types/auth";

type UseSiweAuthParams = {
  address?: string;
  chainId?: number;
  enabled: boolean;
};

export function useSiweAuth({ address, chainId, enabled }: UseSiweAuthParams) {
  const { signMessageAsync, isPending: isSigningMessage } = useSignMessage();

  const [session, setSession] = useState<SiweSession | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const refreshSession = useCallback(async () => {
    setIsSessionLoading(true);

    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as SessionResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load authentication session.");
      }

      setSession(data.authenticated && data.session ? data.session : null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load authentication session.";
      setAuthError(message);
      setSession(null);
    } finally {
      setIsSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const signIn = useCallback(async () => {
    if (!enabled || !address || !chainId) {
      setAuthError("Connect your wallet before signing in.");
      return false;
    }

    setAuthError(null);
    setIsSigningIn(true);

    try {
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "GET",
        cache: "no-store",
      });

      const nonceData = (await nonceResponse.json()) as {
        nonce?: string;
        error?: string;
      };

      if (!nonceResponse.ok || !nonceData.nonce) {
        throw new Error(nonceData.error ?? "Unable to request SIWE nonce.");
      }

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: SIWE_STATEMENT,
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: nonceData.nonce,
      }).prepareMessage();

      const signature = await signMessageAsync({ message });

      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });

      const verifyData = (await verifyResponse.json()) as SessionResponse;

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error ?? "SIWE verification failed.");
      }

      await refreshSession();
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "SIWE sign-in failed.";
      setAuthError(message);
      return false;
    } finally {
      setIsSigningIn(false);
    }
  }, [address, chainId, enabled, refreshSession, signMessageAsync]);

  const signOut = useCallback(async () => {
    setAuthError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to sign out.");
      }

      await refreshSession();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign out.";
      setAuthError(message);
    }
  }, [refreshSession]);

  const isAuthenticated = useMemo(() => Boolean(session), [session]);
  const isBusy = isSigningIn || isSigningMessage || isSessionLoading;

  return {
    authError,
    isAuthenticated,
    isBusy,
    isSessionLoading,
    isSigningIn,
    session,
    signIn,
    signOut,
  };
}
