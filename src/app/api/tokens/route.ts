import { NextRequest, NextResponse } from "next/server";
import { formatUnits, isAddress } from "viem";

type AlchemyTokenBalance = {
  contractAddress: string;
  tokenBalance: string;
};

type AlchemyTokenMetadata = {
  name?: string;
  symbol?: string;
  decimals?: number;
  logo?: string;
};

type TokenResponseItem = {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  balance: string;
};

type AlchemyRpcResult<T> = {
  result?: T;
  error?: {
    message?: string;
  };
};

const ZERO_HEX_BALANCES = new Set(["0x0", "0x", "0x00"]);

async function callAlchemy<T>(method: string, params: unknown[]) {
  const apiKey = process.env.ALCHEMY_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ALCHEMY_API_KEY in environment.");
  }

  const response = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method,
      params,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Alchemy request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as AlchemyRpcResult<T>;

  if (data.error) {
    throw new Error(data.error.message ?? "Alchemy returned an unknown error.");
  }

  if (typeof data.result === "undefined") {
    throw new Error("Alchemy returned an empty result.");
  }

  return data.result;
}

function formatTokenBalance(rawHexBalance: string, decimals: number) {
  const raw = BigInt(rawHexBalance);
  const formatted = formatUnits(raw, decimals);
  return Number(formatted) >= 1 ? Number(formatted).toLocaleString(undefined, { maximumFractionDigits: 6 }) : formatted;
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: "A valid wallet address is required." }, { status: 400 });
  }

  try {
    const tokenBalancesResult = await callAlchemy<{ tokenBalances: AlchemyTokenBalance[] }>("alchemy_getTokenBalances", [address, "erc20"]);

    const nonZeroBalances = tokenBalancesResult.tokenBalances.filter((item) => !ZERO_HEX_BALANCES.has(item.tokenBalance.toLowerCase()));

    const metadata = await Promise.all(
      nonZeroBalances.map(async (item) => {
        try {
          return await callAlchemy<AlchemyTokenMetadata>("alchemy_getTokenMetadata", [item.contractAddress]);
        } catch {
          return null;
        }
      }),
    );

    const tokens: TokenResponseItem[] = nonZeroBalances.map((item, index) => {
      const tokenMeta = metadata[index];
      const decimals = tokenMeta?.decimals ?? 18;

      return {
        contractAddress: item.contractAddress,
        name: tokenMeta?.name ?? "Unknown Token",
        symbol: tokenMeta?.symbol ?? "UNKNOWN",
        decimals,
        logo: tokenMeta?.logo,
        balance: formatTokenBalance(item.tokenBalance, decimals),
      };
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load token balances.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
