export type SiweSession = {
  address: string;
  chainId: number;
  issuedAt: number;
  expiresAt: number;
};

export type SessionResponse = {
  authenticated: boolean;
  session?: SiweSession;
  error?: string;
};
