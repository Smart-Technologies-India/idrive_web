"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";
import { ResultSetHeader } from "mysql2";

interface CreateCourseAmountPayload {
  agent: string;
  course: string;
  vehicle: string;
  basefees: string;
  idrivecomm: string;
}

const CreateCourseAmount = async (
  payload: CreateCourseAmountPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    console.log(payload);
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO tb_crs_amnt ( agentId, courseId, vehicleId, baseFee, iDriveCharge ) VALUES (?, ?, ?, ?, ?)`,
      [
        payload.agent,
        payload.course,
        payload.vehicle,
        payload.basefees,
        payload.idrivecomm,
      ]
    );

    const insertedId = result.insertId;
    console.log(insertedId);
    return {
      status: true,
      data: insertedId,
      message: "Course Amount data get successfully",
      functionname: "CreateCourseAmount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateCourseAmount",
    };
    return response;
  }
};

export default CreateCourseAmount;
