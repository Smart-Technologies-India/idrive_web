"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";

interface GetAllCoursePayload {}

const GetAllCourse = async (
  payload: GetAllCoursePayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const result = await pool.query(`SELECT * FROM tb_crs;`);
    const rows = result[0];

    return {
      status: true,
      data: rows,
      message: "Course data get successfully",
      functionname: "GetAllCourse",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllCourse",
    };
    return response;
  }
};

export default GetAllCourse;
