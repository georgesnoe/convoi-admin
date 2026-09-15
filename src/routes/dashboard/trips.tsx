import { useFetch } from "../../hooks/use-fetch";
import { listTrips } from "../../lib/api";
import type { Trip } from "../../lib/types";
import { PageHeader } from "../../components/page-header";
import { DataTable } from "../../components/data-table";
import { Badge } from "../../components/ui/badge";
import { TableCell } from "../../components/ui/table";

export default function TripsPage() {
  const { data: trips, loading, error } = useFetch<Trip[]>(listTrips);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Trajets"
        description="Trajets publiés par les conducteurs"
      />
      <DataTable
        columns={[
          { label: "Départ" },
          { label: "Destination" },
          { label: "Date" },
          { label: "Heure" },
          { label: "Prix" },
          { label: "Places" },
          { label: "Fréquence" },
        ]}
        rows={trips ?? []}
        loading={loading}
        error={error}
        emptyMessage="Aucun trajet."
        rowKey={(trip) => trip.id}
        renderRow={(trip) => (
          <>
            <TableCell className="font-medium">{trip.origin}</TableCell>
            <TableCell>{trip.destination}</TableCell>
            <TableCell>{new Date(trip.date).toLocaleDateString()}</TableCell>
            <TableCell>{trip.time}</TableCell>
            <TableCell>{trip.price.toLocaleString("fr-FR")}</TableCell>
            <TableCell>{trip.seats}</TableCell>
            <TableCell>
              <Badge
                variant={trip.frequency === "weekly" ? "secondary" : "outline"}
              >
                {trip.frequency}
              </Badge>
            </TableCell>
          </>
        )}
      />
    </div>
  );
}
