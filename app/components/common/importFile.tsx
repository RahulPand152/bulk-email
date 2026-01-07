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
    <div className="    rounded-xl p-4 sm:p-6 text-center space-y-4 ">
      {/* File Upload Header */}
      <div className="rounded-xl p-4 sm:p-6  space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ">
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
          className="p-6 border border-dashed  shadow-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

        <div className="rounded-md shadow-lg overflow-x-auto text-start bg-background">
          <Table className="border-0 border-collapse [&_thead_tr]:border-b-0 [&_tbody_tr]:border-b-0 [&_tr]:border-0 [&_th]:border-0 [&_td]:border-0 divide-y-0 shadow-md">
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
            <div className="text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

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
      {/* <Button
        className="mt-4 bg-blue-500 hover:bg-blue-400"
        onClick={async () => {
          const selectedContacts = getSelectedContacts();

          if (selectedContacts.length === 0) {
            alert("Please select at least one contact");
            return;
          }

          try {
            const response = await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                recipients: selectedContacts.map((c) => ({
                  firstName: c.firstName,
                  lastName: c.lastName,
                  email: c.email,
                  template: "marketing",
                })),
              }),
            });

            const result = await response.json();
            console.log(result);
            alert(
              `Emails sent: ${
                result.logs.filter((l: any) => l.status === "SENT").length
              }`
            );
          } catch (err) {
            console.error(err);
            alert("Failed to send emails");
          }
        }}
      >
        Send Emails
      </Button> */}
    </div>
  );
}
