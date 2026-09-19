import type { ReactNode } from "react";
import { toArray } from "../lib/to-array";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function DataTable<T>({
  columns,
  rows,
  loading,
  error,
  emptyMessage,
  rowKey,
  renderRow,
}: {
  columns: { label: string; className?: string }[];
  rows: T[] | unknown;
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  rowKey: (row: T) => string;
  renderRow: (row: T) => ReactNode;
}) {
  const safeRows = toArray<T>(rows);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.label} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.label}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-destructive"
              >
                {error}
              </TableCell>
            </TableRow>
          ) : safeRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            safeRows.map((row) => (
              <TableRow key={rowKey(row)}>{renderRow(row)}</TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
