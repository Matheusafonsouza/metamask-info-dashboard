type ErrorPayload = {
  error?: string;
  message?: string;
};

function getErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const typed = payload as ErrorPayload;

  if (typed.error && typed.error.length > 0) {
    return typed.error;
  }

  if (typed.message && typed.message.length > 0) {
    return typed.message;
  }

  return null;
}

export async function requestJson<T>(
  path: string,
  init: RequestInit,
  fallbackError: string,
): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
    ...init,
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(payload) ?? fallbackError);
  }

  return payload as T;
}
