"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SiweMessage } from "siwe";
import { useSignMessage } from "wagmi";
import {
  fetchSiweSession,
  logoutSiweSession,
  requestSiweNonce,
  verifySiweSignature,
} from "@/lib/api/auth";
import { SIWE_STATEMENT } from "@/lib/siwe/config";
import type { SiweSession } from "@/types/auth";

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
      const data = await fetchSiweSession();

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
    if (!enabled || !address) {
      setSession(null);
      setIsSessionLoading(false);
      return;
    }

    void refreshSession();
  }, [address, enabled, refreshSession]);

  const signIn = useCallback(async () => {
    if (!enabled || !address || !chainId) {
      setAuthError("Connect your wallet before signing in.");
      return false;
    }

    setAuthError(null);
    setIsSigningIn(true);

    try {
      const nonce = await requestSiweNonce();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: SIWE_STATEMENT,
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      }).prepareMessage();

      const signature = await signMessageAsync({ message });

      await verifySiweSignature({ message, signature });

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
      await logoutSiweSession();

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
