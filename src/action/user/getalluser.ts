"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";

interface GetAllUserPayload {
  // limit: number;
  // skip: number;
}

const GetAllUser = async (
  payload: GetAllUserPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    // const result = await pool.query(`SELECT * FROM tb_user LIMIT ? OFFSET ?`, [
    //   payload.limit,
    //   payload.skip,
    // ]);
    const result = await pool.query(`SELECT * FROM tb_user;`);
    const rows = result[0];

    return {
      status: true,
      data: rows,
      message: "Users data get successfully",
      functionname: "GetAllUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllUser",
    };
    return response;
  }
};

export default GetAllUser;
