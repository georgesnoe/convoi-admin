import { env } from "./env";
import type { Message, Reservation, Trip, User, Vehicle } from "./types";

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

/* ---------- Auth ---------- */

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

export function signOut() {
  return apiFetch("/api/auth/sign-out", { method: "POST" });
}

/* ---------- Users ---------- */

export function getMe() {
  return apiFetch("/api/users/me");
}

export function updateMe(
  input: Partial<Pick<User, "name" | "image" | "type">>,
) {
  return apiFetch("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function listUsers() {
  return apiFetch("/api/users");
}

/* ---------- Vehicles ---------- */

export function listVehicles() {
  return apiFetch("/api/vehicles");
}

export function createVehicle(
  input: Omit<Vehicle, "id" | "ownerId" | "createdAt">,
) {
  return apiFetch("/api/vehicles", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateVehicle(id: string, input: Partial<Vehicle>) {
  return apiFetch(`/api/vehicles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteVehicle(id: string) {
  return apiFetch(`/api/vehicles/${id}`, { method: "DELETE" });
}

/* ---------- Trips ---------- */

export function listTrips() {
  return apiFetch("/api/trips");
}

export function createTrip(
  input: Omit<Trip, "id" | "conductorId" | "createdAt">,
) {
  return apiFetch("/api/trips", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTrip(id: string, input: Partial<Trip>) {
  return apiFetch(`/api/trips/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTrip(id: string) {
  return apiFetch(`/api/trips/${id}`, { method: "DELETE" });
}

/* ---------- Reservations ---------- */

export function listReservations() {
  return apiFetch("/api/reservations");
}

export function createReservation(
  input: Omit<Reservation, "id" | "passengerId" | "createdAt">,
) {
  return apiFetch("/api/reservations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateReservation(id: string, input: Partial<Reservation>) {
  return apiFetch(`/api/reservations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteReservation(id: string) {
  return apiFetch(`/api/reservations/${id}`, { method: "DELETE" });
}

/* ---------- Messages ---------- */

export function listMessages() {
  return apiFetch("/api/messages");
}

export function sendMessage(
  input: Omit<Message, "id" | "senderId" | "read" | "createdAt">,
) {
  return apiFetch("/api/messages", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateMessage(id: string, input: Partial<Message>) {
  return apiFetch(`/api/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteMessage(id: string) {
  return apiFetch(`/api/messages/${id}`, { method: "DELETE" });
}
