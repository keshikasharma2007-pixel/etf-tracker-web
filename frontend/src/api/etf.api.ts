import { ETFApiResponse } from "../types/etf.types";

// In dev, Vite's proxy forwards /api → localhost:3001 (see vite.config.ts)
// In prod, we call the Render backend directly via the env variable
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function fetchETFs(): Promise<ETFApiResponse> {
  const res = await fetch(`${BASE_URL}/api/etfs`);

  if (!res.ok) {
    // Throw an Error with the status code so TanStack Query can surface it properly
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ETFApiResponse>;
}
