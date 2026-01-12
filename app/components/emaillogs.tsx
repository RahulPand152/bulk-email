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

type TableRow = {
  id: string;
  subject: string;
  email: string;
  status: "SENT" | "FAILED";
  error: string | null;
  timestamp: string;
};



export default function EmailLogsPage() {
  const [logs, setLogs] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/email-logs");
        const data = await res.json();

        if (data.success && Array.isArray(data.logs)) {
          const formatted: TableRow[] = data.logs.map((log: any) => ({
            id: log.id,
            subject: log.subject,
            email: log.to,
            status: log.status,
            error: log.error ?? "-",
            timestamp: log.createdAt,
          }));

          setLogs(formatted);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  

  const data = useMemo(
    () =>
      logs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
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



  if (loading) return <p className="p-6">Loading email logs...</p>;
  if (!logs.length) return <p className="p-6">No email logs found.</p>;



  return (
    <div className="max-w-7xl mx-auto px-4 py-6 ">
      <h1 className="text-2xl font-bold mb-4"> Email Logs</h1>

      <div className="overflow-x-auto rounded-xl shadow ">
        <table className="w-full text-sm border-collapse dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold"
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
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
