import { useFetch } from "../../hooks/use-fetch";
import { listReservations } from "../../lib/api";
import { toArray } from "../../lib/to-array";
import type { Reservation } from "../../lib/types";
import { PageHeader } from "../../components/page-header";
import { DataTable } from "../../components/data-table";
import { Badge } from "../../components/ui/badge";
import { TableCell } from "../../components/ui/table";

export default function ReservationsPage() {
  const {
    data: reservations,
    loading,
    error,
  } = useFetch<Reservation[]>(listReservations);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Réservations"
        description="Réservations effectuées sur les trajets"
      />
      <DataTable
        columns={[
          { label: "Trajet" },
          { label: "Passager" },
          { label: "Places" },
          { label: "Statut" },
          { label: "Créée le" },
        ]}
        rows={toArray<Reservation>(reservations)}
        loading={loading}
        error={error}
        emptyMessage="Aucune réservation."
        rowKey={(reservation) => reservation.id}
        renderRow={(reservation) => (
          <>
            <TableCell className="font-medium">{reservation.tripId}</TableCell>
            <TableCell>{reservation.passengerId}</TableCell>
            <TableCell>{reservation.seats}</TableCell>
            <TableCell>
              <Badge
                variant={
                  reservation.status === "confirmed"
                    ? "default"
                    : reservation.status === "pending"
                      ? "secondary"
                      : "outline"
                }
              >
                {reservation.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(reservation.createdAt).toLocaleDateString()}
            </TableCell>
          </>
        )}
      />
    </div>
  );
}
