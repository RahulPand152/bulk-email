"use client";

import { useState, useRef, useEffect } from "react";

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
import { Checkbox } from "@/components/ui/checkbox";

// Type for table data
export type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  selected?: boolean;
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
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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

export default function FileUploadAndTable({
  onSelectedContactsChange,
}: {
  onSelectedContactsChange?: (contacts: Contact[]) => void;
} = {}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [data, setData] = useState<Contact[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("contacts_csv");
    const savedFileName = localStorage.getItem("contacts_file_name");

    if (savedData) {
      setData(JSON.parse(savedData));
    }

    if (savedFileName) {
      setFileName(savedFileName);
    }
  }, []);

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
    enableRowSelection: true,
  });

  // Get selected contacts
  const getSelectedContacts = () => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  };

  // Handle file upload (CSV/XLSX)
  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());

    const sheet = workbook.worksheets[0];
    const rows = sheet.getSheetValues().slice(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    localStorage.setItem("contacts_csv", JSON.stringify(jsonData));
    localStorage.setItem("contacts_file_name", file.name);
  };

  // Notify parent and save to localStorage when selection changes
  useEffect(() => {
    const selectedContacts = getSelectedContacts();
    const recipients = selectedContacts.map((c) => ({
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName,
    }));
    if (typeof window !== "undefined") {
      localStorage.setItem("email_recipients", JSON.stringify(recipients));
    }
    onSelectedContactsChange?.(selectedContacts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getSelectedRowModel().rows.length]);

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
    <div className="w-full max-w-full  sm:max-w-7xl mx-auto px-2 sm:px-6 py-4 space-y-6 dark:bg-gray-800">
      {/* Upload Section */}
      <div className="rounded-xl p-4 sm:p-6 space-y-4 shadow-sm w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-semibold text-base sm:text-lg">
              Import Contacts
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Upload a CSV or Excel file to define your recipient list
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={downloadTemplate}
            className="p-0 h-auto flex items-center gap-1 self-start sm:self-auto hover:bg-transparent"
          >
            <Download className="h-4 w-4 text-blue-500" />
            <span className="text-xs sm:text-sm text-blue-500">
              Download Sample Template
            </span>
          </Button>
        </div>

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept=".csv,.xlsx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />

        <div
          className="p-6 sm:p-8 min-h-[150px] sm:min-h-[180px]
                 border border-dashed rounded-md cursor-pointer
                 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
            <p className="text-sm text-center">
              Uploaded: <span className="font-medium">{fileName}</span>
            </p>
          ) : (
            <p className="text-base font-medium text-center">
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

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
        <Input
          placeholder="Filter email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          className="w-full sm:max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
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
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md shadow-lg overflow-x-auto bg-background w-full bg-gray-800">
        <Table className="min-w-[720px] sm:min-w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4 px-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </p>

          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
