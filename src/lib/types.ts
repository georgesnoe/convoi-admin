export type UserType = "conductor" | "passenger";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  type: UserType;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  color?: string | null;
  plate?: string | null;
  seats: number;
  createdAt: string;
}

export interface Trip {
  id: string;
  conductorId: string;
  vehicleId: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  frequency: "once" | "weekly";
  weekDays?: number | null;
  createdAt: string;
}

export interface Reservation {
  id: string;
  tripId: string;
  passengerId: string;
  seats: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}
