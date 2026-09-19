import {
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconRoute,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { useFetch } from "../../hooks/use-fetch";
import {
  listReservations,
  listTrips,
  listUsers,
  listVehicles,
} from "../../lib/api";
import type { Reservation, Trip, User, Vehicle } from "../../lib/types";
import { toArray } from "../../lib/to-array";
import { PageHeader } from "../../components/page-header";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

/* ---------- helpers ---------- */

function isInMonth(dateStr: string, year: number, month: number) {
  const date = new Date(dateStr);
  return date.getFullYear() === year && date.getMonth() === month;
}

function countInMonth<T>(
  items: T[] | null | undefined,
  getDate: (item: T) => string,
  offset = 0,
) {
  if (!Array.isArray(items)) return 0;
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  return items.filter((item) =>
    isInMonth(getDate(item), target.getFullYear(), target.getMonth()),
  ).length;
}

function deltaPercent(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Il y a ${days} j`;
  const months = Math.floor(days / 30);
  return `Il y a ${months} mois`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

/* ---------- components ---------- */

function StatCard({
  label,
  value,
  delta,
  loading,
}: {
  label: string;
  value: number;
  delta: number | null;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {delta !== null && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
              delta > 0
                ? "text-emerald-600 dark:text-emerald-500"
                : delta < 0
                  ? "text-red-600 dark:text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {delta > 0 ? (
              <IconArrowUp className="size-3" aria-hidden="true" />
            ) : delta < 0 ? (
              <IconArrowDown className="size-3" aria-hidden="true" />
            ) : null}
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        )}
      </div>
      {loading ? (
        <Skeleton className="mt-2.5 h-8 w-16" />
      ) : (
        <p className="mt-2.5 text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </p>
      )}
    </div>
  );
}

export default function DashboardIndex() {
  const [now] = useState(() => Date.now());
  const { data: users, loading: usersLoading } = useFetch<User[]>(listUsers);
  const { data: trips, loading: tripsLoading } = useFetch<Trip[]>(listTrips);
  const { data: vehicles, loading: vehiclesLoading } =
    useFetch<Vehicle[]>(listVehicles);
  const { data: reservations, loading: reservationsLoading } =
    useFetch<Reservation[]>(listReservations);

  const loading =
    usersLoading || tripsLoading || vehiclesLoading || reservationsLoading;

  const usersList = toArray<User>(users);
  const tripsList = toArray<Trip>(trips);
  const vehiclesList = toArray<Vehicle>(vehicles);
  const reservationsList = toArray<Reservation>(reservations);

  const usersThisMonth = countInMonth(usersList, (user) => user.createdAt);
  const usersLastMonth = countInMonth(usersList, (user) => user.createdAt, 1);
  const tripsThisMonth = countInMonth(tripsList, (trip) => trip.createdAt);
  const tripsLastMonth = countInMonth(tripsList, (trip) => trip.createdAt, 1);

  const stats = [
    {
      label: "Utilisateurs inscrits ce mois",
      value: usersThisMonth,
      delta: deltaPercent(usersThisMonth, usersLastMonth),
    },
    {
      label: "Trajets créés ce mois",
      value: tripsThisMonth,
      delta: deltaPercent(tripsThisMonth, tripsLastMonth),
    },
    {
      label: "Véhicules enregistrés",
      value: vehiclesList.length,
      delta: null,
    },
    {
      label: "Réservations effectuées",
      value: reservationsList.length,
      delta: null,
    },
  ];

  const activity = [
    ...usersList.map((user) => ({
      id: `user-${user.id}`,
      icon: IconUser,
      title: `Nouvel utilisateur : ${user.name}`,
      time: user.createdAt,
    })),
    ...tripsList.map((trip) => ({
      id: `trip-${trip.id}`,
      icon: IconRoute,
      title: `Trajet créé : ${trip.origin} → ${trip.destination}`,
      time: trip.createdAt,
    })),
    ...reservationsList.map((reservation) => ({
      id: `res-${reservation.id}`,
      icon: IconCalendar,
      title: `Réservation sur le trajet ${reservation.tripId}`,
      time: reservation.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6);

  const currentTrips = tripsList
    .filter((trip) => new Date(trip.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité de la plateforme"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            delta={card.delta}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Activité récente</p>
          </div>
          {loading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Aucune activité récente.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <item.icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {timeAgo(item.time)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Trajets à venir</p>
          </div>
          {loading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : currentTrips.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Aucun trajet à venir.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {currentTrips.map((trip) => (
                <li
                  key={trip.id}
                  className="px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-semibold">
                      {trip.origin} → {trip.destination}
                    </p>
                    <Badge
                      variant={
                        trip.frequency === "weekly" ? "secondary" : "outline"
                      }
                      className="shrink-0 text-[10px]"
                    >
                      {trip.frequency}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span>
                      {formatDate(trip.date)} · {trip.time}
                    </span>
                    <span className="tabular-nums">
                      {trip.price.toLocaleString("fr-FR")} · {trip.seats} places
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
