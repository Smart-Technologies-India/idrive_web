"use client";
import { default as MulSelect } from "react-select";
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
import GetAllCourseAmount from "@/action/courseamount/getallcourseamount";
import GetAllAgent from "@/action/agent/getallagent";
import GetAllCourse from "@/action/course/getallcourse";
import GetAllVehicle from "@/action/vehicle/getallvehicle";
import { CreateCourseAmountSchema } from "@/schema/courseamount";
import CreateCourseAmount from "@/action/courseamount/createcourseamount";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

export default function CourseAmount() {
  const [agents, setAgents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const [agentId, setAgentId] = useState<string>("0");
  const [courseId, setCourseId] = useState<string>("0");
  const [vehicleId, setVehicleId] = useState<string>("0");

  const [createBox, setCreateBox] = useState(false);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  type CourseAmount = {
    Id: number;
    crsBaseFees: string;
    iDriveComm: number;
    agentCorpName: string;
    name: string;
    makeModel: string;
    vhclNo: string;
  };

  const [courseAmount, setCourseAmount] = useState([]);

  const columnHelper = createColumnHelper<CourseAmount>();

  const columns = useMemo<ColumnDef<CourseAmount, any>[]>(
    () => [
      {
        accessorFn: (row) => row.Id,
        header: "ID",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.crsBaseFees,
        header: "Base Fees",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.iDriveComm,
        header: "iDrive Commission",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.agentCorpName,
        header: "Agent Name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.name,
        header: "Course Name ",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.makeModel,
        header: "Vehicle Name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.vhclNo,
        header: "Vehicle Number",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data: courseAmount,
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

  const baseFeesRef = useRef<HTMLInputElement>(null);
  const idriveCommRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const response = await GetAllCourseAmount({ limit: 10, skip: 0 });

      if (response.status) {
        setCourseAmount(response.data);
      }

      const agentresponse = await GetAllAgent({});
      if (agentresponse.status) {
        setAgents(agentresponse.data);
      }

      const courseresponse = await GetAllCourse({});
      if (courseresponse.status) {
        setCourses(courseresponse.data);
      }

      const vehicleresponse = await GetAllVehicle({});
      console.log(vehicleresponse);
      if (vehicleresponse.status) {
        setVehicles(vehicleresponse.data);
      }
    };
    init();
  }, []);

  const createUser = async () => {
    const result = safeParse(CreateCourseAmountSchema, {
      agent: agentId,
      course: courseId,
      vehicle: vehicleId,
      basefess: baseFeesRef.current?.value,
      idrivecomm: idriveCommRef.current?.value,
    });

    if (result.success) {
      const response = await CreateCourseAmount({
        agent: result.output.agent,
        course: result.output.course,
        vehicle: result.output.vehicle,
        basefees: result.output.basefess,
        idrivecomm: result.output.idrivecomm,
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
        <p className="text-[#51535a] font-semibold text-lg">Course Amount</p>
        <div className="grow"></div>
        <Drawer open={createBox} onOpenChange={setCreateBox}>
          <DrawerTrigger asChild>
            <button className="bg-[#51535a] text-white text-sm py-1 px-4 rounded-lg">
              ADD
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-4/6">
              <DrawerHeader className="m-0 p-0 mb-4">
                <DrawerTitle>Course Amount</DrawerTitle>
                <DrawerDescription>
                  Enter Details to create a course amount
                </DrawerDescription>
              </DrawerHeader>

              <div>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <Label
                      htmlFor="timesolt"
                      className="block text-sm font-medium"
                    >
                      Course
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
                      options={courses.map((crs: any) => {
                        return {
                          value: crs.Id,
                          label: crs.name,
                        };
                      })}
                      className="w-full accent-slate-900 mt-1"
                      onChange={(val: any) => {
                        if (!val) return;
                        setCourseId(val.value.toString());
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="ac" className="block text-sm font-medium">
                      Agent
                    </Label>
                    <MulSelect
                      styles={{
                        menuList(base, props) {
                          return {
                            height: "120px",
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
                          label: `${agent.agentName} - [${agent.agentCorpName}]`,
                        };
                      })}
                      classNamePrefix="h-20"
                      className="w-full accent-slate-900 mt-1"
                      onChange={async (val: any) => {
                        if (!val) return;
                        setAgentId(val.value.toString());
                        console.log(val);

                        const vehicleresponse = await GetAllVehicle({});
                        if (vehicleresponse.status && vehicleresponse.data) {
                          setVehicles(
                            vehicleresponse.data.filter(
                              (vhcl: any) => vhcl.agentId == val.value
                            )
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <Label htmlFor="ac" className="block text-sm font-medium">
                      Vehicle
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
                      options={vehicles.map((vhcl: any) => {
                        return {
                          value: vhcl.Id,
                          label: `${vhcl.makeModel} - [${vhcl.vhclNo}]`,
                        };
                      })}
                      className="w-full accent-slate-900 mt-1"
                      onChange={(val: any) => {
                        if (!val) return;
                        setVehicleId(val.value.toString());
                      }}
                      isDisabled={agentId == "0"}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <Label
                      htmlFor="basefees"
                      className="block text-sm font-medium"
                    >
                      Base Fees
                    </Label>
                    <Input
                      type="text"
                      id="basefees"
                      ref={baseFeesRef}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="idrivecomm"
                      className="block text-sm font-medium"
                    >
                      IDrive Commission
                    </Label>
                    <Input
                      type="text"
                      id="idrivecomm"
                      ref={idriveCommRef}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <DrawerFooter className="m-0 p-0 my-4">
                <div className="flex gap-4">
                  <Button onClick={createUser} className="flex-1">
                    Create
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
              <div className="h-20"></div>
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
      </div>
    </div>
  );
}
