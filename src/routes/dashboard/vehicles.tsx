import { useFetch } from "../../hooks/use-fetch";
import { listVehicles } from "../../lib/api";
import { toArray } from "../../lib/to-array";
import type { Vehicle } from "../../lib/types";
import { PageHeader } from "../../components/page-header";
import { DataTable } from "../../components/data-table";
import { TableCell } from "../../components/ui/table";

export default function VehiclesPage() {
  const { data: vehicles, loading, error } = useFetch<Vehicle[]>(listVehicles);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Véhicules"
        description="Véhicules enregistrés par les conducteurs"
      />
      <DataTable
        columns={[
          { label: "Marque" },
          { label: "Modèle" },
          { label: "Année" },
          { label: "Places" },
          { label: "Immatriculation" },
        ]}
        rows={toArray(vehicles)}
        loading={loading}
        error={error}
        emptyMessage="Aucun véhicule."
        rowKey={(vehicle) => vehicle.id}
        renderRow={(vehicle) => (
          <>
            <TableCell className="font-medium">{vehicle.make}</TableCell>
            <TableCell>{vehicle.model}</TableCell>
            <TableCell>{vehicle.year}</TableCell>
            <TableCell>{vehicle.seats}</TableCell>
            <TableCell className="text-muted-foreground">
              {vehicle.plate ?? "—"}
            </TableCell>
          </>
        )}
      />
    </div>
  );
}
