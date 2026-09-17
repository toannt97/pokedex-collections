import { describe, expect, it, vi } from "vitest";

import { ApiError, getJson } from "./clients";

const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/25/";

const stubFetch = (response: Response) => {
  const fetchMock = vi.fn(() => Promise.resolve(response));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const stubFetchFailure = (error: unknown) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.reject(error)),
  );
};

describe("getJson", () => {
  it("returns the parsed JSON body", async () => {
    stubFetch(Response.json({ name: "pikachu" }));

    await expect(getJson(POKEMON_URL)).resolves.toEqual({ name: "pikachu" });
  });

  it("passes the abort signal to fetch", async () => {
    const fetchMock = stubFetch(Response.json({}));
    const controller = new AbortController();

    await getJson(POKEMON_URL, controller.signal);

    expect(fetchMock).toHaveBeenCalledWith(POKEMON_URL, { signal: controller.signal });
  });

  it("throws a not found ApiError for a 404 response", async () => {
    stubFetch(new Response(null, { status: 404 }));

    const error = await getJson(POKEMON_URL).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: "Not found.", status: 404 });
  });

  it("throws an unavailable ApiError for other error responses", async () => {
    stubFetch(new Response(null, { status: 500 }));

    const error = await getJson(POKEMON_URL).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: "The Pokédex is unavailable right now.", status: 500 });
  });

  it("throws a network ApiError when the request can't be made", async () => {
    stubFetchFailure(new TypeError("Failed to fetch"));

    const error = await getJson(POKEMON_URL).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      message: "Network unavailable. Check your connection.",
      status: undefined,
    });
  });

  it("rethrows an AbortError unchanged", async () => {
    const abortError = new DOMException("The operation was aborted.", "AbortError");
    stubFetchFailure(abortError);

    await expect(getJson(POKEMON_URL)).rejects.toBe(abortError);
  });
});
