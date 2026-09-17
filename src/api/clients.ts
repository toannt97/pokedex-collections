export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { signal });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiError("Network unavailable. Check your connection.");
  }

  if (!res.ok) {
    throw new ApiError(
      res.status === 404 ? "Not found." : "The Pokédex is unavailable right now.",
      res.status,
    );
  }

  return res.json();
}
