"use client";

import GetAllUser from "@/action/user/getalluser";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  createColumnHelper,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  RowData,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CharmChevronLeft,
  CharmChevronRight,
  MaterialSymbolsKeyboardArrowDownRounded,
  MaterialSymbolsKeyboardArrowUpRounded,
  MaterialSymbolsKeyboardDoubleArrowLeft,
  MaterialSymbolsKeyboardDoubleArrowRight,
} from "@/components/icons";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeParse } from "valibot";
import { CreateUserSchema } from "@/schema/user";
import { toast } from "react-toastify";
import CreateUser from "@/action/user/createuser";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

export default function Home() {
  const [createBox, setCreateBox] = useState(false);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  type User = {
    Id: number;
    username: string;
    walletBalance: number;
    pic_url: string;
    email: string;
    contact: string;
    dob?: string;
  };

  const [user, setUser] = useState([]);

  const columnHelper = createColumnHelper<User>();

  const columns = useMemo<ColumnDef<User, any>[]>(
    () => [
      {
        accessorFn: (row) => row.Id,
        header: "ID",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.username,
        header: "Name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.walletBalance,
        header: "Wallet Balance",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.email,
        header: "Email",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.contact,
        header: "Contact",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data: user,
    columns,
    filterFns: {},
    state: {
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    manualPagination: true,
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const response = await GetAllUser({ limit: 10, skip: 0 });

      console.log(response.data);
      if (response.status) {
        setUser(response.data);
        console.log(response.data);
      }
    };
    init();
  }, []);

  const createUser = async () => {
    const result = safeParse(CreateUserSchema, {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      contact: contactRef.current?.value,
    });

    if (result.success) {
      const response = await CreateUser({
        name: result.output.name,
        email: result.output.email,
        contact: result.output.contact,
      });

      if (response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } else {
      let errorMessage = "";
      errorMessage = result.issues[0].message;
      toast.error(errorMessage);
    }
    setCreateBox(false);
  };

  return (
    <div className="p-4 ">
      <div className="bg-[#fefaee] py-1 px-1 pl-4 shadow rounded-lg flex">
        <p className="text-[#51535a] font-semibold text-lg">Users</p>
        <div className="grow"></div>
        <Drawer open={createBox} onOpenChange={setCreateBox}>
          <DrawerTrigger asChild>
            <button className="bg-[#51535a] text-white text-sm py-1 px-4 rounded-lg">
              ADD
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-96">
              <DrawerHeader className="m-0 p-0 mb-4">
                <DrawerTitle>User</DrawerTitle>
                <DrawerDescription>
                  Enter Details to create a new user
                </DrawerDescription>
              </DrawerHeader>

              <div>
                <Label htmlFor="name" className="block text-sm font-medium">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  ref={nameRef}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />

                <Label htmlFor="email" className="block text-sm font-medium">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  ref={emailRef}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />

                <Label htmlFor="contact" className="block text-sm font-medium">
                  Contact
                </Label>
                <Input
                  type="text"
                  id="contact"
                  ref={contactRef}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <DrawerFooter className="m-0 p-0 my-4">
                <Button onClick={createUser}>Create</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="bg-white p-4 shadow rounded-lg  mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <MaterialSymbolsKeyboardArrowUpRounded className="text-2xl mt-1" />
                            ),
                            desc: (
                              <MaterialSymbolsKeyboardArrowDownRounded className="text-2xl mt-1" />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </>
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
        {/* <div className="flex items-center gap-2 px-4 my-2">
          <button
            className="border rounded p-1 cursor-pointer"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <MaterialSymbolsKeyboardDoubleArrowLeft />
          </button>
          <button
            className="border rounded p-1  cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <CharmChevronLeft />
          </button>
          <button
            className="border rounded p-1  cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <CharmChevronRight />
          </button>
          <button
            className="border rounded p-1  cursor-pointer"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <MaterialSymbolsKeyboardDoubleArrowRight />
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <p>
            | Showing {table.getRowModel().rows.length.toLocaleString()} of 20
          </p>
          <div className="grow"></div>
          <span className="flex items-center gap-1">
            Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            className="border p-1 rounded"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div> */}
      </div>
    </div>
  );
}
