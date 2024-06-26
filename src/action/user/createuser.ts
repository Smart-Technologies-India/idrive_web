"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";
import { ResultSetHeader } from "mysql2";

interface CreateUserPayload {
  name: string;
  contact: string;
  email: string;
}

const CreateUser = async (
  payload: CreateUserPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO tb_user (username, contact, email) VALUES (?, ?, ?)`,
      [payload.name, payload.contact, payload.email]
    );

    const insertedId = result.insertId;
    console.log(insertedId);
    return {
      status: true,
      data: insertedId,
      message: "Users data get successfully",
      functionname: "CreateUser",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "CreateUser",
    };
    return response;
  }
};

export default CreateUser;
