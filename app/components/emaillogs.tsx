"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type RecipientLog = {
  id: string;
  to: string;
  status: "SENT" | "FAILED";
  error?: string | null;
  timestamp: string;
};

type EmailLog = {
  id: string;
  subject: string;
  templateId?: string;
  sentAt: string;
  totalRecipients: number;
  sent: number;
  failed: number;
  recipients: RecipientLog[];
};

// Flattened row type for table
type TableRow = {
  id: string;
  subject: string;
  email: string;
  status: "SENT" | "FAILED";
  error: string | null;
  timestamp: string;
};

export default function EmailLogsTable() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/email-logs");
        const data = await res.json();
        setLogs(data || []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Flatten all recipients into table rows - MUST BE BEFORE EARLY RETURNS
  const data: TableRow[] = useMemo(
    () =>
      logs
        .flatMap((log) =>
          (log.recipients || []).map((r) => ({
            id: r.id,
            subject: log.subject,
            email: r.to,
            status: r.status,
            error: r.error || "-",
            timestamp: r.timestamp,
          }))
        )
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ), // <-- sort DESC
    [logs]
  );

  const columnHelper = createColumnHelper<TableRow>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("subject", {
        header: "Subject",
      }),
      columnHelper.accessor("email", {
        header: "Email",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <Badge
            variant={info.getValue() === "SENT" ? "default" : "destructive"}
          >
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("error", {
        header: "Error",
      }),
      columnHelper.accessor("timestamp", {
        header: "Sent At",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // NOW we can do early returns after all hooks are called
  if (loading) return <p>Loading email logs...</p>;
  if (!logs.length) return <p>No email logs found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center sm:text-left">
        Email Logs
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-background">
        <table className="w-full min-w-[520px] sm:min-w-[640px] md:min-w-[720px] text-xs sm:text-sm md:text-base border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold
                           text-gray-700 dark:text-gray-200 whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 sm:px-4 py-2 text-left whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
        <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <div className="flex gap-2 justify-center sm:justify-end">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 sm:px-4 py-2 rounded-md text-sm
                   bg-gray-200 hover:bg-gray-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 sm:px-4 py-2 rounded-md text-sm
                   bg-blue-500 text-white hover:bg-blue-600
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
