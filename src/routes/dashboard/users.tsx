import { useFetch } from "../../hooks/use-fetch";
import { listUsers } from "../../lib/api";
import type { User } from "../../lib/types";
import { PageHeader } from "../../components/page-header";
import { DataTable } from "../../components/data-table";
import { Badge } from "../../components/ui/badge";
import { TableCell } from "../../components/ui/table";

export default function UsersPage() {
  const { data: users, loading, error } = useFetch<User[]>(listUsers);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Utilisateurs"
        description="Tous les utilisateurs de la plateforme"
      />
      <DataTable
        columns={[
          { label: "Nom" },
          { label: "Email" },
          { label: "Type" },
          { label: "Créé le" },
        ]}
        rows={users ?? []}
        loading={loading}
        error={error}
        emptyMessage="Aucun utilisateur."
        rowKey={(user) => user.id}
        renderRow={(user) => (
          <>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={user.type === "conductor" ? "default" : "secondary"}
              >
                {user.type}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
          </>
        )}
      />
    </div>
  );
}
