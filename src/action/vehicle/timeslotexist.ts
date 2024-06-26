"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";
import { RowDataPacket } from "mysql2";

interface TimeslotExistPayload {
  vehicleId: string;
}

const TimeslotExist = async (
  payload: TimeslotExistPayload
): Promise<ApiResponseType<any[] | null>> => {
  try {
    const result = await pool.query<RowDataPacket[]>(
      `SELECT * FROM tb_master_slot WHERE vehicleId = ?;`,
      [payload.vehicleId]
    );

    const rows = result[0];

    return {
      status: true,
      data: rows,
      message: "Master Slot data get successfully",
      functionname: "TimeslotExist",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "TimeslotExist",
    };
    return response;
  }
};

export default TimeslotExist;
