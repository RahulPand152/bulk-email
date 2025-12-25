"use client";

import { useState, useRef } from "react";
import ExcelJS from "exceljs";
import { CloudUpload, Download, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

// Type for table data
export type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

// CSV Template
const csvTemplate = [
  {
    FirstName: "Rahul",
    LastName: "Pandit",
    Email: "rahul@example.com",
    Phone: "9876543210",
  },
];

// Table columns
export const columns: ColumnDef<Contact>[] = [
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  { accessorKey: "phoneNumber", header: "Phone Number" },
];

export default function FileUploadAndTable() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [data, setData] = useState<Contact[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Handle file upload (CSV/XLSX)
  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());

    const sheet = workbook.worksheets[0];
    const rows = sheet.getSheetValues().slice(1); // skip first undefined row

    const jsonData = rows.map((row: any) => ({
      firstName: row[1]
        ? typeof row[1] === "object"
          ? row[1].text ?? ""
          : row[1]
        : "",
      lastName: row[2]
        ? typeof row[2] === "object"
          ? row[2].text ?? ""
          : row[2]
        : "",
      email: row[3]
        ? typeof row[3] === "object"
          ? row[3].text ?? ""
          : row[3]
        : "",
      phoneNumber: row[4]
        ? typeof row[4] === "object"
          ? row[4].text ?? ""
          : row[4]
        : "",
    }));

    setData(jsonData);
  };

  const handleBrowseClick = () => inputRef.current?.click();

  const downloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Contacts");
    sheet.columns = [
      { header: "FirstName", key: "FirstName" },
      { header: "LastName", key: "LastName" },
      { header: "Email", key: "Email" },
      { header: "Phone", key: "Phone" },
    ];
    sheet.addRows(csvTemplate);

    const buffer = await workbook.csv.writeBuffer();
    const blob = new Blob([buffer], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-template.csv";
    a.click();
  };

  return (
    <div className=" border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center space-y-4 shadow-lg">
      {/* File Upload Header */}
      <div className=" border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col space-y-1 text-left">
            <h2 className="font-semibold text-base sm:text-lg">
              Import Contacts
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload a CSV or Excel file to define your recipient list
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={downloadTemplate}
            className="p-0 h-auto flex items-center gap-1 self-start sm:self-auto hover:bg-transparent"
          >
            <Download className="h-4 w-4 text-blue-500 hover:text-blue-400" />
            <span className="text-sm text-blue-500 hover:text-blue-400">
              Download Sample Template
            </span>
          </Button>
        </div>

        {/* File Upload Area */}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          accept=".csv,.xlsx"
        />
        <div
          className="p-6 border border-dashed rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          onClick={handleBrowseClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
        >
          <CloudUpload className="mx-auto mb-2 h-8 w-8 text-blue-500" />
          {fileName ? (
            <p className="text-sm">
              Uploaded: <span className="font-medium">{fileName}</span>
            </p>
          ) : (
            <p className="font-semibold text-base">
              Drag & Drop your file here
            </p>
          )}
        </div>
        <Button
          onClick={handleBrowseClick}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400"
        >
          Browse Files
        </Button>  
      </div>

      
      {/* Table */}
      <div className="space-y-4">

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Input
            placeholder="Filter email..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("email")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border overflow-x-auto text-start">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between py-4 px-4">
            {/* Left: selected rows info */}
            <div className="text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            {/* Right: pagination buttons */}
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
