"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";
import { ResultSetHeader } from "mysql2";

interface TimeSlot {
  id: string;
  dayName: string;
  time: string;
}

interface AddTimeSlotPayload {
  slot: TimeSlot[];
  vehicalId: string;
  agentid: string;
  courseId: string;
}

const AddTimeSlot = async (
  payload: AddTimeSlotPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    // for (let i = 0; i < payload.slot.length; i++) {
    //   await pool.query<ResultSetHeader>(
    //     "INSERT INTO tb_master_slot (agentId, vehicleId, courseId, weekDayNo, fromTime, toTime, slotStatus);",
    //     [
    //       payload.agentid,
    //       payload.vehicalId,
    //       payload.courseId,
    //       payload.slot[i].id,
    //       payload.slot[i].time.toString().split(" ")[0],
    //       payload.slot[i].time.toString().split(" ")[2],
    //       1,
    //     ]
    //   );
    // }

    const values = payload.slot.map((slot) => {
      const [fromTime, , toTime] = slot.time.split(" ");
      return [
        payload.agentid,
        payload.vehicalId,
        payload.courseId,
        slot.id,
        fromTime,
        toTime,
        1,
      ];
    });

    const query = `
          INSERT INTO tb_master_slot (agentId, vehicleId, courseId, weekDayNo, fromTime, toTime, slotStatus)
          VALUES ?
        `;

    await pool.query<ResultSetHeader>(query, [values]);

    return {
      status: true,
      data: null,
      message: "Time Slot data added successfully",
      functionname: "AddTimeSlot",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "AddTimeSlot",
    };
    return response;
  }
};

export default AddTimeSlot;
