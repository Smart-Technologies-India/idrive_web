"use client";

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

import { default as MulSelect } from "react-select";

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
import { toast } from "react-toastify";
import GetAllVehicle from "@/action/vehicle/getallvehicle";
import GetAllAgent from "@/action/agent/getallagent";
import { CreateVehicleSchema } from "@/schema/vehicle";
import CreateVehicle from "@/action/vehicle/createvehicle";
import Link from "next/link";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

export default function Home() {
  const [agents, setAgents] = useState([]);
  const [createBox, setCreateBox] = useState(false);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  type Vehicle = {
    Id: number;
    agentName: string;
    category: string;
    makeModel: string;
    vhclNo: string;
    timeSlot: string;
    year: string;
    transmission: string;
    acNonAc: string;
    timesolt: null;
  };

  const [vehicle, setVehicle] = useState([]);

  const columnHelper = createColumnHelper<Vehicle>();

  const columns = useMemo<ColumnDef<Vehicle, any>[]>(
    () => [
      {
        accessorFn: (row) => row.Id,
        header: "ID",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.agentName,
        header: "Agent Name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.category,
        header: "Category",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.makeModel,
        header: "Vehicle Model",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.vhclNo,
        header: "Vehicle Number",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.timeSlot,
        header: "Time Slot",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.year,
        header: "Year",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.acNonAc,
        header: "Ac",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.transmission,
        header: "Transmission",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.timesolt,
        header: "Add Time Slot",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data: vehicle,
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
  const numberRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const [agentId, setAgentId] = useState<string>("0");
  const [category, setCategory] = useState<string>("0");
  const [ac, setAc] = useState<string>("0");
  const [timeSolt, setTimeSlot] = useState<string>("0");
  const [transmission, setTransmission] = useState<string>("0");

  useEffect(() => {
    const init = async () => {
      const response = await GetAllVehicle({ limit: 10, skip: 0 });

      if (response.status) {
        setVehicle(response.data);
      }

      const responseAgent = await GetAllAgent({});

      if (responseAgent.status) {
        console.log(responseAgent.data);
        setAgents(responseAgent.data);
      }
    };
    init();
  }, []);

  const createUser = async () => {
    const result = safeParse(CreateVehicleSchema, {
      name: nameRef.current?.value,
      number: numberRef.current?.value,
      category: category.toString(),
      agent: agentId.toString(),
      year: yearRef.current?.value,
      ac: ac.toString(),
      timeslot: timeSolt.toString(),
      transmission: transmission.toString(),
    });

    if (result.success) {
      const response = await CreateVehicle({
        name: result.output.name,
        number: result.output.number,
        category: result.output.category,
        agent: result.output.agent,
        year: result.output.year,
        ac: result.output.ac,
        timeslot: result.output.timeslot,
        transmission: result.output.transmission,
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
        <p className="text-[#51535a] font-semibold text-lg">Vehicles</p>
        <div className="grow"></div>
        <Drawer open={createBox} onOpenChange={setCreateBox}>
          <DrawerTrigger asChild>
            <button className="bg-[#51535a] text-white text-sm py-1 px-4 rounded-lg">
              ADD
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-6/12">
              <DrawerHeader className="m-0 p-0 mb-4">
                <DrawerTitle>Vehicle</DrawerTitle>
                <DrawerDescription>
                  Enter Details to create a new Vehicle
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="name" className="block text-sm font-medium">
                    Agent
                  </Label>
                  <MulSelect
                    styles={{
                      menuList(base, props) {
                        return {
                          height: "150px",
                          overflowY: "scroll",
                          boxShadow: "0 0 2px rgba(0,0,0,0.4)",
                          borderRadius: "6px",
                          marginTop: "4px",
                          position: "absolute",
                          zIndex: "20",
                          background: "#fff",
                          width: "100%",
                        };
                      },
                    }}
                    isMulti={false}
                    options={agents.map((agent: any) => {
                      return {
                        value: agent.Id,
                        label: agent.agentName,
                      };
                    })}
                    className="w-full accent-slate-900 mt-1"
                    onChange={(val: any) => {
                      if (!val) return;
                      setAgentId(val.value);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="name" className="block text-sm font-medium">
                    Category
                  </Label>
                  <MulSelect
                    styles={{
                      menuList(base, props) {
                        return {
                          height: "150px",
                          overflowY: "scroll",
                          boxShadow: "0 0 2px rgba(0,0,0,0.4)",
                          borderRadius: "6px",
                          marginTop: "4px",
                          position: "absolute",
                          zIndex: "20",
                          background: "#fff",
                          width: "100%",
                        };
                      },
                    }}
                    isMulti={false}
                    options={[
                      {
                        value: "Sedan",
                        label: "Sedan",
                      },
                      {
                        value: "SUV",
                        label: "SUV",
                      },
                      {
                        value: "Hatchback",
                        label: "Hatchback",
                      },
                      {
                        value: "bike",
                        label: "Motorcycle",
                      },
                      {
                        value: "truck",
                        label: "Heavy",
                      },
                      {
                        value: "commercial",
                        label: "Commercial",
                      },
                      {
                        value: "auto",
                        label: "Auto Rickshaw",
                      },
                      {
                        value: "scooter",
                        label: "Scooter",
                      },
                    ]}
                    className="w-full accent-slate-900 mt-1"
                    onChange={(val: any) => {
                      if (!val) return;
                      setCategory(val.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex-1">
                  <Label htmlFor="name" className="block text-sm font-medium">
                    vehicle Model
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    ref={nameRef}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="number" className="block text-sm font-medium">
                    vehicle Number
                  </Label>
                  <Input
                    type="text"
                    id="number"
                    ref={numberRef}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex-1">
                  <Label
                    htmlFor="timesolt"
                    className="block text-sm font-medium"
                  >
                    Transmission
                  </Label>
                  <MulSelect
                    styles={{
                      menuList(base, props) {
                        return {
                          height: "150px",
                          overflowY: "scroll",
                          boxShadow: "0 0 2px rgba(0,0,0,0.4)",
                          borderRadius: "6px",
                          marginTop: "4px",
                          position: "absolute",
                          zIndex: "20",
                          background: "#fff",
                          width: "100%",
                        };
                      },
                    }}
                    isMulti={false}
                    options={[
                      {
                        value: "0",
                        label: "NA",
                      },
                      {
                        value: "1",
                        label: "Manual",
                      },
                      {
                        value: "2",
                        label: "Automatic",
                      },
                    ]}
                    className="w-full accent-slate-900 mt-1"
                    onChange={(val: any) => {
                      if (!val) return;
                      setTransmission(val.value);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="ac" className="block text-sm font-medium">
                    Ac/Non Ac
                  </Label>
                  <MulSelect
                    styles={{
                      menuList(base, props) {
                        return {
                          height: "150px",
                          overflowY: "scroll",
                          boxShadow: "0 0 2px rgba(0,0,0,0.4)",
                          borderRadius: "6px",
                          marginTop: "4px",
                          position: "absolute",
                          zIndex: "20",
                          background: "#fff",
                          width: "100%",
                        };
                      },
                    }}
                    isMulti={false}
                    options={[
                      {
                        value: "0",
                        label: "Non AC",
                      },
                      {
                        value: "1",
                        label: "AC",
                      },
                    ]}
                    className="w-full accent-slate-900 mt-1"
                    onChange={(val: any) => {
                      if (!val) return;
                      setAc(val.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex-1">
                  <Label
                    htmlFor="timesolt"
                    className="block text-sm font-medium"
                  >
                    Time Slot
                  </Label>
                  <MulSelect
                    styles={{
                      menuList(base, props) {
                        return {
                          height: "150px",
                          overflowY: "scroll",
                          boxShadow: "0 0 2px rgba(0,0,0,0.4)",
                          borderRadius: "6px",
                          marginTop: "4px",
                          position: "absolute",
                          zIndex: "20",
                          background: "#fff",
                          width: "100%",
                        };
                      },
                    }}
                    isMulti={false}
                    options={[
                      {
                        value: "0",
                        label: "30 Min",
                      },
                      {
                        value: "1",
                        label: "60 Min",
                      },
                    ]}
                    className="w-full accent-slate-900  mt-1"
                    onChange={(val: any) => {
                      if (!val) return;
                      setTimeSlot(val.value);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="year" className="block text-sm font-medium">
                    Year
                  </Label>
                  <Input
                    type="text"
                    id="year"
                    ref={yearRef}
                    className="mt-1 h-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <DrawerFooter className="m-0 p-0 my-4">
                <div className="flex gap-4">
                  <Button className="flex-1" onClick={createUser}>
                    Create
                  </Button>
                  <DrawerClose asChild className="flex-1">
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </div>
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
                  <TableHead key={header.id} className="whitespace-nowrap">
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
                    {cell.column.id == "Add Time Slot" ? (
                      <Link
                        className="text-sm text-gray-600 border border-black px-2 py-1 hover:text-white hover:bg-black"
                        href={`/vehicle/${row.original.Id}`}
                      >
                        Add Slot
                      </Link>
                    ) : cell.column.id == "Time Slot" ? (
                      cell.getValue() === 0 ? (
                        "30 min"
                      ) : (
                        "60 min"
                      )
                    ) : cell.column.id == "Ac" ? (
                      cell.getValue() === 0 ? (
                        "Non Ac"
                      ) : (
                        "Ac"
                      )
                    ) : cell.column.id == "Transmission" ? (
                      cell.getValue() == 0 ? (
                        "NA"
                      ) : cell.getValue() == 1 ? (
                        "Manual"
                      ) : (
                        "Automatic"
                      )
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
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
