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
  MaterialSymbolsKeyboardArrowDownRounded,
  MaterialSymbolsKeyboardArrowUpRounded,
} from "@/components/icons";

import { safeParse } from "valibot";
import { CreateUserSchema } from "@/schema/user";
import { toast } from "react-toastify";
import CreateUser from "@/action/user/createuser";
import GetAllAgent from "@/action/agent/getallagent";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

export default function Home() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  type Agent = {
    Id: number;
    agentName: string;
    directContact: number;
    rtoCode: number;
    rtoName: number;
  };

  const [agent, setAgent] = useState([]);

  const columnHelper = createColumnHelper<Agent>();

  const columns = useMemo<ColumnDef<Agent, any>[]>(
    () => [
      {
        accessorFn: (row) => row.Id,
        header: "ID",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.agentName,
        header: "Name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.directContact,
        header: "Contact",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.rtoCode,
        header: "Rto Code",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.rtoName,
        header: "Rto Name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data: agent,
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

  useEffect(() => {
    const init = async () => {
      const response = await GetAllAgent({ limit: 10, skip: 0 });

      if (response.status) {
        setAgent(response.data);
        console.log(response.data);
      }
    };
    init();
  }, []);

  return (
    <div className="p-4 ">
      <div className="bg-[#fefaee] py-1 px-1 pl-4 shadow rounded-lg flex">
        <p className="text-[#51535a] font-semibold text-lg">Agents</p>
        <div className="grow"></div>
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
      </div>
    </div>
  );
}
