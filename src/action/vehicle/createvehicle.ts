"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";
import { ResultSetHeader } from "mysql2";

interface CreateVehiclePayload {
  name: string;
  number: string;
  category: string;
  agent: string;
  year: string;
  ac: string;
  timeslot: string;
  transmission: string;
}

const CreateVehicle = async (
  payload: CreateVehiclePayload
): Promise<ApiResponseType<any | null>> => {
  try {
    console.log(payload);
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO tb_vhcl ( agentId, category, makeModel, vhclNo, timeSlot, transmission, acNonAc, year ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.agent,
        payload.category,
        payload.name,
        payload.number,
        payload.timeslot,
        payload.transmission,
        payload.ac,
        payload.year,
      ]
    );

    const insertedId = result.insertId;
    console.log(insertedId);
    return {
      status: true,
      data: insertedId,
      message: "Vehicle data get successfully",
      functionname: "CreateVehicle",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateVehicle",
    };
    return response;
  }
};

export default CreateVehicle;
