import { useFetch } from "../../hooks/use-fetch";
import { listMessages } from "../../lib/api";
import type { Message } from "../../lib/types";
import { PageHeader } from "../../components/page-header";
import { DataTable } from "../../components/data-table";
import { Badge } from "../../components/ui/badge";
import { TableCell } from "../../components/ui/table";

export default function MessagesPage() {
  const { data: messages, loading, error } = useFetch<Message[]>(listMessages);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Messages"
        description="Messages échangés entre utilisateurs"
      />
      <DataTable
        columns={[
          { label: "De" },
          { label: "À" },
          { label: "Contenu" },
          { label: "Lu" },
          { label: "Envoyé le" },
        ]}
        rows={messages ?? []}
        loading={loading}
        error={error}
        emptyMessage="Aucun message."
        rowKey={(message) => message.id}
        renderRow={(message) => (
          <>
            <TableCell className="font-medium">{message.senderId}</TableCell>
            <TableCell>{message.receiverId}</TableCell>
            <TableCell className="max-w-64 truncate">
              {message.content}
            </TableCell>
            <TableCell>
              <Badge variant={message.read ? "secondary" : "default"}>
                {message.read ? "Lu" : "Non lu"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(message.createdAt).toLocaleDateString()}
            </TableCell>
          </>
        )}
      />
    </div>
  );
}
