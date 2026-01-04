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
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), // <-- sort DESC
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Email Logs</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full min-w-[600px] table-auto divide-y">
          <thead className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-start px-4 py-3 text-gray-700 font-semibold"
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

          <tbody className="divide-y ">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 transition-colors rounded-lg"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-start">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
        <span className="ml-4 text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>  
  );
}
