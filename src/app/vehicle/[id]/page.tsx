"use client";
import GetVehicle from "@/action/vehicle/getvehicle";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { default as MulSelect } from "react-select";
import GetAllAgent from "@/action/agent/getallagent";
import GetAllCourse from "@/action/course/getallcourse";
import { toast } from "react-toastify";
import AddTimeSlot from "@/action/vehicle/addvehicleslot";
import { Button } from "@/components/ui/button";
import TimeslotExist from "@/action/vehicle/timeslotexist";
import { useRouter } from "next/navigation";

interface TimeSlotPayload {
  id: string;
  dayName: string;
  time: string;
}

interface SelectedDay {
  label: string;
  value: string;
}

const TimeSlotView = () => {
  const router = useRouter();
  const [isLoading, setLoding] = useState<boolean>(true);
  const params: any = useParams<{ tag: string; item: string }>();

  const id: string = params.id.toString();

  // const [agents, setAgents] = useState<any[]>([]);
  // const [courses, setCourses] = useState<any[]>([]);

  // const [agentId, setAgentId] = useState<string>("0");
  // const [courseId, setCourseId] = useState<string>("0");

  const [vehicle, setVehicle] = useState<any>();

  const [isTimeSlotExist, setIsTimeSlotExist] = useState<boolean>(false);
  const [timeSlotExist, setTimeSlotExist] = useState<TimeSlotPayload[]>([]);

  useEffect(() => {
    const init = async () => {
      setLoding(true);
      const response = await GetVehicle({ id: id });
      if (response.status) {
        setVehicle(response.data[0]);
        console.log(response.data[0]);

        const isExistResponse = await TimeslotExist({
          vehicleId: response.data[0].Id.toString(),
        });

        if (isExistResponse.status) {
          setIsTimeSlotExist(isExistResponse.data?.length! > 0);

          if (isExistResponse.data?.length! > 0) {
            let datatoadd: TimeSlotPayload[] = [];

            const dayname = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ];

            for (let i = 0; i < isExistResponse.data?.length!; i++) {
              const id = isExistResponse.data![i].weekDayNo;
              const dayName = dayname[isExistResponse.data![i].weekDayNo];
              const fromTime = isExistResponse
                .data![i].fromTime.toString()
                .slice(0, 5);
              const toTime = isExistResponse
                .data![i].toTime.toString()
                .slice(0, 5);

              datatoadd.push({
                id: id.toString(),
                dayName,
                time: `${fromTime} - ${toTime}`,
              });
            }

            setTimeSlotExist(datatoadd);
          }
        }
      }

      // const agentresponse = await GetAllAgent({});
      // if (agentresponse.status) {
      //   setAgents(agentresponse.data);
      // }

      // const courseresponse = await GetAllCourse({});
      // if (courseresponse.status) {
      //   setCourses(courseresponse.data);
      // }

      setLoding(false);
    };
    init();
  }, []);

  const [day, setDay] = useState<SelectedDay[]>([]);

  const [timeslot, setTimeSlot] = useState<TimeSlotPayload[]>([]);

  const generateTimeSlots = (
    start: number,
    end: number,
    interval: number
  ): string[] => {
    const slots: string[] = [];
    let currentTime = start;

    while (currentTime < end) {
      const hours = Math.floor(currentTime);
      const minutes = (currentTime % 1) * 60;
      const endTime = currentTime + interval;
      const endHours = Math.floor(endTime);
      const endMinutes = (endTime % 1) * 60;

      slots.push(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")} - ${endHours
          .toString()
          .padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`
      );

      currentTime += interval;
    }

    return slots;
  };

  const timeSlots30 = generateTimeSlots(7, 21, 0.5);
  const timeSlots = generateTimeSlots(7, 21, 1);

  const isSelected = (id: string, dayName: string, time: string): boolean => {
    return timeslot.some(
      (item) => item.id == id && item.dayName == dayName && item.time == time
    );
  };

  const isSelectedSecond = (
    id: string,
    dayName: string,
    time: string
  ): boolean => {
    const value: boolean = timeSlotExist.some(
      (item) => item.id == id && item.dayName == dayName && item.time == time
    );
    console.log(value);
    return value;
  };

  const handleSlotClick = (id: string, dayName: string, time: string) => {
    if (isSelected(id, dayName, time)) {
      setTimeSlot(
        timeslot.filter(
          (item) =>
            !(item.id == id && item.dayName == dayName && item.time === time)
        )
      );
    } else {
      setTimeSlot([
        ...timeslot,
        {
          id: id,
          dayName: dayName,
          time: time,
        },
      ]);
    }
  };

  const addslot = async () => {
    // if (id == null || id == undefined || id == "" || id == "0") {
    //   toast.error("Select the vehicle");
    // } else if (
    //   agentId == null ||
    //   agentId == undefined ||
    //   agentId == "" ||
    //   agentId == "0"
    // ) {
    //   toast.error("Select Agent Id");
    // } else if (
    //   courseId == null ||
    //   courseId == undefined ||
    //   courseId == "" ||
    //   courseId == "0"
    // ) {
    //   toast.error("Select course Id");
    // } else

    if (timeslot.length == 0) {
      toast.error("Select Atleast one time");
    } else {
      const response = await AddTimeSlot({
        courseId: "1",
        vehicalId: id,
        agentid: vehicle.agentId.toString(),
        slot: timeslot,
      });

      if (response.status) {
        toast.success(response.message);
        router.back();
      } else {
        toast.error(response.message);
      }
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full grid place-items-center text-3xl text-gray-600 bg-gray-200">
        Loading...
      </div>
    );

  return (
    <>
      <main className="p-4">
        <div className="flex gap-4">
          <div className="bg-white shadow p-2 rounded-md flex-1">
            <p className="text-lg">Details</p>
            <div className="flex gap-4 flex-wrap mt-2">
              <DetailsCard name="Name" value={vehicle.makeModel} />
              <DetailsCard name="Agent Name" value={vehicle.agentName} />
              <DetailsCard name="Category" value={vehicle.category} />
              <DetailsCard name="Number" value={vehicle.vhclNo} />
              <DetailsCard
                name="Time Slot"
                value={vehicle.timeSlot == 0 ? "30 min" : "60 min"}
              />
              <DetailsCard
                name="Ac/Non Ac"
                value={vehicle.acNonAc == 0 ? "Non Ac" : "Ac"}
              />
              <DetailsCard
                name="Transmission"
                value={
                  vehicle.transmission == 0
                    ? "NA"
                    : vehicle.transmission == 1
                    ? "Manual"
                    : "Automatic"
                }
              />

              <DetailsCard
                name="Already Created"
                value={isTimeSlotExist ? "Yes" : "NO"}
              />
            </div>
          </div>

          {isTimeSlotExist == false && (
            <div className="bg-white px-4 py-2 mt-2 shadow rounded flex-1">
              <Label htmlFor="timesolt" className="block text-sm font-medium">
                Select Days
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
                isMulti={true}
                options={[
                  {
                    value: "0",
                    label: "Monday",
                  },
                  {
                    value: "1",
                    label: "Tuesday",
                  },
                  {
                    value: "2",
                    label: "Wednesday",
                  },
                  {
                    value: "3",
                    label: "Thursday",
                  },
                  {
                    value: "4",
                    label: "Friday",
                  },
                  {
                    value: "5",
                    label: "Saturday",
                  },
                  {
                    value: "6",
                    label: "Sunday",
                  },
                ]}
                className="w-full accent-slate-900  mt-1"
                onChange={(val: any) => {
                  if (!val) return;
                  setDay(val);
                }}
              />

              {/* <Label
                htmlFor="timesolt"
                className="block text-sm font-medium mt-4"
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

              <Label htmlFor="ac" className="block text-sm font-medium  mt-4">
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
                    label: agent.agentName,
                  };
                })}
                classNamePrefix="h-20"
                className="w-full accent-slate-900 mt-1"
                onChange={(val: any) => {
                  if (!val) return;
                  setAgentId(val.value.toString());
                }}
              /> */}
              <Button className="w-full mt-2" onClick={addslot}>
                CREATE
              </Button>
            </div>
          )}
        </div>

        {day.map((value: SelectedDay, index: number) => {
          return (
            <div key={index} className="shadow px-2 py-2 rounded mt-2 bg-white">
              <h1 className="text-lg">{value.label}</h1>
              <div className="flex gap-2 mt-2 flex-wrap">
                {(vehicle.timeSlot == 1 ? timeSlots : timeSlots30).map(
                  (slot, index) => (
                    <p
                      onClick={() => {
                        handleSlotClick(value.value, value.label, slot);
                      }}
                      key={index}
                      className={`px-2 py-1 rounded min-w-28 cursor-pointer ${
                        isSelected(value.value, value.label, slot)
                          ? "bg-green-500 bg-opacity-30"
                          : "bg-gray-100"
                      }`}
                    >
                      {slot}
                    </p>
                  )
                )}
              </div>
            </div>
          );
        })}

        {isTimeSlotExist &&
          [
            {
              value: "0",
              label: "Monday",
            },
            {
              value: "1",
              label: "Tuesday",
            },
            {
              value: "2",
              label: "Wednesday",
            },
            {
              value: "3",
              label: "Thursday",
            },
            {
              value: "4",
              label: "Friday",
            },
            {
              value: "5",
              label: "Saturday",
            },
            {
              value: "6",
              label: "Sunday",
            },
          ].map((value: SelectedDay, index: number) => {
            return (
              <div
                key={index}
                className="shadow px-2 py-2 rounded mt-2 bg-white"
              >
                <h1 className="text-lg">{value.label}</h1>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {(vehicle.timeSlot == 1 ? timeSlots : timeSlots30).map(
                    (slot, index) => (
                      <p
                        key={index}
                        className={`px-2 py-1 rounded min-w-28 ${
                          isSelectedSecond(value.value, value.label, slot)
                            ? "bg-green-500 bg-opacity-30"
                            : "bg-gray-100"
                        }`}
                      >
                        {slot}
                      </p>
                    )
                  )}
                </div>
              </div>
            );
          })}
      </main>
    </>
  );
};

export default TimeSlotView;
interface DetailsCardPayload {
  name: string;
  value: string;
}
const DetailsCard = (props: DetailsCardPayload) => {
  return (
    <div className="bg-gray-100 px-2 py-1 rounded min-w-28">
      <h1 className="text-sm">{props.name}</h1>
      <p className="text-sm font-medium">{props.value}</p>
    </div>
  );
};
