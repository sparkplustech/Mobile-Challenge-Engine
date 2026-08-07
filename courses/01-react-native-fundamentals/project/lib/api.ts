/** Stub — API helpers; implement per challenge 05 README */

export type ApiPost = { id: number; title: string; body: string };

export async function fetchPosts(): Promise<ApiPost[]> {
  return [];
}

export async function fetchUsers(): Promise<unknown[]> {
  return [];
}

export async function fetchWeather(_city: string): Promise<unknown> {
  return null;
}
