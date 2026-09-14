import { env } from "./env";

const API_BASE_URL = env.VITE_API_BASE_URL;

function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    // Session cookies are set by the server: they are sent with every request.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export function signIn(input: { email: string; password: string }) {
  return apiFetch("/api/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function signUp(input: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch("/api/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getMe() {
  return apiFetch("/api/users/me");
}
